import type { Car } from "@/data/cars";

export type BudgetBay = {
  slug: string;
  title: string;
  shortTitle: string;
  min: number;
  max: number | null;
  description: string;
};

export const budgetBays: BudgetBay[] = [
  {
    slug: "up-to-2500",
    title: "Cars up to $2,500",
    shortTitle: "Up to $2,500",
    min: 0,
    max: 2500,
    description: "The entry-level bay for the most affordable cars in stock.",
  },
  {
    slug: "2501-to-5000",
    title: "Cars from $2,501 to $5,000",
    shortTitle: "$2,500–$5,000",
    min: 2501,
    max: 5000,
    description: "Affordable everyday cars grouped together in one easy-to-browse section.",
  },
  {
    slug: "5001-to-10000",
    title: "Cars from $5,001 to $10,000",
    shortTitle: "$5,000–$10,000",
    min: 5001,
    max: 10000,
    description: "A larger value-focused bay with more choice and newer vehicles.",
  },
  {
    slug: "10001-to-20000",
    title: "Cars from $10,001 to $20,000",
    shortTitle: "$10,000–$20,000",
    min: 10001,
    max: 20000,
    description: "Mid-range inventory with broader model, age and equipment choices.",
  },
  {
    slug: "20001-to-30000",
    title: "Cars from $20,001 to $30,000",
    shortTitle: "$20,000–$30,000",
    min: 20001,
    max: 30000,
    description: "Newer and more premium vehicles in a dedicated showroom bay.",
  },
  {
    slug: "over-30000",
    title: "Cars over $30,000",
    shortTitle: "$30,000+",
    min: 30001,
    max: null,
    description: "Premium, specialist and higher-value stock.",
  },
];

export function getBudgetBay(slug: string) {
  return budgetBays.find((bay) => bay.slug === slug);
}

export function getCarsForBudgetBay(slug: string, cars: Car[]) {
  const bay = getBudgetBay(slug);
  if (!bay) return [];
  return cars.filter((car) => car.price >= bay.min && (bay.max === null || car.price <= bay.max));
}
