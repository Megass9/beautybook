"use client";

import { useState } from "react";

export default function TestNotificationsPage() {
  const [result, setResult] = useState<any>(null);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);

  const testTable = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/notifications/test");
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const debugAdminPage = async () => {
    setDebugLoading(true);
    try {
      const response = await fetch("/api/admin/notifications/debug");
      const data = await response.json();
      setDebugResult(data);
    } catch (error: any) {
      setDebugResult({ error: error.message });
    } finally {
      setDebugLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications Debug</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={testTable}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Test ediliyor..." : "Tabloyu Test Et"}
        </button>

        <button
          onClick={debugAdminPage}
          disabled={debugLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {debugLoading ? "Debug ediliyor..." : "Admin Sayfasını Debug Et"}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="font-semibold mb-2">Temel Bilgiler:</h2>
            <p><strong>Tablo var mı:</strong> {result.table_exists ? "Evet" : "Hayır"}</p>
            <p><strong>Toplam kayıt:</strong> {result.row_count}</p>
            {result.error && <p className="text-red-600"><strong>Hata:</strong> {result.error}</p>}
          </div>

          {result.recent_notifications && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="font-semibold mb-2">Son 10 Bildirim:</h2>
              {result.recent_notifications.length === 0 ? (
                <p className="text-gray-600">Henüz bildirim yok</p>
              ) : (
                <div className="space-y-2">
                  {result.recent_notifications.map((notif: any) => (
                    <div key={notif.id} className="bg-white p-3 rounded border text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{notif.title}</p>
                          <p className="text-gray-600">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Salon ID: {notif.salon_id} | {new Date(notif.created_at).toLocaleString('tr-TR')}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${notif.is_read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {notif.is_read ? 'Okundu' : 'Yeni'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {debugResult && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h2 className="font-semibold mb-2 text-green-800">Admin Sayfa Debug:</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Salon sayısı:</strong> {debugResult.salons_count}</p>
            <p><strong>Bildirim sayısı:</strong> {debugResult.notifications_count}</p>
            {debugResult.salons_error && <p className="text-red-600"><strong>Salon hatası:</strong> {debugResult.salons_error}</p>}
            {debugResult.notifications_error && <p className="text-red-600"><strong>Bildirim hatası:</strong> {debugResult.notifications_error}</p>}
            {debugResult.error && <p className="text-red-600"><strong>Genel hata:</strong> {debugResult.error}</p>}
            {debugResult.recent_notifications && debugResult.recent_notifications.length > 0 && (
              <div>
                <p className="font-semibold mt-3">Son 5 bildirim:</p>
                <div className="space-y-1 mt-2">
                  {debugResult.recent_notifications.map((notif: any) => (
                    <div key={notif.id} className="bg-white p-2 rounded text-xs">
                      <span className="font-semibold">{notif.title}</span> - {notif.salon_id}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Tablo Testi:</strong> Notifications tablosunun varlığını ve erişilebilirliğini kontrol eder.</p>
        <p><strong>Admin Debug:</strong> Admin sayfasının salon ve bildirim verilerini nasıl çektiğini gösterir.</p>
        <p><strong>Eğer bildirim sayısı farklıysa:</strong> Cache veya RLS politikası sorunu olabilir.</p>
      </div>
    </div>
  );
}