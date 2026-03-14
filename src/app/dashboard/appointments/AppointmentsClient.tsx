"use client";
import { useState } from "react";
import { Plus, Calendar, ChevronLeft, ChevronRight, X, Check, Clock, Trash2 } from "lucide-react";
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
  pending: { label: "Beklemede", class: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Onaylı", class: "bg-green-100 text-green-700" },
  cancelled: { label: "İptal", class: "bg-red-100 text-red-700" },
  completed: { label: "Tamamlandı", class: "bg-blue-100 text-blue-700" },
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-charcoal-900">Randevular</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Yeni Randevu
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar nav */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setSelectedDate(d => subDays(d, 1))} className="p-1.5 hover:bg-sand-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-sm text-charcoal-700">
              {format(selectedDate, "d MMMM yyyy", { locale: tr })}
            </span>
            <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="p-1.5 hover:bg-sand-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* Week view */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"].map(d => (
              <div key={d} className="text-xs text-charcoal-400 py-1">{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const startOfWeek = new Date(selectedDate);
              startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() - 14 + i);
              const isSelected = isSameDay(startOfWeek, selectedDate);
              const hasApts = appointments.some(a => {
                try { return isSameDay(parseISO(a.appointment_date), startOfWeek); } catch { return false; }
              });
              return (
                <button key={i}
                  onClick={() => setSelectedDate(new Date(startOfWeek))}
                  className={`relative text-xs py-2 rounded-lg transition-all ${
                    isSelected ? "bg-rose-600 text-white font-medium" : "hover:bg-sand-100 text-charcoal-600"
                  }`}>
                  {startOfWeek.getDate()}
                  {hasApts && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-400 rounded-full" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-sand-100">
            <p className="text-xs text-charcoal-400">{dayApts.length} randevu bu gün</p>
          </div>
        </div>

        {/* Day appointments */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-medium text-charcoal-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500" />
            {format(selectedDate, "d MMMM, EEEE", { locale: tr })}
          </h2>
          {dayApts.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-10 h-10 text-sand-200 mx-auto mb-3" />
              <p className="text-charcoal-400 text-sm">Bu gün randevu yok</p>
              <button onClick={() => { setForm(f => ({ ...f, appointment_date: format(selectedDate, "yyyy-MM-dd") })); setShowModal(true); }}
                className="btn-primary mt-4 text-sm">
                <Plus className="w-4 h-4" /> Randevu Ekle
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayApts.map((apt: any) => {
                const statusInfo = STATUS_MAP[apt.status as keyof typeof STATUS_MAP];
                return (
                  <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl border border-sand-100 hover:border-rose-200 transition-colors bg-white">
                    <div className="text-center min-w-[50px]">
                      <p className="font-mono font-bold text-charcoal-800 text-sm">{apt.start_time?.slice(0,5)}</p>
                      <p className="text-xs text-charcoal-400">{apt.end_time?.slice(0,5)}</p>
                    </div>
                    <div className="w-px h-10 bg-rose-200" />
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-sm font-bold text-rose-600 flex-shrink-0">
                      {apt.customer?.name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal-800 text-sm">{apt.customer?.name}</p>
                      <p className="text-xs text-charcoal-400">{apt.service?.name} · {apt.staff?.name}</p>
                      {apt.service?.price && <p className="text-xs font-medium text-rose-600 mt-0.5">₺{apt.service.price}</p>}
                    </div>
                    <span className={`badge text-xs ${statusInfo.class}`}>{statusInfo.label}</span>
                    <div className="flex items-center gap-1">
                      {apt.status === "pending" && (
                        <button onClick={() => updateStatus(apt.id, "confirmed")}
                          className="w-7 h-7 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors" title="Onayla">
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        </button>
                      )}
                      {apt.status !== "cancelled" && apt.status !== "completed" && (
                        <button onClick={() => updateStatus(apt.id, "cancelled")}
                          className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors" title="İptal">
                          <X className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      )}
                      <button onClick={() => deleteApt(apt.id)}
                        className="w-7 h-7 bg-sand-50 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors" title="Sil">
                        <Trash2 className="w-3.5 h-3.5 text-charcoal-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-charcoal-900">Yeni Randevu</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-sand-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Customer */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="label mb-0">Müşteri</label>
                  <button type="button" onClick={() => setIsNewCustomer(!isNewCustomer)}
                    className="text-xs text-rose-600 hover:underline">
                    {isNewCustomer ? "Mevcut müşteri seç" : "+ Yeni müşteri"}
                  </button>
                </div>
                {isNewCustomer ? (
                  <div className="space-y-2">
                    <input className="input" placeholder="Müşteri adı" required
                      value={form.new_customer_name} onChange={e => setForm({ ...form, new_customer_name: e.target.value })} />
                    <input className="input" placeholder="Telefon" required
                      value={form.new_customer_phone} onChange={e => setForm({ ...form, new_customer_phone: e.target.value })} />
                  </div>
                ) : (
                  <select className="input" required value={form.customer_id}
                    onChange={e => setForm({ ...form, customer_id: e.target.value })}>
                    <option value="">Müşteri seçin</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                  </select>
                )}
              </div>
              {/* Service */}
              <div>
                <label className="label">Hizmet</label>
                <select className="input" required value={form.service_id}
                  onChange={e => setForm({ ...form, service_id: e.target.value })}>
                  <option value="">Hizmet seçin</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} — ₺{s.price} ({s.duration_minutes} dk)</option>)}
                </select>
              </div>
              {/* Staff */}
              <div>
                <label className="label">Personel</label>
                <select className="input" required value={form.staff_id}
                  onChange={e => setForm({ ...form, staff_id: e.target.value })}>
                  <option value="">Personel seçin</option>
                  {staffList.map(s => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
                </select>
              </div>
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tarih</label>
                  <input type="date" className="input" required value={form.appointment_date}
                    onChange={e => setForm({ ...form, appointment_date: e.target.value })} />
                </div>
                <div>
                  <label className="label">Saat</label>
                  <input type="time" className="input" required value={form.start_time}
                    onChange={e => setForm({ ...form, start_time: e.target.value })} />
                </div>
              </div>
              {selectedService && (
                <div className="bg-rose-50 rounded-xl p-3 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-700">Bitiş: <strong>{addMinutes(form.start_time, selectedService.duration_minutes)}</strong></span>
                  <span className="text-rose-500 ml-auto font-medium">₺{selectedService.price}</span>
                </div>
              )}
              <div>
                <label className="label">Notlar (isteğe bağlı)</label>
                <textarea className="input resize-none" rows={2} placeholder="Müşteri notları..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">İptal</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? "Kaydediliyor..." : "Randevu Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
