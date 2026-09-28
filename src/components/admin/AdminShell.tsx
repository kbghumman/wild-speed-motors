import Link from "next/link";
import { ArrowLeft, CarFront, LayoutDashboard, Plus, Settings } from "lucide-react";

export default function AdminShell({
  children,
  title,
  eyebrow,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
}) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-wordmark">
          <strong>WILD SPEED</strong>
          <span>DEALER CONSOLE</span>
        </Link>

        <nav className="admin-nav">
          <Link href="/admin">
            <LayoutDashboard size={17} />
            Dashboard
          </Link>
          <Link href="/admin/vehicles/new" className="admin-nav-primary">
            <Plus size={17} />
            Add vehicle
          </Link>
          <Link href="/cars">
            <CarFront size={17} />
            Public inventory
          </Link>
          <span className="admin-nav-disabled">
            <Settings size={17} />
            Settings
            <small>Later</small>
          </span>
        </nav>

        <div className="admin-sidebar-note">
          <span className="v3-mono">PRIVATE AREA</span>
          <p>Authentication will be connected before production launch.</p>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="v3-mono">{eyebrow}</span>
            <h1>{title}</h1>
          </div>
          <Link href="/" className="admin-public-link">
            <ArrowLeft size={15} />
            Customer site
          </Link>
        </header>

        {children}
      </section>
    </main>
  );
}
