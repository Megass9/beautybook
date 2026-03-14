import Link from 'next/link'
import { ArrowRight, Scissors } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-24 bg-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/30">
          <Scissors className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
          Salonunuzu Dijitale Taşıyın
        </h2>
        <p className="text-stone-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          14 gün boyunca tüm özellikleri ücretsiz kullanın. Kredi kartı bilgisi gerekmez.
          İstediğiniz an iptal edebilirsiniz.
        </p>
        <Link
          href="/auth/register"
          className="group inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-semibold px-8 py-4 rounded-2xl text-base shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-1"
        >
          Hemen Ücretsiz Başla
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
