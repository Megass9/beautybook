"use client";
import { useState } from "react";
import {
  Search, Phone, Calendar, ChevronRight, Users,
  X, TrendingUp, Clock, Scissors, Star, Filter,
  ArrowUpRight, MoreHorizontal
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import type { Customer } from "@/types";

type SortOption = "name" | "newest" | "oldest" | "appointments";

type CustomerWithStats = Customer & {
  appointments?: { count: number }[];
};

export default function CustomersClient({
  salonId,
  initialCustomers,
}: {
  salonId: string;
  initialCustomers: CustomerWithStats[];
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selected, setSelected] = useState<typeof initialCustomers[0] | null>(null);

  const filtered = initialCustomers
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    )
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "tr");
      if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === "appointments") return ((b.appointments?.[0] as any)?.count || 0) - ((a.appointments?.[0] as any)?.count || 0);
      return 0;
    });

  // Stats
  const totalCustomers = initialCustomers.length;
  const thisMonth = initialCustomers.filter(c => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const withAppointments = initialCustomers.filter(c => ((c.appointments?.[0] as any)?.count || 0) > 0).length;
  const totalSpent = initialCustomers.reduce((sum, c) => sum + (0), 0);

  // Avatar color based on name
  const avatarColor = (name: string) => {
    const colors = [
      "from-rose-400 to-rose-600",
      "from-purple-400 to-purple-600",
      "from-blue-400 to-blue-600",
      "from-emerald-400 to-emerald-600",
      "from-amber-400 to-amber-600",
      "from-pink-400 to-pink-600",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Müşteriler</h1>
          <p className="text-sm text-stone-400 mt-0.5">{totalCustomers} kayıtlı müşteri</p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Müşteri", value: totalCustomers, sub: "kayıtlı", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Bu Ay Yeni", value: thisMonth, sub: "yeni kayıt", icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Randevu Alan", value: withAppointments, sub: `${totalCustomers - withAppointments} pasif`, icon: Calendar, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Toplam Harcama", value: `₺${totalSpent.toLocaleString("tr-TR")}`, sub: "tüm zamanlar", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-black text-stone-900">{stat.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-stone-300 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className={`grid gap-6 ${selected ? "lg:grid-cols-[1fr_360px]" : "grid-cols-1"}`}>

        {/* ── CUSTOMER LIST ── */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

          {/* Search & sort bar */}
          <div className="flex items-center gap-3 p-4 border-b border-stone-100">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
                placeholder="Ad veya telefon ile ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-stone-400 hover:text-stone-600" />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-600 focus:outline-none focus:border-rose-400 transition-all appearance-none cursor-pointer pr-7"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="name">İsim A-Z</option>
              <option value="appointments">Randevu Sayısı</option>
            </select>
          </div>

          {/* Results count */}
          {search && (
            <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
              <p className="text-xs text-stone-500">
                <span className="font-semibold text-stone-700">{filtered.length}</span> sonuç bulundu
              </p>
            </div>
          )}

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-stone-400" />
              </div>
              <p className="font-semibold text-stone-600 mb-1">Müşteri bulunamadı</p>
              <p className="text-sm text-stone-400">Farklı bir arama deneyin</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {filtered.map(c => {
                const isSelected = selected?.id === c.id;
                const aptCount = (c.appointments?.[0] as any)?.count || 0;
                const lastDate: string | undefined = undefined;
                const totalSpentC = 0;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelected(isSelected ? null : c)}
                    className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all group ${
                      isSelected
                        ? "bg-rose-50 border-l-2 border-rose-500"
                        : "hover:bg-stone-50/70 border-l-2 border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-11 h-11 bg-gradient-to-br ${avatarColor(c.name)} rounded-full flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm`}>
                      {c.name[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-stone-900 text-sm">{c.name}</p>
                        {aptCount > 0 && (
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded-full">
                            {aptCount} randevu
                          </span>
                        )}
                        {aptCount === 0 && (
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-full">
                            Pasif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-stone-400">
                          <Phone className="w-3 h-3" />{c.phone}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-stone-400">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: tr })}
                        </span>
                        {totalSpentC > 0 && (
                          <span className="text-xs font-bold text-emerald-600">₺{totalSpentC.toLocaleString("tr-TR")}</span>
                        )}
                      </div>
                    </div>

                    {/* Last appointment */}
                    {lastDate && (
                      <div className="hidden sm:block text-right shrink-0">
                        <p className="text-[10px] text-stone-400">Son randevu</p>
                        <p className="text-xs font-semibold text-stone-600">
                          {format(parseISO(lastDate), "d MMM", { locale: tr })}
                        </p>
                      </div>
                    )}

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-all ${
                      isSelected ? "text-rose-500 rotate-90" : "text-stone-300 group-hover:text-stone-500"
                    }`} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-stone-100 bg-stone-50">
              <p className="text-xs text-stone-400 text-center">{filtered.length} müşteri gösteriliyor</p>
            </div>
          )}
        </div>

        {/* ── CUSTOMER DETAIL PANEL ── */}
        {selected && (
          <div className="space-y-4">

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-[#110608] px-6 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-900/20 rounded-full blur-2xl" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                <div className="relative flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${avatarColor(selected.name)} rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl`}>
                    {selected.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{selected.name}</h3>
                    <p className="text-stone-400 text-sm flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3" />{selected.phone}
                    </p>
                    <p className="text-stone-500 text-xs mt-1">
                      {format(new Date(selected.created_at), "d MMMM yyyy", { locale: tr })} tarihinde kayıt
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-stone-100 border-b border-stone-100">
                {[
                  { label: "Randevu", value: (selected.appointments?.[0] as any)?.count || 0 },
                  { label: "Harcama", value: `₺${(0).toLocaleString()}` },
                  { label: "Son Ziyaret", value: "—" },
                ].map(s => (
                  <div key={s.label} className="text-center py-4 px-2">
                    <p className="text-lg font-black text-stone-900">{s.value}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-3 w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 transition-all group"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold text-stone-700">Ara</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 ml-auto group-hover:text-stone-600 transition-colors" />
                </a>
                <a
                  href={`/dashboard/appointments?customer=${selected.id}`}
                  className="flex items-center gap-3 w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 transition-all group"
                >
                  <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <span className="text-sm font-semibold text-stone-700">Randevularını Gör</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 ml-auto group-hover:text-stone-600 transition-colors" />
                </a>
              </div>
            </div>

            {/* Loyalty indicator */}
            {((selected.appointments?.[0] as any)?.count || 0) > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Sadakat Seviyesi</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.min(Math.ceil(((selected.appointments?.[0] as any)?.count || 0) / 3), 5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min((((selected.appointments?.[0] as any)?.count || 0) / 15) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-stone-400 mt-2">
                  {((selected.appointments?.[0] as any)?.count || 0) < 5 ? "Yeni müşteri" :
                   ((selected.appointments?.[0] as any)?.count || 0) < 10 ? "Düzenli müşteri" :
                   "Sadık müşteri ⭐"}
                </p>
              </div>
            )}

            {/* Notes placeholder */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3">Notlar</p>
              {(selected as any).notes ? (
                <p className="text-sm text-stone-600 leading-relaxed">{(selected as any).notes}</p>
              ) : (
                <p className="text-sm text-stone-300 italic">Henüz not eklenmedi</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}