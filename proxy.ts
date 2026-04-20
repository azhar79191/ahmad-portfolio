import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/admin/login')
  const isAdminPage = pathname.startsWith('/admin')

  // Not an admin route — let it through
  if (!isAdminPage) return NextResponse.next()

  // No token and trying to access protected admin page → redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Has token and trying to access login → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
