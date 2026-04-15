export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/blog/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    include: { author: { select: { name: true, email: true } } },
  })
  if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })

  return NextResponse.json(post)
}

// PUT /api/admin/blog/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json() as Record<string, unknown>
  const data: Record<string, unknown> = {}

  if (body.title !== undefined) data.title = body.title
  if (body.excerpt !== undefined) data.excerpt = body.excerpt
  if (body.content !== undefined) data.content = body.content
  if (body.coverUrl !== undefined) data.coverUrl = body.coverUrl
  if (body.category !== undefined) data.category = body.category
  if (body.tags !== undefined) data.tags = body.tags

  if (body.status !== undefined) {
    data.status = body.status
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id }, select: { publishedAt: true, status: true } })
    // Setar publishedAt na primeira publicação
    if (body.status === 'PUBLISHED' && existing?.status !== 'PUBLISHED') {
      data.publishedAt = new Date()
    }
    if (body.status === 'DRAFT') {
      data.publishedAt = null
    }
  }

  const updated = await prisma.blogPost.update({ where: { id: params.id }, data })
  return NextResponse.json(updated)
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await prisma.blogPost.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
