export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PropertyForm } from '@/components/admin/PropertyForm'

interface Props {
  params: { id: string }
}

export default async function PropertyEditPage({ params }: Props) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: 'asc' } },
      videos: true,
      documents: true,
      portals: true,
      features: true,
      lifestyles: true,
      parkingSpots: true,
      rooms: true,
      additionalFees: true,
      agent: { select: { id: true, name: true } },
      leads: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { contact: true },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: { select: { name: true } } },
      },
    },
  })

  if (!property) notFound()

  // Serializar Decimal e Date para JSON
  const data = JSON.parse(
    JSON.stringify(property, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )

  // Normalizar features/lifestyles para arrays de strings (o formulário espera string[])
  if (Array.isArray(data.features)) {
    data.features = data.features.map((f: { feature: string } | string) =>
      typeof f === 'string' ? f : f.feature
    )
  }
  if (Array.isArray(data.lifestyles)) {
    data.lifestyles = data.lifestyles.map((l: { lifestyle: string } | string) =>
      typeof l === 'string' ? l : l.lifestyle
    )
  }

  return <PropertyForm propertyId={params.id} initialData={data} />
}
