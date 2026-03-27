import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendLeadNotificationToAgent, sendLeadConfirmationToContact } from '@/lib/email'
import { checkRateLimit } from '@/lib/rateLimit'
import { stripHtml, limitString } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  // Rate limiting: máx 5 envios por IP por hora (5.4)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  if (!checkRateLimit(`leads:${ip}`, 5, 3600_000)) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente mais tarde.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { name, email, phone, message, propertyId } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Nome e telefone obrigatórios' }, { status: 400 })
  }

  // Validação de tamanho e sanitização dos campos (5.4)
  if (typeof name !== 'string' || typeof phone !== 'string') {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
  if (name.length > 150 || phone.length > 30 || (email && email.length > 200) || (message && message.length > 2000)) {
    return NextResponse.json({ error: 'Dados excedem o tamanho permitido' }, { status: 400 })
  }

  // Buscar dados do imóvel se informado
  let propertyTitle: string | null = null
  let propertyRef: string | null = null
  if (propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { title: true, ref: true },
    })
    propertyTitle = property?.title ?? null
    propertyRef = property?.ref ?? null
  }

  const lead = await prisma.lead.create({
    data: {
      name: limitString(stripHtml(name), 150),
      email: email ? limitString(stripHtml(email), 200) : null,
      phone: limitString(stripHtml(phone), 30),
      message: message ? limitString(stripHtml(message), 2000) : null,
      propertyId: propertyId ?? null,
      source: 'SITE',
      status: 'NEW',
    },
  })

  // Disparar e-mails em background (não bloqueia a resposta)
  void sendLeadNotificationToAgent({ name, email, phone, message, propertyTitle, propertyRef })
  if (email) {
    void sendLeadConfirmationToContact({ name, email, propertyTitle })
  }

  return NextResponse.json(lead, { status: 201 })
}

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      property: { select: { id: true, title: true, ref: true } },
    },
  })
  return NextResponse.json(leads)
}
