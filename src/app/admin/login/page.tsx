import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-offwhite px-6">
      <div className="w-full max-w-md border border-nearblack bg-offwhite p-8">
        <div className="border-b border-nearblack pb-4">
          <h1 className="font-mono text-2xl">Restricted access</h1>
          <p className="mt-1 font-mono text-xs text-nearblack/60">
            Authorized personnel only.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
