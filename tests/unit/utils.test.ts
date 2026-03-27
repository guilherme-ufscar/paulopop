import { describe, it, expect } from 'vitest'
import { slugify, generateRef } from '@/lib/utils'

describe('slugify()', () => {
  it('converte texto simples para slug', () => {
    expect(slugify('Apartamento Residencial')).toBe('apartamento-residencial')
  })

  it('remove acentos', () => {
    expect(slugify('Imóvel São Paulo')).toBe('imovel-sao-paulo')
  })

  it('remove caracteres especiais', () => {
    expect(slugify('Casa & Terreno! (99m²)')).toBe('casa-terreno-99m')
  })

  it('colapsa múltiplos hifens', () => {
    expect(slugify('a  b   c')).toBe('a-b-c')
  })

  it('retorna string vazia para input vazio', () => {
    expect(slugify('')).toBe('')
  })
})

describe('generateRef()', () => {
  it('gera ref com formato correto (9 dígitos + hífen + 3 dígitos)', () => {
    const ref = generateRef()
    expect(ref).toMatch(/^\d{9}-\d{3}$/)
  })

  it('gera refs únicos em chamadas consecutivas', () => {
    const refs = new Set(Array.from({ length: 100 }, generateRef))
    // Deve ter alta unicidade (pode ter colisão rara, mas com 100 itens é muito improvável)
    expect(refs.size).toBeGreaterThan(90)
  })
})
