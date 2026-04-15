'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save, Globe, FileText, Upload, X, Loader2, Tag,
  CheckCircle, AlertCircle, Image as ImageIcon, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface BlogPostData {
  id?: string
  title: string
  excerpt: string
  content: string
  coverUrl: string
  category: string
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED'
}

const EMPTY: BlogPostData = {
  title: '', excerpt: '', content: '', coverUrl: '',
  category: '', tags: [], status: 'DRAFT',
}

export function BlogPostEditor({ initial }: { initial?: Partial<BlogPostData> & { id?: string } }) {
  const router = useRouter()
  const [form, setForm] = useState<BlogPostData>({ ...EMPTY, ...initial })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const [uploadingCover, setUploadingCover] = useState(false)

  const isEdit = !!initial?.id

  function set<K extends keyof BlogPostData>(field: K, value: BlogPostData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function uploadCover(file: File) {
    setUploadingCover(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json() as { url: string }
      set('coverUrl', url)
    } catch {
      setFeedback({ type: 'error', msg: 'Falha no upload da imagem de capa.' })
    } finally {
      setUploadingCover(false)
    }
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      set('tags', [...form.tags, t])
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    set('tags', form.tags.filter(t => t !== tag))
  }

  async function handleSave(statusOverride?: 'DRAFT' | 'PUBLISHED') {
    setSaving(true)
    setFeedback(null)
    const payload = { ...form, status: statusOverride ?? form.status }
    try {
      const url = isEdit ? `/api/admin/blog/${initial!.id}` : '/api/admin/blog'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? 'Erro ao salvar')
      }
      const saved = await res.json() as { id: string; slug: string }
      setFeedback({
        type: 'success',
        msg: payload.status === 'PUBLISHED' ? 'Post publicado com sucesso!' : 'Rascunho salvo!',
      })
      if (!isEdit) {
        setTimeout(() => router.push(`/admin/blog/${saved.id}`), 800)
      }
    } catch (e) {
      setFeedback({ type: 'error', msg: e instanceof Error ? e.message : 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/blog"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#0D2F5E] transition-colors"
          aria-label="Voltar para lista de posts"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#0D2F5E]">
            {isEdit ? 'Editar Post' : 'Novo Post'}
          </h1>
          <p className="text-sm text-gray-500">
            {form.status === 'PUBLISHED' ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <Globe className="w-3 h-3" /> Publicado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600">
                <FileText className="w-3 h-3" /> Rascunho
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('DRAFT')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors"
            aria-label="Salvar como rascunho"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Rascunho
          </button>
          <button
            onClick={() => handleSave('PUBLISHED')}
            disabled={saving || !form.title || !form.content}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D2F5E] text-white rounded-xl text-sm font-medium hover:bg-[#081E3F] disabled:opacity-60 transition-colors"
            aria-label="Publicar post"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Publicar
          </button>
        </div>
      </div>

      {/* Feedback */}
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
          <button onClick={() => setFeedback(null)} className="ml-auto" aria-label="Fechar alerta">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Coluna principal */}
        <div className="space-y-5">
          {/* Título */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-title" className="block text-sm font-medium text-gray-700 mb-2">
              Título do Post *
            </label>
            <input
              id="blog-title"
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Digite o título do post..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
              aria-required="true"
            />
          </div>

          {/* Resumo */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Resumo / Descrição
              <span className="ml-1 text-xs text-gray-400">(exibido nos cards e no SEO)</span>
            </label>
            <textarea
              id="blog-excerpt"
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Breve resumo do post (máx. 300 caracteres)..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE] resize-none"
              aria-label="Resumo do post"
            />
            <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/300</p>
          </div>

          {/* Conteúdo */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-content" className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
              <span className="ml-1 text-xs text-gray-400">(suporta formatação Markdown)</span>
            </label>
            <div className="mb-2 flex flex-wrap gap-1 text-xs text-gray-400">
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">**negrito**</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">*itálico*</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono"># Título</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">## Subtítulo</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">- item</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">[link](url)</span>
            </div>
            <textarea
              id="blog-content"
              value={form.content}
              onChange={e => set('content', e.target.value)}
              rows={20}
              placeholder="Escreva o conteúdo do post em Markdown..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E86DE] resize-y"
              aria-required="true"
            />
            <p className="text-xs text-gray-400 mt-1">{form.content.length} caracteres</p>
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-5">
          {/* Imagem de capa */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Imagem de Capa
            </h3>
            {form.coverUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverUrl} alt="Capa do post" className="w-full h-40 object-cover rounded-xl" />
                <button
                  onClick={() => set('coverUrl', '')}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  aria-label="Remover imagem de capa"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                disabled={uploadingCover}
                className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#2E86DE] hover:text-[#2E86DE] transition-colors disabled:opacity-60"
                aria-label="Selecionar imagem de capa"
              >
                {uploadingCover
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <Upload className="w-5 h-5" />}
                <span className="text-xs">{uploadingCover ? 'Enviando...' : 'Clique para selecionar'}</span>
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-hidden="true"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f) }}
            />
          </div>

          {/* Categoria */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Categoria</h3>
            <input
              type="text"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              placeholder="ex: Mercado Imobiliário"
              list="blog-categories"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
              aria-label="Categoria do post"
            />
            <datalist id="blog-categories">
              <option value="Mercado Imobiliário" />
              <option value="Dicas de Compra" />
              <option value="Dicas de Locação" />
              <option value="Financiamento" />
              <option value="Decoração" />
              <option value="Investimento" />
              <option value="Notícias" />
            </datalist>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Tags
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Adicionar tag..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
                aria-label="Nova tag"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                aria-label="Adicionar tag"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E8F1FB] text-[#0D2F5E] text-xs rounded-full">
                  {tag}
                  <button onClick={() => removeTag(tag)} aria-label={`Remover tag ${tag}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {form.tags.length === 0 && <p className="text-xs text-gray-400">Nenhuma tag</p>}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
            <div className="space-y-2">
              {[
                { value: 'DRAFT', label: 'Rascunho', desc: 'Apenas visível no admin' },
                { value: 'PUBLISHED', label: 'Publicado', desc: 'Visível no site público' },
              ].map(opt => (
                <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="post-status"
                    value={opt.value}
                    checked={form.status === opt.value}
                    onChange={() => set('status', opt.value as 'DRAFT' | 'PUBLISHED')}
                    className="mt-0.5 accent-[#2E86DE]"
                    aria-label={opt.label}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Link do post publicado */}
          {initial?.id && form.status === 'PUBLISHED' && (
            <a
              href={`/blog/${initial.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-2.5 border border-[#0D2F5E] text-[#0D2F5E] rounded-xl text-sm font-medium hover:bg-[#0D2F5E] hover:text-white transition-colors"
              aria-label="Ver post no site"
            >
              <Globe className="w-4 h-4" /> Ver no site
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
