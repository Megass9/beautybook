import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import BookingClient from "./BookingClient";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Scissors, 
  ChevronRight, 
  Check, 
  Instagram, 
  MessageCircle, 
  Award, 
  ShieldCheck,
  Heart,
  Plus
} from "lucide-react";

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

  const [{ data: services }, { data: staff }, { data: hours }, { data: reviews }] = await Promise.all([
    supabase.from("services").select("*").eq("salon_id", salon.id).eq("is_active", true).order("category"),
    supabase.from("staff").select("*").eq("salon_id", salon.id).eq("is_active", true),
    supabase.from("working_hours").select("*").eq("salon_id", salon.id).order("day_of_week"),
    supabase.from("reviews").select("*").eq("salon_id", salon.id).eq("is_verified", true).order("created_at", { ascending: false }).limit(6),
  ]);

  const openHours = hours?.filter(h => !h.is_closed) || [];
  const grouped = groupByCategory(services || []);
  const categories = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-rose-100 selection:text-rose-900">

      {/* ══ HERO ══ */}
      <div className="relative bg-[#0c0a09] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-900/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-950/30 rounded-full blur-[100px] animate-pulse delay-700" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px"}} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10 text-center md:text-left">
            {/* Avatar / Logo */}
            <div className="shrink-0 animate-fade-in-up">
              {salon.logo_url ? (
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-white p-2 border border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden backdrop-blur-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={salon.logo_url}
                    alt={salon.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-rose-600 to-rose-800 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-[0_20px_50px_rgba(225,29,72,0.2)] border border-rose-700/30 animate-bounce-subtle">
                  {salon.name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 animate-fade-in-up delay-200">
              {/* Verified badge */}
              <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black px-4 py-1.5 rounded-full mb-5 uppercase tracking-[0.2em] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Premium Salon
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6 animate-fade-in-up delay-300">
                {salon.name}
              </h1>

              {salon.description && (
                <p className="text-base md:text-lg text-stone-400 mb-8 leading-relaxed max-w-2xl animate-fade-in-up delay-400 font-medium">
                  {salon.description.length > 150 ? salon.description.slice(0, 150) + "..." : salon.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 animate-fade-in-up delay-500">
                {salon.address && (
                  <span className="flex items-center gap-2 text-sm text-stone-300 font-semibold">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    {salon.address}{salon.city ? `, ${salon.city}` : ""}
                  </span>
                )}
                {salon.phone && (
                  <a href={`tel:${salon.phone}`} className="flex items-center gap-2 text-sm text-stone-300 hover:text-rose-500 transition-colors font-semibold">
                    <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                    {salon.phone}
                  </a>
                )}
                {openHours.length > 0 && (
                  <span className="flex items-center gap-2 text-sm text-stone-300 font-semibold">
                    <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                    {String(openHours[0].open_time).slice(0, 5)} – {String(openHours[0].close_time).slice(0, 5)}
                  </span>
                )}
              </div>
            </div>

            {/* CTA button (desktop) */}
            <div className="hidden md:block shrink-0">
              <a href="#randevu" 
                className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white font-black px-8 py-5 rounded-[1.5rem] transition-all shadow-[0_15px_40px_rgba(225,29,72,0.3)] hover:-translate-y-1 text-sm uppercase tracking-widest">
                Randevu Al
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-stone-50"
          style={{clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 100%, 0 0)"}} />
      </div>

      {/* ══ WORKING HOURS STRIP ══ */}
      {openHours.length > 0 && (
        <div className="bg-white border-b border-stone-200 py-6 px-6 overflow-x-auto hide-scroll sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center gap-3 min-w-max">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mr-4 border-r border-stone-200 pr-6">Çalışma Saatleri</span>
            {DAYS_TR.map((day, i) => {
              const h = hours?.find(h => h.day_of_week === i);
              const isToday = new Date().getDay() === i;
              return (
                <div key={day} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-bold transition-all ${
                  h?.is_closed
                    ? "bg-stone-100 text-stone-400"
                    : isToday
                    ? "bg-rose-600 text-white shadow-md shadow-rose-100 scale-105"
                    : "bg-stone-50 text-stone-600 border border-stone-100"
                }`}>
                  <span className="uppercase tracking-wider">{day.slice(0, 3)}</span>
                  {!h?.is_closed && h && (
                    <span className={isToday ? "text-rose-100" : "text-stone-400 font-medium"}>
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

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-24">

        {/* ══ ABOUT ══ */}
        {/* ══ SERVICES ══ */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.3em] mb-3">Kataloğumuz</p>
                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">Özel Hizmetlerimiz</h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-stone-400 text-sm font-bold bg-white border border-stone-200 px-5 py-2.5 rounded-2xl shadow-sm">
                <Scissors className="w-4 h-4" /> {services?.length} Hizmet
              </div>
            </div>

            <div className="space-y-8">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black text-stone-900 uppercase tracking-[0.2em] bg-stone-100 px-5 py-2 rounded-xl">
                      {cat}
                    </span>
                    <div className="flex-1 h-[1px] bg-stone-200" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {grouped[cat].map((s: any) => (
                      <div key={s.id}
                        className="group bg-white rounded-3xl border border-stone-200 p-6 hover:border-rose-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-rose-600 transition-colors duration-500">
                            <Scissors className="w-6 h-6 text-rose-500 group-hover:text-white transition-colors duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-black text-stone-900 text-lg group-hover:text-rose-600 transition-colors duration-300">{s.name}</p>
                              <p className="text-xl font-black text-stone-900 group-hover:text-rose-600 transition-colors duration-300 tabular-nums">₺{s.price}</p>
                            </div>
                            {s.description && (
                              <p className="text-sm text-stone-500 mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-auto">
                               <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                                 <Clock className="w-3.5 h-3.5" />{s.duration_minutes} DK
                               </span>
                               <span className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all">
                                 <Plus className="w-4 h-4" />
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ REVIEWS ══ */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.3em] mb-3">Deneyimler</p>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">Mutlu Müşterilerimiz</h2>
            </div>
            <div className="flex items-center gap-4 bg-white border border-stone-200 px-6 py-4 rounded-3xl shadow-sm">
               <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(reviews?.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                  ))}
               </div>
               <div className="text-lg font-black text-stone-900">{reviews?.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '5.0'} <span className="text-stone-300 text-sm font-bold">/ 5.0</span></div>
            </div>
          </div>
          {reviews && reviews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review: any) => (
                <div key={review.id} className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm relative overflow-hidden group hover:border-rose-200 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award className="w-12 h-12 text-rose-900" />
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-stone-600 text-sm leading-relaxed italic mb-8 font-medium">"{review.comment}"</p>
                  )}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl flex items-center justify-center text-stone-600 text-sm font-black border border-white shadow-inner">
                      {review.customer_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-stone-900 text-sm">{review.customer_name}</p>
                      {review.is_verified && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Doğrulanmış
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
              <Star className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 font-bold mb-2">Henüz yorum bulunmuyor</p>
              <p className="text-stone-400 text-sm">İlk yorumu siz yapın!</p>
            </div>
          )}
        </section>

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
              {staff.map((s: any, index: number) => (
                <div key={s.id} className={`bg-white rounded-2xl border border-stone-200 p-5 text-center hover:border-rose-200 hover:shadow-md transition-all group animate-fade-in-up`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className="relative mb-3">
                    {s.avatar_url ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden mx-auto shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.avatar_url} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-700 rounded-full flex items-center justify-center text-white text-xl font-black mx-auto shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform duration-300">
                        {s.name[0]}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <p className="font-semibold text-stone-900 text-sm group-hover:text-rose-700 transition-colors duration-300">{s.name}</p>
                  {s.title && <p className="text-xs text-stone-400 mt-0.5 group-hover:text-stone-600 transition-colors duration-300">{s.title}</p>}
                  {s.email && <p className="text-xs text-stone-500 mt-1 group-hover:text-stone-700 transition-colors duration-300">{s.email}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ BOOKING ══ */}
        <section id="randevu" className="scroll-mt-24">
          <div className="text-center mb-16">
            <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4">Rezervasyon</p>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter mb-4">Randevunuzu Ayırın</h2>
            <p className="text-stone-500 font-medium max-w-xl mx-auto">Sadece birkaç adımda hayalinizdeki bakıma kavuşun. 7/24 anında onaylı rezervasyon imkanı.</p>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-stone-200/80 shadow-[0_30px_100px_rgba(0,0,0,0.05)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="p-6 md:p-10">
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
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
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
            <div className="flex items-center gap-4">
              {/* Social media links */}
              <a href="#" className="w-8 h-8 bg-stone-100 hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 rounded-lg flex items-center justify-center text-stone-600 hover:text-white transition-all duration-300 group">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-stone-100 hover:bg-blue-600 rounded-lg flex items-center justify-center text-stone-600 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-stone-100 hover:bg-green-600 rounded-lg flex items-center justify-center text-stone-600 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-stone-400">
              <a href="/" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">BeautyBook</a> ile güçlendirilmiştir
            </p>
          </div>
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
