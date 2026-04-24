import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminSalonsPage() {
  const supabase = createAdminClient() as any;

  const { data: salons } = await supabase
    .from("salons")
    .select(`
      id,
      name,
      slug,
      city,
      address,
      phone,
      email,
      is_active,
      created_at,
      owner_id
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Salon Yönetimi</p>
          <h1 className="text-3xl font-black text-stone-900">Platform Salonları</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            Tüm salonları görüntüleyin, onaylayın veya yönetin.
          </p>
        </div>
        <div className="text-sm text-stone-400">
          Toplam: {salons?.length || 0} salon
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900">Salon Listesi</h2>
        </div>

        <div className="divide-y divide-stone-50">
          {salons?.map((salon: any) => (
            <div key={salon.id} className="p-6 hover:bg-stone-50/60 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-stone-900 truncate">{salon.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      salon.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {salon.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-stone-600">
                    <div>
                      <span className="font-medium">Şehir:</span> {salon.city || 'Belirtilmemiş'}
                    </div>
                    <div>
                      <span className="font-medium">Telefon:</span> {salon.phone || 'Belirtilmemiş'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {salon.email || 'Belirtilmemiş'}
                    </div>
                  </div>

                  {salon.address && (
                    <p className="text-sm text-stone-500 mt-2">
                      <span className="font-medium">Adres:</span> {salon.address}
                    </p>
                  )}

                  <p className="text-xs text-stone-400 mt-2">
                    Kayıt: {new Date(salon.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/salon/${salon.slug}`}
                    target="_blank"
                    className="text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Görüntüle
                  </a>
                  <button
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      salon.is_active
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                    }`}
                  >
                    {salon.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {(!salons || salons.length === 0) && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <p className="font-semibold text-stone-600 mb-1">Henüz salon yok</p>
              <p className="text-sm text-stone-400">Yeni salon kayıtları burada görünecek</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}