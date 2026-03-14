import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import BookingClient from "./BookingClient";
import { MapPin, Phone, Clock, Star, Scissors, ChevronRight } from "lucide-react";

const DAYS_TR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Group services by category
function groupByCategory(services: any[]) {
  return services.reduce((acc: Record<string, any[]>, s) => {
    const cat = s.category || "Diğer";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});
}

export default async function SalonPage({ params }: { params: { slug: string } }) {
  const supabase = createPublicClient();

  const { data: salon, error } = await supabase
    .from("salons")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !salon) notFound();

  const [{ data: services }, { data: staff }, { data: hours }] = await Promise.all([
    supabase.from("services").select("*").eq("salon_id", salon.id).eq("is_active", true).order("category"),
    supabase.from("staff").select("*").eq("salon_id", salon.id).eq("is_active", true),
    supabase.from("working_hours").select("*").eq("salon_id", salon.id).order("day_of_week"),
  ]);

  const openHours = hours?.filter(h => !h.is_closed) || [];
  const grouped = groupByCategory(services || []);
  const categories = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-[#faf7f4] font-sans">

      {/* ══ HERO ══ */}
      <div className="relative bg-[#110608] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-rose-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-rose-950/40 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px"}} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            {/* Avatar / Logo */}
            <div className="shrink-0">
              {salon.logo_url ? (
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/5 border border-rose-700/40 shadow-2xl shadow-rose-900/60 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={salon.logo_url}
                    alt={salon.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-rose-600 to-rose-800 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-rose-900/60 border border-rose-700/30">
                  {salon.name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Verified badge */}
              <div className="inline-flex items-center gap-1.5 bg-rose-950/60 border border-rose-800/40 text-rose-300 text-[11px] font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                BeautyBook Onaylı Salon
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">
                {salon.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {salon.address && (
                  <span className="flex items-center gap-1.5 text-sm text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    {salon.address}{salon.city ? `, ${salon.city}` : ""}
                  </span>
                )}
                {salon.phone && (
                  <a href={`tel:${salon.phone}`} className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-300 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    {salon.phone}
                  </a>
                )}
                {openHours.length > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-stone-400">
                    <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    {String(openHours[0].open_time).slice(0, 5)} – {String(openHours[0].close_time).slice(0, 5)}
                  </span>
                )}
              </div>
            </div>

            {/* CTA button (desktop) */}
            <div className="hidden md:block shrink-0">
              <a href="#randevu"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-xl shadow-rose-900/50 text-sm">
                Randevu Al
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#faf7f4]"
          style={{clipPath: "ellipse(55% 100% at 50% 100%)"}} />
      </div>

      {/* ══ WORKING HOURS STRIP ══ */}
      {openHours.length > 0 && (
        <div className="bg-white border-b border-stone-200 py-4 px-6 overflow-x-auto">
          <div className="max-w-4xl mx-auto flex items-center gap-2 min-w-max">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide mr-2">Çalışma Saatleri</span>
            {DAYS_TR.map((day, i) => {
              const h = hours?.find(h => h.day_of_week === i);
              const isToday = new Date().getDay() === i;
              return (
                <div key={day} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  h?.is_closed
                    ? "bg-stone-100 text-stone-400"
                    : isToday
                    ? "bg-rose-600 text-white font-semibold"
                    : "bg-stone-50 border border-stone-200 text-stone-600"
                }`}>
                  <span className="font-medium">{day.slice(0, 3)}</span>
                  {!h?.is_closed && h && (
                    <span className={isToday ? "text-rose-100" : "text-stone-400"}>
                      {String(h.open_time).slice(0, 5)}–{String(h.close_time).slice(0, 5)}
                    </span>
                  )}
                  {h?.is_closed && <span className="text-stone-300">Kapalı</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">

        {/* ══ SERVICES ══ */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">Hizmetlerimiz</h2>
                <p className="text-sm text-stone-400 mt-1">{services?.length} hizmet mevcut</p>
              </div>
              <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center">
                <Scissors className="w-4 h-4 text-rose-600" />
              </div>
            </div>

            <div className="space-y-8">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                      {cat}
                    </span>
                    <div className="flex-1 h-px bg-stone-200" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {grouped[cat].map((s: any) => (
                      <div key={s.id}
                        className="group bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 hover:border-rose-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                        <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                          <Scissors className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-900 text-sm truncate">{s.name}</p>
                          <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />{s.duration_minutes} dakika
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-black text-rose-600">₺{s.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ STAFF ══ */}
        {staff && staff.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">Ekibimiz</h2>
                <p className="text-sm text-stone-400 mt-1">{staff.length} uzman</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {staff.map((s: any) => (
                <div key={s.id} className="bg-white rounded-2xl border border-stone-200 p-5 text-center hover:border-rose-200 hover:shadow-md transition-all group">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-700 rounded-full flex items-center justify-center text-white text-xl font-black mx-auto mb-3 shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform">
                    {s.name[0]}
                  </div>
                  <p className="font-semibold text-stone-900 text-sm">{s.name}</p>
                  {s.role && <p className="text-xs text-stone-400 mt-0.5">{s.role}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ BOOKING ══ */}
        <section id="randevu">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">Randevu Al</h2>
              <p className="text-sm text-stone-400 mt-1">Birkaç adımda hemen rezervasyon yapın</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="bg-[#110608] px-8 py-6">
              <p className="text-white font-bold text-lg">Online Randevu</p>
              <p className="text-stone-400 text-sm mt-0.5">7/24 hızlı rezervasyon</p>
            </div>
            <div className="p-6 md:p-8">
              <BookingClient
                salonId={salon.id}
                services={services || []}
                staffList={staff || []}
                workingHours={hours || []}
              />
            </div>
          </div>
        </section>

      </div>

      {/* ══ FOOTER ══ */}
      <footer className="py-10 px-6 border-t border-stone-200 bg-white mt-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-rose-800 rounded-xl flex items-center justify-center text-white text-sm font-black overflow-hidden">
              {salon.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={salon.logo_url} alt={salon.name} className="w-full h-full object-contain" />
              ) : (
                salon.name[0]
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">{salon.name}</p>
              {salon.city && <p className="text-xs text-stone-400">{salon.city}</p>}
            </div>
          </div>
          <p className="text-xs text-stone-400">
            <a href="/" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">BeautyBook</a> ile güçlendirilmiştir
          </p>
        </div>
      </footer>

      {/* ══ MOBILE STICKY CTA ══ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-stone-200 z-50">
        <a href="#randevu"
          className="flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-rose-200 transition-all">
          Randevu Al
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}