import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import VehicleUploadForm from "@/components/admin/VehicleUploadForm";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Add Vehicle | Wild Speed Motors Dealer Console",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  await requireStaff();

  return (
    <AdminShell title="Add vehicle" eyebrow="Inventory / New listing">
      <VehicleUploadForm />
    </AdminShell>
  );
}
