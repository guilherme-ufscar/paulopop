import { GoogleGenerativeAI } from '@google/generative-ai'

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada')
  return new GoogleGenerativeAI(apiKey)
}

interface PropertyData {
  propertyType?: string | null
  transactionType: string
  purpose: string
  city?: string | null
  state?: string | null
  neighborhood?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  suites?: number | null
  totalArea?: number | null
  usefulArea?: number | null
  price?: number | null
  features?: string[]
  lifestyles?: string[]
  condominiumFee?: number | null
  floors?: number | null
}

export async function generatePropertyDescription(data: PropertyData): Promise<{
  title: string
  description: string
  marketingDescription: string
  surroundingsInfo: string
}> {
  const genAI = getGemini()
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt = `Você é um especialista em marketing imobiliário brasileiro. Gere textos profissionais para o seguinte imóvel:

Tipo: ${data.propertyType ?? 'Não informado'}
Transação: ${data.transactionType === 'SALE' ? 'Venda' : 'Aluguel'}
Finalidade: ${data.purpose === 'RESIDENTIAL' ? 'Residencial' : 'Comercial'}
Localização: ${data.neighborhood ?? ''}, ${data.city ?? ''} - ${data.state ?? ''}
Quartos: ${data.bedrooms ?? 0} | Banheiros: ${data.bathrooms ?? 0} | Suítes: ${data.suites ?? 0}
Área total: ${data.totalArea ?? 0}m² | Área útil: ${data.usefulArea ?? 0}m²
Preço: ${data.price ? `R$ ${data.price.toLocaleString('pt-BR')}` : 'Sob consulta'}
Características: ${data.features?.join(', ') ?? 'Não informadas'}

Retorne um JSON válido com os campos:
- title: título atraente do imóvel (máx 80 chars)
- description: descrição completa para portal imobiliário (300-600 palavras, SEO-friendly)
- marketingDescription: descrição de marketing curta e impactante (MÁXIMO 350 caracteres)
- surroundingsInfo: informações sobre localização e arredores (100-200 palavras)

Retorne APENAS o JSON, sem markdown.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  try {
    return JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
    throw new Error('Resposta da IA em formato inválido')
  }
}

export async function generateMarketAnalysis(property: {
  propertyType?: string | null
  city?: string | null
  state?: string | null
  neighborhood?: string | null
  totalArea?: number | null
  bedrooms?: number | null
  price?: number | null
}): Promise<{
  optimisticValue: number
  marketValue: number
  competitiveValue: number
  pricePositioning: string
  marketDemand: string
  absoptionTime: number
  aiSummary: string
  aiStrengths: string[]
  aiWeaknesses: string[]
  aiOpportunities: string[]
  aiRecommendations: string[]
}> {
  const genAI = getGemini()
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt = `Você é um analista imobiliário especialista no mercado brasileiro. Analise o imóvel abaixo e forneça uma análise de mercado realista:

Tipo: ${property.propertyType ?? 'Não informado'}
Localização: ${property.neighborhood ?? ''}, ${property.city ?? ''} - ${property.state ?? ''}
Área: ${property.totalArea ?? 0}m²
Quartos: ${property.bedrooms ?? 0}
Preço atual: ${property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'Não informado'}

Retorne um JSON válido com:
- optimisticValue: valor otimista em reais (number)
- marketValue: valor de mercado em reais (number)
- competitiveValue: valor competitivo em reais (number)
- pricePositioning: "Abaixo do mercado" | "Dentro do mercado" | "Acima do mercado"
- marketDemand: "Alta" | "Média" | "Baixa"
- absoptionTime: tempo estimado de venda em dias (number)
- aiSummary: resumo da análise (2-3 parágrafos)
- aiStrengths: array de 3-5 pontos fortes (strings)
- aiWeaknesses: array de 2-4 pontos de atenção (strings)
- aiOpportunities: array de 2-4 oportunidades (strings)
- aiRecommendations: array de 3-5 recomendações estratégicas (strings)

Retorne APENAS o JSON, sem markdown.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  try {
    return JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
    throw new Error('Resposta da IA em formato inválido')
  }
}

export async function generateMarketingPlan(property: {
  title?: string | null
  propertyType?: string | null
  city?: string | null
  price?: number | null
}): Promise<string> {
  const genAI = getGemini()
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt = `Crie um plano de marketing imobiliário completo em Markdown para:
Imóvel: ${property.title ?? property.propertyType ?? 'Imóvel'}
Cidade: ${property.city ?? 'Não informada'}
Preço: ${property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'Sob consulta'}

Inclua: objetivos, canais digitais e offline, cronograma de 90 dias, orçamento sugerido, métricas de sucesso.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function generateContract(
  property: { title?: string | null; address?: string | null; price?: number | null },
  ownerName: string
): Promise<string> {
  const genAI = getGemini()
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt = `Crie um contrato de autorização de venda/representação imobiliária em português brasileiro para:
Imóvel: ${property.title ?? 'Imóvel'} - ${property.address ?? ''}
Proprietário: ${ownerName}
Valor: ${property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'A definir'}
Corretor: Paulo Pop

Formato: Markdown bem estruturado com todas as cláusulas legais básicas. Nota: este é um modelo, deve ser revisado por advogado.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
