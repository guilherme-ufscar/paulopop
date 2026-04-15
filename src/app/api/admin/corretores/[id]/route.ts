export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// PUT /api/admin/corretores/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json() as Record<string, string | boolean>

  const data: Record<string, unknown> = {}

  if (body.name) data.name = body.name
  if (body.email) data.email = body.email
  if (body.password) data.password = await bcrypt.hash(body.password as string, 12)
  if (body.role !== undefined) data.role = body.role
  if (body.active !== undefined) data.active = body.active
  if (body.phone !== undefined) data.phone = body.phone
  if (body.whatsapp !== undefined) data.whatsapp = body.whatsapp
  if (body.creci !== undefined) data.creci = body.creci
  if (body.company !== undefined) data.company = body.company
  if (body.companyCreci !== undefined) data.companyCreci = body.companyCreci
  if (body.bio !== undefined) data.bio = body.bio
  if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl
  if (body.instagram !== undefined) data.instagram = body.instagram
  if (body.facebook !== undefined) data.facebook = body.facebook
  if (body.linkedin !== undefined) data.linkedin = body.linkedin
  if (body.youtube !== undefined) data.youtube = body.youtube

  const updated = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true },
  })

  return NextResponse.json(updated)
}

// DELETE /api/admin/corretores/[id] — desativa (soft delete)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await prisma.user.update({
    where: { id: params.id },
    data: { active: false },
  })

  return NextResponse.json({ success: true })
}
