"use client";

import { useState, type FormEvent } from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import type { ComponentType } from "react";
import { siteConfig } from "@/content/site.config";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
};

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "请填写姓名";
    if (!form.email.trim()) errs.email = "请填写邮箱";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "邮箱格式不正确";
    if (!form.subject.trim()) errs.subject = "请填写主题";
    if (!form.message.trim()) errs.message = "请填写内容";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <div className="px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            联系我
          </h1>
          <p className="mt-2 text-muted-foreground">
            有合作意向或任何问题？欢迎随时联系
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-5 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="sm:col-span-2 space-y-6"
          >
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground">邮箱</h3>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground">所在地</h3>
                <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground">回复时间</h3>
                <p className="text-sm text-muted-foreground">通常在 24 小时内回复</p>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-medium text-foreground mb-3">社交链接</h3>
              <div className="flex items-center gap-2">
                {siteConfig.socialLinks.map((link) => {
                  const Icon = ICON_MAP[link.icon] || Mail;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg border border-border bg-surface hover:bg-surface-hover flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={link.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sm:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="姓名"
                  placeholder="你的姓名"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  error={errors.name}
                />
                <Input
                  label="邮箱"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  error={errors.email}
                />
              </div>
              <Input
                label="主题"
                placeholder="聊聊合作机会？"
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                error={errors.subject}
              />
              <Textarea
                label="内容"
                placeholder="写下你想说的话..."
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                error={errors.message}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === "loading"}
                className="w-full sm:w-auto"
              >
                {status === "loading" ? (
                  "发送中..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    发送消息
                  </>
                )}
              </Button>

              {status === "success" && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  &#10003; 消息已发送！我会尽快回复你。
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-500">
                  &#10007; 发送失败，请稍后再试。你也可以直接发邮件给我。
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
