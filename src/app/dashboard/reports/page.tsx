import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";
import { TrendingUp } from "lucide-react";

export default async function ReportsPage() {
  const supabase = createServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!salon) redirect("/setup");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  const { data: pricingSettings } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "pricing")
    .single();

  const pricing = pricingSettings?.value || { pro: 799 };
  const activeSub = (subscriptions || []).find((s: any) => s.status === "active");
  const isPremium = activeSub && activeSub.amount >= (pricing.pro || 799);

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-black text-stone-900 mb-4">Finansal Raporlar Sadece Pro'da</h1>
        <p className="text-stone-500 max-w-md mx-auto mb-8 font-medium">
          Detaylı kazanç grafikleri, randevu istatistikleri ve finansal analizler için paketinizi yükseltin.
        </p>
        <a href="/dashboard/billing" className="btn-primary">Paketimi Yükselt</a>
      </div>
    );
  }

  // Randevu verilerini çek (İstatistikler için)
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      services(price, name)
    `)
    .eq("salon_id", salon.id)
    .neq("status", "cancelled");

  return <ReportsClient initialAppointments={appointments || []} />;
}
