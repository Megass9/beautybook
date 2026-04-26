"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, Loader2, X, Calendar, Percent, Banknote, ToggleLeft, ToggleRight, Gift } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import toast from "react-hot-toast";
import type { Campaign } from "@/types";

interface CampaignClientProps {
  salonId: string;
  initialCampaigns: Campaign[];
}

export default function CampaignClient({ salonId, initialCampaigns }: CampaignClientProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount_type: "percent" as "percent" | "fixed",
    discount_value: 0,
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    code: "",
    is_active: true
  });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || form.discount_value <= 0) {
      toast.error("Lütfen başlık ve indirim tutarını doldurun.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from("campaigns") as any)
        .insert({
          salon_id: salonId,
          title: form.title,
          description: form.description,
          discount_type: form.discount_type,
          discount_value: form.discount_value,
          start_date: new Date(form.start_date).toISOString(),
          end_date: new Date(form.end_date).toISOString(),
          code: form.code || null,
          is_active: form.is_active
        } as any)
        .select()
        .single();

      if (error) throw error;

      setCampaigns([data, ...campaigns]);
      toast.success("Kampanya başarıyla oluşturuldu.");
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      discount_type: "percent",
      discount_value: 0,
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      code: "",
      is_active: true
    });
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await (supabase
      .from("campaigns") as any)
      .update({ is_active: !current })
      .eq("id", id);

    if (error) {
      toast.error("Hata: " + error.message);
    } else {
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, is_active: !current } : c));
      toast.success("Kampanya durumu güncellendi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return;

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Hata: " + error.message);
    } else {
      setCampaigns(campaigns.filter(c => c.id !== id));
      toast.success("Kampanya silindi.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Gift className="w-8 h-8 text-amber-500" />
            </div>
            Kampanyalar & Kuponlar
          </h1>
          <p className="text-stone-500 mt-2 font-medium">
            Özel indirimlerle müşteri sayınızı ve sadakatini artırın.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#0c0a09] text-white px-6 py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Yeni Kampanya
        </button>
      </div>

      {/* Campaigns List */}
      <div className="grid gap-6">
        {campaigns.length > 0 ? (
          campaigns.map((c) => (
            <div key={c.id} className={`bg-white rounded-[2rem] p-6 border-2 transition-all flex flex-col md:flex-row items-center gap-6 ${c.is_active ? 'border-stone-100 shadow-sm' : 'border-dashed border-stone-200 opacity-60'}`}>
               <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 ${c.is_active ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
                 <Tag className="w-10 h-10" />
               </div>
               
               <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-xl font-black text-stone-900">{c.title}</h3>
                    {c.code && <span className="bg-stone-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{c.code}</span>}
                  </div>
                  <p className="text-stone-500 text-sm font-medium line-clamp-1">{c.description || "Açıklama belirtilmemiş."}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-xs font-bold text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(c.start_date), "d MMM", { locale: tr })} - {format(new Date(c.end_date), "d MMM yyyy", { locale: tr })}
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600">
                      {c.discount_type === 'percent' ? <Percent className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                      {c.discount_type === 'percent' ? `%${c.discount_value}` : `₺${c.discount_value}`} İndirim
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(c.id, c.is_active)}
                    className={`p-3 rounded-xl transition-colors ${c.is_active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}
                    title={c.is_active ? "Pasif Yap" : "Aktif Yap"}
                  >
                    {c.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-stone-100">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 mb-2">Aktif kampanya yok</h2>
            <p className="text-stone-500 font-medium mb-8">
              Müşterilerinize özel indirimler sunarak salonunuzu canlandırın.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-[#0c0a09] text-white px-8 py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
            >
              <Plus className="w-5 h-5" />
              İlk Kampanyayı Başlat
            </button>
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)} />
          <form onSubmit={handleSubmit} className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-stone-900">Yeni Kampanya Oluştur</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-stone-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">Kampanya Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: İlkbahar Fırsatı"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold placeholder:text-stone-300 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">Açıklama</label>
                <textarea
                  placeholder="Kampanya detaylarını buraya yazın..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold placeholder:text-stone-300 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all resize-none h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">İndirim Türü</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}
                    className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all appearance-none"
                  >
                    <option value="percent">Yüzde (%)</option>
                    <option value="fixed">Sabit Tutar (₺)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">İndirim Tutarı</label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">Başlangıç</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">Bitiş</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">Kupon Kodu (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: YAZ20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold placeholder:text-stone-300 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-amber-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kampanyayı Başlat"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
