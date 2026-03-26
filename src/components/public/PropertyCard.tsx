import Link from 'next/link'
import { Bed, Bath, LayoutGrid, Maximize2, Car, Heart, Share2 } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  id: string
  slug: string
  title?: string | null
  propertyType?: string | null
  transactionType: string
  status: string
  price?: number | null
  totalArea?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  environments?: number | null
  totalParkingSpots?: number | null
  neighborhood?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  coverImage?: string | null
  createdAt: Date | string
  isNew?: boolean // cadastrado nos últimos 30 dias
  className?: string
}

const statusBadge: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Disponível', className: 'bg-[#2E86DE] text-white' },
  SOLD: { label: 'Vendido', className: 'bg-red-500 text-white' },
  RENTED: { label: 'Alugado', className: 'bg-orange-500 text-white' },
  INACTIVE: { label: 'Inativo', className: 'bg-gray-500 text-white' },
}

const transactionBadge: Record<string, string> = {
  SALE: 'Para Venda',
  RENT: 'Para Alugar',
}

export function PropertyCard({
  slug,
  title,
  propertyType,
  transactionType,
  status,
  price,
  totalArea,
  bedrooms,
  bathrooms,
  environments,
  totalParkingSpots,
  neighborhood,
  city,
  state,
  zipCode,
  coverImage,
  createdAt,
  isNew,
  className,
}: PropertyCardProps) {
  const badge = isNew
    ? { label: 'Cadastrado Este Mês', className: 'bg-[#0D2F5E] text-white' }
    : status === 'SOLD'
      ? statusBadge.SOLD
      : status === 'RENTED'
        ? statusBadge.RENTED
        : transactionType === 'RENT'
          ? { label: 'Para Alugar', className: 'bg-green-600 text-white' }
          : null

  const locationParts = [neighborhood, city, state].filter(Boolean)
  const addressLine = locationParts.join(', ')

  return (
    <Link
      href={`/imoveis/${slug}`}
      className={cn(
        'group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
        className
      )}
      aria-label={`Ver imóvel: ${title ?? propertyType ?? 'Imóvel'} em ${addressLine}`}
    >
      {/* Imagem */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title ?? `${propertyType} em ${city}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D2F5E]/10 to-[#2E86DE]/10">
            <LayoutGrid className="w-12 h-12 text-[#0D2F5E]/30" />
          </div>
        )}
        {/* Gradiente escuro de baixo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge */}
        {badge && (
          <span className={cn('absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold', badge.className)}>
            {badge.label}
          </span>
        )}

        {/* Ações */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            type="button"
            aria-label="Favoritar imóvel"
            onClick={e => { e.preventDefault(); e.stopPropagation() }}
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
          </button>
          <button
            type="button"
            aria-label="Compartilhar imóvel"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              if (typeof window !== 'undefined') {
                navigator.share?.({ url: window.location.origin + `/imoveis/${slug}` })
              }
            }}
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Preço sobre a imagem */}
        {price && (
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-bold text-lg drop-shadow">
              {formatCurrency(price)}
              {transactionType === 'RENT' && <span className="text-sm font-normal">/mês</span>}
            </p>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Ícones de dados */}
        <div className="flex items-center gap-3 text-gray-500 text-xs flex-wrap">
          {(bedrooms ?? 0) > 0 && (
            <span className="flex items-center gap-1" aria-label={`${bedrooms} dormitórios`}>
              <Bed className="w-3.5 h-3.5 text-[#2E86DE]" />
              {bedrooms}
            </span>
          )}
          {(bathrooms ?? 0) > 0 && (
            <span className="flex items-center gap-1" aria-label={`${bathrooms} banheiros`}>
              <Bath className="w-3.5 h-3.5 text-[#2E86DE]" />
              {bathrooms}
            </span>
          )}
          {(environments ?? 0) > 0 && (
            <span className="flex items-center gap-1" aria-label={`${environments} ambientes`}>
              <LayoutGrid className="w-3.5 h-3.5 text-[#2E86DE]" />
              {environments}
            </span>
          )}
          {totalArea && (
            <span className="flex items-center gap-1" aria-label={`${totalArea} m²`}>
              <Maximize2 className="w-3.5 h-3.5 text-[#2E86DE]" />
              {totalArea} m²
            </span>
          )}
          {(totalParkingSpots ?? 0) > 0 && (
            <span className="flex items-center gap-1" aria-label={`${totalParkingSpots} vagas`}>
              <Car className="w-3.5 h-3.5 text-[#2E86DE]" />
              {totalParkingSpots}
            </span>
          )}
        </div>

        {/* Tipo e endereço */}
        <div>
          <p className="text-xs font-semibold text-[#2E86DE] uppercase tracking-wide mb-0.5">
            {propertyType ?? transactionBadge[transactionType] ?? 'Imóvel'}
          </p>
          {addressLine && (
            <p className="text-sm text-gray-600 truncate">{addressLine}</p>
          )}
          {zipCode && (
            <p className="text-xs text-gray-400">{zipCode}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
