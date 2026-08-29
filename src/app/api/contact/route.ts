import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().optional().or(z.literal("")),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(20).max(5000),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rate = checkRateLimit(request, { windowMs: 10 * 60 * 1000, limit: 5 });
  if (!rate.allowed) {
    const retryAfterSec = Math.ceil(rate.retryAfterMs / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed." },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  // Always persist the message to the database so it can be read from the
  // admin inbox, even if no mail provider is configured.
  try {
    const saved = await prisma.message.create({
      data: {
        name,
        email: email || null,
        subject,
        message,
        read: false,
      },
    });
    const id = saved.id;

    const to = process.env.CONTACT_EMAIL ?? "syaraffiras@gmail.com";
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: [to],
          replyTo: email || to,
          subject: `[Portfolio] ${subject}`,
          html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
                 <p><strong>Email:</strong> ${escapeHtml(email || "—")}</p>
                 <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                 <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
        });
      } catch (err) {
        console.error("Resend failed:", err);
      }
    } else {
      const smtpHost = process.env.SMTP_HOST;
      if (smtpHost) {
        try {
          const nodemailer = await import("nodemailer");
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: Number(process.env.SMTP_PORT ?? 587) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.SMTP_FROM ?? to,
            to: [to],
            replyTo: email || to,
            subject: `[Portfolio] ${subject}`,
            text: `Name: ${name}\nEmail: ${email || "—"}\nSubject: ${subject}\n\n${message}`,
          });
        } catch (err) {
          console.error("Nodemailer failed:", err);
        }
      }
    }

    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (err) {
    console.error("Failed to save message:", err);
    return NextResponse.json(
      { error: "Could not save your message." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch] ?? ch
  );
}
