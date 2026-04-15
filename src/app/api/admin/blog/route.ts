export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base)
  let suffix = 0
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    suffix++
    slug = `${slugify(base)}-${suffix}`
  }
  return slug
}

// GET /api/admin/blog
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const pageSize = 20
  const q = searchParams.get('q')
  const status = searchParams.get('status')

  const where = {
    ...(q ? { OR: [
      { title: { contains: q, mode: 'insensitive' as const } },
      { category: { contains: q, mode: 'insensitive' as const } },
    ]} : {}),
    ...(status ? { status: status as 'DRAFT' | 'PUBLISHED' } : {}),
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, slug: true, title: true, excerpt: true, coverUrl: true,
        category: true, status: true, publishedAt: true, createdAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.blogPost.count({ where }),
  ])

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / pageSize) })
}

// POST /api/admin/blog
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json() as {
    title: string
    excerpt?: string
    content: string
    coverUrl?: string
    category?: string
    tags?: string[]
    status?: 'DRAFT' | 'PUBLISHED'
    slug?: string
  }

  if (!body.title || !body.content) {
    return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 })
  }

  const slug = body.slug ? await uniqueSlug(body.slug) : await uniqueSlug(body.title)
  const isPublished = body.status === 'PUBLISHED'

  // Buscar o id do usuário logado
  const user = await prisma.user.findUnique({ where: { email: session.user?.email ?? '' }, select: { id: true } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 400 })

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      coverUrl: body.coverUrl,
      category: body.category,
      tags: body.tags ?? [],
      status: body.status ?? 'DRAFT',
      authorId: user.id,
      publishedAt: isPublished ? new Date() : null,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
