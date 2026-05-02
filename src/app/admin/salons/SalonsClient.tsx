"use client";

import { useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Users,
  Scissors,
  AlertCircle,
  X,
  CreditCard,
  Mail,
  Smartphone
} from "lucide-react";
import SalonActionButtons from "../dashboard/SalonActionButtons";

export default function SalonsClient({ initialSalons }: { initialSalons: any[] }) {
  const [selectedSalon, setSelectedSalon] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filteredSalons = initialSalons.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.city?.toLowerCase().includes(search.toLowerCase()) ||
    s.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem Yönetimi
            </div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight italic">Platform Salonları</h1>
            <p className="text-stone-500 font-medium mt-2">Toplam {initialSalons?.length || 0} kayıtlı işletmeyi yönetiyorsunuz.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-6 py-4 rounded-[2rem] border border-stone-200 shadow-sm text-center min-w-[120px]">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Aktif Salon</p>
                <p className="text-2xl font-black text-stone-900">{initialSalons?.filter(s => s.is_active).length}</p>
             </div>
             <div className="bg-white px-6 py-4 rounded-[2rem] border border-stone-200 shadow-sm text-center min-w-[120px]">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Yeni (7 Gün)</p>
                <p className="text-2xl font-black text-emerald-500">
                  {initialSalons?.filter(s => differenceInDays(new Date(), new Date(s.created_at)) <= 7).length}
                </p>
             </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Salon adı, şehir veya slug ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-[2rem] pl-14 pr-6 py-5 text-sm font-bold text-stone-900 focus:outline-none focus:ring-4 focus:ring-rose-50 transition-all shadow-sm"
          />
        </div>

        {/* Salon List Table */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">İşletme Bilgisi</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Kapasite</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Abonelik Durumu</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Kayıt Tarihi</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredSalons.map((salon: any) => {
                  const staffCount = salon.staff?.length || 0;
                  const serviceCount = salon.services?.length || 0;
                  
                  const trialEnds = addDays(new Date(salon.created_at), 14);
                  const activeSub = salon.subscriptions?.find((s: any) => s.status === "active");
                  const lastValidDate = activeSub?.end_date ? new Date(activeSub.end_date) : trialEnds;
                  const graceEnds = addDays(lastValidDate, 3);
                  
                  const isBlocked = new Date() > graceEnds;
                  const isTrial = !activeSub && new Date() < trialEnds;
                  const isGrace = !isBlocked && new Date() > lastValidDate;

                  return (
                    <tr key={salon.id} className="group hover:bg-stone-50/40 transition-colors">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                             {salon.logo_url ? (
                               <img src={salon.logo_url} className="w-full h-full object-cover" alt="" />
                             ) : (
                               salon.name[0]
                             )}
                          </div>
                          <div>
                            <p className="font-black text-stone-900 text-lg leading-tight mb-1">{salon.name}</p>
                            <div className="flex items-center gap-3">
                               <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                                 <MapPin className="w-3 h-3" /> {salon.city || 'Şehir Yok'}
                               </span>
                               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">@{salon.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-4">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Users className="w-3 h-3" /> Personel
                              </span>
                              <span className="text-sm font-black text-stone-900">{staffCount}</span>
                           </div>
                           <div className="w-px h-8 bg-stone-100 mx-2" />
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Scissors className="w-3 h-3" /> Hizmet
                              </span>
                              <span className="text-sm font-black text-stone-900">{serviceCount}</span>
                           </div>
                        </div>
                      </td>

                      <td className="px-8 py-7">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase border border-rose-200">
                            BLOKE
                          </span>
                        ) : isGrace ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase border border-amber-200">
                            MÜHLET
                          </span>
                        ) : isTrial ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                            DENEME
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase shadow-md shadow-emerald-100">
                            AKTİF
                          </span>
                        )}
                      </td>

                      <td className="px-8 py-7">
                        <p className="text-xs font-black text-stone-900">{format(new Date(salon.created_at), "d MMM yyyy", { locale: tr })}</p>
                      </td>

                      <td className="px-8 py-7 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <a 
                              href={`/salon/${salon.slug}`} 
                              target="_blank"
                              className="w-10 h-10 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                            >
                               <ExternalLink className="w-4 h-4" />
                            </a>
                            <button 
                              onClick={() => setSelectedSalon(salon)}
                              className="w-10 h-10 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                            >
                               <ChevronRight className="w-5 h-5" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILS MODAL */}
        {selectedSalon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={() => setSelectedSalon(null)} />
            
            <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Modal Sol Panel (Özet) */}
              <div className="md:w-1/3 bg-[#1c0a0e] text-white p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10">
                   <button onClick={() => setSelectedSalon(null)} className="mb-8 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
                      <X className="w-5 h-5" />
                   </button>
                   
                   <div className="w-20 h-20 bg-white p-1.5 rounded-3xl mb-6 shadow-2xl">
                      {selectedSalon.logo_url ? (
                        <img src={selectedSalon.logo_url} className="w-full h-full object-cover rounded-[1.2rem]" alt="" />
                      ) : (
                        <div className="w-full h-full bg-rose-500 flex items-center justify-center text-3xl font-black rounded-[1.2rem]">{selectedSalon.name[0]}</div>
                      )}
                   </div>
                   
                   <h2 className="text-2xl font-black italic mb-2 leading-tight">{selectedSalon.name}</h2>
                   <p className="text-rose-400 font-bold text-sm tracking-widest uppercase mb-6">@{selectedSalon.slug}</p>
                   
                   <div className="space-y-4 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-3 text-stone-400">
                         <MapPin className="w-4 h-4 text-rose-500" />
                         <span className="text-xs font-medium">{selectedSalon.city} / {selectedSalon.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-stone-400">
                         <Smartphone className="w-4 h-4 text-rose-500" />
                         <span className="text-xs font-medium">{selectedSalon.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-stone-400">
                         <Mail className="w-4 h-4 text-rose-500" />
                         <span className="text-xs font-medium truncate">{selectedSalon.email || "Email Yok"}</span>
                      </div>
                   </div>
                </div>

                <div className="relative z-10 pt-10 space-y-4">
                   <SalonActionButtons salonId={selectedSalon.id} isActive={selectedSalon.is_active} />
                   <a href={`/salon/${selectedSalon.slug}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-rose-900/40 uppercase tracking-widest">
                      SİTEYİ AÇ <ExternalLink className="w-4 h-4" />
                   </a>
                </div>
              </div>

              {/* Modal Sağ Panel (Detaylı Listeler) */}
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-10">
                
                {/* İstatistikler */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                      <p className="text-[10px] font-black text-stone-400 uppercase mb-1">Personel</p>
                      <p className="text-2xl font-black text-stone-900">{selectedSalon.staff?.length || 0}</p>
                   </div>
                   <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                      <p className="text-[10px] font-black text-stone-400 uppercase mb-1">Hizmet</p>
                      <p className="text-2xl font-black text-stone-900">{selectedSalon.services?.length || 0}</p>
                   </div>
                   <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                      <p className="text-[10px] font-black text-stone-400 uppercase mb-1">Abonelik</p>
                      <p className="text-sm font-black text-emerald-600">AKTİF</p>
                   </div>
                </div>

                {/* Personel Listesi */}
                <div>
                   <h3 className="flex items-center gap-2 text-sm font-black text-stone-900 uppercase tracking-widest mb-4">
                      <Users className="w-4 h-4 text-rose-500" /> Personel Listesi
                   </h3>
                   <div className="grid grid-cols-2 gap-3">
                      {selectedSalon.staff?.map((s: any) => (
                        <div key={s.id} className="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-2xl shadow-sm">
                           <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-xs font-black text-stone-500">
                              {s.name[0]}
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-black text-stone-900 truncate">{s.name}</p>
                              <p className="text-[10px] font-bold text-stone-400 truncate">{s.title || "Personel"}</p>
                           </div>
                        </div>
                      ))}
                      {(!selectedSalon.staff || selectedSalon.staff.length === 0) && (
                        <p className="text-xs text-stone-400 italic">Henüz personel eklenmemiş.</p>
                      )}
                   </div>
                </div>

                {/* Hizmet Listesi */}
                <div>
                   <h3 className="flex items-center gap-2 text-sm font-black text-stone-900 uppercase tracking-widest mb-4">
                      <Scissors className="w-4 h-4 text-rose-500" /> Hizmet Kataloğu
                   </h3>
                   <div className="space-y-2">
                      {selectedSalon.services?.map((s: any) => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-stone-50/50 border border-stone-100 rounded-2xl">
                           <span className="text-xs font-black text-stone-700">{s.name}</span>
                           <span className="text-xs font-black text-rose-500">₺{s.price}</span>
                        </div>
                      ))}
                      {(!selectedSalon.services || selectedSalon.services.length === 0) && (
                        <p className="text-xs text-stone-400 italic">Henüz hizmet eklenmemiş.</p>
                      )}
                   </div>
                </div>

                {/* Abonelik Geçmişi */}
                <div>
                   <h3 className="flex items-center gap-2 text-sm font-black text-stone-900 uppercase tracking-widest mb-4">
                      <CreditCard className="w-4 h-4 text-rose-500" /> Abonelik Geçmişi
                   </h3>
                   <div className="space-y-2">
                      {selectedSalon.subscriptions?.map((sub: any) => (
                        <div key={sub.id} className="flex items-center justify-between p-4 bg-white border border-stone-100 rounded-2xl shadow-sm">
                           <div>
                              <p className="text-xs font-black text-stone-900">{sub.plan_name}</p>
                              <p className="text-[10px] font-bold text-stone-400">{format(new Date(sub.created_at), "d MMM yyyy", { locale: tr })}</p>
                           </div>
                           <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${sub.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                              {sub.status.toUpperCase()}
                           </span>
                        </div>
                      ))}
                      {(!selectedSalon.subscriptions || selectedSalon.subscriptions.length === 0) && (
                        <p className="text-xs text-stone-400 italic">Ödeme kaydı bulunmuyor.</p>
                      )}
                   </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
