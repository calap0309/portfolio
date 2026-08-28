import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Background } from "./background";
import { AmbientAudio } from "@/components/ambient-audio";

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
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4f0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-paper text-nearblack">
      {/* Safe-area insets + overflow guard are applied on the body via CSS;
          Background provides the layered paper/blobs/grid behind content. */}
      <body className="min-h-screen antialiased pt-safe pb-safe">
        <Background>
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            {children}
          </div>
        </Background>
        <AmbientAudio />
      </body>
    </html>
  );
}
