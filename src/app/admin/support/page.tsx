import { createAdminClient } from "@/lib/supabase/admin";
import AdminSupportClient from "@/app/admin/support/AdminSupportClient";
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSupportPage() {
  noStore(); // Önbelleği kesin olarak devre dışı bırak
  const supabase = createAdminClient() as any;

  // Tüm destek taleplerini çek
  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("*, salon:salons(id, name, slug, phone, city)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Admin Support] HATA:", error);
    return <div className="p-10 text-red-500">Veritabanı Hatası: {error.message}</div>;
  }

  // Mesajları çek
  const { data: msgs } = await supabase
    .from("ticket_messages")
    .select("*")
    .order("created_at", { ascending: true });

  const ticketsWithMessages = (tickets || []).map((t: any) => ({
    ...t,
    messages: (msgs || []).filter((m: any) => m.ticket_id === t.id)
  }));

  console.log("[Admin Support] Toplam yüklenen talep:", ticketsWithMessages.length);

  return <AdminSupportClient initialTickets={ticketsWithMessages} />;
}