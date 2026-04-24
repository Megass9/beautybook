import Link from "next/link";
import { Scissors, Briefcase, ArrowRight } from "lucide-react";

export default function KariyerPage() {
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
          <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-5 py-2 rounded-full mb-6">
            Ekibe Katıl
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter mb-8 leading-tight">
            Geleceği <br/><span className="text-rose-500">Birlikte</span> İnşa Edelim.
          </h1>
          <p className="text-xl text-stone-500 font-medium max-w-2xl mx-auto">
            Hızla büyüyen, güzellik sektörünü teknolojiyle dönüştüren ekibimize katılmak ister misin?
          </p>
        </div>

        <div className="bg-[#0c0a09] rounded-[3rem] p-10 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-stone-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />
           <h2 className="text-3xl font-black text-white mb-10 tracking-tight">Açık Pozisyonlar</h2>
           
           <div className="space-y-4">
             {[
               { title: "Senior Frontend Developer (React/Next.js)", dep: "Mühendislik", loc: "Remote / İstanbul" },
               { title: "Product Designer (UI/UX)", dep: "Tasarım", loc: "Remote / İzmir" },
               { title: "Customer Success Specialist", dep: "Operasyon", loc: "İstanbul Ofis" }
             ].map((job, idx) => (
               <div key={idx} className="bg-stone-900/50 border border-stone-700/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-stone-800/80 hover:border-rose-500/30 transition-all group">
                 <div>
                   <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">{job.dep}</span>
                     <span className="text-xs text-stone-400 font-medium">{job.loc}</span>
                   </div>
                 </div>
                 <button className="bg-white text-stone-900 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                   Başvur
                   <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
             ))}
           </div>
           
           <div className="mt-12 text-center border-t border-stone-800 pt-10">
             <p className="text-stone-400 text-sm font-medium">
               Aradığın pozisyonu bulamadın mı? Yine de tanışmak isteriz.<br/>
               Özgeçmişini <a href="mailto:kariyer@beautybook.app" className="text-rose-400 font-bold hover:underline">kariyer@beautybook.app</a> adresine gönder.
             </p>
           </div>
        </div>
      </section>
    </div>
  );
}
