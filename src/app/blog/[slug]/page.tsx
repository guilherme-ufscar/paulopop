export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Calendar, User, Tag, ArrowRight } from 'lucide-react'
import { BlogContent } from './BlogContent'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    select: { title: true, excerpt: true, coverUrl: true },
  })
  if (!post) return {}
  return {
    title: `${post.title} | Blog Paulo Pop`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverUrl ? [post.coverUrl] : [],
      type: 'article',
      locale: 'pt_BR',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: { author: { select: { name: true, avatarUrl: true, creci: true } } },
  })

  if (!post) notFound()

  // Posts relacionados (mesma categoria, excluindo este)
  const related = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: post.id },
      ...(post.category ? { category: post.category } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: { slug: true, title: true, coverUrl: true, category: true, publishedAt: true },
  })

  return (
    <>
      {/* Hero do post */}
      <section className="bg-[#0D2F5E] py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#8cc4ff] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
          </Link>

          {post.category && (
            <span className="inline-block px-3 py-1 bg-[#1A4A8A] text-[#8cc4ff] text-xs font-medium rounded-full mb-3">
              {post.category}
            </span>
          )}

          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-base text-slate-300 leading-7 max-w-2xl">{post.excerpt}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author.name}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Imagem de capa */}
      {post.coverUrl && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full max-h-[420px] object-cover rounded-b-2xl"
          />
        </div>
      )}

      {/* Conteúdo */}
      <div className="bg-[#f6f7fb] py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
            {/* Artigo */}
            <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <BlogContent content={post.content} />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 bg-[#E8F1FB] text-[#0D2F5E] text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Autor */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2E86DE] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[#0D2F5E]">{post.author.name}</p>
                  {post.author.creci && (
                    <p className="text-xs text-gray-400">CRECI {post.author.creci}</p>
                  )}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Imóveis */}
              <div className="bg-[#0D2F5E] rounded-2xl p-5 text-white">
                <h3 className="font-semibold mb-2">Procurando um imóvel?</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Veja os imóveis disponíveis e fale com Paulo Pop.
                </p>
                <Link
                  href="/imoveis"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#0D2F5E] rounded-xl text-sm font-semibold hover:bg-[#F7F9FC] transition-colors"
                >
                  Ver imóveis <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Posts relacionados */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-[#0D2F5E] mb-3">Posts relacionados</h3>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link
                        key={r.slug}
                        href={`/blog/${r.slug}`}
                        className="flex items-start gap-3 group"
                        aria-label={r.title}
                      >
                        <div className="w-14 h-12 rounded-lg bg-[#dbe7f3] overflow-hidden flex-shrink-0">
                          {r.coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.coverUrl} alt="" className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-[#0D2F5E] transition-colors">
                            {r.title}
                          </p>
                          {r.publishedAt && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(r.publishedAt).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
