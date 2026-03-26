import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, message, propertyId } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Nome e telefone obrigatórios' }, { status: 400 })
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
