import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

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
  title: 'Paulo Pop | Corretor de Imóveis',
  description: 'Encontre o imóvel dos seus sonhos com Paulo Pop. Especialista em compra, venda e aluguel de imóveis.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Paulo Pop Imóveis',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
