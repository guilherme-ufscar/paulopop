import { Skeleton } from '@/components/ui/Skeleton'

export function MarketAnalysisSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Gerando análise de mercado pela IA..."
    >
      {/* Cards de valor */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Posicionamento */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <Skeleton className="h-5 w-48 mb-4" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Comparáveis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
              <Skeleton className="h-28 w-full" />
              <div className="p-3 space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights IA */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <Skeleton className="h-5 w-44 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="space-y-1.5 pl-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
