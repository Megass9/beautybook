import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { salon_id, title, message } = body;

  if (!title?.trim() || !message?.trim() || !salon_id) {
    return NextResponse.json({ error: "Başlık, mesaj ve salon ID gereklidir." }, { status: 400 });
  }

  const supabase = createServerClient() as any;
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Yetkilendirme gerekli." }, { status: 401 });
  }

  const { data: salon, error: salonError } = await supabase
    .from("salons")
    .select("id, owner_id")
    .eq("id", salon_id)
    .single();

  if (salonError || !salon || salon.owner_id !== session.user.id) {
    return NextResponse.json({ error: "Bu salon için yetkiniz yok." }, { status: 403 });
  }

  const adminSupabase = createAdminClient() as any;
  const { error } = await adminSupabase.from("notifications").insert({
    salon_id,
    title: title.trim(),
    message: message.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
