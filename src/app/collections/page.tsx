import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CollectionCards from "@/components/CollectionCards";

export default function CollectionsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="editorial-hero collections-page-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="eyebrow">Curated inventory</p>
              <h1>Shop by <span>personality.</span></h1>
              <p>Performance, classics, capability and electrified cars get their own dedicated spaces.</p>
            </div>
            <div className="hero-graphic collections-graphic">
              <span className="collection-shape shape-red" />
              <span className="collection-shape shape-gold" />
              <span className="collection-shape shape-green" />
              <span className="collection-shape shape-cyan" />
            </div>
          </div>
        </section>

        <CollectionCards />
      </main>
      <SiteFooter />
    </>
  );
}
