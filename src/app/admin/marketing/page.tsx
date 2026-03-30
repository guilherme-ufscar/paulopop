export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { MarketingAdminClient } from './MarketingAdminClient'

export default async function AdminMarketingPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: {
      id: true,
      ref: true,
      title: true,
      propertyType: true,
      city: true,
      state: true,
    },
  })

  return <MarketingAdminClient properties={properties} />
}
