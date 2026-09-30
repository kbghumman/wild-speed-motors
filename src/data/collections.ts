import type { Car } from "@/data/cars";

export type CollectionTraits = Pick<Car, "model" | "body" | "year" | "fuel">;

export type Collection = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  rule: (car: CollectionTraits) => boolean;
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
    slug: "sports-cars",
    title: "Sports cars",
    shortTitle: "Sports cars",
    eyebrow: "Performance",
    description: "Recognised performance cars and roadsters from the live inventory.",
    rule: (car) => sportsModels.has(car.model) || car.body === "Roadster",
  },
  {
    slug: "classic-cars",
    title: "Classic & historic cars",
    shortTitle: "Classic cars",
    eyebrow: "Older favourites",
    description: "Older and collectible vehicles, including recognised Japanese and imported classics.",
    rule: (car) => car.year > 0 && car.year <= 2000,
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

export const featuredCollections = collections;

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getCarsForCollection(slug: string, cars: Car[]) {
  const collection = getCollection(slug);
  return collection ? cars.filter(collection.rule) : [];
}

export function getCollectionsForCar(car: CollectionTraits) {
  return collections.filter((collection) => collection.rule(car));
}
