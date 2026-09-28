import Link from "next/link";
import {
  ArrowUpRight,
  BadgeDollarSign,
  CarFront,
  CircleDollarSign,
  Info,
  Menu,
  MessageCircle,
  Repeat2,
  Search,
  Shapes,
} from "lucide-react";

const showroomLinks = [
  { href: "/cars", label: "Inventory", copy: "Every car in stock", Icon: CarFront },
  { href: "/budget", label: "Budget showroom", copy: "Walk the lot by price", Icon: CircleDollarSign },
  { href: "/brands", label: "Brands", copy: "Browse manufacturers", Icon: Shapes },
  { href: "/collections", label: "Collections", copy: "Curated ways to shop", Icon: Shapes },
];

const supportLinks = [
  { href: "/finance", label: "Finance", Icon: BadgeDollarSign },
  { href: "/sell", label: "Sell or trade", Icon: Repeat2 },
  { href: "/about", label: "About", Icon: Info },
  { href: "/contact", label: "Contact", Icon: MessageCircle },
];

export default function Header() {
  return (
    <header className="ws-header">
      <div className="container ws-header-shell">
        <div className="ws-header-left">
          <details className="ws-explore">
            <summary>
              <Menu size={18} />
              <span>Explore</span>
            </summary>

            <div className="ws-mega-menu">
              <div className="ws-mega-intro">
                <span className="ws-mono-label">WILD SPEED / JAPAN</span>
                <h2>Move through the showroom your way.</h2>
                <p>
                  Inventory first. Secondary tools stay one level deeper so the site
                  remains fast to scan and easy to learn.
                </p>
              </div>

              <div className="ws-mega-main">
                {showroomLinks.map(({ href, label, copy, Icon }) => (
                  <Link href={href} key={href} className="ws-mega-card">
                    <Icon size={20} />
                    <span>
                      <strong>{label}</strong>
                      <small>{copy}</small>
                    </span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </div>

              <div className="ws-mega-support">
                <span className="ws-mono-label">Ownership</span>
                {supportLinks.map(({ href, label, Icon }) => (
                  <Link href={href} key={href}>
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </details>

          <Link href="/cars" className="ws-inventory-link">
            Inventory
            <small>View all cars</small>
          </Link>
        </div>

        <Link href="/" className="ws-wordmark" aria-label="Wild Speed Motors home">
          <strong>WILD SPEED</strong>
          <span>MOTORS / JAPAN</span>
        </Link>

        <div className="ws-header-actions">
          <Link href="/cars" className="ws-icon-action" aria-label="Search inventory">
            <Search size={19} />
          </Link>
          <Link href="/contact" className="ws-contact-action">
            Contact
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
