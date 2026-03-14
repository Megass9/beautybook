"use client";
import { useState } from "react";
import { Check, ChevronRight, ChevronLeft, Calendar, User, Clock, Scissors, ArrowRight, Phone, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateTimeSlots, addMinutes } from "@/lib/utils/time";
import { format, addDays, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import toast from "react-hot-toast";
import type { Service, Staff, WorkingHour } from "@/types";

const STEPS = [
  { label: "Hizmet", icon: Scissors },
  { label: "Uzman", icon: User },
  { label: "Tarih & Saat", icon: Calendar },
  { label: "Bilgiler", icon: Phone },
  { label: "Onay", icon: Check },
];

export default function BookingClient({
  salonId, services, staffList, workingHours
}: { salonId: string; services: Service[]; staffList: Staff[]; workingHours: WorkingHour[] }) {
  const supabase = createClient() as any as any as any;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [selected, setSelected] = useState({
    service: null as Service | null,
    staff: null as Staff | null,
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    time: "",
    name: "",
    phone: "",
  });

  const selectedDayOfWeek = new Date(selected.date).getDay();
  const dayHours = workingHours.find(h => h.day_of_week === selectedDayOfWeek && !h.is_closed);
  const timeSlots = dayHours && selected.service
    ? generateTimeSlots(dayHours.open_time, dayHours.close_time, selected.service.duration_minutes)
    : dayHours ? generateTimeSlots(dayHours.open_time, dayHours.close_time, 30) : [];

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const canNext = () => {
    if (step === 0) return !!selected.service;
    if (step === 1) return !!selected.staff;
    if (step === 2) return !!selected.date && !!selected.time;
    if (step === 3) return selected.name.length >= 2 && selected.phone.length >= 10;
    return true;
  };

  const handleBook = async () => {
    if (!selected.service || !selected.staff) return;
    setLoading(true);
    try {
      let { data: customer } = await supabase
        .from("customers").select("id").eq("salon_id", salonId).eq("phone", selected.phone).single();

      if (!customer) {
        const { data: newC, error } = await supabase.from("customers")
          .insert({ salon_id: salonId, name: selected.name, phone: selected.phone } as any)
          .select().single();
        if (error) throw error;
        customer = newC;
      }

      const endTime = addMinutes(selected.time, selected.service.duration_minutes);
      const { data: existing } = await supabase
        .from("appointments").select("id")
        .eq("staff_id", selected.staff.id).eq("appointment_date", selected.date)
        .neq("status", "cancelled").lt("start_time", endTime).gt("end_time", selected.time);

      if (existing && existing.length > 0) throw new Error("Bu saat dolu! Lütfen başka bir saat seçin.");

      const { error } = await supabase.from("appointments").insert({
        salon_id: salonId, customer_id: customer!.id, service_id: selected.service.id,
        staff_id: selected.staff.id, appointment_date: selected.date,
        start_time: selected.time, end_time: endTime, status: "pending",
      } as any);

      if (error) throw error;
      setDone(true);
      toast.success("Randevunuz alındı! 🎉");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS STATE ──
  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check className="w-9 h-9 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black text-stone-900 mb-2">Randevunuz Alındı!</h3>
        <p className="text-stone-500 text-sm mb-8 max-w-xs mx-auto">
          Salonumuz en kısa sürede <span className="font-semibold text-stone-700">{selected.phone}</span> numaranızı arayarak onaylayacak.
        </p>

        <div className="bg-[#faf7f4] rounded-2xl border border-stone-200 p-5 text-left space-y-3 max-w-sm mx-auto mb-7">
          {[
            { icon: Scissors, label: "Hizmet", value: selected.service?.name },
            { icon: User, label: "Uzman", value: selected.staff?.name },
            {
              icon: Calendar, label: "Tarih & Saat",
              value: `${format(parseISO(selected.date), "d MMMM yyyy, EEEE", { locale: tr })} · ${selected.time}`
            },
            { icon: Clock, label: "Süre", value: `${selected.service?.duration_minutes} dakika` },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0">
                <row.icon className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide">{row.label}</p>
                <p className="text-sm font-semibold text-stone-800">{row.value}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
            <span className="text-sm text-stone-500">Toplam</span>
            <span className="text-lg font-black text-rose-600">₺{selected.service?.price}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setDone(false);
            setStep(0);
            setSelected({
              service: null, staff: null,
              date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
              time: "", name: "", phone: "",
            });
          }}
          className="text-sm font-semibold text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 px-5 py-2.5 rounded-xl transition-all"
        >
          + Yeni Randevu Al
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── STEP PROGRESS ── */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1 scrollbar-hide">
        {STEPS.map((s, i) => {
          const isDone = i < step;
          const isActive = i === step;
          return (
            <div key={s.label} className="flex items-center gap-1 shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isDone ? "bg-emerald-50 border border-emerald-200 text-emerald-700" :
                isActive ? "bg-rose-600 text-white shadow-md shadow-rose-200" :
                "bg-stone-100 text-stone-400"
              }`}>
                {isDone
                  ? <Check className="w-3 h-3" />
                  : <s.icon className="w-3 h-3" />
                }
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={`w-3 h-3 shrink-0 ${i < step ? "text-emerald-400" : "text-stone-300"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP 0: Service ── */}
      {step === 0 && (
        <div>
          <p className="text-sm font-semibold text-stone-600 mb-4">Hangi hizmeti istiyorsunuz?</p>
          {services.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm">Henüz hizmet eklenmemiş.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map(s => (
                <button key={s.id}
                  onClick={() => setSelected(sel => ({ ...sel, service: s }))}
                  className={`group text-left p-4 rounded-2xl border-2 transition-all ${
                    selected.service?.id === s.id
                      ? "border-rose-500 bg-rose-50 shadow-md shadow-rose-100"
                      : "border-stone-200 hover:border-rose-300 bg-white hover:shadow-sm"
                  }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm truncate">{s.name}</p>
                      <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />{s.duration_minutes} dakika
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-black text-rose-600 text-base">₺{s.price}</p>
                      {selected.service?.id === s.id && (
                        <div className="w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center ml-auto mt-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 1: Staff ── */}
      {step === 1 && (
        <div>
          <p className="text-sm font-semibold text-stone-600 mb-4">Hangi uzmanı tercih ediyorsunuz?</p>
          {staffList.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm">Personel bulunamadı.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {staffList.map(s => (
                <button key={s.id}
                  onClick={() => setSelected(sel => ({ ...sel, staff: s }))}
                  className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    selected.staff?.id === s.id
                      ? "border-rose-500 bg-rose-50 shadow-md shadow-rose-100"
                      : "border-stone-200 hover:border-rose-300 bg-white hover:shadow-sm"
                  }`}>
                  <div className="w-11 h-11 bg-gradient-to-br from-rose-400 to-rose-700 rounded-full flex items-center justify-center font-black text-white shrink-0 shadow-md shadow-rose-200">
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm">{s.name}</p>
                    {s.role && <p className="text-xs text-stone-400">{s.role}</p>}
                  </div>
                  {selected.staff?.id === s.id && (
                    <div className="w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Date & Time ── */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-stone-600 mb-2">Tarih seçin</p>
            <input
              type="date"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
              min={format(addDays(new Date(), 0), "yyyy-MM-dd")}
              value={selected.date}
              onChange={e => setSelected(s => ({ ...s, date: e.target.value, time: "" }))}
            />
          </div>

          {!dayHours ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl p-4 text-sm flex items-center gap-2">
              <span className="text-lg">🚫</span>
              Bu gün salon kapalı. Lütfen başka bir tarih seçin.
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-stone-600">Saat seçin</p>
                <span className="text-xs text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
                  {timeSlots.length} müsait saat
                </span>
              </div>
              {timeSlots.length === 0 ? (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-stone-400 text-sm">
                  Bu tarihte müsait saat bulunamadı.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {timeSlots.map(t => (
                    <button key={t}
                      onClick={() => setSelected(s => ({ ...s, time: t }))}
                      className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        selected.time === t
                          ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                          : "bg-stone-50 border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-600"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Customer Info ── */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-stone-600 mb-1">İletişim bilgileriniz</p>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Ad Soyad</label>
            <input
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
              placeholder="Adınızı ve soyadınızı girin"
              value={selected.name}
              onChange={e => setSelected(s => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Telefon</label>
            <input
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
              type="tel"
              placeholder="0532 000 00 00"
              value={selected.phone}
              onChange={e => setSelected(s => ({ ...s, phone: e.target.value }))}
            />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-700">
            <span className="text-base">🔔</span>
            <span>Randevu onayı ve hatırlatmaları bu numaraya SMS ile gönderilecektir.</span>
          </div>
        </div>
      )}

      {/* ── STEP 4: Confirm ── */}
      {step === 4 && (
        <div>
          <p className="text-sm font-semibold text-stone-600 mb-5">Randevu özetinizi onaylayın</p>

          <div className="bg-[#faf7f4] rounded-2xl border border-stone-200 overflow-hidden mb-5">
            {/* Summary header */}
            <div className="bg-[#110608] px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">{selected.service?.name}</p>
                <p className="text-stone-400 text-xs mt-0.5">{selected.service?.duration_minutes} dakika</p>
              </div>
              <p className="text-2xl font-black text-rose-400">₺{selected.service?.price}</p>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
              {[
                { icon: User, label: "Uzman", value: selected.staff?.name },
                {
                  icon: Calendar, label: "Tarih",
                  value: format(parseISO(selected.date), "d MMMM yyyy, EEEE", { locale: tr })
                },
                { icon: Clock, label: "Saat", value: selected.time },
                { icon: Phone, label: "Telefon", value: `${selected.name} · ${selected.phone}` },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-stone-200 rounded-xl flex items-center justify-center shrink-0">
                    <row.icon className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wide">{row.label}</p>
                    <p className="text-sm font-semibold text-stone-800">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-4 rounded-2xl transition-all text-sm shadow-xl shadow-rose-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Randevuyu Onayla
              </>
            )}
          </button>
          <p className="text-center text-xs text-stone-400 mt-3">
            Onayladıktan sonra salon sizi arayarak teyit edecektir.
          </p>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-stone-100">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Geri
          </button>

          {/* Mini summary pill */}
          {selected.service && step > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-full px-3 py-1.5 text-xs text-stone-500">
              <Scissors className="w-3 h-3 text-rose-500" />
              <span className="font-medium text-stone-700">{selected.service.name}</span>
              <span className="text-rose-600 font-bold">₺{selected.service.price}</span>
            </div>
          )}

          <button
            onClick={next}
            disabled={!canNext()}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-rose-200 disabled:shadow-none"
          >
            İleri <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
