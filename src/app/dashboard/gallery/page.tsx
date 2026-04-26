import { createServerClient } from "@/lib/supabase/server";
import GalleryClient from "./GalleryClient";
import { redirect } from "next/navigation";

export default async function GalleryPage() {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single<{ id: string }>();

  if (!salon) return <div>Salon bulunamadı</div>;

  const { data: items } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  return (
    <GalleryClient
      salonId={salon.id}
      initialItems={items || []}
    />
  );
}
