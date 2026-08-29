import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(20),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
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
  const to = process.env.CONTACT_EMAIL ?? "syaraffiras@gmail.com";

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: [to],
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
               <p><strong>Email:</strong> ${escapeHtml(email)}</p>
               <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
               <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
      });
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      console.error("Resend failed:", err);
    }
  }

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
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      });
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      console.error("Nodemailer failed:", err);
    }
  }

  return NextResponse.json(
    { error: "No mail provider configured." },
    { status: 500 }
  );
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
