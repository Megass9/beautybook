import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SupportClient from "./SupportClient";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
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
          <CreditCard className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-black text-stone-900 mb-4">Bu Özellik Paketinizde Yok</h1>
        <p className="text-stone-500 max-w-md mx-auto mb-8 font-medium">
          Destek talebi oluşturma ve öncelikli yardım alma özellikleri sadece Pro ve Premium paket sahiplerine özeldir.
        </p>
        <a href="/dashboard/billing" className="btn-primary">Paketimi Yükselt</a>
      </div>
    );
  }

  // Önce sadece ticketları çek (ticket_messages olmadan, her zaman çalışır)
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  // ticket_messages tablosunu ayrıca çek (tablo yoksa boş döner)
  let messages: any[] = [];
  try {
    if (tickets && tickets.length > 0) {
      const { data: msgs } = await supabase
        .from("ticket_messages")
        .select("*")
        .in("ticket_id", tickets.map((t: any) => t.id))
        .order("created_at", { ascending: true });
      messages = msgs || [];
    }
  } catch (e) {
    // ticket_messages tablosu henüz yoksa atla
  }

  const ticketsWithMessages = (tickets || []).map((t: any) => ({
    ...t,
    messages: messages.filter((m: any) => m.ticket_id === t.id)
  }));

  return <SupportClient salonId={salon.id} initialTickets={ticketsWithMessages} />;
}
