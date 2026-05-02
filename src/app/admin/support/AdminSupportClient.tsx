"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ShieldCheck,
  MessageSquare,
  Clock,
  CheckCircle2,
  Search,
  Send,
  Loader2,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  Hash,
  Building2,
  ChevronDown,
  Filter,
  Reply,
  Archive,
  Phone,
  Mail,
  Star,
  Activity,
  Zap,
  Eye,
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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setTickets(initialTickets);
    if (selectedTicket) {
      const updated = initialTickets.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } else if (initialTickets.length > 0) {
      setSelectedTicket(initialTickets[0]);
    }
  }, [initialTickets]);

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

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: "closed" })
        .eq("id", selectedTicket.id);

      if (error) throw error;

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
      case 'open': 
        return { 
          label: 'Açık / Bekliyor', 
          color: 'bg-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          icon: AlertCircle,
          priority: 'Yüksek Öncelik'
        };
      case 'answered': 
        return { 
          label: 'Cevaplandı', 
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          icon: Reply,
          priority: 'Orta Öncelik'
        };
      case 'closed': 
        return { 
          label: 'Çözüldü', 
          color: 'bg-emerald-500',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-700',
          icon: CheckCircle2,
          priority: 'Düşük Öncelik'
        };
      default: 
        return { 
          label: status, 
          color: 'bg-stone-500',
          bgColor: 'bg-stone-50',
          borderColor: 'border-stone-200',
          textColor: 'text-stone-700',
          icon: MessageSquare,
          priority: 'Bilinmiyor'
        };
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    answered: tickets.filter(t => t.status === 'answered').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.salon?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.salon?.slug?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-[0.3em]">Destek Yönetimi</p>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Müşteri Destek Talepleri</h1>
            </div>
          </div>
          <p className="text-stone-500 text-sm max-w-3xl">
            Müşterilerden gelen destek taleplerini yönetin, yanıtlayın ve çözüme kavuşturun.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <MessageSquare className="w-5 h-5 text-stone-400" />
              <span className="text-2xl font-black text-stone-900">{stats.total}</span>
            </div>
            <p className="text-sm font-semibold text-stone-700">Toplam Talep</p>
            <p className="text-xs text-stone-400 mt-1">Tüm zamanlar</p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-black text-amber-600">{stats.open}</span>
            </div>
            <p className="text-sm font-semibold text-amber-900">Açık Talepler</p>
            <p className="text-xs text-amber-600 mt-1">Cevap bekleyen</p>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Reply className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-black text-blue-600">{stats.answered}</span>
            </div>
            <p className="text-sm font-semibold text-blue-900">Cevaplanan</p>
            <p className="text-xs text-blue-600 mt-1">Yanıt gönderilen</p>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl font-black text-emerald-600">{stats.closed}</span>
            </div>
            <p className="text-sm font-semibold text-emerald-900">Çözülen</p>
            <p className="text-xs text-emerald-600 mt-1">Tamamlanan talepler</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Tickets List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search & Filters */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Salon veya konu ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-3 py-2 bg-stone-50 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filtrele</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="mt-3 flex gap-2">
                  {['all', 'open', 'answered', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        statusFilter === status
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {status === 'all' ? 'Tümü' : status === 'open' ? 'Açık' : status === 'answered' ? 'Cevaplanan' : 'Çözülen'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tickets List */}
            <div className="space-y-2 max-h-[400px] lg:max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredTickets.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status);
                const StatusIcon = statusInfo.icon;
                const isSelected = selectedTicket?.id === ticket.id;
                
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-50 to-white border-rose-500 shadow-md'
                        : 'bg-white border-stone-200 hover:border-rose-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                        <span className="text-[10px] font-black uppercase text-stone-500">
                          #{ticket.id.slice(-6)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusIcon className={`w-3 h-3 ${statusInfo.textColor}`} />
                        <span className={`text-[9px] font-black uppercase ${statusInfo.textColor}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-black text-stone-900 text-sm mb-1 line-clamp-1">
                      {ticket.subject}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-3 h-3 text-stone-400" />
                      <p className="text-[10px] font-bold text-stone-500 truncate">
                        {ticket.salon?.name}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-[9px] text-stone-400 font-bold">
                      <span>{format(new Date(ticket.created_at), "d MMM yyyy", { locale: tr })}</span>
                      <span>{ticket.messages?.length || 0} mesaj</span>
                    </div>
                  </button>
                );
              })}
              
              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-2xl mb-3">
                    <MessageSquare className="w-8 h-8 text-stone-400" />
                  </div>
                  <p className="text-sm font-bold text-stone-600">Talep Bulunamadı</p>
                  <p className="text-xs text-stone-400 mt-1">Filtrelerinizi değiştirmeyi deneyin</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Chat Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden flex flex-col h-[600px] lg:h-[700px]">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-black mb-1">{selectedTicket.subject}</h2>
                      <div className="flex items-center gap-3 text-stone-300 text-xs">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{selectedTicket.salon?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>@{selectedTicket.salon?.slug}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {selectedTicket.status !== 'closed' && (
                        <button
                          onClick={handleCloseTicket}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-[11px] font-black text-white transition-all shadow-lg flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          ÇÖZÜLDÜ OLARAK İŞARETLE
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Ticket Info */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-700/50 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-stone-300">Oluşturulma:</span>
                      <span className="font-semibold">
                        {format(new Date(selectedTicket.created_at), "d MMM yyyy, HH:mm", { locale: tr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-stone-300">Talep ID:</span>
                      <span className="font-mono font-semibold">{selectedTicket.id}</span>
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/30 custom-scrollbar">
                  {selectedTicket.messages?.map((msg: any, idx: number) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div key={msg.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${
                          isAdmin
                            ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-t-2xl rounded-bl-2xl'
                            : 'bg-white border border-stone-200 text-stone-800 rounded-t-2xl rounded-br-2xl shadow-sm'
                        } p-4`}>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <div className={`flex items-center gap-2 mt-2 text-[10px] font-bold ${
                            isAdmin ? 'text-rose-100' : 'text-stone-400'
                          }`}>
                            <span>{isAdmin ? 'Admin' : selectedTicket.salon?.name}</span>
                            <span>•</span>
                            <span>{format(new Date(msg.created_at), "HH:mm", { locale: tr })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {(!selectedTicket.messages || selectedTicket.messages.length === 0) && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-stone-500">Henüz mesaj yok</p>
                    </div>
                  )}
                </div>

                {/* Reply Area */}
                <div className="p-6 border-t border-stone-200 bg-white">
                  <div className="relative">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        selectedTicket.status === 'closed'
                          ? "Bu talep çözüldü olarak işaretlenmiş, ancak yine de yanıt gönderebilirsiniz..."
                          : "Yanıtınızı yazın..."
                      }
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none transition-all pr-14"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={replying || !replyText.trim()}
                      className="absolute right-3 bottom-3 w-10 h-10 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 text-white rounded-lg flex items-center justify-center transition-all shadow-md"
                    >
                      {replying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[10px] text-stone-400 font-bold">
                    <div className="flex items-center gap-2">
                      <Reply className="w-3 h-3" />
                      <span>Yanıt gönderdiğinizde durum "Cevaplandı" olarak güncellenir</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      <span>Salon sahibi bildirim alacaktır</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xl flex flex-col items-center justify-center h-[700px]">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl mb-4">
                    <MessageSquare className="w-12 h-12 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-black text-stone-700 mb-2">Talep Seçilmedi</h3>
                  <p className="text-sm text-stone-500 max-w-sm">
                    Görüntülemek veya yanıtlamak için sol panelden bir destek talebi seçin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d0d0d0;
        }
      `}</style>
    </div>
  );
}