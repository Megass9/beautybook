export default function KilavuzPage() {
  return (
    <div className="min-h-screen bg-[#faf7f4] px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-5">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Kullanım Kılavuzu</h1>
        <p className="text-stone-500 text-sm">
          BeautyBook&apos;u adım adım nasıl kullanacağını anlatan dökümanlar burada yer alacak:
          salon oluşturma, hizmet ekleme, personel yönetimi, online randevu ayarları ve daha fazlası.
        </p>
        <p className="text-stone-500 text-sm">
          Şimdilik yardım almak için <span className="font-semibold">yardim@beautybook.app</span>{" "}
          adresine yazabilirsin.
        </p>
      </div>
    </div>
  );
}

