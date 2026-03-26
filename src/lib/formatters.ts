export function formatCurrency(value: number | null | undefined, currency = 'BRL'): string {
  if (value == null) return 'Sob consulta'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatArea(value: number | null | undefined): string {
  if (value == null) return '-'
  return `${new Intl.NumberFormat('pt-BR').format(value)} m²`
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}
