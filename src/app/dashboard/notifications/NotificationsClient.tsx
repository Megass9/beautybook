"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types";
import toast from "react-hot-toast";
import {
  Bell,
  Check,
  CheckCircle2,
  Info,
  Megaphone,
  Settings,
  Star,
  Clock,
  Sparkles
} from "lucide-react";


interface Props {
  notifications: Notification[];
}

export default function NotificationsClient({ notifications: initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [markingId, setMarkingId] = useState<string | null>(null);
  const supabase = createClient();

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    setMarkingId(id);
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    if (error) {
      toast.error("Durum güncellenemedi.");
    } else {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
    setMarkingId(null);
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    // Optimistic UI update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    const { error } = await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
    if (error) {
      toast.error("Bir hata oluştu.");
      setNotifications(initialNotifications); // revert
    } else {
      toast.success("Tümü okundu işaretlendi!");
    }
  };

  const getIcon = (title: string, message: string) => {
    const text = (title + " " + message).toLowerCase();
    if (text.includes("sistem") || text.includes("bakım") || text.includes("güncelleme")) {
      return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Settings className="w-5 h-5" /></div>;
    }
    if (text.includes("yeni") || text.includes("kampanya") || text.includes("tebrik")) {
      return <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500"><Star className="w-5 h-5" /></div>;
    }
    if (text.includes("önemli") || text.includes("dikkat") || text.includes("acil")) {
      return <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500"><Megaphone className="w-5 h-5" /></div>;
    }
    return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Info className="w-5 h-5" /></div>;
  };

  const filtered = notifications.filter(n => filter === "all" || !n.is_read);

  return (
    <div className="space-y-8">
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-stone-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center relative z-10">
            <Bell className="w-6 h-6 text-stone-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Toplam</p>
            <p className="text-3xl font-black text-stone-900 mt-1">{notifications.length}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-6 border border-rose-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/40 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm relative z-10">
            <Sparkles className="w-6 h-6 text-rose-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-rose-500 uppercase tracking-widest">Okunmamış</p>
            <p className="text-3xl font-black text-rose-600 mt-1">{unreadCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center relative z-10">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Okunmuş</p>
            <p className="text-3xl font-black text-emerald-700 mt-1">{notifications.length - unreadCount}</p>
          </div>
        </div>
      </div>

      {/* Kontroller & Liste */}
      <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-4 sm:p-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex bg-stone-100 p-1.5 rounded-2xl w-max">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${filter === "unread" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
            >
              Okunmamış
              {unreadCount > 0 && (
                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${filter === "unread" ? "bg-rose-100 text-rose-600" : "bg-stone-200 text-stone-600"
                  }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-5 py-3 rounded-2xl transition-all"
            >
              <Check className="w-4 h-4" /> Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 px-6 border-2 border-dashed border-stone-200 rounded-3xl bg-stone-50">
              <Bell className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-lg font-black text-stone-900 mb-2">Burada her şey sakin</p>
              <p className="text-stone-500 font-medium">Şu an için gösterilecek bir bildirim bulunmuyor.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`group p-6 rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row gap-5 ${item.is_read
                    ? "bg-stone-50/50 border-transparent hover:bg-stone-50 hover:border-stone-200"
                    : "bg-white border-rose-100 shadow-sm hover:shadow-md hover:border-rose-200 relative overflow-hidden"
                  }`}
              >
                {!item.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-orange-400" />
                )}

                <div className="shrink-0 pt-1">
                  {getIcon(item.title, item.message)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <h3 className={`font-black text-lg ${item.is_read ? "text-stone-700" : "text-stone-900"}`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(item.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed mb-4 ${item.is_read ? "text-stone-500" : "text-stone-600"}`}>
                    {item.message}
                  </p>

                  {!item.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      disabled={markingId === item.id}
                      className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {markingId === item.id ? "İşaretleniyor..." : "Okundu İşaretle"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
