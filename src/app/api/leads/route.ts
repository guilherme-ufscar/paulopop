import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendLeadNotificationToAgent, sendLeadConfirmationToContact } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, message, propertyId } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Nome e telefone obrigatórios' }, { status: 400 })
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
      name,
      email: email ?? null,
      phone,
      message: message ?? null,
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
