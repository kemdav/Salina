import { getUserPendingRequest } from "@/lib/actions/accreditation-requests";
import { redirect } from "next/navigation";
import { AccreditationForm } from "./accreditation-form";

export default async function AccreditationPage() {
  const request = await getUserPendingRequest();

  if (request) {
    if (request.status === "rejected") {
      redirect("/rejected");
    }
    redirect("/pending");
  }

  return <AccreditationForm />;
}
