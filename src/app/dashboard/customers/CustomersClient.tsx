"use client";

import { useState } from "react";
import {
  Search,
  UserCircle,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  X,
  DollarSign,
  ClipboardList,
} from "lucide-react";

import { format } from "date-fns";
import { tr } from "date-fns/locale";

import type { Customer } from "@/types";

export default function CustomersClient({
  salonId,
  initialCustomers,
}: {
  salonId: string;
  initialCustomers: Customer[];
}) {

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = initialCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const totalCustomers = initialCustomers.length;

  const newCustomers = initialCustomers.filter((c) => {
    const created = new Date(c.created_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return created > monthAgo;
  }).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">
            Müşteriler
          </h1>
          <p className="text-sm text-charcoal-400 mt-1">
            Salon müşterilerinizi yönetin
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-4">

        <div className="card p-5">
          <p className="text-xs text-charcoal-400">Toplam Müşteri</p>
          <p className="text-2xl font-bold mt-1">{totalCustomers}</p>
        </div>

        <div className="card p-5">
          <p className="text-xs text-charcoal-400">Bu Ay Yeni</p>
          <p className="text-2xl font-bold mt-1">{newCustomers}</p>
        </div>

        <div className="card p-5">
          <p className="text-xs text-charcoal-400">Arama Sonucu</p>
          <p className="text-2xl font-bold mt-1">{filtered.length}</p>
        </div>

      </div>

      {/* LIST CARD */}

      <div className="card p-5">

        {/* SEARCH */}

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
          <input
            className="input pl-10"
            placeholder="Ad veya telefon ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <UserCircle className="w-10 h-10 text-sand-200 mx-auto mb-3" />
            <p className="text-charcoal-400 text-sm">Müşteri bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y divide-sand-50">

            {filtered.map((c) => (

              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="flex items-center gap-4 py-4 hover:bg-sand-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
              >

                <div className="w-11 h-11 bg-gradient-to-br from-rose-100 to-sand-100 rounded-full flex items-center justify-center text-base font-bold text-rose-600">
                  {c.name[0]}
                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-medium text-charcoal-800">
                    {c.name}
                  </p>

                  <div className="flex items-center gap-3 mt-0.5">

                    <span className="flex items-center gap-1 text-xs text-charcoal-400">
                      <Phone className="w-3 h-3" />
                      {c.phone}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-charcoal-400">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(c.created_at), "d MMM yyyy", { locale: tr })}
                    </span>

                  </div>

                </div>

                <ChevronRight className="w-4 h-4 text-charcoal-300 opacity-0 group-hover:opacity-100 transition-opacity" />

              </div>

            ))}

          </div>
        )}

      </div>

      {/* CUSTOMER DETAIL MODAL */}

      {selectedCustomer && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[420px] p-6 relative">

            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-xl font-bold text-rose-600">
                {selectedCustomer.name[0]}
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  {selectedCustomer.name}
                </h2>
                <p className="text-sm text-charcoal-400">
                  Müşteri Detayı
                </p>
              </div>

            </div>

            <div className="space-y-4 text-sm">

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-charcoal-400" />
                {selectedCustomer.phone}
              </div>

              {selectedCustomer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-charcoal-400" />
                  {selectedCustomer.email}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-charcoal-400" />
                {format(new Date(selectedCustomer.created_at), "d MMMM yyyy", { locale: tr })}
              </div>

              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-charcoal-400" />
                Toplam randevu: {selectedCustomer.total_appointments || 0}
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-charcoal-400" />
                Toplam harcama: ₺{selectedCustomer.total_spent || 0}
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}