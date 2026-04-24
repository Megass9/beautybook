import { createAdminClient } from "@/lib/supabase/admin";
import AdminNotificationsClient from "./AdminNotificationsClient";
import { Bell, Send, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createAdminClient() as any;

  const { data: salons } = await supabase
    .from("salons")
    .select("id, name, city")
    .order("name");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, salon_id, title, message, created_at, is_read")
    .order("created_at", { ascending: false });

  const totalSalons = salons?.length || 0;
  const totalNotifications = notifications?.length || 0;
  const unreadNotifications = notifications?.filter((item: any) => !item.is_read).length || 0;

  // Verileri JSON uyumlu hale getirerek Client Component'e güvenli geçiş sağlayalım
  // Bu adım "clientModules" hatalarını önlemede yardımcı olur.
  const serializedSalons = JSON.parse(JSON.stringify(salons || []));
  const serializedNotifications = JSON.parse(JSON.stringify(notifications || []));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Salon Bildirimleri</p>
          <h1 className="text-3xl font-black text-stone-900">Platform Duyuru Paneli</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            Yeni duyurular oluşturun, hedef salonları seçin ve gönderilmiş bildirimleri takip edin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <p className="text-2xl font-black text-stone-900 mb-1">{totalSalons}</p>
          <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Toplam Salon</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <p className="text-2xl font-black text-stone-900 mb-1">{totalNotifications}</p>
          <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Toplam Duyuru</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <p className="text-2xl font-black text-rose-600 mb-1">{unreadNotifications}</p>
          <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Okunmamış</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <AdminNotificationsClient
          salons={serializedSalons}
          notifications={serializedNotifications}
        />

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Yardım & İpuçları</p>
              <h2 className="text-sm font-bold text-stone-900 mt-1">Duyuruları Güçlendirin</h2>
            </div>
            <Bell className="h-5 w-5 text-rose-500" />
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-xs font-bold text-stone-900">Doğru hedef seçimi</p>
              <p className="mt-1 text-[11px] text-stone-500 font-medium">"Tüm Salonlar" yerine belirli salon seçerek daha hedefli bildirim gönderebilirsiniz.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-xs font-bold text-stone-900">Kısa ve net mesaj</p>
              <p className="mt-1 text-[11px] text-stone-500 font-medium">Başlık kısa olmalı; mesaj içerisine eylem çağrısı ekleyin.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
