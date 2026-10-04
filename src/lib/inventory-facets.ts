import type { Car } from "@/data/cars";

export type FacetKey =
  | "make"
  | "model"
  | "body"
  | "transmission"
  | "fuel"
  | "seats"
  | "budget";

export type FacetSelections = Record<FacetKey, string>;

export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

export type InventoryFacetResponse = {
  total: number;
  facets: Record<FacetKey, FacetOption[]>;
};

export const emptyFacetSelections: FacetSelections = {
  make: "",
  model: "",
  body: "",
  transmission: "",
  fuel: "",
  seats: "",
  budget: "",
};

const budgetOptions = [
  { value: "2500", label: "Up to $2,500" },
  { value: "5000", label: "Up to $5,000" },
  { value: "10000", label: "Up to $10,000" },
  { value: "20000", label: "Up to $20,000" },
  { value: "30000", label: "Up to $30,000" },
  { value: "40000", label: "Up to $40,000" },
  { value: "30000plus", label: "$30,000+" },
];

const seatOptions = [2, 4, 5, 7, 8];

function canonicalBody(value: string) {
  if (value.toLowerCase() === "saloon") return "Sedan";
  return value.trim();
}

function budgetMatches(car: Car, value: string) {
  if (!value) return true;
  if (value === "30000plus") return car.price > 30000;
  const max = Number(value);
  return Number.isFinite(max) ? car.price <= max : true;
}

function carMatches(
  car: Car,
  selections: FacetSelections,
  ignore?: FacetKey,
) {
  if (ignore !== "make" && selections.make && car.make !== selections.make) return false;
  if (ignore !== "model" && selections.model && car.model !== selections.model) return false;
  if (
    ignore !== "body" &&
    selections.body &&
    canonicalBody(car.body).toLowerCase() !== selections.body.toLowerCase()
  ) return false;
  if (
    ignore !== "transmission" &&
    selections.transmission &&
    car.transmission !== selections.transmission
  ) return false;
  if (ignore !== "fuel" && selections.fuel && car.fuel !== selections.fuel) return false;
  if (
    ignore !== "seats" &&
    selections.seats &&
    (!car.seats || car.seats < Number(selections.seats))
  ) return false;
  if (ignore !== "budget" && selections.budget && !budgetMatches(car, selections.budget)) return false;
  return true;
}

function countedOptions(
  cars: Car[],
  valueOf: (car: Car) => string,
  labelOf: (value: string) => string = (value) => value,
) {
  const counts = new Map<string, number>();

  for (const car of cars) {
    const value = valueOf(car).trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: labelOf(value), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildInventoryFacets(
  cars: Car[],
  selections: Partial<FacetSelections> = {},
): InventoryFacetResponse {
  const selected: FacetSelections = { ...emptyFacetSelections, ...selections };

  const forFacet = (facet: FacetKey) =>
    cars.filter((car) => carMatches(car, selected, facet));

  const makes = countedOptions(forFacet("make"), (car) => car.make);

  const modelBase = selected.make
    ? forFacet("model").filter((car) => car.make === selected.make)
    : [];
  const models = countedOptions(modelBase, (car) => car.model)
    .sort((a, b) => a.label.localeCompare(b.label));

  const bodies = countedOptions(
    forFacet("body"),
    (car) => canonicalBody(car.body),
  );

  const transmissions = countedOptions(
    forFacet("transmission"),
    (car) => car.transmission,
  );

  const fuels = countedOptions(forFacet("fuel"), (car) => car.fuel);

  const seatsBase = forFacet("seats");
  const seats = seatOptions
    .map((minimum) => ({
      value: String(minimum),
      label: minimum + "+",
      count: seatsBase.filter((car) => (car.seats ?? 0) >= minimum).length,
    }))
    .filter((option) => option.count > 0);

  const budgetBase = forFacet("budget");
  const budgets = budgetOptions
    .map((option) => ({
      ...option,
      count: budgetBase.filter((car) => budgetMatches(car, option.value)).length,
    }))
    .filter((option) => option.count > 0);

  return {
    total: cars.filter((car) => carMatches(car, selected)).length,
    facets: {
      make: makes,
      model: models,
      body: bodies,
      transmission: transmissions,
      fuel: fuels,
      seats,
      budget: budgets,
    },
  };
}
