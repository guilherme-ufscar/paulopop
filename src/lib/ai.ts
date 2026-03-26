import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-20250514'

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada')
  return new Anthropic({ apiKey })
}

/** Chama a Claude API e retorna o texto da resposta */
async function callClaude(prompt: string, maxTokens = 2048): Promise<string> {
  const client = getClient()
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = msg.content[0]
  if (block.type !== 'text') throw new Error('Resposta inesperada da Claude API')
  return block.text.trim()
}

/** Extrai JSON de uma resposta que pode ter markdown ao redor */
function extractJson<T>(text: string): T {
  // Remove blocos ```json ... ```
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as T
    throw new Error('Resposta da IA em formato JSON inválido')
  }
}

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface PropertyDescriptionInput {
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
  landArea?: number | null
  price?: number | null
  condominiumFee?: number | null
  iptu?: number | null
  floors?: number | null
  constructionYear?: number | null
  condition?: string | null
  features?: string[]
  lifestyles?: string[]
}

export interface PropertyDescriptionOutput {
  title: string
  description: string
  marketingDescription: string
  surroundingsInfo: string
  titleEn: string
  descriptionEn: string
}

export interface MarketAnalysisInput {
  propertyType?: string | null
  city?: string | null
  state?: string | null
  neighborhood?: string | null
  totalArea?: number | null
  bedrooms?: number | null
  price?: number | null
  features?: string[]
  comparables?: Array<{
    propertyType?: string | null
    totalArea?: number | null
    price?: number | null
    status: string
    neighborhood?: string | null
    createdAt: string
  }>
}

export interface MarketAnalysisOutput {
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
  avgPricePerSqmRegion: number
}

// ─── Funções de geração ────────────────────────────────────────────────────

export async function generatePropertyDescription(
  data: PropertyDescriptionInput
): Promise<PropertyDescriptionOutput> {
  const featureMap: Record<string, string> = {
    POOL: 'Piscina', GARDEN: 'Jardim', GARAGE: 'Garagem', JACUZZI: 'Jacuzzi',
    SOLAR_HEATING: 'Aquecimento Solar', ACCEPTS_PETS: 'Aceita Pets',
    GOURMET_BALCONY: 'Varanda Gourmet', BARBECUE: 'Churrasqueira',
    ELEVATOR: 'Elevador', GYM: 'Academia', FURNISHED: 'Mobiliado',
    AIR_CONDITIONING: 'Ar condicionado', SECURITY_24H: 'Segurança 24h',
    PARTY_ROOM: 'Salão de Festas', SAUNA: 'Sauna',
  }

  const featuresText = data.features?.map(f => featureMap[f] ?? f).join(', ') ?? 'Não informadas'
  const transaction = data.transactionType === 'SALE' ? 'Venda' : 'Aluguel'
  const purpose = data.purpose === 'RESIDENTIAL' ? 'Residencial' : 'Comercial'

  const prompt = `Você é um especialista sênior em marketing imobiliário brasileiro com 20 anos de experiência. Sua tarefa é criar textos persuasivos e profissionais para o imóvel abaixo.

## Dados do Imóvel
- **Tipo:** ${data.propertyType ?? 'Não informado'}
- **Transação:** ${transaction} | **Finalidade:** ${purpose}
- **Localização:** ${data.neighborhood ?? ''}, ${data.city ?? ''} - ${data.state ?? ''}
- **Dormitórios:** ${data.bedrooms ?? 0} | **Banheiros:** ${data.bathrooms ?? 0} | **Suítes:** ${data.suites ?? 0}
- **Área Total:** ${data.totalArea ?? 0}m² | **Área Útil:** ${data.usefulArea ?? 0}m²
- **Preço:** ${data.price ? `R$ ${data.price.toLocaleString('pt-BR')}` : 'Sob consulta'}
- **Condomínio:** ${data.condominiumFee ? `R$ ${data.condominiumFee.toLocaleString('pt-BR')}/mês` : 'Não informado'}
- **IPTU:** ${data.iptu ? `R$ ${data.iptu.toLocaleString('pt-BR')}` : 'Não informado'}
- **Ano de Construção:** ${data.constructionYear ?? 'Não informado'}
- **Características:** ${featuresText}

## Instruções
1. **Tom:** profissional, persuasivo, premium — sem clichês ("sonho", "oportunidade imperdível")
2. **SEO:** incluir palavras-chave naturais (tipo + cidade + bairro)
3. **Diferenciais:** destacar características exclusivas do imóvel
4. **Idioma PT-BR:** correto, elegante e envolvente

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`) com os campos:
{
  "title": "Título atraente e SEO-friendly (máx 80 chars)",
  "description": "Descrição completa para portal imobiliário (400-700 palavras, em parágrafos)",
  "marketingDescription": "Texto impactante para anúncios e redes sociais (MÁXIMO 350 caracteres)",
  "surroundingsInfo": "Informações sobre localização, bairro, pontos de interesse, transporte (150-250 palavras)",
  "titleEn": "SEO-optimized English title (max 80 chars)",
  "descriptionEn": "Complete English description (300-500 words)"
}`

  const text = await callClaude(prompt, 3000)
  return extractJson<PropertyDescriptionOutput>(text)
}

export async function generateMarketAnalysis(
  data: MarketAnalysisInput
): Promise<MarketAnalysisOutput> {
  const comparablesText = data.comparables?.length
    ? data.comparables.map(c =>
        `- ${c.propertyType ?? 'Imóvel'} | ${c.neighborhood ?? ''} | ${c.totalArea ?? 0}m² | ` +
        `${c.price ? `R$ ${c.price.toLocaleString('pt-BR')}` : 'sem preço'} | ${c.status} | ${c.createdAt.slice(0, 7)}`
      ).join('\n')
    : 'Sem comparáveis disponíveis no banco'

  const prompt = `Você é um analista imobiliário sênior especialista no mercado brasileiro. Analise o imóvel e os comparáveis para fornecer uma avaliação precisa e fundamentada.

## Imóvel Analisado
- **Tipo:** ${data.propertyType ?? 'Não informado'}
- **Localização:** ${data.neighborhood ?? ''}, ${data.city ?? ''} - ${data.state ?? ''}
- **Área:** ${data.totalArea ?? 0}m²
- **Dormitórios:** ${data.bedrooms ?? 0}
- **Preço atual:** ${data.price ? `R$ ${data.price.toLocaleString('pt-BR')}` : 'Não definido'}
- **Características:** ${data.features?.join(', ') ?? 'Não informadas'}

## Imóveis Comparáveis (mesmo tipo/cidade)
${comparablesText}

## Instruções
- Base os valores nos comparáveis reais quando disponíveis
- O valor competitivo deve ser ~5-10% abaixo do mercado
- O valor otimista deve ser ~5-10% acima do mercado
- Seja realista e conservador nas estimativas
- Considere o mercado imobiliário brasileiro atual

Retorne APENAS um JSON válido (sem markdown):
{
  "optimisticValue": number_em_reais,
  "marketValue": number_em_reais,
  "competitiveValue": number_em_reais,
  "pricePositioning": "Abaixo do mercado" | "Dentro do mercado" | "Acima do mercado",
  "marketDemand": "Alta" | "Média" | "Baixa",
  "absoptionTime": number_em_dias,
  "avgPricePerSqmRegion": number_preco_medio_m2,
  "aiSummary": "Resumo executivo da análise em 2-3 parágrafos",
  "aiStrengths": ["ponto forte 1", "ponto forte 2", ...],
  "aiWeaknesses": ["ponto de atenção 1", ...],
  "aiOpportunities": ["oportunidade 1", ...],
  "aiRecommendations": ["recomendação 1", ...]
}`

  const text = await callClaude(prompt, 2500)
  return extractJson<MarketAnalysisOutput>(text)
}

export async function generateMarketingPlan(property: {
  title?: string | null
  propertyType?: string | null
  city?: string | null
  state?: string | null
  neighborhood?: string | null
  price?: number | null
  bedrooms?: number | null
  totalArea?: number | null
  transactionType: string
  features?: string[]
}): Promise<string> {
  const prompt = `Você é um especialista em marketing digital imobiliário. Crie um plano de marketing completo e detalhado para o imóvel abaixo.

## Imóvel
- **${property.propertyType ?? 'Imóvel'}** — ${property.title ?? ''}
- **Localização:** ${property.neighborhood ?? ''}, ${property.city ?? ''} - ${property.state ?? ''}
- **Transação:** ${property.transactionType === 'SALE' ? 'Venda' : 'Aluguel'}
- **Preço:** ${property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'Sob consulta'}
- **Perfil:** ${property.bedrooms ?? 0} dorms | ${property.totalArea ?? 0}m²

## Plano de Marketing (formato Markdown)

Crie um plano profissional e acionável com:
1. **Resumo Executivo** — objetivo e posicionamento
2. **Público-Alvo** — perfil demográfico, psicográfico e comportamental
3. **Canais de Divulgação** — portais (ZAP, VivaReal, OLX), redes sociais (Instagram, Facebook, YouTube), WhatsApp, e-mail marketing, Google Ads
4. **Calendário de Ações** — cronograma de 90 dias semana a semana
5. **Orçamento Sugerido** — tabela com valores por canal
6. **KPIs e Métricas** — como medir o sucesso
7. **Dicas de Fotos e Vídeos** — orientações para material visual

Seja específico, prático e orientado a resultados. Use tabelas e listas quando apropriado.`

  return callClaude(prompt, 3500)
}

export async function generateContract(
  property: {
    title?: string | null
    ref?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    price?: number | null
    contractType?: string | null
    captureCommissionPct?: number | null
    saleCommissionPct?: number | null
    expiryDate?: string | null
  },
  owner: { name: string; cpf?: string | null; phone?: string | null; email?: string | null },
  agent: { name: string; creci?: string | null; company?: string | null }
): Promise<string> {
  const contractTypeMap: Record<string, string> = {
    EXCLUSIVE: 'Exclusividade', OPEN: 'Aberta', AUTHORIZATION: 'Autorização de Venda',
  }

  const prompt = `Você é um advogado especialista em direito imobiliário brasileiro. Crie um contrato de autorização/representação imobiliária completo e juridicamente válido no Brasil.

## Dados do Contrato

**IMÓVEL:**
- Descrição: ${property.title ?? 'Imóvel residencial'}
- Ref: ${property.ref ?? 'N/A'}
- Endereço: ${property.address ?? ''}, ${property.city ?? ''} - ${property.state ?? ''}
- Valor de Venda: ${property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'A definir'}
- Tipo de Contrato: ${property.contractType ? contractTypeMap[property.contractType] : 'Autorização de Venda'}

**PROPRIETÁRIO (OUTORGANTE):**
- Nome: ${owner.name}
- CPF: ${owner.cpf ?? 'A preencher'}
- Telefone: ${owner.phone ?? 'A preencher'}
- E-mail: ${owner.email ?? 'A preencher'}

**CORRETOR (OUTORGADO):**
- Nome: ${agent.name}
- CRECI: ${agent.creci ?? 'A preencher'}
- Empresa: ${agent.company ?? 'Autônomo'}

**COMISSÃO:**
- Captação: ${property.captureCommissionPct ?? 0}%
- Venda: ${property.saleCommissionPct ?? 6}%

**VIGÊNCIA:** ${property.expiryDate ? `até ${property.expiryDate.slice(0, 10)}` : '90 dias a partir da assinatura'}

## Instruções
- Inclua todas as cláusulas obrigatórias conforme lei 6.530/78 e código civil
- Cláusulas sobre exclusividade (se aplicável), rescisão, obrigações das partes, pagamento de comissão
- Nota de rodapé: "Este é um modelo de contrato. Recomenda-se revisão por advogado habilitado."
- Formato: HTML semântico bem estruturado com h2, h3, p, ol, table para os campos
- Inclua campos para data e assinatura no final
- Espaçadores [____] para dados a preencher manualmente`

  return callClaude(prompt, 4000)
}
