export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowRight, Calendar, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Paulo Pop',
  description: 'Artigos, dicas e novidades do mercado imobiliário por Paulo Pop.',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { categoria?: string; page?: string }
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const pageSize = 9
  const categoria = searchParams.categoria

  const where = {
    status: 'PUBLISHED' as const,
    ...(categoria ? { category: { equals: categoria, mode: 'insensitive' as const } } : {}),
  }

  const [posts, total, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, slug: true, title: true, excerpt: true, coverUrl: true,
        category: true, tags: true, publishedAt: true,
        author: { select: { name: true, avatarUrl: true } },
      },
    }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED', category: { not: null } },
      distinct: ['category'],
      select: { category: true },
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)
  const catList = categories.map(c => c.category).filter(Boolean) as string[]

  return (
    <>
      {/* Hero do blog */}
      <section className="bg-[#0D2F5E] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8cc4ff]">Blog</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Mercado Imobiliário
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
            Artigos, dicas e análises para quem quer comprar, vender ou alugar com mais segurança.
          </p>
        </div>
      </section>

      <div className="bg-[#f6f7fb] min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Posts */}
            <div className="flex-1">
              {total === 0 ? (
                <div className="rounded-2xl bg-white border border-dashed border-gray-200 p-16 text-center">
                  <p className="text-gray-400">Nenhum post publicado ainda.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {posts.map(post => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2E86DE]/30 transition-all"
                        aria-label={`Ler post: ${post.title}`}
                      >
                        {/* Capa */}
                        <div className="aspect-[16/9] bg-[#dbe7f3] overflow-hidden">
                          {post.coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.coverUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-display text-4xl font-bold text-[#0D2F5E]/20">PP</span>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          {post.category && (
                            <span className="inline-block px-2.5 py-0.5 bg-[#E8F1FB] text-[#0D2F5E] text-xs font-medium rounded-full mb-2">
                              {post.category}
                            </span>
                          )}
                          <h2 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#0D2F5E] transition-colors">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
                          )}
                          <div className="mt-4 flex items-center justify-between">
                            <p className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                                : ''}
                            </p>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2E86DE] group-hover:gap-2 transition-all">
                              Ler <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <Link
                          key={p}
                          href={`/blog?${categoria ? `categoria=${encodeURIComponent(categoria)}&` : ''}page=${p}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                            p === page
                              ? 'bg-[#0D2F5E] text-white'
                              : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2E86DE]'
                          }`}
                          aria-label={`Página ${p}`}
                          aria-current={p === page ? 'page' : undefined}
                        >
                          {p}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-64 space-y-6">
              {/* Categorias */}
              {catList.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-[#0D2F5E] mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Categorias
                  </h3>
                  <div className="space-y-1">
                    <Link
                      href="/blog"
                      className={`block text-sm px-3 py-2 rounded-xl transition-colors ${
                        !categoria ? 'bg-[#0D2F5E] text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Todos os posts
                    </Link>
                    {catList.map(cat => (
                      <Link
                        key={cat}
                        href={`/blog?categoria=${encodeURIComponent(cat)}`}
                        className={`block text-sm px-3 py-2 rounded-xl transition-colors ${
                          categoria === cat ? 'bg-[#0D2F5E] text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA de contato */}
              <div className="bg-[#0D2F5E] rounded-2xl p-5 text-white">
                <h3 className="font-semibold mb-2">Ficou com dúvidas?</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Fale diretamente com Paulo Pop sobre o imóvel que você procura.
                </p>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#0D2F5E] rounded-xl text-sm font-semibold hover:bg-[#F7F9FC] transition-colors"
                >
                  Entrar em contato <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
