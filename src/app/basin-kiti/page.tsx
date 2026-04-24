import Link from "next/link";
import { Scissors, DownloadCloud, Image as ImageIcon } from "lucide-react";

export default function BasinKitiPage() {
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
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter mb-6 leading-tight">
            Basın Bültenleri ve <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700">Marka Kiti.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mx-auto">
            Haber yapmak, içerik oluşturmak veya medya metaryallerimize erişmek için gereken her şey burada.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-stone-200/60 shadow-[0_20px_80px_rgba(0,0,0,0.04)] relative overflow-hidden mb-8">
          <h2 className="text-2xl font-black text-stone-900 mb-8">Logo ve Renk Paletleri</h2>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 flex flex-col items-center justify-center group">
               <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg border border-rose-400/30 mb-6">
                 <Scissors className="w-10 h-10 text-white" />
               </div>
               <span className="font-black text-2xl tracking-tighter text-stone-900 mb-6">BeautyBook.</span>
               <button className="flex items-center gap-2 bg-stone-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors w-full justify-center">
                 <DownloadCloud className="w-4 h-4" /> Vektörel (SVG)
               </button>
             </div>
             
             <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 flex flex-col items-center justify-center group relative overflow-hidden">
               <div className="absolute inset-0 bg-stone-800 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
               <div className="relative z-10 w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                 <Scissors className="w-10 h-10 text-stone-900" />
               </div>
               <span className="relative z-10 font-black text-2xl tracking-tighter text-white mb-6">BeautyBook.</span>
               <button className="relative z-10 flex items-center gap-2 bg-white text-stone-900 font-bold px-6 py-3 rounded-xl hover:bg-stone-100 transition-colors w-full justify-center">
                 <DownloadCloud className="w-4 h-4" /> Ekran Çözünürlüğü (PNG)
               </button>
             </div>
          </div>
        </div>

        <div className="bg-[#0c0a09] rounded-[3rem] p-10 md:p-14 border border-stone-800 shadow-[0_30px_100px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="flex-1 relative z-10">
             <h2 className="text-3xl font-black text-white mb-4">Medya Görselleri</h2>
             <p className="text-stone-400 font-medium leading-relaxed max-w-sm">
               Ürün içi ekran görüntüleri, ofis ekibi fotoğrafları ve CEO demeç bültenlerine buradan erişebilirsiniz.
             </p>
          </div>
          <button className="relative z-10 w-full md:w-auto bg-rose-600 hover:bg-rose-500 text-white font-bold px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(225,29,72,0.3)] hover:-translate-y-1 transition-all">
            <ImageIcon className="w-5 h-5" />
            Tüm Fotoğrafları İndir (ZIP)
          </button>
        </div>

      </section>
    </div>
  );
}
