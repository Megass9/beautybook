import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-stone-50/50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
