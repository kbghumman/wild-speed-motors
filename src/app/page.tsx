import Link from "next/link";
import { BadgeCheck, CarFront, PoundSterling, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import CarCard from "@/components/CarCard";
import PopularBrands from "@/components/PopularBrands";
import { cars } from "@/data/cars";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="hero-kicker">Quality cars. Straightforward buying.</div>
              <h1>Find your next car.</h1>
              <p>
                Hand-picked used cars, clear pricing, flexible finance and a buying
                experience built around you.
              </p>
              <div className="hero-actions">
                <Link href="/cars" className="button-primary">Browse used cars</Link>
                <a href="#sell" className="button-secondary">Sell your car</a>
              </div>
            </div>
          </div>
        </section>

        <section className="search-wrap">
          <div className="container">
            <SearchPanel />

            <div className="trust-row">
              <div className="trust-item">
                <span className="trust-icon"><BadgeCheck size={19} /></span>
                <div><strong>Multi-point checked</strong><span>Every car is inspected before sale.</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><ShieldCheck size={19} /></span>
                <div><strong>Warranty options</strong><span>Extra reassurance after you drive away.</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><PoundSterling size={19} /></span>
                <div><strong>Flexible finance</strong><span>Explore payments that fit your budget.</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><CarFront size={19} /></span>
                <div><strong>Part exchange</strong><span>Use your current car towards your next one.</span></div>
              </div>
            </div>
          </div>
        </section>

        <PopularBrands />

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Latest stock</p>
                <h2 className="section-title">New arrivals</h2>
                <p className="section-copy">
                  A selection of the latest vehicles available at Wild Speed Motors.
                </p>
              </div>
              <Link href="/cars" className="button-secondary">View all cars</Link>
            </div>

            <div className="cars-grid">
              {cars.slice(0, 6).map((car) => <CarCard key={car.slug} car={car} />)}
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <p className="eyebrow">Find the right shape</p>
            <h2 className="section-title">Shop by body style</h2>
            <div className="body-grid" style={{ marginTop: 30 }}>
              {[
                ["SUV", "Practical, spacious and ready for everyday life"],
                ["Hatchback", "Easy to live with and easy to park"],
                ["Saloon", "Comfort, refinement and long-distance ability"],
                ["Coupe", "Style-first cars with a sportier feel"],
              ].map(([title, copy]) => (
                <Link href="/cars" className="body-card" key={title}>
                  <CarFront size={28} />
                  <strong>{title}</strong>
                  <span>{copy}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="finance">
          <div className="container split-panel">
            <div className="split-copy">
              <p className="eyebrow" style={{ color: "#93c5fd" }}>Finance made clearer</p>
              <h2>Start with the monthly budget that suits you.</h2>
              <p>
                Compare cars by estimated monthly payment and speak with us about
                finance options. Figures shown on this demo site are indicative only.
              </p>
              <Link href="/cars" className="button-primary">Shop by monthly budget</Link>
            </div>
            <div className="split-image" />
          </div>
        </section>

        <section className="section section-soft" id="sell">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Sell or part exchange</p>
                <h2 className="section-title">Your car could be your deposit.</h2>
                <p className="section-copy">
                  Tell us what you drive and we can discuss a valuation or part exchange
                  against a car in stock.
                </p>
              </div>
              <a href="#contact" className="button-primary">Request a valuation</a>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container">
            <p className="eyebrow">Why Wild Speed Motors</p>
            <h2 className="section-title">A better way to buy used.</h2>

            <div className="why-grid">
              <div className="why-card">
                <Sparkles size={28} />
                <h3>Carefully selected stock</h3>
                <p>We focus on cars we would be comfortable recommending to our own customers.</p>
              </div>
              <div className="why-card">
                <Wrench size={28} />
                <h3>Prepared before sale</h3>
                <p>Condition, presentation and basic mechanical checks are part of our preparation process.</p>
              </div>
              <div className="why-card">
                <ShieldCheck size={28} />
                <h3>No-pressure service</h3>
                <p>Clear information, straightforward communication and time to make the right decision.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="container">
            <div className="cta-band">
              <div>
                <h2>Visit Wild Speed Motors</h2>
                <p>See the cars in person, arrange a test drive or speak with us about your next car.</p>
              </div>
              <a href="tel:+440000000000" className="button-dark">Call the showroom</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">
              <span className="brand-mark">WS</span>
              <span className="brand-copy"><strong>WILD SPEED</strong><span>MOTORS</span></span>
            </div>
            <p>Quality used cars with a modern, straightforward buying experience.</p>
          </div>
          <div>
            <h4>Cars</h4>
            <p><Link href="/cars">Used cars</Link><br /><a href="#finance">Finance</a><br /><a href="#sell">Part exchange</a></p>
          </div>
          <div>
            <h4>Company</h4>
            <p><a href="#about">About us</a><br /><a href="#contact">Contact</a><br />Customer care</p>
          </div>
          <div>
            <h4>Showroom</h4>
            <p>Address to be confirmed<br />Mon–Sat: 09:00–18:00<br />Sun: by appointment</p>
          </div>
        </div>
        <div className="container footer-bottom">
          © {new Date().getFullYear()} Wild Speed Motors. Demo content — replace contact, finance and legal information before launch.
        </div>
      </footer>
    </>
  );
}
