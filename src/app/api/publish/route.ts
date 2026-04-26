import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Database } from "@/types"; // Database tipini içeri aktarıyoruz

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPublished, customSlug } = await request.json();

    // Kullanıcının salonunu bul
    const { data: salon, error: salonError } = await supabase
      .from("salons")
      .select("id")
      .eq("owner_id", user.id)
      .single() as { data: { id: string } | null; error: any };

    if (salonError || !salon) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    const salonId = salon.id;

    // Yayınlama durumunu güncelle
    const updateData: Database['public']['Tables']['salons']['Update'] = { is_active: isPublished }; // is_published yerine is_active kullanıldığı varsayıldı
    if (customSlug) {
      updateData.slug = customSlug; // custom_slug yerine slug kullanıldığı varsayıldı
    }

    const { error: updateError } = await (supabase
      .from("salons") as any)
      .update(updateData as any)
      .eq("id", salonId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
