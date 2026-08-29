"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Github, Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Client mobile menu. Uses a shadcn/ui Sheet drawer — Apple-style full-screen
 * overlay with a blurred translucent backdrop. Every link is wrapped in
 * <SheetClose> so the overlay auto-closes on selection. All hit areas are
 * >= 44px.
 */
export function NavClient({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[86vw] max-w-sm flex-col bg-surface/95 backdrop-blur-xl pt-safe pb-safe">
        <SheetTitle className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-subtext">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden /> Menu
        </SheetTitle>

        <nav className="mt-8 flex flex-1 flex-col">
          {links.map((link, i) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="group -mx-4 flex w-full items-center justify-between border-b border-hairline/60 px-4 py-5 text-2xl font-bold tracking-tight2 text-ink transition-colors hover:text-accent"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-5 w-5 opacity-30 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </SheetClose>
          ))}
          {isAdmin && (
            <SheetClose asChild>
              <Link
                href="/admin"
                className="-mx-4 flex w-full items-center justify-between px-4 py-5 text-2xl font-bold tracking-tight2 text-accent transition-colors hover:text-accent-hover"
              >
                Admin <ArrowUpRight className="h-5 w-5" />
              </Link>
            </SheetClose>
          )}
        </nav>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-subtext">
            <Link href="https://github.com/calap0309" target="_blank" className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline transition-colors hover:text-ink hover:border-ink/20" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="mailto:syaraffiras@gmail.com" className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline transition-colors hover:text-ink hover:border-ink/20" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
            <span className="ml-auto text-xs text-subtext">© {new Date().getFullYear()} Calap</span>
          </div>
          <SheetClose asChild>
            <Link href="/contact" className="btn w-full">
              Get in touch
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
