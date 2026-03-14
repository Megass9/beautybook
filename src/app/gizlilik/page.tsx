"use client";

import Link from "next/link";

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-[#faf7f4] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <p className="text-xs text-stone-400 mb-8">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Ana Sayfa
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-stone-500">Gizlilik Politikası</span>
        </p>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: Policy content */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-7 space-y-5">
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-rose-500 mb-2">
                Hukuki Bilgilendirme
              </p>
              <h1 className="text-3xl font-black text-stone-900 leading-snug mb-2">
                Gizlilik Politikası
              </h1>
              <p className="text-sm text-stone-500 leading-relaxed">
                BeautyBook olarak, güzellik salonu işletmelerinin ve müşterilerinin kişisel
                verilerinin gizliliğine önem veriyoruz. Bu sayfa, verilerinizi nasıl topladığımız,
                sakladığımız ve işlediğimiz hakkında özet bilgi sunar.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                1. Topladığımız veriler
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook&apos;u kullanırken aşağıdaki veri türleri işlenebilir:
              </p>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>Salon hesabı oluştururken sağladığınız bilgiler (isim, e-posta, salon adı vb.)</li>
                <li>Müşteri randevu kayıtları (isim, iletişim bilgisi, randevu tarihi ve saati)</li>
                <li>Salonunuzdaki hizmet ve personel bilgileri</li>
                <li>Oturum ve kullanım verileri (giriş zamanı, IP adresi, cihaz bilgisi vb.)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                2. Verileri hangi amaçlarla kullanıyoruz?
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Topladığımız verileri aşağıdaki amaçlarla kullanırız:
              </p>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>Randevu oluşturma, hatırlatma ve yönetim işlemlerini gerçekleştirmek</li>
                <li>Salon yöneticilerine gelir, müşteri ve performans raporları sunmak</li>
                <li>Güvenlik, dolandırıcılık önleme ve hesap güvenliğini sağlamak</li>
                <li>Ürün geliştirme, hata takibi ve kullanım analizi yapmak</li>
                <li>Zorunlu bilgilendirme e-postaları ve isteğe bağlı bilgilendirme mesajları göndermek</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                3. Verilerin saklanması ve güvenlik
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Verileriniz, endüstri standartlarına uygun şekilde şifrelenmiş ve yetkisiz erişime
                karşı korunmuş sunucularda saklanır. Erişim yalnızca yetkili personel ile sınırlıdır
                ve erişimler düzenli olarak denetlenir.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                4. Üçüncü taraf hizmet sağlayıcılar
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook; barındırma, e-posta gönderimi, ödeme altyapısı ve analiz gibi
                hizmetlerde üçüncü taraf sağlayıcılarla çalışabilir. Bu sağlayıcılarla paylaşılan
                veriler, yalnızca ilgili hizmetin sağlanması amacıyla ve gereken asgari düzeyde
                aktarılır.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                5. KVKK kapsamındaki haklarınız
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında;
              </p>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>Kişisel verilerinize erişme,</li>
                <li>Düzeltme veya güncelleme talep etme,</li>
                <li>Silinmesini veya anonimleştirilmesini isteme,</li>
                <li>İşlemenin belirli amaçlarla sınırlandırılmasını talep etme haklarına sahipsiniz.</li>
              </ul>
              <p className="text-sm text-stone-600 leading-relaxed">
                Bu haklarınızı kullanmak için{" "}
                <span className="font-semibold">kvkk@beautybook.app</span> adresine e-posta
                gönderebilirsiniz.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                6. Çerezler (Cookies)
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                BeautyBook, oturum yönetimi, kullanıcı tercihlerini hatırlama ve analitik amaçlarla
                çerezler kullanabilir. Tarayıcınızın ayarlarından çerez tercihlerinizi
                güncelleyebilirsiniz; ancak bu durumda bazı özellikler kısıtlı çalışabilir.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                7. Politika güncellemeleri
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olması
                halinde, kullanıcılar e-posta veya uygulama içi bildirim yoluyla bilgilendirilecektir.
              </p>
            </section>
          </div>

          {/* Right: Summary card */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-semibold text-stone-900">
                Özet
              </h2>
              <ul className="list-disc list-inside text-[13px] text-stone-600 space-y-1">
                <li>Verilerinizi yalnızca hizmeti sunmak için kullanıyoruz.</li>
                <li>Verileriniz güvenli sunucularda saklanıyor.</li>
                <li>KVKK kapsamında verilerinize erişme ve sildirme hakkınız var.</li>
                <li>Verilerinizi üçüncü taraflarla yalnızca zorunlu durumlarda ve sınırlı olarak paylaşıyoruz.</li>
              </ul>
            </div>

            <div className="bg-stone-900 rounded-2xl p-5 text-[13px] text-stone-200 space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Soruların mı var?
              </h3>
              <p>
                Gizlilik politikamızla ilgili soruların için{" "}
                <span className="font-semibold">kvkk@beautybook.app</span> adresine
                e-posta gönderebilirsin.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

