import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-nearblack py-8">
      <div className="row items-end justify-between gap-4">
        <div className="col-span-12 md:col-span-6">
          <p className="font-mono text-sm">
            Built without trends. Durable by default.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 md:flex md:justify-end gap-6">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm uppercase tracking-wide link-hover"
          >
            GitHub
          </Link>
          <Link
            href="mailto:hello@example.com"
            className="text-sm uppercase tracking-wide link-hover"
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
