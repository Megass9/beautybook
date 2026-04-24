"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  format, addDays, isSameDay, startOfToday,
  addMinutes as dateFnsAddMinutes
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar, Clock, Scissors, User, ChevronRight, Check,
  ArrowLeft, Loader2, AlertCircle, Quote
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
  }, [selectedStaff?.id, selectedDate, salonId]);

  const availableStaff = useMemo(() => {
    if (!selectedService) return [];
    const withService = staffList.filter((s: any) =>
      s.staff_services?.some((ss: any) => ss.service_id === selectedService.id)
    );
    return withService.length > 0 ? withService : staffList;
  }, [selectedService, staffList]);

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-rose-50 text-rose-600 border-rose-100",
      "bg-emerald-50 text-emerald-600 border-emerald-100",
      "bg-blue-50 text-blue-600 border-blue-100",
      "bg-amber-50 text-amber-600 border-amber-100",
      "bg-purple-50 text-purple-600 border-purple-100",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const handleSubmit = async () => {
    if (!customerForm.name || !customerForm.phone) {
      toast.error("Lütfen ad ve telefon bölümünü doldurun.");
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
    } catch (error: any) {
      console.error(error);
      toast.error("Bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="text-center py-10 px-4 animate-fade-up">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full animate-ping opacity-50" />
          <Check className="w-10 h-10 text-emerald-500 relative z-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-stone-900 mb-2 tracking-tight">Randevunuz Alındı!</h3>
        <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto">
          Talebiniz salonumuza başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.
        </p>
        <div className="bg-stone-50 border border-stone-200/60 rounded-[2rem] p-6 text-left mb-8 space-y-4 max-w-sm mx-auto shadow-sm">
          <div className="flex justify-between items-center border-b border-stone-200/60 pb-4">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Tarih & Saat</span>
            <span className="font-bold text-stone-900 text-sm">
              {format(selectedDate, "d MMMM yyyy", { locale: tr })} {selectedTime}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-stone-200/60 pb-4">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Hizmet</span>
            <span className="font-bold text-stone-900 text-sm">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Uzman</span>
            <span className="font-bold text-stone-900 text-sm">{selectedStaff?.name}</span>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full max-w-sm mx-auto bg-stone-900 hover:bg-black text-white font-bold py-4 rounded-xl text-sm transition-all shadow-lg hover:-translate-y-0.5"
        >
          Yeni Bir Randevu Daha Al
        </button>
      </div>
    );
  }

  const STEPS = [
    { id: "service", label: "Hizmet" },
    { id: "staff", label: "Uzman" },
    { id: "datetime", label: "Zaman" },
    { id: "info", label: "Onay" },
  ];
  const currentIdx = STEPS.findIndex(s => s.id === step);

  return (
    <div className="animate-fade-in">
      {/* ── PROGRESS BAR ── */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-100 rounded-full z-0" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-rose-500 rounded-full z-0 transition-all duration-500 ease-out"
          style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((s, idx) => {
          const isActive = s.id === step;
          const isPast = currentIdx > idx;
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive ? "bg-rose-600 text-white shadow-lg shadow-rose-200 ring-4 ring-rose-50 scale-110" :
                isPast ? "bg-rose-500 text-white" :
                "bg-white text-stone-400 border-2 border-stone-200"
              }`}>
                {isPast ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors absolute -bottom-6 whitespace-nowrap ${
                isActive ? "text-rose-600" : isPast ? "text-stone-700" : "text-stone-400"
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-12 sm:mt-14">
        {/* ── BACK BUTTON ── */}
        {step !== "service" && (
          <button
            onClick={() => {
              if (step === "info") setStep("datetime");
              else if (step === "datetime") setStep("staff");
              else if (step === "staff") setStep("service");
            }}
            className="mb-6 flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-widest bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-xl w-max"
          >
            <ArrowLeft className="w-4 h-4" /> Geri Dön
          </button>
        )}

        {/* ── STEP 1: SERVICE ── */}
        {step === "service" && (
          <div className="animate-fade-up">
            <h3 className="text-2xl font-black text-stone-900 mb-2 tracking-tight">Hangi işlemi yaptırmak istersiniz?</h3>
            <p className="text-sm font-medium text-stone-500 mb-6">Lütfen randevu almak istediğiniz hizmeti seçin.</p>
            
            {services.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-[2.5rem] border border-stone-200/60">
                <Scissors className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-bold">Bu salonda randevu alınabilecek hizmet bulunmuyor.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((service: any) => (
                  <button
                    key={service.id}
                    onClick={() => { setSelectedService(service); setStep("staff"); }}
                    className="text-left bg-white border border-stone-200/80 rounded-[2rem] p-5 hover:border-rose-300 hover:shadow-[0_8px_30px_rgba(225,29,72,0.08)] hover:bg-rose-50/10 cursor-pointer transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-100 to-rose-50 opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity duration-500 z-0" />
                    
                    <div className="relative z-10 flex justify-between items-start mb-3">
                      <span className="font-extrabold text-stone-900 text-lg group-hover:text-rose-600 transition-colors pr-2">
                        {service.name}
                      </span>
                      <span className="font-black text-stone-900 text-lg bg-stone-100 px-3 py-1 rounded-xl shrink-0 group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors">₺{service.price}</span>
                    </div>
                    
                    <div className="relative z-10 mt-auto flex items-center justify-between pt-4 border-t border-stone-100 group-hover:border-rose-100/50 transition-colors">
                      <span className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-500 group-hover:bg-white transition-colors">
                        <Clock className="w-3.5 h-3.5" /> {service.duration_minutes} Dakika
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: STAFF ── */}
        {step === "staff" && (
          <div className="animate-fade-up">
            <h3 className="text-2xl font-black text-stone-900 mb-2 tracking-tight">Hangi uzmanı tercih edersiniz?</h3>
            <p className="text-sm font-medium text-stone-500 mb-6">İşleminizi gerçekleştirecek ekip üyemizi seçin.</p>
            
            {availableStaff.length === 0 ? (
              <div className="text-center py-12 bg-amber-50 rounded-[2.5rem] border border-amber-100">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <p className="text-amber-800 font-bold mb-3">Bu işlem için uygun uzman bulunamadı.</p>
                <button onClick={() => setStep("service")} className="text-sm font-bold text-amber-700 underline underline-offset-4 hover:text-amber-900">
                  Farklı bir hizmet seçin
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {availableStaff.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStaff(s); setStep("datetime"); }}
                    className="flex items-center gap-4 bg-white border border-stone-200/80 rounded-[2.5rem] p-4 pr-6 hover:border-rose-300 hover:shadow-[0_8px_30px_rgba(225,29,72,0.08)] cursor-pointer transition-all duration-300 text-left group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    
                    <div className={`w-16 h-16 rounded-[1.5rem] border shadow-inner flex items-center justify-center text-xl font-black shrink-0 relative z-10 ${getAvatarColor(s.name)}`}>
                      {s.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image_url} alt={s.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                      ) : (
                        s.name.substring(0, 1).toUpperCase()
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 relative z-10">
                      <p className="font-extrabold text-stone-900 text-lg group-hover:text-rose-700 transition-colors">{s.name}</p>
                      <p className="text-xs font-semibold text-stone-400 mt-0.5">{s.role || "Güzellik Uzmanı"}</p>
                    </div>
                    
                    <div className="relative z-10 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-rose-600 transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: DATETIME ── */}
        {step === "datetime" && (
          <div className="animate-fade-up">
            <h3 className="text-2xl font-black text-stone-900 mb-2 tracking-tight">Tarih ve Saat</h3>
            <p className="text-sm font-medium text-stone-500 mb-6">Size en uygun zaman dilimini seçin.</p>
            
            <div className="flex gap-3 overflow-x-auto pb-6 mb-2 hide-scroll">
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
                    className={`flex-shrink-0 w-20 rounded-[2rem] flex flex-col items-center justify-center gap-1.5 py-5 border-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-rose-600 text-white border-rose-600 shadow-[0_8px_20px_rgba(225,29,72,0.3)] transform -translate-y-1"
                        : isClosed
                        ? "bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed opacity-60"
                        : "bg-white text-stone-600 border-stone-200/80 hover:border-rose-300 hover:bg-rose-50"
                    }`}
                  >
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                      {format(d, "EEE", { locale: tr })}
                    </span>
                    <span className="text-2xl font-black tracking-tighter">
                      {format(d, "d")}
                    </span>
                    {isClosed && <span className="text-[9px] font-bold text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md mt-1">KAPALI</span>}
                  </button>
                );
              })}
            </div>

            {timeSlots.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-[2.5rem] border border-stone-200/60">
                <Clock className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-bold">Bu gün için uygun bir randevu saati bulunmuyor.</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-stone-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.02)] p-6 sm:p-8">
                <p className="text-xs font-extrabold text-stone-400 uppercase tracking-widest mb-4">Uygun Saatler</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map(time => {
                    const isBusy = busySlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        disabled={isBusy}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3.5 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${
                          isSelected
                            ? "bg-rose-600 text-white shadow-[0_8px_20px_rgba(225,29,72,0.3)] transform scale-105"
                            : isBusy
                            ? "bg-stone-50 text-stone-300 cursor-not-allowed line-through relative overflow-hidden"
                            : "bg-stone-50 text-stone-700 hover:bg-white hover:text-rose-600 border border-stone-200 hover:border-rose-300"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                disabled={!selectedTime}
                onClick={() => setStep("info")}
                className="w-full sm:w-auto bg-stone-900 hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base mx-auto sm:ml-auto sm:mr-0 disabled:shadow-none disabled:translate-y-0"
              >
                Bilgileri Gir <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: INFO ── */}
        {step === "info" && (
          <div className="animate-fade-up">
            <h3 className="text-2xl font-black text-stone-900 mb-2 tracking-tight">Son Adım: İletişim Bilgileri</h3>
            <p className="text-sm font-medium text-stone-500 mb-6">Randevunuzu tamamlamak için bilgilerinizi giriniz.</p>
            
            <div className="grid md:grid-cols-[1fr_350px] gap-8">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    placeholder="Adınız ve Soyadınız"
                    value={customerForm.name}
                    onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className="w-full bg-white border border-stone-200/80 rounded-2xl px-5 py-4 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Telefon</label>
                  <input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={customerForm.phone}
                    onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full bg-white border border-stone-200/80 rounded-2xl px-5 py-4 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Not <span className="text-stone-300 font-medium normal-case">(İsteğe bağlı)</span></label>
                  <textarea
                    rows={3}
                    placeholder="Salon uzmanına iletmek istediğiniz notlar..."
                    value={customerForm.note}
                    onChange={e => setCustomerForm({ ...customerForm, note: e.target.value })}
                    className="w-full bg-white border border-stone-200/80 rounded-2xl px-5 py-4 pl-12 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all resize-none"
                  />
                  <Quote className="absolute left-4 top-10 w-5 h-5 text-stone-300" />
                </div>
              </div>

              <div>
                <div className="bg-stone-50 border border-stone-200/60 rounded-[2.5rem] p-6 shadow-sm sticky top-6">
                  <p className="text-xs font-black text-stone-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-500" /> Randevu Özeti
                  </p>
                  
                  <div className="space-y-4">
                     <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                       <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Hizmet</p>
                       <p className="text-sm font-black text-stone-900">{selectedService?.name}</p>
                     </div>
                     <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                       <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Uzman</p>
                       <p className="text-sm font-black text-stone-900">{selectedStaff?.name}</p>
                     </div>
                     <div className="bg-rose-600 rounded-2xl p-4 shadow-md text-white">
                       <p className="text-[10px] font-extrabold text-rose-200 uppercase tracking-widest mb-1">Tarih & Saat</p>
                       <p className="text-sm font-black text-white">{format(selectedDate, "d MMMM yyyy", { locale: tr })} — {selectedTime}</p>
                     </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-stone-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Süre</p>
                      <p className="text-sm font-bold text-stone-900">{selectedService?.duration_minutes} Dk</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Toplam</p>
                      <p className="text-2xl font-black text-stone-900">₺{selectedService?.price}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-6 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(225,29,72,0.25)] hover:shadow-[0_10px_25px_rgba(225,29,72,0.35)] flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> İşleminiz yapılıyor...</>
                    ) : (
                      <>Randevuyu Onayla <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}