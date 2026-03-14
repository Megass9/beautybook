"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Users,
  Phone,
  Mail,
  Key,
  Copy,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Staff, Service } from "@/types";

export default function StaffClient({
  salonId,
  initialStaff,
  services,
}: {
  salonId: string;
  initialStaff: Staff[];
  services: Service[];
}) {
  const supabase = createClient() as any;

  const [staff, setStaff] = useState(initialStaff);
  const [showModal, setShowModal] = useState(false);
  const [showCredModal, setShowCredModal] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const [form, setForm] = useState<{
    name: string;
    role: string;
    phone: string;
    email: string;
    password?: string;
  }>({
    name: "",
    role: "",
    phone: "",
    email: "",
    password: "",
  });

  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({
      name: s.name,
      role: s.role,
      phone: s.phone || "",
      email: s.email || "",
      password: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({
      name: "",
      role: "",
      phone: "",
      email: "",
      password: "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { data, error } = await supabase
          .from("staff")
          .update({
            name: form.name,
            role: form.role,
            phone: form.phone,
            email: form.email,
          })
          .eq("id", editing.id)
          .select()
          .single();

        if (error) throw error;

        setStaff((prev) => prev.map((s) => (s.id === editing.id ? data : s)));

        toast.success("Personel güncellendi");
        closeModal();
      } else {
        if (!form.email) throw new Error("E-posta zorunludur");

        const email = form.email.trim();

        const password =
          form.password ||
          Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-4) +
            "Aa1!";

        const { data: authData, error: authError } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (authError) {
          console.error("SUPABASE AUTH ERROR:", authError);
          throw new Error(authError.message);
        }

        if (!authData.user) {
          throw new Error("Kullanıcı oluşturulamadı");
        }

        const { data, error } = await supabase
          .from("staff")
          .insert({
            salon_id: salonId,
            name: form.name,
            role: form.role,
            phone: form.phone,
            email: email,
            auth_user_id: authData.user.id,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        setStaff((prev) => [...prev, data]);

        closeModal();

        setCredentials({
          email,
          password,
        });

        setShowCredModal(true);

        toast.success("Personel oluşturuldu!");
      }
    } catch (err: any) {
      console.error("STAFF ERROR:", err);
      toast.error(err.message || "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm("Personel silinsin mi?")) return;

    const { error } = await supabase.from("staff").delete().eq("id", id);

    if (!error) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success("Silindi");
    }
  };

  const copyCredentials = () => {
    if (!credentials) return;

    const text = `Giriş sayfası: ${window.location.origin}/staff-portal/login
E-posta: ${credentials.email}
Şifre: ${credentials.password}`;

    navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">
            Personel
          </h1>
          <p className="text-sm text-charcoal-400 mt-0.5">
            {staff.length} personel
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Personel Ekle
        </button>
      </div>

      {staff.length === 0 ? (
        <div className="card p-16 text-center">
          <Users className="w-12 h-12 text-sand-200 mx-auto mb-3" />

          <p className="text-charcoal-500 mb-4">
            Henüz personel eklenmedi
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Personel Ekle
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div
              key={s.id}
              className="card p-5 group hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-sand-100 rounded-2xl flex items-center justify-center text-xl font-bold text-rose-600">
                  {s.name[0]}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 hover:bg-sand-100 rounded-lg"
                  >
                    <Pencil className="w-3.5 h-3.5 text-charcoal-500" />
                  </button>

                  <button
                    onClick={() => deleteStaff(s.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-charcoal-900">{s.name}</h3>

              <p className="text-sm text-rose-600 font-medium mb-3">
                {s.role}
              </p>

              <div className="space-y-1.5">
                {s.phone && (
                  <p className="flex items-center gap-2 text-xs text-charcoal-400">
                    <Phone className="w-3.5 h-3.5" />
                    {s.phone}
                  </p>
                )}

                {s.email && (
                  <p className="flex items-center gap-2 text-xs text-charcoal-400">
                    <Mail className="w-3.5 h-3.5" />
                    {s.email}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-sand-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      s.is_active ? "bg-green-400" : "bg-charcoal-300"
                    }`}
                  />

                  <span className="text-xs text-charcoal-400">
                    {s.is_active ? "Aktif" : "Pasif"}
                  </span>
                </div>

                {(s as any).auth_user_id && (
                  <span className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                    <Key className="w-3 h-3" />
                    Giriş aktif
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
