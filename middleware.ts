import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 未ログインで/control/...のアクセスを禁じる
  if (request.nextUrl.pathname.startsWith('/control')) {
    const hasAccessToken = request.cookies.get('access');
    if (!hasAccessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}