import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient() as any;

    // Get salons (like admin page does)
    const { data: salons, error: salonsError } = await supabase
      .from("salons")
      .select("id, name, city")
      .order("name");

    // Get notifications (like admin page does)
    const { data: notifications, error: notificationsError } = await supabase
      .from("notifications")
      .select("id, salon_id, title, message, created_at, is_read")
      .order("created_at", { ascending: false });

    return NextResponse.json({
      salons_count: salons?.length || 0,
      notifications_count: notifications?.length || 0,
      salons_error: salonsError?.message,
      notifications_error: notificationsError?.message,
      recent_notifications: notifications?.slice(0, 5) || []
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || "Unknown error"
    }, { status: 500 });
  }
}