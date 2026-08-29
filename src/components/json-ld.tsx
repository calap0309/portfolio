/**
 * JSON-LD structured data — Person + WebSite.
 * Helps Google show rich results; injected as <script type="application/ld+json">.
 */
export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-calap.vercel.app";
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Calap",
    url: siteUrl,
    jobTitle: "Full-Stack Developer",
    description: "Full-stack engineer building durable systems, real-time infrastructure, and developer tooling.",
    sameAs: ["https://github.com/calap0309", "https://www.tiktok.com/@calaap._22"],
    knowsAbout: ["TypeScript", "Next.js", "React", "Node.js", "WebSockets", "PostgreSQL", "Tailwind"],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Calap — Full-Stack Developer",
    url: siteUrl,
    description: "Portfolio of Calap — projects, writing, contact.",
    publisher: { "@type": "Person", name: "Calap" },
    inLanguage: "en-US",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
