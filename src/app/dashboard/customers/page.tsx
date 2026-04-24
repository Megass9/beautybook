import { createServerClient } from "@/lib/supabase/server";
import CustomersClient from "./CustomersClient";
import { redirect } from "next/navigation";

type SalonRow = { id: string };

export default async function CustomersPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single<SalonRow>();

  if (!salon) return null;

  const { data: customers } = await supabase
    .from("customers")
    .select("*, appointments(count)")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  return <CustomersClient salonId={salon.id} initialCustomers={customers || []} />;
}