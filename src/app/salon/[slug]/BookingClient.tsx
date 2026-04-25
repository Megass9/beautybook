"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  format, addDays, isSameDay, startOfToday,
  addMinutes as dateFnsAddMinutes
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar, Clock, Scissors, User, ChevronRight, Check,
  ArrowLeft, Loader2, AlertCircle, Quote, CreditCard
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Step = "service" | "staff" | "datetime" | "info" | "success";

interface Props {
  salonId: string;
  salon?: any;
  services: any[];
  staffList: any[];
  workingHours: any[];
  exceptionDates?: any[];
  subscriptions?: any[];
  designVariant: string;
  isLuxury: boolean;
  isMinimal: boolean;
  isFresh: boolean;
}

export default function BookingClient({ 
  salonId, salon, services, staffList, workingHours, exceptionDates = [], subscriptions = [],
  designVariant, isLuxury, isMinimal, isFresh 
}: Props) {
  const supabaseRef = useRef(createClient() as any);
  const supabase = supabaseRef.current;

  const [step, setStep] = useState<Step>("service");
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", note: "", receiptNo: "" });
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

  const cardThemeClass = useMemo(() => {
    if (isMinimal) {
      return "rounded-none border-2 border-stone-200 bg-white hover:border-stone-900 hover:bg-stone-50 transition-all duration-300 active:bg-stone-100 shadow-none";
    } else if (isLuxury) {
      return "rounded-[3.5rem] border border-white/30 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] backdrop-blur-3xl bg-white/30 hover:bg-white/50 transition-all";
    } else if (isFresh) {
      return "rounded-[3rem] border-none shadow-[0_30px_60px_rgba(14,165,233,0.1)] bg-white hover:scale-[1.02] transition-all";
    } else { // Elegant Dark
      return "rounded-[2rem] border border-stone-200/80 bg-white hover:border-rose-300 hover:shadow-[0_8px_30px_rgba(225,29,72,0.08)] hover:bg-rose-50/10 transition-all";
    }
  }, [isMinimal, isLuxury, isFresh]);

  // Abonelik ve Kısıtlama Kontrolü
  const isLocked = useMemo(() => {
    // 1. Deneme süresi sonu (Kayıt + 14 gün)
    const trialEndDate = addDays(new Date(salon.created_at), 14);
    
    // 2. Varsa son aktif abonelik bitişi
    const activeSub = subscriptions?.find((s: any) => s.status === "active");
    const lastValidDate = activeSub?.end_date ? new Date(activeSub.end_date) : trialEndDate;

    // 3. 3 Günlük Mühlet (Grace Period)
    const graceDate = addDays(lastValidDate, 3);
    
    // Eğer şu anki zaman mühlet tarihini geçtiyse kilitli
    return new Date() > graceDate;
  }, [salon.created_at, subscriptions]);

  // Temaya göre dinamik renk sınıfları
  const themeClasses = {
    bg: isMinimal ? "bg-stone-900" : "bg-[var(--primary)]",
    bgHover: isMinimal ? "hover:bg-black" : "hover:opacity-90",
    bgLight: isMinimal ? "bg-stone-50" : "bg-[var(--primary-soft)]",
    text: isMinimal ? "text-stone-900" : "text-[var(--primary)]",
    textMuted: isMinimal ? "text-stone-500" : "text-[var(--primary)]/60",
    hoverText: isMinimal ? "group-hover:text-stone-600" : "group-hover:text-[var(--primary)]",
    hoverTextMuted: isMinimal ? "group-hover:text-stone-700" : "group-hover:text-[var(--primary)]/80",
    hoverBgLight: isMinimal ? "group-hover:bg-stone-100" : "group-hover:bg-[var(--primary-light)]",
    hoverIconBg: isMinimal ? "group-hover:bg-stone-900" : "group-hover:bg-[var(--primary)]",
    hoverShadow: isMinimal ? "hover:shadow-stone-200" : "hover:shadow-[var(--primary-light)]",
    hoverTo: isMinimal ? "to-stone-50" : "to-[var(--primary-soft)]",
    hoverBgLightActive: isMinimal ? "hover:bg-stone-100" : "hover:bg-[var(--primary-soft)]",
    focus: isMinimal ? "focus:border-stone-400 focus:ring-stone-100/50" : "focus:border-[var(--primary)] focus:ring-[var(--primary-strong)]",
    border: isMinimal ? "border-stone-200" : "border-[var(--primary-strong)]",
    borderActive: isMinimal ? "border-stone-900" : "border-[var(--primary)]",
    borderHover: isMinimal ? "hover:border-stone-400" : "hover:border-[var(--primary)]",
    shadow: isMinimal ? "shadow-stone-200" : "shadow-[var(--primary-strong)]",
    ring: isMinimal ? "ring-stone-50" : "ring-[var(--primary-light)]",
    gradient: isMinimal ? "from-transparent to-stone-100" : "from-[var(--primary-light)] to-[var(--primary-soft)]",
    icon: isMinimal ? "text-stone-900" : "text-[var(--primary)]",
  };

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
    if (salon?.is_deposit_required && salon?.iban && !customerForm.receiptNo) {
      toast.error("Lütfen dekont sorgu / işlem numarasını girin.");
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
        notes: customerForm.receiptNo 
          ? `Dekont Sorgu No: ${customerForm.receiptNo}\nNot: ${customerForm.note}` 
          : customerForm.note,
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

  if (isLocked) {
    return (
      <div className="text-center py-20 px-6 animate-fade-up">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h3 className="text-2xl font-black text-stone-900 mb-3 italic">Hizmet Dışı</h3>
        <p className="text-stone-500 text-sm max-w-xs mx-auto font-medium">
          Bu salonun abonelik süresi dolduğu için şu an randevu kabul edilmemektedir. Lütfen daha sonra tekrar deneyin.
        </p>
      </div>
    );
  }

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
          className={`w-full max-w-sm mx-auto font-bold py-4 text-sm transition-all shadow-lg hover:-translate-y-0.5 ${
            isMinimal ? 'rounded-none border-2 border-stone-900 bg-transparent text-stone-900 hover:bg-stone-900 hover:text-white uppercase tracking-widest' : 'bg-stone-900 hover:bg-black text-white rounded-xl'
          }`}
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
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 z-0 transition-all duration-500 ease-out ${isMinimal ? '' : 'rounded-full'} ${themeClasses.bg.replace('600', '500')}`}
          style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((s, idx) => {
          const isActive = s.id === step;
          const isPast = currentIdx > idx;
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${isMinimal ? 'rounded-none border-2' : 'rounded-full'} ${
                isActive ? `${themeClasses.bg} text-white shadow-lg ${isMinimal ? '' : themeClasses.shadow + ' ring-4 ' + themeClasses.ring + ' scale-110'}` :
                isPast ? `${themeClasses.bg.replace('600', '500')} text-white` :
                "bg-white text-stone-400 border-2 border-stone-200"
              }`}>
                {isPast ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors absolute -bottom-6 whitespace-nowrap ${
                isActive ? (isMinimal ? 'text-stone-900 underline underline-offset-4' : themeClasses.text) : isPast ? "text-stone-700" : "text-stone-400"
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
            className={`mb-6 flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-all uppercase tracking-widest px-4 py-2 w-max ${isMinimal ? 'rounded-none border border-stone-200 bg-white hover:border-stone-900' : 'bg-stone-100 hover:bg-stone-200 rounded-xl'}`}
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
                    onClick={() => { setSelectedService(service); setStep("staff"); }} // Existing logic
                    className={`text-left p-6 flex flex-col h-full relative overflow-hidden group ${cardThemeClass}`}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${themeClasses.gradient} opacity-0 group-hover:opacity-100 ${isMinimal ? '' : 'rounded-bl-full'} transition-opacity duration-500 z-0 pointer-events-none`} />
                    
                    <div className="relative z-10 flex justify-between items-start mb-3">
                      <span className={`font-black text-stone-900 text-lg transition-all pr-2 ${themeClasses.hoverText} ${isMinimal ? 'uppercase tracking-tighter' : ''}`}>
                        {service.name}
                      </span>
                      <span className={`font-black text-stone-900 text-lg bg-stone-100 px-3 py-1 shrink-0 transition-all duration-300 ${isMinimal ? 'rounded-none border border-stone-200 group-hover:bg-stone-900 group-hover:text-white' : 'rounded-xl ' + themeClasses.hoverBgLight + ' ' + themeClasses.hoverTextMuted}`}>₺{service.price}</span>
                    </div>
                    
                    <div className={`relative z-10 mt-auto flex items-center justify-between pt-4 border-t transition-all ${isMinimal ? 'border-stone-200 group-hover:border-stone-900' : 'border-stone-100 group-hover:border-rose-100/50'}`}>
                      <span className={`flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-500 group-hover:bg-white transition-colors ${isMinimal ? 'rounded-none' : 'rounded-xl'}`}>
                        <Clock className="w-3.5 h-3.5" /> {service.duration_minutes} Dakika
                      </span>
                      <div className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${isMinimal ? 'rounded-none border-2 border-stone-200 group-hover:border-stone-900 group-hover:bg-stone-900' : 'rounded-full bg-stone-100 ' + themeClasses.hoverIconBg}`}>
                        <ChevronRight className={`w-4 h-4 transition-all ${isMinimal ? 'text-stone-400 group-hover:text-white' : 'text-stone-400 group-hover:text-white'}`} />
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
                    className={`flex items-center gap-4 bg-white border cursor-pointer transition-all duration-300 text-left group relative overflow-hidden ${
                      isMinimal 
                        ? "rounded-none border-2 border-stone-200 p-5 hover:border-stone-900 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:translate-x-0 active:translate-y-0 active:shadow-none" 
                        : "border-stone-200/80 rounded-[2.5rem] p-4 pr-6"
                    } ${themeClasses.borderHover} ${themeClasses.hoverShadow}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${themeClasses.hoverTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none`} />
                    
                    <div className={`w-16 h-16 border shadow-inner flex items-center justify-center text-xl font-black shrink-0 relative z-10 ${isMinimal ? "rounded-none" : "rounded-[1.5rem]"} ${getAvatarColor(s.name)}`}>
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className={`w-full h-full object-cover ${isMinimal ? "rounded-none" : "rounded-[1.5rem]"}`} />
                      ) : (
                        s.name.substring(0, 1).toUpperCase()
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 relative z-10">
                      <p className={`font-black text-stone-900 text-lg transition-all ${isMinimal ? 'uppercase tracking-tighter' : themeClasses.hoverTextMuted}`}>{s.name}</p>
                      <p className="text-xs font-bold text-stone-400 mt-0.5 uppercase tracking-widest">{s.role || "Güzellik Uzmanı"}</p>
                    </div>
                    
                    <div className={`relative z-10 w-8 h-8 flex items-center justify-center transition-all shrink-0 ${isMinimal ? 'rounded-none border-2 border-stone-200 group-hover:border-stone-900 group-hover:bg-stone-900' : 'rounded-full bg-stone-100 ' + themeClasses.hoverIconBg}`}>
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
                const isWeeklyClosed = dayHours?.is_closed;
                
                const dateStr = format(d, "yyyy-MM-dd");
                const exception = exceptionDates.find((ex: any) => 
                  ex.exception_date === dateStr && 
                  (ex.staff_id === null || ex.staff_id === selectedStaff?.id)
                );
                
                const isClosed = isWeeklyClosed || !!exception;
                const closedText = exception ? (exception.reason || "KAPALI") : "KAPALI";
                
                return (
                  <button
                    key={i}
                    disabled={!!isClosed}
                    onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                    className={`flex-shrink-0 w-20 flex flex-col items-center justify-center gap-1.5 py-5 border-2 transition-all duration-300 ${isMinimal ? 'rounded-none' : 'rounded-[2rem]'} ${
                      isSelected
                        ? `${themeClasses.bg} text-white ${themeClasses.borderActive} ${themeClasses.shadow} transform -translate-y-1`
                        : isClosed
                        ? "bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed opacity-60"
                        : `bg-white text-stone-600 border-stone-200/80 ${themeClasses.borderHover} ${themeClasses.hoverBgLightActive}`
                    }`}
                  >
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                      {format(d, "EEE", { locale: tr })}
                    </span>
                    <span className="text-2xl font-black tracking-tighter">
                      {format(d, "d")}
                    </span>
                    {isClosed && <span className="text-[9px] font-bold text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md mt-1 truncate w-16 text-center" title={closedText}>{closedText}</span>}
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
                        className={`py-3.5 text-sm font-bold transition-all duration-300 ${isMinimal ? 'rounded-none border-2' : 'rounded-[1.5rem]'} ${
                          isSelected
                            ? `${themeClasses.bg} text-white ${themeClasses.shadow} transform scale-105`
                            : isBusy
                            ? "bg-stone-50 text-stone-300 cursor-not-allowed line-through relative overflow-hidden"
                            : `bg-stone-50 text-stone-700 hover:bg-white border border-stone-200 ${themeClasses.text.replace('text', 'hover:text')} ${themeClasses.borderHover}`
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
                className={`w-full sm:w-auto font-black py-4 px-12 transition-all flex items-center justify-center gap-2 text-base mx-auto sm:ml-auto sm:mr-0 disabled:opacity-50 disabled:shadow-none ${
                  isMinimal 
                    ? 'rounded-none border-4 border-stone-900 bg-stone-900 text-white hover:bg-white hover:text-stone-900 uppercase tracking-[0.2em]' 
                    : 'bg-stone-900 hover:bg-black text-white rounded-2xl shadow-lg hover:-translate-y-0.5'
                }`}
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
                    className={`w-full bg-white border border-stone-200/80 px-5 py-4 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 shadow-sm transition-all ${isMinimal ? 'rounded-none focus:border-stone-900 focus:ring-stone-100' : 'rounded-2xl ' + themeClasses.focus}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Telefon</label>
                  <input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={customerForm.phone}
                    onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className={`w-full bg-white border border-stone-200/80 px-5 py-4 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 shadow-sm transition-all ${isMinimal ? 'rounded-none focus:border-stone-900 focus:ring-stone-100' : 'rounded-2xl ' + themeClasses.focus}`}
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Not <span className="text-stone-300 font-medium normal-case">(İsteğe bağlı)</span></label>
                  <textarea
                    rows={3}
                    placeholder="Salon uzmanına iletmek istediğiniz notlar..."
                    value={customerForm.note}
                    onChange={e => setCustomerForm({ ...customerForm, note: e.target.value })}
                    className={`w-full bg-white border border-stone-200/80 px-5 py-4 pl-12 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 shadow-sm transition-all resize-none ${isMinimal ? 'rounded-none focus:border-stone-900 focus:ring-stone-100' : 'rounded-2xl ' + themeClasses.focus}`}
                  />
                  <Quote className="absolute left-4 top-10 w-5 h-5 text-stone-300" />
                </div>
              </div>

              <div>
                <div className={`bg-stone-50 border border-stone-200/60 p-6 shadow-sm sticky top-6 ${isMinimal ? 'rounded-none border-2 border-stone-900' : 'rounded-[2.5rem]'}`}>
                  <p className="text-xs font-black text-stone-900 uppercase tracking-widest mb-5 flex items-center gap-2 underline underline-offset-4">
                    <Check className={`w-4 h-4 ${themeClasses.icon}`} /> Randevu Özeti
                  </p>
                  
                  <div className="space-y-3">
                     <div className={`bg-white p-4 border border-stone-100 shadow-sm ${isMinimal ? 'rounded-none border-stone-200' : 'rounded-2xl'}`}>
                       <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Hizmet</p>
                       <p className="text-sm font-black text-stone-900">{selectedService?.name}</p>
                     </div>
                     <div className={`bg-white p-4 border border-stone-100 shadow-sm ${isMinimal ? 'rounded-none border-stone-200' : 'rounded-2xl'}`}>
                       <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Uzman</p>
                       <p className="text-sm font-black text-stone-900">{selectedStaff?.name}</p>
                     </div>
                     <div className={`${themeClasses.bg} p-4 shadow-md text-white ${isMinimal ? 'rounded-none' : 'rounded-2xl'}`}>
                       <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${themeClasses.textMuted}`}>Tarih & Saat</p>
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
                      <p className={`text-2xl font-black ${isLuxury ? "text-purple-600" : "text-stone-900"}`}>₺{selectedService?.price}</p>
                    </div>
                  </div>

                  {salon?.is_deposit_required && salon?.iban && (
                    <div className="mt-6 pt-6 border-t border-stone-200/80">
                      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                        <p className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                          <CreditCard className="w-3.5 h-3.5" /> Kapora Ödemesi
                        </p>
                        <p className="text-xs text-purple-900 font-medium mb-3 leading-relaxed">
                          Randevunuzun onaylanması için hizmet tutarının <strong>%{salon.deposit_percentage || 20}</strong>'lik kısmını aşağıdaki hesaba havale yapmanız gerekmektedir. Açıklamaya adınızı yazmayı unutmayın.
                        </p>
                        <div className="bg-white rounded-xl p-3 border border-purple-100 space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-medium text-xs">Kapora Tutarı:</span>
                            <span className="font-black text-purple-600">₺{Math.round((selectedService?.price || 0) * (salon.deposit_percentage || 20) / 100)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-medium text-xs">Banka:</span>
                            <span className="font-bold text-stone-900">{salon.bank_name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-medium text-xs">Alıcı:</span>
                            <span className="font-bold text-stone-900">{salon.account_holder}</span>
                          </div>
                          <div className="pt-2 border-t border-stone-100 mt-2">
                            <span className="block text-[10px] text-stone-400 font-bold uppercase mb-1">IBAN</span>
                            <span className="font-bold text-stone-900 tracking-wider text-[11px] break-all select-all">{salon.iban}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-purple-100/50">
                          <label className="block text-[10px] font-extrabold text-purple-600 uppercase tracking-widest mb-2">Dekont Sorgu / İşlem No</label>
                          <input
                            type="text"
                            placeholder="Havale işlem numarasını girin"
                            value={customerForm.receiptNo}
                            onChange={e => setCustomerForm({ ...customerForm, receiptNo: e.target.value })}
                            className="w-full bg-white border border-purple-200 px-4 py-3 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-200 rounded-xl transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full mt-6 ${themeClasses.bg} ${themeClasses.bgHover} disabled:opacity-50 text-white font-black py-4 transition-all shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-widest ${isMinimal ? 'rounded-none' : 'rounded-xl ' + themeClasses.shadow}`}
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> İşleminiz yapılıyor...</>
                    ) : (
                      salon?.is_deposit_required && salon?.iban ? (
                        <>Havale Yaptım, Onayla <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Randevuyu Onayla <ChevronRight className="w-4 h-4" /></>
                      )
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