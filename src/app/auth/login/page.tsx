"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Scissors, Star, TrendingUp, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
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
    <div className="min-h-screen bg-[#faf7f4] flex font-sans">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-[#1c0a0e] flex-col justify-between p-14 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-900/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-rose-950/60 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-800/10 rounded-full blur-[100px]" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/50">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">BeautyBook</span>
        </Link>

        {/* Center content */}
        <div className="relative space-y-10">
          {/* Stats mini cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Calendar, value: "180K+", label: "Aylık Randevu", color: "text-rose-400" },
              { icon: Star, value: "4.9★", label: "Kullanıcı Puanı", color: "text-amber-400" },
              { icon: TrendingUp, value: "%98", label: "Memnuniyet", color: "text-emerald-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 text-center">
                <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-2`} />
                <p className="text-white font-black text-lg leading-none mb-1">{stat.value}</p>
                <p className="text-stone-500 text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-3xl p-7">
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
            </div>
            <blockquote className="text-stone-300 text-base leading-relaxed mb-6">
              "BeautyBook sayesinde randevu kaosundan kurtulduk. Müşterilerimizin %60'ı artık kendi kendine randevu alıyor. İlk ayda gelirimiz %30 arttı."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                AK
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Aslı Kaya</p>
                <p className="text-stone-500 text-xs">Aslı Beauty Salon, İstanbul</p>
              </div>
            </div>
          </div>

          {/* More social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-blue-400"].map((c, i) => (
                <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-[#1c0a0e] flex items-center justify-center text-white text-[10px] font-bold`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-stone-400 text-sm">
              <span className="text-white font-semibold">2.500+</span> salon zaten kullanıyor
            </p>
          </div>
        </div>

        <p className="relative text-stone-600 text-xs">© 2024 BeautyBook. Tüm hakları saklıdır.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-rose-600 transition-colors mb-8 lg:hidden">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-stone-900 tracking-tight">BeautyBook</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
              Hoş geldiniz 👋
            </h1>
            <p className="text-stone-500">Salonunuzu yönetmeye devam edin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="salon@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-stone-700">
                  Şifre
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-rose-600 hover:text-rose-700 font-medium">
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400">veya</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Google SSO placeholder */}
          <button
            type="button"
            className="w-full bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-3 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2.5 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile devam et
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-stone-500 mt-6">
            Hesabınız yok mu?{" "}
            <Link href="/auth/register" className="text-rose-600 font-semibold hover:text-rose-700">
              Ücretsiz kayıt ol →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}