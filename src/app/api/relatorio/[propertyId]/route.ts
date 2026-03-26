import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReportToOwner } from '@/lib/email'

/** GET — renderiza a página do relatório (valida senha) */
export async function GET(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const password = req.nextUrl.searchParams.get('senha')
  if (!password || password.length !== 5) {
    return NextResponse.json({ error: 'Senha inválida' }, { status: 401 })
  }

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    include: {
      images: { where: { isCover: true }, take: 1 },
      features: true,
      marketAnalyses: {
        where: { status: 'COMPLETED' },
        orderBy: { generatedAt: 'desc' },
        take: 1,
      },
      agent: { select: { name: true, creci: true, company: true, phone: true, email: true } },
    },
  })

  if (!property) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })

  // Retorna dados para o frontend renderizar o PDF
  return NextResponse.json({
    property: {
      ...property,
      price: property.price ? Number(property.price) : null,
      totalArea: property.totalArea ? Number(property.totalArea) : null,
      usefulArea: property.usefulArea ? Number(property.usefulArea) : null,
      condominiumFee: property.condominiumFee ? Number(property.condominiumFee) : null,
      iptu: property.iptu ? Number(property.iptu) : null,
    },
  })
}

/** POST — envia relatório por e-mail ao proprietário */
export async function POST(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const body = await req.json()
  const { ownerEmail, ownerName, password } = body

  if (!ownerEmail || !password) {
    return NextResponse.json({ error: 'E-mail e senha obrigatórios' }, { status: 400 })
  }

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    select: { title: true },
  })

  if (!property) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const reportUrl = `${siteUrl}/relatorio/${params.propertyId}?senha=${password}`

  await sendReportToOwner({
    ownerEmail,
    ownerName: ownerName ?? 'Proprietário',
    propertyTitle: property.title ?? 'Imóvel',
    reportUrl,
    password,
  })

  return NextResponse.json({ ok: true })
}
