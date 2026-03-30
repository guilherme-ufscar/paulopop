export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { BarChart3, ExternalLink, FileText, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function AdminRelatoriosPage() {
  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 30,
    select: {
      id: true,
      ref: true,
      title: true,
      propertyType: true,
      city: true,
      state: true,
      marketAnalyses: {
        orderBy: { generatedAt: 'desc' },
        take: 1,
        select: {
          id: true,
          generatedAt: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F4F8]">
            <FileText className="h-5 w-5 text-[#2E86DE]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#0D2F5E]">Relatorios de analise</h2>
            <p className="text-sm text-gray-500">
              Acesse os relatorios publicos dos imoveis e a analise de mercado do painel.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-[#0D2F5E]">Imoveis com acesso a relatorios</h3>
            <p className="text-sm text-gray-500">Abra o relatorio publico ou continue pela analise de mercado.</p>
          </div>
          <span className="text-sm font-medium text-[#2E86DE]">{properties.length} imoveis</span>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <Search className="h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-600">Nenhum imovel cadastrado ainda.</p>
            <p className="max-w-md text-sm text-gray-400">
              Quando houver imoveis no sistema, eles aparecerao aqui para consulta de relatorios e analises.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {properties.map(property => {
              const latestAnalysis = property.marketAnalyses[0]

              return (
                <div key={property.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-mono text-gray-400">{property.ref}</p>
                    <h4 className="mt-1 font-medium text-[#0D2F5E]">
                      {property.title ?? property.propertyType ?? 'Imovel sem titulo'}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {property.propertyType ?? 'Tipo nao informado'}
                      {property.city ? ` • ${property.city}` : ''}
                      {property.state ? `, ${property.state}` : ''}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {latestAnalysis
                        ? `Ultima analise em ${latestAnalysis.generatedAt.toLocaleDateString('pt-BR')}`
                        : 'Nenhuma analise gerada ainda'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/relatorio/${property.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2E86DE] px-4 py-2 text-sm font-medium text-[#2E86DE] transition hover:bg-[#2E86DE] hover:text-white"
                      aria-label={`Abrir relatorio de ${property.title ?? property.ref}`}
                    >
                      <ExternalLink size={14} />
                      Abrir relatorio
                    </Link>
                    <Link
                      href="/admin/analise-mercado"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E86DE] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1B6EC2]"
                      aria-label={`Ir para analise de mercado de ${property.title ?? property.ref}`}
                    >
                      <BarChart3 size={14} />
                      Analise de mercado
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
