import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import VehicleUploadForm from "@/components/admin/VehicleUploadForm";

export const metadata: Metadata = {
  title: "Add Vehicle | Wild Speed Motors Dealer Console",
  robots: { index: false, follow: false },
};

export default function NewVehiclePage() {
  return (
    <AdminShell title="Add vehicle" eyebrow="Inventory / New listing">
      <VehicleUploadForm />
    </AdminShell>
  );
}
