'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Minus, BarChart3, Zap,
  AlertCircle, Lightbulb, CheckCircle, Target, Clock, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Property {
  id: string
  ref: string
  title: string | null
  propertyType: string | null
  city: string | null
  state: string | null
  neighborhood: string | null
  price: number | null
  totalArea: number | null
  bedrooms: number | null
  status: string
}

interface AnalysisResult {
  id: string
  generatedAt: string
  status: string
  optimisticValue: number | null
  marketValue: number | null
  competitiveValue: number | null
  pricePositioning: string | null
  marketDemand: string | null
  absoptionTime: number | null
  avgPricePerSqmRegion: number | null
  aiSummary: string | null
  aiStrengths: unknown
  aiWeaknesses: unknown
  aiOpportunities: unknown
  aiRecommendations: unknown
}

function formatCurrency(value: number | null): string {
  if (!value) return 'N/A'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[]
  return []
}

export function MarketAnalysisClient({ properties }: { properties: Property[] }) {
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedProperty = properties.find(p => p.id === selectedId)

  const handleGenerate = async () => {
    if (!selectedId) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/analise-mercado/${selectedId}`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erro ao gerar análise')
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const positioningColor = (pos: string | null) => {
    if (pos === 'Abaixo do mercado') return 'bg-green-100 text-green-700'
    if (pos === 'Acima do mercado') return 'bg-red-100 text-red-700'
    return 'bg-blue-100 text-blue-700'
  }

  const demandColor = (d: string | null) => {
    if (d === 'Alta') return 'bg-green-100 text-green-700'
    if (d === 'Baixa') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0D2F5E]">Análise de Mercado</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selecione um imóvel para gerar uma análise de mercado baseada em IA e comparáveis do banco de dados.
        </p>
      </div>

      {/* Seletor de imóvel */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
            aria-label="Selecionar imóvel para análise"
          >
            <option value="">Selecione um imóvel...</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>
                [{p.ref}] {p.title ?? p.propertyType ?? 'Sem título'} — {p.city}/{p.state}
              </option>
            ))}
          </select>
          <Button
            onClick={handleGenerate}
            disabled={!selectedId || loading}
            loading={loading}
            aria-label="Gerar análise de mercado"
          >
            <BarChart3 size={16} />
            {loading ? 'Gerando análise...' : 'Gerar Análise'}
          </Button>
        </div>

        {selectedProperty && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600">
            <span><strong>Tipo:</strong> {selectedProperty.propertyType ?? '—'}</span>
            <span><strong>Bairro:</strong> {selectedProperty.neighborhood ?? '—'}</span>
            <span><strong>Preço atual:</strong> {formatCurrency(selectedProperty.price)}</span>
            {selectedProperty.totalArea && <span><strong>Área:</strong> {selectedProperty.totalArea}m²</span>}
            {selectedProperty.bedrooms != null && <span><strong>Dorms:</strong> {selectedProperty.bedrooms}</span>}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl p-10 shadow-sm flex flex-col items-center gap-3 text-gray-500 mb-6">
          <RefreshCw className="animate-spin text-[#2E86DE]" size={32} />
          <p className="font-medium">Analisando imóvel com IA...</p>
          <p className="text-xs text-gray-400">Isso pode levar alguns segundos</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-5">
          {/* Cabeçalho da análise */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-0.5">Análise gerada em</p>
              <p className="font-semibold text-[#0D2F5E]">
                {new Date(result.generatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
            {result.pricePositioning && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${positioningColor(result.pricePositioning)}`}>
                {result.pricePositioning}
              </span>
            )}
            {result.marketDemand && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${demandColor(result.marketDemand)}`}>
                Demanda {result.marketDemand}
              </span>
            )}
            {result.absoptionTime && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock size={14} />
                <span>~{result.absoptionTime} dias para venda</span>
              </div>
            )}
            {result.avgPricePerSqmRegion && (
              <div className="text-sm text-gray-600">
                <span className="text-gray-400">Média/m²: </span>
                <strong>{formatCurrency(result.avgPricePerSqmRegion)}</strong>
              </div>
            )}
          </div>

          {/* 3 cards de valor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-400">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-500" />
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Valor Otimista</span>
              </div>
              <p className="font-display text-2xl font-bold text-[#0D2F5E]">{formatCurrency(result.optimisticValue)}</p>
              <p className="text-xs text-gray-400 mt-1">~5–10% acima do mercado</p>
            </div>
            <div className="bg-[#0D2F5E] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Minus size={18} className="text-blue-300" />
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wide">Valor de Mercado</span>
              </div>
              <p className="font-display text-2xl font-bold text-white">{formatCurrency(result.marketValue)}</p>
              <p className="text-xs text-blue-200 mt-1">Referência dos comparáveis</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-orange-400">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={18} className="text-orange-500" />
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Valor Competitivo</span>
              </div>
              <p className="font-display text-2xl font-bold text-[#0D2F5E]">{formatCurrency(result.competitiveValue)}</p>
              <p className="text-xs text-gray-400 mt-1">~5–10% abaixo do mercado</p>
            </div>
          </div>

          {/* Resumo da IA */}
          {result.aiSummary && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-[#2E86DE]" />
                <h2 className="font-semibold text-[#0D2F5E]">Resumo da Análise</h2>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                {result.aiSummary.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
              </div>
            </div>
          )}

          {/* Painel SWOT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toStringArray(result.aiStrengths).length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <h3 className="font-semibold text-[#0D2F5E] text-sm">Pontos Fortes</h3>
                </div>
                <ul className="space-y-1.5">
                  {toStringArray(result.aiStrengths).map((item, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {toStringArray(result.aiWeaknesses).length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-red-400" />
                  <h3 className="font-semibold text-[#0D2F5E] text-sm">Pontos de Atenção</h3>
                </div>
                <ul className="space-y-1.5">
                  {toStringArray(result.aiWeaknesses).map((item, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {toStringArray(result.aiOpportunities).length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-yellow-500" />
                  <h3 className="font-semibold text-[#0D2F5E] text-sm">Oportunidades</h3>
                </div>
                <ul className="space-y-1.5">
                  {toStringArray(result.aiOpportunities).map((item, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {toStringArray(result.aiRecommendations).length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-[#2E86DE]" />
                  <h3 className="font-semibold text-[#0D2F5E] text-sm">Recomendações</h3>
                </div>
                <ul className="space-y-1.5">
                  {toStringArray(result.aiRecommendations).map((item, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
