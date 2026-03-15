import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import BookingClient from "./BookingClient";

// Sayfanın her istekte güncel veriyi çekmesini sağlar
export const revalidate = 0;

export default async function SalonPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient();

  // 1. Salon bilgilerini çek
  const { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!salon) return notFound();

  // 2. Aktif hizmetleri çek
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("salon_id", salon.id)
    .eq("is_active", true)
    .order("price", { ascending: true });

  // 3. Aktif personeli ve verdikleri hizmetleri çek
  // Not: staff_services tablosu personel-hizmet eşleşmesini tutar
  const { data: staff } = await supabase
    .from("staff")
    .select("*, staff_services(service_id)")
    .eq("salon_id", salon.id)
    .eq("is_active", true);

  // 4. Çalışma saatlerini çek (Yoksa varsayılan kullanılır)
  const { data: workingHours } = await supabase
    .from("working_hours")
    .select("*")
    .eq("salon_id", salon.id)
    .single();

  return (
    <BookingClient
      salon={salon}
      services={services || []}
      staff={staff || []}
      workingHours={workingHours}
    />
  );
}