"use client";
import { Bell, Search, LogOut } from "lucide-react";
import type { Salon } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DashboardHeader({ salon, user }: { salon: Salon; user: any }) {
  const today = new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Çıkış yapıldı");
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-sand-100 px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-charcoal-400 capitalize">{today}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
          <input className="bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 w-64"
            placeholder="Müşteri veya randevu ara..." />
        </div>
        <button className="relative w-9 h-9 bg-sand-50 border border-sand-200 rounded-xl flex items-center justify-center hover:border-rose-300 transition-colors">
          <Bell className="w-4 h-4 text-charcoal-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <button 
          onClick={handleLogout}
          className="w-9 h-9 bg-sand-50 border border-sand-200 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all text-charcoal-500"
          title="Çıkış Yap"
        >
          <LogOut className="w-4 h-4" />
        </button>
        <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center text-sm font-bold text-rose-700">
          {user?.email?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
