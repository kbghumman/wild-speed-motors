import type { Car } from "@/data/cars";

export type BudgetBay = {
  slug: string;
  title: string;
  shortTitle: string;
  min: number;
  max: number;
  description: string;
};

export const budgetBays: BudgetBay[] = [
  {
    slug: "up-to-300000",
    title: "Cars up to ¥300,000",
    shortTitle: "Up to ¥300,000",
    min: 0,
    max: 300000,
    description: "The lowest-price bay for simple, affordable used cars.",
  },
  {
    slug: "300000-to-400000",
    title: "Cars from ¥300,001 to ¥400,000",
    shortTitle: "¥300k–¥400k",
    min: 300001,
    max: 400000,
    description: "A step up in choice while keeping the purchase price very low.",
  },
  {
    slug: "400000-to-800000",
    title: "Cars from ¥400,001 to ¥800,000",
    shortTitle: "¥400k–¥800k",
    min: 400001,
    max: 800000,
    description: "A strong value bay with more choice across popular Japanese models.",
  },
  {
    slug: "800000-to-1500000",
    title: "Cars from ¥800,001 to ¥1,500,000",
    shortTitle: "¥800k–¥1.5m",
    min: 800001,
    max: 1500000,
    description: "A broader showroom bay for newer, better-equipped and premium used cars.",
  },
];

export function getBudgetBay(slug: string) {
  return budgetBays.find((bay) => bay.slug === slug);
}

export function getCarsForBudgetBay(slug: string, cars: Car[]) {
  const bay = getBudgetBay(slug);
  return bay ? cars.filter((car) => car.price >= bay.min && car.price <= bay.max) : [];
}
