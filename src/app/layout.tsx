export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { PublicShell } from '@/components/public/PublicShell'
import { prisma } from '@/lib/prisma'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Paulo Pop | Corretor de Imóveis',
    template: '%s | Paulo Pop',
  },
  description: 'Encontre o imóvel dos seus sonhos com Paulo Pop. Especialista em compra, venda e aluguel de imóveis.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Paulo Pop Imóveis',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, cityRows] = await Promise.all([
    prisma.siteConfig.findFirst(),
    prisma.property.findMany({
      where: { status: 'ACTIVE', city: { not: null } },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    }),
  ])
  const cities = cityRows.map((r: { city: string | null }) => r.city).filter(Boolean) as string[]

  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          {/* Skip link — acessibilidade (5.3) */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#0D2F5E] focus:text-white focus:rounded-lg focus:font-medium focus:text-sm"
          >
            Ir para o conteúdo principal
          </a>
          <PublicShell
            ownerName={config?.ownerName ?? 'Paulo Pop'}
            ownerCompany={config?.ownerCompany ?? undefined}
            whatsapp={config?.ownerWhatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP}
            whatsappMessage={config?.whatsappMessage ?? 'Olá! Tenho interesse em um imóvel.'}
            cities={cities}
          >
            {children}
          </PublicShell>
        </Providers>
      </body>
    </html>
  )
}
