import type { Metadata } from "next";
import { DonationForm } from "./DonationForm";

export const metadata: Metadata = { title: "Give · Kingdom Culture Academy" };

export default function GivePage() {
  return <DonationForm />;
}
