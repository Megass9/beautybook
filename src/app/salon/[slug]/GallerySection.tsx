"use client";

import { useState } from "react";
import { Camera, X, Maximize2, ChevronRight, ChevronLeft } from "lucide-react";
import type { GalleryItem } from "@/types";

interface GallerySectionProps {
  items: GalleryItem[];
  titleClass: string;
  primaryColor: string;
}

export default function GallerySection({ items, titleClass, primaryColor }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % items.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + items.length) % items.length);
    }
  };

  return (
    <section className="animate-fade-in-up">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: primaryColor }}>Çalışmalarımız</p>
          <h2 className={`text-3xl md:text-4xl ${titleClass}`}>Galeri</h2>
        </div>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {items.map((item, idx) => (
          <div 
            key={item.id} 
            className="relative group cursor-pointer break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-stone-100"
            onClick={() => setSelectedImage(idx)}
          >
            <img 
              src={item.image_url} 
              alt={item.title || "Gallery"} 
              className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                  <Maximize2 className="w-5 h-5" />
               </div>
            </div>
            {item.category && (
              <div className="absolute bottom-4 left-4">
                 <span className="text-[9px] bg-white/80 backdrop-blur-md text-stone-900 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                   {item.category}
                 </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl animate-in fade-in duration-300" 
            onClick={() => setSelectedImage(null)}
          />
          
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-full flex flex-col items-center animate-in zoom-in-95 fade-in duration-300">
             <img 
               src={items[selectedImage].image_url} 
               alt={items[selectedImage].title || "Gallery"} 
               className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
             />
             {(items[selectedImage].title || items[selectedImage].category) && (
               <div className="mt-8 text-center space-y-2">
                  {items[selectedImage].title && <h3 className="text-2xl font-black text-white">{items[selectedImage].title}</h3>}
                  {items[selectedImage].category && <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-xs">{items[selectedImage].category}</p>}
               </div>
             )}
             <div className="mt-6 flex gap-2">
                {items.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === selectedImage ? 'bg-white w-4' : 'bg-white/30'}`}
                  />
                ))}
             </div>
          </div>
        </div>
      )}
    </section>
  );
}
