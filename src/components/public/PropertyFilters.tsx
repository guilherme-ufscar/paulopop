'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROPERTY_TYPES = [
  'Apartamento', 'Casa', 'Sobrado', 'Terreno', 'Sala Comercial',
  'Loja', 'Galpão', 'Prédio', 'Chácara', 'Fazenda',
  'Studio', 'Kitnet', 'Cobertura', 'Flat', 'Mansão',
]

const FEATURES = [
  { value: 'POOL', label: 'Piscina' },
  { value: 'GARAGE', label: 'Garagem' },
  { value: 'GYM', label: 'Academia' },
  { value: 'ELEVATOR', label: 'Elevador' },
  { value: 'FURNISHED', label: 'Mobiliado' },
  { value: 'AIR_CONDITIONING', label: 'Ar condicionado' },
  { value: 'BARBECUE', label: 'Churrasqueira' },
  { value: 'ACCEPTS_PETS', label: 'Aceita Pets' },
  { value: 'SECURITY_24H', label: 'Segurança 24h' },
  { value: 'GOURMET_BALCONY', label: 'Varanda Gourmet' },
]

const BRAZIL_STATES = [
  { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' }, { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' }, { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' }, { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' }, { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' }, { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' }, { uf: 'RR', name: 'Roraima' }, { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' }, { uf: 'SE', name: 'Sergipe' }, { uf: 'TO', name: 'Tocantins' },
]

function CountButton({ value, current, onClick }: { value: string; current: string; onClick: (v: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(current === value ? '' : value)}
      className={cn(
        'w-10 h-10 rounded-lg border text-sm font-medium transition-colors',
        current === value
          ? 'bg-[#0D2F5E] text-white border-[#0D2F5E]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D2F5E] hover:text-[#0D2F5E]'
      )}
      aria-pressed={current === value}
    >
      {value === '4' ? '4+' : value}
    </button>
  )
}

interface PropertyFiltersProps {
  className?: string
}

export function PropertyFilters({ className }: PropertyFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [mobileOpen, setMobileOpen] = useState(false)

  // Ler valores dos params
  const transacao = params.get('transacao') ?? 'comprar'
  const finalidade = params.get('finalidade') ?? ''
  const tipo = params.get('tipo') ?? ''
  const precoMin = params.get('precoMin') ?? ''
  const precoMax = params.get('precoMax') ?? ''
  const quartos = params.get('quartos') ?? ''
  const banheiros = params.get('banheiros') ?? ''
  const areaMin = params.get('areaMin') ?? ''
  const estado = params.get('estado') ?? ''
  const cidade = params.get('cidade') ?? ''
  const features = params.getAll('feature')
  const q = params.get('q') ?? ''

  const setParam = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.delete('pagina') // reset pagination
    router.push(`${pathname}?${next.toString()}`)
  }, [params, pathname, router])

  const toggleFeature = useCallback((f: string) => {
    const next = new URLSearchParams(params.toString())
    const existing = next.getAll('feature')
    next.delete('feature')
    if (existing.includes(f)) {
      existing.filter(x => x !== f).forEach(x => next.append('feature', x))
    } else {
      [...existing, f].forEach(x => next.append('feature', x))
    }
    next.delete('pagina')
    router.push(`${pathname}?${next.toString()}`)
  }, [params, pathname, router])

  const clearAll = useCallback(() => {
    const next = new URLSearchParams()
    if (q) next.set('q', q)
    router.push(`${pathname}?${next.toString()}`)
  }, [q, pathname, router])

  const hasFilters = transacao !== 'comprar' || !!finalidade || !!tipo || !!precoMin || !!precoMax ||
    !!quartos || !!banheiros || !!areaMin || !!estado || features.length > 0

  const filterContent = (
    <div className={cn('space-y-6', className)}>
      {/* Limpar filtros */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1 text-sm text-[#2E86DE] hover:text-[#0D2F5E] transition-colors"
        >
          <X className="w-4 h-4" />
          Limpar filtros
        </button>
      )}

      {/* Tipo de Transação */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Transação</p>
        <div className="flex gap-2">
          {(['comprar', 'alugar'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setParam('transacao', t)}
              className={cn(
                'flex-1 py-2 text-sm rounded-lg border font-medium transition-colors',
                transacao === t
                  ? 'bg-[#0D2F5E] text-white border-[#0D2F5E]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D2F5E]'
              )}
              aria-pressed={transacao === t}
            >
              {t === 'comprar' ? 'Comprar' : 'Alugar'}
            </button>
          ))}
        </div>
      </div>

      {/* Finalidade */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Finalidade</p>
        <div className="flex gap-2">
          {[{ v: '', l: 'Todos' }, { v: 'residencial', l: 'Residencial' }, { v: 'comercial', l: 'Comercial' }].map(f => (
            <button
              key={f.v}
              type="button"
              onClick={() => setParam('finalidade', f.v)}
              className={cn(
                'flex-1 py-2 text-xs rounded-lg border font-medium transition-colors',
                finalidade === f.v
                  ? 'bg-[#2E86DE] text-white border-[#2E86DE]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#2E86DE]'
              )}
              aria-pressed={finalidade === f.v}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Imóvel */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo de Imóvel</p>
        <select
          value={tipo}
          onChange={e => setParam('tipo', e.target.value)}
          aria-label="Tipo de imóvel"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
        >
          <option value="">Todos os tipos</option>
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Faixa de Preço */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Faixa de Preço (R$)
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={precoMin}
            onChange={e => setParam('precoMin', e.target.value)}
            placeholder="Mín."
            aria-label="Preço mínimo"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
          />
          <input
            type="number"
            value={precoMax}
            onChange={e => setParam('precoMax', e.target.value)}
            placeholder="Máx."
            aria-label="Preço máximo"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
          />
        </div>
      </div>

      {/* Dormitórios */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dormitórios</p>
        <div className="flex gap-2">
          {['1', '2', '3', '4'].map(v => (
            <CountButton key={v} value={v} current={quartos} onClick={v => setParam('quartos', v)} />
          ))}
        </div>
      </div>

      {/* Banheiros */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Banheiros</p>
        <div className="flex gap-2">
          {['1', '2', '3', '4'].map(v => (
            <CountButton key={v} value={v} current={banheiros} onClick={v => setParam('banheiros', v)} />
          ))}
        </div>
      </div>

      {/* Área mínima */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Área Mínima (m²)</p>
        <input
          type="number"
          value={areaMin}
          onChange={e => setParam('areaMin', e.target.value)}
          placeholder="Ex: 50"
          aria-label="Área mínima"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
        />
      </div>

      {/* Estado / Cidade */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Localização</p>
        <div className="space-y-2">
          <select
            value={estado}
            onChange={e => { setParam('estado', e.target.value); setParam('cidade', '') }}
            aria-label="Estado"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
          >
            <option value="">Todos os estados</option>
            {BRAZIL_STATES.map(s => <option key={s.uf} value={s.uf}>{s.name}</option>)}
          </select>
          <input
            type="text"
            value={cidade}
            onChange={e => setParam('cidade', e.target.value)}
            placeholder="Cidade"
            aria-label="Cidade"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
          />
        </div>
      </div>

      {/* Características */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Características</p>
        <div className="space-y-2">
          {FEATURES.map(f => (
            <label key={f.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={features.includes(f.value)}
                onChange={() => toggleFeature(f.value)}
                aria-label={f.label}
                className="w-4 h-4 rounded border-gray-300 text-[#0D2F5E] focus:ring-[#2E86DE]"
              />
              <span className="text-sm text-gray-700">{f.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0" aria-label="Filtros de busca">
        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
          <h2 className="font-semibold text-[#0D2F5E] mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </h2>
          {filterContent}
        </div>
      </aside>

      {/* Mobile filter button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#0D2F5E] transition-colors"
          aria-expanded={mobileOpen}
          aria-controls="mobile-filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {hasFilters && (
            <span className="ml-1 w-5 h-5 bg-[#0D2F5E] text-white text-xs rounded-full flex items-center justify-center">
              {[transacao !== 'comprar', finalidade, tipo, precoMin, precoMax, quartos, banheiros, areaMin, estado, features.length > 0].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex" id="mobile-filters" role="dialog" aria-modal="true" aria-label="Filtros">
            <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="w-80 bg-white h-full overflow-y-auto p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0D2F5E] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar filtros"
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {filterContent}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mt-6 w-full py-3 bg-[#0D2F5E] text-white font-semibold rounded-xl text-sm"
              >
                Ver resultados
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
