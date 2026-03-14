'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Salon, Service, Staff, WorkingHours } from '@/types/database'
import { formatCurrency, formatDuration, generateTimeSlots } from '@/lib/utils'
import { format, addDays, isBefore, startOfDay, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ChevronRight, ChevronLeft, CheckCircle2, Calendar, Clock, User, Scissors } from 'lucide-react'
import toast from 'react-hot-toast'

type Step = 1 | 2 | 3 | 4 | 5

const STEPS = [
  { num: 1, label: 'Hizmet' },
  { num: 2, label: 'Personel' },
  { num: 3, label: 'Tarih' },
  { num: 4, label: 'Saat' },
  { num: 5, label: 'Bilgiler' },
]

export function BookingPageClient({
  salon, services, staff, staffServices, workingHours
}: {
  salon: Salon; services: Service[]; staff: Staff[]
  staffServices: { staff_id: string; service_id: string }[]
  workingHours: WorkingHours[]
}) {
  const supabase = createClient()
  const [step, setStep] = useState<Step>(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [bookedApt, setBookedApt] = useState<any>(null)

  // Available staff for selected service
  const availableStaff = useMemo(() => {
    if (!selectedService) return staff
    const staffWithService = staffServices.filter(ss => ss.service_id === selectedService.id).map(ss => ss.staff_id)
    if (staffWithService.length === 0) return staff // show all if no mapping
    return staff.filter(s => staffWithService.includes(s.id))
  }, [selectedService, staff, staffServices])

  // Date picker: next 30 days
  const availableDates = useMemo(() => {
    const dates: Date[] = []
    for (let i = 0; i < 30; i++) {
      const d = addDays(new Date(), i)
      const dow = d.getDay()
      const wh = workingHours.find(w => w.day_of_week === dow)
      if (!wh || !wh.is_closed) dates.push(d)
    }
    return dates
  }, [workingHours])

  // Time slots
  const [takenTimes, setTakenTimes] = useState<string[]>([])
  const timeSlots = useMemo(() => {
    if (!selectedDate) return []
    const dow = selectedDate.getDay()
    const wh = workingHours.find(w => w.day_of_week === dow)
    if (!wh || wh.is_closed) return []
    return generateTimeSlots(wh.open_time, wh.close_time, 30)
  }, [selectedDate, workingHours])

  const loadTakenTimes = async (date: Date) => {
    if (!selectedStaff || !selectedService) return
    const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999)
    const { data } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('staff_id', selectedStaff.id)
      .neq('status', 'cancelled')
      .gte('start_time', dayStart.toISOString())
      .lte('start_time', dayEnd.toISOString())
    
    const taken: string[] = []
    ;(data || []).forEach((apt: any) => {
      const startH = new Date(apt.start_time)
      const endH = new Date(apt.end_time)
      const serviceDur = selectedService.duration_minutes
      // Mark all slots that overlap
      timeSlots.forEach(slot => {
        const [h, m] = slot.split(':').map(Number)
        const slotStart = new Date(date); slotStart.setHours(h, m, 0, 0)
        const slotEnd = new Date(slotStart.getTime() + serviceDur * 60000)
        if (slotStart < endH && slotEnd > startH) taken.push(slot)
      })
    })
    setTakenTimes(taken)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    loadTakenTimes(date)
    setStep(4)
  }

  const handleBook = async () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      toast.error('Lütfen tüm alanları doldurun'); return
    }
    setLoading(true)
    try {
      const startTime = new Date(selectedDate)
      const [h, m] = selectedTime.split(':').map(Number)
      startTime.setHours(h, m, 0, 0)
      const endTime = new Date(startTime.getTime() + selectedService.duration_minutes * 60000)

      // Final conflict check
      const { data: conflict } = await supabase
        .from('appointments').select('id')
        .eq('staff_id', selectedStaff.id).neq('status', 'cancelled')
        .lt('start_time', endTime.toISOString()).gt('end_time', startTime.toISOString())
      
      if (conflict && conflict.length > 0) {
        toast.error('Bu saat dolu, başka bir saat seçin'); setLoading(false); return
      }

      // Find/create customer
      let customerId: string
      const { data: ec } = await supabase.from('customers').select('id').eq('salon_id', salon.id).eq('phone', customerPhone).single()
      if (ec) {
        customerId = ec.id
      } else {
        const { data: nc, error: ce } = await supabase.from('customers').insert({ salon_id: salon.id, name: customerName, phone: customerPhone }).select().single()
        if (ce) throw ce
        customerId = nc.id
      }

      const { data: apt, error: ae } = await supabase.from('appointments').insert({
        salon_id: salon.id, staff_id: selectedStaff.id, service_id: selectedService.id,
        customer_id: customerId, start_time: startTime.toISOString(), end_time: endTime.toISOString(),
        status: 'confirmed'
      }).select().single()
      if (ae) throw ae

      setBookedApt(apt)
      setConfirmed(true)
      toast.success('Randevunuz oluşturuldu!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Randevunuz Onaylandı! 🎉</h2>
        <p className="text-stone-500 text-sm mb-6">Randevu bilgilerinizi kaydetmeyi unutmayın.</p>
        <div className="bg-stone-50 rounded-2xl p-5 text-left space-y-3 mb-6 border border-stone-100">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Salon</span>
            <span className="font-medium text-stone-900">{salon.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Hizmet</span>
            <span className="font-medium text-stone-900">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Personel</span>
            <span className="font-medium text-stone-900">{selectedStaff?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Tarih & Saat</span>
            <span className="font-medium text-stone-900">
              {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: tr })} · {selectedTime}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Ücret</span>
            <span className="font-bold text-rose-500">{selectedService && formatCurrency(selectedService.price)}</span>
          </div>
        </div>
        <button onClick={() => { setConfirmed(false); setStep(1); setSelectedService(null); setSelectedStaff(null); setSelectedDate(null); setSelectedTime(null); setCustomerName(''); setCustomerPhone('') }}
          className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
          Yeni Randevu Al
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Progress */}
      <div className="bg-stone-50 border-b border-stone-100 px-6 py-4">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s.num ? 'bg-emerald-500 text-white' : step === s.num ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-500'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.num ? 'text-rose-600' : 'text-stone-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded mx-1 ${step > s.num ? 'bg-emerald-300' : 'bg-stone-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-1 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-rose-400" /> Hizmet Seçin
            </h2>
            <p className="text-stone-500 text-sm mb-5">Almak istediğiniz hizmeti seçin</p>
            <div className="space-y-2">
              {services.map(svc => (
                <button key={svc.id} onClick={() => { setSelectedService(svc); setStep(2) }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedService?.id === svc.id ? 'border-rose-400 bg-rose-50' : 'border-stone-100 hover:border-rose-200 hover:bg-rose-50/30'
                  }`}>
                  <div>
                    <div className="font-medium text-stone-900 text-sm">{svc.name}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{formatDuration(svc.duration_minutes)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-500">{formatCurrency(svc.price)}</span>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Staff */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Geri
            </button>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-rose-400" /> Personel Seçin
            </h2>
            <p className="text-stone-500 text-sm mb-5">Randevunuzu almak istediğiniz personeli seçin</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableStaff.map(s => (
                <button key={s.id} onClick={() => { setSelectedStaff(s); setStep(3) }}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                    selectedStaff?.id === s.id ? 'border-rose-400 bg-rose-50' : 'border-stone-100 hover:border-rose-200 hover:bg-rose-50/30'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center text-rose-700 font-bold text-lg mb-2">
                    {s.name[0]}
                  </div>
                  <div className="font-medium text-stone-900 text-sm text-center">{s.name}</div>
                  {s.title && <div className="text-xs text-stone-400 text-center mt-0.5">{s.title}</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Geri
            </button>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-400" /> Tarih Seçin
            </h2>
            <p className="text-stone-500 text-sm mb-5">Randevu almak istediğiniz tarihi seçin</p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {availableDates.map(date => {
                const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                return (
                  <button key={date.toString()} onClick={() => handleDateSelect(date)}
                    className={`flex flex-col items-center py-3 px-1 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-stone-100 hover:border-rose-200 hover:bg-rose-50/30 text-stone-700'
                    }`}>
                    <span className="text-xs text-stone-400 mb-0.5">{format(date, 'EEE', { locale: tr })}</span>
                    <span className="font-bold text-base">{format(date, 'd')}</span>
                    <span className="text-xs">{format(date, 'MMM', { locale: tr })}</span>
                    {isToday && <span className="text-xs text-rose-500 font-medium mt-0.5">Bugün</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Time */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Geri
            </button>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-400" /> Saat Seçin
            </h2>
            <p className="text-stone-500 text-sm mb-5">
              {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: tr })} için uygun saat
            </p>
            {timeSlots.length === 0 ? (
              <p className="text-stone-400 text-center py-8">Bu tarihte uygun saat bulunamadı</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map(slot => {
                  const isTaken = takenTimes.includes(slot)
                  const isSelected = selectedTime === slot
                  return (
                    <button key={slot} disabled={isTaken} onClick={() => { setSelectedTime(slot); setStep(5) }}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        isTaken ? 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed' :
                        isSelected ? 'border-rose-400 bg-rose-50 text-rose-700' :
                        'border-stone-100 hover:border-rose-300 hover:bg-rose-50/30 text-stone-700'
                      }`}>
                      {slot}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Contact */}
        {step === 5 && (
          <div>
            <button onClick={() => setStep(4)} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Geri
            </button>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-1">Bilgilerinizi Girin</h2>
            <p className="text-stone-500 text-sm mb-5">Randevu onayı için iletişim bilgilerinizi girin</p>

            {/* Summary */}
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 mb-5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-stone-400">Hizmet: </span><span className="font-medium text-stone-800">{selectedService?.name}</span></div>
                <div><span className="text-stone-400">Personel: </span><span className="font-medium text-stone-800">{selectedStaff?.name}</span></div>
                <div><span className="text-stone-400">Tarih: </span><span className="font-medium text-stone-800">{selectedDate && format(selectedDate, 'd MMM yyyy', { locale: tr })}</span></div>
                <div><span className="text-stone-400">Saat: </span><span className="font-medium text-stone-800">{selectedTime}</span></div>
              </div>
              <div className="mt-2 pt-2 border-t border-rose-100 flex justify-between items-center">
                <span className="text-xs text-stone-400">Toplam</span>
                <span className="font-bold text-rose-600 text-sm">{selectedService && formatCurrency(selectedService.price)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Adınız Soyadınız *</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ad Soyad"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm text-stone-900 placeholder-stone-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Telefon Numaranız *</label>
                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="0532 000 00 00"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm text-stone-900 placeholder-stone-400" />
              </div>
              <button onClick={handleBook} disabled={loading || !customerName || !customerPhone}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl text-sm transition-all shadow-sm hover:shadow-md">
                {loading ? 'Randevu Oluşturuluyor...' : '🎉 Randevuyu Onayla'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
