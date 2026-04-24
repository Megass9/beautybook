"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Salon, WorkingHour, Database } from "@/types";
import { Globe, Copy, Check, Save, Image as ImageIcon, MapPin, Building, Phone, Clock, Upload } from "lucide-react";

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

type SalonUpdate = Database["public"]["Tables"]["salons"]["Update"];

export default function SettingsClient({ salon, hours }: { salon: Salon; hours: WorkingHour[] }) {
  const supabase = createClient() as any;
  const [form, setForm] = useState<SalonUpdate>({
    name: salon.name,
    address: salon.address || "",
    city: salon.city,
    phone: salon.phone || "",
    description: salon.description || "",
    logo_url: salon.logo_url || "",
  });
  const [wh, setWh] = useState(hours);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);

  const salonUrl = `https://beautybook.app/salon/${salon.slug}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(salonUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Logo en fazla 3MB olabilir.");
      e.target.value = "";
      return;
    }

    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${salon.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("salon-logos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("salon-logos")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setForm(prev => ({ ...prev, logo_url: publicUrl }));
      setLogoFileName(file.name);
      toast.success("Logo başarıyla yüklendi.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Logo yüklenirken bir hata oluştu.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleClearLogo = () => {
    setForm(prev => ({ ...prev, logo_url: "" }));
    setLogoFileName(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("salons")
        .update(form)
        .eq("id", salon.id);
      if (error) throw error;
      for (const h of wh) {
        await supabase.from("working_hours").upsert(h, { onConflict: "salon_id,day_of_week" });
      }
      toast.success("Tüm ayarlar başarıyla kaydedildi!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up pb-10">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Salon Ayarları</h1>
          <p className="text-sm text-stone-500 mt-1 max-w-xl">
            Salon profilinizi, iletişim bilgilerinizi ve çalışma saatlerinizi yönetin. Yaptığınız değişiklikler anında yayına alınır.
          </p>
        </div>
      </div>

      {/* ── SALON LINK (MINI WEB SITE) ── */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-[2rem] border border-rose-100 p-6 shadow-[0_4px_20px_rgba(225,29,72,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-stone-900 text-base">Mini Web Siteniz Yayında</h3>
            <p className="text-xs font-semibold text-rose-600/80 mt-0.5">Aşağıdaki bağlantıyı müşterilerinizle paylaşın.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-rose-200/60 rounded-xl p-1.5 shadow-sm max-w-lg w-full md:w-auto">
          <span className="flex-1 px-3 text-sm font-bold text-stone-700 truncate">{salonUrl}</span>
          <button
            type="button"
            onClick={copyUrl}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              copied ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 hover:bg-rose-100 text-rose-600"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ── SALON INFORMATION ── */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-200">
              <Building className="w-5 h-5 text-stone-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">Temel Bilgiler</h2>
              <p className="text-xs font-medium text-stone-500 mt-0.5">Müşterilerinizin göreceği genel salon profiliniz.</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Salon Adı</label>
                <input
                  className="w-full bg-stone-50/50 border border-stone-200/80 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 transition-all"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Örn: Luna Beauty Studio"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Salon Link Adı (Slug)</label>
                <input
                  className="w-full bg-stone-100 border border-stone-200/80 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-400 cursor-not-allowed"
                  value={salon.slug}
                  disabled
                />
                <p className="mt-2 text-[10px] font-semibold text-stone-400 pl-1">Link adı kayıt sırasında sabitlenmiştir.</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Hakkımızda / Açıklama</label>
              <textarea
                className="w-full bg-stone-50/50 border border-stone-200/80 rounded-2xl px-5 py-4 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 transition-all resize-none"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Örn: Profesyonel saç, makyaj ve güzellik hizmetleri sunan premium butik salon."
              />
            </div>

            {/* Logo Upload Segment */}
            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Salon Logosu</label>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border-2 border-dashed border-stone-200 rounded-[2rem] bg-stone-50/30">
                
                <div className="shrink-0">
                  {form.logo_url ? (
                    <div className="w-24 h-24 rounded-2xl border border-stone-200 bg-white shadow-sm flex items-center justify-center p-2 relative group overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.logo_url} alt="Salon Logo" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={handleClearLogo} className="text-white text-[10px] font-bold px-3 py-1.5 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">Kaldır</button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border border-stone-200 bg-white shadow-sm flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-stone-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <p className="text-sm font-bold text-stone-700">Logo yükleyin veya Değiştirin</p>
                  <p className="text-[11px] font-semibold text-stone-400">Önerilen: 512x512px boyutlarında PNG veya JPEG. Maksimum 3MB.</p>
                  
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <label className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      {uploadingLogo ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploadingLogo ? "Yükleniyor..." : "Dosya Seç"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                    {logoFileName && <span className="text-[11px] font-medium text-stone-500 truncate max-w-[150px]">{logoFileName}</span>}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ── CONTACT INFORMATION ── */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">İletişim & Lokasyon</h2>
              <p className="text-xs font-medium text-stone-500 mt-0.5">Müşterilerinizin size ulaşabileceği adres ve telefon bilgileri.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Telefon NUMARASI</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  className="w-full bg-stone-50/50 border border-stone-200/80 rounded-2xl pl-11 pr-5 py-3.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 transition-all"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Şehir</label>
              <input
                className="w-full bg-stone-50/50 border border-stone-200/80 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 transition-all"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="Örn: İstanbul"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Açık Adres</label>
              <input
                className="w-full bg-stone-50/50 border border-stone-200/80 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 transition-all"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Mahalle, Cadde, Sokak, Kapı No"
              />
            </div>
          </div>
        </div>

        {/* ── WORKING HOURS ── */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
              <Clock className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">Çalışma Saatleri</h2>
              <p className="text-xs font-medium text-stone-500 mt-0.5">Salonunuzun açık olduğu saatleri ve günleri belirleyin.</p>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/60 rounded-[1.5rem] divide-y divide-stone-100/80 overflow-hidden">
            <div className="hidden md:grid grid-cols-[100px_1fr_1fr_100px] gap-6 px-6 py-4 bg-stone-100/50">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Gün</span>
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">AçIlış</span>
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Kapanış</span>
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest text-center">Durum</span>
            </div>

            {wh.map((h, i) => (
              <div key={i} className="flex flex-col md:grid md:grid-cols-[100px_1fr_1fr_100px] gap-4 md:gap-6 items-center px-6 py-4 hover:bg-white transition-colors">
                <span className="text-sm font-black text-stone-700 w-full md:w-auto text-left">{DAYS[h.day_of_week]}</span>
                
                <div className="w-full flex items-center gap-3 md:contents">
                  <div className="relative w-full">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 hidden sm:block" />
                    <input
                      type="time"
                      value={String(h.open_time).slice(0,5)}
                      disabled={h.is_closed}
                      onChange={e => { const n = [...wh]; n[i] = { ...n[i], open_time: e.target.value }; setWh(n); }}
                      className="w-full bg-white border border-stone-200 rounded-xl sm:pl-9 px-4 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 disabled:opacity-40 disabled:bg-stone-100"
                    />
                  </div>
                  <span className="text-stone-300 font-bold md:hidden">-</span>
                  <div className="relative w-full">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 hidden sm:block" />
                    <input
                      type="time"
                      value={String(h.close_time).slice(0,5)}
                      disabled={h.is_closed}
                      onChange={e => { const n = [...wh]; n[i] = { ...n[i], close_time: e.target.value }; setWh(n); }}
                      className="w-full bg-white border border-stone-200 rounded-xl sm:pl-9 px-4 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 disabled:opacity-40 disabled:bg-stone-100"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto mt-2 md:mt-0 p-2 md:p-0 rounded-xl hover:bg-stone-50 md:hover:bg-transparent">
                  <input
                    type="checkbox"
                    checked={h.is_closed}
                    onChange={e => { const n = [...wh]; n[i] = { ...n[i], is_closed: e.target.checked }; setWh(n); }}
                    className="w-4 h-4 rounded border-stone-300 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-stone-500">Kapalı</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ── SAVE BUTTON ── */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              <>
                Değişiklikleri Kaydet
                <Save className="w-5 h-5 text-stone-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
