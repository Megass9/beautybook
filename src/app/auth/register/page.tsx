"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Scissors } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/slug";
import toast from "react-hot-toast";

const DAYS = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];

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

  const [auth, setAuth] = useState({
    email: "",
    password: ""
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
      is_closed: i === 0,
    }))
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: auth.email,
        password: auth.password
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Kayıt başarısız");
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

      toast.success("Salon başarıyla oluşturuldu 🎉");
      router.push("/dashboard");

    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] flex font-sans">

      {/* SOL PANEL */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#1c0a0e] flex-col justify-between p-14">

        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl">BeautyBook</span>
        </Link>

        <div>
          <h2 className="text-3xl font-black text-white mb-3">
            Salonunuzu bugün başlatın
          </h2>
          <p className="text-stone-400 text-sm">14 gün ücretsiz deneyin.</p>
        </div>

        <p className="text-stone-600 text-xs">© 2026 BeautyBook</p>

      </div>

      {/* FORM PANEL */}
      <div className="flex-1 flex justify-center p-6 lg:p-12 overflow-y-auto">

        <div className="w-full max-w-md">

          <h1 className="text-3xl font-black text-stone-900 mb-6">
            Hesap oluştur
          </h1>

          {step === 1 && (
            <div className="space-y-4">

              <input
                type="email"
                placeholder="E-posta"
                className="input"
                value={auth.email}
                onChange={(e) => setAuth({ ...auth, email: e.target.value })}
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Şifre"
                  className="input"
                  value={auth.password}
                  onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                disabled={!auth.email || auth.password.length < 6}
                onClick={() => setStep(2)}
                className="btn-primary"
              >
                Devam Et
              </button>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">

              <input
                placeholder="Salon adı"
                className="input"
                value={salon.name}
                onChange={(e) => setSalon({ ...salon, name: e.target.value })}
              />

              <input
                placeholder="Şehir"
                className="input"
                value={salon.city}
                onChange={(e) => setSalon({ ...salon, city: e.target.value })}
              />

              <input
                placeholder="Telefon"
                className="input"
                value={salon.phone}
                onChange={(e) => setSalon({ ...salon, phone: e.target.value })}
              />

              <textarea
                placeholder="Adres"
                className="input"
                value={salon.address}
                onChange={(e) => setSalon({ ...salon, address: e.target.value })}
              />

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Geri
                </button>
                <button
                  disabled={!salon.name || !salon.city}
                  onClick={() => setStep(3)}
                  className="btn-primary"
                >
                  Devam
                </button>
              </div>

            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister}>

              <div className="space-y-2">
                {hours.map((h, i) => (
                  <div key={i} className="flex gap-2 items-center">

                    <span className="w-24 text-xs">{DAYS[i]}</span>

                    {!h.is_closed && (
                      <>
                        <input
                          type="time"
                          value={h.open_time}
                          onChange={(e) => {
                            const n = [...hours];
                            n[i] = { ...n[i], open_time: e.target.value };
                            setHours(n);
                          }}
                        />
                        <input
                          type="time"
                          value={h.close_time}
                          onChange={(e) => {
                            const n = [...hours];
                            n[i] = { ...n[i], close_time: e.target.value };
                            setHours(n);
                          }}
                        />
                      </>
                    )}

                    <input
                      type="checkbox"
                      checked={h.is_closed}
                      onChange={() => {
                        const n = [...hours];
                        n[i] = { ...n[i], is_closed: !n[i].is_closed };
                        setHours(n);
                      }}
                    />

                  </div>
                ))}
              </div>

              <button
                disabled={loading}
                className="btn-primary mt-4 w-full"
              >
                {loading ? "Oluşturuluyor..." : "Salonu Oluştur"}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
