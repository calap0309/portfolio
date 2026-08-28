"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
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
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[86vw] max-w-sm flex-col pt-safe pb-safe">
        <SheetTitle className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-subtext">
          Menu
        </SheetTitle>

        <nav className="mt-8 flex flex-1 flex-col">
          {links.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="-mx-4 flex w-full items-center border-b border-hairline/60 px-4 py-4 text-2xl font-bold tracking-tight2 text-ink transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          {isAdmin && (
            <SheetClose asChild>
              <Link
                href="/admin"
                className="-mx-4 flex w-full items-center px-4 py-4 text-2xl font-bold tracking-tight2 text-accent transition-colors hover:text-accent-hover"
              >
                Admin
              </Link>
            </SheetClose>
          )}
        </nav>

        <div className="mt-6 flex flex-col gap-4">
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
