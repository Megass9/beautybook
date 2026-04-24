import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = createAdminClient() as any;

  // Get users with their salon info
  const { data: userData } = await supabase
    .from("salons")
    .select(`
      id,
      name,
      owner_id,
      is_active,
      created_at,
      city
    `);

  // Group by owner_id to get unique users
  const userMap = new Map();
  userData?.forEach((salon: any) => {
    if (!userMap.has(salon.owner_id)) {
      userMap.set(salon.owner_id, {
        id: salon.owner_id,
        salons: [],
        totalSalons: 0,
        activeSalons: 0,
        firstSalonDate: salon.created_at
      });
    }

    const user = userMap.get(salon.owner_id);
    user.salons.push(salon);
    user.totalSalons++;
    if (salon.is_active) user.activeSalons++;
  });

  const users = Array.from(userMap.values());

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-[0.3em] mb-2">Kullanıcı Yönetimi</p>
          <h1 className="text-3xl font-black text-stone-900">Platform Kullanıcıları</h1>
          <p className="mt-2 text-sm text-stone-500 max-w-2xl">
            Salon sahiplerini ve hesap bilgilerini yönetin.
          </p>
        </div>
        <div className="text-sm text-stone-400">
          Toplam: {users.length} kullanıcı
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900">Kullanıcı Listesi</h2>
        </div>

        <div className="divide-y divide-stone-50">
          {users.map((user: any) => (
            <div key={user.id} className="p-6 hover:bg-stone-50/60 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.id.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">Kullanıcı {user.id.slice(0, 8)}</h3>
                      <p className="text-sm text-stone-500">
                        {user.totalSalons} salon • {user.activeSalons} aktif
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {user.salons.map((salon: any) => (
                      <div key={salon.id} className="flex items-center justify-between bg-stone-50 rounded-lg p-3">
                        <div>
                          <p className="font-semibold text-stone-900">{salon.name}</p>
                          <p className="text-xs text-stone-500">{salon.city}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            salon.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {salon.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                          <a
                            href={`/salon/${salon.slug || salon.id}`}
                            target="_blank"
                            className="text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-700 px-2 py-1 rounded transition-colors"
                          >
                            Gör
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-stone-400 mt-3">
                    İlk kayıt: {new Date(user.firstSalonDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="text-xs font-semibold bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-colors">
                    Detaylar
                  </button>
                  <button className="text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1.5 rounded-lg transition-colors">
                    İletişim
                  </button>
                </div>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <p className="font-semibold text-stone-600 mb-1">Henüz kullanıcı yok</p>
              <p className="text-sm text-stone-400">Yeni kullanıcı kayıtları burada görünecek</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}