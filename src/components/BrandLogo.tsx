const logoByBrand: Record<string, string> = {
  BMW: "/brand-logos/bmw.svg",
  "Mercedes-Benz": "/brand-logos/mercedes-benz.svg",
  Audi: "/brand-logos/audi.svg",
  Toyota: "/brand-logos/toyota.svg",
  Honda: "/brand-logos/honda.svg",
  Mitsubishi: "/brand-logos/mitsubishi.svg",
  Nissan: "/brand-logos/nissan.svg",
  Subaru: "/brand-logos/subaru.svg",
  Mazda: "/brand-logos/mazda.svg",
  Lexus: "/brand-logos/lexus.svg",
  MINI: "/brand-logos/mini.svg",
};

type BrandLogoProps = {
  brand: string;
  className?: string;
};

function Initials({ brand }: { brand: string }) {
  const initials = brand
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return <span className="brand-logo-initials">{initials}</span>;
}

export default function BrandLogo({ brand, className = "" }: BrandLogoProps) {
  const src = logoByBrand[brand];

  return (
    <span className={"brand-logo " + className} aria-hidden="true">
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="brand-logo-image"
        />
      ) : (
        <Initials brand={brand} />
      )}
    </span>
  );
}
