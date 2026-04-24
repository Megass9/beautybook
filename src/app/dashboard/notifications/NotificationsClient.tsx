"use client";

export type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

interface Props {
  notifications: Notification[];
}

export default function NotificationsClient({ notifications }: Props) {
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-[0.2em]">Toplam Bildirim</p>
              <p className="mt-1 text-3xl font-black text-stone-900">{notifications.length}</p>
            </div>
            <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {unreadCount} yeni
            </div>
          </div>

          <p className="text-sm text-stone-500">
            Bu sayfada admin tarafından salonunuza gönderilen bildirimler yer alır. Her bildirim okundu/okunmadı durumuna göre işaretlenmiştir.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-stone-600 uppercase tracking-[0.2em] mb-4">Son Bildirimler</p>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="rounded-3xl bg-stone-50 p-6 text-stone-500 text-sm text-center">Henüz bir bildirim yok.</div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="rounded-3xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-stone-900">{item.title}</p>
                      <p className="mt-2 text-sm text-stone-600">{item.message}</p>
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${item.is_read ? "text-stone-400" : "text-rose-600"}`}>
                      {item.is_read ? "Okundu" : "Yeni"}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] text-stone-400">{new Date(item.created_at).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
