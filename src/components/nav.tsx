import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NavClient } from "./nav-client";

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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl hairline-b">
      <div className="row items-center py-3">
        <div className="col-span-6 md:col-span-3">
          <Link
            href="/"
            className="inline-flex items-center text-[0.875rem] font-semibold tracking-tight2 text-ink"
          >
            Calap
          </Link>
        </div>

        {/* Desktop nav — md and up */}
        <nav className="col-span-6 md:col-span-9 hidden md:flex md:items-center md:justify-end md:gap-8">
          <NavLinks isAdmin={isAdmin} />
        </nav>

        {/* Mobile hamburger — below md */}
        <div className="col-span-6 flex items-center justify-end md:hidden">
          <NavClient isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/contact", label: "Contact" },
] as const;

function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  return (
    <>
      <Link href="/" className="text-[0.875rem] font-normal text-subtext transition-colors hover:text-ink">
        Home
      </Link>
      {links.slice(1).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[0.875rem] font-normal text-subtext transition-colors hover:text-ink"
        >
          {link.label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          href="/admin"
          className="text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          Admin
        </Link>
      )}
    </>
  );
}
