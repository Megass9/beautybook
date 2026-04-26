import React from "react";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
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
import BlogSection from "./BlogSection";
import GallerySection from "./GallerySection";
import CampaignSection from "./CampaignSection";

const DAYS_TR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const DESIGN_COLORS = {
  elegantDark: "#e11d48",
  luxuryGlow: "#7c3aed",
  freshLight: "#0ea5e9",
  minimalCalm: "#16a34a",
} as const;

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return { r: 225, g: 29, b: 72 };
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getDesignVariantByColor(color: string) {
  const normalized = (color || "").toLowerCase();
  if (normalized === DESIGN_COLORS.luxuryGlow) return "luxuryGlow";
  if (normalized === DESIGN_COLORS.freshLight) return "freshLight";
  if (normalized === DESIGN_COLORS.minimalCalm) return "minimalCalm";
  return "elegantDark";
}

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
  noStore();
  const supabase = createPublicClient();

  const { data: salon, error } = await supabase
    .from("salons")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !salon) notFound();

  const todayStr = new Date().toISOString().split("T")[0];
  const [{ data: services }, { data: staff }, { data: hours }, { data: reviews }, { data: exceptions }, { data: subscriptions }, { data: blogPosts }, { data: galleryItems }, { data: campaigns }] = await Promise.all([
    supabase.from("services").select("*").eq("salon_id", salon.id).eq("is_active", true).order("category"),
    supabase.from("staff").select("*").eq("salon_id", salon.id).eq("is_active", true),
    supabase.from("working_hours").select("*").eq("salon_id", salon.id).order("day_of_week"),
    supabase.from("reviews").select("*").eq("salon_id", salon.id).eq("is_verified", true).order("created_at", { ascending: false }).limit(6),
    supabase.from("exception_dates").select("*").eq("salon_id", salon.id).gte("exception_date", todayStr),
    supabase.from("subscriptions").select("*").eq("salon_id", salon.id).order("created_at", { ascending: false }),
    supabase.from("blog_posts").select("*").eq("salon_id", salon.id).eq("is_published", true).order("created_at", { ascending: false }).limit(3),
    supabase.from("gallery_items").select("*").eq("salon_id", salon.id).order("created_at", { ascending: false }).limit(12),
    supabase.from("campaigns").select("*").eq("salon_id", salon.id).eq("is_active", true).order("created_at", { ascending: false }),
  ]);

  const openHours = hours?.filter(h => !h.is_closed) || [];
  const grouped = groupByCategory(services || []);
  const categories = Object.keys(grouped);

  // Dinamik Tema Ayarları
  const primaryColor = salon.theme_color || "#e11d48";
  const designVariant = salon.theme_variant || getDesignVariantByColor(primaryColor);
  
  // Tasarım Modları
  const isMinimal = designVariant === "minimalCalm";
  const isLuxury = designVariant === "luxuryGlow";
  const isFresh = designVariant === "freshLight";
  const isElegant = designVariant === "elegantDark";
  
  const isLightHero = isFresh || isMinimal || isLuxury;

  // ══ TASARIM SİSTEMİ DEĞİŞKENLERİ ══
  const sectionSpacingClass = isMinimal ? "space-y-24" : isLuxury ? "space-y-36" : "space-y-24";
  
  // Kart Stilleri
  const cardBaseClass = isMinimal
    ? "rounded-none border border-stone-200 shadow-none bg-white hover:bg-stone-50 transition-all p-8 relative after:absolute after:inset-0 after:border after:border-stone-900 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:-translate-x-1 after:-translate-y-1 after:pointer-events-none"
    : isLuxury
    ? "rounded-[3.5rem] border border-white/30 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] backdrop-blur-3xl bg-white/30 hover:bg-white/50 transition-all p-10 hover:-translate-y-3"
    : isFresh
    ? "rounded-[3rem] border-none shadow-[0_30px_60px_rgba(14,165,233,0.1)] bg-white hover:scale-[1.02] transition-all p-8"
    : "rounded-3xl border border-stone-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] bg-white p-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all";

  // Buton Stilleri
  const buttonBaseClass = isMinimal
    ? "rounded-none font-bold border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all uppercase px-12 py-5 tracking-widest bg-transparent"
    : isLuxury
    ? "rounded-full font-light tracking-[0.4em] text-white shadow-[0_15px_30px_var(--primary-strong)] hover:scale-110 hover:shadow-[0_25px_50px_var(--primary-strong)] bg-gradient-to-tr from-[var(--primary)] to-white/20 transition-all px-16 py-6 uppercase backdrop-blur-md"
    : isFresh
    ? "rounded-full font-black text-white shadow-[0_20px_40px_var(--primary-strong)] hover:shadow-[0_25px_50px_var(--primary-strong)] hover:scale-105 active:scale-95 transition-all px-12 py-5 italic"
    : "rounded-2xl font-black text-white shadow-[0_15px_30px_var(--primary-strong)] px-10 py-5 hover:-translate-y-1 transition-all brightness-110";

  // Yazı Stilleri (Heading)
  const titleClass = isMinimal
    ? "font-medium tracking-tight text-stone-950 text-5xl uppercase"
    : isLuxury
    ? "font-serif font-light tracking-[0.2em] uppercase text-stone-900 leading-[1.4]"
    : isFresh
    ? "font-black tracking-tighter text-sky-950 text-6xl italic leading-none"
    : "font-black tracking-tight text-stone-900 text-4xl md:text-5xl";

  const themeStyles = {
    "--primary": primaryColor,
    "--primary-light": rgba(primaryColor, 0.12),
    "--primary-soft": isLuxury ? rgba(primaryColor, 0.05) : rgba(primaryColor, 0.08),
    "--primary-strong": rgba(primaryColor, 0.26),
  } as React.CSSProperties;

  return (
    <div
      className={`min-h-screen font-sans selection:bg-[var(--primary-light)] selection:text-stone-900 ${
        isLuxury ? "bg-[radial-gradient(circle_at_top_right,_var(--primary-light)_0%,_#fafaf9_100%)]" : isFresh ? "bg-[#f0f9ff]" : isMinimal ? "bg-white" : "bg-stone-50"
      }`}
      style={themeStyles}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar-thumb { background-color: ${primaryColor} !important; }
      `}} />

      {/* ══ HERO ══ */}
      <div
        className={`relative overflow-hidden ${isFresh ? "bg-white rounded-b-[6rem]" : isMinimal ? "bg-stone-50 border-b border-stone-200" : isLuxury ? "bg-transparent" : "bg-[#0c0a09]"}`}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isMinimal ? "opacity-10" : "animate-pulse"}`} 
            style={{ backgroundColor: isLuxury ? "var(--primary)" : "var(--primary-strong)", opacity: isLightHero ? 0.1 : 0.4 }} 
          />
          {isLuxury && (
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
          )}
          {isMinimal && (
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px"}} />
          )}
          <div className={`absolute inset-0 ${isLightHero ? "opacity-[0.04]" : "opacity-[0.025]"}`}
            style={{backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px"}} />
        </div>

        <div className={`relative max-w-5xl mx-auto px-6 ${isMinimal ? "py-16 md:py-20" : "py-24 md:py-32"}`}>
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10 text-center md:text-left">
            {/* Avatar / Logo */}
            <div className="shrink-0 animate-fade-in-up">
              {salon.logo_url ? (
                <div className={`w-28 h-28 md:w-48 md:h-48 bg-white p-2 border flex items-center justify-center overflow-hidden transition-all duration-700 ${isMinimal ? "rounded-none border-stone-900 border-4" : isLuxury ? "rounded-full border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.5)]" : isFresh ? "rounded-[5rem] -rotate-3 shadow-2xl" : "rounded-[2.5rem] border-stone-800 shadow-2xl"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={salon.logo_url}
                    alt={salon.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className={`w-28 h-28 md:w-48 md:h-48 flex items-center justify-center text-white text-6xl font-black animate-bounce-subtle border border-white/10 ${isMinimal ? "rounded-none" : isLuxury ? "rounded-full" : isFresh ? "rounded-[5rem]" : "rounded-[2.5rem]"}`}
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {salon.name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 animate-fade-in-up delay-200">
              {/* Verified badge */}
              <div
                className="inline-flex items-center gap-1.5 border text-[10px] font-black px-4 py-1.5 rounded-full mb-5 uppercase tracking-[0.2em] shadow-sm"
                style={{ backgroundColor: "var(--primary-light)", borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Premium Salon
              </div>

              <h1 className={`text-4xl md:text-6xl leading-[1.1] mb-6 animate-fade-in-up delay-300 ${titleClass} ${isLightHero ? "text-stone-900" : "text-white"}`}>
                {salon.name}
              </h1>

              {salon.description && (
                <p className={`text-base md:text-lg mb-8 leading-relaxed max-w-2xl animate-fade-in-up delay-400 ${isMinimal ? "font-normal italic" : "font-medium"} ${isLightHero ? "text-stone-600" : "text-stone-400"}`}>
                  {salon.description.length > 150 ? salon.description.slice(0, 150) + "..." : salon.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 animate-fade-in-up delay-500">
                {salon.address && (
                  <span className={`flex items-center gap-2 text-sm font-semibold ${isLightHero ? "text-stone-600" : "text-stone-300"}`}>
                    <MapPin className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    {salon.address}{salon.city ? `, ${salon.city}` : ""}
                  </span>
                )}
                {salon.phone && (
                  <a href={`tel:${salon.phone}`} className={`flex items-center gap-2 text-sm transition-colors font-semibold ${isLightHero ? "text-stone-600" : "text-stone-300"}`}>
                    <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    {salon.phone}
                  </a>
                )}
                {openHours.length > 0 && (
                  <span className={`flex items-center gap-2 text-sm font-semibold ${isLightHero ? "text-stone-600" : "text-stone-300"}`}>
                    <Clock className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    {String(openHours[0].open_time).slice(0, 5)} – {String(openHours[0].close_time).slice(0, 5)}
                  </span>
                )}
              </div>
            </div>

            {/* CTA button (desktop) */}
            <div className="hidden md:block shrink-0">
              <a href="#randevu" 
                style={!isMinimal ? { backgroundColor: "var(--primary)" } : {}}
                className={`inline-flex items-center gap-3 transition-all text-sm tracking-widest ${buttonBaseClass}`}>
                <span>Randevu Al</span>
                <ChevronRight className={`w-4 h-4 ${isFresh ? "animate-ping-slow" : ""}`} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        <CampaignSection 
          campaigns={campaigns || []}
          primaryColor={primaryColor}
        />
      </div>

      {/* ══ WORKING HOURS STRIP ══ */}
      {openHours.length > 0 && (
        <div className={`bg-white border-b border-stone-200 py-6 px-6 overflow-x-auto hide-scroll sticky top-0 z-30 ${isMinimal ? "border-t border-stone-900" : "shadow-sm"}`}>
          <div className="max-w-5xl mx-auto flex items-center gap-3 min-w-max">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] mr-4 border-r pr-6 ${isMinimal ? "text-stone-900 border-stone-900" : "text-stone-400 border-stone-200"}`}>Çalışma Saatleri</span>
            {DAYS_TR.map((day, i) => {
              const h = hours?.find(h => h.day_of_week === i);
              const isToday = new Date().getDay() === i;
              return (
                <div key={day} className={`flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold transition-all ${
                  h?.is_closed
                    ? "bg-stone-100 text-stone-400"
                    : isToday
                    ? "text-white scale-105 shadow-lg"
                    : "text-stone-600 bg-stone-50"
                } ${isMinimal ? "rounded-none border border-stone-200" : isLuxury ? "rounded-full backdrop-blur-md" : isFresh ? "rounded-full" : "rounded-2xl"}`} style={isToday && !h?.is_closed ? { backgroundColor: "var(--primary)", borderColor: "var(--primary)" } : {}}>
                  <span className="uppercase tracking-wider">{day.slice(0, 3)}</span>
                  {!h?.is_closed && h && (
                    <span className={isToday ? "text-white/80" : "text-stone-400 font-medium"}>
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

      <div className={`max-w-5xl mx-auto px-6 py-16 md:py-24 ${sectionSpacingClass}`}>

        {/* ══ ABOUT ══ */}
        {/* ══ SERVICES ══ */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-12">
              <div>
                {!isMinimal && <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: "var(--primary)" }}>Kataloğumuz</p>}
                <h2 className={`text-3xl md:text-4xl ${titleClass}`}>Özel Hizmetlerimiz</h2>
              </div>
              {!isMinimal && <div className="hidden sm:flex items-center gap-2 text-stone-400 text-sm font-bold bg-white border border-stone-200 px-5 py-2.5 rounded-2xl shadow-sm">
                <Scissors className="w-4 h-4" /> {services?.length} Hizmet
              </div>}
            </div>

            <div className="space-y-8">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`text-xs font-black uppercase tracking-[0.2em] px-5 py-2 ${isMinimal ? "border-l-4 border-stone-900 text-stone-900" : "bg-stone-100 rounded-xl text-stone-900"}`}>
                      {cat}
                    </span>
                    <div className="flex-1 h-[1px] bg-stone-200" />
                  </div>
                  <div className={`grid gap-6 ${isMinimal ? "grid-cols-1" : "sm:grid-cols-2"}`}>
                    {grouped[cat].map((s: any) => (
                      <div key={s.id}
                        className={`group transition-all cursor-pointer ${cardBaseClass}`}>
                        <div className="flex items-start gap-5">
                          {!isMinimal && <div className={`w-14 h-14 flex items-center justify-center shrink-0 transition-colors duration-500 ${isLuxury ? "rounded-full" : "rounded-2xl"}`} style={{ backgroundColor: "var(--primary-soft)" }}>
                            <Scissors className="w-6 h-6 transition-colors duration-500" style={{ color: "var(--primary)" }} />
                          </div>}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className={`transition-colors duration-300 ${isLuxury ? "font-serif text-2xl font-light italic" : "font-black text-lg text-stone-900"}`}>{s.name}</p>
                              <p className={`font-black transition-colors duration-300 tabular-nums ${isLuxury ? "text-stone-400 text-xl" : "text-stone-900 text-xl"}`}>₺{s.price}</p>
                            </div>
                            {s.description && (
                              <p className="text-sm text-stone-500 mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-auto">
                               <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                                 <Clock className="w-3.5 h-3.5" />{s.duration_minutes} DK
                               </span>
                               <span className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 transition-all" style={{ color: "var(--primary)" }}>
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
              <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: "var(--primary)" }}>Deneyimler</p>
              <h2 className={`text-3xl md:text-4xl ${titleClass}`}>Mutlu Müşterilerimiz</h2>
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
            <div className={`grid gap-6 ${isLuxury ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {reviews.map((review: any) => (
                <div key={review.id} className={`p-8 relative overflow-hidden group transition-colors ${cardBaseClass}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award className="w-12 h-12" style={{ color: "var(--primary)" }} />
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
                    <div className={`w-12 h-12 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-600 text-sm font-black border border-white shadow-inner ${isMinimal ? "rounded-none" : "rounded-2xl"}`}>
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

        {/* ══ GALLERY ══ */}
        <GallerySection 
          items={galleryItems || []}
          titleClass={titleClass}
          primaryColor={primaryColor}
        />

        {/* ══ BLOG ══ */}
        <BlogSection 
          posts={blogPosts || []}
          titleClass={titleClass}
          cardBaseClass={cardBaseClass}
          primaryColor={primaryColor}
        />

        {/* ══ STAFF ══ */}
        {staff && staff.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-2xl ${titleClass}`}>Ekibimiz</h2>
                <p className="text-sm text-stone-400 mt-1">{staff.length} uzman</p>
              </div>
            </div>
            <div className={`grid gap-4 ${isFresh ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}>
              {staff.map((s: any, index: number) => (
                <div key={s.id} className={`p-5 text-center hover:shadow-md transition-all group animate-fade-in-up ${cardBaseClass}`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className="relative mb-3">
                    {s.avatar_url ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden mx-auto shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.avatar_url} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black mx-auto shadow-lg group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: "var(--primary)" }}>
                        {s.name[0]}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <p className="font-semibold text-stone-900 text-sm transition-colors duration-300 group-hover:opacity-80">{s.name}</p>
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
            <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: "var(--primary)" }}>Rezervasyon</p>
            <h2 className={`text-4xl md:text-5xl mb-4 ${titleClass}`}>Randevunuzu Ayırın</h2>
            <p className="text-stone-500 font-medium max-w-xl mx-auto">Sadece birkaç adımda hayalinizdeki bakıma kavuşun. 7/24 anında onaylı rezervasyon imkanı.</p>
          </div>

          <div className={`border border-stone-200/80 overflow-hidden relative ${cardBaseClass} ${isLuxury ? "shadow-[0_30px_100px_rgba(0,0,0,0.08)]" : ""}`}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-60" style={{ backgroundColor: "var(--primary-soft)" }} />
            <div className="p-6 md:p-10">
              <BookingClient
                salonId={salon.id}
                salon={salon}
                services={services || []}
                staffList={staff || []}
                workingHours={hours || []}
                exceptionDates={exceptions || []}
                subscriptions={subscriptions || []}
                campaigns={campaigns || []}
                designVariant={designVariant}
                isLuxury={isLuxury}
                isMinimal={isMinimal}
                isFresh={isFresh}
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
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black overflow-hidden" style={{ backgroundColor: "var(--primary)" }}>
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
              <a href="/" className="font-semibold transition-colors" style={{ color: "var(--primary)" }}>BeautyBook</a> ile güçlendirilmiştir
            </p>
          </div>
        </div>
      </footer>

      {/* ══ MOBILE STICKY CTA ══ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-stone-200 z-50">
        <a href="#randevu"
          style={!isMinimal ? { backgroundColor: "var(--primary)" } : {}}
          className={`flex items-center justify-center gap-2 w-full py-4 text-sm transition-all hover:brightness-110 ${buttonBaseClass}`}>
          Randevu Al
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
