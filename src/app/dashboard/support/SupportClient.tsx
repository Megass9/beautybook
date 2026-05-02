"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  LifeBuoy, Plus, Send, MessageSquare, Clock, CheckCircle2, X, ChevronRight, Loader2, ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";

export default function SupportClient({ salonId, initialTickets }: { salonId: string, initialTickets: any[] }) {
  const supabase = createClient() as any;
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTickets(initialTickets);
    if (selectedTicket) {
      const updated = initialTickets.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } else if (!selectedTicket && initialTickets.length > 0) {
      setSelectedTicket(initialTickets[0]);
    }
  }, [initialTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .insert({ salon_id: salonId, subject: formData.subject, message: formData.message, status: "open" })
        .select()
        .single();

      if (error) throw error;

      await supabase.from("ticket_messages").insert({
        ticket_id: data.id,
        sender: "salon",
        message: formData.message
      });

      await supabase.from("notifications").insert({
        salon_id: salonId,
        title: "Destek Talebi İletildi",
        message: `"${formData.subject}" konulu talebiniz alındı.`,
        is_read: false
      });

      // Sistem Loglarına Kaydet
      await supabase.from("admin_logs").insert({
        salon_id: salonId,
        action_type: 'support',
        title: 'Yeni Destek Talebi',
        description: `${formData.subject} konulu yeni bir destek talebi oluşturuldu.`,
        metadata: { subject: formData.subject, ticket_id: data.id }
      });

      const newTicket = { ...data, messages: [{ sender: "salon", message: formData.message, created_at: new Date().toISOString() }] };
      setTickets([newTicket, ...tickets]);
      setSelectedTicket(newTicket);
      setIsChatOpen(true);
      setFormData({ subject: "", message: "" });
      setShowNewTicket(false);
      toast.success("Destek talebiniz oluşturuldu!");
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setSendingMessage(true);
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .insert({ ticket_id: selectedTicket.id, sender: "salon", message: newMessage.trim() })
        .select()
        .single();

      if (error) throw error;

      // Kullanıcı mesaj yazınca durumu tekrar 'open' (açık) yapalım ki admin görsün
      await supabase.from("support_tickets").update({ status: 'open' }).eq('id', selectedTicket.id);

      const updatedTicket = { 
        ...selectedTicket, 
        status: "open",
        messages: [...(selectedTicket.messages || []), data] 
      };
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      setSelectedTicket(updatedTicket);
      setNewMessage("");
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'open': return { label: 'Bekliyor', color: 'text-amber-500 bg-amber-50 border-amber-100' };
      case 'answered': return { label: 'Yanıtlandı', color: 'text-blue-500 bg-blue-50 border-blue-100' };
      case 'closed': return { label: 'Çözüldü', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' };
      default: return { label: status, color: 'text-stone-500 bg-stone-50 border-stone-100' };
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col gap-6 animate-fade-in p-2 md:p-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className={isChatOpen ? "hidden md:block" : "block"}>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight italic">Destek Merkezi</h1>
          <p className="text-stone-500 font-medium mt-1">Ekibimizle buradan yazışabilirsiniz.</p>
        </div>
        <button onClick={() => setShowNewTicket(true)} className="btn-primary group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Yeni Talep
        </button>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowNewTicket(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-stone-900 mb-8 italic">Yeni Destek Talebi</h2>
            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div>
                <label className="label">Konu</label>
                <input className="input" placeholder="Başlık..." value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
              </div>
              <div>
                <label className="label">Mesajınız</label>
                <textarea className="input min-h-[120px] py-4" placeholder="Detaylar..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
                {loading ? "Gönderiliyor..." : "Talebi Oluştur"} <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-[500px]">
        
        {/* Sol: Liste */}
        <div className={`w-full lg:w-80 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar ${isChatOpen ? 'hidden lg:flex' : 'flex'}`}>
          {tickets.map((ticket) => {
            const s = getStatusInfo(ticket.status);
            return (
              <button
                key={ticket.id}
                onClick={() => {
                  setSelectedTicket(ticket);
                  setIsChatOpen(true);
                }}
                className={`w-full text-left p-5 rounded-[2rem] border transition-all relative ${
                  selectedTicket?.id === ticket.id 
                    ? "bg-white border-rose-500 shadow-lg" 
                    : "bg-white/80 border-stone-100 hover:border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${s.color}`}>
                    {s.label}
                  </span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    {format(new Date(ticket.created_at), "d MMM", { locale: tr })}
                  </span>
                </div>
                <h3 className="font-black text-stone-900 text-sm truncate mb-1">{ticket.subject}</h3>
                <p className="text-[10px] text-stone-400 font-bold">Son mesaj: {format(new Date(ticket.created_at), "HH:mm", { locale: tr })}</p>
                {selectedTicket?.id === ticket.id && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronRight className="w-5 h-5 text-rose-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sağ: Chat */}
        <div className={`flex-1 flex flex-col bg-white rounded-[2rem] md:rounded-[3rem] border border-stone-200 shadow-sm overflow-hidden min-h-0 ${!isChatOpen ? 'hidden lg:flex' : 'flex'}`}>
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="px-6 md:px-8 py-4 md:py-6 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="lg:hidden w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center text-stone-500"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="font-black text-stone-900 text-lg">{selectedTicket.subject}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusInfo(selectedTicket.status).color}`}>
                        {getStatusInfo(selectedTicket.status).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 min-h-0 custom-scrollbar bg-stone-50/10">
                {selectedTicket.messages?.sort((a:any, b:any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'salon' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-[1.5rem] px-6 py-4 shadow-sm ${
                      msg.sender === 'salon'
                        ? 'bg-rose-500 text-white rounded-br-sm shadow-rose-100'
                        : 'bg-white border border-stone-100 text-stone-800 rounded-bl-sm'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                      <div className="flex items-center gap-2 mt-2 opacity-50">
                        <span className="text-[9px] font-black uppercase">
                          {msg.sender === 'salon' ? 'Siz' : '🛡️ Destek Ekibi'}
                        </span>
                        <span className="w-1 h-1 bg-current rounded-full" />
                        <span className="text-[9px] font-bold">{format(new Date(msg.created_at), "HH:mm", { locale: tr })}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 bg-white border-t border-stone-50">
                <div className="flex gap-3 items-end">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Mesajınızı buraya yazın..."
                    rows={2}
                    className="flex-1 bg-stone-50 border border-stone-100 rounded-[1.5rem] px-5 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-200 resize-none transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                    className="w-14 h-14 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-rose-100"
                  >
                    {sendingMessage ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-4 opacity-30">
              <LifeBuoy className="w-16 h-16 text-stone-900" />
              <p className="font-black uppercase tracking-widest text-xs">Yazışma seçilmedi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
