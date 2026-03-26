import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateMarketingPlan } from '@/lib/ai'

export async function POST(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    select: {
      title: true,
      propertyType: true,
      city: true,
      state: true,
      neighborhood: true,
      price: true,
      bedrooms: true,
      totalArea: true,
      transactionType: true,
      features: { select: { feature: true } },
    },
  })

  if (!property) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })

  try {
    const plan = await generateMarketingPlan({
      title: property.title,
      propertyType: property.propertyType,
      city: property.city,
      state: property.state,
      neighborhood: property.neighborhood,
      price: property.price ? Number(property.price) : null,
      bedrooms: property.bedrooms,
      totalArea: property.totalArea ? Number(property.totalArea) : null,
      transactionType: property.transactionType,
      features: property.features.map(f => f.feature),
    })

    return NextResponse.json({ plan })
  } catch (err) {
    console.error('[MarketingPlan] Erro:', err)
    return NextResponse.json({ error: 'Erro ao gerar plano de marketing' }, { status: 500 })
  }
}
