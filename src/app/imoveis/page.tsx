import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PropertyCard } from '@/components/public/PropertyCard'
import { PropertyFilters } from '@/components/public/PropertyFilters'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Imóveis | Paulo Pop',
  description: 'Encontre apartamentos, casas, terrenos e muito mais. Filtre por localização, preço, tipo e características.',
}

interface SearchParams {
  q?: string
  transacao?: string
  finalidade?: string
  tipo?: string
  precoMin?: string
  precoMax?: string
  quartos?: string
  banheiros?: string
  areaMin?: string
  estado?: string
  cidade?: string
  feature?: string | string[]
  ordem?: string
  pagina?: string
}

const PAGE_SIZE = 12

function buildWhere(sp: SearchParams): Prisma.PropertyWhereInput {
  const features = Array.isArray(sp.feature)
    ? sp.feature
    : sp.feature
      ? [sp.feature]
      : []

  return {
    status: 'ACTIVE',
    hideOnSite: false,
    ...(sp.transacao === 'alugar' ? { transactionType: 'RENT' } : sp.transacao === 'comprar' ? { transactionType: 'SALE' } : {}),
    ...(sp.finalidade === 'residencial' ? { purpose: 'RESIDENTIAL' } : sp.finalidade === 'comercial' ? { purpose: 'COMMERCIAL' } : {}),
    ...(sp.tipo ? { propertyType: { equals: sp.tipo, mode: 'insensitive' as const } } : {}),
    ...(sp.precoMin || sp.precoMax ? {
      price: {
        ...(sp.precoMin ? { gte: parseFloat(sp.precoMin) } : {}),
        ...(sp.precoMax ? { lte: parseFloat(sp.precoMax) } : {}),
      }
    } : {}),
    ...(sp.quartos ? {
      bedrooms: sp.quartos === '4' ? { gte: 4 } : { equals: parseInt(sp.quartos) }
    } : {}),
    ...(sp.banheiros ? {
      bathrooms: sp.banheiros === '4' ? { gte: 4 } : { equals: parseInt(sp.banheiros) }
    } : {}),
    ...(sp.areaMin ? { totalArea: { gte: parseFloat(sp.areaMin) } } : {}),
    ...(sp.estado ? { state: { equals: sp.estado, mode: 'insensitive' as const } } : {}),
    ...(sp.cidade ? { city: { contains: sp.cidade, mode: 'insensitive' as const } } : {}),
    ...(sp.q ? {
      OR: [
        { ref: { contains: sp.q, mode: 'insensitive' as const } },
        { title: { contains: sp.q, mode: 'insensitive' as const } },
        { neighborhood: { contains: sp.q, mode: 'insensitive' as const } },
        { city: { contains: sp.q, mode: 'insensitive' as const } },
        { address: { contains: sp.q, mode: 'insensitive' as const } },
      ]
    } : {}),
    ...(features.length > 0 ? {
      features: { some: { feature: { in: features as never[] } } }
    } : {}),
  }
}

function buildOrderBy(ordem?: string): Prisma.PropertyOrderByWithRelationInput {
  switch (ordem) {
    case 'menor-preco': return { price: 'asc' }
    case 'maior-preco': return { price: 'desc' }
    case 'maior-area': return { totalArea: 'desc' }
    default: return { createdAt: 'desc' }
  }
}

async function PropertyGrid({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(searchParams.pagina ?? '1'))
  const skip = (page - 1) * PAGE_SIZE

  const where = buildWhere(searchParams)
  const orderBy = buildOrderBy(searchParams.ordem)

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy,
      select: {
        id: true,
        slug: true,
        title: true,
        propertyType: true,
        transactionType: true,
        status: true,
        price: true,
        totalArea: true,
        bedrooms: true,
        bathrooms: true,
        environments: true,
        totalParkingSpots: true,
        neighborhood: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        images: {
          where: { isCover: true },
          take: 1,
          select: { url: true, thumbnailUrl: true },
        },
      },
    }),
    prisma.property.count({ where }),
  ])

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum imóvel encontrado</h3>
        <p className="text-gray-400 text-sm">Tente ajustar os filtros de busca.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map(p => (
          <PropertyCard
            key={p.id}
            {...p}
            price={p.price ? Number(p.price) : null}
            totalArea={p.totalArea ? Number(p.totalArea) : null}
            coverImage={p.images[0]?.thumbnailUrl ?? p.images[0]?.url ?? null}
            isNew={p.createdAt > thirtyDaysAgo}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-10" aria-label="Paginação">
          {page > 1 && (
            <Link
              href={`?${new URLSearchParams({ ...searchParams, pagina: String(page - 1) })}`}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-[#0D2F5E] hover:text-[#0D2F5E] transition-colors"
              aria-label="Página anterior"
            >
              ‹
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p2 = i + 1
            return (
              <Link
                key={p2}
                href={`?${new URLSearchParams({ ...searchParams, pagina: String(p2) })}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p2 === page
                    ? 'bg-[#0D2F5E] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D2F5E] hover:text-[#0D2F5E]'
                }`}
                aria-current={p2 === page ? 'page' : undefined}
              >
                {p2}
              </Link>
            )
          })}
          {page < totalPages && (
            <Link
              href={`?${new URLSearchParams({ ...searchParams, pagina: String(page + 1) })}`}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-[#0D2F5E] hover:text-[#0D2F5E] transition-colors"
              aria-label="Próxima página"
            >
              ›
            </Link>
          )}
        </nav>
      )}

      <p className="text-center text-sm text-gray-400 mt-4">
        {total} imóvel{total !== 1 ? 'is' : ''} encontrado{total !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default function ImoveisPage({ searchParams }: { searchParams: SearchParams }) {
  const sortOptions = [
    { value: 'recente', label: 'Mais recente' },
    { value: 'menor-preco', label: 'Menor preço' },
    { value: 'maior-preco', label: 'Maior preço' },
    { value: 'maior-area', label: 'Maior área' },
  ]

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Header da listagem */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0D2F5E] mb-4">
            {searchParams.q ? `Resultados para "${searchParams.q}"` : 'Todos os Imóveis'}
          </h1>

          {/* Barra de busca rápida */}
          <form method="GET" className="flex gap-2">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q}
                placeholder="Buscar por cidade, bairro, ref..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86DE] bg-white"
                aria-label="Buscar imóveis"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#0D2F5E] text-white text-sm font-medium rounded-lg hover:bg-[#081E3F] transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar de filtros */}
          <PropertyFilters />

          {/* Resultados */}
          <div className="flex-1 min-w-0">
            {/* Ordenação e filtros mobile */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <PropertyFilters className="lg:hidden" />

              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-gray-500 hidden sm:block" htmlFor="ordem">
                  Ordenar:
                </label>
                <form method="GET">
                  {/* Preservar outros params */}
                  {Object.entries(searchParams).filter(([k]) => k !== 'ordem').map(([k, v]) =>
                    Array.isArray(v)
                      ? v.map((val, i) => <input key={`${k}-${i}`} type="hidden" name={k} value={val} />)
                      : <input key={k} type="hidden" name={k} value={v as string} />
                  )}
                  <select
                    id="ordem"
                    name="ordem"
                    defaultValue={searchParams.ordem ?? 'recente'}
                    onChange={e => (e.currentTarget.form as HTMLFormElement).submit()}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E86DE]"
                    aria-label="Ordenar imóveis"
                  >
                    {sortOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </form>
              </div>
            </div>

            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-72 bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            }>
              <PropertyGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
