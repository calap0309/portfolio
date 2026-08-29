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
      <main className="mx-auto max-w-text py-20">
        <div className="row">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <p className="text-[1.0625rem] font-semibold text-subtext">
              Contact
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight2">
              Let&apos;s build something.
            </h1>
            <p className="mt-5 max-w-lg text-subtext">
              Hiring for a systems-heavy role, or want to discuss a build? One
              message, a direct reply.
            </p>

            <ContactForm />

            <div className="mt-14 hairline-top pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-subtext">
                Prefer email?
              </p>
              <a
                href={`mailto:${process.env.CONTACT_EMAIL ?? "hello@example.com"}`}
                className="mt-2 inline-flex text-lg font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                {process.env.CONTACT_EMAIL ?? "syaraffiras@gmail.com"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
