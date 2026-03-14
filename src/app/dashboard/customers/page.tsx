import { createServerClient } from "@/lib/supabase/server";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage() {
  const supabase = createServerClient() as any;
  const { data: { session } } = await supabase.auth.getSession();

  const { data: salon } = await supabase.from("salons").select("id").eq("owner_id", session!.user.id).single();
  const { data: customers } = await supabase
    .from("customers")
    .select("*, appointments(count)")
    .eq("salon_id", salon!.id)
    .order("created_at", { ascending: false });
  return <CustomersClient salonId={salon!.id} initialCustomers={customers || []} />;
}
