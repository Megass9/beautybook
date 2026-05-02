import { createServerClient } from "@/lib/supabase/server";
import AdminClient from "./AdminClient";
import { redirect } from "next/navigation";

export default async function SuperAdminPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Bu kontrol sayfa render edilmeden önce sunucu tarafında çalışır
  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, salon:salons(*)")
    .order("created_at", { ascending: false });

  const { data: salons } = await supabase
    .from("salons")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*, salon:salons(name)")
    .order("created_at", { ascending: false });

  return <AdminClient 
    initialSubscriptions={subscriptions || []} 
    initialSalons={salons || []} 
    initialTickets={tickets || []}
  />;
}
