import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand footer-brand" aria-label="Wild Speed Motors home">
            <span className="brand-mark"><span>WS</span></span>
            <span className="brand-copy"><strong>WILD SPEED</strong><span>MOTORS JAPAN</span></span>
          </Link>
          <p>Japan-based used cars with straightforward USD pricing for the U.S. military community.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <p><Link href="/cars">Used cars</Link><br /><Link href="/budget">Browse by budget</Link><br /><Link href="/brands">Brands</Link><br /><Link href="/collections">Collections</Link></p>
        </div>
        <div>
          <h4>Services</h4>
          <p><Link href="/finance">Finance</Link><br /><Link href="/sell">Sell your car</Link><br /><Link href="/contact">Contact</Link></p>
        </div>
        <div>
          <h4>Company</h4>
          <p><Link href="/about">About us</Link><br />Showroom details coming soon<br />Japan</p>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} Wild Speed Motors. Demo contact, finance and legal information must be confirmed before launch.
      </div>
    </footer>
  );
}
