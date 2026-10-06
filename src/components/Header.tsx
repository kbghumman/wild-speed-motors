import Link from "next/link";
import {
  BadgeDollarSign,
  CarFront,
  ChevronDown,
  CircleDollarSign,
  Info,
  Menu,
  MessageCircle,
  Repeat2,
  Shapes,
} from "lucide-react";

const primary = [
  { href: "/cars", label: "Cars" },
  { href: "/budget", label: "By budget" },
  { href: "/finance", label: "Finance" },
  { href: "/sell", label: "Sell / trade" },
];

const secondary = [
  { href: "/collections", label: "Collections", Icon: Shapes },
  { href: "/about", label: "About us", Icon: Info },
];

export default function Header() {
  return (
    <>
      <header className="v4-header">
        <div className="container v4-header-inner">
          <Link href="/" className="v4-wordmark" aria-label="Wild Speed Motors home">
            <span className="v4-wordmark-mark">WS</span>
            <span>
              <strong>WILD SPEED</strong>
              <small>MOTORS / JAPAN</small>
            </span>
          </Link>

          <nav className="v4-primary-nav" aria-label="Main navigation">
            {primary.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>

          <div className="v4-header-actions">
            <details className="v4-more-menu">
              <summary>More <ChevronDown size={14} /></summary>
              <div className="v4-more-panel">
                {secondary.map(({ href, label, Icon }) => (
                  <Link href={href} key={href}><Icon size={16} />{label}</Link>
                ))}
              </div>
            </details>

            <Link href="/contact" className="v4-contact-button">
              Contact <MessageCircle size={16} />
            </Link>

            <details className="v4-mobile-menu">
              <summary aria-label="Open navigation"><Menu size={20} /></summary>
              <div className="v4-mobile-panel">
                {[...primary, ...secondary.map(({ href, label }) => ({ href, label })), { href: "/contact", label: "Contact" }].map((item) => (
                  <Link href={item.href} key={item.href}>{item.label}</Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </header>

      <nav className="v4-mobile-quicknav" aria-label="Quick navigation">
        <Link href="/cars"><CarFront size={18} /><span>Cars</span></Link>
        <Link href="/budget"><CircleDollarSign size={18} /><span>Budget</span></Link>
        <Link href="/finance"><BadgeDollarSign size={18} /><span>Finance</span></Link>
        <Link href="/sell"><Repeat2 size={18} /><span>Sell</span></Link>
      </nav>
    </>
  );
}
