import { describe, expect, it } from 'vitest'
import { normalizePropertyUpdateInput } from '@/lib/property-update'

describe('normalizePropertyUpdateInput()', () => {
  it('normaliza o payload do formulário antes do update', () => {
    const result = normalizePropertyUpdateInput({
      status: 'ACTIVE',
      bedrooms: '3',
      bathrooms: '2',
      floors: '12',
      price: '1250000.50',
      latitude: '-23.5505',
      contractType: '',
      registrationDate: '2026-04-14',
      expiryDate: '',
      agent: { id: 'agent-1' },
      images: [{ id: 'img-1' }],
      ref: 'ABC',
    })

    expect(result.bedrooms).toBe(3)
    expect(result.bathrooms).toBe(2)
    expect(result.floors).toBe(12)
    expect(result.price).toBe(1250000.5)
    expect(result.latitude).toBe(-23.5505)
    expect(result.contractType).toBeNull()
    expect(result.expiryDate).toBeNull()
    expect(result.registrationDate).toBe('2026-04-14T00:00:00.000Z')
    expect(result).not.toHaveProperty('agent')
    expect(result).not.toHaveProperty('images')
    expect(result).not.toHaveProperty('ref')
    expect(typeof result.publishedAt).toBe('string')
  })
})
