"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Scissors, Star, TrendingUp, Calendar, Mail, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("E-posta veya şifre hatalı");
      setLoading(false);
      return;
    }
    toast.success("Giriş başarılı!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex font-sans">
      {/* SOL PANEL - PREMIUM TASARIM (Register ile uyumlu) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#1c0a0e] flex-col justify-between p-14 border-r border-rose-900/30">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-600/20 blur-[120px]" />
          <div className="absolute top-[60%] -right-[20%] w-[80%] h-[80%] rounded-full bg-rose-900/30 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit transition-transform hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">BeautyBook</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Tekrar hoş geldiniz
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
            Salonunuzu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
              büyütmeye
            </span> devam edin.
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: Calendar, value: "180K+", label: "Aylık Randevu", color: "text-rose-400" },
              { icon: TrendingUp, value: "%98", label: "Memnuniyet", color: "text-emerald-400" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center backdrop-blur-sm">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-white font-black text-2xl leading-none mb-1">{stat.value}</p>
                <p className="text-stone-400 text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mb-4 italic">
              "BeautyBook sayesinde randevu kaosundan kurtulduk. Müşterilerimizin %60'ı artık kendi kendine randevu alıyor."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                AK
              </div>
              <div>
                <p className="text-white font-semibold text-xs">Aslı Kaya</p>
                <p className="text-stone-500 text-[10px]">Aslı Beauty Salon, İstanbul</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
          <p className="text-stone-400 text-sm">© 2026 BeautyBook. Tüm hakları saklıdır.</p>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto relative">
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 text-sm font-medium text-stone-500">
          Hesabınız yok mu? <Link href="/auth/register" className="text-rose-600 hover:text-rose-700 transition-colors ml-1">Ücretsiz kayıt ol</Link>
        </div>

        <div className="w-full max-w-md animate-fade-up">

          {/* Mobile elements */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-rose-600 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl flex items-center justify-center shadow-lg">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-stone-900 tracking-tight">BeautyBook</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
              Hoş Geldiniz 👋
            </h1>
            <p className="text-stone-500">
              Salonunuzu yönetmeye devam etmek için giriş yapın.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">E-posta Adresi</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-stone-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="ornek@mail.com"
                  className="input pl-10"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Şifre</label>
                <Link href="/auth/forgot-password" className="text-sm text-rose-600 hover:text-rose-700 font-medium transition-colors">
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3 text-stone-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : (
                <>
                  Giriş Yap <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* TEST BUTONU - İdareten Giriş */}
            <button
              type="button"
              onClick={() => {
                toast.success("Test modunda giriş yapıldı!");
                router.push("/dashboard");
              }}
              className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 px-6 rounded-xl transition-all text-sm mt-3 flex items-center justify-center gap-2 shadow-sm shadow-stone-300"
            >
              İdareten Giriş Yap (Veritabanı Yok)
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-sm text-stone-400 font-medium">veya</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Google SSO */}
          <button
            type="button"
            className="w-full bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-3 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile devam et
          </button>

        </div>
      </div>
    </div>
  );
}
