import { Skeleton } from '@/components/ui/Skeleton'

export function PropertyPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F0F4F8]" aria-busy="true" aria-label="Carregando imóvel...">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e preço */}
        <div className="mb-6 flex justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        </div>

        {/* Galeria */}
        <div className="mb-8 grid grid-cols-3 gap-2 h-80">
          <Skeleton className="col-span-2 h-full rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="flex-1 rounded-xl" />
            <Skeleton className="flex-1 rounded-xl" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
