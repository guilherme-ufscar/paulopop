'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PropertyCreateModal } from '@/components/admin/PropertyCreateModal'

export default function NovoImovelPage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    router.push('/admin/imoveis')
  }

  return (
    <div>
      <PropertyCreateModal open={open} onClose={handleClose} />
    </div>
  )
}
