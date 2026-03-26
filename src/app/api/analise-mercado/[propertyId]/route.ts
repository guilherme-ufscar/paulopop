import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateMarketAnalysis } from '@/lib/ai'

export async function POST(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    include: {
      features: true,
    },
  })
  if (!property) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })

  // Buscar comparáveis: mesmo tipo, mesma cidade, status ACTIVE ou SOLD, últimos 12 meses
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)

  const comparables = await prisma.property.findMany({
    where: {
      id: { not: params.propertyId },
      propertyType: property.propertyType ?? undefined,
      city: property.city ?? undefined,
      status: { in: ['ACTIVE', 'SOLD'] },
      createdAt: { gte: twelveMonthsAgo },
    },
    select: {
      propertyType: true,
      totalArea: true,
      price: true,
      status: true,
      neighborhood: true,
      createdAt: true,
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
  })

  try {
    // Criar registro de análise com status PROCESSING
    const analysisRecord = await prisma.marketAnalysis.create({
      data: {
        propertyId: params.propertyId,
        status: 'PROCESSING',
      },
    })

    const result = await generateMarketAnalysis({
      propertyType: property.propertyType,
      city: property.city,
      state: property.state,
      neighborhood: property.neighborhood,
      totalArea: property.totalArea ? Number(property.totalArea) : null,
      bedrooms: property.bedrooms,
      price: property.price ? Number(property.price) : null,
      features: property.features.map(f => f.feature),
      comparables: comparables.map(c => ({
        propertyType: c.propertyType,
        totalArea: c.totalArea ? Number(c.totalArea) : null,
        price: c.price ? Number(c.price) : null,
        status: c.status,
        neighborhood: c.neighborhood,
        createdAt: c.createdAt.toISOString(),
      })),
    })

    // Atualizar registro com os resultados
    const updated = await prisma.marketAnalysis.update({
      where: { id: analysisRecord.id },
      data: {
        status: 'COMPLETED',
        optimisticValue: result.optimisticValue,
        marketValue: result.marketValue,
        competitiveValue: result.competitiveValue,
        pricePositioning: result.pricePositioning,
        marketDemand: result.marketDemand,
        absoptionTime: result.absoptionTime,
        avgPricePerSqmRegion: result.avgPricePerSqmRegion,
        aiSummary: result.aiSummary,
        aiStrengths: result.aiStrengths,
        aiWeaknesses: result.aiWeaknesses,
        aiOpportunities: result.aiOpportunities,
        aiRecommendations: result.aiRecommendations,
        comparables: comparables,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[AnalyseMercado] Erro:', err)
    return NextResponse.json({ error: 'Erro ao gerar análise de mercado' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const analyses = await prisma.marketAnalysis.findMany({
    where: { propertyId: params.propertyId },
    orderBy: { generatedAt: 'desc' },
    take: 5,
  })

  return NextResponse.json(analyses)
}
