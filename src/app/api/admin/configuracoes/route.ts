export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripHtml, limitString } from '@/lib/sanitize'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const config = await prisma.siteConfig.findFirst()
  return NextResponse.json(config ?? {})
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json() as Record<string, string | boolean>

  // Sanitizar e limitar todos os campos de texto
  const safe = (v: unknown, max = 500) =>
    typeof v === 'string' ? limitString(stripHtml(v), max) : undefined

  const data = {
    ownerName: safe(body.ownerName, 150),
    ownerCreci: safe(body.ownerCreci, 50),
    ownerBio: safe(body.ownerBio, 2000),
    ownerCompany: safe(body.ownerCompany, 200),
    ownerCompanyCreci: safe(body.ownerCompanyCreci, 50),
    ownerPhotoUrl: safe(body.ownerPhotoUrl, 500),
    ownerPhone: safe(body.ownerPhone, 30),
    ownerWhatsapp: safe(body.ownerWhatsapp, 30),
    ownerEmail: safe(body.ownerEmail, 200),
    ownerAddress: safe(body.ownerAddress, 300),
    ownerInstagram: safe(body.ownerInstagram, 300),
    ownerFacebook: safe(body.ownerFacebook, 300),
    ownerLinkedin: safe(body.ownerLinkedin, 300),
    ownerYoutube: safe(body.ownerYoutube, 300),
    ownerTelegram: safe(body.ownerTelegram, 300),
    ownerTwitter: safe(body.ownerTwitter, 300),
    heroTitle: safe(body.heroTitle, 200),
    heroSubtitle: safe(body.heroSubtitle, 300),
    heroBgUrl: safe(body.heroBgUrl, 500),
    logoUrl: safe(body.logoUrl, 500),
    ogImageUrl: safe(body.ogImageUrl, 500),
    whatsappMessage: safe(body.whatsappMessage, 500),
    metaTitle: safe(body.metaTitle, 200),
    metaDescription: safe(body.metaDescription, 500),
    footerText: safe(body.footerText, 500),
    showDestaques:   typeof body.showDestaques   === 'boolean' ? body.showDestaques   : undefined,
    showCompra:      typeof body.showCompra      === 'boolean' ? body.showCompra      : undefined,
    showLocacao:     typeof body.showLocacao     === 'boolean' ? body.showLocacao     : undefined,
    showApartamentos:typeof body.showApartamentos=== 'boolean' ? body.showApartamentos: undefined,
    showCasas:       typeof body.showCasas       === 'boolean' ? body.showCasas       : undefined,
    showTerrenos:    typeof body.showTerrenos    === 'boolean' ? body.showTerrenos    : undefined,
  }

  // Remover campos undefined para não sobrescrever com null
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  )

  const existing = await prisma.siteConfig.findFirst()
  if (existing) {
    await prisma.siteConfig.update({ where: { id: existing.id }, data: cleanData })
  } else {
    await prisma.siteConfig.create({ data: cleanData as Parameters<typeof prisma.siteConfig.create>[0]['data'] })
  }

  return NextResponse.json({ success: true })
}
