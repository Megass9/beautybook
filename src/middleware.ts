import { createServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient();

  // Mevcut kullanıcıyı güvenli bir şekilde al
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Eğer URL '/admin' ile başlıyorsa kontrol et
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfasına ve statik dosyalara her zaman izin ver
    if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname.includes('.')) {
      return response;
    }

    // Kullanıcı yoksa veya rolü admin değilse yönlendir
    if (!user || user.app_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

// Sadece admin yollarında çalışması için kısıtla
export const config = {
  matcher: ['/admin', '/admin/((?!login|api|_next/static|_next/image|favicon.ico).*)'],
};