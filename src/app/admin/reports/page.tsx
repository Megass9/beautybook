import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const supabase = createAdminClient() as any;

  // Get revenue data
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      service:services(price),
      status,
      created_at,
      appointment_date
    `)
    .eq("status", "completed");

  // Calculate revenue stats
  const totalRevenue = appointments?.reduce((sum: number, apt: any) => {
    return sum + (apt.service?.price || 0);
  }, 0) || 0;

  // Get monthly revenue (last 12 months)
  const monthlyRevenue: Array<{ month: string; revenue: number; appointments: number }> = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = date.toISOString().slice(0, 7) + '-01';
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().slice(0, 10);

    const monthAppointments = appointments?.filter((apt: any) => {
      const aptDate = apt.appointment_date || apt.created_at;
      return aptDate >= monthStart && aptDate <= monthEnd;
    }) || [];

    const monthTotal = monthAppointments.reduce((sum: number, apt: any) => {
      return sum + (apt.service?.price || 0);
    }, 0);

    monthlyRevenue.push({
      month: date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
      revenue: monthTotal,
      appointments: monthAppointments.length
    });
  }

  // Get top services
  const serviceStats = new Map();
  appointments?.forEach((apt: any) => {
    if (apt.service) {
      const serviceName = apt.service.name || 'Bilinmeyen';
      const current = serviceStats.get(serviceName) || { count: 0, revenue: 0 };
      serviceStats.set(serviceName, {
        count: current.count + 1,
        revenue: current.revenue + (apt.service.price || 0)
      });
    }
  });

  const topServices = Array.from(serviceStats.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Finansal Raporlar</p>
          <h1 className="text-3xl font-black text-stone-900">Platform Gelir Analizi</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            BeautyBook platformunun gelir durumu ve istatistikleri.
          </p>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-2xl font-black text-stone-900">₺{totalRevenue.toLocaleString("tr-TR")}</p>
              <p className="text-sm text-stone-400">Toplam Gelir</p>
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold">
            {appointments?.length || 0} tamamlanmış randevudan
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <p className="text-2xl font-black text-stone-900">
                ₺{totalRevenue > 0 ? (totalRevenue / (appointments?.length || 1)).toLocaleString("tr-TR") : 0}
              </p>
              <p className="text-sm text-stone-400">Ortalama Randevu</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 font-semibold">
            Hizmet başına ortalama
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <div>
              <p className="text-2xl font-black text-stone-900">
                {monthlyRevenue[11]?.revenue > 0 ? '+' +
                  ((monthlyRevenue[11].revenue - monthlyRevenue[10]?.revenue || 0) /
                   (monthlyRevenue[10]?.revenue || 1) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-stone-400">Bu Ay Değişim</p>
            </div>
          </div>
          <p className="text-xs text-purple-600 font-semibold">
            Geçen aya göre
          </p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-stone-900 mb-6">Aylık Gelir Grafiği</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {monthlyRevenue.map((month, index) => {
            const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
            const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-stone-100 rounded-t-lg relative" style={{ height: '200px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-rose-500 to-rose-600 rounded-t-lg absolute bottom-0 transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-stone-900">
                    ₺{month.revenue.toLocaleString("tr-TR")}
                  </p>
                  <p className="text-xs text-stone-400">{month.month}</p>
                  <p className="text-xs text-stone-500">{month.appointments} randevu</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-stone-900 mb-6">En Çok Tercih Edilen Hizmetler</h2>

        <div className="space-y-4">
          {topServices.map((service, index) => (
            <div key={service.name} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-sm font-bold text-rose-600">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{service.name}</p>
                  <p className="text-sm text-stone-500">{service.count} randevu</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-stone-900">₺{service.revenue.toLocaleString("tr-TR")}</p>
                <p className="text-sm text-stone-500">
                  ₺{(service.revenue / service.count).toLocaleString("tr-TR")} ortalama
                </p>
              </div>
            </div>
          ))}

          {topServices.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className="font-semibold text-stone-600 mb-1">Henüz veri yok</p>
              <p className="text-sm text-stone-400">Tamamlanmış randevular burada görünecek</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}