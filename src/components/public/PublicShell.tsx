'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

interface PublicShellProps {
  children: React.ReactNode
  ownerName?: string
  ownerCompany?: string
  whatsapp?: string
  whatsappMessage?: string
  cities?: string[]
}

export function PublicShell({
  children,
  ownerName,
  ownerCompany,
  whatsapp,
  whatsappMessage,
  cities,
}: PublicShellProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer ownerName={ownerName} ownerCompany={ownerCompany ?? undefined} cities={cities} />
      {whatsapp && (
        <WhatsAppButton phone={whatsapp} message={whatsappMessage} />
      )}
    </>
  )
}
