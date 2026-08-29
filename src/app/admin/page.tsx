import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminProjects } from "./AdminProjects";
import { AdminInbox } from "./AdminInbox";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  const email = session.user.email ?? "admin";

  return (
    <main className="mx-auto w-full max-w-6xl py-12 md:py-20">
      <div className="flex items-end justify-between hairline-b pb-6">
        <div>
          <p className="text-[1.0625rem] font-semibold text-subtext">Admin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight2 md:text-4xl">
            Dashboard
          </h1>
        </div>
        <Link
          href="/api/auth/signout"
          className="inline-flex min-h-[2.75rem] items-center text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          Sign out
        </Link>
      </div>

      <p className="mt-4 text-sm text-subtext">
        Signed in as <span className="font-medium text-ink">{email}</span>
      </p>

      {/* Stats — wrap to 1 column on mobile. */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total projects" value={projects.length} />
        <Stat label="Featured" value={projects.filter((p) => p.featured).length} />
        <Stat label="Inbox" value={messages.length} />
      </div>

      <AdminProjects initialProjects={projects} />

      <AdminInbox initialMessages={messages} />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl hairline bg-surface p-5 shadow-card">
      <span className="text-xs font-semibold uppercase tracking-wide text-subtext">
        {label}
      </span>
      <span className="text-2xl font-bold leading-none text-ink">{value}</span>
    </div>
  );
}
