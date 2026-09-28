export type Manufacturer = {
  name: string;
  market: "Japan" | "Import";
};

export const manufacturers: Manufacturer[] = [
  // Japanese brands with current passenger/light-commercial sales in Japan
  { name: "Toyota", market: "Japan" },
  { name: "Lexus", market: "Japan" },
  { name: "Nissan", market: "Japan" },
  { name: "Honda", market: "Japan" },
  { name: "Mazda", market: "Japan" },
  { name: "Subaru", market: "Japan" },
  { name: "Suzuki", market: "Japan" },
  { name: "Daihatsu", market: "Japan" },
  { name: "Mitsubishi", market: "Japan" },
  { name: "Mitsuoka", market: "Japan" },

  // Imported passenger-car brands officially represented in Japan
  { name: "Abarth", market: "Import" },
  { name: "Alfa Romeo", market: "Import" },
  { name: "Alpine", market: "Import" },
  { name: "Aston Martin", market: "Import" },
  { name: "Audi", market: "Import" },
  { name: "Bentley", market: "Import" },
  { name: "BMW", market: "Import" },
  { name: "BYD", market: "Import" },
  { name: "Cadillac", market: "Import" },
  { name: "Chevrolet", market: "Import" },
  { name: "Citroën", market: "Import" },
  { name: "DS Automobiles", market: "Import" },
  { name: "Ferrari", market: "Import" },
  { name: "Fiat", market: "Import" },
  { name: "Hyundai", market: "Import" },
  { name: "Jaguar", market: "Import" },
  { name: "Jeep", market: "Import" },
  { name: "Lamborghini", market: "Import" },
  { name: "Land Rover", market: "Import" },
  { name: "Lotus", market: "Import" },
  { name: "Maserati", market: "Import" },
  { name: "McLaren", market: "Import" },
  { name: "Mercedes-Benz", market: "Import" },
  { name: "MINI", market: "Import" },
  { name: "Peugeot", market: "Import" },
  { name: "Porsche", market: "Import" },
  { name: "Renault", market: "Import" },
  { name: "Rolls-Royce", market: "Import" },
  { name: "smart", market: "Import" },
  { name: "Tesla", market: "Import" },
  { name: "Volkswagen", market: "Import" },
  { name: "Volvo", market: "Import" },
];

export const manufacturerNames = manufacturers
  .map((manufacturer) => manufacturer.name)
  .sort((a, b) => a.localeCompare(b));
