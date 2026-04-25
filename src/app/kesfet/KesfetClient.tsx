"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronRight, 
  Building2, 
  Filter, 
  Phone,
  Sparkles,
  Loader2,
  Heart,
  Share2,
  Award,
  Users,
  CheckCircle,
  X,
  Clock,
  Calendar,
  MessageCircle,
  Grid3X3,
  List,
  SlidersHorizontal,
  AlertCircle,
  Quote,
  Gift,
  PartyPopper,
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  ExternalLink,
  MapPinned
} from "lucide-react";

interface Salon {
  id: string;
  name: string;
  slug: string;
  city: string;
  district?: string;
  address: string;
  logo_url?: string;
  cover_url?: string;
  description?: string;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  is_verified?: boolean;
  is_open?: boolean;
  opening_hours?: string;
  price_range?: string;
  services?: string[];
  amenities?: string[];
  images?: string[];
  year_established?: number;
  team_size?: number;
  special_offers?: string[];
}

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  salon: string;
  date: string;
}

const CATEGORIES = [
  { name: "Tümü", icon: "✨", count: 1250, color: "from-purple-500 to-pink-500" },
  { name: "Kuaför", icon: "💇‍♀️", count: 420, color: "from-rose-500 to-red-500" },
  { name: "Güzellik Merkezi", icon: "💅", count: 380, color: "from-pink-500 to-rose-500" },
  { name: "Berber", icon: "💇‍♂️", count: 210, color: "from-blue-500 to-cyan-500" },
  { name: "Tırnak", icon: "💎", count: 150, color: "from-violet-500 to-purple-500" },
  { name: "Lazer Epilasyon", icon: "⚡", count: 90, color: "from-amber-500 to-orange-500" },
  { name: "Masaj & Spa", icon: "🧖", count: 180, color: "from-teal-500 to-emerald-500" },
  { name: "Makyaj", icon: "💄", count: 95, color: "from-rose-400 to-pink-400" },
];

const CITIES = [
  { name: "İstanbul", count: 520, image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400" },
  { name: "Ankara", count: 280, image: "https://images.unsplash.com/photo-1584467541268-b040f83be3dd?w=400" },
  { name: "İzmir", count: 190, image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=400" },
  { name: "Bursa", count: 150, image: "https://images.unsplash.com/photo-1594623930572-3008fc0b3920?w=400" },
  { name: "Antalya", count: 120, image: "https://images.unsplash.com/photo-1626116164578-606a8f16ca41?w=400" },
  { name: "Adana", count: 95, image: "https://images.unsplash.com/photo-1569388606828-a94d6b9742a8?w=400" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Ayşe Y.",
    rating: 5,
    comment: "Gerçekten harika bir deneyim! Salon çok temiz, personel çok ilgili. Kesinlikle tavsiye ederim.",
    salon: "Luxe Güzellik & Spa",
    date: "2 gün önce"
  },
  {
    id: "2",
    name: "Mehmet K.",
    rating: 5,
    comment: "Online randevu sistemi çok pratik. Hiç beklemedim, tam zamanında aldım hizmeti.",
    salon: "Style Studio Kuaför",
    date: "1 hafta önce"
  },
  {
    id: "3",
    name: "Zeynep A.",
    rating: 4,
    comment: "Fiyatlar uygun, kalite yüksek. Makyajım çok güzel oldu, arkadaşlarıma da önereceğim.",
    salon: "Beyaz Estetik",
    date: "3 gün önce"
  },
];

type SortType = "recommended" | "rating" | "newest" | "price_low" | "price_high" | "reviews";
type ViewMode = "grid" | "list";

export default function KesfetClient({ initialSalons }: { initialSalons: Salon[] }) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortType] = useState<SortType>("recommended");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const demoSalons: Salon[] = useMemo(() => {
    if (initialSalons.length > 0) return initialSalons;
    
    return [
      {
        id: "1",
        name: "Luxe Güzellik & Spa",
        slug: "luxe-guzellik-spa",
        city: "İstanbul",
        district: "Kadıköy",
        address: "Bağdat Cad. No:123 Kadıköy",
        description: "Modern tasarımı ve uzman kadrosuyla size özel bakım deneyimi sunuyoruz. Cilt bakımı, masaj ve SPA hizmetlerinde lider. 10 yıldır sektördeyiz.",
        rating: 4.9,
        review_count: 328,
        is_featured: true,
        is_verified: true,
        is_open: true,
        opening_hours: "09:00 - 21:00",
        price_range: "₺₺₺",
        services: ["Cilt Bakımı", "Masaj", "SPA", "Lazer Epilasyon", "Kalıcı Makyaj"],
        amenities: ["wifi", "parking", "coffee"],
        images: [],
        year_established: 2014,
        team_size: 15,
        special_offers: ["İlk randevuda %20 indirim", "Çift randevu paketi"]
      },
      {
        id: "2",
        name: "Style Studio Kuaför",
        slug: "style-studio-kuafor",
        city: "İstanbul",
        district: "Nişantaşı",
        address: "Nişantaşı Mah. No:45 Şişli",
        description: "Trend belirleyen saç modelleri ve profesyonel boyama teknikleri. Ünlülerin tercih ettiği adres. Ödüllü stilistlerimizle hizmetinizdeyiz.",
        rating: 4.8,
        review_count: 256,
        is_featured: true,
        is_verified: true,
        is_open: true,
        opening_hours: "10:00 - 22:00",
        price_range: "₺₺",
        services: ["Kesim", "Boya", "Perma", "Saç Tedavisi", "Düğün Paketi"],
        amenities: ["wifi", "parking", "credit_card"],
        images: [],
        year_established: 2018,
        team_size: 8,
        special_offers: ["Öğrenci indirimi %15"]
      },
      {
        id: "3",
        name: "Gözde Berber",
        slug: "gozde-berber",
        city: "Ankara",
        district: "Kızılay",
        address: "Kızılay Cad. No:78 Çankaya",
        description: "Klasik ve modern tıraş teknikleri, erkek bakımında uzman kadro. 25 yıllık tecrübemizle erkek güzelliğinde lideriz.",
        rating: 4.7,
        review_count: 189,
        is_featured: false,
        is_verified: true,
        is_open: true,
        opening_hours: "08:00 - 20:00",
        price_range: "₺",
        services: ["Tıraş", "Saç Kesim", "Yüz Bakımı", "Sakal Bakımı"],
        amenities: ["parking", "wifi"],
        images: [],
        year_established: 1999,
        team_size: 4,
        special_offers: []
      },
      {
        id: "4",
        name: "Beyaz Estetik",
        slug: "beyaz-estetik",
        city: "İzmir",
        district: "Alsancak",
        address: "Alsancak Mah. No:92 Konak",
        description: "Diş beyazlatma ve estetik tedavilerde son teknoloji. Uzman diş hekimlerimiz ve modern ekipmanlarımızla gülüşünüzü tasarlıyoruz.",
        rating: 4.9,
        review_count: 412,
        is_featured: true,
        is_verified: true,
        is_open: true,
        opening_hours: "09:00 - 19:00",
        price_range: "₺₺₺",
        services: ["Diş Beyazlatma", "İmplant", "Lamine", "Ortodonti"],
        amenities: ["wifi", "credit_card", "wheelchair"],
        images: [],
        year_established: 2016,
        team_size: 12,
        special_offers: ["İlk muayene ücretsiz"]
      },
      {
        id: "5",
        name: "Nail Art Studio",
        slug: "nail-art-studio",
        city: "İstanbul",
        district: "Maslak",
        address: "Maslak Mah. No:156 Sarıyer",
        description: "Özel tasarım tırnak sanatı ve profesyonel bakım. Trend tasarımlar ve kalıcı ojeler uzman kadromuzla sizlerle.",
        rating: 4.6,
        review_count: 167,
        is_featured: false,
        is_verified: true,
        is_open: true,
        opening_hours: "10:00 - 21:00",
        price_range: "₺₺",
        services: ["Manikür", "Pedikür", "Tırnak Sanatı", "Kalıcı Oje"],
        amenities: ["wifi", "coffee"],
        images: [],
        year_established: 2020,
        team_size: 5,
        special_offers: ["10 seans alana 1 ücretsiz"]
      },
      {
        id: "6",
        name: "Pure Skin Lazer",
        slug: "pure-skin-lazer",
        city: "Bursa",
        district: "Nilüfer",
        address: "Nilüfer Cad. No:234 Nilüfer",
        description: "Acısız lazer epilasyon ve cilt tedavileri. FDA onaylı cihazlarımız ve uzman kadromuzla güvenli tedavi.",
        rating: 4.8,
        review_count: 298,
        is_featured: true,
        is_verified: true,
        is_open: true,
        opening_hours: "09:00 - 20:00",
        price_range: "₺₺",
        services: ["Lazer Epilasyon", "Cilt Bakımı", "Akne Tedavisi", "Lazer Gençleşme"],
        amenities: ["wifi", "parking", "credit_card"],
        images: [],
        year_established: 2019,
        team_size: 7,
        special_offers: ["Sezon indirimi %25"]
      },
      {
        id: "7",
        name: "Zen Masaj & Spa",
        slug: "zen-masaj-spa",
        city: "İstanbul",
        district: "Beşiktaş",
        address: "Beşiktaş Cad. No:67 Beşiktaş",
        description: "Doğal taş masajı, Thai masajı ve aromaterapi. Stresinizi atın, yenilenin.",
        rating: 4.9,
        review_count: 445,
        is_featured: true,
        is_verified: true,
        is_open: true,
        opening_hours: "10:00 - 23:00",
        price_range: "₺₺₺",
        services: ["Thai Masaj", "Spor Masajı", "Aromaterapi", "Refleksoloji"],
        amenities: ["wifi", "parking", "coffee", "wheelchair"],
        images: [],
        year_established: 2017,
        team_size: 10,
        special_offers: ["Çift masaj paketi %30 indirim"]
      },
      {
        id: "8",
        name: "Makyaj Sanatı",
        slug: "makyaj-sanati",
        city: "Ankara",
        district: "Çankaya",
        address: "Tunalı Hilmi Cad. No:89 Çankaya",
        description: "Profesyonel makyaj ve bridal styling. Özel günlerinizde en güzel halinizle parlayın.",
        rating: 4.7,
        review_count: 156,
        is_featured: false,
        is_verified: true,
        is_open: true,
        opening_hours: "11:00 - 20:00",
        price_range: "₺₺",
        services: ["Düğün Makyajı", "Günlük Makyaj", "Özel Etkinlik", "Makyaj Kursu"],
        amenities: ["wifi", "credit_card"],
        images: [],
        year_established: 2021,
        team_size: 3,
        special_offers: ["Düğün paketi %20 indirim"]
      },
    ];
  }, [initialSalons]);

  const cities = useMemo(() => {
    const list = demoSalons.map(s => s.city).filter(Boolean);
    return ["all", ...Array.from(new Set(list))];
  }, [demoSalons]);

  const filteredSalons = useMemo(() => {
    return demoSalons.filter(s => {
      const name = (s.name || "").toLowerCase();
      const desc = (s.description || "").toLowerCase();
      const searchLower = search.toLowerCase();

      const matchesSearch = name.includes(searchLower) || desc.includes(searchLower);
      const matchesCity = selectedCity === "all" || s.city === selectedCity;
      
      if (selectedRating && s.rating && s.rating < selectedRating) {
        return false;
      }
      
      return matchesSearch && matchesCity;
    });
  }, [demoSalons, search, selectedCity, selectedRating]);

  const finalSalons = useMemo(() => {
    let list = [...filteredSalons];
    
    if (selectedCategory !== "Tümü") {
      list = list.filter(s => (s.description?.toLowerCase() || "").includes(selectedCategory.toLowerCase()));
    }

    switch (sortBy) {
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        list.sort((a, b) => (b.year_established || 0) - (a.year_established || 0));
        break;
      case "reviews":
        list.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      case "price_low":
        list.sort((a, b) => (a.price_range?.length || 0) - (b.price_range?.length || 0));
        break;
      case "price_high":
        list.sort((a, b) => (b.price_range?.length || 0) - (a.price_range?.length || 0));
        break;
      default:
        list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return list;
  }, [filteredSalons, selectedCategory, sortBy]);

  const featuredSalons = useMemo(() => {
    return demoSalons.filter(s => s.is_featured).slice(0, 4);
  }, [demoSalons]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await Promise.resolve();
    setIsLoading(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getAmenityIcon = (amenity: string) => {
    return <Building2 className="w-4 h-4" />;
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[2.5rem] border border-stone-200 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-8 py-12 md:px-12 md:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-rose-200">
              <Sparkles className="h-3.5 w-3.5" />
              BeautyBook Kesfet
            </div>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Sana En Uygun
              <span className="block text-rose-400">Salonlari Bul</span>
            </h1>
            <p className="text-base font-medium text-stone-300 md:text-lg">
              Sehir, kategori ve puana gore filtrele; yorumlari incele ve tek tikla randevu al.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-[360px]">
            {[
              { label: "Salon", value: `${demoSalons.length}+` },
              { label: "Sehir", value: `${cities.filter((c) => c !== "all").length}` },
              { label: "Ortalama", value: "4.8/5" },
              { label: "Anlik", value: "Acik / Kapali" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <form onSubmit={handleSearch} className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Salon veya hizmet ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm font-semibold text-stone-700 outline-none focus:border-rose-300 focus:bg-white"
            />
          </div>

          <select
            className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 outline-none focus:border-rose-300"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="all">Tum Sehirler</option>
            {cities
              .filter((c) => c !== "all")
              .map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              showFilters ? "bg-rose-100 text-rose-700" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            Filtreler
          </button>

          <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-50 p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-xl px-3 py-2 text-xs font-bold ${viewMode === "grid" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-xl px-3 py-2 text-xs font-bold ${viewMode === "list" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
            >
              Liste
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Ara
          </button>
        </div>
      </form>

      {showFilters && (
        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-stone-900">Gelismis Filtreler</h3>
            <button onClick={() => setShowFilters(false)} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">Minimum Puan</p>
              <div className="flex flex-wrap gap-2">
                {[{ value: null, label: "Tumu" }, { value: 4, label: "4+" }, { value: 4.5, label: "4.5+" }, { value: 4.8, label: "4.8+" }].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setSelectedRating(item.value)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold ${selectedRating === item.value ? "bg-rose-600 text-white" : "bg-stone-100 text-stone-600"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">Siralama</p>
              <select
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700"
                value={sortBy}
                onChange={(e) => setSortType(e.target.value as SortType)}
              >
                <option value="recommended">Onerilen</option>
                <option value="rating">En Yuksek Puan</option>
                <option value="newest">En Yeniler</option>
                <option value="reviews">En Cok Yorum</option>
                <option value="price_low">Fiyat Dusuk-Yuksek</option>
                <option value="price_high">Fiyat Yuksek-Dusuk</option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">Hizli Sehir</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.slice(0, 4).map((city) => (
                  <button
                    key={city.name}
                    onClick={() => setSelectedCity(city.name)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${selectedCity === city.name ? "bg-rose-600 text-white" : "bg-stone-100 text-stone-600"}`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">Islem</p>
              <button
                onClick={() => {
                  setSelectedCity("all");
                  setSelectedCategory("Tümü");
                  setSelectedRating(null);
                  setSortType("recommended");
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:border-rose-300 hover:text-rose-600"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-stone-900">Kategoriler</h2>
          <span className="text-sm font-semibold text-stone-500">Bir kategori sec</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`whitespace-nowrap rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                selectedCategory === cat.name
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
              }`}
            >
              {cat.icon} {cat.name} <span className="ml-1 text-xs opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      </section>

      {selectedCategory === "Tümü" && selectedCity === "all" && featuredSalons.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-stone-900">One Cikan Salonlar</h2>
            <span className="text-sm font-semibold text-stone-500">{featuredSalons.length} salon</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredSalons.map((salon) => (
              <Link key={salon.id} href={`/salon/${salon.slug}`} className="rounded-3xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-black text-stone-900 line-clamp-1">{salon.name}</p>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <p className="mb-3 text-xs font-semibold text-stone-500">{salon.city}{salon.district ? `, ${salon.district}` : ""}</p>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-600">{salon.price_range || "₺₺"}</span>
                  <span className={salon.is_open ? "text-emerald-600" : "text-stone-500"}>{salon.is_open ? "Acik" : "Kapali"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-stone-900">
            {selectedCategory === "Tümü" ? "Tum Salonlar" : selectedCategory}
            {selectedCity !== "all" ? <span className="text-rose-600"> - {selectedCity}</span> : null}
          </h2>
          <p className="text-sm font-semibold text-stone-500">{finalSalons.length} sonuc</p>
        </div>

        {finalSalons.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-12 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-stone-300" />
            <p className="text-lg font-black text-stone-900">Sonuc bulunamadi</p>
            <p className="mb-4 text-sm font-medium text-stone-500">Filtrelerini guncelleyip tekrar deneyebilirsin.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCity("all");
                setSelectedCategory("Tümü");
                setSelectedRating(null);
                setSortType("recommended");
              }}
              className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white hover:bg-rose-700"
            >
              Filtreleri Sifirla
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {finalSalons.map((salon) => (
              <Link
                key={salon.id}
                href={`/salon/${salon.slug}`}
                className={`group rounded-[2rem] border border-stone-200 bg-white p-5 transition hover:border-rose-200 hover:shadow-md ${
                  viewMode === "list" ? "flex items-start gap-4" : "flex flex-col"
                }`}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-stone-100 ${viewMode === "list" ? "h-28 w-28 shrink-0" : "mb-4 h-44 w-full"}`}>
                  {salon.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={salon.logo_url} alt={salon.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-black text-stone-300">{salon.name[0]}</div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(salon.id);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2"
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(salon.id) ? "fill-rose-500 text-rose-500" : "text-stone-500"}`} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-lg font-black text-stone-900 group-hover:text-rose-600">{salon.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {salon.rating || "4.8"}
                    </span>
                  </div>
                  <p className="mb-2 text-xs font-semibold text-stone-500">{salon.city}{salon.district ? `, ${salon.district}` : ""}</p>
                  <p className="mb-3 line-clamp-2 text-sm font-medium text-stone-600">{salon.description || "Kaliteli hizmet, deneyimli ekip ve guvenilir randevu deneyimi."}</p>

                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {salon.services?.slice(0, 3).map((service, i) => (
                      <span key={i} className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                      <Clock className="h-3.5 w-3.5 text-rose-500" />
                      {salon.opening_hours || "09:00 - 21:00"}
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${salon.is_open ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>
                      {salon.is_open ? "Acik" : "Kapali"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] bg-rose-600 px-8 py-10 text-center text-white md:px-12">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-100">Salon Sahibi misin?</p>
        <h3 className="mb-3 text-3xl font-black">Sen de BeautyBook'ta Yerini Al</h3>
        <p className="mx-auto mb-6 max-w-2xl text-sm font-medium text-rose-100 md:text-base">
          Musterilere daha hizli ulas, randevularini dijitallestir ve salonunu tek panelden yonet.
        </p>
        <Link href="/admin" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-rose-600">
          <Building2 className="h-4 w-4" />
          Salonunu Ekle
        </Link>
      </section>
    </div>
  );
}
