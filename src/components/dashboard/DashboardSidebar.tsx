'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Scissors, Users, UserCheck, LayoutDashboard, ExternalLink, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Salon } from '@/types/database'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/appointments', icon: Calendar, label: 'Randevular' },
  { href: '/dashboard/services', icon: Scissors, label: 'Hizmetler' },
  { href: '/dashboard/staff', icon: UserCheck, label: 'Personel' },
  { href: '/dashboard/customers', icon: Users, label: 'Müşteriler' },
]

export default function DashboardSidebar({ salon }: { salon: Salon }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-sand-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-sand-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold text-charcoal-900">
            Beauty<span className="text-rose-500">Book</span>
          </span>
        </Link>
      </div>

      {/* Salon info */}
      <div className="px-4 py-3 mx-3 mt-4 bg-rose-50 rounded-xl border border-rose-200">
        <div className="text-xs font-semibold text-rose-600 truncate">{salon.name}</div>
        <div className="text-xs text-charcoal-400 truncate">{salon.city}</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('sidebar-link', isActive && 'active')}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Booking page link */}
      <div className="p-4 border-t border-sand-200">
        <Link
          href={`/salon/${salon.slug}`}
          target="_blank"
          className="flex items-center gap-2 text-xs font-medium text-charcoal-500 hover:text-rose-600 transition-colors group"
        >
          <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Rezervasyon Sayfam
        </Link>
        <p className="text-xs text-charcoal-400 mt-1 truncate">/salon/{salon.slug}</p>
      </div>
    </aside>
  )
}
