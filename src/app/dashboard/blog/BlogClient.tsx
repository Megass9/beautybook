"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, EyeOff, BookOpen, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { BlogPost } from "@/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface BlogClientProps {
  salonId: string;
  initialPosts: BlogPost[];
}

export default function BlogClient({ salonId, initialPosts }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;

    setIsDeleting(id);
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Hata oluştu: " + error.message);
    } else {
      setPosts(posts.filter(p => p.id !== id));
      toast.success("Blog yazısı silindi.");
    }
    setIsDeleting(null);
  };

  const togglePublished = async (post: BlogPost) => {
    const { error } = await (supabase
      .from("blog_posts") as any)
      .update({ is_published: !post.is_published })
      .eq("id", post.id);

    if (error) {
      toast.error("Hata oluştu: " + error.message);
    } else {
      setPosts(posts.map(p => p.id === post.id ? { ...p, is_published: !p.is_published } : p));
      toast.success(post.is_published ? "Yazı yayından kaldırıldı." : "Yazı yayına alındı.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <BookOpen className="w-8 h-8 text-rose-500" />
            </div>
            Blog Yazıları
          </h1>
          <p className="text-stone-500 mt-2 font-medium">
            Mini sitenizde görünecek blog yazılarını buradan yönetebilirsiniz.
          </p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="inline-flex items-center gap-2 bg-[#0c0a09] text-white px-6 py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Yeni Yazı Ekle
        </Link>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Toplam</p>
            <p className="text-2xl font-black text-stone-900">{posts.length}</p>
          </div>
        </div>
        
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-500 transition-colors" />
          <input
            type="text"
            placeholder="Başlık ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-3xl py-6 pl-14 pr-6 text-stone-900 font-medium focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Blog List */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-stone-200" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => togglePublished(post)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                      post.is_published
                        ? "bg-emerald-500/90 text-white"
                        : "bg-stone-500/90 text-white opacity-50 hover:opacity-100"
                    }`}
                    title={post.is_published ? "Yayında" : "Taslak"}
                  >
                    {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}
                </div>
                
                <h3 className="text-xl font-black text-stone-900 mb-3 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
                  {post.title}
                </h3>
                
                <div 
                  className="text-stone-500 text-sm line-clamp-3 mb-6 font-medium flex-1"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + "..." }}
                />

                <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/blog/${post.id}`}
                      className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <Link
                    href={`/dashboard/blog/${post.id}`}
                    className="flex items-center gap-2 text-sm font-black text-stone-900 group/link"
                  >
                    Düzenle
                    <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-stone-100">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-2">Henüz yazı yok</h2>
          <p className="text-stone-500 font-medium mb-8">
            İlk blog yazınızı ekleyerek mini sitenizi canlandırın.
          </p>
          <Link
            href="/dashboard/blog/new"
            className="inline-flex items-center gap-2 bg-[#0c0a09] text-white px-8 py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
          >
            <Plus className="w-5 h-5" />
            İlk Yazıyı Oluştur
          </Link>
        </div>
      )}
    </div>
  );
}
