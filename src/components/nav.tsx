import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const links = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Work" },
  { href: "/contact", label: "Contact" },
] as const;

export async function Nav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 border-b border-nearblack bg-offwhite">
      <div className="row items-center py-4">
        <div className="col-span-6 md:col-span-3">
          <Link
            href="/"
            className="font-mono text-lg font-bold tracking-tight link-hover"
          >
            INDEX<span className="text-terracotta">.</span>
          </Link>
        </div>
        <nav className="col-span-6 md:col-span-6 md:col-start-7 flex justify-end gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-wide link-hover"
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/admin"
              className="text-sm uppercase tracking-wide link-hover text-terracotta"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
