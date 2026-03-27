export const dynamic = 'force-dynamic'

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'

const nextAuthHandler = NextAuth(authOptions)

// Rate limiting para tentativas de login (5.4): máx 10 por IP por hora
async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  if (!checkRateLimit(`login:${ip}`, 10, 3600_000)) {
    return NextResponse.json(
      { error: 'Muitas tentativas de login. Aguarde 1 hora.' },
      { status: 429 }
    )
  }

  return nextAuthHandler(request as Parameters<typeof nextAuthHandler>[0], {} as Parameters<typeof nextAuthHandler>[1])
}

export { nextAuthHandler as GET, POST }
