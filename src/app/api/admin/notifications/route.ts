import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salon_id, title, message } = body;

    if (!title?.trim() || !message?.trim() || !salon_id) {
      return NextResponse.json({ error: "Başlık, mesaj ve hedef salon gereklidir." }, { status: 400 });
    }

    const supabase = createAdminClient() as any;
    const targetSalons = salon_id === "all"
      ? await supabase.from("salons").select("id")
      : { data: [{ id: salon_id }] };

    if (targetSalons.error) {
      return NextResponse.json({ error: targetSalons.error.message || "Hedef salonlar alınamadı." }, { status: 500 });
    }

    const salonItems = targetSalons.data || [];
    if (salonItems.length === 0) {
      return NextResponse.json({ error: "Gönderilecek salon bulunamadı." }, { status: 400 });
    }

    const payload = salonItems.map((salon: any) => ({
      salon_id: salon.id,
      title: title.trim(),
      message: message.trim(),
    }));

    const { data, error } = await supabase.from("notifications").insert(payload).select();

    if (error) {
      console.error("Admin notification insert error:", error.message, { payload });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Bildirim gönderilemedi. Lütfen tekrar deneyin." }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}
