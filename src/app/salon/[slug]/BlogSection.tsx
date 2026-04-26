"use client";

import { useState } from "react";
import { BookOpen, Calendar, ChevronRight, X, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { BlogPost } from "@/types";

interface BlogSectionProps {
  posts: BlogPost[];
  titleClass: string;
  cardBaseClass: string;
  primaryColor: string;
}

export default function BlogSection({ posts, titleClass, cardBaseClass, primaryColor }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: primaryColor }}>Yazılarımız</p>
          <h2 className={`text-3xl md:text-4xl ${titleClass}`}>Güzellik Sırları</h2>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className={`group cursor-pointer flex flex-col h-full ${cardBaseClass}`}
            onClick={() => setSelectedPost(post)}
          >
            {post.image_url && (
              <div className="aspect-video mb-6 overflow-hidden rounded-2xl relative">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">
              <Calendar className="w-3 h-3" />
              {format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-4 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
              {post.title}
            </h3>
            <div 
              className="text-stone-500 text-sm line-clamp-3 mb-6 font-medium flex-1"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>?/gm, '') }}
            />
            <div className="flex items-center gap-2 text-sm font-black text-stone-900 group/link mt-auto">
              Devamını Oku
              <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" style={{ color: primaryColor }} />
            </div>
          </div>
        ))}
      </div>

      {/* Blog Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedPost(null)}
          />
          <div className="relative w-full max-w-4xl max-h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 backdrop-blur-md border-b border-stone-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                    <BookOpen className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Blog Yazısı</p>
                    <p className="text-sm font-bold text-stone-900">Geri Dön</p>
                  </div>
               </div>
               <button 
                onClick={() => setSelectedPost(null)}
                className="w-10 h-10 rounded-full bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12">
               <div className="max-w-2xl mx-auto space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                       <Calendar className="w-4 h-4" />
                       {format(new Date(selectedPost.created_at), "d MMMM yyyy", { locale: tr })}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight">
                      {selectedPost.title}
                    </h2>
                  </div>

                  {selectedPost.image_url && (
                    <div className="aspect-video rounded-[2rem] overflow-hidden shadow-xl">
                       <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div 
                    className="prose prose-stone max-w-none text-stone-600 text-lg leading-relaxed font-medium space-y-6"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br/>') }}
                  />
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
               <button 
                onClick={() => setSelectedPost(null)}
                className="px-8 py-3 bg-white border border-stone-200 rounded-2xl font-bold text-stone-900 hover:bg-stone-100 transition-all shadow-sm"
               >
                 Kapat
               </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
