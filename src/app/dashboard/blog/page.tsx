import { createServerClient } from "@/lib/supabase/server";
import BlogClient from "./BlogClient";
import { redirect } from "next/navigation";

export default async function BlogPage() {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single<{ id: string }>();

  if (!salon) return <div>Salon bulunamadı</div>;

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });

  return (
    <BlogClient
      salonId={salon.id}
      initialPosts={posts || []}
    />
  );
}
