export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Globe, FileText, Building2 } from 'lucide-react'

export default async function EmpreendimentosAdminPage() {
  const items = await prisma.empreendimento.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  })

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F5E]">Empreendimentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lançamentos e projetos imobiliários</p>
        </div>
        <Link href="/admin/empreendimentos/novo"
          className="flex items-center gap-2 px-4 py-2 bg-[#0D2F5E] text-white rounded-xl text-sm font-medium hover:bg-[#081E3F] transition-colors">
          <Plus className="w-4 h-4" /> Novo empreendimento
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhum empreendimento cadastrado.</p>
          <Link href="/admin/empreendimentos/novo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D2F5E] text-white rounded-xl text-sm font-medium hover:bg-[#081E3F] transition-colors">
            <Plus className="w-4 h-4" /> Criar o primeiro
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(item => (
            <Link key={item.id} href={`/admin/empreendimentos/${item.id}`}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-40 bg-gray-100">
                {item.coverUrl ? (
                  <Image src={item.coverUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : item.images[0] ? (
                  <Image src={item.images[0].url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status === 'PUBLISHED' ? <><Globe className="w-3 h-3" /> Publicado</> : <><FileText className="w-3 h-3" /> Rascunho</>}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-[#0D2F5E] group-hover:text-[#2E86DE] transition-colors">{item.name}</h2>
                {item.tagline && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{item.tagline}</p>}
                {(item.city || item.neighborhood) && (
                  <p className="text-xs text-gray-400 mt-1">{[item.neighborhood, item.city].filter(Boolean).join(', ')}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
