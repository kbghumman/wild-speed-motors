import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { login } from "@/app/admin/actions";

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
  const message = params.error ? messages[params.error] : null;

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="v3-mono">WILD SPEED MOTORS</span>
          <h1>Dealer console</h1>
          <p>Private inventory management for approved staff.</p>
        </div>

        {params.setup === "1" && (
          <div className="admin-login-alert">
            Supabase environment variables have not been added to this deployment yet.
          </div>
        )}

        {message && <div className="admin-login-alert">{message}</div>}

        <form action={login} className="admin-login-form">
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit">
            <LockKeyhole size={16} />
            Sign in
          </button>
        </form>

        <Link href="/">← Back to customer website</Link>
      </section>
    </main>
  );
}
