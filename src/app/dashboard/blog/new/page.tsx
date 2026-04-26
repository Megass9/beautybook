import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BlogEditor from "../BlogEditor";

export default async function NewBlogPostPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single<{ id: string }>();

  if (!salon) redirect("/dashboard");

  return (
    <div className="py-6">
      <BlogEditor salonId={salon.id} />
    </div>
  );
}
