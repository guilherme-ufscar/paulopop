export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EmpreendimentoEditor } from '@/components/admin/EmpreendimentoEditor'

export default async function EditarEmpreendimentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.empreendimento.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      floorPlanImages: { orderBy: { order: 'asc' } },
    },
  })
  if (!item) notFound()

  return (
    <EmpreendimentoEditor
      initial={{
        id: item.id,
        name: item.name,
        tagline: item.tagline ?? '',
        description: item.description ?? '',
        status: item.status as 'DRAFT' | 'PUBLISHED',
        address: item.address ?? '',
        neighborhood: item.neighborhood ?? '',
        city: item.city ?? '',
        state: item.state ?? '',
        architect: item.architect ?? '',
        deliveryDate: item.deliveryDate ?? '',
        totalUnits: item.totalUnits?.toString() ?? '',
        floors: item.floors?.toString() ?? '',
        bedroomsMin: item.bedroomsMin?.toString() ?? '',
        bedroomsMax: item.bedroomsMax?.toString() ?? '',
        areaMin: item.areaMin?.toString() ?? '',
        areaMax: item.areaMax?.toString() ?? '',
        priceMin: item.priceMin?.toString() ?? '',
        priceMax: item.priceMax?.toString() ?? '',
        financing: item.financing ?? '',
        coverUrl: item.coverUrl ?? '',
        logoUrl: item.logoUrl ?? '',
        amenities: item.amenities ?? '',
        highlights: item.highlights ?? '',
        ctaLabel: item.ctaLabel ?? '',
        ctaWhatsapp: item.ctaWhatsapp ?? '',
        images: item.images.map(i => ({ id: i.id, url: i.url, caption: i.caption })),
        floorPlanImages: item.floorPlanImages.map(i => ({ id: i.id, url: i.url, caption: i.caption })),
      }}
    />
  )
}
