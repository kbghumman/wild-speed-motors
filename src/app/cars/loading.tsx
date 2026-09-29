export default function CarsLoading() {
  return (
    <main className="v4-loading-page">
      <div className="container">
        <div className="v4-loading-hero" />
        <div className="v4-loading-layout">
          <div className="v4-loading-filter" />
          <div className="cars-grid">
            {[0,1,2,3,4,5].map((item) => <div className="v4-loading-card" key={item} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
