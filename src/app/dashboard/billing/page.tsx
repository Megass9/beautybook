import { createServerClient } from "@/lib/supabase/server";
import BillingClient from "./BillingClient";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const supabase = createServerClient() as any;
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("owner_id", session.user.id)
    .single();

  if (!salon) {
    redirect("/dashboard/setup");
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  // Fiyatları çek
  const { data: settings } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "pricing")
    .single();

  const pricing = settings?.value || { basic: 500, pro: 900, premium: 1500 };

  return <BillingClient salon={salon} subscriptions={subscriptions || []} pricing={pricing} />;
}
