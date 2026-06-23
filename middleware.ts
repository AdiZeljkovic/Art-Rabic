import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Set x-pathname header so server components (layout) can detect admin routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_session')?.value
    const valid = await verifyAdminToken(token)
    if (!valid) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
