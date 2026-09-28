import Link from "next/link";
import { ArrowUpRight, Search, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/cars", label: "Inventory", sublabel: "All cars" },
  { href: "/budget", label: "Showroom", sublabel: "By budget" },
  { href: "/brands", label: "Brands", sublabel: "A–Z directory" },
  { href: "/collections", label: "Collections", sublabel: "Curated stock" },
  { href: "/finance", label: "Finance", sublabel: "Buying options" },
  { href: "/sell", label: "Sell", sublabel: "Trade or value" },
];

export default function Header() {
  return (
    <>
      <div className="utility-bar utility-bar-premium">
        <div className="container utility-inner utility-inner-premium">
          <span className="utility-message">
            <ShieldCheck size={13} />
            U.S. military-focused buying experience in Japan
          </span>
          <div className="utility-facts">
            <span>Japan inventory</span>
            <span className="utility-separator" />
            <span>USD pricing</span>
            <span className="utility-separator" />
            <Link href="/contact">Contact showroom</Link>
          </div>
        </div>
      </div>

      <header className="site-header site-header-premium">
        <div className="container header-inner header-inner-premium">
          <Link href="/" className="brand brand-premium" aria-label="Wild Speed Motors home">
            <span className="brand-monogram">WS</span>
            <span className="brand-wordmark">
              <strong>WILD SPEED</strong>
              <small>MOTORS / JAPAN</small>
            </span>
          </Link>

          <nav className="nav nav-premium" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-premium-link">
                <span>{item.label}</span>
                <small>{item.sublabel}</small>
              </Link>
            ))}
          </nav>

          <Link className="header-find-car" href="/cars">
            <span className="header-find-icon"><Search size={16} /></span>
            <span className="header-find-copy">
              <small>Search stock</small>
              <strong>Find a car</strong>
            </span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>
    </>
  );
}
