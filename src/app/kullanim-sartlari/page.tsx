"use client";

import Link from "next/link";

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-[#faf7f4] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <p className="text-xs text-stone-400 mb-8">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Ana Sayfa
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-stone-500">Kullanım Şartları</span>
        </p>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: Terms content */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-7 space-y-5">
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-rose-500 mb-2">
                Hukuki Bilgilendirme
              </p>
              <h1 className="text-3xl font-black text-stone-900 leading-snug mb-2">
                Kullanım Şartları
              </h1>
              <p className="text-sm text-stone-500 leading-relaxed">
                Bu sayfa, BeautyBook ürününü ve hizmetlerini kullanırken geçerli olan temel
                kuralları ve tarafların sorumluluklarını özetler. Platformu kullanmaya devam
                ederek bu şartları kabul etmiş sayılırsınız.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                1. Hizmet kapsamı
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook, güzellik salonları için online randevu, müşteri yönetimi ve raporlama
                özellikleri sunan bir yazılım hizmetidir (SaaS). Platform, sözleşme süresince
                erişilebilirlik ve makul süreklilik sağlamayı taahhüt eder; ancak bakım, güncelleme
                ve mücbir sebepler nedeniyle geçici kesintiler olabilir.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                2. Hesap ve sorumluluklar
              </h2>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>Hesabınızın giriş bilgilerini gizli tutmakla yükümlüsünüz.</li>
                <li>Hesabınız üzerinden yapılan tüm işlemlerden siz sorumlusunuz.</li>
                <li>Hesabınızda yer alan müşteri verilerinin doğruluğu ve güncelliği size aittir.</li>
                <li>Yetkisiz erişim şüphesi durumunda derhal bize haber vermelisiniz.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                3. Ücretlendirme ve iptal
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook, seçtiğiniz plana göre aylık veya yıllık abonelik modeliyle
                ücretlendirilebilir. Plan ve fiyat detayları ana sayfamızdaki &quot;Fiyatlar&quot;
                bölümünde belirtilmiştir.
              </p>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>Abonelik dönemleri peşin olarak tahsil edilir.</li>
                <li>Deneme süresi sonunda aboneliği devam ettirmezseniz hesabınız pasif hale gelebilir.</li>
                <li>İptal talebi bir sonraki fatura döneminden itibaren geçerli olur.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                4. Kabul edilebilir kullanım
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Platformu kullanırken aşağıdaki yasaklı davranışlardan kaçınmayı kabul edersiniz:
              </p>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>Hizmeti yasa dışı faaliyetler için kullanmak</li>
                <li>Yetkisiz erişim denemeleri, tersine mühendislik veya saldırı girişimleri</li>
                <li>Diğer kullanıcıların hizmetten faydalanmasını engelleyecek aşırı veya kötüye kullanım</li>
                <li>Spam, istenmeyen ticari ileti veya yanıltıcı bilgilendirme göndermek</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                5. Fikri mülkiyet
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook markası, logo, arayüz tasarımları ve yazılım kodu fikri mülkiyet
                mevzuatı kapsamında korunmaktadır. Ürün ve içerikler, yazılı izin olmaksızın
                kopyalanamaz, çoğaltılamaz veya türev çalışmalar oluşturulamaz.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                6. Sorumluluk sınırlaması
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook, makul özenle hizmet sunmakla beraber, doğrudan veya dolaylı gelir
                kaybı, veri kaybı veya iş kesintisi gibi sonuç hasarlardan sorumlu tutulamaz. Her
                durumda toplam sorumluluk, ilgili abonelik dönemi için ödenen tutarla sınırlıdır.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                7. Değişiklikler ve yürürlük
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook, kullanım şartlarını zaman zaman güncelleyebilir. Önemli değişiklikler
                olduğunda kullanıcılar e-posta veya uygulama içi bildirim ile bilgilendirilir.
                Platformu kullanmaya devam etmeniz, güncellenmiş şartları kabul ettiğiniz
                anlamına gelir.
              </p>
            </section>
          </div>

          {/* Right: Summary / contact */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                Kısaca
              </h2>
              <ul className="list-disc list-inside text-[13px] text-stone-600 space-y-1">
                <li>BeautyBook bir abonelik tabanlı yazılım hizmetidir.</li>
                <li>Hesabınız ve müşteri verilerinizden siz sorumlusunuz.</li>
                <li>Kötüye kullanım ve güvenlik ihlallerinde hesabı sınırlama hakkımız saklıdır.</li>
                <li>Ücretler plan sayfasında belirtilmiştir; iptal bir sonraki dönem için geçerlidir.</li>
              </ul>
            </div>

            <div className="bg-stone-900 rounded-2xl p-5 text-[13px] text-stone-200 space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Sorular ve sözleşme talepleri
              </h3>
              <p>
                Kullanım şartlarıyla ilgili detaylı bilgi veya kurumsal sözleşme talepleriniz için{" "}
                <span className="font-semibold">legal@beautybook.app</span> adresine e-posta
                gönderebilirsiniz.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

