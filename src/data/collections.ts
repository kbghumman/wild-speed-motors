import type { Car } from "@/data/cars";

export type Collection = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  rule: (car: Car) => boolean;
};

const sportsModels = new Set([
  "86","GR86","Supra","GT-R","Skyline GT-R","Fairlady Z","Silvia","180SX",
  "NSX","S2000","S660","Civic Type R","Integra Type R","Lancer Evolution",
  "WRX","WRX STI","BRZ","Roadster","Roadster RF","RX-7","Savanna RX-7","RX-8",
  "Z4","M2","M3","M4","M5","AMG GT","TT","TTS","TT RS","R8","911",
  "718 Boxster","718 Cayman","Boxster","Cayman","A110","Elise","Exige","Emira",
  "Huracan","Aventador","Revuelto","458 Italia","488 GTB","F8 Tributo","296 GTB",
  "570S","720S","750S","Artura"
]);

export const collections: Collection[] = [
  {
    slug: "under-2000",
    title: "Cars under $2,000",
    shortTitle: "Under $2,000",
    eyebrow: "Budget buys",
    description: "Low-cost used cars for buyers who want to keep the purchase price as low as possible.",
    rule: (car) => typeof car.priceUsd === "number" && car.priceUsd <= 2000,
  },
  {
    slug: "under-5000",
    title: "Cars under $5,000",
    shortTitle: "Under $5,000",
    eyebrow: "Affordable cars",
    description: "Affordable used cars that balance purchase price, practicality and everyday usability.",
    rule: (car) => typeof car.priceUsd === "number" && car.priceUsd <= 5000,
  },
  {
    slug: "sports-cars",
    title: "Sports cars",
    shortTitle: "Sports cars",
    eyebrow: "Performance",
    description: "Performance-focused coupes, roadsters, hot hatches and enthusiast cars.",
    rule: (car) => sportsModels.has(car.model) || car.body === "Coupe" || car.body === "Roadster",
  },
  {
    slug: "classic-cars",
    title: "Classic & historic cars",
    shortTitle: "Classic cars",
    eyebrow: "Older favourites",
    description: "Older and collectible vehicles, including recognised Japanese and imported classics.",
    rule: (car) => car.year <= 2000,
  },
  {
    slug: "suv-4x4",
    title: "SUVs & 4x4s",
    shortTitle: "SUVs & 4x4s",
    eyebrow: "Utility",
    description: "SUVs and four-wheel-drive vehicles for space, comfort and capability.",
    rule: (car) => car.body === "SUV" || car.body === "4x4",
  },
  {
    slug: "hybrid-electric",
    title: "Hybrid & electric cars",
    shortTitle: "Hybrid & electric",
    eyebrow: "Electrified",
    description: "Hybrid, plug-in hybrid and fully electric vehicles.",
    rule: (car) => ["Hybrid", "Plug-in Hybrid", "Electric"].includes(car.fuel),
  },
];

export const featuredCollections = collections.slice(0, 6);

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getCarsForCollection(slug: string, cars: Car[]) {
  const collection = getCollection(slug);
  return collection ? cars.filter(collection.rule) : [];
}
