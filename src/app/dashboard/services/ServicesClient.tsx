"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Scissors, Clock, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Service } from "@/types";

const CATEGORIES = ["Saç", "Manikür", "Pedikür", "Cilt Bakımı", "Kaş & Kirpik", "Masaj", "Epilasyon", "Diğer"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Saç":         { bg: "bg-rose-50",    text: "text-rose-700",   border: "border-rose-200",   dot: "bg-rose-500" },
  "Manikür":     { bg: "bg-pink-50",    text: "text-pink-700",   border: "border-pink-200",   dot: "bg-pink-500" },
  "Pedikür":     { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  "Cilt Bakımı": { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500" },
  "Kaş & Kirpik":{ bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-500" },
  "Masaj":       { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500" },
  "Epilasyon":   { bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  "Diğer":       { bg: "bg-stone-100",  text: "text-stone-600",  border: "border-stone-200",  dot: "bg-stone-400" },
};

const defaultColor = { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200", dot: "bg-stone-400" };

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
        toast.success("Hizmet eklendi");
      }
      closeModal();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Bu hizmet silinsin mi?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Hizmet silindi");
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
  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);
  const avgDuration = services.length ? Math.round(services.reduce((sum, s) => sum + s.duration_minutes, 0) / services.length) : 0;
  const usedCategories = Array.from(new Set(services.map(s => s.category || "Diğer")));

  return (
    <div className="space-y-6 pb-10">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Hizmetler</h1>
          <p className="text-sm text-stone-400 mt-0.5">{services.length} hizmet · {usedCategories.length} kategori</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-rose-200"
        >
          <Plus className="w-4 h-4" /> Hizmet Ekle
        </button>
      </div>

      {/* ── STATS ── */}
      {services.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Toplam Hizmet", value: services.length, sub: `${usedCategories.length} kategori` },
            { label: "Ort. Fiyat", value: `₺${Math.round(services.reduce((s, sv) => s + sv.price, 0) / services.length)}`, sub: `En yüksek: ₺${Math.max(...services.map(s => s.price))}` },
            { label: "Ort. Süre", value: `${avgDuration} dk`, sub: `En uzun: ${Math.max(...services.map(s => s.duration_minutes))} dk` },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <p className="text-xs text-stone-400 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-stone-900">{stat.value}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="bg-white rounded-3xl border border-stone-200 p-20 text-center shadow-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Scissors className="w-7 h-7 text-stone-400" />
          </div>
          <h3 className="font-bold text-stone-700 mb-2">Henüz hizmet eklenmedi</h3>
          <p className="text-sm text-stone-400 mb-6 max-w-xs mx-auto">
            Müşterilerinizin randevu alabilmesi için salon hizmetlerinizi ekleyin.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-rose-200"
          >
            <Plus className="w-4 h-4" /> İlk Hizmeti Ekle
          </button>
        </div>
      ) : (
        <>
          {/* ── SEARCH & FILTER ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Hizmet ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                  !activeCategory ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                }`}
              >
                Tümü
              </button>
              {usedCategories.map(cat => {
                const c = CATEGORY_COLORS[cat] || defaultColor;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                      activeCategory === cat
                        ? `${c.bg} ${c.text} ${c.border}`
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SERVICE GRID ── */}
          {Object.keys(groupedServices).length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <p className="text-stone-400 text-sm">Eşleşen hizmet bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedServices).map(([cat, svcs]) => {
                const c = CATEGORY_COLORS[cat] || defaultColor;
                return (
                  <div key={cat}>
                    {/* Category header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex items-center gap-2 ${c.bg} ${c.text} border ${c.border} px-3 py-1.5 rounded-full text-xs font-bold`}>
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        {cat}
                      </div>
                      <span className="text-xs text-stone-400">{svcs.length} hizmet</span>
                      <div className="flex-1 h-px bg-stone-200" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {svcs.map(s => (
                        <div
                          key={s.id}
                          className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-stone-300 hover:shadow-md transition-all group"
                        >
                          {/* Top row */}
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center border ${c.border}`}>
                              <Scissors className={`w-4 h-4 ${c.text}`} />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEdit(s)}
                                className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center justify-center transition-colors"
                                title="Düzenle"
                              >
                                <Pencil className="w-3 h-3 text-stone-600" />
                              </button>
                              <button
                                onClick={() => deleteService(s.id)}
                                className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          </div>

                          {/* Name & desc */}
                          <h3 className="font-bold text-stone-900 mb-1 text-sm">{s.name}</h3>
                          {s.description && (
                            <p className="text-xs text-stone-400 mb-3 line-clamp-2 leading-relaxed">{s.description}</p>
                          )}

                          {/* Bottom row */}
                          <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
                            <span className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-lg">
                              <Clock className="w-3 h-3" />
                              {s.duration_minutes} dk
                            </span>
                            <span className="text-xl font-black text-rose-600">₺{s.price}</span>
                          </div>
                        </div>
                      ))}

                      {/* Add to category shortcut */}
                      <button
                        onClick={() => { setForm(f => ({ ...f, category: cat })); setShowModal(true); }}
                        className="rounded-2xl border-2 border-dashed border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 p-5 flex flex-col items-center justify-center gap-2 transition-all group min-h-[120px]"
                      >
                        <div className="w-8 h-8 bg-stone-100 group-hover:bg-rose-100 rounded-xl flex items-center justify-center transition-colors">
                          <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-500 transition-colors" />
                        </div>
                        <span className="text-xs text-stone-400 group-hover:text-rose-500 font-medium transition-colors">{cat} ekle</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h3 className="font-black text-stone-900 text-lg">
                  {editing ? "Hizmeti Düzenle" : "Yeni Hizmet"}
                </h3>
                <p className="text-xs text-stone-400">{editing ? "Bilgileri güncelleyin" : "Hizmet bilgilerini doldurun"}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Hizmet Adı</label>
                <input
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                  required
                  placeholder="Örn: Saç Boyama"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Kategori</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => {
                    const c = CATEGORY_COLORS[cat] || defaultColor;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-[10px] font-semibold transition-all ${
                          form.category === cat
                            ? `${c.bg} ${c.text} ${c.border} border-2`
                            : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Açıklama <span className="font-normal normal-case text-stone-400">(isteğe bağlı)</span>
                </label>
                <textarea
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all resize-none"
                  rows={2}
                  placeholder="Hizmet hakkında kısa açıklama..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Süre (dk)</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="number"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                      min={15} step={15} required
                      value={form.duration_minutes}
                      onChange={e => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Fiyat (₺)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">₺</span>
                    <input
                      type="number"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                      min={0} required
                      value={form.price}
                      onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {form.name && (
                <div className={`rounded-xl border p-3 flex items-center gap-3 ${(CATEGORY_COLORS[form.category] || defaultColor).bg} ${(CATEGORY_COLORS[form.category] || defaultColor).border}`}>
                  <Scissors className={`w-4 h-4 shrink-0 ${(CATEGORY_COLORS[form.category] || defaultColor).text}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-900 truncate">{form.name}</p>
                    <p className="text-xs text-stone-500">{form.duration_minutes} dk · {form.category}</p>
                  </div>
                  <p className="text-base font-black text-rose-600 shrink-0">₺{form.price}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-rose-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Kaydediliyor...
                    </span>
                  ) : editing ? "Güncelle" : "Hizmet Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
