import Link from "next/link";
import { Phone, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span><ShieldCheck size={14} /> Built for the U.S. military community in Japan</span>
          <span>USD pricing • Japan-based inventory</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="Wild Speed Motors home">
            <span className="brand-mark"><span>WS</span></span>
            <span className="brand-copy">
              <strong>WILD SPEED</strong>
              <span>MOTORS JAPAN</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Main navigation">
            <Link href="/cars">Used Cars</Link>
            <Link href="/budget">Budget</Link>
            <Link href="/brands">Brands</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/finance">Finance</Link>
            <Link href="/sell">Sell</Link>
          </nav>

          <Link className="header-call" href="/contact">
            <Phone size={16} />
            <span>Contact</span>
          </Link>
        </div>
      </header>
    </>
  );
}
