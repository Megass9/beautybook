"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient() as any;
  const router = useRouter();

  useEffect(() => {
    async function initDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/auth/login");

      const { data: salon } = await supabase
        .from("salons")
        .select("*")
        .eq("owner_id", user.id)
        .single();
      
      if (!salon) return router.push("/setup");

      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("salon_id", salon.id)
        .order("created_at", { ascending: false });

      const trialEndDate = new Date(salon.created_at);
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      const activeSub = (subscriptions || []).find((s: any) => s.status === "active");
      const lastValidDate = activeSub?.end_date ? new Date(activeSub.end_date) : trialEndDate;
      const graceDate = new Date(lastValidDate);
      graceDate.setDate(graceDate.getDate() + 3);
      const isLocked = new Date() > graceDate;

      setDashboardData({ user, salon, activeSub, isLocked });
      setLoading(false);
    }
    initDashboard();
  }, [supabase, router]);

  if (loading) return null;

  return (
    <div className="flex h-screen bg-stone-50/50 overflow-hidden relative">
      {/* Mobil Sidebar Karartma (Backdrop) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobil Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <DashboardSidebar 
          salon={dashboardData.salon} 
          isLocked={dashboardData.isLocked} 
          activeSubscription={dashboardData.activeSub} 
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobil Header & Hamburger */}
        <header className="lg:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-bold text-sm tracking-tight italic text-stone-900">BeautyBook</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-600"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <DashboardHeader salon={dashboardData.salon} user={dashboardData.user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
