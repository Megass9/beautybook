import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format, isToday, isFuture, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, Calendar } from "lucide-react";

type Customer = {
  name: string;
};

type Service = {
  name: string;
  duration_minutes: number;
};

type Appointment = {
  id: string;
  start_time: string;
  customer: Customer | null;
  service: Service | null;
};

type StaffMember = {
  id: string;
  name: string;
};

export const dynamic = "force-dynamic";

export default async function StaffDashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/staff-portal/login");
  }

  const { data: staffMemberData } = await supabase
    .from("staff")
    .select("id, name")
    .eq("auth_user_id", user.id)
    .single();

  const staffMember = staffMemberData as StaffMember | null;

  if (!staffMember) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-charcoal-900">Erişim Hatası</h1>
        <p className="mt-2 text-charcoal-500">
          Personel hesabınız bulunamadı. Lütfen salon yöneticinizle iletişime
          geçin.
        </p>
      </div>
    );
  }

  const { data: appointmentsData } = await supabase
    .from("appointments")
    .select(
      "*, customer:customers(name), service:services(name, duration_minutes)"
    )
    .eq("staff_id", staffMember.id)
    .in("status", ["confirmed", "pending"])
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  const appointments: Appointment[] = (appointmentsData as Appointment[]) || [];

  const todayAppointments = appointments.filter((apt) =>
    isToday(parseISO(apt.start_time))
  );
  const upcomingAppointments = appointments.filter(
    (apt) => isFuture(parseISO(apt.start_time)) && !isToday(parseISO(apt.start_time))
  );

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-3xl font-bold text-charcoal-900">
        Hoş geldiniz, {staffMember.name}
      </h1>
      <p className="mt-1 text-charcoal-500">İşte güncel randevu takviminiz.</p>

      <div className="mt-8 space-y-8">
        {/* Today's Appointments */}
        <div>
          <h2 className="text-lg font-semibold text-charcoal-800 mb-4">
            Bugünkü Randevular
          </h2>
          {todayAppointments.length > 0 ? (
            <div className="bg-white border border-sand-200 rounded-2xl shadow-sm">
              <ul className="divide-y divide-sand-200">
                {todayAppointments.map((apt) => (
                  <li key={apt.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-rose-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-rose-500">{format(parseISO(apt.start_time), "HH")}</span>
                        <span className="text-2xl font-bold text-rose-600 -mt-1">{format(parseISO(apt.start_time), "mm")}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-charcoal-900 truncate">{apt.customer?.name}</p>
                        <p className="text-sm text-charcoal-500 truncate">{apt.service?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-charcoal-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{apt.service?.duration_minutes} dk</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white border border-sand-200 rounded-2xl p-12 text-center">
              <Calendar className="w-10 h-10 text-sand-300 mx-auto mb-3" />
              <p className="font-medium text-charcoal-600">Bugün için planlanmış randevunuz yok.</p>
              <p className="text-sm text-charcoal-400 mt-1">Gününüzün tadını çıkarın!</p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-lg font-semibold text-charcoal-800 mb-4">
            Yaklaşan Randevular
          </h2>
          {upcomingAppointments.length > 0 ? (
            <div className="bg-white border border-sand-200 rounded-2xl shadow-sm">
              <ul className="divide-y divide-sand-200">
                {upcomingAppointments.map((apt) => (
                  <li key={apt.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-sand-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-sand-500 uppercase">{format(parseISO(apt.start_time), "MMM", { locale: tr })}</span>
                        <span className="text-2xl font-bold text-sand-700 -mt-1">{format(parseISO(apt.start_time), "dd")}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-charcoal-900 truncate">{apt.customer?.name}</p>
                        <p className="text-sm text-charcoal-500 truncate">{apt.service?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-charcoal-500">
                      <Clock className="w-4 h-4" />
                      <span>{format(parseISO(apt.start_time), "HH:mm")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white border border-sand-200 rounded-2xl p-12 text-center">
              <Calendar className="w-10 h-10 text-sand-300 mx-auto mb-3" />
              <p className="font-medium text-charcoal-600">Yaklaşan başka randevunuz bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}