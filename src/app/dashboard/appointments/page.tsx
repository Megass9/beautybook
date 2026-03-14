import { createServerClient } from "@/lib/supabase/server";
import AppointmentsClient from "./AppointmentsClient";

export default async function AppointmentsPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", session!.user.id)
    .single();

  const salonId = salon!.id;

  const [{ data: appointments }, { data: services }, { data: staff }, { data: customers }] = await Promise.all([
    supabase.from("appointments")
      .select("*, customer:customers(*), service:services(*), staff:staff(*)")
      .eq("salon_id", salonId)
      .order("appointment_date", { ascending: false })
      .order("start_time"),
    supabase.from("services").select("*").eq("salon_id", salonId).eq("is_active", true),
    supabase.from("staff").select("*").eq("salon_id", salonId).eq("is_active", true),
    supabase.from("customers").select("*").eq("salon_id", salonId),
  ]);

  return (
    <AppointmentsClient
      salonId={salonId}
      initialAppointments={appointments || []}
      services={services || []}
      staffList={staff || []}
      customers={customers || []}
    />
  );
}
