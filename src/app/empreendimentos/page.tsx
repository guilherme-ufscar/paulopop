export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/formatters'
import { Building2, MapPin, Layers, DollarSign, Calendar, BedDouble, Maximize2, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Empreendimentos',
  description: 'Conheça os lançamentos e projetos imobiliários disponíveis.',
}

export default async function EmpreendimentosPage() {
  const empreendimentos = await prisma.empreendimento.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { where: { category: 'FACHADA' }, take: 1, orderBy: { order: 'asc' } },
    },
  })

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <div className="bg-[#0D2F5E] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-2">Lançamentos</p>
          <h1 className="font-display text-4xl font-bold text-white">Empreendimentos</h1>
          <p className="text-white/60 mt-2">Projetos exclusivos com qualidade e localização privilegiada</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {empreendimentos.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum empreendimento disponível no momento.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {empreendimentos.map(emp => {
              const cover = emp.coverUrl ?? emp.images[0]?.url
              return (
                <Link key={emp.id} href={`/empreendimentos/${emp.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {cover ? (
                      <Image src={cover} alt={emp.name} fill sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D2F5E] to-[#2E86DE]">
                        <Building2 className="w-12 h-12 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {emp.financing && (
                      <div className="absolute top-3 left-3 bg-[#2E86DE] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {emp.financing}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {emp.neighborhood && (
                      <div className="flex items-center gap-1 text-[#2E86DE] text-xs font-semibold mb-1">
                        <MapPin className="w-3 h-3" />{emp.neighborhood}{emp.city ? `, ${emp.city}` : ''}
                      </div>
                    )}
                    <h2 className="font-display text-xl font-bold text-[#0D2F5E] group-hover:text-[#2E86DE] transition-colors mb-1">{emp.name}</h2>
                    {emp.tagline && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{emp.tagline}</p>}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      {(emp.bedroomsMin ?? emp.bedroomsMax) && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4 text-[#2E86DE]" />
                          {emp.bedroomsMin === emp.bedroomsMax ? `${emp.bedroomsMin} qtos` : `${emp.bedroomsMin ?? '?'}–${emp.bedroomsMax ?? '?'} qtos`}
                        </span>
                      )}
                      {(emp.areaMin ?? emp.areaMax) && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-4 h-4 text-[#2E86DE]" />
                          {emp.areaMin === emp.areaMax ? `${emp.areaMin}m²` : `${emp.areaMin ?? '?'}–${emp.areaMax ?? '?'}m²`}
                        </span>
                      )}
                      {emp.totalUnits && (
                        <span className="flex items-center gap-1">
                          <Layers className="w-4 h-4 text-[#2E86DE]" />{emp.totalUnits} unidades
                        </span>
                      )}
                      {emp.deliveryDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#2E86DE]" />{emp.deliveryDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {emp.priceMin ? (
                        <span className="text-[#0D2F5E] font-bold text-sm flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-[#2E86DE]" />
                          A partir de {formatCurrency(Number(emp.priceMin))}
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
