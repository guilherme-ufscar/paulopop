/**
 * Sanitização simples de HTML sem dependências externas.
 * Remove tags potencialmente perigosas e atributos de eventos.
 * Para produção com conteúdo rico, considerar sanitize-html ou DOMPurify no client.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span', 'div',
])

/**
 * Remove todas as tags HTML — retorna apenas texto puro.
 * Usar quando o campo NÃO deve aceitar HTML.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

/**
 * Sanitiza HTML permitindo apenas tags seguras.
 * Remove scripts, event handlers e atributos perigosos.
 */
export function sanitizeHtml(input: string): string {
  // Remove scripts e estilos por completo
  let output = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove atributos de evento (on*)
  output = output.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')

  // Remove atributos href com javascript:
  output = output.replace(/\s+href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '')

  // Remove tags não permitidas
  output = output.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag: string) => {
    if (ALLOWED_TAGS.has(tag.toLowerCase())) return match
    return ''
  })

  return output.trim()
}

/**
 * Limita o tamanho de uma string e remove caracteres nulos.
 */
export function limitString(input: string, maxLength: number): string {
  return input.replace(/\0/g, '').substring(0, maxLength)
}
