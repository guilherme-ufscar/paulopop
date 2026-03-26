import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
  const { images, videos, documents, features, lifestyles, parkingSpots, rooms, additionalFees, portals, leads, activities, agent, condominium, owner, ...data } = body

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
