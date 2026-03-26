'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ViewCounterProps {
  propertyId: string
}

export function ViewCounter({ propertyId }: ViewCounterProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Evitar contar a mesma visita usando sessionStorage
    const key = `view_${propertyId}`
    if (sessionStorage.getItem(key)) return

    sessionStorage.setItem(key, '1')

    fetch(`/api/imoveis/${propertyId}/view`, { method: 'POST' }).catch(() => {})
  // pathname é incluído para re-registrar em navegações client-side
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, pathname])

  return null
}
