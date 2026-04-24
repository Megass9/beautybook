"use client";
import { useState } from "react";
import { Plus, Calendar, ChevronLeft, ChevronRight, X, Check, Clock, Trash2, Scissors, User } from "lucide-react";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { addMinutes } from "@/lib/utils/time";
import toast from "react-hot-toast";
import type { Appointment, Service, Staff, Customer } from "@/types";

interface Props {
  salonId: string;
  initialAppointments: Appointment[];
  services: Service[];
  staffList: Staff[];
  customers: Customer[];
}

const STATUS_MAP = {
  pending:   { label: "Beklemede",  bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200/60", dot: "bg-amber-400" },
  confirmed: { label: "Onaylı",     bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/60", dot: "bg-emerald-500" },
  cancelled: { label: "İptal",      bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200/60", dot: "bg-red-400" },
  completed: { label: "Tamamlandı", bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200/60", dot: "bg-blue-500" },
};

export default function AppointmentsClient({ salonId, initialAppointments, services, staffList, customers }: Props) {
  const supabase = createClient() as any;
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_id: "", new_customer_name: "", new_customer_phone: "",
    service_id: "", staff_id: "",
    appointment_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "10:00", notes: ""
  });
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const dayApts = appointments.filter(a => {
    try { return isSameDay(parseISO(a.appointment_date), selectedDate); } catch { return false; }
  });

  const selectedService = services.find(s => s.id === form.service_id);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let customerId = form.customer_id;
      
      if (isNewCustomer) {
        const { data: c, error } = await supabase.from("customers").insert({
          salon_id: salonId, name: form.new_customer_name, phone: form.new_customer_phone
        }).select().single();
        if (error) throw error;
        customerId = c.id;
      }

      const endTime = selectedService
        ? addMinutes(form.start_time, selectedService.duration_minutes)
        : addMinutes(form.start_time, 60);

      const { data, error } = await supabase.from("appointments").insert({
        salon_id: salonId,
        customer_id: customerId,
        service_id: form.service_id,
        staff_id: form.staff_id,
        appointment_date: form.appointment_date,
        start_time: form.start_time,
        end_time: endTime,
        status: "confirmed",
        notes: form.notes,
      }).select("*, customer:customers(*), service:services(*), staff:staff(*)").single();

      if (error) {
        if (error.message.includes("conflict")) throw new Error("Bu personel bu saatte doldu!");
        throw error;
      }

      setAppointments(prev => [data as Appointment, ...prev]);
      setShowModal(false);
      toast.success("Randevu oluşturuldu!");
      setForm({ customer_id: "", new_customer_name: "", new_customer_phone: "", service_id: "", staff_id: "", appointment_date: format(new Date(), "yyyy-MM-dd"), start_time: "10:00", notes: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Appointment["status"]) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success("Durum güncellendi");
    }
  };

  const deleteApt = async (id: string) => {
    if (!confirm("Randevu silinsin mi?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (!error) {
      setAppointments(prev => prev.filter(a => a.id !== id));
      toast.success("Randevu silindi");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Randevu Takvimi</h1>
          <p className="text-stone-500 text-sm mt-1">Salonunuzun anlık randevu akışını buradan yönetin.</p>
        </div>
        <button
          onClick={() => { setForm(f => ({ ...f, appointment_date: format(selectedDate, "yyyy-MM-dd") })); setShowModal(true); }}
          className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-[0_8px_20px_rgba(225,29,72,0.25)] hover:shadow-[0_10px_25px_rgba(225,29,72,0.35)] hover:-translate-y-0.5 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Yeni Randevu
        </button>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        
        {/* ── CALENDAR NAV (LEFT) ── */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-7 shadow-[0_4px_25px_rgba(0,0,0,0.02)] sticky top-6">
          <div className="flex items-center justify-between mb-6 bg-stone-50 rounded-2xl p-2 border border-stone-100">
            <button onClick={() => setSelectedDate(d => subDays(d, 1))} className="p-2 hover:bg-white rounded-xl text-stone-600 hover:text-stone-900 transition-all hover:shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-stone-800 capitalize">
              {format(selectedDate, "MMMM yyyy", { locale: tr })}
            </span>
            <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="p-2 hover:bg-white rounded-xl text-stone-600 hover:text-stone-900 transition-all hover:shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center mb-6">
            {["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"].map(d => (
              <div key={d} className="text-[11px] font-bold text-stone-400 mb-2">{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const startOfWeek = new Date(selectedDate);
              startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() - 14 + i);
              const isSelected = isSameDay(startOfWeek, selectedDate);
              const isToday = isSameDay(startOfWeek, new Date());
              const hasApts = appointments.some(a => {
                try { return isSameDay(parseISO(a.appointment_date), startOfWeek); } catch { return false; }
              });
              
              return (
                <div key={i} className="flex justify-center">
                  <button
                    onClick={() => setSelectedDate(new Date(startOfWeek))}
                    className={`relative w-10 h-10 flex items-center justify-center text-sm rounded-2xl transition-all duration-300 outline-none
                      ${isSelected 
                        ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-200 ring-4 ring-rose-50" 
                        : isToday 
                          ? "bg-rose-50 text-rose-700 font-bold hover:bg-rose-100" 
                          : "hover:bg-stone-100 text-stone-600 font-medium"}
                    `}
                  >
                    {startOfWeek.getDate()}
                    {hasApts && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-rose-400 rounded-full" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>Seçili Gün:</span>
            </div>
            <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-lg text-xs font-bold">
              {dayApts.length} Randevu
            </span>
          </div>
        </div>

        {/* ── DAY APPOINTMENTS (RIGHT) ── */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-8 py-6 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-stone-900 text-xl capitalize flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-stone-200 rounded-2xl flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-rose-500" />
                </div>
                {format(selectedDate, "d MMMM, EEEE", { locale: tr })}
              </h2>
            </div>
          </div>

          {dayApts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6 bg-stone-50/30">
              <div className="w-24 h-24 bg-white border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm relative">
                <div className="absolute inset-0 border-4 border-rose-50 rounded-full animate-ping opacity-50" />
                <Calendar className="w-10 h-10 text-stone-300" />
              </div>
              <p className="font-bold text-stone-800 text-xl mb-2">Bu gün randevu yok</p>
              <p className="text-stone-500 text-sm max-w-sm mx-auto mb-8">Takviminiz tertemiz görünüyor. Hemen yeni bir randevu oluşturarak günü değerlendirin.</p>
              <button
                onClick={() => { setForm(f => ({ ...f, appointment_date: format(selectedDate, "yyyy-MM-dd") })); setShowModal(true); }}
                className="btn-primary shadow-lg hover:-translate-y-1 transition-all"
              >
                <Plus className="w-5 h-5" /> Randevu Ekle
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100/80 p-4">
              {dayApts.map((apt: any) => {
                const s = STATUS_MAP[apt.status as keyof typeof STATUS_MAP] || STATUS_MAP.pending;
                return (
                  <div key={apt.id} className="group relative flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-3xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100 w-full">
                    
                    {/* Time block */}
                    <div className="w-16 text-center sm:text-left shrink-0">
                      <p className="text-lg font-black text-stone-900 tabular-nums">{apt.start_time?.slice(0,5)}</p>
                      <p className="text-xs font-semibold text-stone-400 tabular-nums">{apt.end_time?.slice(0,5)}</p>
                    </div>

                    {/* Desktop Divider */}
                    <div className="hidden sm:block w-1.5 h-12 bg-stone-100 rounded-full mx-2" />

                    {/* Avatar */}
                    <div className="relative shrink-0 hidden sm:block">
                      <div className={`absolute -inset-1 rounded-full blur-sm opacity-40 ${s.bg}`} />
                      <div className="relative w-12 h-12 border-2 border-white bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center text-stone-700 text-base font-black shadow-sm ring-1 ring-stone-200">
                        {apt.customer?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-stone-900 text-base truncate">{apt.customer?.name}</p>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${s.bg} ${s.text} border ${s.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-stone-500">
                        <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-2.5 py-1 rounded-lg shadow-sm">
                          <Scissors className="w-3.5 h-3.5 text-rose-500" /> {apt.service?.name}
                        </span>
                        {apt.staff?.name && (
                          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-2.5 py-1 rounded-lg shadow-sm">
                            <User className="w-3.5 h-3.5 text-blue-500" /> {apt.staff.name}
                          </span>
                        )}
                        {apt.service?.price && (
                          <span className="text-rose-600 font-bold ml-1 border-l border-stone-200 pl-3">₺{apt.service.price}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 sm:pt-0 sm:ml-auto w-full sm:w-auto overflow-x-auto">
                      {apt.status === "pending" && (
                        <button onClick={() => updateStatus(apt.id, "confirmed")}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm" title="Onayla">
                          <Check className="w-4 h-4" /> <span className="sm:hidden">Onayla</span>
                        </button>
                      )}
                      
                      {apt.status !== "completed" && apt.status !== "cancelled" && (
                        <button onClick={() => updateStatus(apt.id, "completed")}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm" title="Tamamlandı İşaretle">
                          <Check className="w-4 h-4" /> <span className="sm:hidden">Tamamlandı</span>
                        </button>
                      )}

                      {apt.status !== "cancelled" && apt.status !== "completed" && (
                        <button onClick={() => updateStatus(apt.id, "cancelled")}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm" title="İptal">
                          <X className="w-4 h-4" /> <span className="sm:hidden">İptal</span>
                        </button>
                      )}

                      <div className="hidden sm:block w-px h-6 bg-stone-200 mx-1" />

                      <button onClick={() => deleteApt(apt.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-red-600 text-stone-500 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm" title="Sil">
                        <Trash2 className="w-4 h-4" /> <span className="sm:hidden">Sil</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── TÜM RANDEVULAR (LİSTE GÖRÜNÜMÜ) ── */}
      <div className="bg-white rounded-[2.5rem] border border-stone-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden mt-8 animate-fade-up delay-200">
        <div className="px-8 py-6 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-extrabold text-stone-900 text-xl flex items-center gap-3">
             <div className="w-10 h-10 bg-white border border-stone-200 rounded-2xl flex items-center justify-center shadow-sm">
               <Calendar className="w-5 h-5 text-indigo-500" />
             </div>
             Tüm Randevular (Genel Liste)
          </h2>
          <p className="text-sm text-stone-500 font-medium whitespace-nowrap">Toplam {appointments.length} randevu</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/60 text-xs font-bold text-stone-400 uppercase tracking-wider bg-white">
                <th className="py-5 pl-8 font-semibold">Tarih / Saat</th>
                <th className="py-5 font-semibold">Müşteri</th>
                <th className="py-5 font-semibold">Hizmet & Personel</th>
                <th className="py-5 font-semibold">Tutar</th>
                <th className="py-5 font-semibold text-right pr-8">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100/80 bg-white">
              {appointments.slice(0, 50).map((apt: any) => {
                const s = STATUS_MAP[apt.status as keyof typeof STATUS_MAP] || STATUS_MAP.pending;
                return (
                  <tr key={`all-${apt.id}`} className="hover:bg-stone-50/60 transition-colors group">
                    <td className="py-5 pl-8 text-sm">
                      <p className="font-bold text-stone-900 whitespace-nowrap">{format(new Date(apt.appointment_date), "d MMM yyyy", { locale: tr })}</p>
                      <p className="text-xs font-semibold text-stone-500 mt-1">{apt.start_time?.slice(0,5)} - {apt.end_time?.slice(0,5)}</p>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center text-stone-700 text-xs font-black shrink-0 ring-1 ring-stone-200">
                           {apt.customer?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <p className="font-bold text-stone-800 text-sm whitespace-nowrap">{apt.customer?.name}</p>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex flex-col gap-1.5 whitespace-nowrap">
                        <p className="text-xs font-bold text-stone-700 flex items-center gap-1.5"><Scissors className="w-3.5 h-3.5 text-rose-500"/> {apt.service?.name}</p>
                        <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-blue-500"/> {apt.staff?.name}</p>
                      </div>
                    </td>
                    <td className="py-5">
                      <p className="text-base font-black text-rose-600">₺{apt.service?.price}</p>
                    </td>
                    <td className="py-5 pr-8 text-right">
                       <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full ${s.bg} ${s.text} border ${s.border} shadow-sm whitespace-nowrap`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                         {s.label}
                       </span>
                    </td>
                  </tr>
                );
              })}
              {appointments.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-16 text-center">
                     <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Calendar className="w-6 h-6 text-stone-300" />
                     </div>
                     <p className="text-sm font-bold text-stone-700">Kayıtlı randevu bulunmuyor.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {appointments.length > 50 && (
          <div className="px-8 py-4 border-t border-stone-100 bg-stone-50/50 text-center text-xs font-semibold text-stone-500">
            Son 50 randevu gösteriliyor.
          </div>
        )}
      </div>

      {/* ── NEW APPOINTMENT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-fade-up">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900">Yeni Randevu</h3>
                  <p className="text-xs text-stone-500 font-medium">Randevu detaylarını girin</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              
              {/* Customer */}
              <div className="bg-stone-50 p-4 rounded-3xl border border-stone-200/60">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Müşteri Seçimi</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="sr-only" checked={isNewCustomer} onChange={() => setIsNewCustomer(!isNewCustomer)} />
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${isNewCustomer ? "bg-rose-500" : "bg-stone-300"}`}>
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isNewCustomer ? "translate-x-4" : ""}`} />
                    </div>
                    <span className="text-xs font-semibold text-stone-500 group-hover:text-stone-700">Yeni müşteri</span>
                  </label>
                </div>
                
                {isNewCustomer ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input className="input !bg-white" placeholder="Ad Soyad" required
                        value={form.new_customer_name} onChange={e => setForm({ ...form, new_customer_name: e.target.value })} />
                    </div>
                    <div>
                      <input className="input !bg-white" placeholder="Telefon (05...)" required
                        value={form.new_customer_phone} onChange={e => setForm({ ...form, new_customer_phone: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <select className="input !bg-white" required value={form.customer_id}
                    onChange={e => setForm({ ...form, customer_id: e.target.value })}>
                    <option value="">Kaydedilmiş müşteri seçin...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                  </select>
                )}
              </div>

              {/* Service & Staff Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs uppercase tracking-wider">Hizmet</label>
                  <select className="input" required value={form.service_id}
                    onChange={e => setForm({ ...form, service_id: e.target.value })}>
                    <option value="">Seçiniz...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label text-xs uppercase tracking-wider">Personel</label>
                  <select className="input" required value={form.staff_id}
                    onChange={e => setForm({ ...form, staff_id: e.target.value })}>
                    <option value="">Seçiniz...</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                  </select>
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs uppercase tracking-wider">Tarih</label>
                  <input type="date" className="input" required value={form.appointment_date}
                    onChange={e => setForm({ ...form, appointment_date: e.target.value })} />
                </div>
                <div>
                  <label className="label text-xs uppercase tracking-wider">Saat</label>
                  <input type="time" className="input" required value={form.start_time}
                    onChange={e => setForm({ ...form, start_time: e.target.value })} />
                </div>
              </div>

              {selectedService && (
                <div className="bg-gradient-to-r from-rose-50 to-white border border-rose-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Hesaplanan Bitiş</span>
                    <span className="text-sm font-black text-rose-900 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-rose-500" /> {addMinutes(form.start_time, selectedService.duration_minutes)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tutar</span>
                    <span className="block text-xl font-black text-rose-600">₺{selectedService.price}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="label text-xs uppercase tracking-wider">Notlar (İsteğe bağlı)</label>
                <textarea className="input resize-none py-3" rows={2} placeholder="Randevu için özel notlarınız..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <button type="button" onClick={() => setShowModal(false)} className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={loading} className="w-2/3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5 flex justify-center items-center gap-2 relative overflow-hidden group">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">Randevu Oluştur</span>
                      <Plus className="w-5 h-5 relative z-10" />
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
