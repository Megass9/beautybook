"use client";
import { useState } from "react";
import { Power, CalendarPlus, Loader2, ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SalonActionButtons({ salonId, isActive }: { salonId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: string) => {
    if (action === "toggle_status") {
      const confirm = window.confirm(isActive ? "Salonun erişimini kısıtlamak istediğinize emin misiniz?" : "Salona tekrar erişim vermek istiyor musunuz?");
      if (!confirm) return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/update-salon", {
        method: "POST",
        body: JSON.stringify({ salonId, action }),
      });
      
      if (res.ok) {
        toast.success("İşlem başarıyla gerçekleştirildi");
        router.refresh();
      } else {
        toast.error("Bir hata oluştu");
      }
    } catch (err) {
      toast.error("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        disabled={loading}
        onClick={() => handleAction("make_pro")}
        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
        title="Ödemeyi Onayla ve Pro Paket Tanımla"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-white" />}
        ONAYLA
      </button>

      <button
        disabled={loading}
        onClick={() => handleAction("toggle_status")}
        className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
          isActive ? 'bg-stone-100 text-stone-600 hover:bg-red-500 hover:text-white' : 'bg-stone-100 text-stone-600 hover:bg-emerald-500 hover:text-white'
        }`}
        title={isActive ? "Kısıtla / Pasif Yap" : "Aktif Et"}
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isActive ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
        {isActive ? 'KISITLA' : 'AKTİF ET'}
      </button>
      
      <button
        disabled={loading}
        onClick={() => handleAction("extend_30_days")}
        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CalendarPlus className="w-3.5 h-3.5" />}
        +30 GÜN
      </button>
    </div>
  );
}