import type { Metadata } from "next";
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
      <main className="py-20">
        <div className="row">
          <div className="col-span-12 md:col-span-7 md:col-start-3">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-terracotta">
              Contact
            </p>
            <h1 className="mt-4 font-mono text-4xl md:text-5xl tracking-tight">
              Let&apos;s talk infrastructure.
            </h1>
            <p className="mt-4 max-w-lg text-base text-nearblack/70">
              Hiring for a systems-heavy role, or want to discuss a build?
              Skip the form and the noise. One message, a direct reply.
            </p>

            <ContactForm />

            <div className="mt-12 border-t border-nearblack pt-6">
              <p className="font-mono text-xs uppercase tracking-wide text-nearblack/60">
                Prefer email?
              </p>
              <a
                href={`mailto:${process.env.CONTACT_EMAIL ?? "hello@example.com"}`}
                className="link-hover font-mono text-lg"
              >
                {process.env.CONTACT_EMAIL ?? "hello@example.com"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
