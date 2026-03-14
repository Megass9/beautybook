import Link from 'next/link'
import { ArrowRight, Star, CheckCircle2, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-rose-50/30 to-stone-100">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-50/20 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#e11d48 1px, transparent 1px), linear-gradient(90deg, #e11d48 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-full px-4 py-2 mb-8 shadow-sm animate-fade-up">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-stone-700">Türkiye&apos;nin #1 Salon Yazılımı</span>
            <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.9
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-6 animate-fade-up delay-100">
            Salonunuzu Dijitale<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
              Taşıyın
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-stone-600 leading-relaxed mb-10 animate-fade-up delay-200">
            Güzellik salonunuz için randevu yönetimi, müşteri takibi ve mini web sitesi — hepsi tek platformda. 
            Dakikalar içinde kurulum, kullanımı kolay.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up delay-300">
            <Link
              href="/auth/register"
              className="group flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-4 rounded-2xl text-base shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all hover:-translate-y-1"
            >
              14 Gün Ücretsiz Dene
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-stone-700 hover:text-stone-900 font-medium px-6 py-4 rounded-2xl hover:bg-white/60 transition-all text-base border border-stone-200 hover:border-stone-300"
            >
              Nasıl Çalışır?
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500 animate-fade-up delay-400">
            {['Kredi kartı gerekmez', 'Kurulum desteği', 'İptal her zaman mümkün'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Mock Dashboard Preview */}
          <div className="mt-16 relative mx-auto max-w-5xl animate-fade-up delay-500">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 border border-stone-200/80 bg-white">
              {/* Browser chrome */}
              <div className="bg-stone-100 px-4 py-3 flex items-center gap-2 border-b border-stone-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-stone-400 text-center max-w-xs mx-auto border border-stone-200">
                  beautybook.com/dashboard
                </div>
              </div>

              {/* Dashboard mock */}
              <div className="bg-stone-50 p-6">
                <div className="flex gap-4">
                  {/* Sidebar */}
                  <div className="hidden sm:flex flex-col gap-1 w-44 shrink-0">
                    {['Dashboard', 'Randevular', 'Hizmetler', 'Personel', 'Müşteriler'].map((item, i) => (
                      <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${i === 0 ? 'bg-rose-100 text-rose-700' : 'text-stone-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-rose-500' : 'bg-stone-300'}`} />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Bugün', value: '12 randevu', color: 'rose' },
                        { label: 'Bu Hafta', value: '₺4,280', color: 'emerald' },
                        { label: 'Müşteri', value: '148 kişi', color: 'blue' },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-3 shadow-sm border border-stone-100">
                          <div className="text-xs text-stone-400 mb-1">{stat.label}</div>
                          <div className="text-sm font-bold text-stone-800">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Appointment list mock */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
                      <div className="text-xs font-semibold text-stone-700 mb-3">Bugünkü Randevular</div>
                      {[
                        { name: 'Ayşe K.', service: 'Saç Boyama', time: '10:00', status: 'confirmed' },
                        { name: 'Fatma A.', service: 'Manikür', time: '11:30', status: 'confirmed' },
                        { name: 'Zeynep M.', service: 'Kaş Şekillendirme', time: '13:00', status: 'pending' },
                      ].map((apt) => (
                        <div key={apt.name} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 text-xs flex items-center justify-center text-rose-700 font-bold">
                              {apt.name[0]}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-stone-800">{apt.name}</div>
                              <div className="text-xs text-stone-400">{apt.service}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500">{apt.time}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {apt.status === 'confirmed' ? 'Onaylı' : 'Bekliyor'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -left-4 top-1/3 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 animate-float hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-800">Yeni Randevu!</div>
                  <div className="text-xs text-stone-500">Selin B. – Manikür</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/2 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
              <div className="text-xs font-semibold text-stone-800 mb-1">Bu Ay</div>
              <div className="text-2xl font-bold text-rose-500">+28%</div>
              <div className="text-xs text-stone-500">büyüme</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
