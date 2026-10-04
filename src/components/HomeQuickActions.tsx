import Link from "next/link";
import { ArrowRight, Building2, CarFront, CircleDollarSign, Badge } from "lucide-react";

const actions = [
  { href: "/cars", icon: CarFront, title: "All cars", copy: "See every live vehicle" },
  { href: "/budget", icon: CircleDollarSign, title: "Shop by budget", copy: "Start with what you want to spend" },
  { href: "/brands", icon: Badge, title: "Popular brands", copy: "Browse by manufacturer" },
  { href: "/contact", icon: Building2, title: "Request a car", copy: "Tell us what you are looking for" },
];

export default function HomeQuickActions() {
  return (
    <section className="v10-quick-section">
      <div className="container">
        <div className="v10-quick-grid">
          {actions.map(({ href, icon: Icon, title, copy }) => (
            <Link key={href} href={href}>
              <span className="v10-quick-icon"><Icon size={20} /></span>
              <span><strong>{title}</strong><small>{copy}</small></span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
