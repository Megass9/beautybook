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
    <div className="flex items-center gap-3">
      <button
        disabled={loading}
        onClick={() => handleAction("make_pro")}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
        title="Ödemeyi Onayla ve Pro Paket Tanımla"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-white" />}
        Ödemeyi Onayla (PRO)
      </button>

      <button
        disabled={loading}
        onClick={() => handleAction("toggle_status")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
          isActive ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
        }`}
        title={isActive ? "Kısıtla / Pasif Yap" : "Aktif Et"}
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isActive ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
        {isActive ? 'Kısıtla' : 'Aktif Et'}
      </button>
      
      <button
        disabled={loading}
        onClick={() => handleAction("extend_30_days")}
        className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-md active:scale-95"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CalendarPlus className="w-3.5 h-3.5" />}
        +30 Gün Uzat
      </button>
    </div>
  );
}