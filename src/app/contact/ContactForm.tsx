"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long (max 100)."),
  email: z.string().trim().email("That email won't deliver.").optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Please add a subject.").max(200, "Subject is too long (max 200)."),
  message: z.string().trim().min(20, "Please say a little more.").max(5000, "Message is too long (max 5000)."),
});

type ContactFormValues = z.input<typeof contactSchema>;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(data: ContactFormValues) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-ink">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ada Lovelace"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
          className={`input-field ${errors.name ? "border-danger focus:border-danger" : ""}`}
          autoComplete="name"
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">
          Email <span className="font-normal text-subtext">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="ada@analytical.engine"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
          className={`input-field ${errors.email ? "border-danger focus:border-danger" : ""}`}
          autoComplete="email"
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-ink">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Project inquiry — realtime dashboard"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          {...register("subject")}
          className={`input-field ${errors.subject ? "border-danger focus:border-danger" : ""}`}
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell me about the problem, stack, and timeline…"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
          className={`input-field resize-y py-3 ${errors.message ? "border-danger focus:border-danger" : ""}`}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.message.message}
          </p>
        )}
        <p className="mt-1.5 text-right text-[0.6875rem] text-subtext/70">Min. 20 characters</p>
      </div>

      <div className="pt-2">
        <p className="mb-4 text-sm text-subtext">
          Your message goes straight to me at <span className="font-semibold text-ink">syaraffiras@gmail.com</span>.
        </p>

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn inline-flex w-full items-center justify-center gap-2 disabled:opacity-50 sm:w-auto"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>

        {status === "sent" && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Message sent — I&apos;ll reply within 24 hours.</span>
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-ink dark:bg-danger/10">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <span>Delivery failed. Please email me directly at syaraffiras@gmail.com instead.</span>
          </div>
        )}
      </div>
    </form>
  );
}
