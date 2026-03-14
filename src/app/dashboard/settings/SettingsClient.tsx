"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Salon, WorkingHour, Database } from "@/types";
import { Globe, Copy, Check } from "lucide-react";

const DAYS = ["Pazar", "Pazartesi", "Salı", "Carsamba", "Persembe", "Cuma", "Cumartesi"];

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

  // Her zaman aynı, kanonik domaini göster
  const salonUrl = `https://beautybook.app/salon/${salon.slug}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(salonUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basit doğrulama
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      toast.error("Logo en fazla 3MB olabilir.");
      e.target.value = "";
      return;
    }

    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${salon.id}/${Date.now()}.${ext}`;

      // NOT: "salon-logos" bucket'ını Supabase panelinden oluşturmuş olmanız gerekiyor.
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
      toast.success("Logo yüklendi.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Logo yüklenirken bir hata oluştu.");
    } finally {
      setUploadingLogo(false);
      // aynı dosyayı tekrar seçebilsin diye input'u temizle
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
      toast.success("Ayarlar kaydedildi!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal-900">Salon Ayarları</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Salon bilgileriniz, iletişim detaylarınız ve çalışma saatleriniz buradan yönetilir. Değişiklikler kaydedildiğinde
          mini web siteniz otomatik olarak güncellenir.
        </p>
      </div>

      <div className="card p-5 bg-gradient-to-r from-rose-50 to-sand-50">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-rose-600" />
          <p className="text-sm font-medium text-charcoal-700">Mini Web Sitenizin Adresi</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-rose-200 rounded-xl px-4 py-3">
          <span className="flex-1 text-sm font-mono text-rose-600 truncate">{salonUrl}</span>
          <button onClick={copyUrl} className="p-1.5 hover:bg-rose-50 rounded-lg transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-charcoal-400" />}
          </button>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-charcoal-800">Salon Bilgileri</h2>
            <p className="mt-1 text-xs text-charcoal-500">
              Müşterileriniz mini web sitenizde bu bilgileri görür. İsim ve şehir zorunludur, diğer alanları dilediğiniz gibi düzenleyebilirsiniz.
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
              <div>
                <label className="label">Salon Adı</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Örn: Luna Beauty Studio"
                />
              </div>
              <div>
                <label className="label">Salon Link Adı (slug)</label>
                <input
                  className="input bg-sand-50 text-charcoal-500 cursor-not-allowed"
                  value={salon.slug}
                  disabled
                />
                <p className="mt-1 text-[11px] text-charcoal-400">
                  Bu alan kayıt sonrası sabitlenir. Müşterileriniz bu isim ile salonunuzu bulur.
                </p>
              </div>
            </div>
            <div>
              <label className="label">Açıklama</label>
              <textarea
                className="input resize-none"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Örn: Profesyonel saç, makyaj ve bakım hizmetleri sunan butik güzellik salonu."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Adres</label>
                <input
                  className="input"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Sokak, mahalle, ilçe"
                />
              </div>
              <div>
                <label className="label">Şehir</label>
                <input
                  className="input"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Örn: İstanbul"
                />
              </div>
            </div>
            <div>
              <label className="label">Telefon</label>
              <input
                className="input"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+90 5xx xxx xx xx"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 items-start">
              <div>
                <label className="label">Logo URL</label>
                <input
                  className="input"
                  value={form.logo_url}
                  onChange={e => setForm({ ...form, logo_url: e.target.value })}
                  placeholder="Örn: https://.../logo.png"
                />
                <p className="mt-1 text-[11px] text-charcoal-400">
                  PNG veya SVG logo URL&apos;si ekleyin. Mini web sitenizde ve bazı panellerde görünecek.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-charcoal-600 cursor-pointer">
                      <span className="px-3 py-1.5 rounded-lg border border-sand-300 bg-sand-50 hover:bg-sand-100 transition-colors">
                        {uploadingLogo ? "Yükleniyor..." : "Bilgisayardan logo yükle"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                    {form.logo_url && (
                      <button
                        type="button"
                        onClick={handleClearLogo}
                        className="text-[11px] text-charcoal-400 hover:text-rose-600 underline-offset-2 hover:underline"
                      >
                        Logoyu kaldır
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-charcoal-400">
                    <span>Maks. 3MB · Kare veya yatay logo önerilir.</span>
                    {logoFileName && (
                      <span className="px-2 py-0.5 rounded-full bg-sand-100 text-charcoal-500">
                        Seçilen: {logoFileName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {form.logo_url && (
                <div className="flex flex-col items-start gap-2">
                  <span className="text-[11px] font-medium text-charcoal-500">Önizleme</span>
                  <div className="h-16 w-32 rounded-xl border border-sand-200 bg-white flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.logo_url} alt={`${form.name} logo`} className="max-h-12 w-auto object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-charcoal-800">Çalışma Saatleri</h2>
            <p className="mt-1 text-xs text-charcoal-500">
              Her gün için açılış ve kapanış saatini belirleyin. Kapalı olduğunuz günler için &quot;Kapalı&quot; kutusunu işaretleyin.
            </p>
          </div>
          <div className="space-y-3">
            {wh.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-charcoal-700 w-24 font-medium">{DAYS[h.day_of_week]}</span>
                <input type="time" value={String(h.open_time).slice(0,5)} disabled={h.is_closed}
                  onChange={e => { const n = [...wh]; n[i] = { ...n[i], open_time: e.target.value }; setWh(n); }}
                  className="input py-2 text-sm flex-1 disabled:opacity-40" />
                <span className="text-charcoal-400">-</span>
                <input type="time" value={String(h.close_time).slice(0,5)} disabled={h.is_closed}
                  onChange={e => { const n = [...wh]; n[i] = { ...n[i], close_time: e.target.value }; setWh(n); }}
                  className="input py-2 text-sm flex-1 disabled:opacity-40" />
                <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                  <input type="checkbox" checked={h.is_closed}
                    onChange={e => { const n = [...wh]; n[i] = { ...n[i], is_closed: e.target.checked }; setWh(n); }} />
                  <span className="text-xs text-charcoal-500">Kapalı</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}
