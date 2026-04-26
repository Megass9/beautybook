"use client";

// @ts-ignore
import "./builder.css";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Settings2,
  Eye,
  Save,
  Type,
  Image as ImageIcon,
  Layout,
  Star,
  MessageSquare,
  Clock,
  X,
  Monitor,
  Smartphone,
  Sparkles,
  Scissors,
  Users,
  MapPin,
  Calendar,
  Undo2,
  Redo2,
  MoveVertical,
  MousePointer2,
  Zap,
  Globe,
  Square,
  Circle,
  Shapes,
  Type as TypeIcon,
  Palette,
  Box,
  Maximize2,
  Check,
  ChevronRight,
  Loader2,
  Copy,
  Download,
  Upload
} from "lucide-react";
import toast from "react-hot-toast";

// --- TYPES ---
type SectionType = 'hero' | 'services' | 'about' | 'gallery' | 'reviews' | 'blog' | 'staff' | 'booking' | 'footer' | 'spacer';

interface SectionStyle {
  paddingTop: number;
  paddingBottom: number;
  backgroundColor: string;
  backgroundImage?: string;
  textColor: string;
  animation: 'none' | 'fade' | 'slide' | 'zoom';
  divider: 'none' | 'wave' | 'curve' | 'slant';
  dividerColor?: string;
  borderRadius: number;
  shadow: 'none' | 'sm' | 'lg' | 'xl';
}

interface GlobalConfig {
  fontFamily: 'sans' | 'serif' | 'mono';
  primaryColor: string;
  borderRadius: number;
  buttonStyle: 'rounded' | 'square' | 'pill';
}

interface Section {
  id: string;
  type: SectionType;
  props: any;
  style: SectionStyle;
}

const THEMES = [
  { id: 'elegantDark', name: 'Elegant Dark', color: '#e11d48', font: 'sans' },
  { id: 'luxuryGlow', name: 'Luxury Glow', color: '#7c3aed', font: 'serif' },
  { id: 'freshLight', name: 'Fresh Light', color: '#0ea5e9', font: 'sans' },
  { id: 'minimalCalm', name: 'Minimal Calm', color: '#16a34a', font: 'mono' },
];

const DEFAULT_STYLE: SectionStyle = {
  paddingTop: 80,
  paddingBottom: 80,
  backgroundColor: 'transparent',
  textColor: '#1c1917',
  animation: 'fade',
  divider: 'none',
  borderRadius: 0,
  shadow: 'none'
};

// --- MAIN COMPONENT ---
export default function BuilderClient({ salon, services, staff }: any) {
  const [sections, setSections] = useState<Section[]>([]);
  const [history, setHistory] = useState<Section[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'global'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    fontFamily: 'sans',
    primaryColor: salon.theme_color || '#e11d48',
    borderRadius: 24,
    buttonStyle: 'pill'
  });

  // --- LOAD SYSTEM ---
  useEffect(() => {
    const initBuilder = async () => {
      try {
        const res = await fetch('/api/get-builder');
        const data = await res.json();
        
        // Eğer veritabanında kayıtlı veri varsa onu yükle
        if (data && data.sections && data.sections.length > 0) {
          setSections(data.sections);
          setHistory([data.sections]);
          setHistoryIndex(0);
          setGlobalConfig(data.globalConfig);
        } else {
          // Veri yoksa (ilk kez açılıyorsa) varsayılanları yükle
          const initial = [
            { id: 'hero-1', type: 'hero', props: { title: salon.name, subtitle: salon.description || "Premium Güzellik Deneyimi", buttonText: "Randevu Al", layout: 'split' }, style: { ...DEFAULT_STYLE, paddingTop: 100, paddingBottom: 100 } },
            { id: 'services-1', type: 'services', props: { title: "Hizmetlerimiz", columns: 2, variant: 'cards' }, style: DEFAULT_STYLE },
            { id: 'booking-1', type: 'booking', props: { title: "Rezervasyon" }, style: { ...DEFAULT_STYLE, backgroundColor: '#1c1917', textColor: '#ffffff', divider: 'wave', dividerColor: '#1c1917' } },
            { id: 'footer-1', type: 'footer', props: {}, style: { ...DEFAULT_STYLE, paddingTop: 40, paddingBottom: 40 } },
          ] as Section[];
          setSections(initial);
          setHistory([initial]);
          setHistoryIndex(0);
        }
        
        if (data && data.globalConfig) {
          setGlobalConfig(prev => ({ ...prev, ...data.globalConfig }));
        }

        setIsLoaded(true);
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    initBuilder();
  }, []);

  // --- AUTO SAVE SYSTEM ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Sadece değişiklik varsa ve boş değilse kaydet
      // isLoaded kontrolü ekledik ki boş veri açılışta veritabanını silmesin
      if (isLoaded && sections.length > 0) {
        setIsSaving(true);
        try {
          const res = await fetch('/api/save-builder', {
            method: 'POST',
            body: JSON.stringify({ sections, globalConfig }),
            headers: { 'Content-Type': 'application/json' }
          });
          if (res.ok) {
            setLastSaved(new Date());
          }
        } catch (err) {
          console.error("Save error:", err);
        } finally {
          setIsSaving(false);
        }
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [sections, globalConfig]);

  const addToHistory = (newSections: Section[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newSections]);
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setSections(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
      toast.success("Geri alındı");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setSections(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
      toast.success("Yineleme yapıldı");
    }
  };

  const addSection = (type: SectionType) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultsForType(type),
      style: { ...DEFAULT_STYLE }
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    addToHistory(newSections);
    setSelectedId(newSection.id);
    toast.success(`${type} bölümü eklendi.`);
  };

  const duplicateSection = (id: string) => {
    const sectionToClone = sections.find(s => s.id === id);
    if (!sectionToClone) return;

    const newSection: Section = {
      ...JSON.parse(JSON.stringify(sectionToClone)),
      id: `${sectionToClone.type}-${Date.now()}`
    };

    const index = sections.findIndex(s => s.id === id);
    const newSections = [...sections];
    newSections.splice(index + 1, 0, newSection);

    setSections(newSections);
    addToHistory(newSections);
    setSelectedId(newSection.id);
    toast.success("Bölüm kopyalandı");
  };

  const deleteSection = (id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    addToHistory(newSections);
    if (selectedId === id) setSelectedId(null);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    const newSections = sections.map(s => s.id === id ? { ...s, ...updates } : s);
    setSections(newSections);
  };

  const updateInlineText = (id: string, key: string, value: string) => {
    const newSections = sections.map((s: any) => {
      if (s.id === id) {
        return { ...s, props: { ...s.props, [key]: value } };
      }
      return s;
    });
    setSections(newSections);
    addToHistory(newSections);
  };

  const exportData = () => {
    const data = JSON.stringify({ sections, globalConfig }, null, 2);
    navigator.clipboard.writeText(data);
    toast.success("Konfigürasyon panoya kopyalandı");
  };

  const importData = () => {
    const input = prompt("Lütfen builder JSON verisini buraya yapıştırın:");
    if (!input) return;
    try {
      const data = JSON.parse(input);
      if (data.sections && data.globalConfig) {
        setSections(data.sections);
        setGlobalConfig(data.globalConfig);
        addToHistory(data.sections);
        toast.success("Site başarıyla yüklendi");
      } else {
        toast.error("Geçersiz format");
      }
    } catch (err) {
      toast.error("JSON okuma hatası");
    }
  };

  const saveHistoryStep = () => addToHistory(sections);

  const selectedSection = sections.find(s => s.id === selectedId);

  // --- DRAG & DROP ---
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newSections = [...sections];
    const item = newSections.splice(draggedIndex, 1)[0];
    newSections.splice(index, 0, item);
    setSections(newSections);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
    addToHistory(sections);
  };

  return (
    <div className={`flex h-screen bg-stone-100 overflow-hidden text-stone-900 font-${globalConfig.fontFamily}`}>

      {/* ── LEFT: TOOLBOX ── */}
      <aside className={`w-20 bg-[#0c0a09] flex flex-col items-center py-8 gap-8 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.1)] transition-all duration-500 ${isPreviewMode ? '-translate-x-full' : ''}`}>
        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 rotate-3">
          <Sparkles className="w-6 h-6 fill-white" />
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          <ToolIcon icon={<Type />} label="Hero" onClick={() => addSection('hero')} />
          <ToolIcon icon={<Scissors />} label="Hizmet" onClick={() => addSection('services')} />
          <ToolIcon icon={<ImageIcon />} label="Galeri" onClick={() => addSection('gallery')} />
          <ToolIcon icon={<Users />} label="Ekip" onClick={() => addSection('staff')} />
          <ToolIcon icon={<Star />} label="Yorum" onClick={() => addSection('reviews')} />
          <ToolIcon icon={<Calendar />} label="Randevu" onClick={() => addSection('booking')} />
          <ToolIcon icon={<MapPin />} label="Adres" onClick={() => addSection('about')} />
        </div>

        <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
          <ToolIcon icon={<Download />} label="Dışa Aktar (Export)" onClick={exportData} />
          <ToolIcon icon={<Upload />} label="İçe Aktar (Import)" onClick={importData} />
          <button onClick={() => { setSelectedId(null); setActiveTab('global'); }} className="p-3 text-stone-500 hover:text-white transition-colors">
            <Palette className="w-5 h-5" />
          </button>
          <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isPreviewMode ? 'bg-rose-500 text-white shadow-xl' : 'bg-stone-800 text-stone-400 hover:text-white'}`}>
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── MAIN CANVAS ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* Header bar */}
        {!isPreviewMode && (
          <header className="h-16 bg-white border-b border-stone-200 px-8 flex items-center justify-between z-40">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
                <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-white rounded-lg disabled:opacity-20 transition-all"><Undo2 className="w-4 h-4" /></button>
                <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-white rounded-lg disabled:opacity-20 transition-all"><Redo2 className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Hazır Temalar:</span>
                <div className="flex gap-2">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setGlobalConfig({ ...globalConfig, primaryColor: t.color, fontFamily: t.font as any })}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-125 ${globalConfig.primaryColor === t.color ? 'border-stone-900 scale-110 shadow-lg' : 'border-white'}`}
                      style={{ backgroundColor: t.color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button onClick={() => setViewDevice('desktop')} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewDevice === 'desktop' ? 'bg-white shadow-lg text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>
                <Monitor className="w-4 h-4" /> Masaüstü
              </button>
              <button onClick={() => setViewDevice('mobile')} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewDevice === 'mobile' ? 'bg-white shadow-lg text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>
                <Smartphone className="w-4 h-4" /> Mobil
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${isSaving ? 'text-amber-500 bg-amber-50 border-amber-100' : 'text-emerald-500 bg-emerald-50 border-emerald-100'}`}>
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isSaving ? 'Değişiklikler Kaydediliyor...' : 'Tüm Değişiklikler Kaydedildi'}
                </span>
              </div>
              <button className="flex items-center gap-2 bg-[#0c0a09] hover:bg-black text-white px-8 py-3 rounded-2xl text-xs font-black shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em]">
                <Globe className="w-4 h-4 text-rose-500" /> Yayınla
              </button>
            </div>
          </header>
        )}

        {/* Floating Preview Close Button */}
        {isPreviewMode && (
          <button
            onClick={() => setIsPreviewMode(false)}
            className="fixed top-8 right-8 z-[100] bg-stone-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Önizlemeden Çık
          </button>
        )}

        {/* Builder View */}
        <div className={`flex-1 overflow-y-auto no-scrollbar flex justify-center items-start pattern-dots transition-all duration-500 ${isPreviewMode ? 'bg-white p-0' : 'bg-[#fcfaf9] p-12'}`}>
          <div className={`transition-all duration-1000 bg-white overflow-hidden relative ${isPreviewMode && viewDevice === 'desktop' ? 'w-full min-h-full' : viewDevice === 'desktop' ? 'w-full max-w-[1200px] min-h-full rounded-b-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.12)]' : 'w-[375px] h-[812px] rounded-[4rem] border-[16px] border-[#0c0a09] sticky top-4 shadow-2xl'}`}>

            <div className="h-full overflow-y-auto no-scrollbar scroll-smooth">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  draggable={!isPreviewMode}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => !isPreviewMode && setSelectedId(section.id)}
                  className={`group relative transition-all duration-500 ${!isPreviewMode ? 'hover:ring-4 hover:ring-rose-500/10' : ''} ${selectedId === section.id && !isPreviewMode ? 'ring-4 ring-rose-500 z-10' : ''}`}
                >
                  {/* Section UI Controls */}
                  {!isPreviewMode && selectedId === section.id && (
                    <div className="absolute top-0 right-10 flex gap-2 z-30 translate-y-[-100%]">
                      <div className="bg-rose-500 text-white text-[11px] font-black px-5 py-2.5 rounded-t-2xl shadow-2xl uppercase tracking-widest flex items-center gap-2">
                        <Shapes className="w-3.5 h-3.5" /> {section.type}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }} className="bg-white text-stone-900 p-2.5 rounded-t-2xl shadow-2xl border-x border-t border-stone-100 hover:bg-stone-50 transition-colors" title="Kopyala">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className="bg-white text-rose-500 p-2.5 rounded-t-2xl shadow-2xl border-x border-t border-stone-100 hover:bg-rose-50 transition-colors" title="Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Grab Handle */}
                  {!isPreviewMode && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 cursor-grab active:cursor-grabbing hover:scale-110">
                      <div className="w-10 h-16 bg-white border border-stone-100 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-2xl">
                        <div className="w-1 h-1 bg-stone-300 rounded-full" />
                        <div className="w-1 h-1 bg-stone-300 rounded-full" />
                        <div className="w-1 h-1 bg-stone-300 rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* Section Divider Top */}
                  {section.style.divider !== 'none' && (
                    <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-10 pointer-events-none">
                      <ShapeDivider type={section.style.divider} color={section.style.dividerColor || section.style.backgroundColor} />
                    </div>
                  )}

                  {/* Main Content Area */}
                  <div
                    style={{
                      paddingTop: section.style.paddingTop,
                      paddingBottom: section.style.paddingBottom,
                      backgroundColor: section.style.backgroundColor,
                      color: section.style.textColor,
                      borderRadius: section.style.borderRadius,
                    }}
                    className={`transition-all duration-700 relative overflow-hidden ${section.style.animation === 'fade' ? 'animate-fade-in' : section.style.animation === 'zoom' ? 'animate-zoom-in' : ''} ${section.style.shadow === 'xl' ? 'shadow-[0_40px_80px_rgba(0,0,0,0.1)]' : ''}`}
                  >
                    {/* Background Overlay */}
                    {section.style.backgroundImage && (
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={section.style.backgroundImage} className="w-full h-full object-cover opacity-20" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                      </div>
                    )}

                    <div className="relative z-20">
                      <SectionRenderer
                        section={section}
                        salon={salon}
                        services={services}
                        staff={staff}
                        config={globalConfig}
                        isPreviewMode={isPreviewMode}
                        onUpdateInlineText={updateInlineText}
                      />
                    </div>
                  </div>

                  {/* Section Divider Bottom */}
                  {section.style.divider !== 'none' && (
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none translate-y-full">
                      <ShapeDivider type={section.style.divider} color={section.style.dividerColor || section.style.backgroundColor} />
                    </div>
                  )}
                </div>
              ))}

              {sections.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[600px] text-stone-300 animate-pulse">
                  <Layout className="w-24 h-24 mb-6 opacity-5" />
                  <p className="font-black uppercase tracking-[0.4em] text-sm opacity-20">Boş Canvas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: SETTINGS ── */}
      {!isPreviewMode && (
        <aside className="w-[400px] bg-white border-l border-stone-200 flex flex-col z-50 shadow-[0_0_50px_rgba(0,0,0,0.05)]">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Selector */}
            <div className="px-8 pt-8 pb-0 bg-stone-50/50 border-b border-stone-100 shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center shadow-sm">
                    {selectedId ? <Settings2 className="w-5 h-5 text-rose-500" /> : <Palette className="w-5 h-5 text-stone-900" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">{selectedId ? 'Bölüm Ayarları' : 'Global Stil'}</h3>
                    <p className="text-[10px] font-bold text-stone-400 mt-0.5">{selectedId ? selectedSection?.type.toUpperCase() : 'MARKA KİMLİĞİ'}</p>
                  </div>
                </div>
                {selectedId && <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>}
              </div>

              <div className="flex gap-8">
                {(['content', 'style', 'global'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-rose-500 text-stone-900' : 'border-transparent text-stone-300 hover:text-stone-500'}`}
                  >
                    {tab === 'content' ? 'İçerik' : tab === 'style' ? 'Tasarım' : 'Global'}
                  </button>
                ))}
              </div>
            </div>

            {/* Panels */}
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar scroll-smooth">
              {activeTab === 'global' ? (
                <GlobalSettingsPanel
                  config={globalConfig}
                  onChange={setGlobalConfig}
                />
              ) : selectedSection ? (
                activeTab === 'content' ? (
                  <ContentSettingsPanel
                    section={selectedSection}
                    onChange={(p: any) => updateSection(selectedSection.id, { props: { ...selectedSection.props, ...p } })}
                    onBlur={saveHistoryStep}
                  />
                ) : (
                  <StyleSettingsPanel
                    style={selectedSection.style}
                    onChange={(s: any) => updateSection(selectedSection.id, { style: { ...selectedSection.style, ...s } })}
                    onBlur={saveHistoryStep}
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fade-in">
                  <MousePointer2 className="w-16 h-16 text-stone-100 mb-6" />
                  <h4 className="font-black text-stone-900 mb-2 italic">Düzenlemeye Başla</h4>
                  <p className="text-xs text-stone-400 leading-relaxed max-w-[200px]">Bir bölüm seçin veya genel görünümü değiştirmek için "Global" sekmesine gidin.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

    </div>
  );
}

// --- SUB-COMPONENTS: RENDERERS ---

function ToolIcon({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="group relative focus:outline-none">
      <div className="w-12 h-12 bg-stone-900/50 text-stone-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-xl border border-white/5">
        {icon}
      </div>
      <div className="absolute left-full ml-4 px-3 py-2 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0 z-[100] shadow-2xl">
        {label}
      </div>
    </button>
  );
}

function SectionRenderer({ section, salon, services, staff, config, isPreviewMode, onUpdateInlineText }: any) {
  const { type, props } = section;
  const [currentStep, setCurrentStep] = useState(1);

  switch (type) {
    case 'hero':
      return (
        <div className={`max-w-6xl mx-auto px-10 flex flex-col items-center gap-12 ${props.layout === 'split' ? 'md:flex-row text-left' : 'text-center'}`}>
          <div className={`flex-1 space-y-8 ${props.layout === 'split' ? 'md:pr-12' : ''}`}>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-rose-500/5 border border-rose-500/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 animate-fade-in">
              <Sparkles className="w-3 h-3" /> Hoş Geldiniz
            </div>
            <h1
              contentEditable={!isPreviewMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateInlineText(section.id, 'title', e.currentTarget.textContent || '')}
              className="text-5xl md:text-8xl font-black text-stone-900 leading-[1] tracking-tighter outline-none focus:ring-4 focus:ring-rose-500/10 rounded-3xl transition-all"
              style={{ fontFamily: config.fontFamily === 'serif' ? 'serif' : 'inherit' }}
            >
              {props.title}
            </h1>
            <p
              contentEditable={!isPreviewMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateInlineText(section.id, 'subtitle', e.currentTarget.textContent || '')}
              className="text-stone-500 text-xl font-medium max-w-2xl leading-relaxed outline-none focus:ring-4 focus:ring-rose-500/10 rounded-3xl transition-all"
            >
              {props.subtitle}
            </p>
            <button
              className={`px-12 py-5 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all ${config.buttonStyle === 'pill' ? 'rounded-full' : config.buttonStyle === 'rounded' ? 'rounded-2xl' : 'rounded-none'}`}
              style={{ backgroundColor: config.primaryColor }}
            >
              {props.buttonText}
            </button>
          </div>
          {props.layout === 'split' && (
            <div className="flex-1 w-full aspect-[4/5] bg-stone-50 rounded-[4rem] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-transparent" />
              <ImageIcon className="absolute inset-0 m-auto w-16 h-16 text-stone-200 group-hover:scale-110 transition-transform duration-1000" />
            </div>
          )}
        </div>
      );
    case 'services':
      return (
        <div className="max-w-6xl mx-auto px-10 space-y-16">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-stone-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Menü</div>
            <h2
              contentEditable={!isPreviewMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateInlineText(section.id, 'title', e.currentTarget.textContent || '')}
              className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight outline-none focus:ring-4 focus:ring-rose-500/10 rounded-2xl px-4 transition-all"
            >
              {props.title}
            </h2>
            <div className="w-16 h-1 rounded-full" style={{ backgroundColor: config.primaryColor }} />
          </div>
          <div className={`grid gap-8 ${props.columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            {(services?.length > 0 ? services.slice(0, 4) : Array(4).fill({ name: 'Hizmet Adı', price: 100, duration_minutes: 30 })).map((s: any, i: number) => (
              <div key={i} className={`group bg-white p-8 border border-stone-100 transition-all duration-500 flex items-start gap-6 ${props.variant === 'minimal' ? 'border-none p-0' : 'rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1'}`}>
                <div className="w-16 h-16 bg-stone-50 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:bg-rose-500/5 transition-colors">
                  <Scissors className="w-7 h-7 text-stone-200 group-hover:text-rose-500 transition-colors" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-black text-xl text-stone-900 tracking-tight group-hover:text-rose-600 transition-colors">{s.name}</p>
                    <span className="font-black text-2xl tabular-nums" style={{ color: config.primaryColor }}>₺{s.price}</span>
                  </div>
                  <p className="text-stone-400 text-xs font-medium leading-relaxed line-clamp-2">Premium ürünler ve uzman kadromuzla kendinizi özel hissedin.</p>
                  <div className="pt-2 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-stone-300">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {s.duration_minutes || 30} DK</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Popüler</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'booking':
      return (
        <div className="max-w-6xl mx-auto px-10">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Sol Taraf: Randevu Formu Önizlemesi */}
            <div className="space-y-10">
              <div className="text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Hızlı Rezervasyon</div>
                <h2
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateInlineText(section.id, 'title', e.currentTarget.textContent || '')}
                  className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter outline-none focus:ring-4 focus:ring-rose-500/10 rounded-2xl transition-all"
                >
                  {props.title}
                </h2>
                <p 
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateInlineText(section.id, 'subtitle', e.currentTarget.textContent || '')}
                  className="text-stone-400 text-lg font-medium max-w-xl"
                >
                  {props.subtitle || "Sadece birkaç adımda hayalinizdeki bakıma kavuşun. 7/24 anında onaylı rezervasyon imkanı."}
                </p>
              </div>

              <div className="bg-white rounded-[3rem] border border-stone-200/60 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.04)] relative">
                {/* Geri Butonu (Sadece 2. adım ve sonrasında) */}
                {currentStep > 1 && (
                  <button 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="absolute top-8 left-8 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <Undo2 className="w-3 h-3" /> Geri
                  </button>
                )}

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 relative max-w-md mx-auto">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-100 z-0" />
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-900 z-0 transition-all duration-500" 
                    style={{ 
                      backgroundColor: config.primaryColor,
                      width: `${(currentStep - 1) * 33.33}%`
                    }} 
                  />
                  {[
                    { id: 1, label: 'Hizmet' },
                    { id: 2, label: 'Uzman' },
                    { id: 3, label: 'Zaman' },
                    { id: 4, label: 'Onay' }
                  ].map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-4 border-white transition-all duration-500 ${
                          s.id === currentStep ? 'bg-stone-900 text-white scale-110 shadow-lg' : 
                          s.id < currentStep ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-400'
                        }`} 
                        style={s.id === currentStep ? { backgroundColor: config.primaryColor } : s.id < currentStep ? { backgroundColor: '#10b981' } : {}}
                      >
                        {s.id < currentStep ? <Check className="w-5 h-5" /> : s.id}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${s.id === currentStep ? 'text-stone-900' : 'text-stone-300'}`}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* İçerik Değişimi */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-stone-900 tracking-tight">Hizmet Seçiniz</h3>
                      <span className="text-[10px] font-bold text-stone-400 uppercase bg-stone-50 px-3 py-1 rounded-full">Aşama 1/4</span>
                    </div>
                    <div className="grid gap-3">
                      {(services?.length > 0 ? services.slice(0, 3) : Array(3).fill({ name: 'Bakım Hizmeti', price: 250, duration_minutes: 45 })).map((s: any, i: number) => (
                        <div 
                          key={i} 
                          onClick={() => setCurrentStep(2)}
                          className="p-5 bg-stone-50 rounded-[2rem] border border-stone-100 flex items-center justify-between group hover:bg-white hover:border-rose-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                              <Scissors className="w-5 h-5 text-stone-300" />
                            </div>
                            <div>
                              <p className="font-black text-stone-900 group-hover:text-rose-600 transition-colors">{s.name}</p>
                              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{s.duration_minutes || 30} Dakika</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-lg text-stone-900">₺{s.price}</span>
                            <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all shadow-sm">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-stone-900 tracking-tight">Uzman Seçiniz</h3>
                      <span className="text-[10px] font-bold text-stone-400 uppercase bg-stone-50 px-3 py-1 rounded-full">Aşama 2/4</span>
                    </div>
                    <div className="grid gap-4">
                      {(staff?.length > 0 ? staff.slice(0, 3) : [
                        { name: 'Ahmet Yılmaz', role: 'Baş Stilist' },
                        { name: 'Ayşe Kaya', role: 'Cilt Bakım Uzmanı' }
                      ]).map((member: any, i: number) => (
                        <div 
                          key={i}
                          onClick={() => setCurrentStep(3)}
                          className="flex items-center gap-4 p-4 bg-stone-50 rounded-[2rem] border border-stone-100 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-stone-200 rounded-2xl flex items-center justify-center text-stone-500 font-black text-xl overflow-hidden shadow-inner">
                            {member.image_url ? <img src={member.image_url} className="w-full h-full object-cover" /> : member.name[0]}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-stone-900 group-hover:text-rose-600 transition-colors">{member.name}</p>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{member.role || 'Uzman'}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all shadow-sm">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8 animate-fade-up">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-stone-900 tracking-tight">Zaman Seçiniz</h3>
                      <span className="text-[10px] font-bold text-stone-400 uppercase bg-stone-50 px-3 py-1 rounded-full">Aşama 3/4</span>
                    </div>
                    
                    {/* Mock Calendar Strip */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Tarih Seçin</p>
                      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() + i);
                          const isSelected = i === 0;
                          return (
                            <div 
                              key={i} 
                              className={`flex-shrink-0 w-16 h-20 rounded-[1.5rem] border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${isSelected ? 'bg-stone-900 border-stone-900 text-white shadow-lg scale-105' : 'bg-stone-50 border-stone-100 text-stone-400 hover:bg-white hover:border-stone-200'}`} 
                              style={isSelected ? { backgroundColor: config.primaryColor, borderColor: config.primaryColor } : {}}
                            >
                              <span className="text-[9px] font-bold uppercase opacity-60">
                                {date.toLocaleDateString('tr-TR', { weekday: 'short' })}
                              </span>
                              <span className="text-xl font-black">{date.getDate()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mock Time Grid */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Saat Seçin</p>
                      <div className="grid grid-cols-4 gap-2">
                        {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'].map((time, i) => (
                          <div 
                            key={time}
                            onClick={() => setCurrentStep(4)}
                            className={`py-3.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${i === 2 ? 'bg-stone-100 border-stone-200 text-stone-900 ring-2 ring-rose-500/20' : 'bg-white border-stone-100 text-stone-400 hover:border-rose-500/30 hover:text-rose-600 hover:-translate-y-0.5'}`}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8 animate-fade-up text-center py-4">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                      <Check className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-stone-900 tracking-tight">Harika! Son bir adım kaldı.</h3>
                      <p className="text-stone-400 text-sm font-medium">Bilgilerinizi girerek randevunuzu anında onaylayın.</p>
                    </div>
                    
                    <div className="space-y-3 max-w-xs mx-auto">
                      <div className="h-12 bg-stone-50 border border-stone-100 rounded-2xl flex items-center px-4 text-stone-300 text-xs font-bold">Adınız Soyadınız</div>
                      <div className="h-12 bg-stone-50 border border-stone-100 rounded-2xl flex items-center px-4 text-stone-300 text-xs font-bold">Telefon Numaranız</div>
                    </div>

                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="w-full py-4 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all rounded-2xl mt-4"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Randevuyu Tamamla
                    </button>
                    
                    <p className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">
                      Tıklayarak kullanım şartlarını kabul etmiş sayılırsınız.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Taraf: Özet Kartı Önizlemesi (Masaüstü için detay) */}
            <div className="hidden lg:block sticky top-8 space-y-6">
              <div className="bg-[#0c0a09] text-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/40 transition-all duration-700" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                      <Calendar className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[11px] text-white/50">Randevu Özeti</h4>
                      <p className="text-sm font-bold">Lütfen seçim yapın</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 font-bold uppercase tracking-widest">Hizmet</span>
                      <span className="font-black">-</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 font-bold uppercase tracking-widest">Uzman</span>
                      <span className="font-black">-</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 font-bold uppercase tracking-widest">Tarih</span>
                      <span className="font-black">-</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Toplam</p>
                      <p className="text-3xl font-black tabular-nums">₺0</p>
                    </div>
                    <button disabled className="bg-white/5 text-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
                      Onayla
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-rose-50 rounded-[2rem] p-6 border border-rose-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <p className="text-[10px] font-bold text-rose-900 leading-relaxed">
                  <strong>Hızlı Onay:</strong> Randevunuz oluşturulduğu an sisteme düşer ve ekibimiz tarafından onaylanır.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return <div className="text-center font-black text-stone-200 uppercase tracking-[0.5em] text-sm py-20">{type}</div>;
  }
}

function ShapeDivider({ type, color }: { type: string, color: string }) {
  if (type === 'wave') return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '80px', fill: color }}>
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
    </svg>
  );
  if (type === 'curve') return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100px', fill: color }}>
      <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
    </svg>
  );
  return null;
}

// --- EDITORS: SETTINGS PANELS ---

function GlobalSettingsPanel({ config, onChange }: any) {
  return (
    <div className="space-y-10 animate-fade-in">
      <EditorField label="MARKA YAZI TİPİ">
        <div className="grid grid-cols-3 gap-2">
          {(['sans', 'serif', 'mono'] as const).map(f => (
            <button key={f} onClick={() => onChange({ ...config, fontFamily: f })} className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${config.fontFamily === f ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </EditorField>

      <EditorField label="ANA MARKA RENGİ">
        <div className="flex flex-wrap gap-3">
          {['#e11d48', '#7c3aed', '#0ea5e9', '#16a34a', '#d97706', '#000000'].map(c => (
            <button key={c} onClick={() => onChange({ ...config, primaryColor: c })} className={`w-10 h-10 rounded-full border-2 transition-all ${config.primaryColor === c ? 'border-stone-900 scale-110 shadow-xl' : 'border-white'}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </EditorField>

      <EditorField label="BUTON STİLİ">
        <div className="grid grid-cols-3 gap-2">
          {(['square', 'rounded', 'pill'] as const).map(s => (
            <button key={s} onClick={() => onChange({ ...config, buttonStyle: s })} className={`py-3 rounded-xl border flex items-center justify-center transition-all ${config.buttonStyle === s ? 'bg-stone-900 text-white border-stone-900 shadow-lg' : 'bg-white text-stone-300 border-stone-100 hover:border-stone-200'}`}>
              {s === 'square' ? <Square className="w-5 h-5" /> : s === 'rounded' ? <Box className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </EditorField>
    </div>
  );
}

function ContentSettingsPanel({ section, onChange, onBlur }: any) {
  const { type, props } = section;
  return (
    <div className="space-y-10 animate-fade-in">
      {type === 'hero' && (
        <>
          <EditorField label="YERLEŞİM DÜZENİ">
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'centered', label: 'ORTALI', icon: <Layout className="w-4 h-4" /> },
                { id: 'split', label: 'İKİLİ', icon: <Maximize2 className="w-4 h-4" /> }
              ].map(l => (
                <button key={l.id} onClick={() => { onChange({ layout: l.id }); onBlur(); }} className={`py-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${props.layout === l.id ? 'bg-stone-900 text-white border-stone-900 shadow-xl' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'}`}>
                  {l.icon}
                  <span className="text-[9px] font-black">{l.label}</span>
                </button>
              ))}
            </div>
          </EditorField>
          <EditorField label="ANA BAŞLIK">
            <input type="text" value={props.title} onChange={e => onChange({ title: e.target.value })} onBlur={onBlur} className="builder-input" />
          </EditorField>
          <EditorField label="ALT METİN">
            <textarea value={props.subtitle} onChange={e => onChange({ subtitle: e.target.value })} onBlur={onBlur} className="builder-textarea" rows={4} />
          </EditorField>
        </>
      )}

      {type === 'services' && (
        <>
          <EditorField label="BÖLÜM STİLİ">
            <div className="grid grid-cols-2 gap-2">
              {['cards', 'minimal'].map(v => (
                <button key={v} onClick={() => { onChange({ variant: v }); onBlur(); }} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${props.variant === v ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100'}`}>
                  {v === 'cards' ? 'KARTLI' : 'SADE'}
                </button>
              ))}
            </div>
          </EditorField>
          <EditorField label="GÖRÜNÜM">
            <div className="flex gap-2">
              {[1, 2].map(n => (
                <button key={n} onClick={() => { onChange({ columns: n }); onBlur(); }} className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${props.columns === n ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100'}`}>
                  {n} SÜTUN
                </button>
              ))}
            </div>
          </EditorField>
        </>
      )}
    </div>
  );
}

function StyleSettingsPanel({ style, onChange, onBlur }: any) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        onChange({ backgroundImage: data.url });
        onBlur();
        toast.success("Görsel başarıyla yüklendi");
      } else {
        toast.error(data.error || "Yükleme hatası oluştu");
      }
    } catch (err) {
      toast.error("Dosya yüklenemedi");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <EditorField label="ARKAPLAN GÖRSELİ">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={style.backgroundImage || ''} 
            onChange={e => onChange({ backgroundImage: e.target.value })} 
            onBlur={onBlur} 
            placeholder="Görsel URL veya Yükle..." 
            className="builder-input flex-1" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
            title="Görsel Yükle"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </EditorField>

      <EditorField label="KENAR YUVARLAKLIĞI (PX)">
        <input type="range" min="0" max="100" value={style.borderRadius} onChange={e => onChange({ borderRadius: parseInt(e.target.value) })} onBlur={onBlur} className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-500" />
      </EditorField>

      <EditorField label="ŞEKİLLİ GEÇİŞ (DIVIDER)">
        <div className="grid grid-cols-3 gap-2">
          {['none', 'wave', 'curve'].map(d => (
            <button key={d} onClick={() => { onChange({ divider: d }); onBlur(); }} className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${style.divider === d ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100'}`}>
              {d === 'none' ? 'YOK' : d === 'wave' ? 'DALGA' : 'KAVİS'}
            </button>
          ))}
        </div>
      </EditorField>

      <div className="grid grid-cols-2 gap-4">
        <EditorField label="ÜST BOŞLUK">
          <input type="number" step="10" value={style.paddingTop} onChange={e => onChange({ paddingTop: parseInt(e.target.value) })} onBlur={onBlur} className="builder-input" />
        </EditorField>
        <EditorField label="ALT BOŞLUK">
          <input type="number" step="10" value={style.paddingBottom} onChange={e => onChange({ paddingBottom: parseInt(e.target.value) })} onBlur={onBlur} className="builder-input" />
        </EditorField>
      </div>
    </div>
  );
}

function EditorField({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] px-1">{label}</label>
      {children}
    </div>
  );
}

function getDefaultsForType(type: SectionType) {
  switch (type) {
    case 'hero': return { title: "Yeni Bir Başlangıç", subtitle: "Güzelliğinize profesyonel bir dokunuş.", buttonText: "Randevu Al", layout: 'centered' };
    case 'services': return { title: "Hizmetlerimiz", columns: 2, variant: 'cards' };
    case 'booking': return { 
      title: "Hemen Randevu Alın", 
      subtitle: "Dilediğiniz hizmeti ve uzmanı seçerek anında randevunuzu oluşturun. 7/24 anında onaylı rezervasyon imkanı.",
      buttonText: "Devam Et"
    };
    default: return { title: "Yeni Bölüm" };
  }
}
