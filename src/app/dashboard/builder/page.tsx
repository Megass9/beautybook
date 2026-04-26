import { createServerClient } from "@/lib/supabase/server";
import BuilderClient from "./BuilderClient";
import { redirect } from "next/navigation";

export default async function BuilderPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Salon verilerini çek
  const { data: salon } = (await supabase
    .from("salons")
    .select("*")
    .eq("owner_id", user.id) // database.ts tipine göre owner_id veya user_id
    .single()) as any;

  if (!salon) {
    redirect("/dashboard/setup");
  }

  // Hizmetleri çek
  const { data: services } = (await (supabase
    .from("services")
    .select("*")
    .eq("salon_id", salon.id))) as any;

  // Personeli çek
  const { data: staff } = (await (supabase
    .from("staff")
    .select("*")
    .eq("salon_id", salon.id))) as any;

  return (
    <div className="h-screen w-full">
      <BuilderClient salon={salon} services={services || []} staff={staff || []} />
    </div>
  );
}