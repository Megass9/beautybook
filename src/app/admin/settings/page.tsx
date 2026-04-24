export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Sistem Ayarları</p>
          <h1 className="text-3xl font-black text-stone-900">Platform Konfigürasyonu</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            BeautyBook platformunun genel ayarlarını ve konfigürasyonunu yönetin.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Platform Settings */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Platform Ayarları</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Platform Adı
                </label>
                <input
                  type="text"
                  defaultValue="BeautyBook"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Destek Email
                </label>
                <input
                  type="email"
                  defaultValue="support@beautybook.com"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Maksimum Salon Başına Personel
                </label>
                <input
                  type="number"
                  defaultValue="20"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Yeni Salon Otomatik Onay
                </label>
                <select className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 outline-none">
                  <option value="manual">Manuel Onay</option>
                  <option value="auto">Otomatik Onay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Randevu İptal Süresi (saat)
                </label>
                <input
                  type="number"
                  defaultValue="24"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Maksimum Günlük Randevu
                </label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-100">
            <button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Ayarları Kaydet
            </button>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Özellik Aç/Kapat</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "SMS Bildirimleri", enabled: true },
              { name: "Email Bildirimleri", enabled: true },
              { name: "Çevrimiçi Ödeme", enabled: false },
              { name: "Randevu Hatırlatma", enabled: true },
              { name: "Müşteri Yorumları", enabled: false },
              { name: "Fotoğraf Yükleme", enabled: true },
              { name: "Çoklu Dil Desteği", enabled: false },
              { name: "API Erişimi", enabled: false },
              { name: "Analitik Raporlar", enabled: true }
            ].map((feature) => (
              <div key={feature.name} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                <span className="text-sm font-semibold text-stone-700">{feature.name}</span>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    feature.enabled ? 'bg-rose-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      feature.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Sistem Bilgileri</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Veritabanı</span>
                <span className="text-sm font-semibold text-stone-900">Supabase PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Sunucu</span>
                <span className="text-sm font-semibold text-stone-900">Vercel Edge Runtime</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Framework</span>
                <span className="text-sm font-semibold text-stone-900">Next.js 14</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Son Güncelleme</span>
                <span className="text-sm font-semibold text-stone-900">24 Nisan 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Versiyon</span>
                <span className="text-sm font-semibold text-stone-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Durum</span>
                <span className="text-sm font-semibold text-emerald-600">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}