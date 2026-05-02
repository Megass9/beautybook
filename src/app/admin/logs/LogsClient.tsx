"use client";

import { useState, useMemo } from "react";
import { format, startOfDay, eachHourOfInterval, subHours, isSameHour } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  History, Search, Filter, Shield, CreditCard, 
  MessageSquare, Calendar, Store, Info, 
  ChevronRight, Database, Globe, Cpu, User,
  BarChart3, Activity, TrendingUp
} from "lucide-react";

export default function LogsClient({ initialLogs }: { initialLogs: any[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Grafik verisi hazırlama (Son 12 saatlik yoğunluk)
  const chartData = useMemo(() => {
    const now = new Date();
    const last12Hours = eachHourOfInterval({
      start: subHours(now, 11),
      end: now
    });

    return last12Hours.map(hour => {
      const count = logs.filter(log => isSameHour(new Date(log.created_at), hour)).length;
      return {
        time: format(hour, "HH:00"),
        count: count
      };
    });
  }, [logs]);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  const getActionIcon = (type: string) => {
    switch(type) {
      case 'auth': return <Shield className="w-4 h-4 text-emerald-500" />;
      case 'billing': return <CreditCard className="w-4 h-4 text-amber-500" />;
      case 'support': return <MessageSquare className="w-4 h-4 text-rose-500" />;
      case 'appointment': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'salon_update': return <Store className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-stone-400" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.title?.toLowerCase().includes(search.toLowerCase()) || 
      log.description?.toLowerCase().includes(search.toLowerCase()) ||
      log.salon?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" ? true : log.action_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 lg:h-[calc(100vh-120px)]">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest mb-3">
              <History className="w-3.5 h-3.5" /> Sistem Logları
            </div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight italic">İşlem Günlükleri</h1>
          </div>

          <div className="flex gap-4">
             <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                   <Activity className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Aktivite Skoru</p>
                   <p className="text-2xl font-black text-stone-900">%{Math.min(logs.length * 2, 100)}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Filters & Arama */}
        <div className="flex flex-wrap gap-3 shrink-0 bg-white p-3 rounded-[2rem] border border-stone-100 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" placeholder="İşlem veya salon ara..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-50 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-stone-100 transition-all"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
            {['all', 'auth', 'billing', 'support', 'appointment', 'salon_update'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  typeFilter === type ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'
                }`}
              >
                {type === 'all' ? 'TÜMÜ' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden min-h-0">
          
          {/* Sol: Liste ve Grafik */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
            
            {/* Grafik Alanı (Yeni) */}
            <div className="bg-white rounded-[2.5rem] border border-stone-200 p-8 shadow-sm shrink-0">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <BarChart3 className="w-5 h-5 text-stone-400" />
                     <h3 className="font-black text-stone-800 uppercase tracking-widest text-[11px]">Sistem Yoğunluğu (Son 12 Saat)</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                     <TrendingUp className="w-4 h-4" /> CANLI
                  </div>
               </div>
               
               <div className="flex items-end justify-between h-32 gap-1 md:gap-2 overflow-x-auto pb-2">
                  {chartData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                       <div className="w-full relative flex items-end justify-center h-full">
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                             {data.count} işlem
                          </div>
                          {/* Bar */}
                          <div 
                            className="w-full max-w-[30px] bg-stone-100 group-hover:bg-rose-500 rounded-t-lg transition-all duration-500 relative overflow-hidden"
                            style={{ height: `${(data.count / maxCount) * 100}%`, minHeight: '4px' }}
                          >
                             <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                          </div>
                       </div>
                       <span className="text-[9px] font-black text-stone-400">{data.time}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Log Listesi */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col min-h-0">
              <div className="overflow-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="sticky top-0 bg-stone-50 z-10 border-b border-stone-100">
                      <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Zaman / Tür</th>
                          <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">İşlem Detayı</th>
                          <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {filteredLogs.map((log) => (
                        <tr 
                          key={log.id} 
                          onClick={() => setSelectedLog(log)}
                          className={`hover:bg-stone-50/50 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-stone-50' : ''}`}
                        >
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-stone-100 flex items-center justify-center shadow-sm">
                                    {getActionIcon(log.action_type)}
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-black text-stone-900">{format(new Date(log.created_at), "HH:mm:ss")}</p>
                                    <p className="text-[9px] font-bold text-stone-400">{format(new Date(log.created_at), "d MMM", { locale: tr })}</p>
                                  </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-black text-stone-800 mb-0.5">{log.title}</p>
                              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight truncate max-w-[200px]">
                                {log.salon ? log.salon.name : 'SİSTEM'}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <ChevronRight className={`w-4 h-4 text-stone-300 transition-transform ${selectedLog?.id === log.id ? 'translate-x-1 text-stone-900' : ''}`} />
                            </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sağ: Detay Paneli (Gelişmiş) */}
          <div className="w-96 shrink-0">
            {selectedLog ? (
              <div className="h-full bg-stone-900 rounded-[3rem] shadow-2xl p-10 flex flex-col gap-8 text-white overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500 border border-white/5">
                 <div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                       {getActionIcon(selectedLog.action_type)}
                    </div>
                    <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">LOG DOSYASI</h3>
                    <h2 className="text-3xl font-black italic leading-tight mb-3">{selectedLog.title}</h2>
                    <p className="text-stone-400 text-sm font-medium leading-relaxed">{selectedLog.description}</p>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                       <p className="text-[9px] font-black text-stone-500 uppercase mb-2">İşlem Zamanı</p>
                       <p className="text-sm font-bold text-stone-200">{format(new Date(selectedLog.created_at), "d MMMM yyyy, HH:mm:ss", { locale: tr })}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                       <p className="text-[9px] font-black text-stone-500 uppercase mb-2">IP ve Kaynak</p>
                       <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-stone-500" />
                          <p className="text-sm font-mono font-bold text-emerald-400">{selectedLog.ip_address || "127.0.0.1"}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Database className="w-3 h-3" /> TEKNİK METADATA
                    </p>
                    <div className="bg-black/50 rounded-3xl p-6 border border-white/5">
                       <pre className="text-[10px] font-mono text-emerald-500/80 leading-relaxed whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.metadata, null, 2)}
                       </pre>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="h-full bg-stone-100/50 border border-dashed border-stone-200 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center gap-4 opacity-50">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Info className="w-8 h-8 text-stone-300" />
                 </div>
                 <p className="font-black uppercase tracking-[0.2em] text-[10px] text-stone-400">İncelemek için bir kayıt seçin</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
