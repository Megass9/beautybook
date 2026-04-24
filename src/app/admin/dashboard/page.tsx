import { createAdminClient } from "@/lib/supabase/admin";
import {
  Building2,
  Users,
  Calendar,
  Bell,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";

export const dynamic = "force-dynamic";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-rose-600" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Toplam Salon"
          value={totalSalons}
          subtitle={`${activeSalons} aktif salon`}
          icon={Building2}
          trend={`${Math.round((activeSalons / Math.max(totalSalons, 1)) * 100)}% aktif`}
        />

        <StatCard
          title="Kullanıcı"
          value={totalUsers}
          subtitle="Salon sahibi"
          icon={Users}
        />

        <StatCard
          title="Randevu"
          value={totalAppointments}
          subtitle={`${completedAppointments} tamamlandı`}
          icon={Calendar}
          trend={`${Math.round((completedAppointments / Math.max(totalAppointments, 1)) * 100)}% başarı`}
        />

        <StatCard
          title="Bildirim"
          value={totalNotifications}
          subtitle="Admin tarafından"
          icon={Bell}
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
                        {new Date(salon.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    salon.is_active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {salon.is_active ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Aktif
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pasif
                      </>
                    )}
                  </div>
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