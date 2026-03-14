import { createServerClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = createServerClient() as any;
  const { data: { session } } = await supabase.auth.getSession();
  const { data: salon } = await supabase.from("salons").select("*").eq("owner_id", session!.user.id).single();
  const { data: hours } = await supabase.from("working_hours").select("*").eq("salon_id", salon!.id).order("day_of_week");
  return <SettingsClient salon={salon} hours={hours || []} />;
}
