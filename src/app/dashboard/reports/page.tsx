import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const supabase = createServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!salon) redirect("/auth/register");

  // Randevuları, hizmet fiyatlarıyla beraber al
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      status,
      appointment_date,
      services ( name, price ),
      staff ( name )
    `)
    .eq("salon_id", salon.id);

  return <ReportsClient appointments={appointments || []} />;
}
