type CarVariant = "sports" | "suv" | "classic" | "electric" | "sedan";

const roofPath: Record<CarVariant, string> = {
  sports: "M64 72 C92 44 126 34 176 36 C210 38 238 50 258 70",
  suv: "M58 72 C76 42 102 28 154 28 L208 30 C232 36 248 52 260 70",
  classic: "M62 72 C84 48 116 38 158 38 C198 38 228 50 254 70",
  electric: "M60 72 C84 42 116 30 166 30 C208 30 236 44 258 70",
  sedan: "M58 72 C82 44 116 34 164 34 C206 34 236 48 260 70",
};

export function CarOutline({
  variant = "sedan",
  className = "",
}: {
  variant?: CarVariant;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 320 120" aria-hidden="true">
      <path d={roofPath[variant]} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M36 73 C48 68 60 66 77 66 H252 C270 66 282 73 286 86 H274 C270 100 258 108 244 108 C228 108 217 99 214 86 H102 C99 99 88 108 72 108 C56 108 45 99 42 86 H30 C30 80 32 76 36 73Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="72" cy="86" r="15" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="244" cy="86" r="15" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M118 66 L137 40 M201 66 L186 39" stroke="currentColor" strokeWidth="1.8" opacity=".62" />
      <path d="M106 76 H212" stroke="currentColor" strokeWidth="1.4" opacity=".35" />
    </svg>
  );
}

export function GarageBayArt({
  index,
  variant = "sedan",
}: {
  index: number;
  variant?: CarVariant;
}) {
  return (
    <div className="garage-bay-art" aria-hidden="true">
      <span className="garage-bay-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="garage-lights">
        <span />
        <span />
        <span />
      </div>
      <CarOutline variant={variant} className="garage-car-outline" />
      <div className="garage-floor">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
