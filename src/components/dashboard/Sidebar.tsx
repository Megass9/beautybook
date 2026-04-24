"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, Calendar, Scissors, Users, UserCircle, Settings, ExternalLink, LogOut, ChevronRight, TrendingUp, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Salon } from "@/types";

const NAV = [
  { href: "/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "Randevular", icon: Calendar },
  { href: "/dashboard/services", label: "Hizmetler", icon: Scissors },
  { href: "/dashboard/staff", label: "Personel", icon: Users },
  { href: "/dashboard/customers", label: "Müşteriler", icon: UserCircle },
  { href: "/dashboard/notifications", label: "Bildirimler", icon: Bell },
  { href: "/dashboard/reports", label: "Finans & Raporlar", icon: TrendingUp },
];

export default function DashboardSidebar({ salon }: { salon: Salon }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-[280px] bg-[#0c0a09] flex flex-col h-full flex-shrink-0 border-r border-stone-800/60 relative overflow-hidden">
      
      {/* ── BACKGROUND GLOW EFFECT ── */}
      <div className="absolute top-0 left-0 w-full h-64 bg-rose-900/10 blur-[80px] pointer-events-none rounded-full" />
      
      {/* ── LOGO SECTION ── */}
      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[12px] flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.3)] border border-rose-400/30 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-white text-[15px] truncate tracking-tight">{salon.name}</p>
            <p className="text-stone-400 text-xs font-semibold truncate uppercase tracking-widest">{salon.city || "Salon"}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION ── */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scroll relative z-10">
        <p className="px-3 text-[10px] font-extrabold text-stone-500 uppercase tracking-[0.2em] mb-3 mt-2">Menü</p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`group flex items-center justify-between px-3 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                active
                  ? "bg-stone-800/80 text-white shadow-inner border border-stone-700/50"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-900/50 hover:border hover:border-stone-800/40 border border-transparent"
              }`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${active ? "text-rose-500" : "text-stone-500 group-hover:text-stone-300"}`} />
                {label}
              </div>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]" />}
            </Link>
          );
        })}
      </nav>

      {/* ── BOTTOM ACTIONS ── */}
      <div className="p-4 border-t border-stone-800/60 bg-stone-950/30 space-y-2 relative z-10 backdrop-blur-sm">
        <Link href={`/salon/${salon.slug}`} target="_blank"
          className="group flex items-center justify-between px-4 py-3.5 bg-gradient-to-br from-rose-600/10 to-transparent hover:from-rose-600/20 border border-rose-500/20 hover:border-rose-500/40 rounded-2xl text-sm font-bold text-rose-500 transition-all">
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4" />
            <span>Mini Site'yi Gör</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-all border border-transparent hover:border-stone-800/60">
          <Settings className="w-4 h-4 text-stone-500" />
          Ayarlar
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
          <LogOut className="w-4 h-4 text-stone-500" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
