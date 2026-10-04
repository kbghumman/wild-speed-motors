import type { Car } from "@/data/cars";
import { manufacturerNames } from "@/data/manufacturers";
import { modelsByManufacturer } from "@/data/models";

export type SmartSearchIntent = {
  query: string;
  maxPrice?: number;
  minPrice?: number;
  targetPrice?: number;
  minSeats?: number;
  doors?: number;
  maxMileage?: number;
  minYear?: number;
  maxYear?: number;
  make?: string;
  model?: string;
  bodies: string[];
  fuels: string[];
  excludedFuels: string[];
  transmissions: string[];
  drivetrains: string[];
  requiredFeatures: string[];
  exteriorColors: string[];
  softTags: string[];
  understood: string[];
};

export type SmartCarMatch = {
  car: Car;
  score: number;
  reasons: string[];
  gaps: string[];
};

export type SmartSearchResult = {
  intent: SmartSearchIntent;
  exactMatches: SmartCarMatch[];
  nearMatches: SmartCarMatch[];
};

const numberWords: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

const bodyAliases: Array<[string, string[]]> = [
  ["SUV", ["suv", "crossover"]],
  ["4x4", ["4x4", "off road", "off-road"]],
  ["Minivan", ["minivan", "mini van", "people carrier", "mpv"]],
  ["Van", ["van"]],
  ["Hatchback", ["hatchback", "hatch"]],
  ["Sedan", ["sedan", "saloon"]],
  ["Coupe", ["coupe"]],
  ["Roadster", ["roadster", "convertible", "cabriolet"]],
  ["Wagon", ["wagon", "estate"]],
  ["Kei", ["kei", "kei car"]],
  ["Pickup", ["pickup", "pick up", "truck"]],
];

const fuelAliases: Array<[string, string[]]> = [
  ["Plug-in Hybrid", ["plug in hybrid", "plug-in hybrid", "phev"]],
  ["Hybrid", ["hybrid"]],
  ["Electric", ["electric", "ev", "battery car"]],
  ["Diesel", ["diesel"]],
  ["Petrol", ["petrol", "gasoline", "gas car"]],
];

const transmissionAliases: Array<[string, string[]]> = [
  ["Automatic", ["automatic", "auto"]],
  ["Manual", ["manual", "stick shift", "stick"]],
  ["CVT", ["cvt"]],
  ["DCT", ["dct", "dual clutch"]],
];

const drivetrainAliases: Array<[string, string[]]> = [
  ["AWD", ["awd", "all wheel drive", "all-wheel drive"]],
  ["4WD", ["4wd", "four wheel drive", "four-wheel drive"]],
  ["RWD", ["rwd", "rear wheel drive", "rear-wheel drive"]],
  ["FWD", ["fwd", "front wheel drive", "front-wheel drive"]],
];

const featureAliases: Array<[string, string[]]> = [
  ["Apple CarPlay", ["apple carplay", "carplay"]],
  ["Android Auto", ["android auto"]],
  ["Navigation", ["navigation", "nav"]],
  ["Backup camera", ["backup camera", "reverse camera", "reversing camera"]],
  ["360 camera", ["360 camera", "360 degree camera", "around view"]],
  ["Leather seats", ["leather", "leather seats"]],
  ["Heated seats", ["heated seats", "seat heaters"]],
  ["Sunroof", ["sunroof", "moonroof", "panoramic roof"]],
  ["Power sliding doors", ["sliding doors", "power sliding doors"]],
  ["Cruise control", ["cruise control"]],
  ["Adaptive cruise", ["adaptive cruise", "acc"]],
  ["Lane assist", ["lane assist", "lane keeping", "lane keep"]],
  ["Parking sensors", ["parking sensors", "parking sensor"]],
  ["Bluetooth", ["bluetooth"]],
  ["Keyless entry", ["keyless entry"]],
  ["Push-button start", ["push button start", "push start"]],
  ["ETC", ["etc card", "etc reader", "etc"]],
];

const colorAliases: Array<[string, string[]]> = [
  ["Black", ["black"]], ["White", ["white", "pearl white"]], ["Silver", ["silver"]],
  ["Gray", ["gray", "grey"]], ["Blue", ["blue"]], ["Red", ["red"]],
  ["Green", ["green"]], ["Brown", ["brown"]], ["Beige", ["beige"]],
  ["Yellow", ["yellow"]], ["Orange", ["orange"]], ["Purple", ["purple"]],
];

const premiumBrands = new Set([
  "BMW","Mercedes-Benz","Audi","Lexus","Porsche","Jaguar","Land Rover","Volvo",
  "Cadillac","Bentley","Aston Martin","Ferrari","Lamborghini","Maserati",
  "McLaren","Rolls-Royce",
]);

const sportyModels = new Set([
  "86","GR86","Supra","GT-R","Skyline GT-R","Fairlady Z","Silvia","180SX",
  "NSX","S2000","S660","Civic Type R","Integra Type R","Lancer Evolution",
  "WRX","WRX STI","BRZ","Roadster","Roadster RF","RX-7","Savanna RX-7","RX-8",
  "Z4","M2","M3","M4","M5","AMG GT","TT","TTS","TT RS","R8","911",
  "718 Boxster","718 Cayman","Boxster","Cayman","A110","Elise","Exige","Emira",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[-_/]+/g, " ")
    .replace(/[^a-z0-9$.,+\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
}

function containsPhrase(query: string, phrase: string) {
  const normalizedPhrase = normalize(phrase);
  const pattern = new RegExp(
    "(?:^|\\b)" + escapeRegExp(normalizedPhrase).replace(/\\ /g, "\\s+") + "(?:\\b|$)",
    "i",
  );
  return pattern.test(query);
}

function numberFromToken(token: string) {
  const cleaned = token.toLowerCase().replace(/,/g, "");
  if (numberWords[cleaned]) return numberWords[cleaned];
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function amountFrom(raw: string, suffix?: string) {
  const base = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(base)) return undefined;
  return suffix && /^(k|grand|thousand)$/i.test(suffix) ? base * 1000 : base;
}

function firstAliasMatches(query: string, groups: Array<[string, string[]]>) {
  return groups
    .filter(([, aliases]) => aliases.some((alias) => containsPhrase(query, alias)))
    .map(([canonical]) => canonical);
}

function extractEngineLitres(engine?: string) {
  if (!engine) return undefined;
  const match = engine.match(/(\d(?:\.\d)?)\s*l/i);
  return match ? Number(match[1]) : undefined;
}

function featureSet(car: Car) {
  return new Set((car.features ?? []).map((feature) => feature.toLowerCase()));
}

export function parseSmartSearch(rawQuery: string, liveCars: Car[] = []): SmartSearchIntent {
  const query = normalize(rawQuery);
  const understood: string[] = [];
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  let targetPrice: number | undefined;

  const between = query.match(
    /(?:between|from)\s*\$?\s*([\d,.]+)\s*(k|grand|thousand)?\s*(?:and|to|-)\s*\$?\s*([\d,.]+)\s*(k|grand|thousand)?/,
  );
  if (between) {
    minPrice = amountFrom(between[1], between[2]);
    maxPrice = amountFrom(between[3], between[4]);
  }

  if (!maxPrice) {
    const maxMatch = query.match(
      /(?:under|below|less than|no more than|at most|up to|max(?:imum)?(?: budget)?|budget(?: of| is)?)\s*\$?\s*([\d,.]+)\s*(k|grand|thousand)?/,
    );
    if (maxMatch) maxPrice = amountFrom(maxMatch[1], maxMatch[2]);
  }

  if (!minPrice) {
    const minMatch = query.match(
      /(?:over|above|more than|at least|min(?:imum)?)\s*\$?\s*([\d,.]+)\s*(k|grand|thousand)?/,
    );
    if (minMatch) minPrice = amountFrom(minMatch[1], minMatch[2]);
  }

  const aroundMatch = query.match(
    /(?:around|about|roughly|approximately|close to)\s*\$?\s*([\d,.]+)\s*(k|grand|thousand)?/,
  );
  if (aroundMatch) targetPrice = amountFrom(aroundMatch[1], aroundMatch[2]);

  if (!maxPrice && !minPrice && !targetPrice) {
    const dollarMatch = query.match(/\$\s*([\d,.]+)\s*(k|grand|thousand)?/);
    if (dollarMatch && /budget/.test(query)) maxPrice = amountFrom(dollarMatch[1], dollarMatch[2]);
  }

  if (minPrice !== undefined) understood.push("$" + minPrice.toLocaleString() + "+");
  if (maxPrice !== undefined) understood.push("up to $" + maxPrice.toLocaleString());
  if (targetPrice !== undefined) understood.push("around $" + targetPrice.toLocaleString());

  const countToken = "(\\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)";
  const seatRegexes = [
    new RegExp(countToken + "\\s*(?:people|persons|passengers|seats?|seater)"),
    new RegExp("(?:family|group)\\s+of\\s+" + countToken),
    new RegExp("(?:for|fit|fits|carry|carries)\\s+" + countToken + "\\s*(?:people|persons|passengers)?"),
  ];

  let minSeats: number | undefined;
  for (const regex of seatRegexes) {
    const match = query.match(regex);
    if (match) {
      minSeats = numberFromToken(match[1]);
      if (minSeats) break;
    }
  }
  if (minSeats) understood.push(minSeats + "+ seats");

  const doorMatch = query.match(new RegExp(countToken + "\\s*doors?"));
  const doors = doorMatch ? numberFromToken(doorMatch[1]) : undefined;
  if (doors) understood.push(doors + " doors");

  let maxMileage: number | undefined;
  const mileageMatch = query.match(
    /(?:under|below|less than|up to|max(?:imum)?)\s*([\d,.]+)\s*(k|thousand)?\s*(?:km|kilometres|kilometers|kms)/,
  );
  if (mileageMatch) {
    maxMileage = amountFrom(
      mileageMatch[1],
      mileageMatch[2] === "k" || mileageMatch[2] === "thousand" ? "k" : undefined,
    );
    if (maxMileage) understood.push("under " + maxMileage.toLocaleString() + " km");
  }

  let minYear: number | undefined;
  let maxYear: number | undefined;
  const newerMatch = query.match(/(?:newer than|after|from)\s*(20\d{2}|19\d{2})|(?:20\d{2}|19\d{2})\s*(?:or newer|and newer|onwards|or later)/);
  if (newerMatch) {
    const token = newerMatch[1] ?? newerMatch[0].match(/(?:19|20)\d{2}/)?.[0];
    if (token) minYear = Number(token);
  }
  const olderMatch = query.match(/(?:older than|before)\s*(20\d{2}|19\d{2})|(?:20\d{2}|19\d{2})\s*(?:or older|and older|or earlier)/);
  if (olderMatch) {
    const token = olderMatch[1] ?? olderMatch[0].match(/(?:19|20)\d{2}/)?.[0];
    if (token) maxYear = Number(token);
  }
  if (minYear) understood.push(minYear + " or newer");
  if (maxYear) understood.push(maxYear + " or older");

  const liveMakes = [...new Set(liveCars.map((car) => car.make).filter(Boolean))];
  const makeCandidates = [...new Set([...liveMakes, ...manufacturerNames])]
    .sort((a, b) => b.length - a.length);
  const make = makeCandidates.find((brand) => containsPhrase(query, brand));
  if (make) understood.push(make);

  let model: string | undefined;
  const liveModels = liveCars
    .filter((car) => !make || car.make === make)
    .map((car) => car.model)
    .filter(Boolean);
  const catalogModels = make ? modelsByManufacturer[make] ?? [] : Object.values(modelsByManufacturer).flat();
  const modelCandidates = [...new Set([...liveModels, ...catalogModels])];
  for (const candidate of modelCandidates.slice().sort((a, b) => b.length - a.length)) {
    const normalizedModel = normalize(candidate);
    if (/^\d{1,2}$/.test(normalizedModel)) {
      if (make && containsPhrase(query, make + " " + candidate)) {
        model = candidate;
        break;
      }
      continue;
    }
    if (containsPhrase(query, candidate)) {
      model = candidate;
      break;
    }
  }
  if (model) understood.push(model);

  const bodies = firstAliasMatches(query, bodyAliases);
  const fuels = firstAliasMatches(query, fuelAliases);
  const transmissions = firstAliasMatches(query, transmissionAliases);
  const drivetrains = firstAliasMatches(query, drivetrainAliases);
  const requiredFeatures = firstAliasMatches(query, featureAliases);
  const exteriorColors = firstAliasMatches(query, colorAliases);

  for (const value of [...bodies, ...fuels, ...transmissions, ...drivetrains, ...requiredFeatures, ...exteriorColors]) {
    if (!understood.includes(value)) understood.push(value);
  }

  const excludedFuels = fuelAliases
    .filter(([, aliases]) =>
      aliases.some((alias) =>
        new RegExp("(?:no|not|without|anything but)\\s+" + escapeRegExp(normalize(alias))).test(query),
      ),
    )
    .map(([canonical]) => canonical)
    .filter((fuel) => !fuels.includes(fuel));

  for (const fuel of excludedFuels) understood.push("no " + fuel.toLowerCase());

  const softTags: string[] = [];
  const softGroups: Array<[string, string[]]> = [
    ["family", ["family", "kids", "children", "child friendly", "practical"]],
    ["winter", ["snow", "winter", "ski", "mountain", "mountains"]],
    ["city", ["city", "easy to park", "compact", "small car"]],
    ["economy", ["economical", "fuel efficient", "fuel-efficient", "cheap to run", "good mpg", "low running cost"]],
    ["sporty", ["sporty", "performance", "fast", "fun to drive"]],
    ["luxury", ["luxury", "premium", "upmarket"]],
    ["cargo", ["cargo", "luggage", "boot space", "storage space"]],
    ["touring", ["road trip", "long drive", "highway", "motorway"]],
    ["easy", ["first car", "new driver", "easy to drive"]],
  ];

  for (const [tag, aliases] of softGroups) {
    if (aliases.some((alias) => containsPhrase(query, alias))) {
      softTags.push(tag);
      const label =
        tag === "winter" ? "snow / winter use" :
        tag === "economy" ? "low running costs" :
        tag === "easy" ? "easy to drive" :
        tag;
      understood.push(label);
    }
  }

  return {
    query: rawQuery, minPrice, maxPrice, targetPrice, minSeats, doors, maxMileage,
    minYear, maxYear, make, model, bodies, fuels, excludedFuels, transmissions,
    drivetrains, requiredFeatures, exteriorColors, softTags, understood,
  };
}

function evaluateCar(car: Car, intent: SmartSearchIntent): SmartCarMatch {
  const reasons: string[] = [];
  const gaps: string[] = [];
  let score = 0;

  const fail = (message: string, penalty = 20) => {
    gaps.push(message);
    score -= penalty;
  };

  if (intent.maxPrice !== undefined) {
    if (car.price <= intent.maxPrice) reasons.push("within $" + intent.maxPrice.toLocaleString() + " budget");
    else fail("$" + car.price.toLocaleString() + " is over budget", Math.min(40, 10 + Math.round((car.price - intent.maxPrice) / 500)));
  }
  if (intent.minPrice !== undefined) {
    if (car.price >= intent.minPrice) reasons.push("above $" + intent.minPrice.toLocaleString());
    else fail("below your minimum price", 10);
  }
  if (intent.targetPrice !== undefined) {
    const difference = Math.abs(car.price - intent.targetPrice);
    score += Math.max(0, 14 - Math.round(difference / 500));
    if (difference <= Math.max(1000, intent.targetPrice * 0.2)) reasons.push("close to your target price");
  }

  if (intent.minSeats !== undefined) {
    if (car.seats != null && car.seats >= intent.minSeats) {
      reasons.push(car.seats + " seats");
      score += 8;
    } else if (car.seats == null) {
      fail("seating capacity not listed", 25);
    } else {
      fail("only " + car.seats + " seats", 35);
    }
  }

  if (intent.doors !== undefined) {
    if (car.doors === intent.doors) reasons.push(car.doors + " doors");
    else if (car.doors == null) fail("door count not listed", 12);
    else fail(car.doors + " doors", 15);
  }

  if (intent.maxMileage !== undefined) {
    if (car.mileage <= intent.maxMileage) reasons.push(car.mileage.toLocaleString() + " km");
    else fail(car.mileage.toLocaleString() + " km is over your limit", 18);
  }

  if (intent.minYear !== undefined) {
    if (car.year >= intent.minYear) reasons.push(car.year + " model");
    else fail(car.year + " is older than requested", 18);
  }
  if (intent.maxYear !== undefined) {
    if (car.year <= intent.maxYear) reasons.push(car.year + " model");
    else fail(car.year + " is newer than requested", 12);
  }

  if (intent.make) {
    if (car.make === intent.make) { reasons.push(car.make); score += 6; }
    else fail("not a " + intent.make, 30);
  }
  if (intent.model) {
    if (car.model.toLowerCase() === intent.model.toLowerCase()) { reasons.push(car.model); score += 8; }
    else fail("not a " + intent.model, 35);
  }

  if (intent.bodies.length) {
    const bodyMatch = intent.bodies.some((body) =>
      body === "Sedan"
        ? ["Sedan", "Saloon"].includes(car.body)
        : car.body.toLowerCase() === body.toLowerCase(),
    );
    if (bodyMatch) reasons.push(car.body);
    else fail("body type differs", 24);
  }

  if (intent.fuels.length) {
    if (intent.fuels.includes(car.fuel)) reasons.push(car.fuel);
    else fail("fuel type differs", 22);
  }
  if (intent.excludedFuels.includes(car.fuel)) fail("uses " + car.fuel, 28);

  if (intent.transmissions.length) {
    if (intent.transmissions.includes(car.transmission)) reasons.push(car.transmission);
    else fail("transmission differs", 24);
  }

  if (intent.drivetrains.length) {
    if (car.drivetrain && intent.drivetrains.includes(car.drivetrain)) reasons.push(car.drivetrain);
    else fail("drivetrain differs or is not listed", 24);
  }

  if (intent.exteriorColors.length) {
    const color = (car.exteriorColor ?? "").toLowerCase();
    if (intent.exteriorColors.some((wanted) => color.includes(wanted.toLowerCase()))) {
      reasons.push(car.exteriorColor || intent.exteriorColors[0]);
    } else fail("color differs or is not listed", 12);
  }

  const features = featureSet(car);
  for (const requiredFeature of intent.requiredFeatures) {
    if (features.has(requiredFeature.toLowerCase())) {
      reasons.push(requiredFeature);
      score += 3;
    } else fail("missing " + requiredFeature.toLowerCase(), 14);
  }

  for (const tag of intent.softTags) {
    if (tag === "family") {
      if ((car.seats ?? 0) >= 5) { score += 4; reasons.push("family-size seating"); }
      if (["Minivan","SUV","Wagon","Van"].includes(car.body)) score += 4;
      if (features.has("power sliding doors")) score += 2;
      if (features.has("backup camera")) score += 1;
    }
    if (tag === "winter") {
      if (["AWD","4WD"].includes(car.drivetrain ?? "")) {
        score += 8;
        reasons.push((car.drivetrain ?? "") + " for winter traction");
      }
      if (["SUV","4x4"].includes(car.body)) score += 2;
    }
    if (tag === "city") {
      if (["Kei","Hatchback"].includes(car.body)) { score += 6; reasons.push("city-friendly body"); }
      const litres = extractEngineLitres(car.engine);
      if (litres !== undefined && litres <= 1.5) score += 2;
    }
    if (tag === "economy") {
      if (["Hybrid","Plug-in Hybrid","Electric"].includes(car.fuel)) {
        score += 8;
        reasons.push(car.fuel + " powertrain");
      }
      const litres = extractEngineLitres(car.engine);
      if (litres !== undefined && litres <= 1.5) score += 3;
    }
    if (tag === "sporty") {
      if (sportyModels.has(car.model)) { score += 9; reasons.push("performance-oriented model"); }
      if (["Coupe","Roadster"].includes(car.body)) score += 4;
    }
    if (tag === "luxury") {
      if (premiumBrands.has(car.make)) { score += 7; reasons.push("premium brand"); }
      if (features.has("leather seats")) score += 2;
    }
    if (tag === "cargo") {
      if (["SUV","Wagon","Minivan","Van"].includes(car.body)) {
        score += 6;
        reasons.push("practical cargo body");
      }
    }
    if (tag === "touring") {
      if (["SUV","Wagon","Sedan","Saloon"].includes(car.body)) score += 4;
      if (features.has("cruise control") || features.has("adaptive cruise")) score += 2;
    }
    if (tag === "easy") {
      if (["Automatic","CVT","DCT"].includes(car.transmission)) {
        score += 5;
        reasons.push("automatic transmission");
      }
      if (["Kei","Hatchback"].includes(car.body)) score += 2;
      if (features.has("backup camera")) score += 2;
    }
  }

  if (!gaps.length) score += 100;

  return {
    car,
    score,
    reasons: [...new Set(reasons)].slice(0, 5),
    gaps,
  };
}

export function runSmartCarSearch(cars: Car[], query: string): SmartSearchResult {
  const intent = parseSmartSearch(query, cars);
  const evaluated = cars.map((car) => evaluateCar(car, intent));

  const exactMatches = evaluated
    .filter((match) => match.gaps.length === 0)
    .sort((a, b) => b.score - a.score);

  const nearMatches = evaluated
    .filter((match) => match.gaps.length > 0)
    .sort((a, b) => {
      if (a.gaps.length !== b.gaps.length) return a.gaps.length - b.gaps.length;
      return b.score - a.score;
    })
    .slice(0, 6);

  return { intent, exactMatches, nearMatches };
}
