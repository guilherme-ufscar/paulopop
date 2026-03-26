import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge, propertyStatusBadge, propertyStatusLabel } from '@/components/ui/Badge'
import { formatCurrency, formatArea, formatDate } from '@/lib/formatters'
import { Plus, Search, Building2, Eye } from 'lucide-react'

interface SearchParams {
  q?: string
  status?: string
  page?: string
}

async function PropertiesTable({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where = {
    ...(searchParams.q
      ? {
          OR: [
            { ref: { contains: searchParams.q, mode: 'insensitive' as const } },
            { title: { contains: searchParams.q, mode: 'insensitive' as const } },
            { address: { contains: searchParams.q, mode: 'insensitive' as const } },
            { city: { contains: searchParams.q, mode: 'insensitive' as const } },
            { neighborhood: { contains: searchParams.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(searchParams.status ? { status: searchParams.status as never } : {}),
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ref: true,
        title: true,
        propertyType: true,
        status: true,
        transactionType: true,
        price: true,
        totalArea: true,
        city: true,
        state: true,
        neighborhood: true,
        createdAt: true,
        images: { take: 1, select: { thumbnailUrl: true, url: true }, orderBy: { order: 'asc' } },
        agent: { select: { name: true } },
      },
    }),
    prisma.property.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
        <span>{total} imóvel{total !== 1 ? 'is' : ''} encontrado{total !== 1 ? 's' : ''}</span>
        {totalPages > 1 && (
          <span>Página {page} de {totalPages}</span>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum imóvel encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou cadastre um novo imóvel.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Imóvel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Área</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Corretor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cadastro</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images[0].thumbnailUrl ?? p.images[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 m-auto mt-2 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-[200px]">
                            {p.title ?? `${p.propertyType ?? 'Imóvel'} — ${p.neighborhood ?? p.city}`}
                          </p>
                          <p className="text-xs text-gray-400">{p.ref}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.propertyType ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={propertyStatusBadge[p.status]} size="sm">
                        {propertyStatusLabel[p.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {p.price ? formatCurrency(Number(p.price)) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.totalArea ? formatArea(Number(p.totalArea)) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.agent.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(p.createdAt.toISOString())}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/imoveis/${p.id}`}
                        className="flex items-center gap-1 text-[#0D2F5E] hover:underline text-xs font-medium"
                        aria-label={`Editar ${p.ref}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {properties.map(p => (
              <Link
                key={p.id}
                href={`/admin/imoveis/${p.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].thumbnailUrl ?? p.images[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 m-auto mt-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {p.title ?? `${p.propertyType ?? 'Imóvel'} — ${p.city}`}
                    </p>
                    <p className="text-xs text-gray-400 mb-1">{p.ref}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={propertyStatusBadge[p.status]} size="sm">
                        {propertyStatusLabel[p.status]}
                      </Badge>
                      {p.price && (
                        <span className="text-xs font-semibold text-[#0D2F5E]">
                          {formatCurrency(Number(p.price))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p2 = i + 1
            return (
              <Link
                key={p2}
                href={`?${new URLSearchParams({ ...searchParams, page: String(p2) })}`}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p2 === page
                    ? 'bg-[#0D2F5E] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0D2F5E] hover:text-[#0D2F5E]'
                }`}
              >
                {p2}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminImoveisPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'DRAFT', label: 'Rascunho' },
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'SOLD', label: 'Vendido' },
    { value: 'RENTED', label: 'Alugado' },
    { value: 'INACTIVE', label: 'Inativo' },
    { value: 'SUSPENDED', label: 'Suspenso' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F5E]">Imóveis</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie todos os imóveis cadastrados</p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D2F5E] text-white text-sm font-medium rounded-lg hover:bg-[#081E3F] transition-colors"
          aria-label="Cadastrar novo imóvel"
        >
          <Plus className="w-4 h-4" />
          Novo Imóvel
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q}
            placeholder="Buscar por ref, título, endereço, cidade..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5E] bg-white"
            aria-label="Buscar imóveis"
          />
        </div>
        <select
          name="status"
          defaultValue={searchParams.status ?? ''}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D2F5E] text-gray-700"
          aria-label="Filtrar por status"
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-[#2E86DE] text-white text-sm font-medium rounded-lg hover:bg-[#1B6EC2] transition-colors"
        >
          Filtrar
        </button>
      </form>

      {/* Tabela */}
      <Suspense fallback={
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
          Carregando imóveis...
        </div>
      }>
        <PropertiesTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
