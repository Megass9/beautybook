"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, MapPin, Phone, Building2, Scissors, Check, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/slug";
import toast from "react-hot-toast";

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const STEP_META = [
  { label: "Hesap", desc: "E-posta & şifre" },
  { label: "Salon", desc: "Temel bilgiler" },
  { label: "Saatler", desc: "Çalışma takvimi" },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [auth, setAuth] = useState({ email: "", password: "" });
  const [salon, setSalon] = useState({ name: "", address: "", city: "", phone: "" });
  const [hours, setHours] = useState(
    DAYS.map((_, i) => ({
      day_of_week: i,
      open_time: "09:00",
      close_time: "19:00",
      is_closed: i === 0,
    }))
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: auth.email,
        password: auth.password,
      });
      if (authError || !authData.user) throw new Error(authError?.message || "Kayıt hatası");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: auth.email,
        password: auth.password,
      });
      if (signInError) throw new Error("Oturum açılamadı: " + signInError.message);

      const slug = generateSlug(salon.name);
      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .insert({
          owner_id: authData.user.id,
          name: salon.name,
          slug,
          address: salon.address,
          city: salon.city,
          phone: salon.phone,
        } as any)
        .select()
        .single();
      if (salonError) throw new Error(salonError.message);

      const { error: hoursError } = await supabase
        .from("working_hours")
        .insert(hours.map((h) => ({ ...h, salon_id: salonData.id })) as any);
      if (hoursError) throw new Error(hoursError.message);

      toast.success("Salonunuz oluşturuldu!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] flex font-sans">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#1c0a0e] flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-900/25 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-rose-950/60 rounded-full blur-[80px]" />
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

        {/* Center */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Salonunuzu<br />bugün başlatın
            </h2>
            <p className="text-stone-400 leading-relaxed text-sm">
              14 gün ücretsiz deneyin. Kurulum 5 dakika sürer, kredi kartı gerekmez.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              "Online randevu sistemi",
              "Kişisel salon web sayfası",
              "SMS & e-posta hatırlatmaları",
              "Müşteri takip & notları",
              "Gelir ve doluluk raporları",
              "Personel takvim yönetimi",
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-rose-600/20 border border-rose-700/40 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-rose-400" />
                </div>
                <span className="text-stone-300 text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
              <span className="text-stone-500 text-xs ml-1">5.0</span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              "Kurulum gerçekten 5 dakika sürdü. Aynı gün ilk online randevumu aldım."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ZA
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Zeynep Arslan</p>
                <p className="text-stone-500 text-[10px]">Z Beauty Studio, Ankara</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-stone-600 text-xs">© 2024 BeautyBook. Tüm hakları saklıdır.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-4">

          {/* Mobile header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-stone-900">BeautyBook</span>
            </Link>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Geri
            </Link>
          </div>

          {/* Desktop back link */}
          <Link href="/" className="hidden lg:inline-flex items-center gap-2 text-sm text-stone-400 hover:text-rose-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Ana Sayfa
          </Link>

          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-1">
              Hesap oluştur
            </h1>
            <p className="text-stone-500 text-sm">14 gün ücretsiz, kredi kartı gerekmez</p>
          </div>

          {/* ── Step progress ── */}
          <div className="flex items-center gap-0 mb-10">
            {STEP_META.map((s, i) => {
              const num = i + 1;
              const isDone = num < step;
              const isActive = num === step;
              return (
                <div key={s.label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                        ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200"
                        : "bg-white border-stone-200 text-stone-400"
                    }`}>
                      {isDone ? <Check className="w-4 h-4" /> : num}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold ${isActive ? "text-stone-900" : isDone ? "text-emerald-600" : "text-stone-400"}`}>{s.label}</p>
                      <p className="text-[10px] text-stone-400 hidden sm:block">{s.desc}</p>
                    </div>
                  </div>
                  {i < 2 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all ${num < step ? "bg-emerald-400" : "bg-stone-200"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── STEP 1: Account ── */}
          {step === 1 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-stone-900 mb-1">Giriş bilgileri</h2>
                <p className="text-sm text-stone-400">Hesabınıza erişmek için kullanacağınız bilgiler</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">E-posta</label>
                  <input
                    type="email"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                    placeholder="salon@email.com"
                    value={auth.email}
                    onChange={e => setAuth({ ...auth, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Şifre</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                      placeholder="En az 6 karakter"
                      value={auth.password}
                      onChange={e => setAuth({ ...auth, password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {auth.password.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          auth.password.length >= i * 3
                            ? auth.password.length >= 10 ? "bg-emerald-400" : "bg-amber-400"
                            : "bg-stone-200"
                        }`} />
                      ))}
                      <span className="text-[10px] text-stone-400 ml-1">
                        {auth.password.length < 6 ? "Zayıf" : auth.password.length < 10 ? "Orta" : "Güçlü"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Google SSO */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-xs text-stone-400">veya</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
                <button type="button" className="w-full bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google ile kayıt ol
                </button>

                <button
                  onClick={() => auth.email && auth.password.length >= 6 && setStep(2)}
                  disabled={!auth.email || auth.password.length < 6}
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-rose-200 disabled:shadow-none"
                >
                  Devam Et →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Salon info ── */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-stone-900 mb-1">Salon bilgileri</h2>
                <p className="text-sm text-stone-400">Salonunuzun profilini oluşturun</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Salon Adı</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                      placeholder="Örnek: Aslı Beauty"
                      value={salon.name}
                      onChange={e => setSalon({ ...salon, name: e.target.value })}
                    />
                  </div>
                  {salon.name && (
                    <div className="mt-2 flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                      <span className="text-[10px] text-stone-400 font-mono">beautybook.app/salon/</span>
                      <span className="text-[10px] text-rose-600 font-mono font-semibold">{generateSlug(salon.name)}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Şehir</label>
                    <input
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                      placeholder="İstanbul"
                      value={salon.city}
                      onChange={e => setSalon({ ...salon, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                        placeholder="0532 000 00 00"
                        value={salon.phone}
                        onChange={e => setSalon({ ...salon, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Adres</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <textarea
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all resize-none"
                      placeholder="Mahalle, Sokak No, Daire"
                      rows={2}
                      value={salon.address}
                      onChange={e => setSalon({ ...salon, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setStep(1)} className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 rounded-xl transition-all text-sm">
                    ← Geri
                  </button>
                  <button
                    onClick={() => salon.name && salon.city && setStep(3)}
                    disabled={!salon.name || !salon.city}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-rose-200 disabled:shadow-none"
                  >
                    Devam Et →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Working hours ── */}
          {step === 3 && (
            <form onSubmit={handleRegister}>
              <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-stone-900 mb-1">Çalışma saatleri</h2>
                  <p className="text-sm text-stone-400">Salonunuzun haftalık programını ayarlayın</p>
                </div>

                <div className="space-y-2 mb-6">
                  {hours.map((h, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      h.is_closed ? "bg-stone-50 border-stone-100 opacity-60" : "bg-white border-stone-200"
                    }`}>
                      <div className="w-24 shrink-0">
                        <span className={`text-xs font-semibold ${h.is_closed ? "text-stone-400" : "text-stone-700"}`}>
                          {DAYS[i]}
                        </span>
                      </div>

                      {h.is_closed ? (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1.5 rounded-lg">Kapalı</span>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <div className="relative flex-1">
                            <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                            <input
                              type="time"
                              value={h.open_time}
                              onChange={e => { const n = [...hours]; n[i].open_time = e.target.value; setHours(n); }}
                              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-2 py-2 text-xs text-stone-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                            />
                          </div>
                          <span className="text-stone-400 text-xs">—</span>
                          <div className="relative flex-1">
                            <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                            <input
                              type="time"
                              value={h.close_time}
                              onChange={e => { const n = [...hours]; n[i].close_time = e.target.value; setHours(n); }}
                              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-2 py-2 text-xs text-stone-700 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
                            />
                          </div>
                        </div>
                      )}

                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                        <div className={`w-8 h-4 rounded-full transition-all relative ${h.is_closed ? "bg-stone-300" : "bg-rose-500"}`}
                          onClick={() => { const n = [...hours]; n[i].is_closed = !h.is_closed; setHours(n); }}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${h.is_closed ? "left-0.5" : "left-4"}`} />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <span className="text-rose-500 text-base mt-0.5">💡</span>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Çalışma saatlerini sonradan Ayarlar bölümünden değiştirebilirsiniz. Personel bazlı saatler için personel profillerini kullanın.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3.5 rounded-xl transition-all text-sm">
                    ← Geri
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-rose-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Oluşturuluyor...
                      </span>
                    ) : (
                      "🎉 Salonu Oluştur"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-stone-500 mt-5">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/login" className="text-rose-600 font-semibold hover:text-rose-700">
              Giriş yapın →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}