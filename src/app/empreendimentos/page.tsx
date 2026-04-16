export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, MapPin, BedDouble, Maximize2, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Empreendimentos',
  description: 'Conheça os lançamentos e projetos imobiliários disponíveis.',
}

export default async function EmpreendimentosPage() {
  const items = await prisma.empreendimento.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  })

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Header */}
      <div className="bg-[#0D2F5E] py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-2">Lançamentos</p>
          <h1 className="font-display text-4xl font-bold text-white">Empreendimentos</h1>
          <p className="text-white/60 mt-2">Projetos exclusivos com qualidade e localização privilegiada</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum empreendimento disponível no momento.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => {
              const cover = item.coverUrl ?? item.images[0]?.url
              return (
                <Link key={item.id} href={`/empreendimentos/${item.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                  {/* Capa */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {cover ? (
                      <Image src={cover} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D2F5E] to-[#2E86DE]">
                        <Building2 className="w-12 h-12 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {item.financing && (
                      <div className="absolute top-3 left-3 bg-[#2E86DE] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {item.financing}
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5">
                    {item.neighborhood && (
                      <div className="flex items-center gap-1 text-[#2E86DE] text-xs font-semibold mb-1">
                        <MapPin className="w-3 h-3" /> {item.neighborhood}{item.city ? `, ${item.city}` : ''}
                      </div>
                    )}
                    <h2 className="font-display text-xl font-bold text-[#0D2F5E] group-hover:text-[#2E86DE] transition-colors mb-1">{item.name}</h2>
                    {item.tagline && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.tagline}</p>}

                    {/* Atributos */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      {(item.bedroomsMin ?? item.bedroomsMax) && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4 text-[#2E86DE]" />
                          {item.bedroomsMin === item.bedroomsMax
                            ? `${item.bedroomsMin} qtos`
                            : `${item.bedroomsMin ?? '?'}–${item.bedroomsMax ?? '?'} qtos`}
                        </span>
                      )}
                      {(item.areaMin ?? item.areaMax) && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-4 h-4 text-[#2E86DE]" />
                          {item.areaMin === item.areaMax
                            ? `${item.areaMin}m²`
                            : `${item.areaMin ?? '?'}–${item.areaMax ?? '?'}m²`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {item.priceMin ? (
                        <span className="text-[#0D2F5E] font-bold text-sm">
                          A partir de {Number(item.priceMin).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                        </span>
                      ) : <span />}
                      <span className="flex items-center gap-1 text-[#2E86DE] text-sm font-semibold">
                        Ver mais <ChevronRight className="w-4 h-4" />
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
