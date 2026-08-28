import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Calap — Full-Stack Craft",
    template: "%s | Calap",
  },
  description:
    "Full-stack engineer building durable systems and real-time infrastructure.",
  icons: {
    icon: [{ url: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-offwhite text-nearblack">
      <body className="min-h-screen antialiased">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          {children}
        </div>
      </body>
    </html>
  );
}
