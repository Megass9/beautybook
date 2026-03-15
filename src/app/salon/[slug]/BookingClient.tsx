"use client";
import { useState, useMemo, useEffect } from "react";
import { format, addDays, isSameDay, parseISO, startOfToday, addMinutes as dateFnsAddMinutes } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar, Clock, Scissors, User, ChevronRight, Check,
  MapPin, Phone, Star, ArrowLeft, Loader2, Sparkles, AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Step = "service" | "staff" | "datetime" | "info" | "success";

export default function BookingClient({ salon, services, staff, workingHours }: any) {
  const supabase = createClient();

  // ── ALL hooks must come before any conditional return ──
  const [step, setStep] = useState<Step>("service");
  const [loading, setLoading] = useState(false);

  // Selections
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", note: "" });

  // Data
  const [busySlots, setBusySlots] = useState<string[]>([]);

  // Helper: Personel baş harfleri ve renk
  const getAvatarColor = (name: string) => {
    const colors = ["bg-rose-100 text-rose-600", "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600", "bg-purple-100 text-purple-600"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  // Helper: Müsait saatleri oluştur
  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = workingHours?.start_hour ? parseInt(workingHours.start_hour.split(':')[0]) : 9;
    const endHour = workingHours?.end_hour ? parseInt(workingHours.end_hour.split(':')[0]) : 19;

    for (let i = startHour; i < endHour; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, [workingHours]);

  // Effect: Dolu saatleri çek (Personel ve Tarih seçildiğinde)
  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedStaff || !selectedDate || !salon?.id) return;

      const dateStr = format(selectedDate, "yyyy-MM-dd");

      const { data } = await supabase
        .from("appointments")
        .select("start_time")
        .eq("salon_id", salon.id)
        .eq("staff_id", selectedStaff.id)
        .eq("appointment_date", dateStr)
        .neq("status", "cancelled");

      if (data) {
        setBusySlots(data.map((a: any) => a.start_time.slice(0, 5)));
      }
    }
    fetchAvailability();
  }, [selectedStaff, selectedDate, salon?.id, supabase]);

  // Filter staff based on selected service
  const availableStaff = useMemo(() => {
    if (!selectedService || !staff) return [];
    return staff.filter((s: any) =>
      s.staff_services?.some((ss: any) => ss.service_id === selectedService.id)
    );
  }, [selectedService, staff]);

  // ── Guard: render after all hooks ──
  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <p className="text-stone-500">Salon bulunamadı.</p>
      </div>
    );
  }

  // Submit Appointment
  const handleSubmit = async () => {
    if (!customerForm.name || !customerForm.phone) {
      toast.error("Lütfen ad ve telefon giriniz");
      return;
    }
    setLoading(true);

    try {
      // 1. Müşteri bul veya oluştur
      let customerId;
      const { data: existingCust } = await supabase
        .from("customers")
        .select("id")
        .eq("salon_id", salon.id)
        .eq("phone", customerForm.phone)
        .single();

      if (existingCust) {
        customerId = existingCust.id;
      } else {
        const { data: newCust, error: custError } = await supabase
          .from("customers")
          .insert({
            salon_id: salon.id,
            name: customerForm.name,
            phone: customerForm.phone
          })
          .select()
          .single();

        if (custError) throw custError;
        customerId = newCust.id;
      }

      // 2. Randevu oluştur
      const [h, m] = selectedTime!.split(':').map(Number);
      const startDate = new Date(selectedDate);
      startDate.setHours(h, m);
      const endDate = dateFnsAddMinutes(startDate, selectedService.duration_minutes);

      const { error: aptError } = await supabase.from("appointments").insert({
        salon_id: salon.id,
        customer_id: customerId,
        service_id: selectedService.id,
        staff_id: selectedStaff.id,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedTime,
        end_time: endDate.toISOString(),
        status: "pending",
        notes: customerForm.note
      });

      if (aptError) throw aptError;

      setStep("success");
      toast.success("Randevu talebiniz alındı!");
    } catch (error: any) {
      console.error(error);
      toast.error("Bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Steps ---

  if (step === "success") {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl shadow-rose-100/50">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">Randevu Alındı!</h2>
          <p className="text-charcoal-500 mb-8">
            Randevu talebiniz <strong>{salon.name}</strong> salonuna iletildi. Onaylandığında size bilgilendirme yapılacaktır.
          </p>
          <div className="bg-sand-50 rounded-2xl p-4 text-left mb-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-400 font-medium uppercase">Tarih</span>
              <span className="text-sm font-semibold text-charcoal-900">{format(selectedDate, "d MMMM yyyy", { locale: tr })} {selectedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-400 font-medium uppercase">Hizmet</span>
              <span className="text-sm font-semibold text-charcoal-900">{selectedService?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-400 font-medium uppercase">Personel</span>
              <span className="text-sm font-semibold text-charcoal-900">{selectedStaff?.name}</span>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="w-full bg-charcoal-900 text-white font-bold py-4 rounded-xl">
            Yeni Randevu Al
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] lg:flex lg:items-center lg:justify-center lg:p-6">

      <div className="bg-white w-full max-w-5xl lg:rounded-[2rem] lg:shadow-2xl lg:shadow-stone-200/50 overflow-hidden flex flex-col lg:flex-row min-h-screen lg:min-h-[600px] lg:h-[800px]">

        {/* LEFT SIDE: Salon Info */}
        <div className="bg-charcoal-900 text-white p-6 lg:p-10 lg:w-1/3 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl leading-none mb-1">{salon.name}</h1>
              <div className="flex items-center gap-1 text-charcoal-400 text-xs">
                <MapPin className="w-3 h-3" /> {salon.city}
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {/* Progress Steps */}
            <div className="space-y-4">
              {[
                { id: "service", label: "Hizmet Seçimi", icon: Scissors },
                { id: "staff", label: "Personel", icon: User },
                { id: "datetime", label: "Tarih & Saat", icon: Calendar },
                { id: "info", label: "Bilgileriniz", icon: Check },
              ].map((s, idx) => {
                const isActive = s.id === step;
                const isPast = ["service", "staff", "datetime", "info"].indexOf(step) > idx;
                return (
                  <div key={s.id} className={`flex items-center gap-3 transition-colors ${isActive ? "text-white" : isPast ? "text-rose-500" : "text-charcoal-600"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                      isActive ? "bg-white text-charcoal-900 border-white" :
                      isPast ? "bg-rose-600 text-white border-rose-600" :
                      "border-charcoal-700 bg-transparent"
                    }`}>
                      {isPast ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mt-8 pt-8 border-t border-charcoal-700 space-y-3 text-sm text-charcoal-300">
            {selectedService && (
              <div className="flex justify-between">
                <span>Hizmet</span>
                <span className="text-white font-medium">{selectedService.name}</span>
              </div>
            )}
            {selectedStaff && (
              <div className="flex justify-between">
                <span>Personel</span>
                <span className="text-white font-medium">{selectedStaff.name}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex justify-between">
                <span>Tarih</span>
                <span className="text-white font-medium">{format(selectedDate, "d MMM", { locale: tr })} {selectedTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Content */}
        <div className="flex-1 bg-white p-6 lg:p-10 overflow-y-auto relative">

          {/* Back Button */}
          {step !== "service" && (
            <button
              onClick={() => {
                if (step === "info") setStep("datetime");
                else if (step === "datetime") setStep("staff");
                else if (step === "staff") setStep("service");
              }}
              className="mb-6 flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Geri Dön
            </button>
          )}

          {/* STEP 1: SERVICE */}
          {step === "service" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">Hizmet Seçin</h2>
              <p className="text-charcoal-500 mb-6">Lütfen almak istediğiniz hizmeti seçiniz.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {(services ?? []).map((service: any) => (
                  <div
                    key={service.id}
                    onClick={() => { setSelectedService(service); setStep("staff"); }}
                    className="border border-sand-200 rounded-2xl p-5 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-charcoal-900 group-hover:text-rose-600 transition-colors">{service.name}</h3>
                      <span className="font-bold text-rose-600">₺{service.price}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charcoal-400">
                      <span className="flex items-center gap-1 bg-sand-50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" /> {service.duration_minutes} dk
                      </span>
                      {service.category && <span>{service.category}</span>}
                    </div>
                  </div>
                ))}
              </div>
              {(!services || services.length === 0) && (
                <div className="text-center py-10 text-charcoal-400">
                  Bu salonda henüz hizmet tanımlanmamış.
                </div>
              )}
            </div>
          )}

          {/* STEP 2: STAFF */}
          {step === "staff" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">Personel Seçin</h2>
              <p className="text-charcoal-500 mb-6">İşlemi yapacak uzmanı seçiniz.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {availableStaff.map((s: any) => (
                  <div
                    key={s.id}
                    onClick={() => { setSelectedStaff(s); setStep("datetime"); }}
                    className="flex items-center gap-4 border border-sand-200 rounded-2xl p-4 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 cursor-pointer transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(s.name)}`}>
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        s.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900">{s.name}</h3>
                      <p className="text-xs text-charcoal-400">{s.role || "Uzman"}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-sand-300 ml-auto" />
                  </div>
                ))}
              </div>

              {availableStaff.length === 0 && (
                <div className="text-center py-10">
                  <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-center gap-3 justify-center">
                    <AlertCircle className="w-5 h-5" />
                    <span>Bu hizmet için uygun personel bulunamadı.</span>
                  </div>
                  <button
                    onClick={() => setStep("service")}
                    className="mt-4 text-sm text-charcoal-500 hover:text-rose-600 underline"
                  >
                    Farklı bir hizmet seç
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === "datetime" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">Zaman Seçin</h2>
              <p className="text-charcoal-500 mb-6">Size uygun tarih ve saati belirleyin.</p>

              {/* Date Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                {Array.from({ length: 14 }).map((_, i) => {
                  const d = addDays(new Date(), i);
                  const isSelected = isSameDay(d, selectedDate);
                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                      className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                        isSelected
                          ? "bg-charcoal-900 text-white border-charcoal-900 shadow-lg"
                          : "bg-white text-charcoal-600 border-sand-200 hover:border-rose-300"
                      }`}
                    >
                      <span className="text-xs font-medium">{format(d, "EEE", { locale: tr })}</span>
                      <span className="text-xl font-bold">{format(d, "d")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map(time => {
                  const isBusy = busySlots.includes(time);
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      disabled={isBusy}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        isSelected
                          ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200"
                          : isBusy
                          ? "bg-sand-50 text-sand-300 border-transparent cursor-not-allowed decoration-slice line-through"
                          : "bg-white text-charcoal-700 border-sand-200 hover:border-rose-300 hover:bg-rose-50"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedTime}
                  onClick={() => setStep("info")}
                  className="bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
                >
                  Devam Et <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INFO FORM */}
          {step === "info" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">Bilgilerinizi Girin</h2>
              <p className="text-charcoal-500 mb-6">Randevunuzu tamamlamak için bilgilerinizi giriniz.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-charcoal-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    placeholder="Adınız ve Soyadınız"
                    value={customerForm.name}
                    onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal-700 mb-2">Telefon Numarası</label>
                  <input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={customerForm.phone}
                    onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal-700 mb-2">Not (Opsiyonel)</label>
                  <textarea
                    rows={3}
                    placeholder="Varsa özel istekleriniz..."
                    value={customerForm.note}
                    onChange={e => setCustomerForm({ ...customerForm, note: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-8 bg-rose-50 border border-rose-100 rounded-2xl p-5">
                <h3 className="font-bold text-rose-900 mb-3 text-sm uppercase tracking-wide">Randevu Özeti</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-rose-700">Salon</span>
                    <span className="font-semibold text-rose-900">{salon.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-700">Hizmet</span>
                    <span className="font-semibold text-rose-900">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-700">Personel</span>
                    <span className="font-semibold text-rose-900">{selectedStaff?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-700">Tarih</span>
                    <span className="font-semibold text-rose-900">{format(selectedDate, "d MMMM yyyy", { locale: tr })} {selectedTime}</span>
                  </div>
                  <div className="border-t border-rose-200 pt-2 mt-2 flex justify-between text-lg font-bold">
                    <span className="text-rose-900">Toplam</span>
                    <span className="text-rose-600">₺{selectedService?.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...
                  </>
                ) : (
                  <>Randevuyu Onayla</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}