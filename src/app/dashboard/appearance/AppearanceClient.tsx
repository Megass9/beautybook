"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Save, RefreshCw, Sparkles, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

const DESIGN_PRESETS = [
  { id: "elegantDark", name: "Elegant Dark", defaultColor: "#e11d48", description: "Koyu hero, premium hissiyat." },
  { id: "luxuryGlow", name: "Luxury Glow", defaultColor: "#7c3aed", description: "Parlayan efektler ve lüks hissi." },
  { id: "freshLight", name: "Fresh Light", defaultColor: "#0ea5e9", description: "Aydınlık, dinamik ve ferah düzen." },
  { id: "minimalCalm", name: "Minimal Calm", defaultColor: "#16a34a", description: "Sade çizgiler ve huzurlu akış." },
] as const;

const PREDEFINED_COLORS = [
  { name: "Gül", value: "#e11d48" },
  { name: "Mor", value: "#7c3aed" },
  { name: "Mavi", value: "#0ea5e9" },
  { name: "Yeşil", value: "#16a34a" },
  { name: "Kehribar", value: "#d97706" },
  { name: "Pembe", value: "#db2777" },
  { name: "Zümrüt", value: "#059669" },
  { name: "Koyu", value: "#1c1917" },
];

type DesignVariant = (typeof DESIGN_PRESETS)[number]["id"];

export default function AppearanceClient({ salon }: { salon: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [selectedVariant, setSelectedVariant] = useState<DesignVariant>(
    salon.theme_variant || "elegantDark"
  );
  const [selectedColor, setSelectedColor] = useState(
    salon.theme_color || DESIGN_PRESETS.find(p => p.id === selectedVariant)?.defaultColor || "#e11d48"
  );

  const activePreset = DESIGN_PRESETS.find((preset) => preset.id === selectedVariant);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await (supabase as any)
      .from("salons")
      .update({ theme_color: selectedColor, theme_variant: selectedVariant })
      .eq("id", salon.id);

    if (error) {
      toast.error("Ayarlar kaydedilemedi: " + error.message);
    } else {
      toast.success("Tasarım ayarları güncellendi!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Ayarlar Paneli */}
      <div className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm space-y-10">
        
        {/* Tema Seçimi */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <label className="font-bold text-stone-800 text-lg">Tasarım Teması</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DESIGN_PRESETS.map((preset) => {
              const isActive = selectedVariant === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedVariant(preset.id)}
                  className={`text-left border-2 rounded-2xl p-4 transition-all ${
                    isActive ? "border-stone-900 shadow-md bg-stone-50" : "border-stone-100 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-stone-900">{preset.name}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-stone-900" />}
                  </div>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Renk Seçimi */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-5 h-5 text-rose-500" />
            <label className="font-bold text-stone-800 text-lg">Ana Renk</label>
          </div>
          <div className="flex flex-wrap gap-3">
            {PREDEFINED_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-10 h-10 rounded-full transition-all border-2 ${
                  selectedColor === color.value ? "scale-110 shadow-lg border-white ring-2 ring-stone-900" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-stone-200 hover:border-stone-400 transition-all">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                title="Özel Renk Seç"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-xs font-bold text-stone-500">Seçilen HEX Kodu:</span>
             <code className="text-xs font-black text-stone-700 bg-stone-100 px-2 py-1 rounded">{selectedColor.toUpperCase()}</code>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Değişiklikleri Kaydet
        </button>
      </div>

      {/* Önizleme Paneli */}
      <div className="bg-stone-100 rounded-[2.5rem] p-8 border border-stone-200 flex flex-col items-center justify-center relative overflow-hidden">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6 relative z-10">Önizleme</p>
        
        <div className="w-full max-w-[280px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200 relative z-10">
          <div className="h-24 transition-colors duration-500" style={{ backgroundColor: selectedColor }} />
          <div className="p-6 -mt-10">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-stone-100 mb-4 flex items-center justify-center font-black text-xl transition-colors duration-500" style={{ color: selectedColor }}>
              {salon.name[0]}
            </div>
            <div className="h-4 w-3/4 bg-stone-100 rounded-full mb-2" />
            <div className="h-3 w-1/2 bg-stone-50 rounded-full mb-6" />
            
            <div className="space-y-2">
              <div className="h-10 w-full rounded-xl transition-colors duration-500" style={{ backgroundColor: selectedColor, opacity: 0.1 }} />
              <div className="h-10 w-full rounded-xl transition-colors duration-500" style={{ backgroundColor: selectedColor }} />
            </div>
          </div>
        </div>

        {/* Dekoratif Arkaplan */}
        <div 
          className="absolute inset-0 opacity-10 transition-colors duration-500" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 50% 50%, ${selectedColor} 0%, transparent 50%)`,
            filter: 'blur(40px)'
          }} 
        />
      </div>
    </div>
  );
}