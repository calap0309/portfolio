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
      title: "EdgeCache",
      slug: "edgecache",
      description:
        "Global edge caching layer built on Cloudflare Workers. Handles 50k req/s with sub-millisecond latency. Implements stale-while-revalidate and automatic cache invalidation via WebSocket events.",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      liveUrl: "https://edgecache.dev",
      githubUrl: "https://github.com/user/edgecache",
      tags: JSON.stringify(["TypeScript", "Cloudflare Workers", "WebSockets", "Edge Computing"]),
      featured: true,
    },
    {
      title: "Stateflow",
      slug: "stateflow",
      description:
        "Reactive state management library with zero dependencies. Implements a finite state machine pattern with time-travel debugging, middleware support, and automatic React/Vue bindings via a shared event bus.",
      coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
      liveUrl: "https://stateflow.dev",
      githubUrl: "https://github.com/user/stateflow",
      tags: JSON.stringify(["TypeScript", "State Machines", "React", "Zero-Config"]),
      featured: true,
    },
    {
      title: "Pipeline",
      slug: "pipeline",
      description:
        "Self-hosted CI/CD runner with container isolation. Executes build stages in parallel across a DAG, streams real-time logs over SSE, and caches artifacts to a shared S3-compatible store.",
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      liveUrl: "https://pipeline.dev",
      githubUrl: "https://github.com/user/pipeline",
      tags: JSON.stringify(["Go", "Docker", "SSE", "CI/CD"]),
      featured: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: { ...project, userId: user.id },
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
