import { createAdminClient } from "@/lib/supabase/admin";
import SalonActionButtons from "./SalonActionButtons";
import { format, addDays } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Building2,
  Users,
  Calendar,
  Bell,
  Activity,
  CheckCircle,
  Clock,
  ArrowUpRight,
  CreditCard,
  TrendingUp,
  Ticket
} from "lucide-react";

export const dynamic = "force-dynamic";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass,
  trend
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  iconColorClass: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${iconColorClass} rounded-xl flex items-center justify-center text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
      </div>
      <p className="text-2xl font-black text-stone-900 mb-1">{value}</p>
      <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">{title}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[10px] text-stone-500 font-medium">{subtitle}</p>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>
        )}
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient() as any;

  // Get system statistics
  const { data: salons } = await supabase
    .from("salons")
    .select("id, name, is_active, created_at");

  const { data: users } = await supabase
    .from("salons")
    .select("owner_id");

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, status, created_at");

  const { data: subscriptionsData } = await supabase
    .from("subscriptions")
    .select("id, status, amount, end_date, created_at");

  const { data: supportTicketsData } = await supabase
    .from("support_tickets")
    .select("id, status");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, created_at");

  // Calculate stats
  const totalSalons = salons?.length || 0;
  const activeSalons = salons?.filter((s: any) => s.is_active).length || 0;
  const totalUsers = new Set(users?.map((u: any) => u.owner_id)).size || 0;
  const totalAppointments = appointments?.length || 0;
  const completedAppointments = appointments?.filter((a: any) => a.status === 'completed').length || 0;
  const totalNotifications = notifications?.length || 0;

  const today = new Date();
  const thirtyDaysAgo = addDays(today, -30);
  const thirtyDaysFromNow = addDays(today, 30);

  const newSalonsLast30Days = salons?.filter((s: any) => new Date(s.created_at) >= thirtyDaysAgo).length || 0;

  const expiringSubscriptionsNext30Days = subscriptionsData?.filter((s: any) =>
    s.status === 'active' &&
    s.end_date &&
    new Date(s.end_date) > today &&
    new Date(s.end_date) <= thirtyDaysFromNow
  ).length || 0;
  const openSupportTickets = supportTicketsData?.filter((t: any) => t.status === 'open').length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Admin Dashboard</p>
          <h1 className="text-3xl font-black text-stone-900">Platform Genel Bakış</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            BeautyBook platformunun genel istatistikleri, performans metrikleri ve sistem durumu.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Salon"
          value={totalSalons}
          subtitle={`${activeSalons} aktif salon`}
          icon={Building2}
          iconColorClass="bg-rose-500"
          trend={`${Math.round((activeSalons / Math.max(totalSalons, 1)) * 100)}% aktif`}
        />

        <StatCard
          title="Kullanıcı"
          value={totalUsers}
          subtitle="Toplam salon sahibi"
          icon={Users}
          iconColorClass="bg-blue-500"
        />

        <StatCard
          title="Randevu"
          value={totalAppointments}
          subtitle={`${completedAppointments} tamamlandı`}
          icon={Calendar}
          iconColorClass="bg-emerald-500"
          trend={`${Math.round((completedAppointments / Math.max(totalAppointments, 1)) * 100)}% başarı`}
        />

        <StatCard
          title="Bildirim"
          value={totalNotifications}
          subtitle="Gönderilen toplam bildirim"
          icon={Bell}
          iconColorClass="bg-amber-500"
        />
      </div>

      {/* Quick Overview / Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Yeni Salon (30 Gün)"
          value={newSalonsLast30Days}
          subtitle="Son 30 günde kayıt olan"
          icon={Building2}
          iconColorClass="bg-purple-500"
        />
        <StatCard
          title="Abonelik Bitiyor"
          value={expiringSubscriptionsNext30Days}
          subtitle="Önümüzdeki 30 günde"
          icon={Clock}
          iconColorClass="bg-orange-500"
        />
        <StatCard
          title="Açık Destek Talebi"
          value={openSupportTickets}
          subtitle="Yanıt bekleyen talepler"
          icon={Ticket}
          iconColorClass="bg-red-500"
        />
      </div>

      {/* Recent Activity & Platform Status */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Salons */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-4 h-4 text-stone-600" />
              </div>
              <h2 className="text-sm font-bold text-stone-900">Son Eklenen Salonlar</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {salons?.slice(0, 5).map((salon: any) => (
                <div key={salon.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{salon.name}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                        {format(new Date(salon.created_at), "d MMM yyyy", { locale: tr })}
                      </p>
                    </div>
                  </div>
                  <SalonActionButtons 
                    salonId={salon.id} 
                    isActive={salon.is_active} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Status */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-50 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 text-stone-600" />
              </div>
              <h2 className="text-sm font-bold text-stone-900">Platform Durumu</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                    <Building2 className="w-4 h-4 text-rose-600" />
                  </div>
                  <span className="text-sm font-bold text-stone-700">Aktif Salon Oranı</span>
                </div>
                <span className="text-xl font-black text-rose-600">
                  {totalSalons > 0 ? Math.round((activeSalons / totalSalons) * 100) : 0}%
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-bold text-stone-700">Randevu Tamamlanma</span>
                </div>
                <span className="text-xl font-black text-emerald-600">
                  {totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-stone-700">Ortalama Salon Başına</span>
                </div>
                <span className="text-xl font-black text-blue-600">
                  {totalUsers > 0 ? (totalSalons / totalUsers).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}