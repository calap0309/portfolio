import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NavClient } from "./nav-client";
import { ThemeToggle } from "./theme-toggle";
import { NavScrollWrapper } from "./nav-scroll-wrapper";

/**
 * Server wrapper: resolves the auth session server-side and hands a plain
 * boolean down to the interactive client navigation so the auth check never
 * leaks into a client bundle. Desktop renders the inline Apple-style nav;
 * mobile (<md) collapses it into a shadcn/ui Sheet drawer.
 */
export async function Nav() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl hairline-b print:hidden supports-[backdrop-filter]:bg-surface/70 dark:bg-[linear-gradient(180deg,rgb(24_33_51/0.9),rgb(29_29_31/0.9))]">
      <NavScrollWrapper>
        <div className="col-span-6 md:col-span-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[1rem] font-bold tracking-tight2 text-ink"
            aria-label="Calap — home"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-[0.75rem] font-bold text-white dark:bg-white dark:text-ink">
              C
            </span>
            Calap
            <span
              className="inline-block h-1 w-1 rounded-full bg-accent transition-transform duration-300 ease-apple group-hover:scale-[1.8]"
              aria-hidden
            />
          </Link>
        </div>

        {/* Desktop nav — md and up */}
        <nav className="col-span-6 md:col-span-9 hidden md:flex md:items-center md:justify-end md:gap-8">
          <NavLinks isAdmin={isAdmin} />
          <ThemeToggle />
        </nav>

        {/* Mobile bar — below md */}
        <div className="col-span-6 flex items-center justify-end gap-2 md:hidden">
          <ThemeToggle />
          <NavClient isAdmin={isAdmin} />
        </div>
      </NavScrollWrapper>
    </header>
  );
}

const links = [
  { href: "/projects", label: "Work" },
  { href: "/contact", label: "Contact" },
] as const;

function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group relative inline-flex items-center text-[0.875rem] font-normal text-subtext transition-colors duration-200 ease-apple hover:text-ink"
        >
          {link.label}
          <span
            className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-[width] duration-300 ease-apple group-hover:w-full"
            aria-hidden
          />
        </Link>
      ))}
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          Admin
        </Link>
      )}
    </>
  );
}
