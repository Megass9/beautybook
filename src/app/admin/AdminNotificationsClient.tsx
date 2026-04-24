"use client";

import { type FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Send, Users, Bell, CheckCircle, Clock, Target, Search, Trash2, Filter } from "lucide-react";

export type AdminNotification = {
  id: string;
  salon_id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

export type SalonOption = {
  id: string;
  name: string;
  city: string;
};

interface Props {
  salons: SalonOption[];
  notifications: AdminNotification[];
}

export default function AdminNotificationsClient({ salons, notifications }: Props) {
  const [targetSalon, setTargetSalon] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const targetLabel = useMemo(() => {
    if (targetSalon === "all") return "Tüm Salonlar";
    const salon = salons.find((item) => item.id === targetSalon);
    return salon ? `${salon.name} (${salon.city || "-"})` : "Seçili Salon";
  }, [targetSalon, salons]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           n.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" ? true : !n.is_read;
      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchTerm, filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu bildirimi silmek istediğinize emin misiniz?")) return;
    
    try {
      const response = await fetch(`/api/admin/notifications?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Silme işlemi başarısız.");

      toast.success("Bildirim silindi.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Başlık ve mesaj zorunludur.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salon_id: targetSalon,
          title: title.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Bildirim gönderilemedi.");
      }

      toast.success(`Bildirim ${data.count || 1} salon sahibine gönderildi!`);
      setTitle("");
      setMessage("");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Hedef Salon</p>
              <h2 className="mt-2 text-xl font-black text-slate-900">Mesajınız kime gidecek?</h2>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Salon Seçimi</label>
              <select
                value={targetSalon}
                onChange={(event) => setTargetSalon(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50 transition-all"
              >
                <option value="all">Tüm Salonlar</option>
                {salons.map((salon) => (
                  <option key={salon.id} value={salon.id}>
                    {salon.name} {salon.city ? ` - ${salon.city}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Seçiminiz</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{targetLabel}</p>
              <p className="mt-2 text-sm text-slate-500">Tüm salonlara mesaj göndermek için "Tüm Salonlar" seçeneğini kullanın.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/20">
              <Send className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Bildirim Oluştur</p>
              <h2 className="mt-2 text-xl font-black text-slate-900">Salon sahiplerine mesaj gönder</h2>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Bildirim Başlığı <span className="text-rose-500">*</span>
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Örneğin: Yeni Promosyon Duyurusu"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100/50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Bildirim Mesajı <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                placeholder="Salon sahibine iletmek istediğiniz mesajı yazın..."
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100/50 outline-none resize-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-rose-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Salon Sahiplerine Gönder
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Son Bildirimler</p>
              <h2 className="mt-2 text-xl font-black text-slate-900">Gönderilen bildirim geçmişi</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Arama ve Filtreleme Barı */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Geçmişte ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none transition-all"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none cursor-pointer"
              >
                <option value="all">Tümü</option>
                <option value="unread">Okunmamış</option>
              </select>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-10 text-center text-slate-500">
                <p className="font-semibold text-slate-700">Bildirim bulunamadı</p>
                <p className="mt-2 text-sm">Arama kriterlerinizi değiştirin veya yeni bir duyuru oluşturun.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {item.salon_id === "all" ? "Tüm Salonlar" : "Seçili Salon"}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.is_read ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {item.is_read ? "Okundu" : "Yeni"}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right text-xs text-slate-500">
                          {new Date(item.created_at).toLocaleString("tr-TR", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Bildirimi Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
