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
    <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 px-8 py-5 flex items-center justify-between sticky top-0 z-40">
      
      {/* ── DATE / GREETING ── */}
      <div>
        <h2 className="text-xl font-black text-stone-900 tracking-tight hidden sm:block">Hoş Geldiniz 🙌</h2>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-0.5">{today}</p>
      </div>
      
      {/* ── UTILITIES ── */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            className="bg-stone-50/50 border border-stone-200/80 rounded-full pl-11 pr-5 py-2.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all w-[280px] shadow-sm"
            placeholder="Müşteri veya randevu ara..." 
          />
        </div>

        {/* Notifications */}
        <button className="relative w-11 h-11 bg-white border border-stone-200/80 rounded-full flex items-center justify-center hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm">
          <Bell className="w-5 h-5 text-stone-600" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(225,29,72,0.8)] border-2 border-white" />
        </button>
        
        {/* Logout (Mobile) */}
        <button 
          onClick={handleLogout}
          className="w-11 h-11 bg-white border border-stone-200/80 rounded-full flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all text-stone-600 shadow-sm md:hidden"
          title="Çıkış Yap"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="w-1 h-6 bg-stone-200/60 rounded-full hidden sm:block mx-1" />

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-1 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-stone-900 leading-none group-hover:text-rose-600 transition-colors">Yönetici</p>
            <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mt-1">Admin</p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-br from-stone-800 to-stone-900 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md border-2 border-white ring-2 ring-stone-100 group-hover:ring-rose-200 transition-all">
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>

      </div>
    </header>
  );
}
