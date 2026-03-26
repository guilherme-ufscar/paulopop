'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/imoveis': 'Imóveis',
  '/admin/imoveis/novo': 'Novo Imóvel',
  '/admin/contatos': 'Leads & Contatos',
  '/admin/analise-mercado': 'Análise de Mercado',
  '/admin/marketing': 'Marketing',
  '/admin/relatorios': 'Relatórios',
  '/admin/configuracoes': 'Configurações',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Fechar menu mobile ao trocar de rota
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#2E86DE] border-t-transparent" />
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  // Detecta o título da página pelo pathname (match mais longo primeiro)
  const pageTitle = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1] ?? 'Admin'

  const userName = session?.user?.name ?? 'Admin'

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <AdminSidebar
        userName={userName}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={pageTitle}
          onMenuClick={() => setMobileMenuOpen(true)}
          userName={userName}
        />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
