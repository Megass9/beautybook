import { createAdminClient } from "@/lib/supabase/admin";
import SalonsClient from "./SalonsClient";

export const dynamic = "force-dynamic";

export default async function AdminSalonsPage() {
  const supabase = createAdminClient() as any;

  // Salonları tüm detaylarıyla (abonelikler, personel listesi, hizmet listesi) çekiyoruz
  const { data: salons } = await supabase
    .from("salons")
    .select(`
      *,
      subscriptions(*),
      staff(*),
      services(*)
    `)
    .order("created_at", { ascending: false });

  return <SalonsClient initialSalons={salons || []} />;
}