"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Rol kontrolü
      if (data.user?.app_metadata?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Bu alana erişim yetkiniz bulunmamaktadır.");
      }

      toast.success("Yönetici girişi başarılı!");
      router.push("/admin"); // Ana admin sayfasına yönlendir
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-600/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[20%] w-[80%] h-[80%] rounded-full bg-stone-900/50 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2rem] shadow-2xl shadow-rose-500/20 mb-6 border border-rose-400/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">BeautyBook</h1>
          <p className="text-stone-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Süper Admin Girişi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-4">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                placeholder="admin@beautybook.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-4">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-900/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            SİSTEME GİRİŞ YAP
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em]">
          Giriş yaparak tüm sistem operasyonlarını yönetmeyi kabul edersiniz.
        </p>
      </div>
    </div>
  );
}