import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types"; // Database tipini içeri aktarıyoruz

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient();
    const { salonId, action } = await req.json();

    console.log(`[Admin API] Action: ${action}, Salon ID: ${salonId}`);

    if (action === "toggle_status") {
      const { data: salon, error: fetchError } = (await supabase
        .from("salons")
        .select("*") // Sütun bazlı seçim yerine tümünü alarak hatayı önleyelim
        .eq("id", salonId)
        .single()) as any;

      if (fetchError) {
        console.error("[Admin API] Fetch error:", fetchError);
        throw fetchError;
      }

      // Eğer veritabanında is_active yoksa varsayılan olarak true kabul edelim
      const currentStatus = salon?.is_active ?? true;
      const updatePayload: Database['public']['Tables']['salons']['Update'] = { is_active: !currentStatus };
      const { error: updateError } = await (supabase
        .from("salons") as any)
        .update(updatePayload as any)
        .eq("id", salonId);

      if (updateError) {
        console.error("[Admin API] Update error:", updateError);
        throw updateError;
      }
    } 
    else if (action === "extend_30_days") {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + 30);

      const insertPayload: Database['public']['Tables']['subscriptions']['Insert'] = {
          salon_id: salonId,
          status: "active",
          plan_name: "Manuel Uzatma", 
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          amount: 0,
          receipt_no: null
          // plan_type sütunu veritabanında bulunmadığı için kaldırıldı
        };
      const { error: subError } = await (supabase
        .from("subscriptions") as any)
        .insert(insertPayload as any);

      console.log(`[Admin API] Subscription insert for ${salonId} - Error:`, subError);
      if (subError) throw subError;

      // Abonelik uzatıldığında salonu otomatik olarak aktif yap
      const salonUpdatePayload: Database['public']['Tables']['salons']['Update'] = { is_active: true };
      const { error: salonError } = await (supabase
        .from("salons") as any)
        .update(salonUpdatePayload as any)
        .eq("id", salonId);

      console.log(`[Admin API] Salon activation for ${salonId} after extension - Error:`, salonError);
      if (salonError) throw salonError;
    }

    revalidatePath("/admin/salons");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Admin API] Global Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}