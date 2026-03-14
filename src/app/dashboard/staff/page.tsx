import { createServerClient } from "@/lib/supabase/server";
import { StaffClient } from "@/components/dashboard/StaffClient";

export default async function StaffPage() {
  const supabase = createServerClient() as any;
  const { data: { session } } = await supabase.auth.getSession();
  const { data: salon } = await supabase.from("salons").select("id").eq("owner_id", session?.user.id).single();

  if (!salon) {
    return <div className="p-6">Salon bulunamadı. Lütfen önce bir salon oluşturun.</div>;
  }

  const { data: staff } = await supabase.from("staff").select("*").eq("salon_id", salon.id).order("created_at");
  const staffIds = staff?.map((s: any) => s.id) || [];

  const [{ data: services }, { data: staffServices }] = await Promise.all([
    supabase.from("services").select("id, name").eq("salon_id", salon.id).eq("is_active", true),
    supabase.from("staff_services").select("*").in("staff_id", staffIds),
  ]);
  return <StaffClient salonId={salon.id} initialStaff={staff || []} services={services || []} staffServices={staffServices || []} />;
}
