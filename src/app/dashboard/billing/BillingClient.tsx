"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, addDays, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Landmark, 
  Receipt,
  ArrowRight,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import type { Salon, Subscription } from "@/types";

interface Props {
  salon: Salon;
  subscriptions: Subscription[];
  pricing: { basic: number, pro: number, premium: number };
}

export default function BillingClient({ salon, subscriptions, pricing }: Props) {
  const PLANS = [
    { id: "basic", name: "Başlangıç Paket", price: pricing?.basic || 500, duration: "aylık", features: ["1 Uzman", "Temel Raporlar"] },
    { id: "pro", name: "Profesyonel Paket", price: pricing?.pro || 900, duration: "aylık", features: ["5 Uzman", "Detaylı Finans", "SMS Bildirimi"], recommended: true },
    { id: "premium", name: "Premium Paket", price: pricing?.premium || 1500, duration: "aylık", features: ["Sınırsız Uzman", "Tüm Özellikler", "Öncelikli Destek"] },
  ];
  const supabase = createClient() as any;
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [receiptNo, setReceiptNo] = useState("");

  const trialEndDate = useMemo(() => addDays(new Date(salon.created_at), 14), [salon.created_at]);
  const daysLeft = useMemo(() => {
    const diff = differenceInDays(trialEndDate, new Date());
    return diff > 0 ? diff : 0;
  }, [trialEndDate]);

  const activeSubscription = useMemo(() => {
    return subscriptions.find(s => s.status === "active" && s.end_date && new Date(s.end_date) > new Date());
  }, [subscriptions]);

  const pendingSubscription = useMemo(() => {
    // Eğer halihazırda aktif bir abonelik varsa, pending olanları gösterme
    if (activeSubscription) return null;
    return subscriptions.find(s => s.status === "pending");
  }, [subscriptions, activeSubscription]);

  const handlePaymentSubmit = async () => {
    if (!selectedPlan || !receiptNo) {
      toast.error("Lütfen bir paket seçin ve dekont numarasını girin.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("subscriptions").insert({
        salon_id: salon.id,
        plan_name: selectedPlan.name,
        amount: selectedPlan.price,
        receipt_no: receiptNo,
        status: "pending"
      });

      if (error) throw error;

      toast.success("Ödeme bildiriminiz alındı! Kontrol edildikten sonra onaylanacaktır.");
      setReceiptNo("");
      setSelectedPlan(null);
      // Refresh page or update local state
      window.location.reload();
    } catch (error: any) {
      toast.error("Bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-rose-500" />
            Abonelik ve Ödemeler
          </h1>
          <p className="text-stone-500 text-sm mt-1">Sistem kullanım sürenizi yönetin ve ödeme bildirimlerinizi yapın.</p>
        </div>
      </div>

      {/* Status Card */}
      <div className={`p-8 rounded-[2.5rem] border-2 shadow-sm transition-all ${
        activeSubscription 
          ? "bg-emerald-50/50 border-emerald-100" 
          : daysLeft > 0 
            ? "bg-blue-50/50 border-blue-100" 
            : "bg-rose-50/50 border-rose-100"
      }`}>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-sm ${
            activeSubscription ? "bg-emerald-500 text-white" : daysLeft > 0 ? "bg-blue-500 text-white" : "bg-rose-500 text-white"
          }`}>
            {activeSubscription ? <ShieldCheck className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-stone-900">
              {activeSubscription 
                ? "Aktif Abonelik" 
                : daysLeft > 0 
                  ? "Ücretsiz Deneme Süresi" 
                  : "Süreniz Doldu"}
            </h2>
            <p className="text-stone-600 font-medium mt-1">
              {activeSubscription 
                ? `${format(new Date(activeSubscription.end_date!), "d MMMM yyyy", { locale: tr })} tarihine kadar aktif.`
                : daysLeft > 0 
                  ? `Sistemi ${daysLeft} gün daha ücretsiz kullanabilirsiniz.` 
                  : "Hizmetlerinizin aktif kalması için lütfen bir paket seçip ödeme yapın."}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Kalan Süre</span>
            <span className="text-4xl font-black text-stone-900 tabular-nums">
              {activeSubscription 
                ? differenceInDays(new Date(activeSubscription.end_date!), new Date()) 
                : daysLeft}
              <span className="text-lg ml-1">Gün</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plans */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-stone-900 flex items-center gap-2 px-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Paket Seçin
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map((plan: any) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative p-6 rounded-[2rem] border-2 text-left transition-all group flex flex-col ${
                  selectedPlan?.id === plan.id 
                    ? "border-rose-500 bg-rose-50/30 shadow-md ring-4 ring-rose-50" 
                    : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50"
                } ${plan.recommended ? "sm:scale-105 z-10" : ""}`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-sm">
                    Popüler
                  </span>
                )}
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  selectedPlan?.id === plan.id ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-500"
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                
                <h4 className="font-black text-stone-900 text-lg leading-tight">{plan.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-stone-900">₺{plan.price}</span>
                  <span className="text-stone-400 text-sm font-bold">/{plan.duration}</span>
                </div>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-bold text-stone-600">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${selectedPlan?.id === plan.id ? "text-rose-500" : "text-stone-300"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={`mt-6 w-full py-3 rounded-xl border-2 flex items-center justify-center transition-all text-xs font-black uppercase tracking-widest ${
                  selectedPlan?.id === plan.id ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" : "border-stone-100 text-stone-400 group-hover:border-stone-200"
                }`}>
                  {selectedPlan?.id === plan.id ? "Seçildi" : "Paket Seç"}
                </div>
              </button>
            ))}
          </div>

          {/* IBAN Info */}
          <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
                <Landmark className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900">Havale/EFT Bilgileri</h3>
                <p className="text-xs text-stone-500 font-medium">Ödemenizi aşağıdaki hesaba yapın.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Banka</span>
                <span className="font-bold text-stone-900">BeautyBook Bank (Örnek)</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Alıcı Adı</span>
                <span className="font-bold text-stone-900">BeautyBook Yazılım A.Ş.</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 sm:col-span-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">IBAN</span>
                <span className="font-bold text-stone-900 break-all tabular-nums">TR00 0000 0000 0000 0000 0000 00</span>
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-xs font-medium text-rose-800 leading-relaxed">
                <strong>Önemli:</strong> Lütfen havale açıklamasına salon adınızı veya kayıtlı telefon numaranızı yazmayı unutmayın.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Side */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-stone-200/60 p-8 shadow-sm sticky top-6">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2 mb-6">
              <Receipt className="w-5 h-5 text-rose-500" />
              Ödeme Bildirimi
            </h3>

            {pendingSubscription ? (
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl text-center space-y-4">
                <Clock className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
                <div>
                  <p className="font-black text-stone-900">Kontrol Ediliyor</p>
                  <p className="text-xs text-stone-500 mt-1 font-medium">Son bildiriminiz inceleniyor. En kısa sürede onaylanacaktır.</p>
                </div>
                <div className="pt-4 border-t border-amber-200/40 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                  Dekont No: {pendingSubscription.receipt_no}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2 px-1">Seçili Paket</label>
                  <div className={`p-4 rounded-2xl border-2 font-bold ${selectedPlan ? "border-rose-100 bg-rose-50/30 text-stone-900" : "border-dashed border-stone-200 text-stone-400"}`}>
                    {selectedPlan ? selectedPlan.name : "Lütfen paket seçin"}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-widest mb-2 px-1">Dekont Sorgu / İşlem No</label>
                  <input
                    type="text"
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    placeholder="Havale işlem numarasını girin"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-sm font-bold text-stone-900 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all placeholder:text-stone-300"
                  />
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={loading || !selectedPlan || !receiptNo}
                  className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                >
                  {loading ? "Gönderiliyor..." : (
                    <>Ödeme Bildirimi Yap <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-[2.5rem] border border-stone-200/60 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-stone-900">Ödeme Geçmişi</h3>
          <span className="text-stone-400 text-sm font-bold">{subscriptions.length} Kayıt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <th className="px-8 py-5">Tarih</th>
                <th className="px-8 py-5">Paket</th>
                <th className="px-8 py-5">Tutar</th>
                <th className="px-8 py-5">Dekont No</th>
                <th className="px-8 py-5 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-stone-600">
                    {format(new Date(s.created_at), "d MMM yyyy", { locale: tr })}
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-stone-900">{s.plan_name}</td>
                  <td className="px-8 py-5 text-sm font-black text-rose-600">₺{s.amount}</td>
                  <td className="px-8 py-5 text-xs font-bold text-stone-400 tabular-nums">{s.receipt_no || "-"}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      s.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      s.status === "pending" ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>
                      {s.status === "active" ? "Onaylandı" : s.status === "pending" ? "Bekliyor" : "Reddedildi"}
                    </span>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-stone-400 font-bold">
                    Henüz bir ödeme kaydı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
