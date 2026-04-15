export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Pencil, Globe, FileText, Trash2 } from 'lucide-react'
import { BlogListClient } from './BlogListClient'

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string }
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const pageSize = 20
  const q = searchParams.q
  const status = searchParams.status

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

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F5E]">Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} post{total !== 1 ? 's' : ''} no total</p>
        </div>
        <Link
          href="/admin/blog/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D2F5E] text-white text-sm font-medium rounded-lg hover:bg-[#081E3F] transition-colors"
          aria-label="Criar novo post"
        >
          <Plus className="w-4 h-4" /> Novo Post
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por título ou categoria..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5E] bg-white"
          aria-label="Buscar posts"
        />
        <select
          name="status"
          defaultValue={status ?? ''}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D2F5E] text-gray-700"
          aria-label="Filtrar por status"
        >
          <option value="">Todos os status</option>
          <option value="DRAFT">Rascunho</option>
          <option value="PUBLISHED">Publicado</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-[#2E86DE] text-white text-sm font-medium rounded-lg hover:bg-[#1B6EC2] transition-colors"
        >
          Filtrar
        </button>
      </form>

      <BlogListClient
        posts={JSON.parse(JSON.stringify(posts))}
        total={total}
        page={page}
        totalPages={Math.ceil(total / pageSize)}
      />
    </div>
  )
}
