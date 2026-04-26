import { createAdminClient } from "@/lib/supabase/admin";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Clock,
  MapPin,
  Users,
  Scissors,
  Star,
  Activity,
  Zap,
  CreditCard,
  ShoppingBag,
  Percent,
  Wallet,
  LineChart,
  CircleDollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const supabase = createAdminClient() as any;

  // Tüm tamamlanmış randevuları çek
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      service:services(
        id,
        name,
        price,
        category:service_categories(name)
      ),
      salon:salons(
        id,
        name,
        city,
        slug
      ),
      status,
      created_at,
      appointment_date
    `)
    .eq("status", "completed");

  // Gelir istatistikleri
  const totalRevenue = appointments?.reduce((sum: number, apt: any) => {
    return sum + (apt.service?.price || 0);
  }, 0) || 0;

  const totalAppointments = appointments?.length || 0;
  const averageRevenue = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;

  // Aylık gelir (son 12 ay)
  const monthlyRevenue: Array<{ 
    month: string; 
    revenue: number; 
    appointments: number;
    growth: number;
  }> = [];
  
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
      appointments: monthAppointments.length,
      growth: 0
    });
  }

  // Büyüme yüzdelerini hesapla
  for (let i = 1; i < monthlyRevenue.length; i++) {
    const prevRevenue = monthlyRevenue[i-1].revenue;
    const currentRevenue = monthlyRevenue[i].revenue;
    monthlyRevenue[i].growth = prevRevenue > 0 
      ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 
      : 0;
  }

  // En çok tercih edilen hizmetler
  const serviceStats = new Map();
  appointments?.forEach((apt: any) => {
    if (apt.service) {
      const serviceName = apt.service.name || 'Bilinmeyen';
      const current = serviceStats.get(serviceName) || { 
        count: 0, 
        revenue: 0,
        category: apt.service.category?.name || 'Diğer'
      };
      serviceStats.set(serviceName, {
        count: current.count + 1,
        revenue: current.revenue + (apt.service.price || 0),
        category: apt.service.category?.name || current.category
      });
    }
  });

  const topServices = Array.from(serviceStats.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Salon bazlı gelir
  const salonStats = new Map();
  appointments?.forEach((apt: any) => {
    if (apt.salon) {
      const salonName = apt.salon.name;
      const current = salonStats.get(salonName) || { 
        count: 0, 
        revenue: 0,
        city: apt.salon.city,
        slug: apt.salon.slug
      };
      salonStats.set(salonName, {
        count: current.count + 1,
        revenue: current.revenue + (apt.service?.price || 0),
        city: apt.salon.city,
        slug: apt.salon.slug
      });
    }
  });

  const topSalons = Array.from(salonStats.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Kategori bazlı gelir
  const categoryStats = new Map();
  appointments?.forEach((apt: any) => {
    if (apt.service?.category?.name) {
      const categoryName = apt.service.category.name;
      const current = categoryStats.get(categoryName) || { 
        count: 0, 
        revenue: 0 
      };
      categoryStats.set(categoryName, {
        count: current.count + 1,
        revenue: current.revenue + (apt.service.price || 0)
      });
    }
  });

  const categoryBreakdown = Array.from(categoryStats.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue);

  // Sezonluk trendler
  const seasonalTrends: Record<string, { revenue: number; appointments: number }> = {
    'Kış': { revenue: 0, appointments: 0 },
    'İlkbahar': { revenue: 0, appointments: 0 },
    'Yaz': { revenue: 0, appointments: 0 },
    'Sonbahar': { revenue: 0, appointments: 0 }
  };

  appointments?.forEach((apt: any) => {
    const date = new Date(apt.appointment_date || apt.created_at);
    const month = date.getMonth();
    let season: 'Kış' | 'İlkbahar' | 'Yaz' | 'Sonbahar';
    if (month >= 2 && month <= 4) season = 'İlkbahar';
    else if (month >= 5 && month <= 7) season = 'Yaz';
    else if (month >= 8 && month <= 10) season = 'Sonbahar';
    else season = 'Kış';

    seasonalTrends[season].revenue += (apt.service?.price || 0);
    seasonalTrends[season].appointments += 1;
  });

  // En yoğun saatler
  const hourlyStats = new Array(24).fill(0).map(() => ({ appointments: 0, revenue: 0 }));
  appointments?.forEach((apt: any) => {
    const date = new Date(apt.appointment_date || apt.created_at);
    const hour = date.getHours();
    hourlyStats[hour].appointments += 1;
    hourlyStats[hour].revenue += (apt.service?.price || 0);
  });

  // Yıllık büyüme
  const yearlyGrowth = monthlyRevenue.length >= 12 
    ? ((monthlyRevenue[11].revenue - monthlyRevenue[0].revenue) / (monthlyRevenue[0].revenue || 1)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.3em]">Finansal Raporlar</p>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Platform Gelir Analizi</h1>
            </div>
          </div>
          <p className="text-stone-500 text-sm max-w-3xl">
            BeautyBook platformunun gelir durumu, büyüme trendleri ve detaylı istatistikleri.
          </p>
        </div>

        {/* Ana İstatistik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-stone-900">₺{totalRevenue.toLocaleString("tr-TR")}</p>
            <p className="text-sm font-semibold text-stone-600 mt-1">Toplam Gelir</p>
            <p className="text-xs text-stone-400 mt-2">{totalAppointments} tamamlanmış randevu</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-stone-900">{totalAppointments.toLocaleString("tr-TR")}</p>
            <p className="text-sm font-semibold text-stone-600 mt-1">Toplam Randevu</p>
            <p className="text-xs text-stone-400 mt-2">Platform geneli</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CircleDollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-stone-900">₺{averageRevenue.toLocaleString("tr-TR")}</p>
            <p className="text-sm font-semibold text-stone-600 mt-1">Ortalama Randevu</p>
            <p className="text-xs text-stone-400 mt-2">Hizmet başına ortalama</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-amber-600" />
              </div>
              {yearlyGrowth >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-black text-stone-900">
              {yearlyGrowth > 0 ? '+' : ''}{yearlyGrowth.toFixed(1)}%
            </p>
            <p className="text-sm font-semibold text-stone-600 mt-1">Yıllık Büyüme</p>
            <p className="text-xs text-stone-400 mt-2">Son 12 ay performansı</p>
          </div>
        </div>

        {/* Aylık Gelir Grafiği */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-stone-900">Aylık Gelir Trendi</h2>
              <p className="text-xs text-stone-500 mt-1">Son 12 aylık performans</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-rose-500 rounded-full" />
                <span className="text-xs text-stone-600">Gelir</span>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-xs text-stone-600">Randevu</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 flex items-end justify-between gap-2">
            {monthlyRevenue.map((month, index) => {
              const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
              const maxAppointments = Math.max(...monthlyRevenue.map(m => m.appointments));
              const revenueHeight = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
              const appointmentHeight = maxAppointments > 0 ? (month.appointments / maxAppointments) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full" style={{ height: '200px' }}>
                    {/* Randevu Barı */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-100 rounded-t-lg transition-all duration-500"
                      style={{ height: `${appointmentHeight}%` }}
                    />
                    {/* Gelir Barı */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-500 to-rose-600 rounded-t-lg transition-all duration-500 opacity-90"
                      style={{ height: `${revenueHeight}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-stone-800">₺{month.revenue.toLocaleString("tr-TR")}</p>
                    <p className="text-[10px] text-stone-400 mt-1">{month.month}</p>
                    <p className="text-[9px] text-stone-400">{month.appointments} rndv</p>
                    {month.growth !== 0 && (
                      <div className={`flex items-center justify-center gap-0.5 mt-1 text-[9px] font-bold ${month.growth > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {month.growth > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {Math.abs(month.growth).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* İkincil İstatistikler Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* En Çok Tercih Edilen Hizmetler */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900">Popüler Hizmetler</h2>
                <p className="text-xs text-stone-500">En çok tercih edilenler</p>
              </div>
            </div>

            <div className="space-y-3">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-stone-200 text-stone-600' :
                      index === 2 ? 'bg-amber-50 text-amber-600' :
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-stone-800 text-sm">{service.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-stone-500">{service.category}</span>
                        <span className="text-[10px] text-stone-300">•</span>
                        <span className="text-[10px] font-semibold text-stone-500">{service.count} randevu</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-800 text-sm">₺{service.revenue.toLocaleString("tr-TR")}</p>
                    <p className="text-[10px] text-stone-500">₺{(service.revenue / service.count).toLocaleString("tr-TR")}/ort</p>
                  </div>
                </div>
              ))}

              {topServices.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Scissors className="w-8 h-8 text-stone-400" />
                  </div>
                  <p className="font-semibold text-stone-600 mb-1">Henüz veri yok</p>
                  <p className="text-xs text-stone-400">Tamamlanmış randevular burada görünecek</p>
                </div>
              )}
            </div>
          </div>

          {/* En Başarılı Salonlar */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900">Başarılı Salonlar</h2>
                <p className="text-xs text-stone-500">En yüksek gelir elde edenler</p>
              </div>
            </div>

            <div className="space-y-3">
              {topSalons.map((salon, index) => (
                <div key={salon.name} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-stone-200 text-stone-600' :
                      index === 2 ? 'bg-amber-50 text-amber-600' :
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-stone-800 text-sm">{salon.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-stone-400" />
                        <span className="text-[10px] font-semibold text-stone-500">{salon.city || 'Şehir yok'}</span>
                        <span className="text-[10px] text-stone-300">•</span>
                        <span className="text-[10px] font-semibold text-stone-500">{salon.count} randevu</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-800 text-sm">₺{salon.revenue.toLocaleString("tr-TR")}</p>
                    <p className="text-[10px] text-stone-500">₺{(salon.revenue / salon.count).toLocaleString("tr-TR")}/ort</p>
                  </div>
                </div>
              ))}

              {topSalons.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-stone-400" />
                  </div>
                  <p className="font-semibold text-stone-600 mb-1">Henüz veri yok</p>
                  <p className="text-xs text-stone-400">Tamamlanmış randevular burada görünecek</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detaylı Analiz Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kategori Dağılımı */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900">Kategori Dağılımı</h2>
                <p className="text-xs text-stone-500">Gelir kategorileri</p>
              </div>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.map((category, index) => {
                const percentage = (category.revenue / totalRevenue) * 100;
                return (
                  <div key={category.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-stone-700">{category.name}</span>
                      <span className="font-bold text-stone-800">₺{category.revenue.toLocaleString("tr-TR")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-stone-500 min-w-[45px]">{percentage.toFixed(1)}%</span>
                    </div>
                    <p className="text-[9px] text-stone-400 mt-1">{category.count} randevu</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sezonluk Trendler */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900">Sezonluk Trendler</h2>
                <p className="text-xs text-stone-500">Mevsimsel performans</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(seasonalTrends).map(([season, data]) => {
                const percentage = (data.revenue / totalRevenue) * 100;
                const seasonColors: Record<string, string> = {
                  'Kış': 'from-blue-500 to-blue-600',
                  'İlkbahar': 'from-emerald-500 to-emerald-600',
                  'Yaz': 'from-amber-500 to-amber-600',
                  'Sonbahar': 'from-orange-500 to-orange-600'
                };
                return (
                  <div key={season}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-stone-700">{season}</span>
                      <span className="font-bold text-stone-800">₺{data.revenue.toLocaleString("tr-TR")}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${seasonColors[season]} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-stone-500">{percentage.toFixed(1)}%</span>
                    </div>
                    <p className="text-[9px] text-stone-400">{data.appointments} randevu</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yoğun Saatler */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900">Yoğun Saatler</h2>
                <p className="text-xs text-stone-500">Randevu dağılımı</p>
              </div>
            </div>

            <div className="space-y-2">
              {hourlyStats.map((hour, index) => {
                if (hour.appointments === 0) return null;
                const maxAppointments = Math.max(...hourlyStats.map(h => h.appointments));
                const height = (hour.appointments / maxAppointments) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 text-xs font-bold text-stone-600">
                      {index.toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-6 bg-stone-100 rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center px-2 text-[10px] font-bold text-white"
                            style={{ width: `${height}%` }}
                          >
                            {height > 30 && `${hour.appointments} rndv`}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-stone-700">₺{hour.revenue.toLocaleString("tr-TR")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 pt-6 border-t border-stone-200 text-center">
          <p className="text-[10px] text-stone-400 font-mono">
            Son güncelleme: {format(new Date(), "dd MMM yyyy HH:mm", { locale: tr })} • 
            Toplam {totalAppointments} tamamlanmış randevu analiz edildi
          </p>
        </div>
      </div>
    </div>
  );
}