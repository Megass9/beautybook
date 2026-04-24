'use client'
import { useState } from 'react'
import { Customer } from '@/types/database'
import { Search, Users, Phone, ChevronDown, ChevronUp } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

export function CustomersClient({ customers, appointments }: { customers: Customer[]; appointments: any[] }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const getHistory = (customerId: string) =>
    appointments.filter(a => a.customer_id === customerId).slice(0, 10)

  const statusMap: Record<string, string> = {
    pending: 'Bekliyor', confirmed: 'Onaylı', cancelled: 'İptal', completed: 'Tamamlandı'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Müşteriler</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">{customers.length} müşteri kayıtlı</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="İsim veya telefon ile ara..."
          className="input w-full pl-10 pr-4 py-3 bg-white shadow-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Users className="w-12 h-12 text-sand-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">
            {search ? 'Aramanızla eşleşen müşteri bulunamadı' : 'Henüz müşteri kaydı yok'}
          </p>
          <p className="text-charcoal-400 text-sm mt-1">Müşteriler randevu aldığında otomatik eklenecek</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {filtered.map((customer, i) => {
            const history = getHistory(customer.id)
            const isExpanded = expanded === customer.id
            return (
              <div key={customer.id} className={i > 0 ? 'border-t border-sand-100' : ''}>
                <div
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-sand-50/50 transition-colors cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : customer.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center text-rose-700 font-bold text-sm flex-shrink-0">
                      {customer.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-charcoal-900 text-sm">{customer.name}</div>
                      <div className="flex items-center gap-1 text-xs text-charcoal-400">
                        <Phone className="w-3 h-3" /> {customer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-sand-100 text-charcoal-600 px-2.5 py-1 rounded-full font-medium">
                      {history.length} randevu
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-charcoal-400" /> : <ChevronDown className="w-4 h-4 text-charcoal-400" />}
                  </div>
                </div>

                {isExpanded && history.length > 0 && (
                  <div className="px-5 pb-4 bg-sand-50/50">
                    <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2">Randevu Geçmişi</div>
                    <div className="space-y-1.5">
                      {history.map((apt: any, j: number) => (
                        <div key={j} className="flex items-center justify-between text-xs">
                          <span className="text-charcoal-600">{apt.service?.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-charcoal-400">{format(parseISO(apt.start_time), 'd MMM yyyy', { locale: tr })}</span>
                            <span className={`px-1.5 py-0.5 rounded-full font-medium ${
                              apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {statusMap[apt.status] || apt.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
