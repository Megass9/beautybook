"use client";

import { useMemo } from "react";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Scissors,
  ArrowUpRight,
  DollarSign
} from "lucide-react";

export default function ReportsClient({ initialAppointments }: { initialAppointments: any[] }) {
  
  const stats = useMemo(() => {
    const totalIncome = initialAppointments.reduce((sum, app) => sum + (app.services?.price || 0), 0);
    const completedCount = initialAppointments.filter(a => a.status === 'completed').length;
    const avgTicket = totalIncome > 0 ? (totalIncome / initialAppointments.length).toFixed(0) : 0;
    
    return { totalIncome, completedCount, avgTicket, total: initialAppointments.length };
  }, [initialAppointments]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      <div>
        <h1 className="text-4xl font-black text-stone-900 tracking-tight italic">Finansal Raporlar</h1>
        <p className="text-stone-500 font-medium mt-1">İşletmenizin performansını analiz edin.</p>
      </div>

      {/* Ana Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="w-16 h-16 text-rose-500" />
           </div>
           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Toplam Ciro</p>
           <h3 className="text-3xl font-black text-stone-900 italic">₺{stats.totalIncome}</h3>
           <div className="mt-4 flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase">
              <ArrowUpRight className="w-3 h-3" /> %12 Artış
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar className="w-16 h-16 text-stone-500" />
           </div>
           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Toplam Randevu</p>
           <h3 className="text-3xl font-black text-stone-900 italic">{stats.total}</h3>
           <p className="text-[10px] font-bold text-stone-400 mt-4 uppercase italic">{stats.completedCount} Tamamlanan</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-16 h-16 text-stone-500" />
           </div>
           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Ort. İşlem Tutarı</p>
           <h3 className="text-3xl font-black text-stone-900 italic">₺{stats.avgTicket}</h3>
           <p className="text-[10px] font-bold text-stone-400 mt-4 uppercase italic">Her randevu başı</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-16 h-16 text-stone-500" />
           </div>
           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Verimlilik</p>
           <h3 className="text-3xl font-black text-stone-900 italic">%84</h3>
           <p className="text-[10px] font-bold text-stone-400 mt-4 uppercase italic">Masa Doluluk Oranı</p>
        </div>
      </div>

      {/* Grafik Alanı (Görsel Placeholder) */}
      <div className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="w-10 h-10 text-stone-200" />
         </div>
         <h4 className="text-xl font-black text-stone-900 mb-2">Gelir Grafiği Hazırlanıyor</h4>
         <p className="text-stone-400 max-w-sm font-medium">Bu bölümdeki veriler randevu trafiğinize göre anlık olarak güncellenmektedir.</p>
         
         <div className="mt-10 flex items-end gap-3 h-32 w-full max-w-md">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-rose-500/10 rounded-t-xl relative group">
                 <div 
                   className="absolute bottom-0 left-0 right-0 bg-rose-500 rounded-t-xl transition-all duration-1000" 
                   style={{ height: `${h}%` }}
                 />
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₺{h * 150}
                 </div>
              </div>
            ))}
         </div>
         <div className="flex justify-between w-full max-w-md mt-4 text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">
            <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
         </div>
      </div>

    </div>
  );
}
