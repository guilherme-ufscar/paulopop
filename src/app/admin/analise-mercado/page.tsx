import { prisma } from '@/lib/prisma'
import { MarketAnalysisClient } from './MarketAnalysisClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Análise de Mercado | Admin Paulo Pop',
}

export default async function AnaliseMercadoPage() {
  const properties = await prisma.property.findMany({
    where: { status: { in: ['ACTIVE', 'DRAFT'] } },
    select: {
      id: true,
      ref: true,
      title: true,
      propertyType: true,
      city: true,
      state: true,
      neighborhood: true,
      price: true,
      totalArea: true,
      bedrooms: true,
      status: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  })

  return (
    <MarketAnalysisClient
      properties={properties.map(p => ({
        ...p,
        price: p.price ? Number(p.price) : null,
        totalArea: p.totalArea ? Number(p.totalArea) : null,
      }))}
    />
  )
}
