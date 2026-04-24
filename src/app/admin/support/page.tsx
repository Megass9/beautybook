export const dynamic = "force-dynamic";

export default function AdminSupportPage() {
  // Mock support tickets data - in real app this would come from database
  const supportTickets = [
    {
      id: 1,
      user: "Ahmet Yılmaz",
      salon: "Beauty Center İstanbul",
      subject: "Randevu sistemi çalışmıyor",
      message: "Son 2 gündür randevu oluşturamıyorum. Sistem hata veriyor.",
      status: "open",
      priority: "high",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      user: "Ayşe Kaya",
      salon: "Güzellik Salonu Ankara",
      subject: "Ödeme sorunu",
      message: "Müşteri ödemesi gerçekleşti ama sisteme yansımadı.",
      status: "pending",
      priority: "medium",
      created_at: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      user: "Mehmet Demir",
      salon: "Kuaför Efe",
      subject: "Personel ekleme sorunu",
      message: "Yeni personel eklemeye çalışıyorum ama kaydedilmiyor.",
      status: "closed",
      priority: "low",
      created_at: "2024-01-13T09:15:00Z"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'closed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Destek Talepleri</p>
          <h1 className="text-3xl font-black text-stone-900">Kullanıcı Destek Sistemi</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            Salon sahiplerinden gelen destek taleplerini yönetin ve yanıtlayın.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="text-sm text-stone-400">
            Açık: {supportTickets.filter(t => t.status === 'open').length}
          </div>
          <div className="text-sm text-stone-400">
            Bekleyen: {supportTickets.filter(t => t.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Support Tickets List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Destek Talepleri</h2>
            <div className="flex gap-2">
              <select className="text-sm border border-stone-200 rounded-lg px-3 py-1">
                <option>Tümü</option>
                <option>Açık</option>
                <option>Bekleyen</option>
                <option>Kapalı</option>
              </select>
              <select className="text-sm border border-stone-200 rounded-lg px-3 py-1">
                <option>Tüm Öncelikler</option>
                <option>Yüksek</option>
                <option>Orta</option>
                <option>Düşük</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-stone-50">
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-stone-50/60 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-stone-900 truncate">{ticket.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? 'Açık' :
                       ticket.status === 'pending' ? 'Bekliyor' : 'Kapalı'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'high' ? 'Yüksek' :
                       ticket.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600 mb-3">
                    <div>
                      <span className="font-medium">Kullanıcı:</span> {ticket.user}
                    </div>
                    <div>
                      <span className="font-medium">Salon:</span> {ticket.salon}
                    </div>
                  </div>

                  <p className="text-sm text-stone-700 bg-stone-50 p-3 rounded-lg mb-3">
                    {ticket.message}
                  </p>

                  <p className="text-xs text-stone-400">
                    {new Date(ticket.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="text-xs font-semibold bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-colors">
                    Yanıtla
                  </button>
                  <button className="text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg transition-colors">
                    Çözüldü
                  </button>
                  <button className="text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg transition-colors">
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {supportTickets.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="font-semibold text-stone-600 mb-1">Henüz destek talebi yok</p>
              <p className="text-sm text-stone-400">Yeni destek talepleri burada görünecek</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm text-center">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">🚨</span>
          </div>
          <p className="text-lg font-black text-stone-900">
            {supportTickets.filter(t => t.status === 'open').length}
          </p>
          <p className="text-xs text-stone-400">Açık Talep</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm text-center">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">⏳</span>
          </div>
          <p className="text-lg font-black text-stone-900">
            {supportTickets.filter(t => t.status === 'pending').length}
          </p>
          <p className="text-xs text-stone-400">Bekleyen</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm text-center">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">✅</span>
          </div>
          <p className="text-lg font-black text-stone-900">
            {supportTickets.filter(t => t.status === 'closed').length}
          </p>
          <p className="text-xs text-stone-400">Çözülen</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm text-center">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">📊</span>
          </div>
          <p className="text-lg font-black text-stone-900">
            {Math.round(supportTickets.filter(t => t.status === 'closed').length / supportTickets.length * 100) || 0}%
          </p>
          <p className="text-xs text-stone-400">Çözüm Oranı</p>
        </div>
      </div>
    </div>
  );
}