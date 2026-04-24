export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/depoimentos — envio público de depoimento (aguarda aprovação)
export async function POST(request: NextRequest) {
  const body = await request.json() as {
    name: string
    role?: string
    text: string
    rating?: number
  }

  if (!body.name || !body.text) {
    return NextResponse.json({ error: 'Nome e texto são obrigatórios' }, { status: 400 })
  }

  if (body.text.length > 1000) {
    return NextResponse.json({ error: 'Texto muito longo (máx 1000 caracteres)' }, { status: 400 })
  }

  await prisma.testimonial.create({
    data: {
      name: String(body.name).substring(0, 150),
      role: body.role ? String(body.role).substring(0, 150) : null,
      text: String(body.text).substring(0, 1000),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      source: 'site',
      approved: false, // aguarda aprovação do admin
    },
  })

  return NextResponse.json({ success: true })
}

// GET /api/depoimentos — retorna depoimentos aprovados para o frontend
export async function GET() {
  const items = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, role: true, text: true, rating: true, avatarUrl: true, createdAt: true },
  })
  return NextResponse.json(items)
}
