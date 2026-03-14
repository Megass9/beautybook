'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Service } from '@/types/database'
import { formatCurrency, formatDuration } from '@/lib/utils'
import { Plus, Pencil, Trash2, Scissors, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Saç', 'Manikür/Pedikür', 'Kaş/Kirpik', 'Cilt Bakımı', 'Masaj', 'Epilasyon', 'Diğer']

export function ServicesClient({ salonId, initialServices }: { salonId: string; initialServices: Service[] }) {
  const supabase = createClient() as any
  const [services, setServices] = useState(initialServices)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', duration_minutes: 30, price: 0, category: 'Saç' })

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', duration_minutes: 30, price: 0, category: 'Saç' }); setShowModal(true) }
  const openEdit = (s: Service) => { setEditing(s); setForm({ name: s.name, description: s.description || '', duration_minutes: s.duration_minutes, price: s.price, category: s.category || 'Saç' }); setShowModal(true) }

  const handleSave = async () => {
    if (!form.name || form.price < 0) { toast.error('Hizmet adı ve fiyat gereklidir'); return }
    setLoading(true)
    try {
      if (editing) {
        const { data, error } = await supabase.from('services').update({ ...form, is_active: true }).eq('id', editing.id).select().single()
        if (error) throw error
        setServices(s => s.map(x => x.id === editing.id ? data : x))
        toast.success('Hizmet güncellendi')
      } else {
        const { data, error } = await supabase.from('services').insert({ ...form, salon_id: salonId, is_active: true }).select().single()
        if (error) throw error
        setServices(s => [...s, data])
        toast.success('Hizmet eklendi')
      }
      setShowModal(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setServices(s => s.filter(x => x.id !== id))
    toast.success('Hizmet silindi')
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = services.filter(s => (s.category || 'Diğer') === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Hizmetler</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">{services.length} hizmet tanımlı</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Hizmet Ekle
        </button>
      </div>

      {services.length === 0 ? (
        <div className="card p-16 text-center">
          <Scissors className="w-12 h-12 text-sand-200 mx-auto mb-3" />
          <p className="text-charcoal-500 mb-1 font-medium">Henüz hizmet eklenmemiş</p>
          <p className="text-charcoal-400 text-sm mb-4">Müşterilerinizin seçebileceği hizmetleri ekleyin</p>
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all">
            <Plus className="w-4 h-4" /> İlk Hizmetinizi Ekleyin
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((service) => (
                  <div key={service.id} className="card p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-charcoal-900 truncate">{service.name}</h3>
                        {service.description && <p className="text-charcoal-500 text-xs mt-0.5 line-clamp-2">{service.description}</p>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button onClick={() => openEdit(service)} className="p-1.5 rounded-lg hover:bg-sand-100 text-charcoal-400 hover:text-charcoal-600">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-charcoal-400 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-rose-500">{formatCurrency(service.price)}</span>
                      <span className="text-xs text-charcoal-400 bg-sand-100 px-2 py-1 rounded-lg border border-sand-200">{formatDuration(service.duration_minutes)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-charcoal-900">{editing ? 'Hizmet Düzenle' : 'Yeni Hizmet'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-sand-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Hizmet Adı *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Örn: Saç Boyama"
                  className="input" />
              </div>
              <div>
                <label className="label">Kategori</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="input">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Fiyat (₺) *</label>
                  <input type="number" value={form.price} min={0} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="input" />
                </div>
                <div>
                  <label className="label">Süre (dk) *</label>
                  <input type="number" value={form.duration_minutes} min={5} step={5} onChange={e => setForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))}
                    className="input" />
                </div>
              </div>
              <div>
                <label className="label">Açıklama</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Kısa açıklama..."
                  className="input resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-sand-100 hover:bg-sand-200 text-charcoal-700 font-medium py-3 rounded-xl text-sm transition-all">İptal</button>
                <button onClick={handleSave} disabled={loading} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                  {loading ? 'Kaydediliyor...' : (editing ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
