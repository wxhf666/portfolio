"use client";

import { useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="border-t border-border p-3 bg-surface/50">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题..."
          disabled={isLoading || disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "max-h-[120px]"
          )}
        />
        <button
          onClick={onSubmit}
          disabled={!canSend}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
            canSend
              ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          aria-label="发送"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
        Enter 发送 · Shift+Enter 换行
      </p>
    </div>
  );
}
