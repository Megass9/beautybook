import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salon_id, title, message } = body;

    if (!title?.trim() || !message?.trim() || !salon_id) {
      return NextResponse.json({ error: "Başlık, mesaj ve hedef salon gereklidir." }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    let salonItems: { id: string }[] = [];
    
    if (salon_id === "all") {
      const { data, error: fetchError } = await supabase.from("salons").select("id");
      if (fetchError) {
        return NextResponse.json({ error: fetchError.message || "Hedef salonlar alınamadı." }, { status: 500 });
      }
      salonItems = data || [];
    } else {
      salonItems = [{ id: salon_id }];
    }

    if (salonItems.length === 0) {
      return NextResponse.json({ error: "Gönderilecek salon bulunamadı." }, { status: 400 });
    }

    const payload = salonItems.map((salon) => ({
      salon_id: salon.id,
      title: title.trim(),
      message: message.trim(),
    }));

    const { data, error } = await supabase.from("notifications").insert(payload as any).select();

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
