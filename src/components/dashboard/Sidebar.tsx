"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, Calendar, Scissors, Users, UserCircle, Settings, ExternalLink, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Salon } from "@/types";

const NAV = [
  { href: "/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "Randevular", icon: Calendar },
  { href: "/dashboard/services", label: "Hizmetler", icon: Scissors },
  { href: "/dashboard/staff", label: "Personel", icon: Users },
  { href: "/dashboard/customers", label: "Müşteriler", icon: UserCircle },
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
    <aside className="w-64 bg-charcoal-900 flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-charcoal-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">{salon.name}</p>
            <p className="text-charcoal-400 text-xs">{salon.city}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-rose-600 text-white"
                  : "text-charcoal-400 hover:text-white hover:bg-charcoal-700"
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-charcoal-700 space-y-1">
        <Link href={`/salon/${salon.slug}`} target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-400 hover:text-white hover:bg-charcoal-700 transition-all">
          <ExternalLink className="w-4 h-4" />
          Mini Site'yi Gör
        </Link>
        <Link href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-400 hover:text-white hover:bg-charcoal-700 transition-all">
          <Settings className="w-4 h-4" />
          Ayarlar
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-400 hover:text-rose-400 hover:bg-charcoal-700 transition-all">
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
