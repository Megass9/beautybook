import Link from "next/link";
import {
  Calendar, Star, Users, Sparkles, ChevronRight,
  Check, Globe, Shield, BarChart3, ArrowRight,
  Smartphone, Play, Clock, TrendingUp,
  Bell, Scissors, CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden font-sans">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 py-5 bg-white/70 backdrop-blur-2xl border-b border-stone-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-[0_8px_20px_rgba(225,29,72,0.25)] border border-rose-400/30">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-stone-900">BeautyBook.</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/80 border border-stone-200/80 rounded-full p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] backdrop-blur-md">
          {["Özellikler", "Fiyatlar", "Müşteriler", "Hakkında"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 transition-all px-5 py-2 rounded-full">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-extrabold text-stone-500 hover:text-rose-600 transition-colors hidden md:block uppercase tracking-widest">
            Giriş Yap
          </Link>
          <Link href="/auth/register" className="text-sm font-bold bg-stone-900 hover:bg-black text-white px-6 py-3 rounded-xl transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 flex items-center gap-2">
            Ücretsiz Başla
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-36 pb-0 px-6 relative overflow-hidden">
        {/* Abstract Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-rose-200/60 shadow-sm text-rose-700 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Türkiye'nin Yeni Nesil Salon Yazılımı 2.0
            </div>
          </div>

          <div className="text-center max-w-5xl mx-auto mb-16">
            <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black text-stone-900 leading-[0.95] tracking-tighter mb-8">
              Müşterileriniz {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700">7/24 randevu</span>
              <br />alsın, siz {" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-stone-900">mutlu olmaya</span>
                <span className="absolute bottom-1 sm:bottom-3 left-0 right-0 h-4 sm:h-6 bg-amber-200/80 -z-0 -skew-x-6 rounded-md" />
              </span>
              {" "}odaklanın.
            </h1>
            <p className="text-lg md:text-xl font-medium text-stone-500 max-w-3xl mx-auto mb-10 leading-relaxed">
              Güzellik salonunuz için dakikalar içinde elit mini web sitenizi ve randevu sisteminizi kurun.
              Hatırlatma SMS'leri, derinlemesine finans raporları ve sarsılmaz bir müşteri yönetimi parmaklarınızın ucunda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
              <Link href="/auth/register" className="group flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-lg font-bold px-10 py-5 rounded-2xl transition-all shadow-[0_10px_40px_rgba(225,29,72,0.35)] hover:shadow-[0_15px_50px_rgba(225,29,72,0.45)] hover:-translate-y-1 w-full sm:w-auto">
                14 Gün Ücretsiz Dene
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link href="#demo" className="group flex items-center justify-center gap-3 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-800 text-lg font-bold px-10 py-5 rounded-2xl transition-all shadow-sm hover:shadow-md w-full sm:w-auto">
                <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 text-rose-600 ml-0.5 fill-rose-600" />
                </span>
                Sistemi Göster
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Kredi Kartı Gerekmez</span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 5 Dakikada Kurulum</span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> İstediğinde İptal Et</span>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto rounded-[2.5rem] p-2 bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_20px_80px_rgba(0,0,0,0.07)]">
            <div className="rounded-[2.25rem] overflow-hidden bg-[#0c0a09] border border-stone-800 shadow-inner relative flex aspect-[16/10] sm:aspect-[16/9]">

              {/* Fake Sidebar */}
              <div className="w-64 border-r border-stone-800/60 hidden md:flex flex-col h-full bg-[#0c0a09] relative p-4">
                <div className="absolute top-0 left-0 w-full h-40 bg-rose-900/20 blur-[50px]" />
                <div className="flex items-center gap-3 mb-8 relative z-10 px-2 mt-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-white text-[15px]">Bella Studio</p>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Nişantaşı</p>
                  </div>
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="bg-stone-800/80 border border-stone-700/50 text-white rounded-2xl flex items-center gap-3 px-4 py-3 shadow-inner">
                    <BarChart3 className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-bold">Genel Bakış</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)] ml-auto" />
                  </div>
                  <div className="text-stone-400 flex items-center gap-3 px-4 py-3 opacity-60">
                    <Calendar className="w-4 h-4" /> <span className="text-sm font-bold">Randevular</span>
                  </div>
                  <div className="text-stone-400 flex items-center gap-3 px-4 py-3 opacity-60">
                    <TrendingUp className="w-4 h-4" /> <span className="text-sm font-bold">Finans & Raporlar</span>
                  </div>
                </div>
              </div>

              {/* Fake Dashboard Body */}
              <div className="flex-1 bg-stone-50 overflow-hidden flex flex-col">
                <div className="h-16 bg-white border-b border-stone-200/60 flex items-center justify-between px-6 shrink-0">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">HOŞ GELDİNİZ 🙌</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 hidden sm:block" />
                    <div className="w-8 h-8 rounded-full bg-stone-900" />
                  </div>
                </div>
                <div className="p-6 overflow-hidden hidden sm:block">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-3xl border border-stone-200/60 p-5 shadow-sm">
                      <div className="w-10 h-10 bg-rose-50 rounded-xl mb-3 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-rose-500" />
                      </div>
                      <p className="font-extrabold text-stone-900 text-2xl">₺24.500</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Bu Ayki Ciro</p>
                    </div>
                    <div className="bg-white rounded-3xl border border-stone-200/60 p-5 shadow-sm">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl mb-3 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="font-extrabold text-stone-900 text-2xl">142</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Tamamlanan</p>
                    </div>
                    <div className="bg-stone-900 rounded-3xl p-5 shadow-md border border-stone-800">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Yaklaşan</p>
                      <div className="flex items-center gap-3 bg-stone-800/50 p-3 rounded-2xl border border-stone-700/50">
                        <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-[10px] text-white font-bold">SY</div>
                        <div>
                          <p className="text-sm font-bold text-white">Selin Y.</p>
                          <p className="text-[10px] text-stone-400">14:00 - Lazer Epilasyon</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-40 bg-white rounded-3xl border border-stone-200/60 p-5 shadow-sm">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Grafik Özeti</p>
                    <div className="flex items-end gap-2 h-20 opacity-40">
                      {[40, 70, 45, 90, 65, 80, 100, 60].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-t-lg bg-gradient-to-t ${i === 6 ? 'from-rose-500 to-rose-400' : 'from-stone-300 to-stone-200'}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0c0a09] rounded-[3rem] p-10 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-10 shadow-[0_20px_80px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />
            {[
              { value: "4.500+", label: "Aktif Salon" },
              { value: "3M+", label: "İşlenen Randevu" },
              { value: "%99.9", label: "Sistem Uygunluğu" },
              { value: "₺28M+", label: "Yönetilen Ciro" },
            ].map(stat => (
              <div key={stat.label} className="text-center relative z-10">
                <p className="text-4xl md:text-5xl font-black text-rose-50 mb-2 tracking-tighter">{stat.value}</p>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="özellikler" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-5">
              Tek Platform.  Sınırsız Büyüme.
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg font-medium">
              Güzellik salonunuzu eski usül defterlerden, dijitalin sonsuz ve pürüzsüz dünyasına taşıyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-[3rem] border border-stone-200/60 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all group overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-50 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white border border-stone-200 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-sm group-hover:bg-rose-600 group-hover:border-rose-600 group-hover:text-white transition-colors duration-500 text-stone-500">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-4 tracking-tight">Size Özel Mini Web Sitesi</h3>
                <p className="text-stone-500 font-medium leading-relaxed mb-6">
                  Müşterileriniz doğrudan kendi salon bağlantınızdan 7/24 randevu alsın. Uzmanlarınızı, özel hizmetlerinizi ve fiyatlarınızı şık bir vitrinde sergileyin.
                </p>
                <div className="bg-stone-50 border border-stone-200/60 rounded-2xl px-5 py-3 inline-flex items-center gap-3 font-mono text-sm shadow-inner text-stone-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  beautybook.app/<span className="text-rose-600 font-bold">sizin-salonunuz</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c0a09] rounded-[3rem] border border-stone-800 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(225,29,72,0.15)] transition-all group overflow-hidden relative">
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-900/40 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-stone-800/80 border border-stone-700 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-500">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Akıllı Seans & Takvim</h3>
                <p className="text-stone-400 font-medium leading-relaxed mb-6">
                  Kim müsait, kimin ne randevusu var saniyesinde görün. Çakışmayı bitiren sihirli takvim yapımız sayesinde randevu trafiğinizi zahmetsiz yönetin.
                </p>
                <div className="flex gap-3">
                  {["09:00", "11:30", "14:00", "16:45"].map((t, i) => (
                    <div key={t} className={`px-4 py-2 rounded-xl text-xs font-bold ${i === 1 ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' : 'bg-stone-800 text-stone-500 border border-stone-700'}`}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Müşteri Dosyaları", desc: "Ziyaret geçmişleri, notlar, ödedikleri ücretler bir dokunuşla ekranda.", c: "text-blue-500" },
              { icon: Bell, title: "Anında Bildirim", desc: "Randevu taleplerinden iptallere, SMS entegrasyonu ile haberdar olun.", c: "text-amber-500" },
              { icon: TrendingUp, title: "Derinlemesine Rapor", desc: "Günlük, haftalık gelirlerinizi ve popüler hizmet analizlerini görün.", c: "text-emerald-500" },
              { icon: Shield, title: "Maksimum Güvenlik", desc: "Kusursuz altyapımızla verileriniz bulutta %100 güvende.", c: "text-purple-500" }
            ].map(f => (
              <div key={f.title} className="bg-white rounded-[2rem] border border-stone-200/60 p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-xl transition-all group">
                <f.icon className={`w-8 h-8 mb-5 ${f.c} group-hover:scale-110 transition-transform`} />
                <h4 className="font-extrabold text-stone-900 mb-2">{f.title}</h4>
                <p className="text-sm font-medium text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-5 py-2 rounded-full mb-5">
              3 Adımda Dönüşüm
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-5">
              Kurulum Hiç Bu Kadar Kolay Olmadı
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-stone-100 rounded-full" />

            {[
              { step: "01", icon: Sparkles, color: "bg-purple-100 text-purple-600 border-purple-200", title: "Hesabınızı Yaratın", desc: "Saniyeler içinde e-posta ile kayıt olun, salon bilgilerinizi ekleyin." },
              { step: "02", icon: Scissors, color: "bg-rose-100 text-rose-600 border-rose-200", title: "Ekibinizi Seçin", desc: "Uzmanları ve sunduğunuz çok özel hizmetleri fiyatlarıyla beraber kaydedin." },
              { step: "03", icon: Globe, color: "bg-emerald-100 text-emerald-600 border-emerald-200", title: "Uçuşa Geçin", desc: "Mini Linkinizi Instagram bio'nuza koyun, randevular anında yağsın." }
            ].map((s, idx) => (
              <div key={idx} className="relative z-10 text-center flex flex-col items-center group">
                <div className={`w-32 h-32 rounded-[2.5rem] bg-white border-2 border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center mb-8 relative group-hover:-translate-y-2 transition-transform duration-500`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.color} bg-white mb-2 shadow-sm`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">ADIM {s.step}</span>
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-3 tracking-tight">{s.title}</h3>
                <p className="text-stone-500 font-medium px-4">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIG CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#0c0a09] to-stone-900 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
                Geleceğin Salonlarına<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">Terfi Edin.</span>
              </h2>
              <p className="text-stone-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                Eski usül randevu defterini tarihe gömün. BeautyBook ile 14 gün ücretsiz Premium deneyime başlayın.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/auth/register" className="group w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-900 font-black px-12 py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 flex items-center justify-center gap-3 text-lg">
                  Kayıt Ol, Hemen Başla
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-stone-200/60 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200/50 border border-rose-400/30">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-stone-900">BeautyBook.</span>
              </div>
              <p className="text-stone-500 font-medium leading-relaxed">
                Yüksek standartlardaki güzellik salonları ve klinikler için geliştirilmiş öncü işletim sistemi. Sınırsız rezervasyon, kusursuz yönetim.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
              {[
                { title: "Platform", links: ["Özellikler", "Fiyatlandırma", "Müşteriler", "Güvenlik"] },
                { title: "Şirket", links: ["Hakkımızda", "Kariyer", "İletişim", "Basın Kiti"] },
                { title: "Destek", links: ["Yardım Merkezi", "API Dökümanları", "Durum", "Gizlilik"] }
              ].map(block => (
                <div key={block.title}>
                  <h4 className="font-extrabold text-stone-900 mb-6 uppercase tracking-widest text-xs">{block.title}</h4>
                  <ul className="space-y-4">
                    {block.links.map(l => {
                      const href =
                        l === "Özellikler" ? "#özellikler" :
                          l === "Fiyatlandırma" ? "#fiyatlar" :
                            l === "Müşteriler" ? "#müşteriler" :
                              l === "Hakkımızda" ? "/hakkimizda" :
                                l === "Kariyer" ? "/kariyer" :
                                  l === "İletişim" ? "/iletisim" :
                                    l === "Basın Kiti" ? "/basin-kiti" :
                                      l === "Gizlilik" ? "/gizlilik" :
                                        "#";

                      return (
                        <li key={l}>
                          <a href={href} className="text-sm font-semibold text-stone-500 hover:text-rose-600 transition-colors">
                            {l}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">© 2026 BeautyBook Inc. Tüm Hakları Saklıdır.</p>
            <div className="flex items-center gap-8">
              <Link href="/kullanim-sartlari" className="text-[11px] font-bold text-stone-400 hover:text-rose-600 uppercase tracking-widest transition-colors">Şartlar</Link>
              <Link href="/gizlilik" className="text-[11px] font-bold text-stone-400 hover:text-rose-600 uppercase tracking-widest transition-colors">Gizlilik</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
