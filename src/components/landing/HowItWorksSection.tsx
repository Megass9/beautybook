import { UserPlus, Settings, Share2, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Hesap Oluşturun',
    desc: 'E-posta adresinizle 2 dakikada kayıt olun. Kredi kartı bilgisi gerekmez.',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Salonunuzu Kurun',
    desc: 'Salon bilgilerini, çalışma saatlerini, hizmetleri ve personelinizi ekleyin.',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Linkinizi Paylaşın',
    desc: 'Size özel rezervasyon sayfanızı sosyal medyada ve müşterilerinizle paylaşın.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'İşinizi Büyütün',
    desc: 'Online randevularla doluluk oranınızı artırın, gelirlerinizi takip edin.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rose-500 text-sm font-semibold tracking-wider uppercase mb-3 block">Nasıl Çalışır</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
            4 Adımda Başlayın
          </h2>
          <p className="max-w-xl mx-auto text-stone-500 text-lg">
            Kurulum süreci son derece basit. Dakikalar içinde salonunuz yayında olur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative text-center">
                {/* Number + Icon */}
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-rose-100 flex items-center justify-center relative z-10">
                    <Icon className="w-7 h-7 text-rose-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center z-20">
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-semibold text-stone-900 text-base mb-2">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
