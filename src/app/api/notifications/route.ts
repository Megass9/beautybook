import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salon_id, title, message } = body;

    if (!title?.trim() || !message?.trim() || !salon_id) {
      return NextResponse.json({ error: "Başlık, mesaj ve salon ID gereklidir." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Yetkilendirme gerekli." }, { status: 401 });
    }

    const { data: salon, error: salonError } = await supabase
      .from("salons")
      .select("id, owner_id")
      .eq("id", salon_id)
      .single();

    if (salonError || !salon || (salon as any).owner_id !== session.user.id) {
      return NextResponse.json({ error: "Bu salon için yetkiniz yok." }, { status: 403 });
    }

    const adminSupabase = createAdminClient();
    const { error } = await (adminSupabase.from("notifications") as any).insert({
      salon_id,
      title: title.trim(),
      message: message.trim(),
      is_read: false
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}
