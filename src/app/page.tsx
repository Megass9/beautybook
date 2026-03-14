import Link from "next/link";
import {
  Calendar, Star, Users, Sparkles, ChevronRight,
  Check, Zap, Globe, Shield, BarChart3, ArrowRight,
  Smartphone, Award, Play, MapPin, Clock, TrendingUp,
  MessageSquare, Bell, CreditCard, Scissors
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf7f4] overflow-x-hidden font-sans">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#faf7f4]/80 backdrop-blur-xl border-b border-stone-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-stone-900">BeautyBook</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-white/80 border border-stone-200/80 rounded-full px-2 py-1.5 shadow-sm">
          {["Özellikler", "Fiyatlar", "Müşteriler", "Hakkında"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all font-medium px-4 py-1.5 rounded-full">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors px-4 py-2 hidden md:block">
            Giriş Yap
          </Link>
          <Link href="/auth/register" className="text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full transition-colors shadow-md shadow-rose-200 flex items-center gap-1.5">
            Ücretsiz Başla
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-0 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-[15%] w-[600px] h-[600px] bg-rose-100 rounded-full blur-[120px] opacity-40" />
          <div className="absolute top-40 right-[5%] w-[400px] h-[400px] bg-amber-100 rounded-full blur-[100px] opacity-50" />
          <div className="absolute -bottom-20 left-[30%] w-[500px] h-[300px] bg-stone-200 rounded-full blur-[80px] opacity-30" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Top badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white border border-rose-100 shadow-sm text-rose-700 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"/>
              2.500+ salon güveniyor · Türkiye #1
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-stone-900 leading-[1.05] tracking-tight mb-6">
              Müşterileriniz{" "}
              <span className="relative inline-block">
                <span className="text-rose-600">7/24</span>
                <svg className="absolute -bottom-2 left-0 w-full overflow-visible" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 1 100 5 Q150 9 200 4" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
              </span>
              {" "}randevu alsın,{" "}
              <br />
              siz{" "}
              <em className="not-italic relative">
                <span className="relative z-10">kazanmaya</span>
                <span className="absolute -bottom-1 left-0 right-0 h-4 bg-amber-200/60 -z-0 -skew-x-2" />
              </em>
              {" "}odaklanın.
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Güzellik salonunuz için dakikalar içinde mini web sitesi ve randevu sistemi kurun.
              Hatırlatma SMS'leri, gelir raporları ve müşteri takibi — hepsi bir arada.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link href="/auth/register" className="group flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5">
                14 Gün Ücretsiz Dene
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="group flex items-center gap-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-base font-medium px-7 py-4 rounded-2xl transition-all shadow-sm hover:shadow-md">
                <span className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-rose-600 ml-0.5 fill-rose-600" />
                </span>
                Demo İzle
              </Link>
            </div>
            <p className="text-xs text-stone-400">Kredi kartı gerekmez &middot; 5 dakikada kurulum &middot; İstediğinizde iptal</p>
          </div>

          {/* Social proof row */}
          <div className="flex items-center justify-center gap-8 mt-10 mb-14">
            <div className="flex -space-x-2">
              {["bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-blue-400", "bg-purple-400"].map((c, i) => (
                <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              <span className="text-sm text-stone-600 ml-1 font-medium">4.9/5 · 2.500+ aktif salon</span>
            </div>
          </div>

          {/* Dashboard Screenshot */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-6 bg-gradient-to-b from-rose-100/60 via-amber-50/40 to-transparent rounded-3xl blur-2xl" />
            <div className="relative rounded-[20px] overflow-hidden border border-stone-200/80 shadow-2xl shadow-stone-300/40 bg-white">
              {/* Browser chrome */}
              <div className="bg-stone-100 border-b border-stone-200 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"/>
                  <div className="w-3 h-3 rounded-full bg-amber-400"/>
                  <div className="w-3 h-3 rounded-full bg-green-400"/>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border border-stone-200 rounded-lg px-5 py-1.5 text-xs text-stone-400 font-mono flex items-center gap-2 w-72">
                    <Shield className="w-3 h-3 text-green-500"/>
                    beautybook.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard body */}
              <div className="bg-[#f8f6f3] p-6">
                <div className="flex gap-5">
                  {/* Sidebar */}
                  <div className="w-48 shrink-0 bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-stone-100">
                      <div className="w-7 h-7 bg-rose-600 rounded-lg flex items-center justify-center">
                        <Scissors className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-bold text-stone-800">Bella Salon</span>
                    </div>
                    {[
                      { icon: BarChart3, label: "Genel Bakış", active: true },
                      { icon: Calendar, label: "Takvim" },
                      { icon: Users, label: "Müşteriler" },
                      { icon: Scissors, label: "Hizmetler" },
                      { icon: TrendingUp, label: "Raporlar" },
                    ].map(item => (
                      <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-0.5 text-xs font-medium transition-colors ${item.active ? "bg-rose-50 text-rose-600" : "text-stone-500 hover:bg-stone-50"}`}>
                        <item.icon className="w-3.5 h-3.5" />
                        {item.label}
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Bugün", value: "12", sub: "randevu", trend: "+3", color: "rose" },
                        { label: "Bu Hafta", value: "₺6.840", sub: "gelir", trend: "+18%", color: "emerald" },
                        { label: "Müşteriler", value: "248", sub: "toplam", trend: "+12", color: "blue" },
                        { label: "Doluluk", value: "%87", sub: "bu ay", trend: "+5%", color: "amber" },
                      ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-xl p-3 border border-stone-200 shadow-sm">
                          <p className="text-[10px] text-stone-400 mb-1 font-medium uppercase tracking-wide">{stat.label}</p>
                          <p className="text-xl font-black text-stone-900">{stat.value}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] text-stone-400">{stat.sub}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold ml-auto">{stat.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {/* Appointments */}
                      <div className="col-span-2 bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-stone-700">Bugünkü Randevular</p>
                          <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Salı, 12 Mar</span>
                        </div>
                        {[
                          { name: "Ayşe K.", service: "Saç Boyama", time: "10:00", avatar: "A", status: "confirmed" },
                          { name: "Fatma Y.", service: "Manikür & Pedikür", time: "11:30", avatar: "F", status: "pending" },
                          { name: "Zeynep A.", service: "Cilt Bakımı", time: "14:00", avatar: "Z", status: "confirmed" },
                          { name: "Merve B.", service: "Saç Kesim", time: "16:30", avatar: "M", status: "confirmed" },
                        ].map(apt => (
                          <div key={apt.name} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0">
                            <div className="w-7 h-7 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">{apt.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-stone-800 truncate">{apt.name}</p>
                              <p className="text-[10px] text-stone-400 truncate">{apt.service}</p>
                            </div>
                            <span className="text-[10px] font-mono text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md">{apt.time}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${apt.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                              {apt.status === "confirmed" ? "✓ Onaylı" : "⏳ Bekle"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Quick booking */}
                      <div className="flex flex-col gap-3">
                        <div className="bg-rose-600 rounded-xl p-4 text-white flex-1">
                          <p className="text-[10px] font-semibold opacity-70 mb-3 uppercase tracking-wide">Hızlı Randevu</p>
                          <div className="space-y-2">
                            {["Müşteri seç...", "Hizmet seç...", "Tarih & Saat..."].map(p => (
                              <div key={p} className="bg-white/10 rounded-lg px-3 py-2 text-[10px] text-white/60">{p}</div>
                            ))}
                            <button className="w-full bg-white text-rose-600 rounded-lg py-2 text-[10px] font-semibold">
                              + Randevu Oluştur
                            </button>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-sm">
                          <p className="text-[10px] font-semibold text-stone-600 mb-2">Yaklaşan</p>
                          <div className="space-y-1.5">
                            {[
                              { time: "Yarın 09:00", name: "Selin K." },
                              { time: "Yarın 11:00", name: "Deniz Y." },
                            ].map(r => (
                              <div key={r.time} className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-rose-400 shrink-0" />
                                <div>
                                  <p className="text-[10px] font-medium text-stone-700">{r.name}</p>
                                  <p className="text-[9px] text-stone-400">{r.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf7f4] to-transparent pointer-events-none" />
      </section>

      {/* STATS BAR */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-stone-900 rounded-3xl px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2.500+", label: "Aktif Salon", icon: "💇" },
              { value: "180K+", label: "Aylık Randevu", icon: "📅" },
              { value: "4.9★", label: "Kullanıcı Puanı", icon: "⭐" },
              { value: "%98", label: "Memnuniyet", icon: "💝" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-sm text-stone-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="özellikler" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">Özellikler</span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
              Her şey tek platformda
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto text-lg">
              Salonunuzu büyütmek için ihtiyacınız olan tüm araçlar.
            </p>
          </div>

          {/* Big feature cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-rose-200 transition-colors">
                  <Globe className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Mini Web Sitesi</h3>
                <p className="text-stone-500 leading-relaxed mb-5">
                  Her salon için özel URL ve profesyonel sayfa. Hizmetlerinizi, fiyatlarınızı ve ekibinizi sergileyin. Müşteriler direkt buradan randevu alsın.
                </p>
                <div className="bg-stone-900 rounded-xl px-4 py-2 inline-flex items-center gap-2 text-sm font-mono text-stone-300">
                  <Globe className="w-3.5 h-3.5 text-rose-400" />
                  beautybook.app/<span className="text-rose-400">bella-salon</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 rounded-3xl border border-stone-800 p-8 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-900/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-rose-900/50 border border-rose-700/50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-rose-900 transition-colors">
                  <Calendar className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Akıllı Takvim</h3>
                <p className="text-stone-400 leading-relaxed mb-5">
                  Çakışma olmadan randevu yönetimi. Personel bazlı planlama, blok saatler ve otomatik onay sistemi. Takvimini kolayca yönet.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {["Pzt", "Sal", "Çar"].map((d, i) => (
                    <div key={d} className="bg-stone-800 rounded-xl p-2 text-center">
                      <p className="text-[10px] text-stone-500 mb-1">{d}</p>
                      <div className={`text-[10px] font-semibold ${i === 1 ? "text-rose-400" : "text-stone-300"}`}>{i === 1 ? "●●●●" : i === 0 ? "●●●" : "●●"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Users, title: "Müşteri Yönetimi", desc: "Geçmiş, notlar ve tercihler. Sadık müşteri profili oluşturun.", color: "bg-blue-50", icolor: "text-blue-600" },
              { icon: Bell, title: "SMS Hatırlatmaları", desc: "Otomatik hatırlatma mesajları. No-show'ları minimize edin.", color: "bg-amber-50", icolor: "text-amber-600" },
              { icon: BarChart3, title: "Gelir Raporları", desc: "Dönem, hizmet ve personel bazlı gelir analizleri.", color: "bg-emerald-50", icolor: "text-emerald-600" },
              { icon: Shield, title: "Güvenli & Hızlı", desc: "Verileriniz şifreli, güvende ve her zaman erişilebilir.", color: "bg-rose-50", icolor: "text-rose-600" },
            ].map(feat => (
              <div key={feat.title} className="bg-white rounded-2xl border border-stone-200 p-6 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md group">
                <div className={`w-11 h-11 ${feat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon className={`w-5 h-5 ${feat.icolor}`} />
                </div>
                <h3 className="font-bold text-stone-900 mb-2 text-sm">{feat.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 bg-[#1c0a0e] relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-rose-700/25 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-rose-900/40 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <span className="inline-block text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-950/80 border border-rose-800/60 px-4 py-1.5 rounded-full mb-5">
              Nasıl Çalışır?
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-5">
              3 adımda hazır
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto text-lg leading-relaxed">
              Karmaşık kurulumlara son. Sadece 5 dakikada müşterilerinizden online randevu almaya başlayın.
            </p>
          </div>

          {/* Step connector line */}
          <div className="hidden md:block absolute top-[calc(50%+20px)] left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-px bg-gradient-to-r from-transparent via-rose-800/60 to-transparent" />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Sparkles,
                title: "Kaydol",
                desc: "Ücretsiz hesap oluştur. Salon bilgilerini, logonu ve çalışma saatlerini dakikalar içinde ayarla.",
                detail: [
                  { icon: "✉", label: "E-posta ile hızlı kayıt" },
                  { icon: "🖼", label: "Logo & kapak fotoğrafı yükle" },
                  { icon: "🕐", label: "Çalışma saatlerini belirle" },
                  { icon: "📍", label: "Konum & iletişim bilgileri" },
                ],
                tag: "5 dakika",
                tagColor: "bg-emerald-900/60 text-emerald-300 border-emerald-800/60",
              },
              {
                step: "02",
                icon: Smartphone,
                title: "Özelleştir",
                desc: "Hizmetlerini, personelini ve fiyatlarını ekle. Mini web siten otomatik olarak oluşturulur.",
                detail: [
                  { icon: "✂", label: "Hizmet & fiyat listesi oluştur" },
                  { icon: "👤", label: "Personel profilleri ekle" },
                  { icon: "🎨", label: "Renk & tema seçimi yap" },
                  { icon: "📸", label: "Galeri fotoğrafları ekle" },
                ],
                tag: "10 dakika",
                tagColor: "bg-blue-900/60 text-blue-300 border-blue-800/60",
              },
              {
                step: "03",
                icon: Globe,
                title: "Yayına Al",
                desc: "Salon linkini paylaş, Instagram biyografine ekle. Müşterilerin artık 7/24 randevu alabilir.",
                detail: [
                  { icon: "🔗", label: "Özel salon linki al" },
                  { icon: "📱", label: "Instagram'a link ekle" },
                  { icon: "🔔", label: "Anlık randevu bildirimleri" },
                  { icon: "📊", label: "Raporları takip et" },
                ],
                tag: "Hemen başla",
                tagColor: "bg-rose-900/60 text-rose-300 border-rose-800/60",
              },
            ].map((step, i) => (
              <div key={step.step} className="relative group">
                {/* Step number connector dot */}
                {i < 2 && (
                  <div className="hidden md:flex absolute top-[52px] -right-3 z-20 w-6 h-6 bg-rose-800 border border-rose-700 rounded-full items-center justify-center shadow-lg shadow-black/40">
                    <ArrowRight className="w-3 h-3 text-rose-300" />
                  </div>
                )}

                <div className="bg-[#2a0f14]/80 border border-white/[0.08] rounded-3xl p-7 hover:border-rose-700/40 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/60 h-full flex flex-col">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 w-12 h-12 bg-rose-950/80 border border-rose-800/50 rounded-2xl flex items-center justify-center group-hover:bg-rose-900/60 transition-colors">
                      <step.icon className="w-5 h-5 text-rose-300" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${step.tagColor}`}>
                        {step.tag}
                      </span>
                      <span className="text-5xl font-black text-white/[0.07] leading-none">{step.step}</span>
                    </div>
                  </div>

                  {/* Title & desc */}
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed mb-6">{step.desc}</p>

                  {/* Detail list */}
                  <div className="mt-auto space-y-2.5 border-t border-white/[0.06] pt-5">
                    {step.detail.map(d => (
                      <div key={d.label} className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-white/[0.05] rounded-lg flex items-center justify-center text-sm shrink-0">{d.icon}</span>
                        <span className="text-sm text-stone-300 font-medium">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-rose-950/60 text-sm group">
              Hemen Kurulum Yap — Ücretsiz
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-stone-600 text-xs mt-3">Kredi kartı gerekmez · 14 gün ücretsiz</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="müşteriler" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">Müşteriler</span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
              Onlar anlatıyor
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Selin Yıldız",
                salon: "Selin Beauty, İstanbul",
                text: "BeautyBook'tan önce randevularımı telefonla alıyordum. Şimdi müşterilerimin %60'ı kendi kendine randevu alıyor. İnanılmaz bir fark!",
                rating: 5,
                avatar: "SY",
                color: "bg-rose-400"
              },
              {
                name: "Merve Kaya",
                salon: "Merve Salon, Ankara",
                text: "Gelir raporları sayesinde hangi hizmetlerin daha karlı olduğunu gördüm ve fiyatlamayı yeniden düzenledim. İlk ayda %30 gelir artışı.",
                rating: 5,
                avatar: "MK",
                color: "bg-purple-400",
                featured: true
              },
              {
                name: "Ayşe Demir",
                salon: "La Belle, İzmir",
                text: "SMS hatırlatmaları sayesinde no-show oranım sıfıra indi neredeyse. Her ay ortalama 8-10 randevu kurtarıyor bu özellik.",
                rating: 5,
                avatar: "AD",
                color: "bg-amber-400"
              },
            ].map(t => (
              <div key={t.name} className={`rounded-3xl p-8 border transition-all hover:-translate-y-1 ${t.featured ? "bg-stone-900 border-stone-800 shadow-xl" : "bg-stone-50 border-stone-200 hover:shadow-md"}`}>
                <div className="flex items-center gap-1 mb-5">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 fill-amber-400 text-amber-400`} />)}
                </div>
                <p className={`text-sm leading-relaxed mb-6 ${t.featured ? "text-stone-300" : "text-stone-600"}`}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>{t.avatar}</div>
                  <div>
                    <p className={`text-sm font-bold ${t.featured ? "text-white" : "text-stone-900"}`}>{t.name}</p>
                    <p className={`text-xs ${t.featured ? "text-stone-400" : "text-stone-400"}`}>{t.salon}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="fiyatlar" className="py-24 px-6 bg-[#faf7f4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">Fiyatlandırma</span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
              Salonunuza uygun plan
            </h2>
            <p className="text-stone-500 text-lg">14 gün ücretsiz dene. Kredi kartı gerekmez.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {[
              {
                name: "Başlangıç",
                price: "299",
                desc: "Yeni açılan salonlar için ideal başlangıç noktası.",
                features: ["1 Personel hesabı", "Sınırsız randevu", "Mini web sitesi", "Email bildirimleri", "Temel raporlar", "Email destek"],
                cta: "Ücretsiz Başla",
                popular: false,
              },
              {
                name: "Profesyonel",
                price: "599",
                desc: "Büyüyen salonlar için güçlü araçlar.",
                features: ["5 Personel hesabı", "Sınırsız randevu", "Mini web sitesi", "SMS bildirimleri", "Gelişmiş raporlar", "Öncelikli destek", "Müşteri notları"],
                cta: "En Popüler Plan",
                popular: true,
              },
              {
                name: "Kurumsal",
                price: "999",
                desc: "Zincir salonlar ve büyük işletmeler için.",
                features: ["Sınırsız personel", "Sınırsız randevu", "Özel domain", "API erişimi", "Tüm raporlar + dışa aktarım", "Özel entegrasyon", "7/24 telefon desteği"],
                cta: "İletişime Geç",
                popular: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`relative rounded-3xl p-8 transition-all ${
                plan.popular
                  ? "bg-stone-900 border-stone-800 border shadow-2xl shadow-stone-300/40 md:-mt-4 md:-mb-4"
                  : "bg-white border border-stone-200 hover:shadow-md"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-rose-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg shadow-rose-200">
                      ⭐ En Popüler
                    </span>
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${plan.popular ? "text-white" : "text-stone-900"}`}>{plan.name}</h3>
                <p className={`text-xs mb-5 ${plan.popular ? "text-stone-400" : "text-stone-400"}`}>{plan.desc}</p>
                <div className="mb-6">
                  <span className={`text-5xl font-black ${plan.popular ? "text-white" : "text-stone-900"}`}>₺{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.popular ? "text-stone-400" : "text-stone-400"}`}>/ay</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.popular ? "text-stone-300" : "text-stone-600"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-rose-600" : "bg-rose-100"}`}>
                        <Check className={`w-3 h-3 ${plan.popular ? "text-white" : "text-rose-600"}`} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  {plan.cta}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ mini */}
          <div className="mt-16 grid md:grid-cols-2 gap-4">
            {[
              { q: "Kredi kartı gerekiyor mu?", a: "Hayır. 14 günlük deneme için herhangi bir kart bilgisi gerekmez." },
              { q: "Deneme süresinde her şeye erişebilir miyim?", a: "Evet! Profesyonel planın tüm özelliklerine 14 gün boyunca erişebilirsiniz." },
              { q: "İstediğim zaman iptal edebilir miyim?", a: "Evet, istediğiniz zaman herhangi bir ceza olmadan iptal edebilirsiniz." },
              { q: "Veri taşıma desteği var mı?", a: "Mevcut müşteri listenizi CSV formatında kolayca içe aktarabilirsiniz." },
            ].map(faq => (
              <div key={faq.q} className="bg-white rounded-2xl border border-stone-200 p-5">
                <p className="font-semibold text-stone-900 text-sm mb-1.5">{faq.q}</p>
                <p className="text-stone-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[32px] overflow-hidden bg-stone-900 p-14 text-center shadow-2xl">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-800/30 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-900/50">
                <Scissors className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Salonunuzu bugün<br />dijitalleştirin
              </h2>
              <p className="text-stone-400 mb-10 max-w-lg mx-auto text-lg">
                14 gün ücretsiz deneyin. Kredi kartı gerekmez. 5 dakikada kurulum.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register" className="group flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-rose-900/40 text-base">
                  Ücretsiz Başla
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Kredi kartı yok</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> İstediğinde iptal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-6 border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-stone-900">BeautyBook</span>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                Türkiye'nin güzellik salonları için geliştirilen akıllı randevu ve yönetim platformu.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              {[
                { title: "Ürün", links: ["Özellikler", "Fiyatlar", "Demo", "Güvenlik"] },
                { title: "Şirket", links: ["Hakkında", "Blog", "İletişim", "Kariyer"] },
                { title: "Destek", links: ["Yardım Merkezi", "Kullanım Kılavuzu", "API Docs", "Durum"] },
              ].map(col => (
                <div key={col.title}>
                  <p className="font-semibold text-stone-900 mb-3">{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map(l => {
                      const href =
                        l === "Özellikler" ? "#özellikler" :
                        l === "Fiyatlar" ? "#fiyatlar" :
                        l === "Demo" ? "#demo" :
                        l === "Hakkında" ? "#hakkinda" :
                        l === "Blog" ? "/blog" :
                        l === "İletişim" ? "/iletisim" :
                        l === "Kariyer" ? "/kariyer" :
                        l === "Yardım Merkezi" ? "/yardim" :
                        l === "Kullanım Kılavuzu" ? "/kilavuz" :
                        l === "API Docs" ? "/api-docs" :
                        l === "Durum" ? "https://status.beautybook.app" :
                        "#";

                      const isExternal = href.startsWith("http");

                      return (
                        <li key={l}>
                          <a
                            href={href}
                            {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                            className="text-stone-400 hover:text-rose-600 transition-colors"
                          >
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
            <div className="border-t border-stone-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-stone-400">© 2026 BeautyBook. Tüm hakları saklıdır.</p>
              <div className="flex items-center gap-6">
                <Link
                  href="/gizlilik"
                  className="text-sm text-stone-400 hover:text-rose-600 transition-colors"
                >
                  Gizlilik Politikası
                </Link>
                <Link
                  href="/kullanim-sartlari"
                  className="text-sm text-stone-400 hover:text-rose-600 transition-colors"
                >
                  Kullanım Şartları
                </Link>
                <Link
                  href="/iade-politikasi"
                  className="text-sm text-stone-400 hover:text-rose-600 transition-colors"
                >
                  İptal &amp; İade
                </Link>
                <Link
                  href="/staff-portal/login"
                  className="text-sm text-stone-400 hover:text-rose-600 transition-colors font-medium"
                >
                  Personel Girişi
                </Link>
              </div>
            </div>
        </div>
      </footer>
    </div>
  );
}