import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";

type RequestBody = {
  subId: string;
};

export async function POST(request: Request) {
  try {
    const supabaseServer = createServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user || user.app_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const body: RequestBody = await request.json();
    const { subId } = body;

    if (!subId) {
      return NextResponse.json(
        { error: "Abonelik ID gereklidir." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient() as any;

    // 🔍 Abonelik kontrolü
    const { data: sub, error: fetchError } = await supabase
      .from("subscriptions")
      .select("salon_id")
      .eq("id", subId)
      .single();

    if (fetchError || !sub) {
      return NextResponse.json(
        { error: "Abonelik bulunamadı." },
        { status: 404 }
      );
    }

    // 📅 Tarihler
    const startDate = new Date();
    const endDate = addDays(startDate, 30);

    // 🔄 Subscription update
    const { error: subUpdateError } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .eq("id", subId);

    if (subUpdateError) {
      return NextResponse.json(
        { error: subUpdateError.message },
        { status: 500 }
      );
    }

    // 🏪 Salon update
    const { error: salonUpdateError } = await supabase
      .from("salons")
      .update({ is_active: true })
      .eq("id", sub.salon_id);

    if (salonUpdateError) {
      return NextResponse.json(
        { error: salonUpdateError.message },
        { status: 500 }
      );
    }

    // ♻️ Cache temizleme
    revalidatePath("/admin");
    revalidatePath("/admin/salons");

    return NextResponse.json({
      success: true,
      data: {
        status: "active",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Bilinmeyen bir hata oluştu.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}