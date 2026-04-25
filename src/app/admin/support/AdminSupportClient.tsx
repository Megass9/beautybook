"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ShieldCheck, MessageSquare, Clock, CheckCircle2, Search, Smartphone,
  ExternalLink, ChevronRight, Filter, CheckCircle, MapPin, Send, Reply,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSupportClient({ initialTickets }: { initialTickets: any[] }) {
  const supabase = createClient() as any;
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    setTickets(initialTickets);
    if (selectedTicket) {
      const updated = initialTickets.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } else if (initialTickets.length > 0) {
      setSelectedTicket(initialTickets[0]);
    }
  }, [initialTickets]);

  // Sadece cevap gönder (Durumu 'answered' yapar)
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      const { error: ticketError } = await supabase
        .from("support_tickets")
        .update({
          status: "answered",
          admin_reply: replyText,
          replied_at: new Date().toISOString()
        })
        .eq("id", selectedTicket.id);

      if (ticketError) throw ticketError;

      const { data: newMsg, error: msgError } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: selectedTicket.id,
          sender: "admin",
          message: replyText
        })
        .select()
        .single();

      if (msgError) throw msgError;

      await supabase.from("notifications").insert({
        salon_id: selectedTicket.salon_id,
        title: "Destek Mesajınız Var 💬",
        message: `Talebinize admin tarafından cevap yazıldı.`,
        is_read: false
      });

      // Sistem Loglarına Kaydet
      await supabase.from("admin_logs").insert({
        salon_id: selectedTicket.salon_id,
        action_type: 'support',
        title: 'Destek Talebi Yanıtlandı',
        description: `"${selectedTicket.subject}" konulu talebe admin yanıt verdi.`,
        metadata: { ticket_id: selectedTicket.id, admin_reply: replyText }
      });

      const updatedTicket = {
        ...selectedTicket,
        status: "answered",
        messages: [...(selectedTicket.messages || []), newMsg]
      };

      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      setSelectedTicket(updatedTicket);
      setReplyText("");
      toast.success("Yanıt gönderildi.");
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setReplying(false);
    }
  };

  // Talebi Kesin Olarak Kapat (Durumu 'closed' yapar)
  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: "closed" })
        .eq("id", selectedTicket.id);

      if (error) throw error;

      // Sistem Loglarına Kaydet
      await supabase.from("admin_logs").insert({
        salon_id: selectedTicket.salon_id,
        action_type: 'support',
        title: 'Destek Talebi Çözüldü',
        description: `"${selectedTicket.subject}" konulu talep çözüldü olarak kapatıldı.`,
        metadata: { ticket_id: selectedTicket.id }
      });

      toast.success("Talep çözüldü olarak kapatıldı.");
      const updated = { ...selectedTicket, status: "closed" };
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updated : t));
      setSelectedTicket(updated);
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open': return { label: 'Açık / Bekliyor', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'answered': return { label: 'Cevaplandı', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'closed': return { label: 'Çözüldü / Kapalı', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      default: return { label: status, color: 'bg-stone-100 text-stone-700' };
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.salon?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 h-[calc(100vh-120px)]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Destek Merkezi
            </div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight italic">Müşteri Talepleri</h1>
          </div>

          <div className="flex gap-3">
            <div className="bg-white px-6 py-3 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center font-black">
                {tickets.filter(t => t.status === 'open').length}
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Yeni</p>
                <p className="text-sm font-bold text-stone-900">Bekleyen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-1 gap-6 overflow-hidden min-h-0">

          {/* Sol: Liste */}
          <div className="w-80 shrink-0 flex flex-col gap-4 min-h-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-50"
              />
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {filteredTickets.map(ticket => {
                const s = getStatusInfo(ticket.status);
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all relative ${selectedTicket?.id === ticket.id ? "bg-white border-rose-500 shadow-md scale-[1.02]" : "bg-white/60 border-stone-100 hover:border-stone-200"
                      }`}
                  >
                    <div className="flex justify-between mb-1.5">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${s.color}`}>
                        {s.label}
                      </span>
                      <span className="text-[9px] text-stone-400 font-bold">
                        {format(new Date(ticket.created_at), "d MMM", { locale: tr })}
                      </span>
                    </div>
                    <h3 className="font-black text-stone-900 text-sm truncate">{ticket.subject}</h3>
                    <p className="text-[10px] text-stone-500 font-bold truncate">@{ticket.salon?.slug}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sağ: Chat */}
          <div className="flex-1 bg-white rounded-[3rem] border border-stone-200 shadow-xl overflow-hidden flex flex-col">
            {selectedTicket ? (
              <>
                {/* Chat Header */}
                <div className="px-8 py-6 border-b border-stone-50 bg-stone-50/30 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-stone-900">{selectedTicket.subject}</h2>
                    <p className="text-xs font-bold text-rose-500 mt-0.5">{selectedTicket.salon?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedTicket.status !== 'closed' && (
                      <button
                        onClick={handleCloseTicket}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                      >
                        <CheckCircle2 className="w-4 h-4" /> TALEBİ ÇÖZÜLDÜ YAP
                      </button>
                    )}
                    {selectedTicket.status === 'closed' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black border border-emerald-100">
                        <CheckCircle className="w-4 h-4" /> ÇÖZÜLDÜ
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-stone-50/20 custom-scrollbar">
                  {selectedTicket.messages?.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-5 rounded-[1.5rem] shadow-sm ${msg.sender === 'admin'
                          ? 'bg-stone-900 text-white rounded-tr-sm'
                          : 'bg-white border border-stone-100 text-stone-800 rounded-tl-sm'
                        }`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-3 opacity-50">
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {msg.sender === 'admin' ? 'Siz (Admin)' : 'Salon Sahibi'}
                          </span>
                          <span className="w-1 h-1 bg-current rounded-full" />
                          <span className="text-[9px] font-bold">{format(new Date(msg.created_at), "HH:mm", { locale: tr })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Area */}
                <div className="p-6 border-t border-stone-100 bg-white">
                  <div className="relative group">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={selectedTicket.status === 'closed' ? "Bu talep kapalıdır ama yine de yazabilirsiniz..." : "Cevabınızı buraya yazın..."}
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-100 rounded-[2rem] px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-200 resize-none transition-all pr-16"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={replying || !replyText.trim()}
                      className="absolute right-3 bottom-3 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center disabled:opacity-50 hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                    >
                      {replying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-3 font-bold text-center">
                    Cevap gönderdiğinizde durum otomatik olarak <span className="text-blue-500">"Cevaplandı"</span> olarak güncellenir.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-stone-300 gap-4">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 opacity-20" />
                </div>
                <p className="font-black uppercase tracking-[0.2em] text-[10px]">İşlem yapmak için bir talep seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
