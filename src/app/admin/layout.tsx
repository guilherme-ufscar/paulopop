import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D2F5E] text-white flex flex-col min-h-screen">
        <div className="p-6 border-b border-[#1A4A8A]">
          <h1 className="text-xl font-bold">Paulo Pop</h1>
          <p className="text-blue-300 text-sm">Painel Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#1A4A8A] transition-colors text-sm font-medium">
            Dashboard
          </a>
          <a href="/admin/imoveis" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#1A4A8A] transition-colors text-sm font-medium">
            Imóveis
          </a>
          <a href="/admin/contatos" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#1A4A8A] transition-colors text-sm font-medium">
            Leads & Contatos
          </a>
          <a href="/admin/analise-mercado" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#1A4A8A] transition-colors text-sm font-medium">
            Análise de Mercado
          </a>
          <a href="/admin/configuracoes" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#1A4A8A] transition-colors text-sm font-medium">
            Configurações
          </a>
        </nav>
        <div className="p-4 border-t border-[#1A4A8A]">
          <p className="text-sm text-blue-300">{session.user.name}</p>
          <a href="/api/auth/signout" className="text-xs text-blue-400 hover:text-white transition-colors">
            Sair
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
