import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 hairline-top print:hidden">
      <div className="mx-auto max-w-text py-12">
        <div className="row items-center justify-between gap-8">
          <div className="col-span-12 md:col-span-6">
            <p className="text-[0.8125rem] text-subtext">
              © {year} Calap.
            </p>
          </div>

          <div className="col-span-12 flex flex-col gap-3 md:col-span-6 md:flex-row md:items-center md:justify-end">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="https://github.com/calap0309"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[0.875rem] font-normal text-subtext transition-colors duration-200 hover:text-ink"
              >
                GitHub
              </Link>
              <Link
                href="https://www.tiktok.com/@calaap._22"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[0.875rem] font-normal text-subtext transition-colors duration-200 hover:text-ink"
              >
                TikTok
              </Link>
              <Link
                href="mailto:syaraffiras@gmail.com"
                className="group inline-flex items-center gap-1.5 text-[0.875rem] font-normal text-subtext transition-colors duration-200 hover:text-ink"
              >
                Email
              </Link>
            </div>

            <a
              href="#top"
              aria-label="Back to top"
              className="group inline-flex min-h-[2.75rem] items-center justify-center gap-1.5 rounded-full border-hairline border px-4 text-[0.8125rem] font-medium text-subtext transition-all duration-300 ease-apple hover:border-ink/30 hover:text-ink"
            >
              Top
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 ease-apple group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
