export type InventoryStatus = "draft" | "live" | "reserved" | "sold" | "hidden";

export type VehicleDraft = {
  stockNumber: string;
  make: string;
  model: string;
  trim: string;
  year: string;
  mileage: string;
  priceUsd: string;
  monthlyUsd: string;
  chassisNumber: string;
  registrationNumber: string;
  fuel: string;
  transmission: string;
  drivetrain: string;
  body: string;
  engine: string;
  exteriorColor: string;
  interiorColor: string;
  shakenExpiry: string;
  location: string;
  condition: string;
  status: InventoryStatus;
  description: string;
  features: string[];
};

export const emptyVehicleDraft: VehicleDraft = {
  stockNumber: "",
  make: "",
  model: "",
  trim: "",
  year: "",
  mileage: "",
  priceUsd: "",
  monthlyUsd: "",
  chassisNumber: "",
  registrationNumber: "",
  fuel: "",
  transmission: "",
  drivetrain: "",
  body: "",
  engine: "",
  exteriorColor: "",
  interiorColor: "",
  shakenExpiry: "",
  location: "",
  condition: "",
  status: "draft",
  description: "",
  features: [],
};
