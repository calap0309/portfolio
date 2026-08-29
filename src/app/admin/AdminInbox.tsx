"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Trash2 } from "lucide-react";
import type { Message } from "@/lib/types";

interface AdminInboxProps {
  initialMessages: Message[];
}

export function AdminInbox({ initialMessages }: AdminInboxProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  async function setRead(id: string, read: boolean) {
    const prev = messages;
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read } : m)));
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setMessages(prev);
    }
    router.refresh();
  }

  async function deleteMessage(id: string) {
    const prev = messages;
    setMessages((ms) => ms.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setMessages(prev);
    }
    router.refresh();
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between hairline-b pb-6">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-subtext" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight2">Inbox</h2>
            <p className="text-sm text-subtext">
              Messages from the contact form
            </p>
          </div>
          {unread > 0 && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
              {unread} unread
            </span>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="mt-8 rounded-2xl hairline bg-surface p-10 text-center text-subtext">
          No messages yet. Submissions from the contact form will appear here.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className={`rounded-2xl hairline bg-surface p-5 shadow-card transition-colors sm:p-6 ${
                m.read ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight2">
                    {m.subject}
                  </h3>
                  <p className="mt-0.5 text-sm text-subtext">
                    <span className="font-medium text-ink">{m.name}</span>
                    {m.email ? ` · ${m.email}` : ""} ·{" "}
                    {new Date(m.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRead(m.id, !m.read)}
                    className="inline-flex min-h-[2.5rem] items-center rounded-lg hairline bg-surface-soft px-3 text-xs font-semibold text-ink transition-colors hover:bg-surface-soft/70"
                  >
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMessage(m.id)}
                    aria-label="Delete message"
                    className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg hairline bg-surface-soft px-3 text-subtext transition-colors hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink/90">
                {m.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
