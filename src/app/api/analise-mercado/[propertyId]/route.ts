export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateMarketAnalysis } from '@/lib/ai'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Erro ao gerar analise de mercado'
}

export async function POST(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    include: {
      features: true,
    },
  })

  if (!property) return NextResponse.json({ error: 'Imovel nao encontrado' }, { status: 404 })

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

  let analysisRecordId: string | null = null

  try {
    const analysisRecord = await prisma.marketAnalysis.create({
      data: {
        propertyId: params.propertyId,
        status: 'PROCESSING',
      },
    })
    analysisRecordId = analysisRecord.id

    const normalizedComparables = comparables.map(comparable => ({
      propertyType: comparable.propertyType,
      totalArea: comparable.totalArea ? Number(comparable.totalArea) : null,
      price: comparable.price ? Number(comparable.price) : null,
      status: comparable.status,
      neighborhood: comparable.neighborhood,
      createdAt: comparable.createdAt.toISOString(),
    }))

    const result = await generateMarketAnalysis({
      propertyType: property.propertyType,
      city: property.city,
      state: property.state,
      neighborhood: property.neighborhood,
      totalArea: property.totalArea ? Number(property.totalArea) : null,
      bedrooms: property.bedrooms,
      price: property.price ? Number(property.price) : null,
      features: property.features.map(feature => feature.feature),
      comparables: normalizedComparables,
    })

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
        comparables: normalizedComparables,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[AnalyseMercado] Erro:', error)

    if (analysisRecordId) {
      await prisma.marketAnalysis.updateMany({
        where: { id: analysisRecordId },
        data: { status: 'FAILED' },
      })
    }

    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })

  const analyses = await prisma.marketAnalysis.findMany({
    where: { propertyId: params.propertyId },
    orderBy: { generatedAt: 'desc' },
    take: 5,
  })

  return NextResponse.json(analyses)
}
