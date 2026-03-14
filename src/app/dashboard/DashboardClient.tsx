"use client";
import React from "react";
import { Calendar, Users, TrendingUp, ArrowUpRight, Plus, Scissors, ChevronRight, Star, BarChart3, Bell } from "lucide-react";
import Link from "next/link";

type AptRow = {
  id: string;
  status: string;
  start_time: string;
  end_time?: string;
  appointment_date: string;
  appointment_date_formatted: string;
  customer: { name: string } | null;
  service: { name: string; price: number } | null;
  staff: { name: string } | null;
};

type Props = {
  slug: string;
  greeting: string;
  salonFirstName: string;
  todayFormatted: string;
  todayApts: AptRow[];
  pendingApts: AptRow[];
  confirmedToday: number;
  pendingToday: number;
  completedToday: number;
  monthRevenue: number;
  totalRevenue: number;
  yesterdayRevenue: number;
  yesterdayAptsCount: number;
  totalCustomersCount: number;
  newCustomersCount: number;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",  label: "Beklemede"  },
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500",label: "Onaylı"     },
  cancelled: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400",    label: "İptal"      },
  completed: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",   label: "Tamamlandı" },
};

export default function DashboardClient({
  slug, greeting, salonFirstName, todayFormatted,
  todayApts, pendingApts,
  confirmedToday, pendingToday, completedToday,
  monthRevenue, totalRevenue, yesterdayRevenue,
  yesterdayAptsCount, totalCustomersCount, newCustomersCount,
}: Props) {
  return (
    <div className="space-y-6 pb-10">

      {/* ── GREETING HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-stone-400 font-medium">{todayFormatted}</p>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
            {greeting}, {salonFirstName} 👋
          </h1>
        </div>
        <Link
          href="/dashboard/appointments?new=1"
          className="self-start sm:self-auto flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-rose-200"
        >
          <Plus className="w-4 h-4" /> Yeni Randevu
        </Link>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/appointments" className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-rose-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </div>
          <p className="text-2xl font-black text-stone-900 mb-1">{todayApts.length}</p>
          <p className="text-xs text-stone-400 leading-snug">{confirmedToday} onaylı, {pendingToday} beklemede</p>
          <div className="mt-2 text-[10px] font-semibold flex items-center gap-0.5 text-emerald-600">
            <ArrowUpRight className="w-3 h-3" /> Dün: {yesterdayAptsCount}
          </div>
        </Link>

        <Link href="/dashboard/reports" className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </div>
          <p className="text-2xl font-black text-stone-900 mb-1">₺{monthRevenue.toLocaleString("tr-TR")}</p>
          <p className="text-xs text-stone-400 leading-snug">Toplam: ₺{totalRevenue.toLocaleString("tr-TR")}</p>
          {yesterdayRevenue > 0 && (
            <div className="mt-2 text-[10px] font-semibold flex items-center gap-0.5 text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> Dün: ₺{yesterdayRevenue}
            </div>
          )}
        </Link>

        <Link href="/dashboard/customers" className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </div>
          <p className="text-2xl font-black text-stone-900 mb-1">{totalCustomersCount}</p>
          <p className="text-xs text-stone-400 leading-snug">Bu ay +{newCustomersCount} yeni</p>
          <div className="mt-2 text-[10px] font-semibold flex items-center gap-0.5 text-emerald-600">
            <ArrowUpRight className="w-3 h-3" /> +{newCustomersCount} bu ay
          </div>
        </Link>

        <Link href="/dashboard/appointments" className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 ${pendingApts.length ? "bg-amber-50" : "bg-stone-50"} rounded-xl flex items-center justify-center`}>
              <Bell className={`w-5 h-5 ${pendingApts.length ? "text-amber-600" : "text-stone-400"}`} />
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </div>
          <p className="text-2xl font-black text-stone-900 mb-1">{pendingApts.length}</p>
          <p className="text-xs text-stone-400 leading-snug">{pendingApts.length ? "Onay bekliyor" : "Tüm randevular onaylı"}</p>
        </Link>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">

        {/* TODAY'S APPOINTMENTS */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <h2 className="font-bold text-stone-900 text-sm">Bugünkü Randevular</h2>
                <p className="text-[10px] text-stone-400">{todayApts.length} randevu</p>
              </div>
            </div>
            <Link href="/dashboard/appointments" className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all">
              Tümü <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {todayApts.length > 0 && (
            <div className="px-6 py-3 border-b border-stone-50 flex items-center gap-3">
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${(confirmedToday / todayApts.length) * 100}%` }} />
                <div className="h-full bg-amber-400"   style={{ width: `${(pendingToday   / todayApts.length) * 100}%` }} />
                <div className="h-full bg-blue-500"    style={{ width: `${(completedToday / todayApts.length) * 100}%` }} />
              </div>
              <div className="flex items-center gap-3 text-[10px] shrink-0">
                <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 bg-emerald-500 rounded-full" />{confirmedToday} onaylı</span>
                {pendingToday > 0 && <span className="flex items-center gap-1 text-amber-600"><span className="w-2 h-2 bg-amber-400 rounded-full" />{pendingToday} bekliyor</span>}
                {completedToday > 0 && <span className="flex items-center gap-1 text-blue-600"><span className="w-2 h-2 bg-blue-500 rounded-full" />{completedToday} tamamlandı</span>}
              </div>
            </div>
          )}

          {todayApts.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-stone-400" />
              </div>
              <p className="font-semibold text-stone-600 mb-1">Bugün randevu yok</p>
              <p className="text-sm text-stone-400 mb-5">Yeni randevu eklemek için butona tıklayın</p>
              <Link href="/dashboard/appointments?new=1" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-rose-200">
                <Plus className="w-4 h-4" /> Randevu Ekle
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {todayApts.map((apt) => {
                const s = STATUS_STYLES[apt.status] || STATUS_STYLES.pending;
                return (
                  <div key={apt.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-stone-50/60 transition-colors">
                    <div className="w-12 text-center shrink-0">
                      <p className="text-sm font-black text-stone-900 tabular-nums">{apt.start_time?.slice(0, 5)}</p>
                      <p className="text-[10px] text-stone-400 tabular-nums">{apt.end_time?.slice(0, 5)}</p>
                    </div>
                    <div className={`w-1 h-10 rounded-full shrink-0 ${s.dot}`} />
                    <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
                      {apt.customer?.name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm truncate">{apt.customer?.name}</p>
                      <p className="text-xs text-stone-400 truncate flex items-center gap-1.5">
                        <Scissors className="w-3 h-3" />{apt.service?.name}
                        {apt.staff?.name && <><span>·</span>{apt.staff.name}</>}
                      </p>
                    </div>
                    {apt.service?.price && <p className="text-sm font-black text-rose-600 shrink-0">₺{apt.service.price}</p>}
                    <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text} shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          {pendingApts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-800">Onay Bekleyen</span>
                  <span className="bg-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{pendingApts.length}</span>
                </div>
                <Link href="/dashboard/appointments" className="text-xs text-amber-700 font-semibold hover:underline">Tümü →</Link>
              </div>
              <div className="p-3 space-y-2">
                {pendingApts.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl p-3 border border-amber-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-xs font-black shrink-0">
                      {apt.customer?.name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-800 truncate">{apt.customer?.name}</p>
                      <p className="text-[10px] text-stone-400 truncate">{apt.appointment_date_formatted} · {apt.start_time?.slice(0, 5)}</p>
                    </div>
                    <Link href="/dashboard/appointments" className="shrink-0 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-lg transition-colors">Gör</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Hızlı Erişim</h3>
            </div>
            <div className="p-3 space-y-1">
              <Link href="/dashboard/appointments?new=1" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-rose-50">
                <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-white flex items-center justify-center"><Plus className="w-3.5 h-3.5 text-rose-600" /></div>
                <span className="text-sm font-medium text-stone-700 flex-1">Yeni Randevu Oluştur</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
              </Link>
              <Link href="/dashboard/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-blue-50">
                <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-white flex items-center justify-center"><Users className="w-3.5 h-3.5 text-blue-600" /></div>
                <span className="text-sm font-medium text-stone-700 flex-1">Müşterileri Görüntüle</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
              </Link>
              <Link href="/dashboard/services" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-purple-50">
                <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-white flex items-center justify-center"><Scissors className="w-3.5 h-3.5 text-purple-600" /></div>
                <span className="text-sm font-medium text-stone-700 flex-1">Hizmetleri Düzenle</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
              </Link>
              <Link href="/dashboard/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-emerald-50">
                <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-white flex items-center justify-center"><BarChart3 className="w-3.5 h-3.5 text-emerald-600" /></div>
                <span className="text-sm font-medium text-stone-700 flex-1">Gelir Raporları</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
              </Link>
              <Link href={`/salon/${slug}`} target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-amber-50">
                <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-white flex items-center justify-center"><Star className="w-3.5 h-3.5 text-amber-600" /></div>
                <span className="text-sm font-medium text-stone-700 flex-1">Salon Sayfam</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
              </Link>
            </div>
          </div>

          <div className="bg-[#110608] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-900/30 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-xs text-stone-400 font-medium mb-1">Bu Ay Toplam Gelir</p>
              <p className="text-3xl font-black text-white mb-3">₺{monthRevenue.toLocaleString("tr-TR")}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min((monthRevenue / Math.max(totalRevenue, 1)) * 300, 100)}%` }} />
                </div>
                <Link href="/dashboard/reports" className="text-[10px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-0.5">
                  Rapor <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-[10px] text-stone-600 mt-2">Tüm zamanlar: ₺{totalRevenue.toLocaleString("tr-TR")}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3">Salon Linkiniz</p>
            <SalonLinkCardInline slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SalonLinkCardInline({ slug }: { slug: string }) {
  const [copied, setCopied] = React.useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/salon/${slug}` : `/salon/${slug}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 truncate font-mono">{url}</p>
      <div className="flex gap-2">
        <a href={`/salon/${slug}`} target="_blank" className="flex-1 text-center text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 rounded-lg transition-colors">Görüntüle</a>
        <button onClick={copy} className="flex-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg transition-colors">
          {copied ? "Kopyalandı!" : "Kopyala"}
        </button>
      </div>
    </div>
  );
}
