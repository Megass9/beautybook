"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, SortAsc } from "lucide-react";
import { useCallback } from "react";

export default function AdminSalonsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleParamChange = (name: string, value: string) => {
    router.push(`?${createQueryString(name, value)}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-[2.5rem] border border-stone-200 shadow-sm items-center">
      {/* Search Field */}
      <div className="flex-1 w-full relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-rose-500 transition-colors" />
        <input
          type="text"
          placeholder="Salon adı, slug veya şehir ile ara..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => handleParamChange("search", e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:bg-white transition-all placeholder:text-stone-300"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* Filter Dropdown */}
        <div className="relative flex-1 lg:flex-none min-w-[160px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          <select
            defaultValue={searchParams.get("filter") || "all"}
            onChange={(e) => handleParamChange("filter", e.target.value)}
            className="w-full pl-10 pr-8 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-black uppercase tracking-widest text-stone-600 appearance-none focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all cursor-pointer"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif Aboneler</option>
            <option value="trial">Deneme Süresi</option>
            <option value="expired">Süresi Dolanlar</option>
            <option value="restricted">Kısıtlanmışlar</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 lg:flex-none min-w-[180px]">
          <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          <select
            defaultValue={searchParams.get("sort") || "created_desc"}
            onChange={(e) => handleParamChange("sort", e.target.value)}
            className="w-full pl-10 pr-8 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-black uppercase tracking-widest text-stone-600 appearance-none focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all cursor-pointer"
          >
            <option value="created_desc">En Yeni Kayıt</option>
            <option value="created_asc">En Eski Kayıt</option>
            <option value="end_asc">Bitiş (En Yakın)</option>
            <option value="end_desc">Bitiş (En Uzak)</option>
          </select>
        </div>
      </div>
    </div>
  );
}