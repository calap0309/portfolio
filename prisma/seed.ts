import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("firas228", 12);

  const user = await prisma.user.upsert({
    where: { email: "admin@portfolio.dev" },
    update: {},
    create: {
      email: "admin@portfolio.dev",
      name: "Admin",
      password: hashedPassword,
    },
  });

  const projects = [
    {
      title: "Poker Room",
      slug: "poker-room",
      description:
        "Texas Hold'em poker vs 3 bots — full betting flow (blinds, flop, turn, river, showdown), hand evaluator from high card to royal flush, and distinct bot personalities. Pure HTML/CSS/JS, no dependencies, deployed to GitHub Pages.",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      liveUrl: "https://calap0309.github.io/poker-room/",
      githubUrl: "https://github.com/calap0309/poker-room",
      tags: JSON.stringify(["JavaScript", "Game", "Poker", "Canvas"]),
      featured: true,
    },
    {
      title: "Event Horizon",
      slug: "event-horizon",
      description:
        "Real-time black hole in your browser — draggable spacetime that warps light via physics, with shader visuals and ambient audio. Built to make relativity tangible.",
      coverImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80",
      liveUrl: "https://calap0309.github.io/event-horizon/",
      githubUrl: "https://github.com/calap0309/event-horizon",
      tags: JSON.stringify(["TypeScript", "Canvas", "Physics", "WebGL"]),
      featured: true,
    },
    {
      title: "Blaze Anime",
      slug: "blaze-anime",
      description:
        "Crunchyroll-style anime catalog — browse, search, and watch licensed trailers with a fast, keyboard-friendly UI and clean metadata.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      liveUrl: "",
      githubUrl: "https://github.com/calap0309/blaze-anime",
      tags: JSON.stringify(["JavaScript", "React", "Anime", "API"]),
      featured: true,
    },
    {
      title: "Noctuary",
      slug: "noctuary",
      description:
        "A quiet magazine — night covers, paper essays. Editorial layout built for reading, with soft typography and deliberate whitespace.",
      coverImage: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80",
      liveUrl: "https://calap0309.github.io/noctuary/",
      githubUrl: "https://github.com/calap0309/noctuary",
      tags: JSON.stringify(["HTML", "CSS", "Editorial", "Magazine"]),
      featured: false,
    },
    {
      title: "Lumen Journal",
      slug: "lumen-journal",
      description:
        "Quiet daily journal — mood + note + streak. Local-first, distraction-free, built for habit and reflection without accounts or tracking.",
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
      liveUrl: "https://calap0309.github.io/lumen-journal/",
      githubUrl: "https://github.com/calap0309/lumen-journal",
      tags: JSON.stringify(["JavaScript", "CSS", "Journal", "Local-First"]),
      featured: false,
    },
    {
      title: "Lumen Notes",
      slug: "lumen-notes",
      description:
        "Distraction-free markdown notes in your browser — instant, offline, no database. Write, preview, and persist locally.",
      coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
      liveUrl: "https://calap0309.github.io/lumen-notes/",
      githubUrl: "https://github.com/calap0309/lumen-notes",
      tags: JSON.stringify(["JavaScript", "Markdown", "Notes", "PWA"]),
      featured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: { ...project, userId: user.id },
      create: { ...project, userId: user.id },
    });
  }

  // remove old demo slugs if they exist and are not in the new list
  const keep = projects.map((p) => p.slug);
  await prisma.project.deleteMany({ where: { slug: { notIn: keep } } });

  console.log(`Database seeded — ${projects.length} real projects (github: calap0309)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
