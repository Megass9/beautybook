import { createServerClient } from "@/lib/supabase/server";
import CampaignClient from "./CampaignClient";
import { redirect } from "next/navigation";

export default async function CampaignsPage() {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single<{ id: string }>();

  if (!salon) return <div>Salon bulunamadı</div>;

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  return (
    <CampaignClient
      salonId={salon.id}
      initialCampaigns={campaigns || []}
    />
  );
}
