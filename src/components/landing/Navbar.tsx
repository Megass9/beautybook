'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'glass shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center shadow-sm">
              <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold text-stone-900">
              Beauty<span className="text-rose-500">Book</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium">Özellikler</a>
            <a href="#how-it-works" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium">Nasıl Çalışır</a>
            <a href="#pricing" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium">Fiyatlar</a>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-stone-700 hover:text-stone-900 px-4 py-2 rounded-lg hover:bg-stone-100 transition-all"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden glass rounded-2xl mb-4 p-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <a href="#features" className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">Özellikler</a>
              <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">Nasıl Çalışır</a>
              <a href="#pricing" className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">Fiyatlar</a>
              <hr className="border-stone-200 my-1" />
              <Link href="/auth/login" className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">Giriş Yap</Link>
              <Link href="/auth/register" className="px-3 py-2 text-sm font-semibold text-white bg-rose-500 rounded-xl text-center hover:bg-rose-600 transition-colors">Ücretsiz Başla</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
