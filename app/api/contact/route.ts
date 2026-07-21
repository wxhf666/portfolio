import { NextResponse } from "next/server";
import type { ContactFormData } from "@/lib/types";
import nodemailer from "nodemailer";

// 简单的内存限流（生产环境建议用 Redis）
const RATE_LIMIT = new Map<string, number>();

// 创建邮件发送器（QQ 邮箱 SMTP）
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.qq.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

export async function POST(request: Request) {
  try {
    // 基础限流：每个 IP 20 秒内最多 1 次
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const lastRequest = RATE_LIMIT.get(ip) || 0;
    if (now - lastRequest < 20000) {
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

    // 发送邮件到你的 QQ 邮箱
    const safeName = name.trim();
    const safeEmail = email.trim();
    const safeSubject = subject.trim();
    const safeMessage = message.trim();

    const notifyEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_USER || "";

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${safeName} (作品集联系)" <${process.env.SMTP_USER}>`,
      replyTo: safeEmail,
      to: notifyEmail,
      subject: `[作品集联系] ${safeSubject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #333;">📬 新的联系消息</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">姓名</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(safeName)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">邮箱</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">主题</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(safeSubject)}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px; white-space: pre-wrap;">
            ${escapeHtml(safeMessage)}
          </div>
          <p style="margin-top: 16px; color: #999; font-size: 12px;">
            来自作品集网站 · ${new Date().toLocaleString("zh-CN")}
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "消息已发送！感谢你的联系，我会尽快回复。" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[联系表单] 发送失败:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
