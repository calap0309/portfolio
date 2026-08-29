import Link from "next/link";
import { ArrowUp, Github, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 hairline-top print:hidden">
      <div className="mx-auto max-w-text py-10">
        {/* top row — brand + back to top */}
        <div className="row items-center justify-between gap-8">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-[0.75rem] font-bold text-white dark:bg-white dark:text-ink">
                C
              </span>
              <span className="text-[0.9375rem] font-bold tracking-tight2">Calap</span>
              <span className="text-[0.8125rem] text-subtext">— building for the web</span>
            </div>
            <p className="mt-3 max-w-sm text-[0.8125rem] leading-relaxed text-subtext">
              Full-stack engineer focused on realtime infrastructure and developer tooling. Available for freelance.
            </p>
          </div>

          <div className="col-span-12 flex flex-col gap-4 md:col-span-7 md:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="https://github.com/calap0309"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-full border hairline bg-surface text-subtext transition-all hover:border-ink/20 hover:text-ink hover:shadow-sm"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.tiktok.com/@calaap._22"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-9 items-center gap-1.5 rounded-full border hairline bg-surface px-3.5 text-[0.8125rem] font-medium text-subtext transition-all hover:border-ink/20 hover:text-ink"
              >
                TikTok <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>
              <Link
                href="mailto:syaraffiras@gmail.com"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-full border hairline bg-surface text-subtext transition-all hover:border-ink/20 hover:text-ink hover:shadow-sm"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <a
                href="#top"
                aria-label="Back to top"
                className="group ml-2 inline-flex min-h-[2.25rem] items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-[0.8125rem] font-medium text-white transition-all hover:bg-ink/90 dark:bg-white dark:text-ink"
              >
                Top
                <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 ease-apple group-hover:-translate-y-0.5" />
              </a>
            </div>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem]">
              <Link href="/projects" className="text-subtext transition-colors hover:text-ink">Work</Link>
              <Link href="/contact" className="text-subtext transition-colors hover:text-ink">Contact</Link>
              <Link href="/admin" className="text-subtext transition-colors hover:text-ink">Admin</Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-hairline/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] font-medium tracking-wide text-subtext">
            © {year} Calap. Crafted with Next.js & Tailwind — Apple-inspired, no fluff.
          </p>
          <p className="text-[0.75rem] text-subtext/70">Jakarta · Remote worldwide</p>
        </div>
      </div>
    </footer>
  );
}
