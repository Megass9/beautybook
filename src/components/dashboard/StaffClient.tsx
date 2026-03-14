'use client'
import { useState } from 'react'
import { Plus, X, Pencil, Trash2, Users, Phone, Mail, Key, Copy, Check, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Staff, Service } from '@/types'
import { createStaffAction } from '@/app/dashboard/staff/actions'

type StaffService = { staff_id: string, service_id: string }

export function StaffClient({
  salonId,
  initialStaff,
  services,
  staffServices: initialSS,
}: {
  salonId: string
  initialStaff: Staff[]
  services: Service[]
  staffServices: StaffService[]
}) {
  const supabase = createClient()
  const [staff, setStaff] = useState(initialStaff)
  const [staffServices, setStaffServices] = useState(initialSS)
  const [showModal, setShowModal] = useState(false)
  const [showCredModal, setShowCredModal] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', password: '' })
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', role: '', password: '' })
    setSelectedServices([])
    setShowModal(true)
  }

  const openEdit = (s: Staff) => {
    setEditing(s)
    setForm({ name: s.name, email: s.email || '', phone: s.phone || '', role: s.role || '', password: '' })
    setSelectedServices(staffServices.filter(ss => ss.staff_id === s.id).map(ss => ss.service_id))
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm({ name: '', role: '', phone: '', email: '', password: '' })
    setSelectedServices([])
  }

  const toggleService = (id: string) => {
    setSelectedServices(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { toast.error('Personel adı gereklidir'); return }
    setLoading(true)

    try {
      let staffId: string

      if (editing) {
        const { data, error } = await supabase
          .from('staff')
          .update({
          name: form.name,
          role: form.role,
          phone: form.phone,
          email: form.email,
          })
          .eq('id', editing.id)
          .select()
          .single()

        if (error) throw error

        setStaff(s => s.map(x => x.id === editing.id ? data : x))
        staffId = editing.id
        toast.success('Personel güncellendi')
      } else {
        const result = await createStaffAction(salonId, form, selectedServices)

        if (result.error) throw new Error(result.error)
        if (!result.data || !result.credentials) throw new Error("Personel oluşturulamadı")

        setStaff(s => [...s, result.data])
        staffId = result.data.id

        setCredentials(result.credentials)
        setShowCredModal(true);
        toast.success('Personel eklendi')
      }

      // Update staff services
      if (editing) { // For new staff, services are handled in the server action
        await supabase.from('staff_services').delete().eq('staff_id', staffId)
        if (selectedServices.length > 0) {
          const { error: ssError } = await supabase.from('staff_services').insert(selectedServices.map(sid => ({ staff_id: staffId, service_id: sid })))
          if (ssError) throw ssError;
        }
      }

      setStaffServices(ss => [
        ...ss.filter(s => s.staff_id !== staffId),
        ...selectedServices.map(sid => ({ staff_id: staffId, service_id: sid }))
      ])
      closeModal()
    } catch (err: any) {
      console.error("STAFF SAVE ERROR:", err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Personel silinsin mi?')) return
    const { error } = await supabase.from('staff').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setStaff(s => s.filter(x => x.id !== id))
    toast.success('Personel silindi')
  }

  const copyCredentials = () => {
    if (!credentials) return;
    const text = `Giriş sayfası: ${window.location.origin}/staff-portal/login\nE-posta: ${credentials.email}\nŞifre: ${credentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStaffServices = (staffId: string) => staffServices.filter(ss => ss.staff_id === staffId).map(ss => services.find(s => s.id === ss.service_id)?.name).filter(Boolean)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Personel</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">{staff.length} personel</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Personel Ekle
        </button>
      </div>

      {staff.length === 0 ? (
        <div className="card p-16 text-center">
          <Users className="w-12 h-12 text-sand-200 mx-auto mb-3" />
          <p className="text-charcoal-500 mb-4">Henüz personel eklenmedi</p>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" /> Personel Ekle
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => {
            const svcNames = getStaffServices(s.id)
            return (
              <div key={s.id} className="card p-5 group hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-sand-100 rounded-2xl flex items-center justify-center text-xl font-bold text-rose-600">
                    {s.name[0]}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => openEdit(s)} className="p-1.5 hover:bg-sand-100 rounded-lg">
                      <Pencil className="w-3.5 h-3.5 text-charcoal-500" />
                    </button>
                    <button type="button" onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-charcoal-900">{s.name}</h3>
                <p className="text-sm text-rose-600 font-medium mb-3">{s.role}</p>
                <div className="space-y-1.5">
                  {s.phone && <p className="flex items-center gap-2 text-xs text-charcoal-400"><Phone className="w-3.5 h-3.5" />{s.phone}</p>}
                  {s.email && <p className="flex items-center gap-2 text-xs text-charcoal-400"><Mail className="w-3.5 h-3.5" />{s.email}</p>}
                </div>
                <div className="mt-3 pt-3 border-t border-sand-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.is_active ? 'bg-green-400' : 'bg-charcoal-300'}`} />
                    <span className="text-xs text-charcoal-400">{s.is_active ? 'Aktif' : 'Pasif'}</span>
                  </div>
                  {s.auth_user_id && (
                    <span className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      <Key className="w-3 h-3" />
                      Giriş aktif
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-charcoal-900">{editing ? 'Personel Düzenle' : 'Yeni Personel'}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-sand-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Ad Soyad *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Personel adı"
                  className="input" />
              </div>
              <div>
                <label className="label">Ünvan</label>
                <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Örn: Kuaför, Uzman Estetisyen"
                  className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Telefon</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0532..."
                    className="input" />
                </div>
                <div>
                  <label className="label">E-posta</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ornek@mail.com"
                    className="input" />
                </div>
              </div>
              {!editing && (
                <div>
                  <label className="label">Şifre (isteğe bağlı)</label>
                  <input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Boş bırakılırsa otomatik oluşturulur"
                    className="input" />
                </div>
              )}
              {services.length > 0 && (
                <div>
                  <label className="label mb-2">Hizmetler</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((svc) => (
                      <button key={svc.id} type="button" onClick={() => toggleService(svc.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${selectedServices.includes(svc.id) ? 'bg-rose-500 text-white border-rose-500' : 'bg-sand-100 text-charcoal-600 border-sand-200 hover:border-rose-200'}`}>
                        {svc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 bg-sand-100 hover:bg-sand-200 text-charcoal-700 font-medium py-3 rounded-xl text-sm transition-all">İptal</button>
                <button type="submit" disabled={loading} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                  {loading ? 'Kaydediliyor...' : (editing ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredModal && credentials && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-fade-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8" />
              </div>
              <h2 className="font-display text-xl font-bold text-charcoal-900">Personel Oluşturuldu</h2>
              <p className="text-sm text-charcoal-500 mt-2 mb-4">Personelin giriş bilgileri aşağıdadır. Lütfen bu bilgileri güvenli bir şekilde personele iletin.</p>
              <div className="space-y-2 text-left bg-sand-50 border border-sand-200 rounded-xl p-4">
                <p className="text-sm"><span className="font-medium text-charcoal-600">E-posta:</span> {credentials.email}</p>
                <p className="text-sm"><span className="font-medium text-charcoal-600">Şifre:</span> {credentials.password}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={copyCredentials} className="btn-secondary flex-1 justify-center">
                {copied ? <><Check className="w-4 h-4 text-green-500" /> Kopyalandı</> : <><Copy className="w-4 h-4" /> Kopyala</>}
              </button>
              <button onClick={() => setShowCredModal(false)} className="btn-primary flex-1 justify-center">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
