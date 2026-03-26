import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const [totalProperties, activeProperties, totalLeads, newLeads] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'ACTIVE' } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
  ])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#0D2F5E] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total de Imóveis</p>
          <p className="text-3xl font-bold text-[#0D2F5E]">{totalProperties}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Imóveis Ativos</p>
          <p className="text-3xl font-bold text-[#2E86DE]">{activeProperties}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total de Leads</p>
          <p className="text-3xl font-bold text-[#0D2F5E]">{totalLeads}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Novos Leads</p>
          <p className="text-3xl font-bold text-green-500">{newLeads}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-[#0D2F5E]">Ações Rápidas</h2>
          </div>
          <div className="space-y-2">
            <a href="/admin/imoveis/novo" className="block w-full bg-[#2E86DE] hover:bg-[#1B6EC2] text-white text-center py-2.5 rounded-lg transition-colors font-medium">
              + Cadastrar Imóvel
            </a>
            <a href="/admin/imoveis" className="block w-full bg-[#0D2F5E] hover:bg-[#081E3F] text-white text-center py-2.5 rounded-lg transition-colors font-medium">
              Ver Todos os Imóveis
            </a>
            <a href="/admin/contatos" className="block w-full border border-[#0D2F5E] text-[#0D2F5E] hover:bg-[#0D2F5E] hover:text-white text-center py-2.5 rounded-lg transition-colors font-medium">
              CRM de Leads
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
