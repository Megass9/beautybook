import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!salon) redirect("/auth/register");

  // Serialize objects to ensure no functions or non-serializable data are passed to Client Components
  const serializedUser = JSON.parse(JSON.stringify(user));
  const serializedSalon = JSON.parse(JSON.stringify(salon));

  return (
    <div className="flex h-screen bg-[#fdf8f2] overflow-hidden">
      <DashboardSidebar salon={serializedSalon} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader salon={serializedSalon} user={serializedUser} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
