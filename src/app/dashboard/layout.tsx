import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  noStore();
  const supabase = createServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!salon) redirect("/setup");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  // 1. Deneme süresi sonu (Kayıt + 14 gün)
  const trialEndDate = new Date(salon.created_at);
  trialEndDate.setDate(trialEndDate.getDate() + 14);
  
  // 2. Varsa son aktif abonelik bitişi
  const activeSub = (subscriptions || []).find((s: any) => s.status === "active");
  const lastValidDate = activeSub?.end_date ? new Date(activeSub.end_date) : trialEndDate;

  // 3. 3 Günlük Mühlet (Grace Period)
  const graceDate = new Date(lastValidDate);
  graceDate.setDate(graceDate.getDate() + 3);
  
  // Eğer şu anki zaman mühlet tarihini geçtiyse kilitli
  const isLocked = new Date() > graceDate;

  // Serialize objects to ensure no functions or non-serializable data are passed to Client Components
  const serializedUser = JSON.parse(JSON.stringify(user));
  const serializedSalon = JSON.parse(JSON.stringify(salon));
  const serializedIsLocked = isLocked;

  return (
    <div className="flex h-screen bg-stone-50/50 overflow-hidden">
      <DashboardSidebar 
        salon={serializedSalon} 
        isLocked={serializedIsLocked} 
        activeSubscription={activeSub ? JSON.parse(JSON.stringify(activeSub)) : null} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader salon={serializedSalon} user={serializedUser} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
