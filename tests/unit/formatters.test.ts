import { describe, it, expect } from 'vitest'
import { formatCurrency, formatArea, formatDate } from '@/lib/formatters'

describe('formatCurrency()', () => {
  it('formata valor em R$', () => {
    const result = formatCurrency(500000)
    expect(result).toContain('500')
    expect(result).toContain('R$')
  })

  it('retorna "Sob consulta" para null', () => {
    expect(formatCurrency(null)).toBe('Sob consulta')
  })

  it('retorna "Sob consulta" para undefined', () => {
    expect(formatCurrency(undefined)).toBe('Sob consulta')
  })

  it('formata zero como R$ 0', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })
})

describe('formatArea()', () => {
  it('formata área com m²', () => {
    expect(formatArea(120)).toContain('m²')
    expect(formatArea(120)).toContain('120')
  })

  it('retorna "-" para null', () => {
    expect(formatArea(null)).toBe('-')
  })

  it('retorna "-" para undefined', () => {
    expect(formatArea(undefined)).toBe('-')
  })
})

describe('formatDate()', () => {
  it('formata data no padrão brasileiro', () => {
    // Usar data com hora local para evitar problema de fuso horário
    const date = new Date(2024, 11, 25) // mês é 0-indexed
    const result = formatDate(date)
    expect(result).toContain('25')
    expect(result).toContain('2024')
  })

  it('retorna "-" para null', () => {
    expect(formatDate(null)).toBe('-')
  })
})
