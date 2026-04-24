"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Scissors,
  Mail,
  Lock,
  Building2,
  MapPin,
  Phone,
  Map,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/slug";
import toast from "react-hot-toast";

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const BENEFITS = [
  "7/24 Online Randevu Alma",
  "Otomatik SMS Hatırlatmaları",
  "Personel ve Prim Yönetimi",
  "Detaylı Finansal Raporlar"
];

type WorkingHour = {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);

  const [auth, setAuth] = useState({
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [salon, setSalon] = useState({
    name: "",
    address: "",
    city: "",
    phone: ""
  });

  const [hours, setHours] = useState<WorkingHour[]>(
    DAYS.map((_, i) => ({
      day_of_week: i,
      open_time: "09:00",
      close_time: "19:00",
      is_closed: i === 0, // Pazar kapalı
    }))
  );

  const handleNextStep1 = () => {
    if (!auth.email.includes("@")) {
      toast.error("Geçerli bir e-posta adresi giriniz.");
      return;
    }
    if (auth.password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (auth.password !== auth.passwordConfirm) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!salon.name || !salon.city || !salon.phone || !salon.address) {
      toast.error("Lütfen tüm salon bilgilerini doldurunuz.");
      return;
    }
    setStep(3);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: auth.email,
        password: auth.password
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Kayıt başarısız. Bu e-posta kullanılıyor olabilir.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: auth.email,
        password: auth.password
      });

      if (signInError) {
        throw new Error("Oturum açılamadı: " + signInError.message);
      }

      const slug = generateSlug(salon.name);

      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .insert({
          owner_id: authData.user.id,
          name: salon.name,
          slug,
          address: salon.address,
          city: salon.city,
          phone: salon.phone
        })
        .select("id")
        .single();

      if (salonError || !salonData) {
        throw new Error(salonError?.message || "Salon oluşturulamadı");
      }

      const workingHours = hours.map((h: WorkingHour) => ({
        salon_id: salonData.id,
        day_of_week: h.day_of_week,
        open_time: h.open_time,
        close_time: h.close_time,
        is_closed: h.is_closed,
      }));

      const { error: hoursError } = await supabase
        .from("working_hours")
        .insert(workingHours);

      if (hoursError) {
        throw new Error(hoursError.message);
      }

      toast.success("Salonunuz başarıyla oluşturuldu 🎉");
      router.push("/dashboard");

    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex font-sans">
      {/* SOL PANEL - PREMIUM TASARIM */}
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
            İşletmenizi dijitale taşıyın
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Salonunuz için <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
              modern çözüm
            </span>
          </h2>
          <p className="text-stone-300 text-lg mb-10 max-w-md leading-relaxed">
            Müşterilerinizi, randevularınızı ve personelinizi tek bir yerden, kolayca yönetin.
          </p>

          <div className="space-y-4">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-stone-200">
                <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
          <p className="text-stone-400 text-sm">© 2026 BeautyBook. Tüm hakları saklıdır.</p>
          <div className="flex gap-4 text-sm text-stone-400">
            <Link href="#" className="hover:text-white transition-colors">Yenilikler</Link>
            <Link href="#" className="hover:text-white transition-colors">Destek</Link>
          </div>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto relative">
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 text-sm font-medium text-stone-500">
          Zaten hesabınız var mı? <Link href="/auth/login" className="text-rose-600 hover:text-rose-700 transition-colors ml-1">Giriş yap</Link>
        </div>

        <div className="w-full max-w-md animate-fade-up">

          {/* ADIM GÖSTERGESİ */}
          <div className="mb-10">
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
              {step === 1 && "Hesap Oluştur"}
              {step === 2 && "Salon Detayları"}
              {step === 3 && "Çalışma Saatleri"}
            </h1>
            <p className="text-stone-500">
              Adım {step}/3:{" "}
              {step === 1 && "Güvenli giriş bilgilerinizi belirleyin."}
              {step === 2 && "İşletmenizin temel bilgilerini girin."}
              {step === 3 && "Müşterilerinizin ne zaman gelebileceğini seçin."}
            </p>

            <div className="flex gap-2 mt-6">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    s < step ? "bg-rose-500" : s === step ? "bg-rose-400" : "bg-stone-200"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* STEP 1: HESAP */}
          {step === 1 && (
            <div className="space-y-5">
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
                    value={auth.email}
                    onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Şifre</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-stone-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="En az 6 karakter"
                    className="input pl-10 pr-10"
                    value={auth.password}
                    onChange={(e) => setAuth({ ...auth, password: e.target.value })}
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

              <div>
                <label className="label">Şifre (Tekrar)</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-stone-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassConf ? "text" : "password"}
                    placeholder="Şifrenizi doğrulayın"
                    className="input pl-10 pr-10"
                    value={auth.passwordConfirm}
                    onChange={(e) => setAuth({ ...auth, passwordConfirm: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassConf(!showPassConf)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassConf ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleNextStep1}
                className="btn-primary w-full justify-center mt-2 group"
              >
                Devam Et 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 2: SALON BİLGİLERİ */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="label">Salon Adı</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-stone-400">
                    <Building2 size={20} />
                  </div>
                  <input
                    placeholder="Örn: Elegance Güzellik Salonu"
                    className="input pl-10"
                    value={salon.name}
                    onChange={(e) => setSalon({ ...salon, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Şehir</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-stone-400">
                      <Map size={20} />
                    </div>
                    <input
                      placeholder="Örn: İstanbul"
                      className="input pl-10"
                      value={salon.city}
                      onChange={(e) => setSalon({ ...salon, city: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Telefon</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-stone-400">
                      <Phone size={20} />
                    </div>
                    <input
                      placeholder="05** *** ** **"
                      className="input pl-10"
                      value={salon.phone}
                      onChange={(e) => setSalon({ ...salon, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Açık Adres</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-stone-400">
                    <MapPin size={20} />
                  </div>
                  <textarea
                    placeholder="Sokak, mahalle, bina no..."
                    className="input pl-10 pt-3 min-h-[100px] resize-none"
                    value={salon.address}
                    onChange={(e) => setSalon({ ...salon, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setStep(1)} 
                  className="btn-secondary px-4 justify-center"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={handleNextStep2}
                  className="btn-primary flex-1 justify-center group"
                >
                  Devam Et
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: ÇALIŞMA SAATLERİ */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="animate-fade-in flex flex-col h-full">
              
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm mb-6 space-y-1">
                {hours.map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      h.is_closed ? "bg-stone-50" : "bg-white hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!h.is_closed}
                        onClick={() => {
                          const n = [...hours];
                          n[i] = { ...n[i], is_closed: !n[i].is_closed };
                          setHours(n);
                        }}
                        className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 shrink-0 ${
                          !h.is_closed ? "bg-rose-500" : "bg-stone-300"
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          !h.is_closed ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                      <span className={`font-medium w-24 ${h.is_closed ? "text-stone-400" : "text-stone-700"}`}>
                        {DAYS[i]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!h.is_closed ? (
                         <>
                          <div className="relative">
                            <Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                              type="time"
                              className="text-sm bg-white border border-stone-200 rounded-lg py-1.5 pl-8 pr-2 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-stone-700 w-[105px]"
                              value={h.open_time}
                              onChange={(e) => {
                                const n = [...hours];
                                n[i] = { ...n[i], open_time: e.target.value };
                                setHours(n);
                              }}
                            />
                          </div>
                          <span className="text-stone-400">-</span>
                          <div className="relative">
                            <Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                              type="time"
                              className="text-sm bg-white border border-stone-200 rounded-lg py-1.5 pl-8 pr-2 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-stone-700 w-[105px]"
                              value={h.close_time}
                              onChange={(e) => {
                                const n = [...hours];
                                n[i] = { ...n[i], close_time: e.target.value };
                                setHours(n);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-stone-400 font-medium px-4 w-[230px] text-right">Kapalı</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setStep(2)} 
                  className="btn-secondary px-4 justify-center"
                  disabled={loading}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 justify-center relative overflow-hidden group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Oluşturuluyor...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        Salonu Oluştur <CheckCircle2 size={18} />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
