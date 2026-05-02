"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, SortAsc, X, Zap, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

export default function AdminSalonsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

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
    router.push(`?${createQueryString(name, value)}`, { scroll: false });
  };

  // Search debounce logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        handleParamChange("search", searchTerm);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams]);

  return (
    <div className="flex flex-col gap-6 bg-white/50 backdrop-blur-sm p-2 rounded-[2.5rem] border border-stone-200/60 shadow-sm lg:flex-row lg:items-center lg:p-2">
      {/* Search Field */}
      <div className="flex-1 relative group p-2">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-rose-500 transition-colors z-10" />
        <input
          type="text"
          placeholder="Salon adı, slug veya şehir ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-12 py-4 bg-white border border-stone-200 rounded-[1.8rem] text-sm font-bold text-stone-900 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all placeholder:text-stone-400 shadow-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5 text-stone-400" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 p-2 lg:border-l lg:border-stone-200 lg:pl-4">
        {/* Filter Dropdown */}
        <div className="relative flex-1 lg:flex-none min-w-[180px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            {searchParams.get("filter") === "active" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
             searchParams.get("filter") === "trial" ? <Zap className="w-3.5 h-3.5 text-blue-500" /> :
             searchParams.get("filter") === "expired" ? <Clock className="w-3.5 h-3.5 text-amber-500" /> :
             searchParams.get("filter") === "restricted" ? <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> :
             <Filter className="w-3.5 h-3.5 text-stone-400" />}
          </div>
          <select
            defaultValue={searchParams.get("filter") || "all"}
            onChange={(e) => handleParamChange("filter", e.target.value)}
            className="w-full pl-11 pr-10 py-4 bg-stone-100/50 hover:bg-stone-100 border border-transparent rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] text-stone-600 appearance-none focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all cursor-pointer"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">✓ Aktif Aboneler</option>
            <option value="trial">✦ Deneme Süresi</option>
            <option value="expired">⌛ Süresi Dolanlar</option>
            <option value="restricted">⚠ Kısıtlanmışlar</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 lg:flex-none min-w-[190px]">
          <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none z-10" />
          <select
            defaultValue={searchParams.get("sort") || "created_desc"}
            onChange={(e) => handleParamChange("sort", e.target.value)}
            className="w-full pl-11 pr-10 py-4 bg-stone-100/50 hover:bg-stone-100 border border-transparent rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] text-stone-600 appearance-none focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all cursor-pointer"
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