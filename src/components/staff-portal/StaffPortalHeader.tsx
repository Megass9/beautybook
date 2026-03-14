"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Scissors, User } from "lucide-react";
import toast from "react-hot-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function StaffPortalHeader({ user }: { user: SupabaseUser }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Çıkış yapıldı");
    router.replace("/staff-portal/login");
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-sand-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center shadow-rose-200 shadow-lg">
              <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-charcoal-900 leading-none">
                BeautyBook
              </h1>
              <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                Personel Paneli
              </span>
            </div>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}