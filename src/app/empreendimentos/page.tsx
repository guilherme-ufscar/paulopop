export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/formatters'
import { Building2, MapPin, Layers, DollarSign, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Empreendimentos',
  description: 'Conheça nossos empreendimentos.',
}

export default async function EmpreendimentosPage() {
  const empreendimentos = await prisma.condominium.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { where: { category: 'FACHADA' }, take: 1, orderBy: { order: 'asc' } },
      _count: { select: { properties: true } },
    },
  })

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Hero simples */}
      <div className="bg-[#0D2F5E] py-16 px-4 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Empreendimentos</h1>
        <p className="text-blue-200 text-lg">Conheça os empreendimentos disponíveis</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {empreendimentos.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">Nenhum empreendimento disponível no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {empreendimentos.map(emp => {
              const cover = emp.images[0]
              return (
                <Link key={emp.id} href={`/empreendimentos/${emp.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="relative h-56 bg-gray-100">
                    {cover ? (
                      <Image
                        src={cover.thumbnailUrl ?? cover.url}
                        alt={emp.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 m-auto mt-20 text-gray-300" />
                    )}
                    {emp._count.properties > 0 && (
                      <span className="absolute top-3 right-3 bg-[#2E86DE] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {emp._count.properties} unidade{emp._count.properties > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-[#0D2F5E] text-lg mb-1 group-hover:text-[#2E86DE] transition-colors">
                      {emp.name}
                    </h2>
                    {emp.subtitle && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{emp.subtitle}</p>
                    )}
                    <div className="space-y-1.5">
                      {(emp.city || emp.state) && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-[#2E86DE] flex-shrink-0" />
                          <span>{[emp.neighborhood, emp.city, emp.state].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      {emp.totalUnits && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Layers className="w-3.5 h-3.5 text-[#2E86DE] flex-shrink-0" />
                          <span>{emp.totalUnits} unidades no total</span>
                        </div>
                      )}
                      {emp.deliveryDate && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-[#2E86DE] flex-shrink-0" />
                          <span>Entrega: {emp.deliveryDate}</span>
                        </div>
                      )}
                      {emp.priceFrom && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0D2F5E]">
                          <DollarSign className="w-3.5 h-3.5 text-[#2E86DE] flex-shrink-0" />
                          <span>
                            A partir de {formatCurrency(Number(emp.priceFrom))}
                            {emp.priceTo ? ` até ${formatCurrency(Number(emp.priceTo))}` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-[#2E86DE] group-hover:underline">
                        Ver empreendimento →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
