import type { ReactNode } from "react";

type BrandLogoProps = {
  brand: string;
  className?: string;
};

function Initials({ brand }: { brand: string }) {
  const initials = brand
    .split(/[\\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return <span className="brand-logo-initials">{initials}</span>;
}

export default function BrandLogo({ brand, className = "" }: BrandLogoProps) {
  const svgProps = {
    viewBox: "0 0 48 48",
    "aria-hidden": true,
    className: "brand-logo-svg",
  };

  let mark: ReactNode = null;

  switch (brand) {
    case "BMW":
      mark = (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="24" cy="24" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M24 13.5V24H13.5A10.5 10.5 0 0 1 24 13.5Z" fill="currentColor" opacity=".2" />
          <path d="M24 24h10.5A10.5 10.5 0 0 1 24 34.5V24Z" fill="currentColor" opacity=".2" />
        </svg>
      );
      break;
    case "Mercedes-Benz":
      mark = (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M24 7.5 27 23.5 40 34 24 28 8 34 21 23.5 24 7.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
      break;
    case "Audi":
      mark = (
        <svg {...svgProps}>
          {[12,20,28,36].map((cx) => <circle key={cx} cx={cx} cy="24" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.2" />)}
        </svg>
      );
      break;
    case "Toyota":
      mark = (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="18" ry="13" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <ellipse cx="24" cy="20.2" rx="8" ry="11" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="24" cy="17" rx="14.5" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
      break;
    case "Honda":
      mark = (
        <svg {...svgProps}>
          <rect x="8" y="8" width="32" height="32" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 13v19c0 3 2 4 4 4V25h8v11c2 0 4-1 4-4V13" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
      break;
    case "Mitsubishi":
      mark = (
        <svg {...svgProps}>
          <path d="M24 6 31.5 18 24 30 16.5 18 24 6Z" fill="currentColor" />
          <path d="M9 30 16.5 18 24 30 16.5 42 9 30Z" fill="currentColor" opacity=".9" />
          <path d="M39 30 31.5 18 24 30 31.5 42 39 30Z" fill="currentColor" opacity=".9" />
        </svg>
      );
      break;
    case "Nissan":
      mark = (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="2.1" />
          <rect x="6" y="19" width="36" height="10" rx="2" fill="currentColor" />
          <text x="24" y="26.4" textAnchor="middle" fontSize="6.1" fontWeight="700" fill="white" letterSpacing=".5">NISSAN</text>
        </svg>
      );
      break;
    case "Subaru":
      mark = (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="19" ry="12.5" fill="none" stroke="currentColor" strokeWidth="2.1" />
          <path d="m16 18 1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.5-2.6 1.5.5-3-2.2-2.1 3-.4L16 18Z" fill="currentColor" />
          {[["27","17"],["32","22"],["27","27"],["36","29"],["22","31"]].map(([x,y]) => <circle key={x+y} cx={x} cy={y} r="1.6" fill="currentColor" />)}
        </svg>
      );
      break;
    case "Mazda":
      mark = (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M10 17c6 1 10 4 14 11 4-7 8-10 14-11-2 9-7 15-14 19-7-4-12-10-14-19Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
      break;
    case "Lexus":
      mark = (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="19" ry="13" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M25 13 16 34h16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
      break;
    case "MINI":
      mark = (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="9.5" fill="none" stroke="currentColor" strokeWidth="2.1" />
          <path d="M14.5 18H4M14 22H7M14 26H9M33.5 18H44M34 22H41M34 26H39" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18.5 24h11" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
      break;
  }

  return (
    <span className={"brand-logo " + className} role="img" aria-label={brand + " badge"}>
      {mark ?? <Initials brand={brand} />}
    </span>
  );
}
