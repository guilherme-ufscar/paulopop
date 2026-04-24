export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

// POST — adiciona imagem ou planta
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const body = await req.json() as { url: string; caption?: string; type?: 'gallery' | 'floorplan' }

  if (body.type === 'floorplan') {
    const count = await prisma.empreendimentoFloorPlan.count({ where: { empreendimentoId: id } })
    const img = await prisma.empreendimentoFloorPlan.create({
      data: { empreendimentoId: id, url: body.url, caption: body.caption ?? null, order: count },
    })
    return NextResponse.json(img, { status: 201 })
  }

  const count = await prisma.empreendimentoImage.count({ where: { empreendimentoId: id } })
  const img = await prisma.empreendimentoImage.create({
    data: { empreendimentoId: id, url: body.url, caption: body.caption ?? null, order: count },
  })
  return NextResponse.json(img, { status: 201 })
}

// DELETE — remove imagem pelo imageId no body
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await params
  const body = await req.json() as { imageId: string; type?: 'gallery' | 'floorplan' }

  if (body.type === 'floorplan') {
    await prisma.empreendimentoFloorPlan.delete({ where: { id: body.imageId } })
  } else {
    await prisma.empreendimentoImage.delete({ where: { id: body.imageId } })
  }
  return NextResponse.json({ success: true })
}
