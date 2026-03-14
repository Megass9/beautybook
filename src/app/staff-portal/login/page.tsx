"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function StaffLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Zaten giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: staff } = await supabase
          .from("staff")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();
        if (staff) {
          router.replace("/staff-portal/dashboard");
          return;
        }
      }
      setChecking(false);
    }
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Personel mi kontrol et
      const { data: staffRecord } = await supabase
        .from("staff")
        .select("id, name")
        .eq("auth_user_id", data.user.id)
        .single();

      if (!staffRecord) {
        await supabase.auth.signOut();
        throw new Error("Bu hesap bir personel hesabı değil.");
      }

      toast.success(`Hoş geldin, ${staffRecord.name}!`);
      router.replace("/staff-portal/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Giriş hatası");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <Sparkles className="w-5 h-5 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xl" style={{ color: "var(--foreground)" }}>BeautyBook</span>
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full font-medium" style={{ background: "#fff1f2", color: "var(--primary)" }}>Personel</span>
          </div>
        </div>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>Personel Girişi</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Randevularınızı görüntüleyin ve yönetin</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">E-posta</label>
              <input type="email" className="input" placeholder="personel@salon.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Şifre</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} className="input pr-12"
                  placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: "var(--text-muted)" }}>
          Salon sahibi misiniz?{" "}
          <Link href="/auth/login" className="font-medium hover:underline" style={{ color: "var(--primary)" }}>
            Salon girişi
          </Link>
        </p>
      </div>
    </div>
  );
}