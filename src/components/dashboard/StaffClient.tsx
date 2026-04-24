'use client'
import { useState } from 'react'
import { Plus, X, Pencil, Trash2, Users, Phone, Mail, Key, Copy, Check, UserCheck, Shield, Sparkles } from 'lucide-react'
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
  const supabase = createClient() as any
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
        toast.success('Personel başarıyla güncellendi')
      } else {
        const result = await createStaffAction(salonId, form, selectedServices)

        if (result.error) throw new Error(result.error)
        if (!result.data || !result.credentials) throw new Error("Personel oluşturulamadı")

        setStaff(s => [...s, result.data!])
        staffId = result.data.id

        setCredentials(result.credentials)
        setShowCredModal(true);
        toast.success('Yeni personel başarıyla eklendi')
      }

      // Update staff services
      if (editing) { 
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
    if (!confirm('Personel sistemden tamamen silinecek, onaylıyor musunuz?')) return
    const { error } = await supabase.from('staff').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setStaff(s => s.filter(x => x.id !== id))
    toast.success('Personel silindi')
  }

  const copyCredentials = () => {
    if (!credentials) return;
    const text = `Giriş adresi: ${window.location.origin}/staff-portal/login\nE-posta: ${credentials.email}\nŞifre: ${credentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStaffServices = (staffId: string) => staffServices.filter(ss => ss.staff_id === staffId).map(ss => services.find(s => s.id === ss.service_id)?.name).filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-up pb-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Personel Yönetimi</h1>
          <p className="text-stone-500 text-sm mt-1">Ekibinizi yönetin, yetkilerini ve sundukları hizmetleri belirleyin.</p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 text-stone-300" />
          Personel Ekle
        </button>
      </div>

      {staff.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="bg-stone-50/50 rounded-[2.5rem] border border-stone-200/60 p-24 text-center shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-500/10 rounded-full blur-[80px]" />
          <div className="w-24 h-24 bg-white border border-stone-200 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm relative z-10 rotate-3">
            <div className="absolute inset-0 border-4 border-stone-100 rounded-[2rem] animate-pulse opacity-50" />
            <Users className="w-10 h-10 text-stone-300" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-2xl mb-2 relative z-10">Ekibinizi Kurun</h3>
          <p className="text-base text-stone-500 mb-8 max-w-md mx-auto relative z-10">
            Müşterilerinize hizmet verebilmek için çalışma arkadaşlarınızı sisteme tanımlayın.
          </p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:-translate-y-1 relative z-10"
          >
            <Plus className="w-5 h-5 text-stone-400" /> Ekibe Katıl
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {staff.map((s) => {
            const svcNames = getStaffServices(s.id)
            return (
              <div key={s.id} className="bg-white rounded-[2rem] border border-stone-200/60 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-stone-300 transition-all duration-300 group flex flex-col relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full bg-gradient-to-br from-stone-400 to-stone-600" />

                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-200 rounded-[1.5rem] flex items-center justify-center border border-white shadow-inner">
                    <span className="text-2xl font-black text-stone-700">{s.name[0]?.toUpperCase() || "?"}</span>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(s)} className="w-8 h-8 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center transition-all shadow-sm" title="Düzenle">
                      <Pencil className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                    <button type="button" onClick={() => handleDelete(s.id)} className="w-8 h-8 bg-white hover:bg-red-50 border border-stone-200 hover:border-red-200 rounded-xl flex items-center justify-center transition-all shadow-sm" title="Sil">
                      <Trash2 className="w-3.5 h-3.5 text-stone-300 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className="font-extrabold text-stone-900 text-lg mb-1 group-hover:text-stone-700 transition-colors">{s.name}</h3>
                  <p className="text-sm font-bold text-rose-500 mb-4">{s.role || "Ünvan Belirtilmedi"}</p>
                  
                  <div className="space-y-2.5 mb-6">
                    {s.phone && (
                       <p className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                         <div className="w-6 h-6 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center"><Phone className="w-3 h-3 text-stone-400" /></div>
                         {s.phone}
                       </p>
                    )}
                    {s.email && (
                       <p className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                         <div className="w-6 h-6 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center"><Mail className="w-3 h-3 text-stone-400" /></div>
                         <span className="truncate">{s.email}</span>
                       </p>
                    )}
                  </div>
                  
                  {svcNames.length > 0 && (
                     <div className="mb-6 flex flex-wrap gap-1.5">
                       {svcNames.slice(0, 3).map((sn, i) => (
                         <span key={i} className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded-lg">
                           {sn}
                         </span>
                       ))}
                       {svcNames.length > 3 && (
                         <span className="text-[10px] font-bold bg-stone-50 text-stone-400 border border-stone-200 px-2 py-1 rounded-lg">
                           +{svcNames.length - 3}
                         </span>
                       )}
                     </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-stone-100/80 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.is_active ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-stone-300'}`} />
                    <span className="text-xs font-bold text-stone-500">{s.is_active ? 'Aktif' : 'Pasif'}</span>
                  </div>
                  {s.auth_user_id && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold shadow-sm">
                      <Key className="w-3 h-3" />
                      Giriş Yetkisi
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL: ADD / EDIT STAFF ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[92vh] flex flex-col overflow-hidden animate-fade-up">

            {/* Modal header */}
            <div className="bg-white border-b border-stone-100 px-8 py-6 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${editing ? 'bg-blue-50 text-blue-600' : 'bg-stone-100 text-stone-700'}`}>
                   {editing ? <Pencil className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-xl tracking-tight">
                    {editing ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
                  </h3>
                  <p className="text-xs font-semibold text-stone-500 mt-0.5">{editing ? "Mevcut personelin bilgilerini güncelleyin" : "Ekibe yeni bir çalışma arkadaşı ekleyin"}</p>
                </div>
              </div>
              <button onClick={closeModal} className="w-10 h-10 bg-stone-50 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-8">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Name & Role */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Ad Soyad *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Personel Adı"
                      className="w-full bg-white border border-stone-200/80 rounded-2xl px-5 py-4 text-sm font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Örn: Uzman Kuaför</label>
                    <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Ünvan (İsteğe bağlı)"
                      className="w-full bg-white border border-stone-200/80 rounded-2xl px-5 py-4 text-sm font-medium text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all" />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0555..."
                        className="w-full bg-white border border-stone-200/80 rounded-2xl pl-11 pr-4 py-4 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ornek@mail.com"
                        className="w-full bg-white border border-stone-200/80 rounded-2xl pl-11 pr-4 py-4 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all" />
                    </div>
                  </div>
                </div>

                {!editing && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-stone-500" />
                      <label className="text-sm font-extrabold text-stone-700">Giriş Şifresi <span className="text-stone-400 font-medium">(İsteğe bağlı)</span></label>
                    </div>
                    <input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Boş bırakırsanız sistem otomatik belirler..."
                      className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 shadow-sm transition-all" />
                  </div>
                )}

                {services.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-3">Verdiği Hizmetler</label>
                    <div className="flex flex-wrap gap-2.5">
                      {services.map((svc) => (
                        <button key={svc.id} type="button" onClick={() => toggleService(svc.id)}
                          className={`text-xs px-4 py-2.5 rounded-xl border-2 font-bold transition-all ${selectedServices.includes(svc.id) ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:bg-stone-50'}`}>
                          {svc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </form>
            </div>
            
            <div className="bg-stone-50 border-t border-stone-200/60 p-6 flex gap-4 rounded-b-[2.5rem] shrink-0">
              <button type="button" onClick={closeModal} className="w-1/3 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold py-4 rounded-2xl transition-all text-sm shadow-sm">
                İptal Et
              </button>
              <button type="button" onClick={handleSave} disabled={loading} className="w-2/3 flex items-center justify-center gap-2 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:-translate-y-0.5">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kayıt Sürüyor...
                  </span>
                ) : editing ? "Değişiklikleri Kaydet" : "Personeli Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CREDENTIALS ── */}
      {showCredModal && credentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-8 animate-fade-up border border-stone-100 text-center">
            
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-emerald-100 rounded-full animate-ping opacity-50" />
              <UserCheck className="w-10 h-10 relative z-10" />
            </div>
            
            <h2 className="font-extrabold text-stone-900 text-2xl tracking-tight mb-2">Başarıyla Eklendi!</h2>
            <p className="text-sm font-medium text-stone-500 mb-6 leading-relaxed">Personelin sisteme giriş yapabilmesi için aşağıdaki bilgileri kendisine iletmeyi unutmayın.</p>
            
            <div className="space-y-3 text-left bg-stone-50 border border-stone-200/80 rounded-2xl p-5 mb-8">
              <div>
                <span className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">E-posta Adresi</span>
                <span className="text-sm font-bold text-stone-900">{credentials.email}</span>
              </div>
              <div className="border-t border-stone-200" />
              <div>
                <span className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Giriş Şifresi</span>
                <span className="text-sm font-black text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded-md inline-block">{credentials.password}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={copyCredentials} className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-md">
                {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Kopyalandı</> : <><Copy className="w-4 h-4 text-stone-400" /> Bilgileri Kopyala</>}
              </button>
              <button onClick={() => setShowCredModal(false)} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-stone-200 hover:bg-stone-50 text-stone-700 font-bold py-3.5 rounded-xl transition-all shadow-sm">
                Pencereyi Kapat
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
