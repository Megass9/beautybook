import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Aslı Yıldırım',
    business: 'Aslı Beauty Salon, İstanbul',
    avatar: 'A',
    rating: 5,
    quote: 'BeautyBook sayesinde artık telefonda saatlerce randevu almıyorum. Müşterilerim kendi randevularını alıyor, ben işime odaklanıyorum.',
  },
  {
    name: 'Merve Kaya',
    business: 'Studio Merve, Ankara',
    avatar: 'M',
    rating: 5,
    quote: 'Kurulumu inanılmaz kolaydı. 30 dakikada salonumu sisteme ekledim ve hemen randevu almaya başladım. Keşke daha önce kullansaydım.',
  },
  {
    name: 'Zeynep Arslan',
    business: 'Zeynep Hair & Beauty, İzmir',
    avatar: 'Z',
    rating: 5,
    quote: 'Online randevu sayfam çok profesyonel görünüyor. Müşterilerim "woww ne güzel site" diyor. Artık bir web tasarımcıya para ödemiyorum.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rose-500 text-sm font-semibold tracking-wider uppercase mb-3 block">Yorumlar</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
            Salonlar Ne Diyor?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-stone-700 leading-relaxed mb-6 text-sm">"{t.quote}"</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-stone-900 text-sm">{t.name}</div>
                  <div className="text-stone-400 text-xs">{t.business}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Aktif Salon' },
            { value: '50K+', label: 'Aylık Randevu' },
            { value: '4.9/5', label: 'Ortalama Puan' },
            { value: '%98', label: 'Memnuniyet' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-4xl font-bold text-rose-500 mb-1">{stat.value}</div>
              <div className="text-stone-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
