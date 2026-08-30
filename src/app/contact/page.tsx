import type { Metadata } from "next";
import { Clock3, Mail } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a direct message — commissions, collaborations, or engineering questions.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-text py-16 md:py-20">
        <div className="row">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-widest text-subtext">Contact</p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-apple">
              Let&apos;s build something.
            </h1>
            <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-subtext">
              Hiring for a systems-heavy role, or want to discuss a build? One message, a direct reply — usually within 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-subtext">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-tag px-3 py-1.5">
                <Clock3 className="h-3.5 w-3.5" /> Replies in ~24h
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-tag px-3 py-1.5">
                <Mail className="h-3.5 w-3.5" /> No spam, ever
              </span>
            </div>

            <ContactForm />

            <div className="mt-14 rounded-2xl border hairline bg-surface p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-subtext">Prefer email?</p>
              <a
                href={`mailto:${process.env.CONTACT_EMAIL ?? "syaraffiras@gmail.com"}`}
                className="mt-2 inline-flex text-[1.0625rem] font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                {process.env.CONTACT_EMAIL ?? "syaraffiras@gmail.com"}
              </a>
              <p className="mt-2 text-xs text-subtext">Click to open your mail client.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
