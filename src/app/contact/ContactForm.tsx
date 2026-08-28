"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Leave a real name."),
  email: z.string().email("That email won't deliver."),
  subject: z.string().min(3, "Give it a subject."),
  message: z.string().min(20, "Say more than a sentence."),
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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-6">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="input-field"
          autoComplete="name"
        />
        {errors.name && (
          <p className="mt-1 font-mono text-xs text-terracotta">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="input-field"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 font-mono text-xs text-terracotta">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          {...register("subject")}
          className="input-field"
        />
        {errors.subject && (
          <p className="mt-1 font-mono text-xs text-terracotta">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          className="input-field resize-y"
        />
        {errors.message && (
          <p className="mt-1 font-mono text-xs text-terracotta">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary disabled:opacity-50"
        >
          {status === "sending" ? "Transmitting…" : "Send message"}
        </button>

        {status === "sent" && (
          <p className="mt-4 border border-nearblack bg-ochre/30 px-4 py-2 font-mono text-sm">
            Message sent. I&apos;ll reply within 24h.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 border border-terracotta px-4 py-2 font-mono text-sm text-terracotta">
            Delivery failed. Email me directly instead.
          </p>
        )}
      </div>
    </form>
  );
}
