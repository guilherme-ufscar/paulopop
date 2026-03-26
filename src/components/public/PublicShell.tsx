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
}

export function PublicShell({
  children,
  ownerName,
  ownerCompany,
  whatsapp,
  whatsappMessage,
}: PublicShellProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer ownerName={ownerName} ownerCompany={ownerCompany ?? undefined} />
      {whatsapp && (
        <WhatsAppButton phone={whatsapp} message={whatsappMessage} />
      )}
    </>
  )
}
