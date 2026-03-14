'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Bell, User } from 'lucide-react'
import { Salon } from '@/types/database'
import type { User as SupaUser } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

export default function DashboardHeader({ user, salon }: { user: SupaUser; salon: Salon }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Çıkış yapıldı')
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-sand-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Mobile salon name */}
      <div className="md:hidden font-display font-bold text-charcoal-900 text-sm">{salon.name}</div>
      
      {/* Breadcrumb placeholder */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-sand-100 transition-colors text-charcoal-500">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sand-100 border border-sand-200">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-charcoal-700 hidden sm:block max-w-[120px] truncate">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-charcoal-400"
          title="Çıkış Yap"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
