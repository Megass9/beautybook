import { createAdminClient } from "@/lib/supabase/admin";
import LogsClient from "./LogsClient";
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  noStore();
  const supabase = createAdminClient() as any;

  // Logları salon bilgileriyle birlikte çekiyoruz
  const { data: logs, error } = await supabase
    .from("admin_logs")
    .select(`
      *,
      salon:salons(name, slug)
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Loglar çekilirken hata:", error);
  }

  return <LogsClient initialLogs={logs || []} />;
}