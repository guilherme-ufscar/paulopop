import { describe, it, expect } from 'vitest'
import { stripHtml, sanitizeHtml, limitString } from '@/lib/sanitize'

describe('stripHtml()', () => {
  it('remove tags HTML simples', () => {
    expect(stripHtml('<p>Olá</p>')).toBe('Olá')
  })

  it('remove múltiplas tags', () => {
    expect(stripHtml('<b>texto</b> <em>mais</em>')).toBe('texto mais')
  })

  it('não altera texto puro', () => {
    expect(stripHtml('Texto simples')).toBe('Texto simples')
  })
})

describe('sanitizeHtml()', () => {
  it('remove tags script', () => {
    const result = sanitizeHtml('<p>ok</p><script>alert("xss")</script>')
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('alert')
    expect(result).toContain('ok')
  })

  it('remove atributos on*', () => {
    const result = sanitizeHtml('<p onclick="evil()">texto</p>')
    expect(result).not.toContain('onclick')
  })

  it('remove href javascript:', () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">link</a>')
    expect(result).not.toContain('javascript:')
  })

  it('mantém tags permitidas', () => {
    const result = sanitizeHtml('<p>Texto <strong>negrito</strong></p>')
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })
})

describe('limitString()', () => {
  it('limita string ao tamanho máximo', () => {
    expect(limitString('abcdef', 3)).toBe('abc')
  })

  it('não altera strings menores que o limite', () => {
    expect(limitString('abc', 10)).toBe('abc')
  })

  it('remove caracteres nulos', () => {
    expect(limitString('a\0b\0c', 10)).toBe('abc')
  })
})
