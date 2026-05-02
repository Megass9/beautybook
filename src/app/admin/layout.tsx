"use client";
import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-50/50 overflow-hidden relative">
      {!isLoginPage && (
        <>
          {/* Mobil Arka Plan Karartma */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - Mobilde gizli, masaüstünde görünür */}
          <div className={`
            fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}

      <main className="flex-1 overflow-y-auto flex flex-col">
        {!isLoginPage && (
          <header className="lg:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">B</span>
               </div>
               <span className="font-bold text-sm tracking-tight italic text-stone-900">BeautyBook</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-600"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>
        )}
        
        <div className={`flex-1 ${isLoginPage ? 'p-0' : 'p-4 md:p-8'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
