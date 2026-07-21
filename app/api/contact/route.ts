import { NextResponse } from "next/server";
import type { ContactFormData } from "@/lib/types";

// 简单的内存限流（生产环境建议用 Redis）
const RATE_LIMIT = new Map<string, number>();

export async function POST(request: Request) {
  try {
    // 基础限流：每个 IP 每分钟最多 3 次
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const lastRequest = RATE_LIMIT.get(ip) || 0;
    if (now - lastRequest < 20000) {
      // 20 秒内只能发一次
      return NextResponse.json(
        { error: "发送过于频繁，请稍后再试" },
        { status: 429 }
      );
    }
    RATE_LIMIT.set(ip, now);

    // 解析请求体
    const body: ContactFormData = await request.json();

    // 校验
    const { name, email, subject, message } = body;
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "所有字段均为必填" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "邮箱格式不正确" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "消息内容过长" },
        { status: 400 }
      );
    }

    // ===== 在这里集成邮件服务 =====
    // 示例：使用 Resend / SendGrid / Nodemailer
    // await sendEmail({ to: "hello@example.com", subject, body: message });
    // ===== 或打印到控制台 =====
    console.log("[联系表单]", {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim().slice(0, 200),
    });

    return NextResponse.json(
      { success: true, message: "消息已发送！感谢你的联系。" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
