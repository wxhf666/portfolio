import { NextResponse } from "next/server";
import type { ChatRequest } from "@/lib/types";
import { buildSystemPrompt } from "@/content/agent-prompt";

// 简单内存限流
const RATE_LIMIT = new Map<string, number>();
const RATE_WINDOW = 2_000; // 2 秒

export async function POST(request: Request) {
  try {
    // --- 限流 ---
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const lastRequest = RATE_LIMIT.get(ip) || 0;
    if (now - lastRequest < RATE_WINDOW) {
      // 返回普通 JSON + 429，前端识别后可以重试
      return NextResponse.json(
        { error: "发送过快，请稍候…" },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((RATE_WINDOW - (now - lastRequest)) / 1000)) },
        }
      );
    }
    RATE_LIMIT.set(ip, now);

    // --- 校验 API Key ---
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: "主人还没配置 AI 问答功能，请稍后再试" })}\n\n`
            )
          );
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const body: ChatRequest = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
    }

    // 校验每条消息的格式
    for (const msg of messages) {
      if (!msg.role || !["user", "assistant"].includes(msg.role)) {
        return NextResponse.json({ error: "消息格式不正确" }, { status: 400 });
      }
      if (typeof msg.content !== "string") {
        return NextResponse.json({ error: "消息内容必须为字符串" }, { status: 400 });
      }
    }

    // --- 构建完整消息列表 ---
    const systemPrompt = buildSystemPrompt();
    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // --- 调用 DeepSeek API（流式） ---
    const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: fullMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text().catch(() => "");
      console.error("[Chat API] DeepSeek error:", deepseekResponse.status, errorText);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: "AI 服务暂时不可用，请稍后再试" })}\n\n`
            )
          );
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // --- 转换 DeepSeek SSE → 我们的 SSE 格式 ---
    const encoder = new TextEncoder();
    const transformStream = new ReadableStream({
      async start(controller) {
        const reader = deepseekResponse.body?.getReader();
        if (!reader) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: "无法连接到 AI 服务" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                );
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "token", content })}\n\n`
                    )
                  );
                }
              } catch {
                // 跳过无法解析的 chunk
              }
            }
          }

          // 流结束但没收到 [DONE]
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        } catch (err) {
          console.error("[Chat API] Stream error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: "响应中断，请重试" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(transformStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[Chat API] Unexpected error:", err);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
