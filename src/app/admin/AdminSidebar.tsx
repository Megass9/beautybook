"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Building2,
  Users,
  BarChart3,
  HeadphonesIcon,
  FileText,
  Settings,
  TestTube,
  Sparkles,
  LogOut
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Genel Bakış", icon: LayoutDashboard, color: "text-blue-500" },
  { href: "/admin", label: "Salon Bildirimleri", icon: Bell, color: "text-rose-500" },
  { href: "/admin/salons", label: "Salon Yönetimi", icon: Building2, color: "text-emerald-500" },
  { href: "/admin/users", label: "Kullanıcı Yönetimi", icon: Users, color: "text-purple-500" },
  { href: "/admin/reports", label: "Finansal Raporlar", icon: BarChart3, color: "text-amber-500" },
  { href: "/admin/support", label: "Destek Talepleri", icon: HeadphonesIcon, color: "text-cyan-500" },
  { href: "/admin/logs", label: "Sistem Logları", icon: FileText, color: "text-orange-500" },
  { href: "/admin/settings", label: "Sistem Ayarları", icon: Settings, color: "text-gray-500" },
  { href: "/admin/test-notifications", label: "Tablo Testi", icon: TestTube, color: "text-stone-500" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

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
          <div>
            <p className="font-black text-white text-[15px] truncate tracking-tight">BeautyBook</p>
            <p className="text-stone-400 text-xs font-semibold truncate uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION ── */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scroll relative z-10">
        <p className="px-3 text-[10px] font-extrabold text-stone-500 uppercase tracking-[0.2em] mb-3 mt-2">Menü</p>
        {/* <div className="space-y-2"> */}
          {NAV_ITEMS.map(({ href, label, icon: Icon, color }) => {
            const isActive = pathname === href || (href === "/admin" && pathname === "/admin");

            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center justify-between px-3 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-stone-800/80 text-white shadow-inner border border-stone-700/50"
                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-900/50 hover:border hover:border-stone-800/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-rose-500" : "text-stone-500 group-hover:text-stone-300"}`} />
                  {label}
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]" />}
              </Link>
            );
          })}
      </nav>

      {/* ── BOTTOM ACTIONS ── */}
      <div className="p-4 border-t border-stone-800/60 bg-stone-950/30 space-y-2 relative z-10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-stone-800 to-stone-900 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md border-2 border-white ring-2 ring-stone-100 group-hover:ring-rose-200 transition-all">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white leading-none group-hover:text-rose-600 transition-colors">Yönetici</p>
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mt-1">Admin</p>
            </div>
          </div>
          <button
            // onClick={handleLogout} // Assuming there will be a logout function for admin
            className="w-11 h-11 bg-white border border-stone-200/80 rounded-full flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all text-stone-600 shadow-sm"
            title="Çıkış Yap"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
