export type Car = {
  id?: string;
  slug: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  price: number;
  monthly: number;
  fuel: string;
  transmission: string;
  body: string;
  engine: string;
  seats?: number | null;
  doors?: number | null;
  image: string;
  images?: string[];
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  shakenExpiry?: string;
  location?: string;
  condition?: string;
  description?: string;
  features?: string[];
  status?: string;
  stockNumber?: string;
  chassisNumber?: string;
};

/**
 * Production inventory never comes from this file.
 * The database is the single source of truth for all customer-facing stock.
 */
export const cars: Car[] = [];
