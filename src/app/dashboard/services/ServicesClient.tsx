"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Scissors, Clock, Search, ArrowUpRight, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Service } from "@/types";

const CATEGORIES = ["Saç", "Manikür", "Pedikür", "Cilt Bakımı", "Kaş & Kirpik", "Masaj", "Epilasyon", "Diğer"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string; hover: string; gradient: string }> = {
  "Saç":         { bg: "bg-rose-50",    text: "text-rose-700",   border: "border-rose-200/60",   dot: "bg-rose-500",    hover: "hover:bg-rose-100/50",    gradient: "from-rose-500 to-rose-600" },
  "Manikür":     { bg: "bg-pink-50",    text: "text-pink-700",   border: "border-pink-200/60",   dot: "bg-pink-500",    hover: "hover:bg-pink-100/50",    gradient: "from-pink-500 to-pink-600" },
  "Pedikür":     { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200/60", dot: "bg-purple-500",  hover: "hover:bg-purple-100/50",  gradient: "from-purple-500 to-purple-600" },
  "Cilt Bakımı": { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200/60",  dot: "bg-amber-500",   hover: "hover:bg-amber-100/50",   gradient: "from-amber-400 to-amber-500" },
  "Kaş & Kirpik":{ bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200/60",dot: "bg-emerald-500", hover: "hover:bg-emerald-100/50", gradient: "from-emerald-400 to-emerald-500" },
  "Masaj":       { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200/60",   dot: "bg-blue-500",    hover: "hover:bg-blue-100/50",    gradient: "from-blue-500 to-blue-600" },
  "Epilasyon":   { bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-200/60", dot: "bg-orange-500",  hover: "hover:bg-orange-100/50",  gradient: "from-orange-500 to-orange-600" },
  "Diğer":       { bg: "bg-stone-50",   text: "text-stone-600",  border: "border-stone-200/60",  dot: "bg-stone-400",   hover: "hover:bg-stone-100/50",   gradient: "from-stone-400 to-stone-500" },
};

const defaultColor = CATEGORY_COLORS["Diğer"];

export default function ServicesClient({ salonId, initialServices }: { salonId: string; initialServices: Service[] }) {
  const supabase = createClient() as any;
  const [services, setServices] = useState(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", duration_minutes: 60, price: 0, category: "Saç"
  });

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description || "", duration_minutes: s.duration_minutes, price: s.price, category: s.category || "Saç" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ name: "", description: "", duration_minutes: 60, price: 0, category: "Saç" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const { data, error } = await (supabase.from("services") as any).update(form).eq("id", editing.id).select().single();
        if (error) throw error;
        setServices(prev => prev.map(s => s.id === editing.id ? data : s));
        toast.success("Hizmet güncellendi");
      } else {
        const { data, error } = await (supabase.from("services") as any).insert({ ...form, salon_id: salonId, is_active: true }).select().single();
        if (error) throw error;
        setServices(prev => [data, ...prev]);
        toast.success("Hizmet başarıyla eklendi");
      }
      closeModal();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Bu hizmet sistemden tamamen silinecek, onaylıyor musunuz?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Hizmet başarıyla silindi");
    }
  };

  // Filter & group
  const filtered = services.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedServices = CATEGORIES.reduce((acc, cat) => {
    const filtered2 = filtered.filter(s => s.category === cat);
    if (filtered2.length) acc[cat] = filtered2;
    return acc;
  }, {} as Record<string, Service[]>);

  const uncategorized = filtered.filter(s => !s.category || !CATEGORIES.includes(s.category));
  if (uncategorized.length) groupedServices["Diğer"] = [...(groupedServices["Diğer"] || []), ...uncategorized];

  // Stats
  const avgDuration = services.length ? Math.round(services.reduce((sum, s) => sum + s.duration_minutes, 0) / services.length) : 0;
  const usedCategories = Array.from(new Set(services.map(s => s.category || "Diğer")));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-up pb-10">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Hizmetler ve Menü</h1>
          <p className="text-stone-500 text-sm mt-1">Salonunuzda sunduğunuz tüm işlemleri ve fiyatları yönetin.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-[0_8px_20px_rgba(225,29,72,0.25)] hover:shadow-[0_10px_25px_rgba(225,29,72,0.35)] hover:-translate-y-0.5 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Hizmet Ekle
        </button>
      </div>

      {/* ── STATS ── */}
      {services.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up delay-100">
          {[
            { label: "Toplam Hizmet Sayısı", value: services.length, sub: `${usedCategories.length} farkı kategoride hizmet`, icon: <Scissors className="w-5 h-5 text-rose-500"/>, bg: "bg-rose-50" },
            { label: "Ortalama Fiyat", value: `₺${Math.round(services.reduce((s, sv) => s + sv.price, 0) / services.length)}`, sub: `En yüksek fiyatlı: ₺${Math.max(...services.map(s => s.price))}`, icon: <TrendingUp className="w-5 h-5 text-emerald-500"/>, bg: "bg-emerald-50" },
            { label: "Ortalama Süre", value: `${avgDuration} Dk`, sub: `En uzun işlem süresi: ${Math.max(...services.map(s => s.duration_minutes))} Dk`, icon: <Clock className="w-5 h-5 text-blue-500"/>, bg: "bg-blue-50" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-[2rem] border border-stone-200/60 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                 <div className={`w-12 h-12 ${stat.bg} border border-white rounded-2xl flex items-center justify-center shadow-inner`}>
                   {stat.icon}
                 </div>
                 <div className="bg-stone-50 p-1.5 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-stone-100">
                   <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
                 </div>
              </div>
              <p className="text-3xl font-black text-stone-900 mb-1 group-hover:scale-[1.02] transform origin-left transition-transform">{stat.value}</p>
              <p className="text-sm font-semibold text-stone-500 mb-1">{stat.label}</p>
              <p className="text-xs text-stone-400 mt-2 pt-2 border-t border-stone-100/80">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="bg-stone-50/50 rounded-[2.5rem] border border-stone-200/60 p-24 text-center shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
          <div className="w-24 h-24 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
            <div className="absolute inset-0 border-4 border-rose-50 rounded-full animate-ping opacity-50" />
            <Scissors className="w-10 h-10 text-stone-300" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-2xl mb-2 relative z-10">Müşterilerinize Neler Sunuyorsunuz?</h3>
          <p className="text-base text-stone-500 mb-8 max-w-sm mx-auto relative z-10">
            Adisyonlarınızı kesmek ve online randevu almak için öncelikle salonunuzun menüsünü oluşturmalısınız.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:-translate-y-1 relative z-10"
          >
            <Plus className="w-5 h-5" /> İlk Hizmeti Oluştur
          </button>
        </div>
      ) : (
        <div className="animate-fade-up delay-200">
          {/* ── SEARCH & FILTER ── */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Hizmetlerde ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scroll">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 text-sm font-bold px-5 py-3 rounded-2xl border transition-all ${
                  !activeCategory ? "bg-stone-900 text-white border-stone-900 shadow-md" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                }`}
              >
                Tüm Kategoriler
              </button>
              {usedCategories.map(cat => {
                const c = CATEGORY_COLORS[cat] || defaultColor;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`shrink-0 flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl border transition-all ${
                      activeCategory === cat
                        ? `${c.bg} ${c.text} ${c.border} shadow-md`
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SERVICE GRID ── */}
          {Object.keys(groupedServices).length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-20 text-center shadow-sm">
              <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 font-bold text-lg mb-1">Eşleşen hizmet bulunamadı</p>
              <p className="text-stone-400 text-sm">Arama teriminizi veya kategori filtrenizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedServices).map(([cat, svcs]) => {
                const c = CATEGORY_COLORS[cat] || defaultColor;
                return (
                  <div key={cat} className="space-y-6">
                    {/* Category header */}
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2.5 ${c.bg} ${c.text} border ${c.border} px-4 py-2 rounded-2xl text-sm font-black shadow-sm`}>
                         <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                         {cat} Kategorisi
                      </div>
                      <span className="text-xs font-bold text-stone-400 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-sm">
                        {svcs.length} hizmet listeleniyor
                      </span>
                      <div className="flex-1 h-px bg-stone-200" />
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {svcs.map(s => (
                        <div
                          key={s.id}
                          className="bg-white rounded-[2rem] border border-stone-200/60 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-stone-300 transition-all duration-300 flex flex-col group relative overflow-hidden"
                        >
                          {/* Background Glow Effect on Hover */}
                          <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full bg-gradient-to-br ${c.gradient}`} />

                          {/* Top row */}
                          <div className="flex items-start justify-between mb-5 relative z-10">
                            <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center border ${c.border} shadow-inner`}>
                              <Scissors className={`w-5 h-5 ${c.text}`} />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEdit(s)}
                                className="w-8 h-8 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center transition-all shadow-sm"
                                title="Düzenle"
                              >
                                <Pencil className="w-3.5 h-3.5 text-stone-600" />
                              </button>
                              <button
                                onClick={() => deleteService(s.id)}
                                className="w-8 h-8 bg-white hover:bg-red-50 border border-stone-200 hover:border-red-200 rounded-xl flex items-center justify-center transition-all shadow-sm"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-stone-300 hover:text-red-500 transition-colors" />
                              </button>
                            </div>
                          </div>

                          {/* Name & desc */}
                          <div className="relative z-10 flex-1">
                            <h3 className="font-extrabold text-stone-900 mb-2 text-lg line-clamp-1 group-hover:text-rose-600 transition-colors">{s.name}</h3>
                            {s.description ? (
                              <p className="text-sm text-stone-500 mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
                            ) : (
                              <p className="text-sm text-stone-300 italic mb-4">Açıklama girilmemiş</p>
                            )}
                          </div>

                          {/* Bottom row */}
                          <div className="flex items-center justify-between pt-4 border-t border-stone-100/80 mt-auto relative z-10">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              {s.duration_minutes} Dakika
                            </span>
                            <span className="text-2xl font-black text-stone-900 group-hover:scale-110 transform origin-right transition-transform">₺{s.price}</span>
                          </div>
                        </div>
                      ))}

                      {/* Add to category shortcut card */}
                      <button
                        onClick={() => { setForm(f => ({ ...f, category: cat })); setShowModal(true); }}
                        className="rounded-[2rem] border-2 border-dashed border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group min-h-[220px]"
                      >
                        <div className="w-12 h-12 bg-stone-50 border border-stone-200 group-hover:bg-white group-hover:border-rose-200 group-hover:shadow-rose-100/50 rounded-2xl flex items-center justify-center transition-all shadow-sm">
                          <Plus className="w-6 h-6 text-stone-400 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-300" />
                        </div>
                        <span className="text-sm text-stone-400 group-hover:text-rose-600 font-bold transition-colors text-center">Bu kategoriye<br/>yeni hizmet ekle</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[92vh] flex flex-col overflow-hidden animate-fade-up">

            {/* Modal header */}
            <div className="bg-white border-b border-stone-100 px-8 py-6 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${editing ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                   {editing ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-xl tracking-tight">
                    {editing ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
                  </h3>
                  <p className="text-xs font-semibold text-stone-500 mt-0.5">{editing ? "Mevcut hizmetin detaylarını değiştirin" : "Menünüze yeni bir seçenek ekleyin"}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-stone-50 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-8">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Hizmet Adı</label>
                  <input
                    className="w-full bg-white border border-stone-200/80 rounded-2xl px-5 py-4 text-base font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
                    required
                    placeholder="Örn: Profesyonel Saç Boyama"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Category Grid */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-3">Kategori</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => {
                      const c = CATEGORY_COLORS[cat] || defaultColor;
                      const active = form.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl border transition-all ${
                            active
                              ? `${c.bg} ${c.text} ${c.border} ring-2 ring-offset-1 ring-${c.dot.split('-')[1]}-400 shadow-sm`
                              : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                          <span className={`text-[10px] font-bold ${active ? "" : "opacity-80"}`}>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">
                    Açıklama <span className="font-semibold normal-case text-stone-400">(İsteğe bağlı)</span>
                  </label>
                  <textarea
                    className="w-full bg-white border border-stone-200/80 rounded-2xl px-5 py-4 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all resize-none"
                    rows={3}
                    placeholder="Müşterileriniz bu hizmetin içeriğinde neler olduğunu bilsin..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Duration & Price */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Süre (Dk)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="number"
                        className="w-full bg-white border border-stone-200/80 rounded-2xl pl-12 pr-4 py-4 text-base font-bold text-stone-900 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
                        min={15} step={15} required
                        value={form.duration_minutes}
                        onChange={e => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Fiyat (₺)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500 text-lg font-black">₺</span>
                      <input
                        type="number"
                        className="w-full bg-white border border-stone-200/80 rounded-2xl pl-10 pr-4 py-4 text-base font-bold text-stone-900 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
                        min={0} required
                        value={form.price}
                        onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Box */}
                {form.name && (
                  <div className={`mt-2 rounded-2xl border p-4 flex items-center gap-4 transition-colors ${(CATEGORY_COLORS[form.category] || defaultColor).bg} ${(CATEGORY_COLORS[form.category] || defaultColor).border}`}>
                    <div className="w-10 h-10 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/40">
                      <Scissors className={`w-5 h-5 ${(CATEGORY_COLORS[form.category] || defaultColor).text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-stone-900 truncate">{form.name}</p>
                      <p className="text-xs font-semibold text-stone-500 mt-0.5">{form.duration_minutes} dk · {form.category}</p>
                    </div>
                    <p className="text-xl font-black text-rose-600 shrink-0">₺{form.price}</p>
                  </div>
                )}

              </form>
            </div>
            
            <div className="bg-stone-50 border-t border-stone-200/60 p-6 flex gap-4 rounded-b-[2.5rem] shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="w-1/3 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold py-4 rounded-2xl transition-all text-sm shadow-sm"
              >
                İptal Et
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-2/3 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all text-sm shadow-[0_8px_20px_rgba(225,29,72,0.25)] hover:shadow-[0_10px_25px_rgba(225,29,72,0.35)] hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {"Kaydediliyor..."}
                  </span>
                ) : editing ? "Değişiklikleri Kaydet" : "Hizmeti Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
