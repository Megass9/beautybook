import Link from "next/link";
import { Scissors, Sparkles, Heart } from "lucide-react";

export default function HakkimizdaPage() {
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

      <section className="pt-40 px-6 max-w-4xl mx-auto relative">
        <div className="absolute top-20 left-0 w-96 h-96 bg-rose-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 text-center mb-16">
          <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-5 py-2 rounded-full mb-6">
            Hikayemiz
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter mb-8 leading-tight">
            Güzellik dünyasını {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700">yeniden</span> yazıyoruz.
          </h1>
          <p className="text-xl text-stone-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Güzellik salonları defterler arasına sıkışmamalı dedik ve Türkiye'nin en modern yazılımını inşa ettik.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-stone-200/60 shadow-[0_20px_80px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl" />
          <div className="relative z-10 text-stone-600 leading-relaxed space-y-8 font-medium text-lg">
            <p>
              Yolculuğumuz, küçük bir kuaför salonunun yaşadığırandevu karmaşasını çözme isteğiyle başladı. Müşteri bekliyor, telefonlar susmuyor, ama randevu defteri nerede belli değildi. O gün anladık ki; sanata ve güzelliğe odaklanması gereken uzmanlar, organizasyon yükü altında eziliyordu.
            </p>
            <div className="flex justify-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl flex items-center justify-center border border-rose-200">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
            </div>
            <p>
              BeautyBook, işte bu yükü sırtlanmak için doğdu. Biz bir takvim uygulamasından fazlasıyız; biz sizin dijital asistanınız, finansal rehberiniz ve büyüme ortağınızız. Kullanımı o kadar kolay bir arayüz tasarladık ki, beş dakikada salonunuzu dijitale taşıyabilir, ilk online randevunuzu kahveniz bitmeden alabilirsiniz.
            </p>
            <p>
              Bugün binlerce salon, BeautyBook güvencesiyle sadece işine; <strong className="text-stone-900 font-black">güzellik yaratmaya</strong> odaklanıyor. Bizim en büyük gururumuz bu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
