"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { format, addDays, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Search, 
  Building2, 
  Receipt,
  ExternalLink,
  Users,
  CreditCard,
  LayoutGrid,
  MapPin,
  Calendar,
  LifeBuoy,
  MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "payments" | "salons" | "tickets";

export default function AdminClient({ 
  initialSubscriptions, 
  initialSalons,
  initialTickets
}: { 
  initialSubscriptions: any[], 
  initialSalons: any[],
  initialTickets: any[]
}) {
  const supabase = createClient() as any;
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [salons, setSalons] = useState(initialSalons);
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTab, setActiveTab] = useState<Tab>("payments");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleApprove = async (sub: any) => {
    const confirmApprove = window.confirm(`${sub.salon?.name} salonunun ödemesini onaylıyor musunuz?`);
    if (!confirmApprove) return;

    try {
      const res = await fetch("/api/admin/approve-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      } as HeadersInit,
      body: JSON.stringify({ subId: sub.id }),
    });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "İşlem başarısız");

      setSubscriptions(prev => prev.map(s => 
        s.id === sub.id ? { ...s, ...data.data } : s
      ));
      toast.success("Ödeme onaylandı!");
      router.refresh();
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: "closed" })
        .eq("id", ticketId);

      if (error) throw error;

      // Salona bildirim gönder
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
        await supabase.from("notifications").insert({
          salon_id: ticket.salon_id,
          title: "Destek Talebi Çözüldü ✅",
          message: `"${ticket.subject}" konulu talebiniz admin tarafından incelenmiş ve çözüme kavuşturulmuştur.`,
          is_read: false
        });
      }

      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "closed" } : t));
      toast.success("Talep kapatıldı.");
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    }
  };

  const filteredSubs = subscriptions.filter(s => {
    const matchesFilter = filter === "all" ? true : s.status === filter;
    return matchesFilter && (s.salon?.name?.toLowerCase().includes(search.toLowerCase()) || s.receipt_no?.toLowerCase().includes(search.toLowerCase()));
  });

  const filteredSalons = salons.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.city?.toLowerCase().includes(search.toLowerCase()));
  
  const filteredTickets = tickets.filter(t => t.subject?.toLowerCase().includes(search.toLowerCase()) || t.salon?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-rose-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-rose-200">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight italic">Süper Admin Paneli</h1>
              <p className="text-stone-500 font-medium">Platform operasyonlarını buradan yönetin.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="text-center px-6 border-r border-stone-100">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Açık Talepler</p>
              <p className="text-2xl font-black text-rose-500 tabular-nums">{tickets.filter(t => t.status === "open").length}</p>
            </div>
            <div className="text-center px-6">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Bekleyen Ödeme</p>
              <p className="text-2xl font-black text-amber-500 tabular-nums">{subscriptions.filter(s => s.status === "pending").length}</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
      <div className="flex gap-2 md:gap-4 p-1.5 bg-white rounded-2xl border border-stone-200 shadow-sm w-full md:w-fit mx-auto overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab("payments")} className={`flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 ${activeTab === "payments" ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "text-stone-400 hover:bg-stone-50"}`}>
            <CreditCard className="w-4 h-4" /> Ödemeler
          </button>
        <button onClick={() => setActiveTab("salons")} className={`flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 ${activeTab === "salons" ? "bg-stone-900 text-white shadow-lg shadow-stone-300" : "text-stone-400 hover:bg-stone-50"}`}>
            <LayoutGrid className="w-4 h-4" /> Salonlar
          </button>
        <button onClick={() => setActiveTab("tickets")} className={`flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 ${activeTab === "tickets" ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "text-stone-400 hover:bg-stone-50"}`}>
            <LifeBuoy className="w-4 h-4" /> Talepler
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-stone-900 focus:outline-none focus:ring-4 focus:ring-rose-50 transition-all shadow-sm"
          />
        </div>

        {activeTab === "payments" && (
           <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden animate-fade-in overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                    <th className="px-8 py-6">Salon</th>
                    <th className="px-8 py-6">Paket</th>
                    <th className="px-8 py-6">Dekont No</th>
                    <th className="px-8 py-6 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-stone-50/30 transition-colors group">
                      <td className="px-8 py-6 font-black text-stone-900">{sub.salon?.name}</td>
                      <td className="px-8 py-6 font-black text-rose-500">₺{sub.amount}</td>
                      <td className="px-8 py-6 font-black text-stone-500">{sub.receipt_no}</td>
                      <td className="px-8 py-6 text-right">
                        {sub.status === "pending" && (
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => handleApprove(sub)} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-black">ONAYLA</button>
                          </div>
                        )}
                        {sub.status === "active" && <span className="text-[10px] font-black text-emerald-500 uppercase">AKTİF</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}

        {activeTab === "salons" && (
          <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
            {filteredSalons.map((salon) => {
               const trialEnds = addDays(new Date(salon.created_at), 14);
               const activeSub = subscriptions.find(s => s.salon_id === salon.id && s.status === "active");
               const hasActiveSub = activeSub && new Date(activeSub.end_date) > new Date();
               
               return (
                 <div key={salon.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center font-black">{salon.name[0]}</div>
                       <div>
                          <h3 className="font-black text-stone-900">{salon.name}</h3>
                          <p className="text-[10px] font-bold text-stone-400 italic">@{salon.slug}</p>
                       </div>
                    </div>
                    <div className="space-y-3 mb-6">
                       <div className="flex justify-between text-xs font-bold text-stone-500">
                          <span>Durum</span>
                          <span className={hasActiveSub ? "text-emerald-500" : "text-amber-500"}>{hasActiveSub ? "AKTİF" : "DENEME"}</span>
                       </div>
                    </div>
                    <a href={`/salon/${salon.slug}`} target="_blank" className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-black text-[10px] rounded-xl flex items-center justify-center gap-2 transition-all">SİTEYE GİT <ExternalLink className="w-3 h-3" /></a>
                 </div>
               );
            })}
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-4 animate-fade-in">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ticket.status === 'open' ? 'bg-amber-50 text-amber-500' : 'bg-stone-100 text-stone-400'}`}>
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-stone-900">{ticket.subject}</h3>
                        <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-lg text-stone-500 font-bold">{ticket.salon?.name}</span>
                      </div>
                      <p className="text-sm text-stone-500 font-medium mb-4">{ticket.message}</p>
                      <div className="flex items-center gap-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                         <span>{format(new Date(ticket.created_at), "d MMM yyyy HH:mm", { locale: tr })}</span>
                         <span className={ticket.status === 'open' ? 'text-amber-500' : 'text-emerald-500'}>{ticket.status === 'open' ? 'AÇIK' : 'KAPATILDI'}</span>
                      </div>
                    </div>
                  </div>
                  {ticket.status === 'open' && (
                    <button onClick={() => handleCloseTicket(ticket.id)} className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-black shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all">ÇÖZÜLDÜ İŞARETLE</button>
                  )}
                </div>
              </div>
            ))}
            {filteredTickets.length === 0 && (
               <div className="text-center py-20 bg-stone-50 rounded-[3rem] border border-dashed border-stone-300">
                  <LifeBuoy className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                  <p className="text-stone-400 font-bold">Herhangi bir destek talebi bulunmuyor.</p>
               </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
