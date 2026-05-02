"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ChevronRight, CheckCircle2, 
  Smartphone, BarChart3, Clock,
  Users, Sparkles, MousePointer2, Globe,
  Calendar, MessageSquare, TrendingUp, Star, ShieldCheck
} from "lucide-react";
import Link from "next/link";

const DEMO_STEPS = [
  {
    id: "mini-site",
    title: "Müşteri Deneyimi",
    subtitle: "Dijital Vitrininiz",
    desc: "Müşterileriniz size özel bağlantıdan (beautybook.app/salon-adiniz) hizmetleri inceler, uzman seçer ve 7/24 randevu oluşturur.",
    icon: Globe,
    color: "rose",
    mockup: (
      <div className="w-full h-full bg-white text-stone-900 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-2 bg-stone-100 rounded-full" />
            <div className="w-4 h-2 bg-stone-100 rounded-full" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="relative h-40 bg-stone-100 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-amber-50" />
            <div className="absolute bottom-4 left-4 right-4 h-12 bg-white/80 backdrop-blur rounded-xl border border-white/50 flex items-center px-4 gap-3">
              <div className="w-6 h-6 bg-rose-500 rounded-full" />
              <div className="h-2 w-20 bg-stone-200 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-xl italic tracking-tight">VIP Saç Tasarım</h4>
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
              <span className="text-[10px] text-stone-400 ml-1 font-bold">(120+ Yorum)</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-xs font-bold text-stone-600">Kesim & Bakım</span>
            <span className="text-sm font-black text-rose-500">₺850</span>
          </div>
          <button className="w-full py-4 bg-rose-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-200 uppercase tracking-widest">Randevu Al</button>
        </div>
      </div>
    )
  },
  {
    id: "booking",
    title: "Akıllı Takvim",
    subtitle: "Kusursuz Planlama",
    desc: "Karmasık defterlere son! Sistem, uzmanlarınızın müsaitliğini kontrol eder ve çakışmaları %100 önler.",
    icon: Calendar,
    color: "amber",
    mockup: (
      <div className="w-full h-full bg-stone-50 p-6 flex flex-col gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[14, 15, 16, 17, 18].map((d) => (
            <div key={d} className={`flex-shrink-0 w-12 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${d === 16 ? 'border-rose-500 bg-white shadow-xl scale-110' : 'border-stone-100 bg-white/50 text-stone-400'}`}>
              <span className="text-[8px] font-black uppercase tracking-tighter">Eki</span>
              <span className={`text-lg font-black ${d === 16 ? 'text-rose-500' : 'text-stone-600'}`}>{d}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {["09:00", "10:30 (Müsait)", "14:00", "15:30"].map((t, i) => (
            <div key={t} className={`p-4 rounded-2xl border-2 flex items-center justify-between text-xs font-black transition-all ${i === 1 ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-white bg-white/60 text-stone-300'}`}>
              {t}
              {i === 1 && <CheckCircle2 size={14} />}
            </div>
          ))}
        </div>
        <div className="mt-auto p-4 bg-stone-900 rounded-2xl text-white flex justify-between items-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">Onay Bekleyen</div>
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px]">3</div>
        </div>
      </div>
    )
  },
  {
    id: "staff",
    title: "Ekip Yönetimi",
    subtitle: "Personel & Performans",
    desc: "Personelinizin çalışma saatlerini, uzmanlık alanlarını ve hak ettikleri primleri tek bir ekrandan yönetin.",
    icon: Users,
    color: "blue",
    mockup: (
      <div className="w-full h-full bg-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-black">Ekip Listesi</p>
            <p className="text-[9px] text-stone-400 font-bold">5 Aktif Personel</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { n: "Ayşe Y.", r: "Saç Tasarım", p: 85, c: "bg-emerald-500" },
            { n: "Mehmet D.", r: "Cilt Bakımı", p: 60, c: "bg-blue-500" },
            { n: "Canan K.", r: "Makyaj", p: 92, c: "bg-rose-500" }
          ].map((s) => (
            <div key={s.n} className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-black">{s.n} <span className="text-stone-400 font-bold ml-1">• {s.r}</span></p>
                <span className="text-[10px] font-black">%{s.p}</span>
              </div>
              <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                <div className={`h-full ${s.c}`} style={{ width: `${s.p}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "notifications",
    title: "Otomasyon",
    subtitle: "Akıllı Hatırlatıcılar",
    desc: "Randevu hatırlatmaları ile iptalleri %40 azaltın. Müşterilerinize özel günlerde otomatik mesajlar gönderin.",
    icon: MessageSquare,
    color: "emerald",
    mockup: (
      <div className="w-full h-full bg-[#f0f2f5] p-4 flex flex-col">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 max-w-[85%] self-start mt-6 relative">
          <p className="text-[11px] leading-relaxed text-stone-800">
            Sayın <b>Selin Hanım</b>, BeautyBook'taki randevunuz yarın saat <b>14:00</b>'dadır.
          </p>
          <span className="text-[8px] text-stone-400 mt-2 block font-bold">10:00 AM • BeautyBook SMS</span>
        </div>
        <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-md max-w-[85%] self-end mt-4 relative">
          <p className="text-[11px] leading-relaxed font-bold">Teşekkürler, orada olacağım!</p>
          <div className="absolute -right-1 top-4 w-2 h-2 bg-emerald-500 rotate-45" />
        </div>
      </div>
    )
  },
  {
    id: "dashboard",
    title: "Raporlama",
    subtitle: "İşletme Analizi",
    desc: "Günlük ciro, yaklaşan randevular ve personel performans raporları anlık olarak dashboard'unuza düşer.",
    icon: TrendingUp,
    color: "blue",
    mockup: (
      <div className="w-full h-full bg-[#0c0a09] p-6 text-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="h-2 w-12 bg-stone-700 rounded" />
          <div className="w-6 h-6 bg-rose-500 rounded-full" />
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Aylık Ciro</p>
              <p className="text-2xl font-black text-emerald-400">₺124.500</p>
            </div>
            <div className="text-emerald-500 text-[10px] font-black pb-1">+12.4%</div>
          </div>
        </div>
        <div className="flex-1 bg-stone-900 border border-stone-800 rounded-2xl p-4">
          <div className="flex items-end justify-between h-24 gap-1">
            {[30, 45, 25, 60, 40, 80, 50].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-rose-500' : 'bg-stone-700'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="text-[8px] text-center text-stone-600 font-bold mt-2 uppercase">Haftalık Hizmet Yoğunluğu</p>
        </div>
      </div>
    )
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = DEMO_STEPS[currentStep];

  // Otomatik geçiş (isteğe bağlı)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Glow Effects */}
      <div className="absolute w-[800px] h-[800px] bg-rose-600/10 blur-[150px] rounded-full -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -bottom-40 -right-40 pointer-events-none" />

      {/* Navigation */}
      <header className="p-6 md:p-10 flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="w-4 h-4" /> Vazgeç
        </Link>
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Canlı Demo Modu</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 md:px-20 max-w-7xl mx-auto relative z-10 py-12">
        
        {/* Left: Info Section */}
        <div className="w-full lg:w-1/2 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-2">
                <step.icon className="w-5 h-5 text-rose-500" />
                <span className="text-xs font-black uppercase tracking-widest text-rose-400">{step.title}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-tight">
                {step.subtitle}
              </h1>
              <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed max-w-md">
                {step.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step Selector for Desktop */}
          <div className="hidden lg:grid grid-cols-1 gap-3 pt-4">
            {DEMO_STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all ${currentStep === i ? 'bg-white/5 ring-1 ring-white/10' : 'opacity-40 hover:opacity-70'}`}
              >
                <s.icon size={18} className={currentStep === i ? 'text-rose-500' : 'text-stone-400'} />
                <span className="text-[11px] font-black uppercase tracking-widest">{s.title}</span>
                {currentStep === i && (
                  <motion.div 
                    layoutId="progress-bar"
                    className="absolute bottom-0 left-0 h-0.5 bg-rose-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-8">
            <button 
              onClick={() => setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length)}
              className="flex items-center gap-2 bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-stone-200 transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              İLERLE <ChevronRight size={18} />
            </button>
            <Link href="/auth/register" className="font-black text-stone-500 hover:text-white transition-colors text-sm uppercase tracking-widest px-6">
              Ücretsiz Başla
            </Link>
          </div>
        </div>

        {/* Right: Mockup Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <motion.div
            key={step.id}
            initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-[300px] md:w-[350px] aspect-[9/19] bg-stone-900 rounded-[3rem] border-[8px] border-stone-800 shadow-2xl relative overflow-hidden ring-4 ring-stone-900/50"
          >
            {/* iPhone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-800 rounded-b-3xl z-50" />
            
            {/* Content Mockup */}
            <div className="w-full h-full relative z-10 overflow-hidden">
              {step.mockup}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="p-10 text-center text-stone-600 text-[10px] font-black uppercase tracking-[0.3em] relative z-10">
        © 2026 BeautyBook. Dijital Salon Yönetim Standartı.
      </footer>
    </div>
  );
}