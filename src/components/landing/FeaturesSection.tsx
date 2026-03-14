import { Calendar, Users, Scissors, Globe, BarChart3, Shield, Bell, Clock } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Akıllı Randevu Takvimi',
    desc: 'Günlük, haftalık ve aylık takvim görünümü. Çakışma kontrolü ile hata riski sıfır.',
    color: 'rose',
  },
  {
    icon: Globe,
    title: 'Mini Web Sitesi',
    desc: 'Her salona özel otomatik oluşturulan rezervasyon sayfası. Müşteriler 7/24 randevu alabilir.',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Personel & Müşteri Takibi',
    desc: 'Personel bazlı randevu yönetimi. Müşteri geçmişi ve notları tek yerde.',
    color: 'emerald',
  },
  {
    icon: Scissors,
    title: 'Hizmet Yönetimi',
    desc: 'Hizmet, fiyat ve süre tanımlayın. Personele göre farklı hizmetler atayın.',
    color: 'amber',
  },
  {
    icon: Bell,
    title: 'Otomatik Hatırlatıcılar',
    desc: 'Müşterilere SMS ve e-posta ile randevu hatırlatmaları gönderin.',
    color: 'purple',
  },
  {
    icon: BarChart3,
    title: 'Gelir Raporları',
    desc: 'Günlük, haftalık, aylık gelir analizleri. En çok tercih edilen hizmetleri görün.',
    color: 'pink',
  },
  {
    icon: Clock,
    title: 'Çalışma Saati Kontrolü',
    desc: 'Salon ve personel bazlı çalışma saatleri tanımlayın. Tatil günleri kapatın.',
    color: 'indigo',
  },
  {
    icon: Shield,
    title: 'Güvenli & Güvenilir',
    desc: 'Supabase RLS ile verileriniz yalnızca size ait. KVKK uyumlu altyapı.',
    color: 'teal',
  },
]

const colorMap: Record<string, string> = {
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  pink: 'bg-pink-50 text-pink-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  teal: 'bg-teal-50 text-teal-600',
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-rose-500 text-sm font-semibold tracking-wider uppercase mb-3 block">Özellikler</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
            Her Şey Tek Platformda
          </h2>
          <p className="max-w-2xl mx-auto text-stone-500 text-lg leading-relaxed">
            Salonunuzu yönetmek için ihtiyacınız olan tüm araçlar, tek ve kullanımı kolay bir panelde.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-stone-100 hover:border-rose-100 hover:shadow-lg hover:shadow-rose-50 transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorMap[feature.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2 text-sm leading-snug">{feature.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
