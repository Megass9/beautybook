import React from "react";
import { createServerClient } from "@/lib/supabase/server";
import { Calendar, Users, TrendingUp, ArrowUpRight, Plus, Scissors, ChevronRight, Star, BarChart3, Bell } from "lucide-react";
import Link from "next/link";
import { format, subDays, startOfMonth } from "date-fns";
import { tr } from "date-fns/locale";
import SalonLinkCard from "./SalonLinkCard";

type AptRow = {
  id: string;
  status: string;
  start_time: string;
  end_time?: string;
  appointment_date: string;
  customer: { name: string } | null;
  service: { name: string; price: number } | null;
  staff: { name: string } | null;
};

type PriceRow = {
  service: { price: number } | null;
};

type SalonRow = {
  id: string;
  name: string;
  slug: string;
};

export default async function DashboardPage() {
  const supabase = createServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: salon } = await supabase
    .from("salons")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .single();

  if (!salon) return null;

  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");

  const [
    { data: todayApts },
    { data: yesterdayApts },
    { data: totalCustomers },
    { data: newCustomersThisMonth },
    { data: allCompletedApts },
    { data: monthApts },
    { data: pendingApts },
  ] = await Promise.all([
    supabase.from("appointments")
      .select("*, customer:customers(*), service:services(*), staff:staff(*)")
      .eq("salon_id", salon.id).eq("appointment_date", today).order("start_time")
      ,
    supabase.from("appointments")
      .select("service:services(price)")
      .eq("salon_id", salon.id).eq("appointment_date", yesterday).eq("status", "completed")
      ,
    supabase.from("customers").select("id", { count: "exact" }).eq("salon_id", salon.id),
    supabase.from("customers").select("id", { count: "exact" }).eq("salon_id", salon.id).gte("created_at", monthStart),
    supabase.from("appointments")
      .select("service:services(price)").eq("salon_id", salon.id).eq("status", "completed")
      ,
    supabase.from("appointments")
      .select("service:services(price)").eq("salon_id", salon.id)
      .eq("status", "completed").gte("appointment_date", monthStart)
      ,
    supabase.from("appointments")
      .select("*, customer:customers(*), service:services(*), staff:staff(*)")
      .eq("salon_id", salon.id).eq("status", "pending").order("appointment_date").limit(5)
      ,
  ]);

  const totalRevenue = allCompletedApts?.reduce((sum: number, apt: any) => sum + (apt.service?.price || 0), 0) || 0;
  const monthRevenue = monthApts?.reduce((sum: number, apt: any) => sum + (apt.service?.price || 0), 0) || 0;
  const yesterdayRevenue = yesterdayApts?.reduce((sum: number, apt: any) => sum + (apt.service?.price || 0), 0) || 0;

  const confirmedToday = todayApts?.filter((a: any) => a.status === "confirmed").length || 0;
  const pendingToday   = todayApts?.filter((a: any) => a.status === "pending").length   || 0;
  const completedToday = todayApts?.filter((a: any) => a.status === "completed").length || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    pending:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",  label: "Beklemede"  },
    confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500",label: "Onaylı"     },
    cancelled: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400",    label: "İptal"      },
    completed: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",   label: "Tamamlandı" },
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── GREETING HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-stone-400 font-medium">
            {format(new Date(), "d MMMM yyyy, EEEE", { locale: tr })}
          </p>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
            {greeting}, {salon.name.split(" ")[0]} 👋
          </h1>
        </div>
        <Link
          href="/dashboard/appointments?new=1"
          className="self-start sm:self-auto flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-rose-200"
        >
          <Plus className="w-4 h-4" />
          Yeni Randevu
        </Link>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Bugünkü Randevu",
            value: todayApts?.length || 0,
            sub: `${confirmedToday} onaylı, ${pendingToday} beklemede`,
            iconEl: <Calendar className="w-5 h-5 text-rose-600" />,
            iconBg: "bg-rose-50",
            change: `Dün: ${yesterdayApts?.length ?? 0}`,
            changeUp: (todayApts?.length || 0) >= (yesterdayApts?.length || 0),
            href: "/dashboard/appointments",
          },
          {
            label: "Bu Ay Gelir",
            value: `₺${monthRevenue.toLocaleString("tr-TR")}`,
            sub: `Toplam: ₺${totalRevenue.toLocaleString("tr-TR")}`,
            iconEl: <TrendingUp className="w-5 h-5 text-emerald-600" />,
            iconBg: "bg-emerald-50",
            change: yesterdayRevenue > 0 ? `Dün: ₺${yesterdayRevenue}` : null,
            changeUp: true,
            href: "/dashboard/reports",
          },
          {
            label: "Toplam Müşteri",
            value: totalCustomers?.length || 0,
            sub: `Bu ay +${newCustomersThisMonth?.length || 0} yeni`,
            iconEl: <Users className="w-5 h-5 text-blue-600" />,
            iconBg: "bg-blue-50",
            change: `+${newCustomersThisMonth?.length || 0} bu ay`,
            changeUp: true,
            href: "/dashboard/customers",
          },
          {
            label: "Bekleyen Onay",
            value: pendingApts?.length || 0,
            sub: pendingApts?.length ? "Onay bekliyor" : "Tüm randevular onaylı",
            iconEl: <Bell className={`w-5 h-5 ${pendingApts?.length ? "text-amber-600" : "text-stone-400"}`} />,
            iconBg: pendingApts?.length ? "bg-amber-50" : "bg-stone-50",
            change: null,
            changeUp: false,
            href: "/dashboard/appointments",
          },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                {stat.iconEl}
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
            </div>
            <p className="text-2xl font-black text-stone-900 mb-1">{stat.value}</p>
            <p className="text-xs text-stone-400 leading-snug">{stat.sub}</p>
            {stat.change && (
              <div className={`mt-2 text-[10px] font-semibold flex items-center gap-0.5 ${stat.changeUp ? "text-emerald-600" : "text-stone-400"}`}>
                {stat.changeUp && <ArrowUpRight className="w-3 h-3" />}
                {stat.change}
              </div>
            )}
          </Link>
        ))}
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
                <p className="text-[10px] text-stone-400">{todayApts?.length || 0} randevu</p>
              </div>
            </div>
            <Link
              href="/dashboard/appointments"
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all"
            >
              Tümü <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {(todayApts?.length || 0) > 0 && (
            <div className="px-6 py-3 border-b border-stone-50 flex items-center gap-3">
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(confirmedToday / (todayApts?.length || 1)) * 100}%` }} />
                <div className="h-full bg-amber-400 transition-all"  style={{ width: `${(pendingToday   / (todayApts?.length || 1)) * 100}%` }} />
                <div className="h-full bg-blue-500 transition-all"   style={{ width: `${(completedToday / (todayApts?.length || 1)) * 100}%` }} />
              </div>
              <div className="flex items-center gap-3 text-[10px] shrink-0">
                <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 bg-emerald-500 rounded-full" />{confirmedToday} onaylı</span>
                {pendingToday   > 0 && <span className="flex items-center gap-1 text-amber-600"><span className="w-2 h-2 bg-amber-400 rounded-full"  />{pendingToday} bekliyor</span>}
                {completedToday > 0 && <span className="flex items-center gap-1 text-blue-600"><span className="w-2 h-2 bg-blue-500 rounded-full"   />{completedToday} tamamlandı</span>}
              </div>
            </div>
          )}

          {!todayApts?.length ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-stone-400" />
              </div>
              <p className="font-semibold text-stone-600 mb-1">Bugün randevu yok</p>
              <p className="text-sm text-stone-400 mb-5">Yeni randevu eklemek için butona tıklayın</p>
              <Link
                href="/dashboard/appointments?new=1"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-rose-200"
              >
                <Plus className="w-4 h-4" /> Randevu Ekle
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {todayApts.map((apt: any) => {
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
                    {apt.service?.price && (
                      <p className="text-sm font-black text-rose-600 shrink-0">₺{apt.service.price}</p>
                    )}
                    <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text} shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">

          {(pendingApts?.length || 0) > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-800">Onay Bekleyen</span>
                  <span className="bg-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingApts?.length}
                  </span>
                </div>
                <Link href="/dashboard/appointments" className="text-xs text-amber-700 font-semibold hover:underline">
                  Tümü →
                </Link>
              </div>
              <div className="p-3 space-y-2">
                {pendingApts?.slice(0, 3).map((apt: any) => (
                  <div key={apt.id} className="bg-white rounded-xl p-3 border border-amber-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-xs font-black shrink-0">
                      {apt.customer?.name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-800 truncate">{apt.customer?.name}</p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {format(new Date(apt.appointment_date), "d MMM", { locale: tr })} · {apt.start_time?.slice(0, 5)}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/appointments"
                      className="shrink-0 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      Gör
                    </Link>
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
              {([
                { label: "Yeni Randevu Oluştur", href: "/dashboard/appointments?new=1", colorCls: "text-rose-600",    bgCls: "hover:bg-rose-50",    iconEl: <Plus     className="w-3.5 h-3.5 text-rose-600"    /> },
                { label: "Müşterileri Görüntüle", href: "/dashboard/customers",         colorCls: "text-blue-600",    bgCls: "hover:bg-blue-50",    iconEl: <Users    className="w-3.5 h-3.5 text-blue-600"    /> },
                { label: "Hizmetleri Düzenle",    href: "/dashboard/services",          colorCls: "text-purple-600",  bgCls: "hover:bg-purple-50",  iconEl: <Scissors className="w-3.5 h-3.5 text-purple-600"  /> },
                { label: "Gelir Raporları",        href: "/dashboard/reports",           colorCls: "text-emerald-600", bgCls: "hover:bg-emerald-50", iconEl: <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> },
                { label: "Salon Sayfam",           href: `/salon/${salon.slug}`,         colorCls: "text-amber-600",   bgCls: "hover:bg-amber-50",   iconEl: <Star     className="w-3.5 h-3.5 text-amber-600"   />, external: true },
              ] as { label: string; href: string; colorCls: string; bgCls: string; iconEl: React.ReactNode; external?: boolean }[]).map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${item.bgCls}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-white flex items-center justify-center transition-colors">
                    {item.iconEl}
                  </div>
                  <span className="text-sm font-medium text-stone-700 flex-1">{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#110608] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-900/30 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-xs text-stone-400 font-medium mb-1">Bu Ay Toplam Gelir</p>
              <p className="text-3xl font-black text-white mb-3">₺{monthRevenue.toLocaleString("tr-TR")}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${Math.min((monthRevenue / Math.max(totalRevenue, 1)) * 300, 100)}%` }}
                  />
                </div>
                <Link href="/dashboard/reports" className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-0.5">
                  Rapor <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-[10px] text-stone-600 mt-2">Tüm zamanlar: ₺{totalRevenue.toLocaleString("tr-TR")}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3">Salon Linkiniz</p>
            <SalonLinkCard slug={salon.slug} />
          </div>

        </div>
      </div>
    </div>
  );
}
