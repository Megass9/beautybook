"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  format, addDays, isSameDay, startOfToday,
  addMinutes as dateFnsAddMinutes
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar, Clock, Scissors, User, ChevronRight, Check,
  ArrowLeft, Loader2, AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Step = "service" | "staff" | "datetime" | "info" | "success";

interface Props {
  salonId: string;
  services: any[];
  staffList: any[];
  workingHours: any[];
}

export default function BookingClient({ salonId, services, staffList, workingHours }: Props) {
  // supabase istemcisini ref ile tut — her render'da yeniden oluşmasın
  const supabaseRef = useRef(createClient() as any);
  const supabase = supabaseRef.current;

  const [step, setStep] = useState<Step>("service");
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", note: "" });
  const [busySlots, setBusySlots] = useState<string[]>([]);

  // Çalışma saatlerinden saat dilimleri
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const dayOfWeek = selectedDate.getDay();
    const todayHours = workingHours.find(
      (h: any) => h.day_of_week === dayOfWeek && !h.is_closed
    );
    const startHour = todayHours?.open_time
      ? parseInt(todayHours.open_time.split(":")[0])
      : 9;
    const endHour = todayHours?.close_time
      ? parseInt(todayHours.close_time.split(":")[0])
      : 19;
    for (let i = startHour; i < endHour; i++) {
      slots.push(`${i.toString().padStart(2, "0")}:00`);
      slots.push(`${i.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, [workingHours, selectedDate]);

  // Dolu saatleri çek
  useEffect(() => {
    if (!selectedStaff?.id || !salonId) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    supabase
      .from("appointments")
      .select("start_time")
      .eq("salon_id", salonId)
      .eq("staff_id", selectedStaff.id)
      .eq("appointment_date", dateStr)
      .neq("status", "cancelled")
      .then(({ data }: any) => {
        if (data) setBusySlots(data.map((a: any) => a.start_time.slice(0, 5)));
      });
  }, [selectedStaff?.id, selectedDate, salonId]); // supabase yok — ref sabit

  // Seçili hizmeti yapabilen personeller
  // Eğer staff_services verisi yoksa tüm personeli göster (fallback)
  const availableStaff = useMemo(() => {
    if (!selectedService) return [];
    const withService = staffList.filter((s: any) =>
      s.staff_services?.some((ss: any) => ss.service_id === selectedService.id)
    );
    // staff_services join'i gelmemişse herkesi göster
    return withService.length > 0 ? withService : staffList;
  }, [selectedService, staffList]);

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-rose-100 text-rose-600",
      "bg-blue-100 text-blue-600",
      "bg-emerald-100 text-emerald-600",
      "bg-amber-100 text-amber-600",
      "bg-purple-100 text-purple-600",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const handleSubmit = async () => {
    if (!customerForm.name || !customerForm.phone) {
      toast.error("Lütfen ad ve telefon giriniz");
      return;
    }
    setLoading(true);
    try {
      let customerId: string;

      const { data: existingCust } = await supabase
        .from("customers")
        .select("id")
        .eq("salon_id", salonId)
        .eq("phone", customerForm.phone)
        .maybeSingle();

      if (existingCust) {
        customerId = existingCust.id;
      } else {
        const { data: newCust, error: custError } = await supabase
          .from("customers")
          .insert({ salon_id: salonId, name: customerForm.name, phone: customerForm.phone })
          .select()
          .single();
        if (custError) throw custError;
        customerId = newCust.id;
      }

      const [h, m] = selectedTime!.split(":").map(Number);
      const startDate = new Date(selectedDate);
      startDate.setHours(h, m, 0, 0);
      const endDate = dateFnsAddMinutes(startDate, selectedService.duration_minutes);

      const { error: aptError } = await supabase.from("appointments").insert({
        salon_id: salonId,
        customer_id: customerId,
        service_id: selectedService.id,
        staff_id: selectedStaff.id,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedTime,
        end_time: format(endDate, "HH:mm"),
        status: "pending",
        notes: customerForm.note,
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

  // Success ekranı
  if (step === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">Randevu Alındı!</h3>
        <p className="text-stone-500 text-sm mb-6">
          Talebiniz iletildi. Onaylandığında bilgilendirme yapılacaktır.
        </p>
        <div className="bg-stone-50 rounded-2xl p-4 text-left mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-400">Tarih</span>
            <span className="font-semibold text-stone-900">
              {format(selectedDate, "d MMMM yyyy", { locale: tr })} {selectedTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Hizmet</span>
            <span className="font-semibold text-stone-900">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Personel</span>
            <span className="font-semibold text-stone-900">{selectedStaff?.name}</span>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl text-sm"
        >
          Yeni Randevu Al
        </button>
      </div>
    );
  }

  const STEPS = [
    { id: "service", label: "Hizmet", icon: Scissors },
    { id: "staff", label: "Personel", icon: User },
    { id: "datetime", label: "Tarih & Saat", icon: Calendar },
    { id: "info", label: "Bilgiler", icon: Check },
  ];
  const currentIdx = STEPS.findIndex(s => s.id === step);

  return (
    <div>
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, idx) => {
          const isActive = s.id === step;
          const isPast = currentIdx > idx;
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                isActive ? "text-rose-600" : isPast ? "text-stone-400" : "text-stone-300"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                  isActive ? "bg-rose-600 text-white border-rose-600" :
                  isPast ? "bg-stone-200 text-stone-500 border-stone-200" :
                  "border-stone-200 text-stone-300"
                }`}>
                  {isPast ? <Check className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                </div>
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-colors ${isPast ? "bg-rose-200" : "bg-stone-100"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Geri butonu */}
      {step !== "service" && (
        <button
          onClick={() => {
            if (step === "info") setStep("datetime");
            else if (step === "datetime") setStep("staff");
            else if (step === "staff") setStep("service");
          }}
          className="mb-5 flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Geri
        </button>
      )}

      {/* ADIM 1: HİZMET */}
      {step === "service" && (
        <div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">Hizmet Seçin</h3>
          <p className="text-sm text-stone-400 mb-5">Almak istediğiniz hizmeti seçiniz.</p>
          {services.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              Bu salonda henüz hizmet tanımlanmamış.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((service: any) => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedService(service); setStep("staff"); }}
                  className="text-left border border-stone-200 rounded-2xl p-4 hover:border-rose-300 hover:shadow-md hover:bg-rose-50/30 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-stone-900 text-sm group-hover:text-rose-600 transition-colors">
                      {service.name}
                    </span>
                    <span className="font-bold text-rose-600 text-sm ml-2 shrink-0">₺{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-lg">
                      <Clock className="w-3 h-3" /> {service.duration_minutes} dk
                    </span>
                    {service.category && (
                      <span className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded-lg">{service.category}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADIM 2: PERSONEL */}
      {step === "staff" && (
        <div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">Personel Seçin</h3>
          <p className="text-sm text-stone-400 mb-5">İşlemi yapacak uzmanı seçiniz.</p>
          {availableStaff.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-amber-50 text-amber-700 p-4 rounded-xl flex items-center gap-3 text-sm justify-center mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Bu hizmet için uygun personel bulunamadı.
              </div>
              <button onClick={() => setStep("service")} className="text-sm text-rose-600 hover:underline">
                Farklı bir hizmet seç
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {availableStaff.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStaff(s); setStep("datetime"); }}
                  className="flex items-center gap-3 border border-stone-200 rounded-2xl p-4 hover:border-rose-300 hover:shadow-md hover:bg-rose-50/30 cursor-pointer transition-all text-left"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${getAvatarColor(s.name)}`}>
                    {s.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image_url} alt={s.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      s.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm">{s.name}</p>
                    <p className="text-xs text-stone-400">{s.role || "Uzman"}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADIM 3: TARİH & SAAT */}
      {step === "datetime" && (
        <div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">Tarih & Saat Seçin</h3>
          <p className="text-sm text-stone-400 mb-5">Size uygun gün ve saati belirleyin.</p>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
            {Array.from({ length: 14 }).map((_, i) => {
              const d = addDays(new Date(), i);
              const isSelected = isSameDay(d, selectedDate);
              const dayOfWeek = d.getDay();
              const dayHours = workingHours.find((h: any) => h.day_of_week === dayOfWeek);
              const isClosed = dayHours?.is_closed;
              return (
                <button
                  key={i}
                  disabled={!!isClosed}
                  onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                  className={`flex-shrink-0 w-14 rounded-2xl flex flex-col items-center justify-center gap-1 py-3 border transition-all ${
                    isSelected
                      ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200"
                      : isClosed
                      ? "bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed"
                      : "bg-white text-stone-600 border-stone-200 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase">{format(d, "EEE", { locale: tr })}</span>
                  <span className="text-lg font-black">{format(d, "d")}</span>
                  {isClosed && <span className="text-[9px] text-stone-300">Kapalı</span>}
                </button>
              );
            })}
          </div>
          {timeSlots.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-sm">Bu gün için müsait saat bulunmuyor.</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
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
                        ? "bg-stone-50 text-stone-300 border-transparent cursor-not-allowed line-through"
                        : "bg-white text-stone-700 border-stone-200 hover:border-rose-300 hover:bg-rose-50"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              disabled={!selectedTime}
              onClick={() => setStep("info")}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-7 rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              Devam Et <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 4: BİLGİLER */}
      {step === "info" && (
        <div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">Bilgilerinizi Girin</h3>
          <p className="text-sm text-stone-400 mb-5">Randevuyu tamamlamak için bilgilerinizi giriniz.</p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wide">Ad Soyad</label>
              <input
                type="text"
                placeholder="Adınız ve Soyadınız"
                value={customerForm.name}
                onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wide">Telefon</label>
              <input
                type="tel"
                placeholder="05XX XXX XX XX"
                value={customerForm.phone}
                onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wide">
                Not <span className="text-stone-300 font-normal normal-case">(opsiyonel)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Özel istekleriniz..."
                value={customerForm.note}
                onChange={e => setCustomerForm({ ...customerForm, note: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all resize-none"
              />
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-6">
            <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-3">Randevu Özeti</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-rose-600">Hizmet</span>
                <span className="font-semibold text-stone-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-600">Personel</span>
                <span className="font-semibold text-stone-900">{selectedStaff?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-600">Tarih & Saat</span>
                <span className="font-semibold text-stone-900">
                  {format(selectedDate, "d MMM yyyy", { locale: tr })} {selectedTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-600">Süre</span>
                <span className="font-semibold text-stone-900">{selectedService?.duration_minutes} dk</span>
              </div>
              <div className="pt-2 border-t border-rose-200 flex justify-between font-bold text-base">
                <span className="text-stone-900">Toplam</span>
                <span className="text-rose-600">₺{selectedService?.price}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-200/60 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> İşleniyor...</>
            ) : (
              <>Randevuyu Onayla</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}