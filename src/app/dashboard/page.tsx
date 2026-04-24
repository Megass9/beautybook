import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format, subDays, startOfMonth } from "date-fns";
import { tr } from "date-fns/locale";
import DashboardClient from "./DashboardClient";

type AptRow = {
  id: string;
  status: string;
  start_time: string;
  end_time?: string;
  appointment_date: string;
  customer: { name: string } | null;
  service: { name: string; price: number } | null;
  staff: { name: string } | null;
};

type PendingAptRow = AptRow & {
  appointment_date_formatted: string;
};

type PriceRow = {
  service: { price: number } | null;
};

type SalonRow = {
  id: string;
  name: string;
  slug: string;
};

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons").select("id, name, slug")
    .eq("owner_id", user.id)
    .single<SalonRow>();

  if (!salon) redirect("/auth/register");

  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");

  const [
    { data: todayApts },
    { data: yesterdayApts },
    { data: totalCustomers },
    { data: newCustomersThisMonth },
    { data: allCompletedApts },
    { data: monthApts },
    { data: pendingApts },
  ] = await Promise.all([
    supabase.from("appointments")
      .select("*, customer:customers(*), service:services(*), staff:staff(*)")
      .eq("salon_id", salon.id).eq("appointment_date", today).order("start_time")
      .returns<AptRow[]>(),
    supabase.from("appointments")
      .select("service:services(price)")
      .eq("salon_id", salon.id).eq("appointment_date", yesterday).eq("status", "completed")
      .returns<PriceRow[]>(),
    supabase.from("customers").select("id", { count: "exact" }).eq("salon_id", salon.id),
    supabase.from("customers").select("id", { count: "exact" }).eq("salon_id", salon.id).gte("created_at", monthStart),
    supabase.from("appointments")
      .select("service:services(price)").eq("salon_id", salon.id).eq("status", "completed")
      .returns<PriceRow[]>(),
    supabase.from("appointments")
      .select("service:services(price)").eq("salon_id", salon.id)
      .eq("status", "completed").gte("appointment_date", monthStart)
      .returns<PriceRow[]>(),
    supabase.from("appointments")
      .select("*, customer:customers(*), service:services(*), staff:staff(*)")
      .eq("salon_id", salon.id).eq("status", "pending").order("appointment_date").limit(5)
      .returns<AptRow[]>(),
  ]);

  const totalRevenue = allCompletedApts?.reduce((s, a) => s + (a.service?.price || 0), 0) || 0;
  const monthRevenue = monthApts?.reduce((s, a) => s + (a.service?.price || 0), 0) || 0;
  const yesterdayRevenue = yesterdayApts?.reduce((s, a) => s + (a.service?.price || 0), 0) || 0;

  const confirmedToday = todayApts?.filter(a => a.status === "confirmed").length || 0;
  const pendingToday   = todayApts?.filter(a => a.status === "pending").length   || 0;
  const completedToday = todayApts?.filter(a => a.status === "completed").length || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  // Format pending apt dates server-side (no date-fns on client needed)
  const pendingWithFormatted: PendingAptRow[] = (pendingApts || []).map(apt => ({
    ...apt,
    appointment_date_formatted: format(new Date(apt.appointment_date), "d MMM", { locale: tr }),
  }));

  return (
    <DashboardClient
      slug={salon.slug}
      greeting={greeting}
      salonFirstName={salon.name.split(" ")[0]}
      todayFormatted={format(new Date(), "d MMMM yyyy, EEEE", { locale: tr })}
      todayApts={todayApts || []}
      pendingApts={pendingWithFormatted}
      confirmedToday={confirmedToday}
      pendingToday={pendingToday}
      completedToday={completedToday}
      monthRevenue={monthRevenue}
      totalRevenue={totalRevenue}
      yesterdayRevenue={yesterdayRevenue}
      yesterdayAptsCount={yesterdayApts?.length || 0}
      totalCustomersCount={totalCustomers?.length || 0}
      newCustomersCount={newCustomersThisMonth?.length || 0}
    />
  );
}