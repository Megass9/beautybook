export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#faf7f4] px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-5">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">API Docs</h1>
        <p className="text-stone-500 text-sm">
          BeautyBook API entegrasyonları için geliştirici dökümanları burada yayınlanacak. Böylece
          kendi uygulamanızdan randevu, müşteri ve gelir verilerine güvenli şekilde erişebileceksiniz.
        </p>
        <p className="text-stone-500 text-sm">
          API hakkında erken erişim veya entegrasyon talepleri için{" "}
          <span className="font-semibold">api@beautybook.app</span> adresiyle iletişime
          geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}

