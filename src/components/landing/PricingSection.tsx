import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Başlangıç',
    price: '0',
    period: '/ay',
    desc: '14 gün, tüm özellikler ücretsiz',
    highlight: false,
    cta: 'Ücretsiz Başla',
    features: [
      '1 personel hesabı',
      'Online randevu sayfası',
      'Temel randevu yönetimi',
      'Hizmet & fiyat listesi',
      'E-posta bildirimleri',
    ],
  },
  {
    name: 'Profesyonel',
    price: '399',
    period: '/ay',
    desc: 'Büyüyen salonlar için ideal',
    highlight: true,
    cta: '14 Gün Ücretsiz Dene',
    badge: 'En Popüler',
    features: [
      'Sınırsız personel',
      'Özelleştirilebilir mini site',
      'Gelişmiş takvim görünümü',
      'Müşteri geçmişi & notlar',
      'SMS hatırlatıcılar',
      'Gelir & analiz raporları',
      'Öncelikli destek',
    ],
  },
  {
    name: 'Kurumsal',
    price: '899',
    period: '/ay',
    desc: 'Zincir salonlar için',
    highlight: false,
    cta: 'Satış Ekibiyle İletişim',
    features: [
      'Sınırsız şube',
      'Merkezi yönetim paneli',
      'Beyaz etiket (White-label)',
      'API erişimi',
      'Özel entegrasyonlar',
      'Özel müşteri başarı yöneticisi',
      '7/24 öncelikli destek',
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rose-500 text-sm font-semibold tracking-wider uppercase mb-3 block">Fiyatlandırma</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
            Şeffaf Fiyatlar
          </h2>
          <p className="max-w-xl mx-auto text-stone-500 text-lg">
            Gizli ücret yok. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border transition-all ${
                plan.highlight
                  ? 'bg-stone-900 border-stone-800 shadow-2xl shadow-stone-900/20 scale-105'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  <Zap className="w-3 h-3" />
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-semibold text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-stone-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlight ? 'text-stone-400' : 'text-stone-500'}`}>{plan.desc}</p>
              </div>

              <div className="mb-8">
                <span className={`font-display text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-stone-900'}`}>
                  ₺{plan.price}
                </span>
                <span className={`text-sm ${plan.highlight ? 'text-stone-400' : 'text-stone-500'}`}>{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlight ? 'bg-rose-500' : 'bg-rose-100'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-rose-600'}`} />
                    </div>
                    <span className={`text-sm ${plan.highlight ? 'text-stone-300' : 'text-stone-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`block text-center text-sm font-semibold py-3 px-6 rounded-xl transition-all ${
                  plan.highlight
                    ? 'bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/25'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
