# 💅 BeautyBook — Güzellik Salonu SaaS Platformu

Multi-tenant güzellik salonu randevu sistemi ve mini web sitesi platformu.

## 🚀 Teknolojiler

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **UI**: TailwindCSS + özel tasarım sistemi
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Hosting**: Vercel

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── page.tsx                    # Landing Page
│   ├── auth/
│   │   ├── login/page.tsx          # Giriş
│   │   └── register/page.tsx       # Kayıt (3 adım)
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout (auth guard)
│   │   ├── page.tsx                # Genel bakış
│   │   ├── appointments/           # Randevu yönetimi
│   │   ├── services/               # Hizmet yönetimi
│   │   ├── staff/                  # Personel yönetimi
│   │   ├── customers/              # Müşteri listesi
│   │   └── settings/               # Salon ayarları
│   └── salon/[slug]/               # Public mini web sitesi
│       ├── page.tsx
│       └── BookingClient.tsx       # 5 adımlı randevu formu
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Client-side Supabase
│   │   └── server.ts               # Server-side Supabase
│   └── utils/
│       ├── cn.ts                   # Class merger
│       ├── slug.ts                 # TR karakter desteği ile slug
│       └── time.ts                 # Saat slot üreteci
└── types/
    └── index.ts                    # TypeScript tipler + DB schema
```

## ⚙️ Kurulum

### 1. Projeyi klonla

```bash
git clone <repo> beautybook
cd beautybook
npm install
```

### 2. Supabase kurulum

1. [supabase.com](https://supabase.com) üzerinde yeni proje oluştur
2. SQL Editor'da `supabase/migrations/001_initial_schema.sql` dosyasını çalıştır
3. Project URL ve anon key'i kopyala

### 3. Environment variables

`.env.local` dosyasını düzenle:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Geliştirme sunucusu

```bash
npm run dev
```

## 🗄️ Veritabanı Şeması

```
salons          → owner_id (FK auth.users)
working_hours   → salon_id (FK salons)
staff           → salon_id (FK salons)
services        → salon_id (FK salons)
customers       → salon_id (FK salons)
appointments    → salon_id, customer_id, staff_id, service_id
```

Tüm tablolarda **Row Level Security (RLS)** aktif. Salonlar sadece kendi verilerini görebilir.

## 🌐 Özellikler

### Landing Page
- Animasyonlu hero section
- Dashboard preview mock
- Özellik kartları
- Fiyatlandırma tablosu
- CTA section

### Salon Kayıt (3 Adım)
1. E-posta + şifre
2. Salon bilgileri (ad, adres, şehir, telefon) → otomatik slug oluşturma
3. Çalışma saatleri

### Dashboard
- **Genel Bakış**: İstatistikler + bugünkü randevular
- **Randevular**: Takvim görünümü, randevu oluştur/onayla/iptal et
- **Hizmetler**: Kategori bazlı hizmet yönetimi
- **Personel**: Personel ekleme/düzenleme
- **Müşteriler**: Arama destekli müşteri listesi
- **Ayarlar**: Salon bilgileri + çalışma saatleri + mini site URL kopyalama

### Mini Web Sitesi (`/salon/[slug]`)
- Salon bilgileri ve hizmet listesi
- 5 adımlı randevu sihirbazı:
  1. Hizmet seç
  2. Personel seç
  3. Tarih & saat seç
  4. İsim & telefon gir
  5. Onay + çakışma kontrolü

### Güvenlik
- Supabase Auth
- Row Level Security
- Multi-tenant izolasyon
- Randevu çakışma kontrolü

## 🚢 Vercel Deploy

```bash
vercel --prod
```

Environment variables'ları Vercel dashboard'a ekle.

## 📱 Mobil Uyumlu

Tüm sayfalar mobil-first responsive tasarım ile geliştirilmiştir.
