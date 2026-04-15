'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState } from 'react'
import { Pencil, Globe, FileText, Trash2, X, CheckCircle, AlertCircle, Loader2, Eye } from 'lucide-react'

interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string
  coverUrl?: string
  category?: string
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt?: string
  createdAt: string
  author: { name: string }
}

interface Props {
  posts: Post[]
  total: number
  page: number
  totalPages: number
}

export function BlogListClient({ posts, total, page, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setFeedback({ type: 'success', msg: 'Post excluído com sucesso.' })
      setDeleteId(null)
      startTransition(() => router.refresh())
    } catch {
      setFeedback({ type: 'error', msg: 'Erro ao excluir post.' })
    } finally {
      setDeleting(false)
    }
  }

  function buildPageHref(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    return `?${params.toString()}`
  }

  return (
    <>
      {feedback && (
        <div
          role="alert"
          aria-live="polite"
          className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedback.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {feedback.msg}
          <button onClick={() => setFeedback(null)} className="ml-auto" aria-label="Fechar"><X className="w-3 h-3" /></button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">Nenhum post encontrado.</p>
          <Link href="/admin/blog/novo" className="mt-3 inline-block text-sm text-[#2E86DE] hover:underline">
            Criar o primeiro post →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                {/* Capa */}
                <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 hidden sm:block">
                  {post.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {post.status === 'PUBLISHED'
                            ? <><Globe className="w-3 h-3" /> Publicado</>
                            : <><FileText className="w-3 h-3" /> Rascunho</>}
                        </span>
                        {post.category && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                      {post.excerpt && (
                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Por {post.author.name} ·{' '}
                        {post.publishedAt
                          ? `Publicado em ${new Date(post.publishedAt).toLocaleDateString('pt-BR')}`
                          : `Criado em ${new Date(post.createdAt).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {post.status === 'PUBLISHED' && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#2E86DE]"
                          aria-label="Ver post no site"
                          title="Ver no site"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#0D2F5E]"
                        aria-label={`Editar post: ${post.title}`}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
                        aria-label={`Excluir post: ${post.title}`}
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">{total} posts no total</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={buildPageHref(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-[#0D2F5E] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2E86DE] hover:text-[#0D2F5E]'
                }`}
                aria-label={`Página ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir post</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-60"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
