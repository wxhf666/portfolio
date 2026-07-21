"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import type { ChatMessage as ChatMessageType, ChatStreamChunk } from "@/lib/types";

const STORAGE_KEY = "portfolio-chat-messages";
const MAX_STORED_MESSAGES = 50;
const WELCOME_MESSAGE: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content: "你好！我是王祥弘飞的 AI 助手 👋\n\n你可以问我关于他的项目经历、技术栈、教育背景等问题。有什么想了解的吗？",
  timestamp: Date.now(),
};

// 加载本地存储的消息
function loadMessages(): ChatMessageType[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const messages = JSON.parse(raw) as ChatMessageType[];
    return messages.length > 0 ? messages : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

// 保存消息到本地存储
function saveMessages(messages: ChatMessageType[]) {
  try {
    const toSave = messages.slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // 存储满了或不可用，静默失败
  }
}

// 生成唯一 ID
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>(loadMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistantMessageRef = useRef<string>("");

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 关闭时标记未读
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [isOpen, messages.length]);

  // 打开面板时清除未读标记
  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  // 发送消息
  const sendMessage = useCallback(async () => {
    const content = inputValue.trim();
    if (!content || isLoading) return;

    setInputValue("");

    const userMessage: ChatMessageType = {
      id: generateId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setIsLoading(true);

    // 准备发送的消息历史（去掉 system 和 welcome 消息，只保留实际对话）
    const chatHistory = updatedMessages
      .filter((m) => m.id !== "welcome" && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // 创建一个占位的助手消息
      const assistantId = generateId();
      assistantMessageRef.current = "";

      const assistantPlaceholder: ChatMessageType = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantPlaceholder]);

      // 读取 SSE 流
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          try {
            const event: ChatStreamChunk = JSON.parse(trimmed.slice(6));

            if (event.type === "token" && event.content) {
              assistantMessageRef.current += event.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantMessageRef.current } : m
                )
              );
            } else if (event.type === "done") {
              // 流结束，保存最终消息
              setMessages((prev) => {
                const final = prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: assistantMessageRef.current, timestamp: Date.now() }
                    : m
                );
                saveMessages(final);
                return final;
              });
            } else if (event.type === "error") {
              // 显示错误
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: `❌ ${event.message || "发生错误，请重试"}`,
                        timestamp: Date.now(),
                      }
                    : m
                )
              );
            }
          } catch {
            // 解析失败，跳过
          }
        }
      }
    } catch (err) {
      console.error("[ChatWidget] Send error:", err);

      const isRateLimit = (err as Error).message?.includes("429");

      // 回滚：移除刚添加的用户消息，恢复输入内容让用户重试
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== userMessage.id);
        saveMessages(filtered);
        return filtered;
      });
      setInputValue(content);

      // 用一个临时提示消息告诉用户发生了什么
      const toastId = generateId();
      const toast: ChatMessageType = {
        id: toastId,
        role: "assistant",
        content: isRateLimit ? "⏳ 发送太快了，请稍等一下再试" : "❌ 网络连接失败，请重试",
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const withToast = [...prev, toast];
        saveMessages(withToast);
        // 2 秒后自动消失
        setTimeout(() => {
          setMessages((current) => {
            const cleaned = current.filter((m) => m.id !== toastId);
            saveMessages(cleaned);
            return cleaned;
          });
        }, 2500);
        return withToast;
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages]);

  // 清除对话
  const clearChat = () => {
    const reset = [WELCOME_MESSAGE];
    setMessages(reset);
    saveMessages(reset);
  };

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-lg",
          "bg-primary text-primary-foreground",
          "hover:opacity-90 hover:shadow-xl",
          "transition-all duration-200",
          "flex items-center justify-center",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label="打开 AI 助手"
      >
        <MessageCircle className="w-6 h-6" />
        {/* 未读提示 */}
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-background" />
        )}
      </button>

      {/* 聊天面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 移动端遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "fixed z-50 flex flex-col",
                "bg-background border border-border shadow-2xl",
                // 桌面端：固定尺寸卡片
                "md:bottom-24 md:right-6 md:w-[380px] md:h-[520px] md:rounded-2xl",
                // 移动端：全屏
                "inset-0 md:inset-auto"
              )}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">AI 助手</h3>
                    <p className="text-[10px] text-muted-foreground">基于 DeepSeek · 可问项目/技能/经历</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 1 && (
                    <button
                      onClick={clearChat}
                      className="w-7 h-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-xs text-muted-foreground transition-colors"
                      title="清除对话"
                    >
                      清除
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-surface-hover flex items-center justify-center text-muted-foreground transition-colors"
                    aria-label="关闭"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && !messages.some((m) => m.role === "assistant" && m.content === "") && (
                  <TypingIndicator />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={sendMessage}
                isLoading={isLoading}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
