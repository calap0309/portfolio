import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminProjects } from "./AdminProjects";

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

  const email = session.user.email ?? "admin";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
      <div className="flex items-end justify-between border-b border-nearblack pb-6">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-terracotta">
            Admin
          </p>
          <h1 className="mt-2 font-mono text-3xl md:text-4xl">Dashboard</h1>
        </div>
        <Link
          href="/api/auth/signout"
          className="text-sm uppercase tracking-wide link-hover"
        >
          Sign out
        </Link>
      </div>

      <p className="mt-4 font-mono text-sm text-nearblack/60">
        Signed in as <span className="text-nearblack">{email}</span>
      </p>

      <AdminProjects initialProjects={projects} />
    </main>
  );
}
