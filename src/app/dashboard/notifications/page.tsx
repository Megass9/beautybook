import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import NotificationsClient from "@/app/dashboard/notifications/NotificationsClient";

export const dynamic = "force-dynamic";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

export default async function NotificationsPage() {
  const supabase = createServerClient() as any;
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/auth/login");
  }

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", session.user.id)
    .single();

  if (!salon) {
    return redirect("/dashboard");
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, message, created_at, is_read")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Admin Bildirimleri</p>
          <h1 className="text-3xl font-black text-stone-900">Salonunuza gelen duyurular</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            Bu bölümde size admin tarafından gönderilen tüm bildirimler listelenir. Buradan güncel duyuruları ve salonunuza ait mesajları takip edebilirsiniz.
          </p>
        </div>
      </div>

      <NotificationsClient notifications={(notifications || []) as NotificationItem[]} />
    </div>
  );
}
