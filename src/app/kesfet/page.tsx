import { createServerClient } from "@/lib/supabase/server";
import KesfetClient from "./KesfetClient";

export const metadata = {
  title: "Salon Keşfet — BeautyBook",
  description: "Şehrinizdeki en iyi güzellik salonlarını bulun, yorumları okuyun ve anında randevu alın.",
};

export default async function KesfetPage() {
  const supabase = createServerClient();

  // Aktif olan tüm salonları temel bilgileriyle çekiyoruz
  const { data: salons, error } = await supabase
    .from("salons")
    .select(`
      id,
      name,
      slug,
      city,
      address,
      logo_url,
      description
    `)
    .order("name");

  // Debug: Verileri console'a basalım (Terminalde görünür)
  console.log("Çekilen Salon Sayısı:", salons?.length || 0);

  if (error) {
    console.error("Salon çekme hatası:", error.message);
  }

  // Client bileşenine güvenli veri geçişi için serialize ediyoruz
  const serializedSalons = JSON.parse(JSON.stringify(salons || []));

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <KesfetClient initialSalons={serializedSalons} />
      </div>
    </div>
  );
}
