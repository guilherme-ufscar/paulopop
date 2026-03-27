export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/sanitize'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: 'asc' } },
      videos: true,
      documents: true,
      features: true,
      lifestyles: true,
      parkingSpots: true,
      rooms: true,
      additionalFees: true,
      portals: true,
      agent: { select: { id: true, name: true, email: true, phone: true, whatsapp: true, creci: true, avatarUrl: true } },
      condominium: true,
      owner: true,
      leads: { orderBy: { createdAt: 'desc' }, take: 10 },
      activities: { orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { name: true } } } },
    },
  })

  if (!property) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
  return NextResponse.json(property)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()

  // Remover campos que são relações (gerenciados separadamente)
  const { images: _images, videos: _videos, documents: _documents, features: _features, lifestyles: _lifestyles, parkingSpots: _parkingSpots, rooms: _rooms, additionalFees: _additionalFees, portals: _portals, leads: _leads, activities: _activities, agent: _agent, condominium: _condominium, owner: _owner, ...data } = body

  // Sanitizar campos HTML antes de salvar (5.4)
  if (data.description) data.description = sanitizeHtml(data.description)
  if (data.marketingDescription) data.marketingDescription = sanitizeHtml(data.marketingDescription)
  if (data.surroundingsInfo) data.surroundingsInfo = sanitizeHtml(data.surroundingsInfo)
  if (data.descriptionEn) data.descriptionEn = sanitizeHtml(data.descriptionEn)

  const property = await prisma.property.update({
    where: { id: params.id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

  return NextResponse.json(property)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await prisma.property.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
