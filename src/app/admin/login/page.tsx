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
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-2xl hairline bg-white p-8 shadow-card">
        <div className="hairline-b pb-4">
          <h1 className="text-2xl font-bold tracking-tight2">Restricted access</h1>
          <p className="mt-1 text-xs text-subtext">Authorized personnel only.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
