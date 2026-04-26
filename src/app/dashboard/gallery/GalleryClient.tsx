"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2, X, UploadCloud, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { GalleryItem } from "@/types";

interface GalleryClientProps {
  salonId: string;
  initialItems: GalleryItem[];
}

export default function GalleryClient({ salonId, initialItems }: GalleryClientProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", category: "" });
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `gallery/${salonId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("salon-logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("salon-logos")
        .getPublicUrl(filePath);

      const { data, error: dbError } = await (supabase
        .from("gallery_items") as any)
        .insert({
          salon_id: salonId,
          image_url: publicUrl,
          title: newItem.title,
          category: newItem.category
        } as any)
        .select()
        .single();

      if (dbError) throw dbError;

      setItems([data, ...items]);
      toast.success("Fotoğraf başarıyla eklendi.");
      setShowUploadModal(false);
      setNewItem({ title: "", category: "" });
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;

    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Hata: " + error.message);
    } else {
      setItems(items.filter(item => item.id !== id));
      toast.success("Fotoğraf silindi.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <Camera className="w-8 h-8 text-rose-500" />
            </div>
            Galeri / Portfolyo
          </h1>
          <p className="text-stone-500 mt-2 font-medium">
            Salonunuzda yaptığınız harika işleri burada sergileyin.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 bg-[#0c0a09] text-white px-6 py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Fotoğraf Ekle
        </button>
      </div>

      {/* Grid Display */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-[2rem] overflow-hidden border border-stone-100 bg-white shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500"
            >
              <img
                src={item.image_url}
                alt={item.title || "Gallery Item"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 text-center">
                {item.title && <p className="text-white font-bold text-sm">{item.title}</p>}
                {item.category && <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">{item.category}</span>}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-stone-100">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-2">Henüz fotoğraf yok</h2>
          <p className="text-stone-500 font-medium mb-8">
            En güzel işlerinizi buraya ekleyerek müşterilerinizi etkileyin.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 bg-[#0c0a09] text-white px-8 py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
          >
            <Plus className="w-5 h-5" />
            İlk Fotoğrafı Ekle
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowUploadModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-stone-900">Fotoğraf Ekle</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-stone-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-1">Başlık (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: Gelin Saçı Tasarımı"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold placeholder:text-stone-300 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-1">Kategori</label>
                <input
                  type="text"
                  placeholder="Örn: Saç, Tırnak, Makyaj"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 font-bold placeholder:text-stone-300 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all"
                />
              </div>

              <div className="pt-4">
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-stone-100 rounded-[2rem] hover:bg-stone-50 hover:border-rose-200 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {uploading ? <Loader2 className="w-8 h-8 animate-spin text-rose-500" /> : <UploadCloud className="w-8 h-8 text-stone-400" />}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-stone-900">Dosya Seçin</p>
                      <p className="text-xs text-stone-400 font-medium">veya sürükleyip bırakın</p>
                    </div>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
