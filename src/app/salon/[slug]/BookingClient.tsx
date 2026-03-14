"use client";
import { useState } from "react";
import { Check, ChevronRight, ChevronLeft, Calendar, User, Clock, Scissors, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateTimeSlots, addMinutes } from "@/lib/utils/time";
import { format, addDays, parseISO, isBefore, startOfToday } from "date-fns";
import { tr } from "date-fns/locale";
import toast from "react-hot-toast";
import type { Service, Staff, WorkingHour } from "@/types";

const STEPS = ["Hizmet", "Personel", "Tarih & Saat", "Bilgiler", "Onay"];

export default function BookingClient({
  salonId, services, staffList, workingHours
}: { salonId: string; services: Service[]; staffList: Staff[]; workingHours: WorkingHour[] }) {
  const supabase = createClient();
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
      // Check or create customer
      let { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("salon_id", salonId)
        .eq("phone", selected.phone)
        .single();

      if (!customer) {
        const { data: newC, error } = await supabase.from("customers")
          .insert({ salon_id: salonId, name: selected.name, phone: selected.phone })
          .select().single();
        if (error) throw error;
        customer = newC;
      }

      // Check conflict
      const endTime = addMinutes(selected.time, selected.service.duration_minutes);
      const { data: existing } = await supabase
        .from("appointments")
        .select("id")
        .eq("staff_id", selected.staff.id)
        .eq("appointment_date", selected.date)
        .neq("status", "cancelled")
        .lt("start_time", endTime)
        .gt("end_time", selected.time);

      if (existing && existing.length > 0) {
        throw new Error("Bu saat dolu! Lütfen başka bir saat seçin.");
      }

      const { error } = await supabase.from("appointments").insert({
        salon_id: salonId,
        customer_id: customer.id,
        service_id: selected.service.id,
        staff_id: selected.staff.id,
        appointment_date: selected.date,
        start_time: selected.time,
        end_time: endTime,
        status: "pending",
      });

      if (error) throw error;
      setDone(true);
      toast.success("Randevunuz alındı! 🎉");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal-900 mb-2">Randevunuz Alındı!</h3>
        <p className="text-charcoal-500 text-sm mb-6">Salonumuz en kısa sürede sizi arayarak onaylayacak.</p>
        <div className="bg-sand-50 rounded-2xl p-5 text-left space-y-3 max-w-sm mx-auto mb-6">
          <div className="flex items-center gap-3">
            <Scissors className="w-4 h-4 text-rose-500" />
            <span className="text-sm text-charcoal-700">{selected.service?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-rose-500" />
            <span className="text-sm text-charcoal-700">{selected.staff?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span className="text-sm text-charcoal-700">
              {format(parseISO(selected.date), "d MMMM yyyy, EEEE", { locale: tr })} · {selected.time}
            </span>
          </div>
        </div>
        <button onClick={() => { setDone(false); setStep(0); setSelected({ service: null, staff: null, date: format(addDays(new Date(), 1), "yyyy-MM-dd"), time: "", name: "", phone: "" }); }}
          className="btn-secondary">
          Yeni Randevu Al
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              i === step ? "bg-rose-600 text-white" :
              i < step ? "bg-green-100 text-green-700" :
              "bg-sand-100 text-charcoal-400"
            }`}>
              {i < step ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-charcoal-300 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step 0: Service */}
      {step === 0 && (
        <div>
          <p className="text-sm font-medium text-charcoal-600 mb-3">Hangi hizmeti istiyorsunuz?</p>
          {services.length === 0 ? (
            <p className="text-charcoal-400 text-sm">Hizmet bulunamadı.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map(s => (
                <button key={s.id} onClick={() => setSelected(sel => ({ ...sel, service: s }))}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selected.service?.id === s.id
                      ? "border-rose-500 bg-rose-50"
                      : "border-sand-200 hover:border-rose-300 bg-white"
                  }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-charcoal-800 text-sm">{s.name}</p>
                      <p className="text-xs text-charcoal-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />{s.duration_minutes} dk
                      </p>
                    </div>
                    <span className="font-display font-bold text-rose-600">₺{s.price}</span>
                  </div>
                  {selected.service?.id === s.id && (
                    <div className="mt-2 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center ml-auto">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Staff */}
      {step === 1 && (
        <div>
          <p className="text-sm font-medium text-charcoal-600 mb-3">Hangi uzmanı tercih ediyorsunuz?</p>
          {staffList.length === 0 ? (
            <p className="text-charcoal-400 text-sm">Personel bulunamadı.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {staffList.map(s => (
                <button key={s.id} onClick={() => setSelected(sel => ({ ...sel, staff: s }))}
                  className={`text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selected.staff?.id === s.id ? "border-rose-500 bg-rose-50" : "border-sand-200 hover:border-rose-300 bg-white"
                  }`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-sand-100 rounded-full flex items-center justify-center font-bold text-rose-600 flex-shrink-0">
                    {s.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-charcoal-800 text-sm">{s.name}</p>
                    <p className="text-xs text-charcoal-400">{s.role}</p>
                  </div>
                  {selected.staff?.id === s.id && <Check className="w-4 h-4 text-rose-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div>
          <p className="text-sm font-medium text-charcoal-600 mb-3">Tarih ve saat seçin</p>
          <div className="mb-4">
            <label className="label">Tarih</label>
            <input type="date" className="input" min={format(addDays(new Date(), 0), "yyyy-MM-dd")}
              value={selected.date} onChange={e => setSelected(s => ({ ...s, date: e.target.value, time: "" }))} />
          </div>
          {!dayHours ? (
            <div className="bg-amber-50 text-amber-700 rounded-xl p-3 text-sm">Bu gün salon kapalı. Başka bir tarih seçin.</div>
          ) : (
            <div>
              <label className="label">Saat ({timeSlots.length} uygun saat)</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(t => (
                  <button key={t} onClick={() => setSelected(s => ({ ...s, time: t }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selected.time === t ? "bg-rose-600 text-white" : "bg-sand-50 hover:bg-sand-100 text-charcoal-700"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Customer Info */}
      {step === 3 && (
        <div>
          <p className="text-sm font-medium text-charcoal-600 mb-4">İletişim bilgileriniz</p>
          <div className="space-y-4">
            <div>
              <label className="label">Ad Soyad</label>
              <input className="input" placeholder="Adınızı girin" value={selected.name}
                onChange={e => setSelected(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Telefon</label>
              <input className="input" type="tel" placeholder="0532 000 00 00" value={selected.phone}
                onChange={e => setSelected(s => ({ ...s, phone: e.target.value }))} />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div>
          <p className="text-sm font-medium text-charcoal-600 mb-4">Randevu özeti</p>
          <div className="bg-sand-50 rounded-2xl p-5 space-y-4 mb-6">
            <div className="flex items-center gap-3 pb-3 border-b border-sand-200">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Scissors className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-charcoal-400">Hizmet</p>
                <p className="font-medium text-charcoal-800">{selected.service?.name}</p>
              </div>
              <span className="ml-auto font-display font-bold text-rose-600">₺{selected.service?.price}</span>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-sand-200">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-charcoal-400">Uzman</p>
                <p className="font-medium text-charcoal-800">{selected.staff?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-sand-200">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-charcoal-400">Tarih & Saat</p>
                <p className="font-medium text-charcoal-800">
                  {format(parseISO(selected.date), "d MMMM yyyy, EEEE", { locale: tr })} · {selected.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-charcoal-400">Kişi</p>
                <p className="font-medium text-charcoal-800">{selected.name} · {selected.phone}</p>
              </div>
            </div>
          </div>
          <button onClick={handleBook} disabled={loading}
            className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60">
            <Sparkles className="w-4 h-4" />
            {loading ? "İşleniyor..." : "Randevuyu Onayla"}
          </button>
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-sand-100">
          <button onClick={prev} disabled={step === 0}
            className="btn-secondary disabled:opacity-40 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Geri
          </button>
          <button onClick={next} disabled={!canNext()}
            className="btn-primary disabled:opacity-40 flex items-center gap-2">
            İleri <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
