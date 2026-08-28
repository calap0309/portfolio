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
  { href: "/", label: "Index" },
  { href: "/projects", label: "Work" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Client mobile menu. Uses a shadcn/ui Sheet drawer; every link is wrapped in
 * <SheetClose> so the overlay auto-closes when a destination is chosen. All
 * hit areas are >= 44px (see link-hover / w-full / py styles).
 */
export function NavClient({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-terracotta"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 pt-safe pb-safe">
        <SheetTitle className="font-mono uppercase tracking-wide text-sm text-nearblack/60">
          Menu
        </SheetTitle>
        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="flex w-full items-center py-4 font-mono text-xl uppercase tracking-wide link-hover"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          {isAdmin && (
            <SheetClose asChild>
              <Link
                href="/admin"
                className="flex w-full items-center py-4 font-mono text-xl uppercase tracking-wide link-hover text-terracotta"
              >
                Admin
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Link
              href="/contact"
              className="mt-6 inline-flex w-full items-center justify-center bg-nearblack px-5 py-3 text-sm uppercase tracking-wide text-offwhite transition-transform duration-150 ease-out active:scale-95 hover:bg-terracotta"
            >
              Start a project
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
