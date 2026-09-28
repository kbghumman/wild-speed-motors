import Link from "next/link";
import { Phone } from "lucide-react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Wild Speed Motors home">
          <span className="brand-mark">WS</span>
          <span className="brand-copy">
            <strong>WILD SPEED</strong>
            <span>MOTORS</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <Link href="/cars">Used Cars</Link>
          <Link href="#sell">Sell Your Car</Link>
          <Link href="#finance">Finance</Link>
          <Link href="#about">About Us</Link>
          <Link href="#contact">Contact</Link>
        </nav>

        <a className="button-primary" href="tel:+440000000000">
          <Phone size={17} />
          Call us
        </a>
      </div>
    </header>
  );
}
