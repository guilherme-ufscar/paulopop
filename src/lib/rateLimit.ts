/**
 * Rate limiter em memória simples (sem dependências externas).
 * Adequado para instância única (Docker). Para multi-instância, usar Redis/Upstash.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

/**
 * Verifica se o IP está dentro do limite.
 * @param ip - endereço IP do cliente
 * @param limit - máximo de requisições
 * @param windowMs - janela em milissegundos
 * @returns true se permitido, false se bloqueado
 */
export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

// Limpeza periódica para evitar crescimento infinito do Map
setInterval(() => {
  const now = Date.now()
  store.forEach((entry, key) => {
    if (entry.resetAt <= now) store.delete(key)
  })
}, 60_000)
