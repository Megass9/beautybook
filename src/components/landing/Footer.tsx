import Link from 'next/link'
import { Scissors } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Beauty<span className="text-rose-400">Book</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Güzellik salonları için modern randevu ve yönetim platformu.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-white font-medium mb-3">Ürün</div>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Özellikler</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Fiyatlar</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Nasıl Çalışır</a></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-medium mb-3">Şirket</div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-medium mb-3">Yasal</div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Gizlilik</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">KVKK</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 text-xs text-center">
          © {new Date().getFullYear()} BeautyBook. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
