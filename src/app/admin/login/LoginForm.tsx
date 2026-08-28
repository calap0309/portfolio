"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required."),
});

type LoginValues = z.input<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginValues) {
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="input-field"
          autoComplete="username"
          autoFocus
        />
        {errors.email && (
          <p className="mt-1 font-mono text-xs text-terracotta">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="input-field"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mt-1 font-mono text-xs text-terracotta">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <p className="border border-terracotta px-4 py-2 font-mono text-sm text-terracotta">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary justify-center w-full disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
