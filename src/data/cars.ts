export type Car = {
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
  image: string;
};

export const cars: Car[] = [
  {
    slug: "bmw-320i-m-sport",
    make: "BMW",
    model: "3 Series",
    trim: "320i M Sport",
    year: 2021,
    mileage: 28400,
    price: 3280000,
    monthly: 54800,
    fuel: "Petrol",
    transmission: "Automatic",
    body: "Saloon",
    engine: "2.0L",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "audi-a4-s-line",
    make: "Audi",
    model: "A4",
    trim: "S line",
    year: 2020,
    mileage: 35100,
    price: 2980000,
    monthly: 49800,
    fuel: "Diesel",
    transmission: "Automatic",
    body: "Saloon",
    engine: "2.0L",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "mercedes-a200-amg-line",
    make: "Mercedes-Benz",
    model: "A-Class",
    trim: "A200 AMG Line",
    year: 2021,
    mileage: 29750,
    price: 3180000,
    monthly: 52800,
    fuel: "Petrol",
    transmission: "Automatic",
    body: "Hatchback",
    engine: "1.3L",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "vw-golf-r-line",
    make: "Volkswagen",
    model: "Golf",
    trim: "R-Line",
    year: 2022,
    mileage: 22100,
    price: 2880000,
    monthly: 47800,
    fuel: "Petrol",
    transmission: "Automatic",
    body: "Hatchback",
    engine: "1.5L",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "toyota-rav4-design",
    make: "Toyota",
    model: "RAV4",
    trim: "Design Hybrid",
    year: 2021,
    mileage: 31300,
    price: 3680000,
    monthly: 59800,
    fuel: "Hybrid",
    transmission: "Automatic",
    body: "SUV",
    engine: "2.5L",
    image:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "range-rover-evoque-r-dynamic",
    make: "Land Rover",
    model: "Range Rover Evoque",
    trim: "R-Dynamic",
    year: 2020,
    mileage: 38600,
    price: 4280000,
    monthly: 69800,
    fuel: "Diesel",
    transmission: "Automatic",
    body: "SUV",
    engine: "2.0L",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80",
  },
];
