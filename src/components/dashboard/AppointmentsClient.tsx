'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, X, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

type Apt = any

const STATUS_MAP = {
  pending: { label: 'Bekliyor', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Onaylı', cls: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'İptal', cls: 'bg-red-100 text-red-700 border-red-200' },
  completed: { label: 'Tamamlandı', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}

const HOURS = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`)

export function AppointmentsClient({ salonId, initialAppointments, staff, services, customers }: {
  salonId: string; initialAppointments: Apt[]
  staff: any[]; services: any[]; customers: any[]
}) {
  const supabase = createClient()
  const [appointments, setAppointments] = useState(initialAppointments)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [view, setView] = useState<'week' | 'list'>('list')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedApt, setSelectedApt] = useState<Apt | null>(null)
  const [form, setForm] = useState({
    staff_id: '', service_id: '', date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00', customer_name: '', customer_phone: '', notes: ''
  })

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const dayApts = useMemo(() => {
    return weekDays.map(day => ({
      day,
      apts: appointments.filter(a => isSameDay(parseISO(a.start_time), day) && a.status !== 'cancelled')
    }))
  }, [appointments, currentWeek])

  const handleStatusChange = async (aptId: string, status: string) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', aptId)
    if (error) { toast.error(error.message); return }
    setAppointments(a => a.map(x => x.id === aptId ? { ...x, status } : x))
    toast.success('Durum güncellendi')
  }

  const handleCreate = async () => {
    if (!form.staff_id || !form.service_id || !form.customer_name || !form.customer_phone) {
      toast.error('Zorunlu alanları doldurun'); return
    }
    setLoading(true)
    try {
      const service = services.find(s => s.id === form.service_id)
      const startTime = new Date(`${form.date}T${form.time}:00`)
      const endTime = new Date(startTime.getTime() + (service?.duration_minutes || 60) * 60000)

      // Check conflict
      const { data: conflict } = await supabase
        .from('appointments')
        .select('id')
        .eq('staff_id', form.staff_id)
        .neq('status', 'cancelled')
        .or(`start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()}`)
        .single()
      
      if (conflict) { toast.error('Bu personel bu saatte başka bir randevuya sahip!'); setLoading(false); return }

      // Find or create customer
      let customerId: string
      const { data: existingCustomer } = await supabase
        .from('customers').select('id').eq('salon_id', salonId).eq('phone', form.customer_phone).single()
      
      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const { data: newCustomer, error: custErr } = await supabase.from('customers')
          .insert({ salon_id: salonId, name: form.customer_name, phone: form.customer_phone }).select().single()
        if (custErr) throw custErr
        customerId = newCustomer.id
      }

      const { data: newApt, error: aptErr } = await supabase.from('appointments').insert({
        salon_id: salonId, staff_id: form.staff_id, service_id: form.service_id,
        customer_id: customerId, start_time: startTime.toISOString(), end_time: endTime.toISOString(),
        status: 'confirmed', notes: form.notes
      }).select('*, staff:staff_id(name), service:service_id(name, price, duration_minutes), customer:customer_id(name, phone)').single()
      
      if (aptErr) throw aptErr
      setAppointments(a => [newApt, ...a])
      toast.success('Randevu oluşturuldu!')
      setShowModal(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const upcomingApts = appointments.filter(a => new Date(a.start_time) >= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  const pastApts = appointments.filter(a => new Date(a.start_time) < new Date() || a.status === 'cancelled')
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Randevular</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">{upcomingApts.length} yaklaşan randevu</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex bg-sand-100 rounded-xl p-1">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'list' ? 'bg-white shadow-sm text-charcoal-900' : 'text-charcoal-500'}`}>Liste</button>
            <button onClick={() => setView('week')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'week' ? 'bg-white shadow-sm text-charcoal-900' : 'text-charcoal-500'}`}>Hafta</button>
          </div>
          <button onClick={() => { setForm({ staff_id: '', service_id: '', date: format(new Date(), 'yyyy-MM-dd'), time: '10:00', customer_name: '', customer_phone: '', notes: '' }); setShowModal(true) }}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Randevu
          </button>
        </div>
      </div>

      {/* Week view */}
      {view === 'week' && (
        <div className="card overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200">
            <button onClick={() => setCurrentWeek(w => subWeeks(w, 1))} className="p-1.5 rounded-lg hover:bg-sand-100 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-charcoal-700">
              {format(weekDays[0], 'd MMM', { locale: tr })} – {format(weekDays[6], 'd MMM yyyy', { locale: tr })}
            </span>
            <button onClick={() => setCurrentWeek(w => addWeeks(w, 1))} className="p-1.5 rounded-lg hover:bg-sand-100 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7">
            {dayApts.map(({ day, apts }) => (
              <div key={day.toString()} className={`p-2 border-r border-sand-200 last:border-0 min-h-[100px] ${isSameDay(day, new Date()) ? 'bg-rose-50/50' : ''}`}>
                <div className={`text-center mb-2 ${isSameDay(day, new Date()) ? 'text-rose-600' : 'text-charcoal-500'}`}>
                  <div className="text-xs font-medium">{format(day, 'EEE', { locale: tr })}</div>
                  <div className={`text-lg font-bold w-7 h-7 rounded-full mx-auto flex items-center justify-center ${isSameDay(day, new Date()) ? 'bg-rose-500 text-white' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="space-y-1">
                  {apts.slice(0, 3).map(apt => (
                    <div key={apt.id} className="bg-rose-100 text-rose-700 text-xs px-1.5 py-0.5 rounded-md truncate cursor-pointer hover:bg-rose-200 transition-colors" title={`${apt.customer?.name} - ${apt.service?.name}`}>
                      {format(parseISO(apt.start_time), 'HH:mm')} {apt.customer?.name}
                    </div>
                  ))}
                  {apts.length > 3 && <div className="text-xs text-charcoal-400 text-center">+{apts.length - 3}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-6">
          {upcomingApts.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">Yaklaşan</h2>
              <div className="card overflow-hidden">
                {upcomingApts.map((apt, i) => (
                  <div key={apt.id} className={`flex items-center justify-between px-5 py-3.5 hover:bg-sand-50/50 transition-colors ${i > 0 ? 'border-t border-sand-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-center w-10">
                        <div className="text-xs text-charcoal-400">{format(parseISO(apt.start_time), 'EEE', { locale: tr })}</div>
                        <div className="font-bold text-charcoal-800">{format(parseISO(apt.start_time), 'd')}</div>
                      </div>
                      <div className="w-px h-10 bg-sand-100" />
                      <div>
                        <div className="font-medium text-charcoal-900 text-sm">{apt.customer?.name}</div>
                        <div className="text-xs text-charcoal-400">{apt.service?.name} · {apt.staff?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold text-charcoal-700">{format(parseISO(apt.start_time), 'HH:mm')}</div>
                        {apt.service?.price && <div className="text-xs text-charcoal-400">{formatCurrency(apt.service.price)}</div>}
                      </div>
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer appearance-none ${STATUS_MAP[apt.status as keyof typeof STATUS_MAP]?.cls}`}
                      >
                        <option value="pending">Bekliyor</option>
                        <option value="confirmed">Onaylı</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastApts.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">Geçmiş</h2>
              <div className="card overflow-hidden opacity-70">
                {pastApts.slice(0, 20).map((apt, i) => (
                  <div key={apt.id} className={`flex items-center justify-between px-5 py-3 ${i > 0 ? 'border-t border-sand-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-center w-10">
                        <div className="text-xs text-charcoal-400">{format(parseISO(apt.start_time), 'd MMM', { locale: tr })}</div>
                      </div>
                      <div>
                        <div className="font-medium text-charcoal-700 text-sm">{apt.customer?.name}</div>
                        <div className="text-xs text-charcoal-400">{apt.service?.name}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_MAP[apt.status as keyof typeof STATUS_MAP]?.cls}`}>
                      {STATUS_MAP[apt.status as keyof typeof STATUS_MAP]?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && (
            <div className="card p-16 text-center">
              <Calendar className="w-12 h-12 text-sand-200 mx-auto mb-3" />
              <p className="text-charcoal-500 font-medium">Henüz randevu yok</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-charcoal-900">Yeni Randevu</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-sand-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Hizmet *</label>
                <select value={form.service_id} onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))}
                  className="input">
                  <option value="">Seçin</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} dk) - {formatCurrency(s.price)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Personel *</label>
                <select value={form.staff_id} onChange={e => setForm(f => ({ ...f, staff_id: e.target.value }))}
                  className="input">
                  <option value="">Seçin</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tarih *</label>
                  <input type="date" value={form.date} min={format(new Date(), 'yyyy-MM-dd')} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="input" />
                </div>
                <div>
                  <label className="label">Saat *</label>
                  <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="input" />
                </div>
              </div>
              <div>
                <label className="label">Müşteri Adı *</label>
                <input type="text" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} placeholder="Ad Soyad"
                  className="input" />
              </div>
              <div>
                <label className="label">Müşteri Telefonu *</label>
                <input type="tel" value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))} placeholder="0532..."
                  className="input" />
              </div>
              <div>
                <label className="label">Notlar</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Özel istekler..."
                  className="input resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-sand-100 hover:bg-sand-200 text-charcoal-700 font-medium py-3 rounded-xl text-sm">İptal</button>
                <button onClick={handleCreate} disabled={loading} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm">
                  {loading ? 'Oluşturuluyor...' : 'Randevu Oluştur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
