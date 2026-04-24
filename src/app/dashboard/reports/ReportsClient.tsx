"use client";

import { useMemo } from "react";
import { format, isThisMonth, isThisWeek, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp, DollarSign, Calendar, Target, CheckCircle2, TrendingDown, Clock } from "lucide-react";

interface Props {
  appointments: any[];
}

export default function ReportsClient({ appointments }: Props) {
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let weeklyRevenue = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    appointments.forEach((apt) => {
      // Sadece tamamlanmış (completed) olanların gelirine bakalım
      // Not: Durumları pending, confirmed, completed, cancelled vb. olabilir.
      const price = parseFloat(apt.services?.price || "0");
      const date = parseISO(apt.appointment_date);

      if (apt.status === "completed") {
        totalRevenue += price;
        completedCount++;
        
        if (isThisMonth(date)) monthlyRevenue += price;
        if (isThisWeek(date)) weeklyRevenue += price;
      } else if (apt.status === "cancelled") {
        cancelledCount++;
      } else {
        pendingCount++;
      }
    });

    return { totalRevenue, monthlyRevenue, weeklyRevenue, completedCount, cancelledCount, pendingCount };
  }, [appointments]);

  // En çok tercih edilen hizmetleri bulalım
  const topServices = useMemo(() => {
    const counts: Record<string, { name: string; count: number; rev: number }> = {};
    appointments.forEach(a => {
      if (a.status !== "completed" || !a.services) return;
      const name = a.services.name;
      const price = parseFloat(a.services.price);
      if (!counts[name]) counts[name] = { name, count: 0, rev: 0 };
      counts[name].count++;
      counts[name].rev += price;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [appointments]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-up pb-10">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Finans ve Raporlar</h1>
          <p className="text-sm text-stone-500 mt-1">
            Salonunuzun gelirlerini, performansını ve popüler hizmetlerini inceleyin.
          </p>
        </div>
      </div>

      {/* ── REVENUE CARDS ── */}
      <div className="grid md:grid-cols-3 gap-6 animate-fade-up delay-100">
        
        {/* Weekly */}
        <div className="bg-white rounded-[2rem] border border-stone-200/60 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group">
          <div className="w-12 h-12 bg-emerald-50 border border-white rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-stone-900 mb-1 group-hover:text-emerald-600 transition-colors">₺{stats.weeklyRevenue.toLocaleString("tr-TR")}</p>
          <p className="text-sm font-semibold text-stone-500">Bu Haftaki Ciro</p>
          <p className="text-xs text-stone-400 mt-2 pt-2 border-t border-stone-100/80">
            Sadece tamamlanmış randevular.
          </p>
        </div>

        {/* Monthly */}
        <div className="bg-gradient-to-br from-stone-900 to-black rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-bl-full blur-[30px]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-tr-full blur-[30px]" />
          
          <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner relative z-10">
            <TrendingUp className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-4xl font-black text-white mb-1 tracking-tight relative z-10">₺{stats.monthlyRevenue.toLocaleString("tr-TR")}</p>
          <p className="text-sm font-semibold text-stone-400 relative z-10">Bu Ayki Ciro</p>
          <p className="text-xs text-stone-500 mt-2 pt-2 border-t border-stone-800 relative z-10">
            Aylık net tamamlanmış gelir
          </p>
        </div>

        {/* Total (All time) */}
        <div className="bg-white rounded-[2rem] border border-stone-200/60 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group">
          <div className="w-12 h-12 bg-rose-50 border border-white rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Target className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-stone-900 mb-1 group-hover:scale-[1.02] transform origin-left transition-transform">₺{stats.totalRevenue.toLocaleString("tr-TR")}</p>
          <p className="text-sm font-semibold text-stone-500">Toplam Kazanılan (Tüm Zamanlar)</p>
          <p className="text-xs text-stone-400 mt-2 pt-2 border-t border-stone-100/80">
            Sistemdeki tüm kayıtlı gelir
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8 animate-fade-up delay-200">
        
        {/* ── APPOINTMENT STATS ── */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100/50">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-extrabold text-stone-900">Randevu Durumları</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-stone-700">Tamamlanan</span>
                </div>
                <span className="text-xl font-black text-emerald-700">{stats.completedCount}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-stone-700">Bekleyen / Onaylanan</span>
                </div>
                <span className="text-xl font-black text-amber-700">{stats.pendingCount}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-red-50/50 border border-red-100/50 hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-stone-700">İptal Edilen</span>
                </div>
                <span className="text-xl font-black text-red-700">{stats.cancelledCount}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-stone-100">
            <p className="text-sm font-bold text-stone-400 flex justify-between items-center">
              <span>Toplam Randevu Havuzu</span>
              <span className="text-lg text-stone-900">{appointments.length} İşlem</span>
            </p>
          </div>
        </div>

        {/* ── TOP SERVICES ── */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100/50">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-extrabold text-stone-900">En Çok Tercih Edilen 5 Hizmet</h2>
          </div>

          <div className="space-y-4">
            {topServices.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-2xl">
                <p className="text-stone-400 font-semibold text-sm">Henüz tamamlanmış hizmet verisi bulunmuyor.</p>
              </div>
            ) : (
              topServices.map((service, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200/60 group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-xs font-black text-stone-400 group-hover:text-purple-500 transition-colors">{idx + 1}</span>
                    </div>
                    <span className="font-bold text-stone-800 text-sm md:text-base">{service.name}</span>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center mt-2 sm:mt-0 pl-12 sm:pl-0">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">{service.count} Kez Yapıldı</span>
                    <span className="font-black text-rose-600">₺{service.rev.toLocaleString("tr-TR")} Gelir</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
