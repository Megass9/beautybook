import { createServerClient } from "@/lib/supabase/server";
import StaffPortalHeader from "@/components/staff-portal/StaffPortalHeader";

export default async function StaffPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {user && <StaffPortalHeader user={user} />}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
