export const dynamic = "force-dynamic";

export default function AdminLogsPage() {
  // Mock system logs data - in real app this would come from database
  const systemLogs = [
    {
      id: 1,
      type: "user_action",
      message: "Yeni salon kaydı: Beauty Center İstanbul",
      user: "ahmet@example.com",
      timestamp: "2024-01-15T10:30:00Z",
      level: "info"
    },
    {
      id: 2,
      type: "system",
      message: "Database backup completed successfully",
      user: "system",
      timestamp: "2024-01-15T02:00:00Z",
      level: "info"
    },
    {
      id: 3,
      type: "error",
      message: "Payment processing failed for appointment #1234",
      user: "system",
      timestamp: "2024-01-14T16:45:00Z",
      level: "error"
    },
    {
      id: 4,
      type: "user_action",
      message: "Admin notification sent to 5 salons",
      user: "admin@beautybook.com",
      timestamp: "2024-01-14T14:20:00Z",
      level: "info"
    },
    {
      id: 5,
      type: "security",
      message: "Failed login attempt from IP 192.168.1.100",
      user: "unknown",
      timestamp: "2024-01-14T12:15:00Z",
      level: "warning"
    },
    {
      id: 6,
      type: "user_action",
      message: "Service updated: Saç Kesimi - Fiyat: ₺150 → ₺180",
      user: "mehmet@example.com",
      timestamp: "2024-01-13T11:30:00Z",
      level: "info"
    },
    {
      id: 7,
      type: "system",
      message: "Scheduled maintenance completed",
      user: "system",
      timestamp: "2024-01-13T03:00:00Z",
      level: "info"
    },
    {
      id: 8,
      type: "error",
      message: "API rate limit exceeded for salon #567",
      user: "system",
      timestamp: "2024-01-12T18:22:00Z",
      level: "warning"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user_action': return '👤';
      case 'system': return '⚙️';
      case 'error': return '❌';
      case 'security': return '🔒';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Sistem Logları</p>
          <h1 className="text-3xl font-black text-stone-900">Platform Aktiviteleri</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            Sistem aktivitelerini, hataları ve kullanıcı işlemlerini takip edin.
          </p>
        </div>
        <div className="flex gap-4">
          <select className="text-sm border border-stone-200 rounded-lg px-3 py-2">
            <option>Son 24 Saat</option>
            <option>Son 7 Gün</option>
            <option>Son 30 Gün</option>
            <option>Tümü</option>
          </select>
          <select className="text-sm border border-stone-200 rounded-lg px-3 py-2">
            <option>Tüm Tipler</option>
            <option>Kullanıcı İşlemleri</option>
            <option>Sistem</option>
            <option>Hatalar</option>
            <option>Güvenlik</option>
          </select>
          <button className="text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-lg transition-colors">
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <p className="text-lg font-black text-stone-900">{systemLogs.length}</p>
              <p className="text-xs text-stone-400">Toplam Log</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <span className="text-lg">❌</span>
            </div>
            <div>
              <p className="text-lg font-black text-stone-900">
                {systemLogs.filter(l => l.level === 'error').length}
              </p>
              <p className="text-xs text-stone-400">Hata</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <div>
              <p className="text-lg font-black text-stone-900">
                {systemLogs.filter(l => l.level === 'warning').length}
              </p>
              <p className="text-xs text-stone-400">Uyarı</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <p className="text-lg font-black text-stone-900">
                {systemLogs.filter(l => l.type === 'user_action').length}
              </p>
              <p className="text-xs text-stone-400">Kullanıcı İşlemi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900">Aktivite Logları</h2>
        </div>

        <div className="divide-y divide-stone-50 max-h-96 overflow-y-auto">
          {systemLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-stone-50/60 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getTypeIcon(log.type)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${getLevelColor(log.level)}`}>
                      {log.level === 'error' ? 'Hata' :
                       log.level === 'warning' ? 'Uyarı' : 'Bilgi'}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {log.type === 'user_action' ? 'Kullanıcı' :
                       log.type === 'system' ? 'Sistem' :
                       log.type === 'security' ? 'Güvenlik' : 'Diğer'}
                    </span>
                  </div>

                  <p className="text-sm text-stone-900 mb-2">{log.message}</p>

                  <div className="flex items-center gap-4 text-xs text-stone-500">
                    <span><strong>Kullanıcı:</strong> {log.user}</span>
                    <span>
                      {new Date(log.timestamp).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Monitor */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-stone-900 mb-4">Gerçek Zamanlı İzleme</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🟢</span>
            </div>
            <p className="font-semibold text-stone-900">Sistem Durumu</p>
            <p className="text-sm text-emerald-600">Tümü Normal</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔄</span>
            </div>
            <p className="font-semibold text-stone-900">Aktif Oturum</p>
            <p className="text-sm text-blue-600">24 kullanıcı</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="font-semibold text-stone-900">API Yanıt Süresi</p>
            <p className="text-sm text-purple-600">120ms ortalama</p>
          </div>
        </div>
      </div>
    </div>
  );
}