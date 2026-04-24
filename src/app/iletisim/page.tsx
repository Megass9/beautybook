import Link from "next/link";
import { Scissors, Mail, Phone, MapPin } from "lucide-react";

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden font-sans pb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 py-5 bg-white/70 backdrop-blur-2xl border-b border-stone-200/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-[0_8px_20px_rgba(225,29,72,0.25)] border border-rose-400/30 group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-stone-900 group-hover:text-rose-600 transition-colors hidden sm:block">BeautyBook.</span>
        </Link>
        <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-widest bg-white border border-stone-200 px-5 py-2 rounded-full shadow-sm">
          Ana Sayfaya Dön
        </Link>
      </nav>

      <section className="pt-40 px-6 max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter mb-8 leading-tight">
            Size nasıl <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700">yardımcı olabiliriz?</span>
          </h1>
          <p className="text-xl text-stone-500 font-medium max-w-2xl mx-auto">
            7/24 destek ekibimiz ve satış uzmanlarımız, işletmenizi bir adım öteye taşımak için sizi dinlemeye hazır.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-stone-200/60 shadow-[0_20px_80px_rgba(0,0,0,0.04)] relative overflow-hidden group">
            <div className="w-16 h-16 bg-gradient-to-br from-stone-50 to-stone-100 rounded-[1.5rem] flex items-center justify-center mb-8 border border-stone-200 group-hover:bg-rose-50 group-hover:border-rose-200 transition-colors">
              <Mail className="w-7 h-7 text-stone-600 group-hover:text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">Bize Yazın</h3>
            <p className="text-stone-500 font-medium mb-6">Her türlü sorunuzda e-posta yoluyla bize anında ulaşın.</p>
            <a href="mailto:merhaba@beautybook.app" className="text-2xl font-black text-rose-500 hover:text-rose-600 transition-colors">merhaba@beautybook.app</a>
          </div>

          <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-stone-200/60 shadow-[0_20px_80px_rgba(0,0,0,0.04)] relative overflow-hidden group">
            <div className="w-16 h-16 bg-gradient-to-br from-stone-50 to-stone-100 rounded-[1.5rem] flex items-center justify-center mb-8 border border-stone-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
              <Phone className="w-7 h-7 text-stone-600 group-hover:text-blue-500" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">Bizi Arayın</h3>
            <p className="text-stone-500 font-medium mb-6">Kurumsal plan ve acil destek hattı.</p>
            <a href="tel:+905320000000" className="text-2xl font-black text-blue-500 hover:text-blue-600 transition-colors">+90 (850) 123 45 67</a>
          </div>

          <div className="md:col-span-2 bg-[#0c0a09] rounded-[3rem] p-10 md:p-14 border border-stone-800 shadow-[0_30px_100px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex-1">
              <div className="w-16 h-16 bg-stone-800/80 rounded-[1.5rem] border border-stone-700 flex items-center justify-center mb-8">
                <MapPin className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Merkez Ofisimiz</h3>
              <p className="text-stone-400 font-medium leading-relaxed max-w-sm">
                Barbaros Bulvarı No: 124, 34349 <br/>
                Beşiktaş, İstanbul, Türkiye
              </p>
            </div>
            <div className="w-full md:w-1/2 aspect-video bg-stone-800/50 border border-stone-700/50 rounded-2xl flex items-center justify-center">
              <span className="text-sm font-black text-stone-600 uppercase tracking-widest">Harita Görünümü</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
