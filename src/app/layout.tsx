export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import Script from 'next/script'
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
    default: 'Paulo Pop | Corretor de Imóveis no DF',
    template: '%s | Paulo Pop',
  },
  description: 'Corretor de imóveis no DF. Compra, venda e aluguel em Samambaia, Águas Claras, Taguatinga e região. Consultoria personalizada com Paulo Pop — CRECI/DF.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Paulo Pop Imóveis',
  },
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

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
      <head>
        {GTM_ID && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
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
