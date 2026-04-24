export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const empreendimento = await prisma.condominium.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: [{ category: 'asc' }, { order: 'asc' }] },
      properties: {
        where: { status: 'ACTIVE', hideOnSite: false },
        select: {
          id: true, slug: true, title: true, propertyType: true,
          transactionType: true, price: true, totalArea: true,
          bedrooms: true, bathrooms: true, suites: true,
          totalParkingSpots: true, neighborhood: true, city: true, state: true,
          images: { where: { isCover: true }, take: 1, select: { url: true, thumbnailUrl: true } },
        },
      },
    },
  })

  if (!empreendimento) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(empreendimento)
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const { images, ...fields } = body

  const empreendimento = await prisma.condominium.update({
    where: { id: params.id },
    data: {
      name: fields.name,
      subtitle: fields.subtitle ?? null,
      description: fields.description ?? null,
      status: fields.status ?? 'DRAFT',
      tipologiasDescription: fields.tipologiasDescription ?? null,
      lazerDescription: fields.lazerDescription ?? null,
      address: fields.address ?? null,
      neighborhood: fields.neighborhood ?? null,
      city: fields.city ?? null,
      state: fields.state ?? null,
      zipCode: fields.zipCode ?? null,
      latitude: fields.latitude ? parseFloat(fields.latitude) : null,
      longitude: fields.longitude ? parseFloat(fields.longitude) : null,
      locationDescription: fields.locationDescription ?? null,
      priceFrom: fields.priceFrom ? parseFloat(fields.priceFrom) : null,
      priceTo: fields.priceTo ? parseFloat(fields.priceTo) : null,
      paymentInfo: fields.paymentInfo ?? null,
      banks: fields.banks ?? null,
      totalUnits: fields.totalUnits ? parseInt(fields.totalUnits) : null,
      deliveryDate: fields.deliveryDate ?? null,
    },
  })

  // Sync images
  if (Array.isArray(images)) {
    await prisma.empreendimentoImage.deleteMany({ where: { condominiumId: params.id } })
    if (images.length > 0) {
      await prisma.empreendimentoImage.createMany({
        data: images.map((img: {
          url: string; thumbnailUrl?: string; alt?: string;
          caption?: string; order?: number; category?: string
        }, i: number) => ({
          condominiumId: params.id,
          url: img.url,
          thumbnailUrl: img.thumbnailUrl ?? null,
          alt: img.alt ?? null,
          caption: img.caption ?? null,
          order: img.order ?? i,
          category: img.category ?? 'FACHADA',
        })),
      })
    }
  }

  return NextResponse.json(empreendimento)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await prisma.condominium.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
