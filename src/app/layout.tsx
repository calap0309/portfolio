import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Background } from "./background";

export const metadata: Metadata = {
  title: {
    default: "Calap — Full-Stack Developer",
    template: "%s | Calap",
  },
  description:
    "Calap is a full-stack engineer building durable systems, real-time infrastructure, and developer tooling.",
  icons: {
    icon: [{ url: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/**
 * Root layout.
 *
 * Safe-area insets + overflow guards are applied on the body via CSS;
 * Background provides the layered white/soft-blur glow behind content. Content
 * is width-constrained by each page via max-w utilities.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-white text-ink">
      <body className="min-h-screen antialiased pt-safe pb-safe">
        <Background>
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            {children}
          </div>
        </Background>
      </body>
    </html>
  );
}
