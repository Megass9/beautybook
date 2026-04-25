import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppearanceClient from "./AppearanceClient";

export default async function AppearancePage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!salon) redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Site Tasarımı</h1>
        <p className="text-stone-500 text-sm mt-1">Mini sitenizin renklerini ve görünümünü özelleştirin.</p>
      </div>

      <AppearanceClient salon={salon} />
    </div>
  );
}