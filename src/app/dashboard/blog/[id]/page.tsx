import { createServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import BlogEditor from "../BlogEditor";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: salon } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", user.id)
    .single<{ id: string }>();

  if (!salon) redirect("/dashboard");

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .eq("salon_id", salon.id)
    .single();

  if (!post) notFound();

  return (
    <div className="py-6">
      <BlogEditor salonId={salon.id} post={post} />
    </div>
  );
}
