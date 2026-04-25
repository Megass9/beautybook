"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Map, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock,
  Scissors
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/slug";
import toast from "react-hot-toast";

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function SetupPage() {
  const router = useRouter();
  const supabase = createClient() as any;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [salon, setSalon] = useState({
    name: "",
    address: "",
    city: "",
    phone: ""
  });

  const [hours, setHours] = useState(
    DAYS.map((_, i) => ({
      day_of_week: i,
      open_time: "09:00",
      close_time: "19:00",
      is_closed: i === 0,
    }))
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setUser(user);
        // Zaten salonu var mı kontrol et
        supabase.from("salons").select("id").eq("owner_id", user.id).maybeSingle().then(({ data }: any) => {
          if (data) router.push("/dashboard");
        });
      }
    });
  }, []);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon.name || !salon.city || !salon.phone || !salon.address) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    
    setLoading(true);
    try {
      const slug = `${generateSlug(salon.name)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .insert({
          owner_id: user.id,
          name: salon.name,
          slug,
          address: salon.address,
          city: salon.city,
          phone: salon.phone
        })
        .select("id")
        .single();

      if (salonError) throw salonError;

      const workingHours = hours.map((h) => ({
        salon_id: salonData.id,
        day_of_week: h.day_of_week,
        open_time: h.open_time,
        close_time: h.close_time,
        is_closed: h.is_closed,
      }));

      await supabase.from("working_hours").insert(workingHours);

      toast.success("Salonunuz oluşturuldu! 🎉");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-xl border border-stone-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Sol Süsleme */}
        <div className="md:w-1/3 bg-[#1c0a0e] p-8 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-rose-600/10 blur-3xl" />
           <div className="relative z-10">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black leading-tight">Son Bir Adım Kaldı!</h2>
              <p className="text-stone-400 text-sm mt-2 font-medium">Salon bilgilerinizi girerek BeautyBook dünyasına adım atın.</p>
           </div>
           <div className="relative z-10 pt-10">
              <div className="space-y-4">
                {[1,2].map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step >= s ? "bg-rose-500 text-white" : "bg-stone-800 text-stone-500"}`}>
                      {s}
                    </div>
                    <span className={`text-xs font-bold ${step >= s ? "text-white" : "text-stone-500"}`}>
                      {s === 1 ? "Salon Bilgileri" : "Çalışma Saatleri"}
                    </span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Sağ Form */}
        <div className="flex-1 p-8 md:p-12">
          {step === 1 ? (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Salon Bilgileri</h1>
              <div className="space-y-4">
                <div>
                  <label className="label">Salon Adı</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                    <input className="input pl-10" placeholder="Elegance Güzellik" value={salon.name} onChange={e => setSalon({...salon, name: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Şehir</label>
                    <input className="input" placeholder="İstanbul" value={salon.city} onChange={e => setSalon({...salon, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Telefon</label>
                    <input className="input" placeholder="0555..." value={salon.phone} onChange={e => setSalon({...salon, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="label">Adres</label>
                  <textarea className="input min-h-[100px] py-3" placeholder="Açık adres..." value={salon.address} onChange={e => setSalon({...salon, address: e.target.value})} />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full justify-center group">
                Devam Et <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Çalışma Saatleri</h1>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {hours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100">
                    <span className="text-sm font-bold text-stone-700 w-20">{DAYS[i]}</span>
                    <div className="flex items-center gap-2">
                      {!h.is_closed ? (
                        <input 
                          type="time" 
                          className="text-xs border rounded-lg p-1" 
                          value={h.open_time} 
                          onChange={e => {
                            const n = [...hours];
                            n[i].open_time = e.target.value;
                            setHours(n);
                          }} 
                        />
                      ) : <span className="text-xs text-stone-400 italic">Kapalı</span>}
                      <button 
                        type="button"
                        onClick={() => {
                          const n = [...hours];
                          n[i].is_closed = !n[i].is_closed;
                          setHours(n);
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.is_closed ? "bg-stone-200" : "bg-rose-100 text-rose-600"}`}
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary px-5"><ArrowLeft className="w-5 h-5" /></button>
                <button onClick={handleFinish} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? "Tamamlanıyor..." : "Kurulumu Bitir"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
