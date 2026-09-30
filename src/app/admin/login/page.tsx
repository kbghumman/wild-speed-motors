import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { login } from "@/app/admin/actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Dealer Login | Wild Speed Motors",
  robots: { index: false, follow: false },
};

const messages: Record<string, string> = {
  missing: "Enter your email and password.",
  invalid: "The email or password is incorrect.",
  "not-authorized": "This account is not approved for the dealer console.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; setup?: string }>;
}) {
  const params = await searchParams;
  const configured = hasSupabaseEnv();
  const message = params.error ? messages[params.error] : null;

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="v3-mono">WILD SPEED MOTORS</span>
          <h1>Dealer console</h1>
          <p>Private inventory management for approved staff.</p>
        </div>

        {!configured && (
          <div className="admin-login-alert">
            Dealer login is temporarily unavailable because the Supabase connection
            is not configured on this deployment.
          </div>
        )}

        {message && <div className="admin-login-alert">{message}</div>}

        <form action={login} className="admin-login-form">
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={!configured}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={!configured}
            />
          </label>

          <button type="submit" disabled={!configured}>
            <LockKeyhole size={16} />
            {configured ? "Sign in" : "Login unavailable"}
          </button>
        </form>

        <Link href="/">← Back to customer website</Link>
      </section>
    </main>
  );
}
