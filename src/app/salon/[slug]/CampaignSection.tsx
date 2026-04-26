"use client";

import { Tag, Sparkles, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Campaign } from "@/types";

interface CampaignSectionProps {
  campaigns: Campaign[];
  primaryColor: string;
}

export default function CampaignSection({ campaigns, primaryColor }: CampaignSectionProps) {
  const activeCampaigns = campaigns.filter(c => {
    const now = new Date();
    return c.is_active && new Date(c.start_date) <= now && new Date(c.end_date) >= now;
  });

  if (activeCampaigns.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {activeCampaigns.map((c) => (
        <div 
          key={c.id} 
          className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 border border-amber-100 bg-gradient-to-br from-amber-50/50 to-rose-50/30 group"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-bl-[10rem] -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-200/20 rounded-tr-[8rem] -ml-8 -mb-8 blur-xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-amber-200/50 flex items-center justify-center shrink-0 border border-amber-50">
               <Tag className="w-10 h-10 text-amber-500" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                 <h3 className="text-2xl font-black text-stone-900 tracking-tight">{c.title}</h3>
                 <div className="bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-amber-200">
                    {c.discount_type === 'percent' ? `%${c.discount_value}` : `₺${c.discount_value}`} İNDİRİM
                 </div>
               </div>
               <p className="text-stone-500 font-medium text-lg">{c.description}</p>
               <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-400 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Son Gün: {format(new Date(c.end_date), "d MMMM", { locale: tr })}
                  </div>
                  {c.code && (
                    <div className="flex items-center gap-2 text-xs font-black text-stone-900 bg-amber-100/50 px-4 py-2 rounded-full border border-amber-200">
                      KOD: {c.code}
                    </div>
                  )}
               </div>
            </div>

            <button 
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
              Randevu Al <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
