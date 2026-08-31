import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Background } from "./background";
import { ScrollProgress } from "@/components/scroll-progress";
import { JsonLd } from "@/components/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-six-topaz-evd842wqk8.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Calap — Full-Stack Developer",
    template: "%s | Calap",
  },
  description:
    "Calap is a full-stack engineer building durable systems, real-time infrastructure, and developer tooling. Available for freelance — Jakarta · Remote worldwide.",
  applicationName: "Calap Portfolio",
  authors: [{ name: "Calap", url: siteUrl }],
  creator: "Calap",
  publisher: "Calap",
  keywords: [
    "Calap",
    "Full-Stack Developer",
    "Next.js",
    "TypeScript",
    "Realtime",
    "WebSockets",
    "Tailwind",
    "Portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Calap — Full-Stack Developer",
    title: "Calap — Full-Stack Developer",
    description:
      "Building durable systems, real-time infrastructure, and developer tooling that scale under load.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Calap — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calap — Full-Stack Developer",
    description: "Durable systems for the web — realtime, tooling, infrastructure.",
    creator: "@calap0309",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Sets the theme before paint to avoid a flash of wrong theme (FOUC). Runs
 * inline and synchronously in the <head>: reads the persisted choice from
 * localStorage, falls back to the OS `prefers-color-scheme`, then toggles the
 * `dark` class on <html>. Mirrors ThemeToggle in src/lib/theme.tsx.
 */
const themeScript = `
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var dark = stored ? stored === "dark" : prefersDark;
      var root = document.documentElement;
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#0a0a0c" : "#ffffff");
    } catch (e) {}
  })();
`;

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
    <html lang="en" className="bg-appbg text-ink">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd />
      </head>
      <body className="min-h-screen antialiased pt-safe pb-safe">
        <ScrollProgress />
        <Background>
          <div id="top" className="mx-auto w-full max-w-6xl px-6 md:px-10">
            {children}
          </div>
        </Background>
      </body>
    </html>
  );
}
