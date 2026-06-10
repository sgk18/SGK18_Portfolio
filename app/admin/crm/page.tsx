import { redirect } from "next/navigation";

export default function CRMPageRedirect() {
  redirect("/admin?tab=crm");
}
