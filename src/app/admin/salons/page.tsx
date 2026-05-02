import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SalonActionButtons from "../dashboard/SalonActionButtons";
import {
  Building2,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Hash,
  Calendar,
  ShieldAlert,
  Users,
  Scissors,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  User,
  Globe,
  Star,
  BarChart3,
  Activity,
  Zap,
  Shield,
  MoreVertical,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import AdminSalonsFilters from "./AdminSalonsFilters";

export const dynamic = "force-dynamic";

export default async function AdminSalonsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabaseServer = createServerClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  // Admin kontrolü
  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  const params = searchParams;
  const sort = (params?.sort as string) || "created_desc";
  const filter = (params?.filter as string) || "all";
  const searchRaw = (params?.search as string) || "";
  const search = searchRaw.toLocaleLowerCase("tr-TR");

  const supabase = createAdminClient();

  const { data: allSalons, error: fetchError } = await supabase
    .from("salons")
    .select("*, subscriptions(*), services(count), staff(count), appointments(count)")
    .order("created_at", { ascending: false });

  // İşlem Mantığı: Filtreleme
  let processedSalons = (allSalons || []).filter((salon: any) => {
    const activeSub = salon.subscriptions?.find((s: any) => s.status === "active");
    const trialEndDate = new Date(salon.created_at);
    trialEndDate.setDate(trialEndDate.getDate() + 14);
    const isTrial = new Date() < trialEndDate && !activeSub;
    const isExpired = !activeSub && !isTrial;

    if (search && 
        !salon.name.toLocaleLowerCase("tr-TR").includes(search) && 
        !salon.slug.toLocaleLowerCase("tr-TR").includes(search) && 
        !salon.city?.toLocaleLowerCase("tr-TR").includes(search)) {
      return false;
    }

    if (filter === "active" && !activeSub) return false;
    if (filter === "trial" && !isTrial) return false;
    if (filter === "expired" && !isExpired) return false;
    if (filter === "restricted" && salon.is_active) return false;

    return true;
  });

  // İşlem Mantığı: Sıralama
  processedSalons.sort((a: any, b: any) => {
    const getEndDate = (salon: any) => {
      const activeSub = salon.subscriptions?.find((s: any) => s.status === "active");
      if (activeSub?.end_date) return new Date(activeSub.end_date).getTime();
      const trialEndDate = new Date(salon.created_at);
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      return trialEndDate.getTime();
    };

    if (sort === "created_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sort === "created_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === "end_asc") return getEndDate(a) - getEndDate(b);
    if (sort === "end_desc") return getEndDate(b) - getEndDate(a);
    return 0;
  });

  // İstatistikler
  const stats = {
    total: processedSalons.length,
    active: processedSalons.filter((s: any) => s.subscriptions?.some((sub: any) => sub.status === "active")).length,
    trial: processedSalons.filter((s: any) => {
      const trialEndDate = new Date(s.created_at);
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      return new Date() < trialEndDate && !s.subscriptions?.some((sub: any) => sub.status === "active");
    }).length,
    expired: processedSalons.filter((s: any) => {
      const trialEndDate = new Date(s.created_at);
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      return new Date() >= trialEndDate && !s.subscriptions?.some((sub: any) => sub.status === "active");
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-[0.3em]">Sistem Yönetimi</p>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Salon Yönetim Paneli</h1>
            </div>
          </div>
          <p className="text-stone-500 text-sm max-w-3xl">
            Sistemdeki tüm kayıtlı işletmeleri görüntüleyin, aktiflik durumlarını yönetin ve abonelik sürelerine müdahale edin.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Building2 className="w-5 h-5 text-stone-400" />
              <span className="text-2xl font-black text-stone-900">{stats.total}</span>
            </div>
            <p className="text-sm font-semibold text-stone-700">Toplam Salon</p>
            <p className="text-xs text-stone-400 mt-1">Sistemdeki tüm salonlar</p>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl font-black text-emerald-600">{stats.active}</span>
            </div>
            <p className="text-sm font-semibold text-emerald-900">Aktif Abonelik</p>
            <p className="text-xs text-emerald-600 mt-1">Aktif üyelik sahibi salonlar</p>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-black text-blue-600">{stats.trial}</span>
            </div>
            <p className="text-sm font-semibold text-blue-900">Deneme Süresi</p>
            <p className="text-xs text-blue-600 mt-1">14 günlük deneme süresinde</p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-black text-amber-600">{stats.expired}</span>
            </div>
            <p className="text-sm font-semibold text-amber-900">Süresi Dolmuş</p>
            <p className="text-xs text-amber-600 mt-1">Aboneliği sona ermiş salonlar</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <AdminSalonsFilters />
        </div>

        {/* Salons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {processedSalons.map((salon: any) => {
            // Abonelik Mantığı
            const activeSub = salon.subscriptions
              ?.filter((s: any) => s.status === "active")
              .sort((a: any, b: any) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0] || null;
            const trialEndDate = new Date(salon.created_at);
            trialEndDate.setDate(trialEndDate.getDate() + 14);
            const isTrial = new Date() < trialEndDate && !activeSub;
            const isExpired = !activeSub && !isTrial;
            const isManuallyRestricted = !salon.is_active;

            // Gün sayısı hesaplama
            const daysLeft = () => {
              if (activeSub?.end_date) {
                const diff = new Date(activeSub.end_date).getTime() - new Date().getTime();
                return Math.ceil(diff / (1000 * 60 * 60 * 24));
              } else if (isTrial) {
                const diff = trialEndDate.getTime() - new Date().getTime();
                return Math.ceil(diff / (1000 * 60 * 60 * 24));
              }
              return 0;
            };

            const getStatusConfig = () => {
              if (activeSub) {
                const days = daysLeft();
                if (days <= 7) {
                  return {
                    label: `${days} GÜN KALDI`,
                    color: "bg-amber-500",
                    icon: AlertCircle,
                    textColor: "text-amber-600",
                  };
                }
                return {
                  label: (activeSub.plan_name || activeSub.plan_type || "AKTİF").toUpperCase(),
                  color: "bg-emerald-500",
                  icon: CheckCircle,
                  textColor: "text-emerald-600",
                };
              } else if (isTrial) {
                const days = daysLeft();
                return {
                  label: `DENEME • ${days} GÜN`,
                  color: "bg-blue-500",
                  icon: Zap,
                  textColor: "text-blue-600",
                };
              } else {
                return {
                  label: "SÜRESİ DOLDU",
                  color: "bg-stone-400",
                  icon: XCircle,
                  textColor: "text-stone-600",
                };
              }
            };

            const statusConfig = getStatusConfig();
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={salon.id}
                className={`group bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 ${
                  salon.is_active ? 'border-stone-200' : 'border-red-100 bg-red-50/20'
                }`}
              >
                {/* Header Banner */}
                <div className={`h-1.5 w-full ${statusConfig.color} opacity-80`} />
                
                <div className="p-7">
                  {/* Üst Kısım - Logo ve Statü */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <Building2 className="w-7 h-7 text-stone-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-stone-900 tracking-tight leading-none mb-1">{salon.name}</h3>
                        <p className="text-xs font-mono text-stone-400">@{salon.slug}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className={`px-3 py-1.5 rounded-xl ${statusConfig.color} shadow-sm flex items-center gap-2 border border-white/20`}>
                        <StatusIcon className="w-3 h-3 text-white" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">
                          {statusConfig.label}
                        </span>
                      </div>
                      {isManuallyRestricted && !activeSub && !isTrial && (
                        <div className="px-2 py-1 bg-red-500 rounded-lg flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-white" />
                          <span className="text-[8px] font-black text-white uppercase">Kısıtlanmış</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ana Bilgiler */}
                  <div className="space-y-4 mb-6">
                    {/* İletişim Bilgileri */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-2 text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-300" />
                        <span className="text-xs font-bold uppercase tracking-tight">{salon.city || 'Belirtilmedi'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-500">
                        <Phone className="w-3.5 h-3.5 text-stone-300" />
                        <span className="text-xs font-bold">{salon.phone || '—'}</span>
                      </div>
                    </div>

                    {/* İstatistikler */}
                    <div className="bg-stone-50/80 backdrop-blur-sm border border-stone-100 rounded-3xl p-5">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <p className="text-xl font-black text-stone-900 mb-0.5">{salon.staff?.[0]?.count || 0}</p>
                          <div className="flex items-center justify-center gap-1">
                            <Users className="w-3 h-3 text-rose-400" />
                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Uzman</p>
                          </div>
                        </div>
                        <div className="text-center border-x border-stone-200/60 px-2">
                          <p className="text-xl font-black text-stone-900 mb-0.5">{salon.services?.[0]?.count || 0}</p>
                          <div className="flex items-center justify-center gap-1">
                            <Scissors className="w-3 h-3 text-rose-400" />
                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Hizmet</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-black text-stone-900 mb-0.5">{salon.appointments?.[0]?.count || 0}</p>
                          <div className="flex items-center justify-center gap-1">
                            <CalendarDays className="w-3 h-3 text-rose-400" />
                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Randevu</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Abonelik Detayı */}
                    <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-stone-300" />
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Abonelik</span>
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.color}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-stone-400">Bitiş</span>
                          <span className="text-xs font-black text-stone-800">
                            {activeSub?.end_date 
                              ? format(new Date(activeSub.end_date), "d MMM yyyy", { locale: tr })
                              : isTrial
                              ? format(trialEndDate, "d MMM yyyy", { locale: tr })
                              : "—"}
                          </span>
                        </div>
                        {activeSub && (
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-stone-400">Paket</span>
                            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                              {activeSub.plan_name || activeSub.plan_type || "Standart"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <SalonActionButtons salonId={salon.id} isActive={salon.is_active} />
                    </div>
                    <a
                      href={`/salon/${salon.slug}`}
                      target="_blank"
                      className="w-10 h-10 bg-stone-50 hover:bg-rose-50 border border-stone-100 hover:border-rose-100 rounded-xl flex items-center justify-center transition-all group"
                      title="Siteyi Görüntüle"
                    >
                      <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-rose-500" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {processedSalons.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-2xl mb-4">
              <Building2 className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-lg font-bold text-stone-700 mb-2">Salon Bulunamadı</h3>
            <p className="text-sm text-stone-500">Filtrelerinizi değiştirerek tekrar deneyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}