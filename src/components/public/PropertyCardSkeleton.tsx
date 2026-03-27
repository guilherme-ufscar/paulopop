import { Skeleton } from '@/components/ui/Skeleton'

export function PropertyCardSkeleton() {
  return (
    <div
      className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm"
      aria-label="Carregando imóvel..."
      role="status"
    >
      {/* Imagem */}
      <Skeleton className="h-52 w-full rounded-none" />

      {/* Conteúdo */}
      <div className="p-4 flex flex-col gap-3">
        {/* Ícones de dados */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Tipo */}
        <Skeleton className="h-3 w-24" />

        {/* Endereço */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function PropertyCarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden" aria-busy="true" aria-label="Carregando imóveis">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-72">
          <PropertyCardSkeleton />
        </div>
      ))}
    </div>
  )
}
