"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Star, ChevronRight, Scissors, Building2 } from "lucide-react";

interface Salon {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  logo_url?: string;
  description?: string;
}

export default function SalonsClient({ initialSalons }: { initialSalons: Salon[] }) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  // Şehir listesini benzersiz olarak çıkaralım
  const cities = useMemo(() => {
    const list = initialSalons.map(s => s.city).filter(Boolean);
    return ["all", ...Array.from(new Set(list))];
  }, [initialSalons]);

  // Filtreleme mantığı
  const filteredSalons = useMemo(() => {
    return initialSalons.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           (s.description?.toLowerCase().includes(search.toLowerCase()));
      const matchesCity = selectedCity === "all" || s.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [initialSalons, search, selectedCity]);

  return (
    <div className="space-y-8">
      {/* ── FILTERS ── */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-stone-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Salon adı veya hizmet ara..."
            className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-100 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="md:w-64 px-6 py-4 bg-stone-50 border-none rounded-2xl text-sm font-bold text-stone-700 cursor-pointer focus:ring-2 focus:ring-rose-100 transition-all appearance-none"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="all">Tüm Şehirler</option>
          {cities.filter(c => c !== "all").map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* ── SALON GRID ── */}
      {filteredSalons.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-stone-300">
          <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-900">Salon Bulunamadı</h3>
          <p className="text-stone-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSalons.map((salon) => (
            <Link
              key={salon.id}
              href={`/salon/${salon.slug}`}
              className="group bg-white rounded-[2.5rem] border border-stone-200 p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-rose-200 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 bg-stone-100 rounded-3xl overflow-hidden flex items-center justify-center border border-stone-100 shrink-0 group-hover:scale-105 transition-transform duration-500">
                  {salon.logo_url ? (
                    <img src={salon.logo_url} alt={salon.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-stone-300">{salon.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-stone-900">4.9</span>
                    <span className="text-[10px] text-stone-400 font-bold">(120+ Yorum)</span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 leading-tight truncate group-hover:text-rose-600 transition-colors">{salon.name}</h3>
                  <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {salon.city}
                  </p>
                </div>
              </div>

              <p className="text-stone-500 text-sm line-clamp-2 mb-8 flex-1 font-medium">
                {salon.description || "Kaliteli hizmet ve profesyonel kadromuzla yanınızdayız."}
              </p>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5" /> Premium Hizmet
                </span>
                <div className="flex items-center gap-2 text-rose-600 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                  İncele <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}