import { createAdminClient } from "@/lib/supabase/admin";
import SettingsClient from "./SettingsClient";
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  noStore();
  const supabase = createAdminClient() as any;

  // Tüm ayarları çekiyoruz
  const { data: settings, error } = await supabase
    .from("system_settings")
    .select("*");

  if (error) {
    console.error("Ayarlar çekilirken hata:", error);
  }

  // Ayarları bir objeye dönüştürelim
  const settingsMap = (settings || []).reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return <SettingsClient initialSettings={settingsMap} />;
}