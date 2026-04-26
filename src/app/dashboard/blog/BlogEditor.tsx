"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Image as ImageIcon, Globe, Lock, Trash2, Loader2, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { generateSlug } from "@/lib/utils/slug";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/types";

interface BlogEditorProps {
  salonId: string;
  post?: BlogPost;
}

export default function BlogEditor({ salonId, post }: BlogEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    image_url: post?.image_url || "",
    is_published: post?.is_published ?? true,
  });

  const [slugModified, setSlugModified] = useState(!!post?.slug);

  useEffect(() => {
    if (form.title && !slugModified) {
      setForm(prev => ({ ...prev, slug: generateSlug(form.title) }));
    }
  }, [form.title, slugModified]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `blog/${salonId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("salon-logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("salon-logos")
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Görsel yüklendi.");
    } catch (error: any) {
      toast.error("Yükleme hatası: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Lütfen başlık ve içerik alanlarını doldurun.");
      return;
    }

    setLoading(true);
    try {
      if (post) {
        const { error } = await (supabase
          .from("blog_posts") as any)
          .update(form)
          .eq("id", post.id);
        if (error) throw error;
        toast.success("Blog yazısı güncellendi.");
      } else {
        const { error } = await (supabase
          .from("blog_posts") as any)
          .insert({ ...form, salon_id: salonId } as any);
        if (error) throw error;
        toast.success("Blog yazısı oluşturuldu.");
      }
      router.push("/dashboard/blog");
      router.refresh();
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/blog"
            className="p-3 hover:bg-stone-100 rounded-2xl transition-all group"
          >
            <ArrowLeft className="w-6 h-6 text-stone-400 group-hover:text-stone-900" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              {post ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}
            </h1>
            <p className="text-stone-500 font-medium text-sm">
              Blog yazınızın detaylarını buradan belirleyin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#0c0a09] text-white px-8 py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {post ? "Değişiklikleri Kaydet" : "Yazıyı Yayınla"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title Area */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-1">Yazı Başlığı</label>
              <input
                type="text"
                placeholder="Örn: 2024 Saç Trendleri Neler?"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-stone-50 border-none rounded-2xl p-6 text-2xl font-black text-stone-900 placeholder:text-stone-300 focus:ring-4 focus:ring-rose-500/5 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-1 flex items-center justify-between">
                URL Adresi (Slug)
                <button 
                  type="button"
                  onClick={() => {
                    setSlugModified(false);
                    setForm(prev => ({ ...prev, slug: generateSlug(form.title) }));
                  }}
                  className="text-[10px] text-rose-500 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Sıfırla
                </button>
              </label>
              <div className="flex items-center gap-2 bg-stone-50 rounded-2xl px-6 py-4">
                <Globe className="w-4 h-4 text-stone-300" />
                <span className="text-stone-300 text-sm font-medium">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugModified(true);
                    setForm(prev => ({ ...prev, slug: e.target.value }));
                  }}
                  className="flex-1 bg-transparent border-none text-stone-600 font-bold text-sm focus:ring-0 p-0 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-4">
            <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-1">Yazı İçeriği</label>
            <textarea
              placeholder="Hikayenizi buraya yazın..."
              value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              className="w-full min-h-[400px] bg-transparent border-none text-stone-700 text-lg leading-relaxed placeholder:text-stone-200 focus:ring-0 p-0 outline-none resize-none"
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          {/* Status Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <label className="font-bold text-stone-900">Yayın Durumu</label>
                <div 
                  onClick={() => setForm(prev => ({ ...prev, is_published: !prev.is_published }))}
                  className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${form.is_published ? "bg-emerald-500" : "bg-stone-200"}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${form.is_published ? "left-8" : "left-1"}`} />
                </div>
             </div>
             <p className="text-xs text-stone-500 font-medium">
               {form.is_published 
                 ? "Bu yazı mini sitenizde herkes tarafından görüntülenebilir." 
                 : "Bu yazı sadece size görünür, taslak olarak kaydedilir."}
             </p>
          </div>

          {/* Cover Image Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm space-y-4">
            <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-1">Kapak Görseli</label>
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-50 group border-2 border-dashed border-stone-100">
               {form.image_url ? (
                 <>
                   <img src={form.image_url} alt="Cover" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="p-3 bg-white rounded-xl cursor-pointer hover:scale-110 transition-transform">
                        <ImageIcon className="w-5 h-5 text-stone-900" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                      <button 
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, image_url: "" }))}
                        className="p-3 bg-red-500 rounded-xl hover:scale-110 transition-transform text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                 </>
               ) : (
                 <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100/50 transition-all gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      {uploading ? <Loader2 className="w-6 h-6 animate-spin text-rose-500" /> : <ImageIcon className="w-6 h-6 text-stone-400" />}
                    </div>
                    <div className="text-center">
                       <p className="text-sm font-bold text-stone-900">Görsel Yükle</p>
                       <p className="text-[10px] text-stone-400 font-medium">PNG, JPG veya WebP</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                 </label>
               )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-[2rem] text-white shadow-xl shadow-rose-200 relative overflow-hidden">
             <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/20 -rotate-12" />
             <h4 className="font-black text-lg mb-2 relative z-10">İpucu</h4>
             <p className="text-rose-50/80 text-sm font-medium leading-relaxed relative z-10">
               Blog yazıları SEO için harikadır. Anahtar kelimeler kullanarak mini sitenizin Google'da daha üst sıralarda çıkmasını sağlayabilirsiniz.
             </p>
          </div>
        </div>
      </div>
    </form>
  );
}
