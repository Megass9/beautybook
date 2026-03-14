"use client";

import Link from "next/link";

export default function IadePolitikasiPage() {
  return (
    <div className="min-h-screen bg-[#faf7f4] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <p className="text-xs text-stone-400 mb-8">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Ana Sayfa
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-stone-500">İptal ve İade Politikası</span>
        </p>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: Policy content */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-7 space-y-5">
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-rose-500 mb-2">
                Hukuki Bilgilendirme
              </p>
              <h1 className="text-3xl font-black text-stone-900 leading-snug mb-2">
                İptal ve İade Politikası
              </h1>
              <p className="text-sm text-stone-500 leading-relaxed">
                Bu sayfa, BeautyBook abonelikleri için geçerli olan iptal ve iade koşullarını
                özetler. Ödeme altyapısı (örneğin İyzico) üzerinden yapılan işlemler, ilgili
                sağlayıcının kurallarıyla birlikte değerlendirilir.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                1. Genel bilgiler
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook, güzellik salonları için abonelik tabanlı bir yazılım hizmetidir (SaaS).
                Sunulan hizmetler dijital nitelikte olup, fiziksel ürün gönderimi yapılmamaktadır.
                Bu politika, BeautyBook üzerinden satın alınan tüm abonelik planları için geçerlidir.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                2. Deneme süresi
              </h2>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>Yeni kayıt olan salonlar için 14 günlük ücretsiz deneme sunulabilir.</li>
                <li>Deneme süresi boyunca herhangi bir ücret tahsil edilmez.</li>
                <li>Deneme süresi sonunda ücretli plana geçilmezse hesap pasif hale gelebilir.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                3. Abonelik başlangıcı ve yenileme
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Ücretli abonelikler, seçilen plana göre aylık veya yıllık olarak peşin şekilde
                tahsil edilir. Abonelik dönemi sonunda, iptal edilmediği sürece abonelik aynı plan
                üzerinden yenilenebilir.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                4. İptal koşulları
              </h2>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>
                  Kullanıcı, aboneliğini BeautyBook paneli üzerinden veya destek kanalları aracılığıyla
                  istediği zaman iptal edebilir.
                </li>
                <li>
                  İptal, mevcut fatura döneminin sonuna kadar hizmetin kullanılmasına engel olmaz;
                  dönem sonunda abonelik yenilenmez.
                </li>
                <li>
                  İptal işlemi, geriye dönük bir iade hakkı doğurmaz (aşağıdaki iade maddeleri saklı
                  kalmak kaydıyla).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                5. İade yapılabilen durumlar
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Aşağıdaki istisnai durumlarda iade talebiniz değerlendirilebilir:
              </p>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>
                  Ödeme alındıktan sonra teknik bir hata nedeniyle hesabın kullanılamaması ve bu
                  durumun makul süre içinde giderilememesi,
                </li>
                <li>
                  Aynı dönem için çift tahsilat gibi açıkça hatalı bir işlem yapılması,
                </li>
                <li>
                  Ödeme sağlayıcı (İyzico vb.) tarafından haksız veya hatalı işlem tespiti.
                </li>
              </ul>
              <p className="text-sm text-stone-600 leading-relaxed">
                Bu haller dışında, dijital hizmetin doğası gereği kullanılmış abonelik süreleri için
                kural olarak iade yapılmamaktadır.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                6. İade süreci
              </h2>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>
                  İade talebi için ödeme dekontu ve Abonelik ID / salon adı ile birlikte{" "}
                  <span className="font-semibold">destek@beautybook.app</span> adresine e-posta
                  göndermeniz gerekir.
                </li>
                <li>Talebiniz en geç 7 iş günü içinde incelenir ve sonucu size bildirilir.</li>
                <li>
                  İade onaylanırsa, tutar ilgili ödeme sağlayıcı üzerinden aynı karta/hesaba geri
                  ödenir.
                </li>
                <li>
                  Banka süreçleri nedeniyle iadenin kart ekstresine yansıması 3–10 iş gününü
                  bulabilir.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                7. Değişiklikler
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook, iptal ve iade politikasını zaman zaman güncelleyebilir. Önemli
                değişiklikler olması halinde kullanıcılar e-posta veya uygulama içi bildirim ile
                bilgilendirilecektir.
              </p>
            </section>

          </div>

          {/* Right: Summary / contact */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">Kısaca</h2>
              <ul className="list-disc list-inside text-[13px] text-stone-600 space-y-1">
                <li>Abonelikler dijital hizmettir; dönemler peşin tahsil edilir.</li>
                <li>İptal, mevcut dönemin sonu için geçerlidir; geriye dönük iade yoktur.</li>
                <li>Teknik hata veya çift tahsilat gibi durumlarda iade talebi değerlendirilebilir.</li>
              </ul>
            </div>

            <div className="bg-stone-900 rounded-2xl p-5 text-[13px] text-stone-200 space-y-3">
              <h3 className="text-sm font-semibold text-white">İptal &amp; iade soruları</h3>
              <p>
                Abonelik, iptal ve iade süreçleriyle ilgili her türlü sorunuz için{" "}
                <span className="font-semibold">destek@beautybook.app</span> adresine e-posta
                gönderebilirsiniz.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

