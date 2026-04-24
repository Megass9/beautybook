import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient() as any;

    // Test if notifications table exists by trying to count rows
    const { data: countData, error: countError, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json({
        error: countError.message,
        table_exists: false,
        details: "Notifications table not found or accessible"
      }, { status: 500 });
    }

    // Get recent notifications (like admin page does)
    const { data: notifications, error: selectError } = await supabase
      .from("notifications")
      .select("id, salon_id, title, message, created_at, is_read")
      .order("created_at", { ascending: false })
      .limit(10);

    if (selectError) {
      return NextResponse.json({
        error: selectError.message,
        table_exists: true,
        row_count: count || 0,
        select_error: true
      }, { status: 500 });
    }

    return NextResponse.json({
      table_exists: true,
      row_count: count || 0,
      recent_notifications: notifications || [],
      message: "Notifications table is accessible"
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || "Unknown error",
      table_exists: false
    }, { status: 500 });
  }
}