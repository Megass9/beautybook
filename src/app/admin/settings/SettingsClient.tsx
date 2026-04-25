"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Settings, Globe, CreditCard, Shield, 
  Bell, Save, RefreshCcw, Power, Mail, 
  Lock, Layout, Sliders, Check, Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const supabase = createClient() as any;
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  const handleSave = async (key: string, value: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) throw error;
      
      setSettings({ ...settings, [key]: value });
      toast.success("Ayarlar başarıyla kaydedildi.");
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "Genel", icon: Globe },
    { id: "pricing", label: "Fiyatlandırma", icon: CreditCard },
    { id: "system", label: "Sistem", icon: Sliders },
    { id: "notifications", label: "Bildirimler", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-rose-100">
              <Settings className="w-3.5 h-3.5" /> Kontrol Paneli
            </div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight italic">Sistem Ayarları</h1>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-12 h-12 bg-white border border-stone-200 rounded-2xl flex items-center justify-center hover:bg-stone-50 transition-all shadow-sm"
          >
            <RefreshCcw className="w-5 h-5 text-stone-400" />
          </button>
        </div>

        {/* Settings Container */}
        <div className="bg-white rounded-[3rem] border border-stone-200 shadow-xl shadow-stone-200/50 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-stone-50/50 border-r border-stone-100 p-8 flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                  activeTab === tab.id 
                    ? "bg-white text-rose-500 shadow-md shadow-rose-100/50 translate-x-2" 
                    : "text-stone-400 hover:text-stone-600 hover:bg-white/50"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-rose-500" : "text-stone-300"}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
            
            {/* 1. GENEL AYARLAR */}
            {activeTab === "general" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black text-stone-900 mb-2">Genel Bilgiler</h2>
                  <p className="text-stone-500 font-medium">Platformun temel kimlik ve iletişim ayarları.</p>
                </div>
                
                <div className="grid gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Site Adı</label>
                    <input 
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all outline-none"
                      value={settings.general?.site_name}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, site_name: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Destek E-posta</label>
                    <input 
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all outline-none"
                      value={settings.general?.contact_email}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, contact_email: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-50">
                   <button 
                    disabled={loading}
                    onClick={() => handleSave('general', settings.general)}
                    className="btn-primary group px-8 py-4"
                   >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                     Değişiklikleri Kaydet
                   </button>
                </div>
              </div>
            )}

            {/* 2. FİYATLANDIRMA */}
            {activeTab === "pricing" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black text-stone-900 mb-2">Paket Ücretleri</h2>
                  <p className="text-stone-500 font-medium">Aylık abonelik paketlerinin TL cinsinden fiyatları.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['basic', 'pro', 'premium'].map((plan) => (
                    <div key={plan} className="bg-stone-50 rounded-3xl p-6 border border-stone-100">
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">{plan}</p>
                       <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-stone-900">₺</span>
                          <input 
                            type="number"
                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-lg font-black focus:ring-4 focus:ring-rose-50 focus:border-rose-200 outline-none"
                            value={settings.pricing?.[plan]}
                            onChange={(e) => setSettings({...settings, pricing: {...settings.pricing, [plan]: parseInt(e.target.value)}})}
                          />
                       </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-stone-50">
                   <button 
                    disabled={loading}
                    onClick={() => handleSave('pricing', settings.pricing)}
                    className="btn-primary px-8 py-4"
                   >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                     Fiyatları Güncelle
                   </button>
                </div>
              </div>
            )}

            {/* 3. SİSTEM KONTROL */}
            {activeTab === "system" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black text-stone-900 mb-2">Sistem Kontrolü</h2>
                  <p className="text-stone-500 font-medium">Platformun çalışma durumunu yönetin.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-rose-50 rounded-3xl border border-rose-100">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                           <Power className={`w-6 h-6 ${settings.general?.maintenance_mode ? 'text-rose-500' : 'text-stone-300'}`} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-stone-900">Bakım Modu</p>
                           <p className="text-xs text-stone-500 font-medium">Aktif edilirse site ziyaretçilere kapatılır.</p>
                        </div>
                     </div>
                     <button 
                      onClick={() => {
                        const newVal = !settings.general?.maintenance_mode;
                        setSettings({...settings, general: {...settings.general, maintenance_mode: newVal}});
                        handleSave('general', {...settings.general, maintenance_mode: newVal});
                      }}
                      className={`w-14 h-8 rounded-full transition-all relative ${settings.general?.maintenance_mode ? 'bg-rose-500' : 'bg-stone-200'}`}
                     >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.general?.maintenance_mode ? 'right-1' : 'left-1 shadow-sm'}`} />
                     </button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                           <Layout className="w-6 h-6 text-stone-400" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-stone-900">Yeni Salon Kayıtları</p>
                           <p className="text-xs text-stone-500 font-medium">Yeni işletmelerin kayıt olmasını sağlar.</p>
                        </div>
                     </div>
                     <button 
                      onClick={() => {
                        const newVal = !settings.features?.allow_new_registrations;
                        setSettings({...settings, features: {...settings.features, allow_new_registrations: newVal}});
                        handleSave('features', {...settings.features, allow_new_registrations: newVal});
                      }}
                      className={`w-14 h-8 rounded-full transition-all relative ${settings.features?.allow_new_registrations ? 'bg-emerald-500' : 'bg-stone-200'}`}
                     >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.features?.allow_new_registrations ? 'right-1' : 'left-1 shadow-sm'}`} />
                     </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. BİLDİRİMLER */}
            {activeTab === "notifications" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black text-stone-900 mb-2">E-posta ve Bildirimler</h2>
                  <p className="text-stone-500 font-medium">Otomatik bilgilendirme ayarlarını yönetin.</p>
                </div>
                
                <div className="p-10 border-2 border-dashed border-stone-100 rounded-[3rem] text-center flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center">
                      <Mail className="w-8 h-8 text-stone-300" />
                   </div>
                   <p className="text-sm font-bold text-stone-400 max-w-xs">SMTP ve E-posta şablonu ayarları yakında bu bölüme eklenecektir.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
