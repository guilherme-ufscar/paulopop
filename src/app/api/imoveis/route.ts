import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateRef, slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const status = searchParams.get('status')
  const transactionType = searchParams.get('transactionType')
  const purpose = searchParams.get('purpose')
  const city = searchParams.get('city')
  const admin = searchParams.get('admin') === 'true'

  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (!admin) {
    where.status = 'ACTIVE'
    where.hideOnSite = false
  } else if (status) {
    where.status = status
  }
  if (transactionType) where.transactionType = transactionType
  if (purpose) where.purpose = purpose
  if (city) where.city = { contains: city, mode: 'insensitive' }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isCover: true }, take: 1 },
        agent: { select: { name: true, phone: true, whatsapp: true } },
      },
    }),
    prisma.property.count({ where }),
  ])

  return NextResponse.json({ properties, total, page, limit, pages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const { propertyType, purpose, transactionType, location } = body

  if (!propertyType) return NextResponse.json({ error: 'Tipo de imóvel obrigatório' }, { status: 400 })

  const ref = generateRef()
  const baseSlug = slugify(`${propertyType}-${purpose === 'RESIDENTIAL' ? 'residencial' : 'comercial'}-${ref}`)

  const property = await prisma.property.create({
    data: {
      ref,
      slug: baseSlug,
      propertyType,
      purpose: purpose ?? 'RESIDENTIAL',
      transactionType: transactionType ?? 'SALE',
      location: location ?? 'BRAZIL',
      agentId: session.user.id,
      status: 'DRAFT',
    },
  })

  return NextResponse.json(property, { status: 201 })
}
