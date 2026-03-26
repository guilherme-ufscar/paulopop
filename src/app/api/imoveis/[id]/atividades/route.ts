import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bodySchema = z.object({
  type: z.enum([
    'PROPERTY_CREATED', 'PROPERTY_UPDATED', 'PROPERTY_PUBLISHED', 'PROPERTY_SOLD',
    'LEAD_RECEIVED', 'LEAD_CONTACTED', 'VISIT_SCHEDULED', 'VISIT_DONE',
    'DOCUMENT_ADDED', 'IMAGE_ADDED', 'ANALYSIS_GENERATED', 'NOTE_ADDED',
  ]),
  description: z.string().min(1).max(1000),
  metadata: z.record(z.unknown()).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.issues }, { status: 400 })
  }

  const { type, description, metadata } = parsed.data

  const activity = await prisma.activity.create({
    data: {
      propertyId: params.id,
      userId: (session.user as { id: string }).id,
      type,
      description,
      metadata: metadata ?? {},
    },
    include: {
      user: { select: { name: true } },
    },
  })

  return NextResponse.json(activity, { status: 201 })
}
