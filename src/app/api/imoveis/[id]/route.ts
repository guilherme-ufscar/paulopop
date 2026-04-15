export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizePropertyUpdateInput } from '@/lib/property-update'

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

  // Extrair relações antes de normalizar (tratadas separadamente)
  const rawImages: Array<Record<string, unknown>> = Array.isArray(body.images) ? body.images : []
  const rawVideos: Array<Record<string, unknown>> = Array.isArray(body.videos) ? body.videos : []
  // Features: aceitar tanto string[] quanto objetos {feature: string}
  const rawFeatures: string[] = Array.isArray(body.features)
    ? (body.features as Array<unknown>).map(f =>
        typeof f === 'string' ? f : (f as Record<string, unknown>)?.feature as string
      ).filter(Boolean)
    : []
  // Lifestyles: aceitar tanto string[] quanto objetos {lifestyle: string}
  const rawLifestyles: string[] = Array.isArray(body.lifestyles)
    ? (body.lifestyles as Array<unknown>).map(l =>
        typeof l === 'string' ? l : (l as Record<string, unknown>)?.lifestyle as string
      ).filter(Boolean)
    : []

  const data = normalizePropertyUpdateInput(body)

  try {
    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    // Sincronizar imagens
    if (rawImages.length > 0 || body.images !== undefined) {
      // IDs das imagens que ainda existem no frontend
      const existingIds = rawImages.filter(img => img.id).map(img => img.id as string)

      // Deletar imagens removidas
      await prisma.propertyImage.deleteMany({
        where: { propertyId: params.id, id: { notIn: existingIds } },
      })

      // Criar novas imagens e atualizar as existentes
      for (let i = 0; i < rawImages.length; i++) {
        const img = rawImages[i]
        if (img.id) {
          // Atualizar flags e ordem de imagens existentes
          await prisma.propertyImage.update({
            where: { id: img.id as string },
            data: {
              isCover: Boolean(img.isCover),
              is360: Boolean(img.is360),
              isPanoramic: Boolean(img.isPanoramic),
              order: i,
              alt: (img.alt as string) ?? null,
            },
          })
        } else if (img.url) {
          // Criar nova imagem
          await prisma.propertyImage.create({
            data: {
              propertyId: params.id,
              url: img.url as string,
              thumbnailUrl: (img.thumbnailUrl as string) ?? null,
              isCover: Boolean(img.isCover),
              is360: Boolean(img.is360),
              isPanoramic: Boolean(img.isPanoramic),
              order: i,
            },
          })
        }
      }

      // Se não havia imagens no payload, deletar todas
      if (rawImages.length === 0 && body.images !== undefined) {
        await prisma.propertyImage.deleteMany({ where: { propertyId: params.id } })
      }
    }

    // Sincronizar vídeos
    if (body.videos !== undefined) {
      await prisma.propertyVideo.deleteMany({ where: { propertyId: params.id } })
      for (const vid of rawVideos) {
        if (vid.youtubeUrl) {
          await prisma.propertyVideo.create({
            data: { propertyId: params.id, youtubeUrl: vid.youtubeUrl as string },
          })
        }
      }
    }

    // Sincronizar features (características)
    if (body.features !== undefined) {
      await prisma.propertyFeature.deleteMany({ where: { propertyId: params.id } })
      for (const feature of rawFeatures) {
        await prisma.propertyFeature.create({
          data: { propertyId: params.id, feature: feature as never },
        })
      }
    }

    // Sincronizar lifestyles (estilos de vida)
    if (body.lifestyles !== undefined) {
      await prisma.propertyLifestyle.deleteMany({ where: { propertyId: params.id } })
      for (const lifestyle of rawLifestyles) {
        await prisma.propertyLifestyle.create({
          data: { propertyId: params.id, lifestyle: lifestyle as never },
        })
      }
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error)
    const message = error instanceof Error ? error.message : 'Erro ao salvar imóvel'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await prisma.property.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
