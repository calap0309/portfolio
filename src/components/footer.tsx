import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 py-10 hairline-top">
      <div className="row items-end justify-between gap-4">
        <div className="col-span-12 md:col-span-6">
          <p className="text-[0.8125rem] text-subtext">
            © {year} Calap. All rights reserved.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 md:flex md:justify-end gap-6">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.8125rem] text-subtext transition-colors hover:text-ink"
          >
            GitHub
          </Link>
          <Link
            href="mailto:hello@example.com"
            className="text-[0.8125rem] text-subtext transition-colors hover:text-ink"
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
