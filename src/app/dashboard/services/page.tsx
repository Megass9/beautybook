import { createServerClient } from "@/lib/supabase/server";
import ServicesClient from "./ServicesClient";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const supabase = createServerClient() as any;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!salon) return <div>Salon bulunamadı</div>;

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  return (
    <ServicesClient
      salonId={salon.id}
      initialServices={services || []}
    />
  );
}
