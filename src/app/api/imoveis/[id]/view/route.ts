import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.property.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })
    return NextResponse.json({ ok: true })
  } catch {
    // Silencioso — não bloquear a página por falha no contador
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
