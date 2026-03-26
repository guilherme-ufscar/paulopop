import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gray'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-sky-100 text-sky-800',
  gray: 'bg-gray-100 text-gray-600',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

// Helpers para status de imóveis
export const propertyStatusBadge: Record<string, BadgeVariant> = {
  DRAFT: 'warning',
  ACTIVE: 'success',
  SOLD: 'info',
  RENTED: 'info',
  INACTIVE: 'gray',
  SUSPENDED: 'danger',
}

export const propertyStatusLabel: Record<string, string> = {
  DRAFT: 'Rascunho',
  ACTIVE: 'Ativo',
  SOLD: 'Vendido',
  RENTED: 'Alugado',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
}

export const leadStatusBadge: Record<string, BadgeVariant> = {
  NEW: 'info',
  CONTACTED: 'warning',
  QUALIFIED: 'default',
  PROPOSAL: 'success',
  CLOSED: 'success',
  LOST: 'danger',
}

export const leadStatusLabel: Record<string, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contatado',
  QUALIFIED: 'Qualificado',
  PROPOSAL: 'Proposta',
  CLOSED: 'Fechado',
  LOST: 'Perdido',
}
