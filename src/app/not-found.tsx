import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdf8f2] flex items-center justify-center">
      <div className="text-center">
        <div className="font-display text-8xl font-bold text-rose-300 mb-4">404</div>
        <h1 className="font-display text-2xl font-bold text-charcoal-900 mb-2">Sayfa Bulunamadı</h1>
        <p className="text-charcoal-400 mb-6">Aradığınız sayfa mevcut değil.</p>
        <Link href="/" className="btn-primary">
          <Sparkles className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
