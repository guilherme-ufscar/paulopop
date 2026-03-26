'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const propertyTypes = [
  'Apartamento', 'Casa', 'Sobrado', 'Terreno', 'Sala Comercial',
  'Loja', 'Galpão', 'Prédio', 'Chácara', 'Fazenda',
  'Studio', 'Kitnet', 'Cobertura', 'Flat', 'Mansão',
]

const bedroomOptions = [
  { value: '', label: 'Dormitórios' },
  { value: '1', label: '1 Dormitório' },
  { value: '2', label: '2 Dormitórios' },
  { value: '3', label: '3 Dormitórios' },
  { value: '4', label: '4+ Dormitórios' },
]

const priceRanges = [
  { value: '', label: 'Faixa de Preço' },
  { value: '0-200000', label: 'Até R$ 200.000' },
  { value: '200000-500000', label: 'R$ 200k – R$ 500k' },
  { value: '500000-1000000', label: 'R$ 500k – R$ 1M' },
  { value: '1000000-2000000', label: 'R$ 1M – R$ 2M' },
  { value: '2000000-', label: 'Acima de R$ 2M' },
]

interface SearchBarProps {
  defaultTab?: 'comprar' | 'alugar'
}

export function SearchBar({ defaultTab = 'comprar' }: SearchBarProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'comprar' | 'alugar'>(defaultTab)
  const [query, setQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [priceRange, setPriceRange] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (tab === 'alugar') params.set('transacao', 'alugar')
    if (query) params.set('q', query)
    if (propertyType) params.set('tipo', propertyType)
    if (bedrooms) params.set('quartos', bedrooms)
    if (priceRange) {
      const [min, max] = priceRange.split('-')
      if (min) params.set('precoMin', min)
      if (max) params.set('precoMax', max)
    }
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Tabs Comprar / Alugar */}
      <div className="flex mb-0" role="tablist" aria-label="Tipo de transação">
        {(['comprar', 'alugar'] as const).map(t => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 text-sm font-semibold rounded-t-xl transition-colors ${
              tab === t
                ? 'bg-white text-[#0D2F5E]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {t === 'comprar' ? 'Comprar' : 'Alugar'}
          </button>
        ))}
      </div>

      {/* Formulário de busca */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-b-2xl rounded-tr-2xl p-4 shadow-2xl"
        role="search"
        aria-label="Buscar imóveis"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Campo de busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Localização, bairro ou ID do imóvel..."
              aria-label="Localização ou ID do imóvel"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE] text-gray-700"
            />
          </div>

          {/* Tipo de Imóvel */}
          <select
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
            aria-label="Tipo de imóvel"
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2E86DE] bg-white"
          >
            <option value="">Tipo de Imóvel</option>
            {propertyTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Dormitórios */}
          <select
            value={bedrooms}
            onChange={e => setBedrooms(e.target.value)}
            aria-label="Número de dormitórios"
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2E86DE] bg-white"
          >
            {bedroomOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Faixa de Preço */}
          <select
            value={priceRange}
            onChange={e => setPriceRange(e.target.value)}
            aria-label="Faixa de preço"
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2E86DE] bg-white"
          >
            {priceRanges.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Botão Buscar */}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0D2F5E] hover:bg-[#081E3F] text-white font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
            aria-label="Buscar imóveis"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
        </div>
      </form>
    </div>
  )
}
