"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

/** 简单的 Markdown 渲染：加粗、链接、代码块、列表 */
function renderMarkdown(text: string): string {
  // Escape HTML
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 代码块 ```...```
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class="bg-muted rounded-lg p-3 my-2 overflow-x-auto text-xs"><code>${escaped}</code></pre>`;
  });

  // 行内代码 `...`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>');

  // 加粗 **...**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // 斜体 *...*
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // 链接 [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:opacity-80">$1</a>'
  );

  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // 换行
  html = html.replace(/\n\n/g, "<br/><br/>");
  html = html.replace(/\n/g, "<br/>");

  return html;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex items-start gap-3 px-4", isUser && "flex-row-reverse")}>
      {/* 头像 */}
      <div
        className={cn(
          "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-medium",
          isUser
            ? "bg-primary border-primary text-primary-foreground"
            : "bg-primary/10 border-primary/20 text-primary"
        )}
      >
        {isUser ? "我" : "AI"}
      </div>

      {/* 气泡 */}
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm leading-relaxed break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-surface border border-border text-foreground rounded-tl-sm"
        )}
      >
        {isAssistant ? (
          <div
            className="prose-chat"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  );
}
