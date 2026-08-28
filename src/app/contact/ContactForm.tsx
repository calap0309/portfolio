"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("That email won't deliver."),
  subject: z.string().min(3, "Please add a subject."),
  message: z.string().min(20, "Please say a little more."),
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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-ink"
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
          <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-ink"
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
          <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-2 block text-sm font-semibold text-ink"
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
          <p className="mt-1 text-xs text-danger">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-ink"
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
          <p className="mt-1 text-xs text-danger">{errors.message.message}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn w-full disabled:opacity-50 sm:w-auto"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "sent" && (
          <p className="mt-4 rounded-xl bg-[#f5f5f7] px-4 py-3 text-sm text-ink">
            Message sent. I&apos;ll reply within 24 hours.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 rounded-xl bg-[#f5f5f7] px-4 py-3 text-sm text-ink">
            Delivery failed. Please email me directly instead.
          </p>
        )}
      </div>
    </form>
  );
}
