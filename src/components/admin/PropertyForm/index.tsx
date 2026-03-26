'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Printer, X, Save, CheckCircle, Megaphone, FileText, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MarketingPlanModal } from '@/components/admin/MarketingPlanModal'
import { ContractModal } from '@/components/admin/ContractModal'
import { TabPrincipal } from './TabPrincipal'
import { TabDescricao } from './TabDescricao'
import { TabImagensVideos } from './TabImagensVideos'
import { TabDocumentos } from './TabDocumentos'
import { TabPotencialComprador } from './TabPotencialComprador'
import { TabCorretores } from './TabCorretores'
import { TabAtividades } from './TabAtividades'
import { TabContatos } from './TabContatos'
import { TabPortais } from './TabPortais'
import { TabHistorico } from './TabHistorico'

const TABS = [
  { id: 'principal', label: 'Principal' },
  { id: 'descricao', label: 'Descrição' },
  { id: 'imagens', label: 'Imagens e Vídeos' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'potencial', label: 'Potencial Comprador' },
  { id: 'corretores', label: 'Corretores com Clientes' },
  { id: 'atividades', label: 'Atividades' },
  { id: 'contatos', label: 'Contatos' },
  { id: 'portais', label: 'Portais' },
  { id: 'historico', label: 'Histórico de Alterações' },
] as const

type TabId = typeof TABS[number]['id']

interface PropertyFormProps {
  propertyId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: Record<string, any>
}

export function PropertyForm({ propertyId, initialData }: PropertyFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('principal')
  const [data, setData] = useState<Record<string, unknown>>(initialData)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showMarketingModal, setShowMarketingModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)

  // Switches do cabeçalho
  const [transactionType, setTransactionType] = useState<'SALE' | 'RENT'>(
    (initialData.transactionType as 'SALE' | 'RENT') ?? 'SALE'
  )
  const [purpose, setPurpose] = useState<'RESIDENTIAL' | 'COMMERCIAL'>(
    (initialData.purpose as 'RESIDENTIAL' | 'COMMERCIAL') ?? 'RESIDENTIAL'
  )
  const [hideOnSite, setHideOnSite] = useState<boolean>(initialData.hideOnSite === true)

  const handleChange = useCallback((field: string, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])

  async function save(status?: string) {
    setSaving(true)
    setSaveError(null)
    try {
      const payload: Record<string, unknown> = {
        ...data,
        transactionType,
        purpose,
        hideOnSite,
      }
      if (status) payload.status = status

      const res = await fetch(`/api/imoveis/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Erro ao salvar')
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F0F4F8]">
      {/* Cabeçalho do formulário */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Ref</p>
            <p className="text-sm font-semibold text-[#0D2F5E]">{initialData.ref ?? propertyId}</p>
            {initialData.agent && (
              <p className="text-xs text-gray-500">{(initialData.agent as { name: string }).name}</p>
            )}
          </div>

          {/* Switches */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Venda / Aluguel */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => setTransactionType('SALE')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  transactionType === 'SALE'
                    ? 'bg-[#0D2F5E] text-white shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Para Venda
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('RENT')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  transactionType === 'RENT'
                    ? 'bg-[#0D2F5E] text-white shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Para Alugar
              </button>
            </div>

            {/* Residencial / Comercial */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => setPurpose('RESIDENTIAL')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  purpose === 'RESIDENTIAL'
                    ? 'bg-[#2E86DE] text-white shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Residencial
              </button>
              <button
                type="button"
                onClick={() => setPurpose('COMMERCIAL')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  purpose === 'COMMERCIAL'
                    ? 'bg-[#2E86DE] text-white shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Comercial
              </button>
            </div>

            {/* Ocultar no site */}
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
              <div
                role="switch"
                aria-checked={hideOnSite}
                onClick={() => setHideOnSite(v => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  hideOnSite ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    hideOnSite ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
              Ocultar no site
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 min-w-max border-b border-gray-200">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0D2F5E] text-[#0D2F5E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo da aba */}
      <div className="flex-1 p-4 md:p-6">
        {saveError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {saveError}
          </div>
        )}

        <div role="tabpanel">
          {activeTab === 'principal' && (
            <TabPrincipal data={data} onChange={handleChange} />
          )}
          {activeTab === 'descricao' && (
            <TabDescricao data={data} onChange={handleChange} />
          )}
          {activeTab === 'imagens' && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <TabImagensVideos
              propertyId={propertyId}
              images={(data.images as any[]) ?? []}
              videos={(data.videos as any[]) ?? []}
              virtualTourType={(data.virtualTourType as string) ?? 'NONE'}
              virtualTourUrl={(data.virtualTourUrl as string) ?? ''}
              externalLink={(data.externalLink as string) ?? ''}
              onImagesChange={imgs => handleChange('images', imgs)}
              onVideosChange={vids => handleChange('videos', vids)}
              onChange={handleChange}
            />
          )}
          {activeTab === 'documentos' && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <TabDocumentos
              documents={(data.documents as any[]) ?? []}
              onDocumentsChange={docs => handleChange('documents', docs)}
            />
          )}
          {activeTab === 'potencial' && <TabPotencialComprador />}
          {activeTab === 'corretores' && <TabCorretores />}
          {activeTab === 'atividades' && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <TabAtividades propertyId={propertyId} activities={(data.activities as any[]) ?? []} />
          )}
          {activeTab === 'contatos' && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <TabContatos leads={(data.leads as any[]) ?? []} />
          )}
          {activeTab === 'portais' && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <TabPortais portals={(data.portals as any[]) ?? []} onPortalsChange={p => handleChange('portals', p)} />
          )}
          {activeTab === 'historico' && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <TabHistorico activities={(data.activities as any[]) ?? []} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-4 md:px-6 py-3 sticky bottom-0 z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Imprimir PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMarketingModal(true)}
              aria-label="Criar plano de marketing"
            >
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Marketing</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContractModal(true)}
              aria-label="Criar contrato"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Contrato</span>
            </Button>
            <a
              href={`/admin/analise-mercado`}
              className="flex items-center gap-1 px-3 py-2 text-sm text-[#2E86DE] hover:text-[#0D2F5E] border border-[#2E86DE] rounded-md hover:bg-blue-50 transition-colors"
              aria-label="Análise de mercado"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Análise</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/imoveis')}
              disabled={saving}
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => save('DRAFT')}
              loading={saving}
            >
              <Save className="w-4 h-4 mr-1" />
              Salvar Rascunho
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => save('ACTIVE')}
              loading={saving}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Salvar e Ativar
            </Button>
          </div>
        </div>
      </div>

      {showMarketingModal && (
        <MarketingPlanModal
          propertyId={propertyId}
          propertyTitle={(data.title as string) ?? initialData.ref ?? propertyId}
          onClose={() => setShowMarketingModal(false)}
        />
      )}
      {showContractModal && (
        <ContractModal
          propertyId={propertyId}
          propertyTitle={(data.title as string) ?? initialData.ref ?? propertyId}
          onClose={() => setShowContractModal(false)}
        />
      )}
    </div>
  )
}
