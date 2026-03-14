"use client";

import Link from "next/link";
import { useState } from "react";

const TOPICS = [
  { value: "destek", label: "Destek talebi" },
  { value: "satis", label: "Satış / fiyatlandırma" },
  { value: "demo", label: "Demo talebi" },
  { value: "isbirligi", label: "İş birliği" },
  { value: "oneri", label: "Öneri / geri bildirim" },
  { value: "diger", label: "Diğer" },
];

const FAQS = [
  {
    q: "14 günlük deneme nasıl çalışır?",
    a: "Kredi kartı gerekmeksizin tüm özelliklere tam erişimle 14 gün boyunca BeautyBook'u ücretsiz kullanabilirsiniz. Süre sonunda ücretli plana geçmezseniz hesabınız otomatik olarak dondurulur.",
  },
  {
    q: "Personel ve hizmet limitleri neler?",
    a: "Starter planda 3 personel ve 20 hizmet tanımlayabilirsiniz. Pro ve Enterprise planlarda bu sınırlar kaldırılmıştır.",
  },
  {
    q: "KVKK uyumu ve veri güvenliği",
    a: "Tüm veriler Türkiye'deki ISO 27001 sertifikalı sunucularda saklanmaktadır. KVKK kapsamında veri işleme sözleşmemizi talep edebilirsiniz.",
  },
  {
    q: "Randevu iptali ve no-show politikası",
    a: "İptal politikasını ve no-show ücretini kendiniz belirleyebilirsiniz. Sistem, müşterilere otomatik hatırlatma SMS/e-postası göndererek no-show oranını düşürür.",
  },
];

export default function IletisimPage() {
  const [topic, setTopic] = useState("destek");
  const [form, setForm] = useState({
    name: "",
    email: "",
    salon: "",
    phone: "",
    city: "",
    message: "",
    priority: "normal",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filledCount = [
    form.name,
    form.email,
    form.salon,
    form.phone,
    form.city,
    form.message,
  ].filter(Boolean).length;

  const progressPercent = Math.round((filledCount / 6) * 100);
  const isValid = form.name.trim() && form.email.trim() && form.message.trim();

  const missingFields = [
    !form.name.trim() && "ad soyad",
    !form.email.trim() && "e-posta",
    !form.message.trim() && "mesaj",
  ].filter(Boolean);

  const handleSubmit = () => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        salon: "",
        phone: "",
        city: "",
        message: "",
        priority: "normal",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <p className="text-xs text-stone-400 mb-8">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Ana Sayfa
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-stone-500">İletişim</span>
        </p>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* ── Left: Intro + Form ── */}
          <div>
            <div className="mb-6">
              <p className="text-[11px] font-medium tracking-widest uppercase text-stone-400 mb-2">
                Destek &amp; İletişim
              </p>
              <h1 className="text-3xl font-black text-stone-900 leading-snug mb-2">
                Size nasıl yardımcı olabiliriz?
              </h1>
              <p className="text-sm text-stone-500 leading-relaxed">
                BeautyBook ekibi her sorunuza yardım etmek için burada. Aşağıdaki
                formu doldurarak veya doğrudan iletişime geçerek destek
                alabilirsiniz.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
              {/* Topic Pills */}
              <div>
                <p className="text-[11px] font-medium tracking-widest uppercase text-stone-400 mb-3">
                  Konu seçin
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTopic(t.value)}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] border transition-all ${
                        topic === t.value
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-white text-stone-500 border-stone-200 hover:border-rose-300 hover:text-stone-800"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-0.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Ad Soyad <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Adınız ve soyadınız"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    E-posta <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ornek@salonunuz.com"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                  />
                </div>
              </div>

              {/* Salon + Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Salon Adı
                  </label>
                  <input
                    type="text"
                    name="salon"
                    value={form.salon}
                    onChange={handleChange}
                    placeholder="Örn: Luna Beauty Studio"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0 (5xx) xxx xx xx"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Şehir / İlçe
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Örn: İstanbul, Kadıköy"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Mesajınız <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  maxLength={1000}
                  placeholder="Sorunuzu veya talebinizi detaylıca açıklayın..."
                  className="w-full rounded-2xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 resize-none"
                />
                <p className="text-[11px] text-stone-400 text-right mt-1">
                  {form.message.length} / 1000 karakter
                </p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Öncelik seviyesi
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                >
                  <option value="normal">Normal — 1-2 iş günü içinde yanıt</option>
                  <option value="yuksek">Yüksek — Aynı gün yanıt gerekiyor</option>
                  <option value="acil">Acil — Platform erişiminde sorun var</option>
                </select>
              </div>

              {/* Submit */}
              {!submitted ? (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isValid || loading}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm shadow-rose-200 transition-colors"
                  >
                    {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </button>
                  <p className="text-xs text-stone-400">
                    {isValid
                      ? "Hazır — formu göndermek için butona tıklayın."
                      : `Eksik: ${missingFields.join(", ")}`}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="w-2.5 h-2.5 stroke-white stroke-2"
                    >
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-700">
                    Mesajınız iletildi! En kısa sürede size geri döneceğiz.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Contact Info + FAQ ── */}
          <div className="flex flex-col gap-4">
            {/* Direct Contact Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-1">
              <p className="text-[11px] font-medium tracking-widest uppercase text-stone-400 mb-3">
                Doğrudan iletişim
              </p>

              {[
                {
                  icon: (
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  ),
                  icon2: <polyline points="22,6 12,13 2,6" />,
                  label: "Genel destek",
                  value: "destek@beautybook.app",
                  sub: "Teknik sorunlar, hesap yardımı",
                },
                {
                  icon: (
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  ),
                  label: "Satış & demo hattı",
                  value: "+90 (212) 555 00 10",
                  sub: "Hafta içi 09:00 – 18:00",
                },
                {
                  icon: (
                    <>
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </>
                  ),
                  label: "İş birlikleri",
                  value: "partner@beautybook.app",
                  sub: "Entegrasyon, bayilik, kurumsal",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2.5 border-b border-stone-100 last:border-b-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 stroke-stone-500"
                    >
                      {item.icon}
                      {item.icon2}
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-stone-400">{item.label}</p>
                    <p className="text-[13px] font-semibold text-stone-900">
                      {item.value}
                    </p>
                    <p className="text-[12px] text-stone-400">{item.sub}</p>
                  </div>
                </div>
              ))}

              <div className="pt-3">
                <p className="text-[11px] font-medium tracking-widest uppercase text-stone-400 mb-2">
                  Çalışma saatleri
                </p>
                {[
                  {
                    day: "Pazartesi – Cuma",
                    time: "09:00 – 18:00",
                    badge: "Açık",
                    badgeClass: "bg-green-100 text-green-700",
                  },
                  {
                    day: "Cumartesi",
                    time: "10:00 – 14:00",
                    badge: "Sınırlı",
                    badgeClass: "bg-amber-100 text-amber-700",
                  },
                  {
                    day: "Pazar",
                    time: "Kapalı",
                    badge: null,
                    badgeClass: "",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1.5 text-sm"
                  >
                    <span className="text-stone-500">{row.day}</span>
                    <span className="flex items-center gap-2 font-medium text-stone-800 text-[13px]">
                      {row.time}
                      {row.badge && (
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${row.badgeClass}`}
                        >
                          {row.badge}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex gap-2 flex-wrap">
                {["LinkedIn", "Instagram", "Twitter"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-500 hover:border-stone-400 hover:text-stone-800 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
              <p className="text-[11px] font-medium tracking-widest uppercase text-stone-400 mb-3">
                Sık sorulan sorular
              </p>
              <div className="divide-y divide-stone-100">
                {FAQS.map((faq, i) => (
                  <div key={i} className="py-3">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex justify-between items-center text-left gap-2"
                    >
                      <span className="text-[13px] font-medium text-stone-800">
                        {faq.q}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-4 h-4 stroke-stone-400 flex-shrink-0 transition-transform duration-200 ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <p className="mt-2 text-[13px] text-stone-500 leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
