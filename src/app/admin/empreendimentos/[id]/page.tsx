'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Building2, ImagePlus, Trash2, Save, Eye, ArrowLeft,
  Plus, X
} from 'lucide-react'

type ImageCategory = 'FACHADA' | 'AREAS_COMUNS' | 'TIPOLOGIA' | 'LAZER' | 'LOCALIZACAO'

interface EmpImage {
  id?: string
  url: string
  thumbnailUrl?: string
  alt?: string
  caption?: string
  order: number
  category: ImageCategory
}

interface Property {
  id: string
  slug: string
  title?: string
  propertyType?: string
  transactionType: string
  price?: number
  totalArea?: number
  bedrooms?: number
  city?: string
  state?: string
  images: { url: string; thumbnailUrl?: string }[]
}

interface FormData {
  name: string
  subtitle: string
  description: string
  status: string
  tipologiasDescription: string
  lazerDescription: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  latitude: string
  longitude: string
  locationDescription: string
  priceFrom: string
  priceTo: string
  paymentInfo: string
  banks: string
  totalUnits: string
  deliveryDate: string
}

const TABS = [
  { id: 'geral', label: 'Geral' },
  { id: 'tipologias', label: 'Apartamentos' },
  { id: 'lazer', label: 'Área de Lazer' },
  { id: 'localizacao', label: 'Localização' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'imoveis', label: 'Imóveis Vinculados' },
]

const STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export default function EmpreendimentoEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [tab, setTab] = useState('geral')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<EmpImage[]>([])
  const [linkedProperties, setLinkedProperties] = useState<Property[]>([])
  const [uploadingCategory, setUploadingCategory] = useState<ImageCategory | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentUploadCategory = useRef<ImageCategory>('FACHADA')

  const [form, setForm] = useState<FormData>({
    name: '', subtitle: '', description: '', status: 'DRAFT',
    tipologiasDescription: '', lazerDescription: '',
    address: '', neighborhood: '', city: '', state: '', zipCode: '',
    latitude: '', longitude: '', locationDescription: '',
    priceFrom: '', priceTo: '', paymentInfo: '', banks: '',
    totalUnits: '', deliveryDate: '',
  })

  useEffect(() => {
    fetch(`/api/empreendimentos/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name ?? '',
          subtitle: data.subtitle ?? '',
          description: data.description ?? '',
          status: data.status ?? 'DRAFT',
          tipologiasDescription: data.tipologiasDescription ?? '',
          lazerDescription: data.lazerDescription ?? '',
          address: data.address ?? '',
          neighborhood: data.neighborhood ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          zipCode: data.zipCode ?? '',
          latitude: data.latitude ? String(data.latitude) : '',
          longitude: data.longitude ? String(data.longitude) : '',
          locationDescription: data.locationDescription ?? '',
          priceFrom: data.priceFrom ? String(data.priceFrom) : '',
          priceTo: data.priceTo ? String(data.priceTo) : '',
          paymentInfo: data.paymentInfo ?? '',
          banks: data.banks ?? '',
          totalUnits: data.totalUnits ? String(data.totalUnits) : '',
          deliveryDate: data.deliveryDate ?? '',
        })
        setImages(data.images ?? [])
        setLinkedProperties(data.properties ?? [])
      })
      .finally(() => setLoading(false))
  }, [id])

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/empreendimentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Erro ao salvar')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este empreendimento? Esta ação não pode ser desfeita.')) return
    await fetch(`/api/empreendimentos/${id}`, { method: 'DELETE' })
    router.push('/admin/empreendimentos')
  }

  async function uploadImage(file: File, category: ImageCategory): Promise<EmpImage | null> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) return null
    const data = await res.json()
    return {
      url: data.url,
      thumbnailUrl: data.thumbnailUrl ?? data.url,
      order: images.filter(i => i.category === category).length,
      category,
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const category = currentUploadCategory.current
    setUploadingCategory(category)
    Promise.all(files.map(f => uploadImage(f, category)))
      .then(results => {
        const valid = results.filter(Boolean) as EmpImage[]
        setImages(prev => [...prev, ...valid])
      })
      .finally(() => {
        setUploadingCategory(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      })
  }

  function triggerUpload(category: ImageCategory) {
    currentUploadCategory.current = category
    fileInputRef.current?.click()
  }

  function removeImage(url: string) {
    setImages(prev => prev.filter(i => i.url !== url))
  }

  function imagesOf(category: ImageCategory) {
    return images.filter(i => i.category === category)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#2E86DE] border-t-transparent" />
      </div>
    )
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v)

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/empreendimentos')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0D2F5E]">{form.name || 'Empreendimento'}</h1>
            <p className="text-xs text-gray-400">Editar empreendimento</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {form.status === 'ACTIVE' && (
            <a href={`/empreendimentos/${id}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              Ver no site
            </a>
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0D2F5E] text-white text-sm font-medium rounded-lg hover:bg-[#081E3F] disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {/* Input de arquivo oculto */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-white text-[#0D2F5E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ABA GERAL ── */}
      {tab === 'geral' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Identificação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do empreendimento *</label>
                <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Ex: Residencial Parque das Flores" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <input value={form.subtitle} onChange={set('subtitle')} className={inputCls} placeholder="Ex: Seu novo lar em harmonia com a natureza" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total de unidades</label>
                <input type="number" value={form.totalUnits} onChange={set('totalUnits')} className={inputCls} placeholder="Ex: 132" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de entrega</label>
                <input value={form.deliveryDate} onChange={set('deliveryDate')} className={inputCls} placeholder="Ex: Dezembro/2026" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={set('status')} className={inputCls}>
                  <option value="DRAFT">Rascunho</option>
                  <option value="ACTIVE">Ativo (visível no site)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Sobre o empreendimento</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição geral</label>
              <textarea value={form.description} onChange={set('description')} rows={6} className={inputCls}
                placeholder="Fale sobre o empreendimento, sua proposta, diferencias..." />
            </div>
          </div>

          <ImageSection
            title="Fachada e Áreas Comuns — Imagens"
            description="Fotos da fachada e áreas comuns do empreendimento"
            images={imagesOf('FACHADA')}
            category="FACHADA"
            onUpload={triggerUpload}
            onRemove={removeImage}
            uploading={uploadingCategory === 'FACHADA'}
          />
          <ImageSection
            title="Fotos das Áreas Comuns"
            description="Hall, portaria, piscina, etc."
            images={imagesOf('AREAS_COMUNS')}
            category="AREAS_COMUNS"
            onUpload={triggerUpload}
            onRemove={removeImage}
            uploading={uploadingCategory === 'AREAS_COMUNS'}
          />
        </div>
      )}

      {/* ── ABA TIPOLOGIAS ── */}
      {tab === 'tipologias' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Apartamentos e Tipologias</h2>
            <p className="text-sm text-gray-500">Descreva os tipos de apartamentos, torres, metragens e diferenciais.</p>
            <textarea value={form.tipologiasDescription} onChange={set('tipologiasDescription')} rows={8} className={inputCls}
              placeholder="Ex: O empreendimento conta com apartamentos de 2 e 3 dormitórios, suíte, varanda gourmet...&#10;&#10;Torre A — Tipo 1: 68m², 2 dorms, 1 suíte&#10;Torre B — Tipo 2: 87m², 3 dorms, 2 suítes" />
          </div>
          <ImageSection
            title="Imagens das Plantas"
            description="Plantas baixas e imagens das tipologias"
            images={imagesOf('TIPOLOGIA')}
            category="TIPOLOGIA"
            onUpload={triggerUpload}
            onRemove={removeImage}
            uploading={uploadingCategory === 'TIPOLOGIA'}
          />
        </div>
      )}

      {/* ── ABA LAZER ── */}
      {tab === 'lazer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Área de Lazer</h2>
            <p className="text-sm text-gray-500">Descreva tudo o que o empreendimento oferece de lazer e infraestrutura.</p>
            <textarea value={form.lazerDescription} onChange={set('lazerDescription')} rows={8} className={inputCls}
              placeholder="Ex: Piscina adulto e infantil, academia equipada, salão de festas com capacidade para 80 pessoas, playground, churrasqueiras, espaço pet, coworking..." />
          </div>
          <ImageSection
            title="Fotos da Área de Lazer"
            description="Piscina, academia, salão de festas, playground..."
            images={imagesOf('LAZER')}
            category="LAZER"
            onUpload={triggerUpload}
            onRemove={removeImage}
            uploading={uploadingCategory === 'LAZER'}
          />
        </div>
      )}

      {/* ── ABA LOCALIZAÇÃO ── */}
      {tab === 'localizacao' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input value={form.address} onChange={set('address')} className={inputCls} placeholder="Rua, Av., número..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input value={form.neighborhood} onChange={set('neighborhood')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input value={form.zipCode} onChange={set('zipCode')} className={inputCls} placeholder="00000-000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input value={form.city} onChange={set('city')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.state} onChange={set('state')} className={inputCls}>
                  <option value="">Selecione</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input value={form.latitude} onChange={set('latitude')} className={inputCls} placeholder="-23.5505" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input value={form.longitude} onChange={set('longitude')} className={inputCls} placeholder="-46.6333" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Vizinhança e Entorno</h2>
            <p className="text-sm text-gray-500">
              Descreva o que há próximo ao empreendimento: supermercados, metrô, escolas, comércio, distâncias...
            </p>
            <textarea value={form.locationDescription} onChange={set('locationDescription')} rows={7} className={inputCls}
              placeholder="Ex: A 300m do Supermercado Extra, a 500m da estação de metrô Consolação, próximo ao Parque Augusta..." />
          </div>

          <ImageSection
            title="Fotos da Região"
            description="Supermercado, metrô, parques, comércio próximos..."
            images={imagesOf('LOCALIZACAO')}
            category="LOCALIZACAO"
            onUpload={triggerUpload}
            onRemove={removeImage}
            uploading={uploadingCategory === 'LOCALIZACAO'}
          />
        </div>
      )}

      {/* ── ABA FINANCEIRO ── */}
      {tab === 'financeiro' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Preços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço a partir de (R$)</label>
                <input type="number" value={form.priceFrom} onChange={set('priceFrom')} className={inputCls} placeholder="Ex: 350000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço até (R$)</label>
                <input type="number" value={form.priceTo} onChange={set('priceTo')} className={inputCls} placeholder="Ex: 680000" />
              </div>
            </div>
            {(form.priceFrom || form.priceTo) && (
              <p className="text-sm text-[#2E86DE] font-medium">
                {form.priceFrom && form.priceTo
                  ? `${formatCurrency(Number(form.priceFrom))} a ${formatCurrency(Number(form.priceTo))}`
                  : form.priceFrom
                    ? `A partir de ${formatCurrency(Number(form.priceFrom))}`
                    : `Até ${formatCurrency(Number(form.priceTo))}`}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h2 className="font-semibold text-[#0D2F5E]">Formas de Pagamento</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Informações de pagamento</label>
              <textarea value={form.paymentInfo} onChange={set('paymentInfo')} rows={5} className={inputCls}
                placeholder="Ex: Entrada de 20% + 80% financiado. Parcelas na planta a partir de R$ 1.200/mês..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bancos financiadores</label>
              <textarea value={form.banks} onChange={set('banks')} rows={3} className={inputCls}
                placeholder="Ex: Caixa Econômica Federal, Banco do Brasil, Bradesco, Itaú, Santander" />
            </div>
          </div>
        </div>
      )}

      {/* ── ABA IMÓVEIS VINCULADOS ── */}
      {tab === 'imoveis' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="font-semibold text-[#0D2F5E] mb-1">Imóveis vinculados a este empreendimento</h2>
            <p className="text-sm text-gray-500 mb-4">
              Para vincular um imóvel, vá até o cadastro do imóvel e selecione este empreendimento no campo &quot;Empreendimento&quot;.
            </p>

            {linkedProperties.length === 0 ? (
              <div className="py-12 text-center">
                <Building2 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">Nenhum imóvel vinculado ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedProperties.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-14 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].thumbnailUrl ?? p.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 m-auto mt-3 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {p.title ?? `${p.propertyType ?? 'Imóvel'} — ${p.city}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.transactionType === 'SALE' ? 'Venda' : 'Aluguel'}
                        {p.price ? ` · ${formatCurrency(Number(p.price))}` : ''}
                        {p.city ? ` · ${p.city}` : ''}
                      </p>
                    </div>
                    <a href={`/admin/imoveis/${p.id}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#2E86DE] hover:underline flex-shrink-0">
                      Editar
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botão salvar fixo no rodapé */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-10">
        <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" />
          Excluir empreendimento
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0D2F5E] text-white text-sm font-medium rounded-lg hover:bg-[#081E3F] disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )
}

// ── Componente de seção de imagens ────────────────────────────────────────────

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5E] bg-white'

function ImageSection({
  title, description, images, category, onUpload, onRemove, uploading,
}: {
  title: string
  description: string
  images: EmpImage[]
  category: ImageCategory
  onUpload: (category: ImageCategory) => void
  onRemove: (url: string) => void
  uploading: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-[#0D2F5E]">{title}</h2>
        <button onClick={() => onUpload(category)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D2F5E] text-white text-xs font-medium rounded-lg hover:bg-[#081E3F] transition-colors disabled:opacity-50"
          disabled={uploading}>
          <ImagePlus className="w-3.5 h-3.5" />
          {uploading ? 'Enviando...' : 'Adicionar fotos'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-4">{description}</p>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl py-10 text-center cursor-pointer hover:border-[#2E86DE] transition-colors"
          onClick={() => onUpload(category)}>
          <ImagePlus className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">Clique para adicionar fotos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={img.url + idx} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.thumbnailUrl ?? img.url} alt={img.alt ?? ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => onRemove(img.url)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => onUpload(category)}
            className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-[#2E86DE] flex items-center justify-center text-gray-300 hover:text-[#2E86DE] transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}

