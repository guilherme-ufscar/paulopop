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
  const config = await prisma.siteConfig.findFirst()

  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          <PublicShell
            ownerName={config?.ownerName ?? 'Paulo Pop'}
            ownerCompany={config?.ownerCompany ?? undefined}
            whatsapp={config?.ownerWhatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP}
            whatsappMessage={config?.whatsappMessage ?? 'Olá! Tenho interesse em um imóvel.'}
          >
            {children}
          </PublicShell>
        </Providers>
      </body>
    </html>
  )
}
