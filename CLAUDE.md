# CLAUDE.md — Paulo Pop | Portal Imobiliário

> **Instrução para o Claude Code**: Este arquivo é o documento central de desenvolvimento do projeto. Leia-o integralmente antes de qualquer ação. Siga todas as instruções com precisão. Nunca assuma comportamentos não descritos aqui sem antes consultar este documento.

---

## 📋 Visão Geral do Projeto

**Nome do site**: Paulo Pop  
**Tipo**: Portal imobiliário full-stack com painel administrativo completo  
**Domínio-alvo**: [configurar pelo cliente]  
**Idioma principal**: Português (Brasil)  
**Stack**: Next.js 14 (App Router) + TypeScript + PostgreSQL + Prisma + NextAuth.js  
**Objetivo**: Sistema completo para corretor imobiliário cadastrar, gerenciar e publicar imóveis, com frontend público para compradores/locatários, análise de mercado integrada via IA e ferramentas de marketing.

---

## 🎯 Regras Absolutas de Desenvolvimento

1. **Sempre commitar no GitHub após cada mudança** — sem exceções. Se o repositório não existir, perguntar o nome antes de criar.
2. **Nunca usar `<form>` HTML nativo em componentes React** — usar `onSubmit` via `handleSubmit` com event handlers.
3. **Todo código deve ser TypeScript estrito** — sem `any` implícito.
4. **Prisma migrations** obrigatórias para toda mudança de schema — nunca editar o banco diretamente.
5. **Variáveis de ambiente** nunca hardcoded — sempre via `.env.local` e `.env.example` documentado.
6. **Google Stitch** deve ser usado como referência obrigatória para geração de todos os componentes visuais do frontend — consultar o Stitch para cada novo componente antes de implementar.
7. **Responsividade obrigatória** — mobile-first em todos os componentes.
8. **Acessibilidade (a11y)** — atributos ARIA em todos os elementos interativos.

---

## 🎨 Design System & Frontend

### Paleta de Cores (obrigatória)

```css
:root {
  /* Primária */
  --color-primary:       #0D2F5E;   /* Azul escuro institucional */
  --color-primary-dark:  #081E3F;   /* Azul escuro hover/sombra */
  --color-primary-light: #1A4A8A;   /* Azul escuro variante clara */

  /* Secundária */
  --color-secondary:     #2E86DE;   /* Azul claro principal */
  --color-secondary-light: #5BA4F5; /* Azul claro hover */
  --color-secondary-dark:  #1B6EC2; /* Azul claro sombra */

  /* Neutros */
  --color-white:         #FFFFFF;
  --color-off-white:     #F7F9FC;
  --color-gray-50:       #F0F4F8;
  --color-gray-100:      #E2E8F0;
  --color-gray-200:      #CBD5E0;
  --color-gray-400:      #94A3B8;
  --color-gray-600:      #64748B;
  --color-gray-800:      #1E293B;
  --color-black:         #0A0F1E;

  /* Semânticas */
  --color-success:       #10B981;
  --color-warning:       #F59E0B;
  --color-danger:        #EF4444;
  --color-info:          #3B82F6;

  /* Gradientes */
  --gradient-hero:       linear-gradient(135deg, #0D2F5E 0%, #1A4A8A 50%, #2E86DE 100%);
  --gradient-card:       linear-gradient(180deg, rgba(13,47,94,0) 60%, rgba(13,47,94,0.85) 100%);
  --gradient-cta:        linear-gradient(90deg, #2E86DE, #5BA4F5);
}
```

### Tipografia

```css
/* Importar via next/font/google */
/* Display: Playfair Display (títulos principais, nome do site) */
/* Body: DM Sans (textos, labels, UI) */
/* Mono: JetBrains Mono (preços, IDs de imóveis) */
```

### Referências Visuais Obrigatórias

- **Frontend público**: Inspirado nas imagens `1774531453357_image.png` (home/listagem) e `1774531489822_image.png` (página de produto/imóvel). Replicar a estrutura de navegação, cards de imóveis, galeria, seção de contato e layout de detalhes do imóvel.
- **Google Stitch**: Usar **obrigatoriamente** como ferramenta de referência para gerar todos os componentes visuais. Para cada novo componente de UI, consultar o Stitch antes de implementar.
- **Painel Admin**: Inspirado nas imagens `1774530968339_image.png` (modal de cadastro), `1774531004107_image.png` (formulário principal), `1774531022516_image.png` (aba Descrição), `1774531038390_image.png` (Imagens e Vídeos), `1774531050433_image.png` (Documentos) e `1774531242049_image.png` (Representação/Marketing).

---

## 🗂️ Estrutura do Projeto

```
paulo-pop/
├── CLAUDE.md                          ← este arquivo (raiz do projeto)
├── .env.local                         ← variáveis de ambiente (não comitar)
├── .env.example                       ← template das variáveis (comitar)
├── prisma/
│   ├── schema.prisma                  ← schema completo do banco
│   └── migrations/                    ← migrations geradas pelo Prisma
├── public/
│   ├── images/
│   │   ├── owner-photo.jpg            ← foto do dono (Paulo Pop)
│   │   └── og-default.jpg            ← imagem OG padrão
│   └── icons/
├── src/
│   ├── app/                           ← Next.js App Router
│   │   ├── layout.tsx                 ← layout raiz (fontes, providers)
│   │   ├── page.tsx                   ← home pública
│   │   ├── imoveis/
│   │   │   ├── page.tsx               ← listagem de imóveis
│   │   │   └── [slug]/
│   │   │       └── page.tsx           ← página do imóvel (produto)
│   │   ├── sobre/
│   │   │   └── page.tsx               ← sobre o corretor
│   │   ├── contato/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx             ← layout do painel admin
│   │   │   ├── page.tsx               ← dashboard admin
│   │   │   ├── imoveis/
│   │   │   │   ├── page.tsx           ← listagem admin
│   │   │   │   ├── novo/
│   │   │   │   │   └── page.tsx       ← cadastro de imóvel
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       ← edição de imóvel
│   │   │   ├── contatos/
│   │   │   │   └── page.tsx           ← CRM de leads
│   │   │   ├── analise-mercado/
│   │   │   │   └── page.tsx           ← análise de mercado por IA
│   │   │   ├── marketing/
│   │   │   │   └── page.tsx           ← artes e materiais
│   │   │   ├── relatorios/
│   │   │   │   └── page.tsx
│   │   │   └── configuracoes/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── imoveis/
│   │       │   ├── route.ts           ← GET (listagem) / POST (criar)
│   │       │   └── [id]/
│   │       │       └── route.ts       ← GET / PUT / DELETE
│   │       ├── upload/
│   │       │   └── route.ts           ← upload de imagens/docs
│   │       ├── analise-mercado/
│   │       │   └── route.ts           ← análise IA via Claude/OpenAI
│   │       ├── leads/
│   │       │   └── route.ts
│   │       ├── cep/
│   │       │   └── route.ts           ← proxy ViaCEP
│   │       └── sitemap/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                        ← componentes base (shadcn/ui customizado)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── public/                    ← componentes do frontend público
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx        ← hero com foto do dono + busca
│   │   │   ├── OwnerCard.tsx          ← card com foto/nome Paulo Pop
│   │   │   ├── PropertyCard.tsx       ← card de imóvel na listagem
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyFilters.tsx    ← filtros: tipo, preço, quartos
│   │   │   ├── PropertyGallery.tsx    ← galeria lightbox na página do produto
│   │   │   ├── PropertyDetails.tsx    ← detalhes completos do imóvel
│   │   │   ├── SimilarProperties.tsx  ← imóveis similares (carrossel)
│   │   │   ├── ContactForm.tsx        ← formulário de contato/lead
│   │   │   ├── WhatsAppButton.tsx     ← botão flutuante WhatsApp
│   │   │   ├── MapEmbed.tsx           ← mapa OpenStreetMap/Google
│   │   │   └── SearchBar.tsx
│   │   └── admin/                     ← componentes do painel admin
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminHeader.tsx
│   │       ├── PropertyForm/
│   │       │   ├── index.tsx          ← formulário principal com abas
│   │       │   ├── TabPrincipal.tsx
│   │       │   ├── TabDescricao.tsx
│   │       │   ├── TabImagensVideos.tsx
│   │       │   ├── TabDocumentos.tsx
│   │       │   ├── TabPotencialComprador.tsx
│   │       │   ├── TabCorretores.tsx
│   │       │   ├── TabAtividades.tsx
│   │       │   ├── TabContatos.tsx
│   │       │   ├── TabPortais.tsx
│   │       │   └── TabHistorico.tsx
│   │       ├── MarketAnalysis/
│   │       │   ├── index.tsx
│   │       │   ├── PriceChart.tsx
│   │       │   ├── MarketPositionCard.tsx
│   │       │   └── AIInsightPanel.tsx
│   │       ├── CRMTable.tsx
│   │       ├── DashboardStats.tsx
│   │       └── AITextToolkit.tsx      ← gerador de descrição por IA
│   ├── lib/
│   │   ├── prisma.ts                  ← cliente Prisma singleton
│   │   ├── auth.ts                    ← configuração NextAuth
│   │   ├── validations.ts             ← schemas Zod
│   │   ├── utils.ts                   ← utilitários gerais
│   │   ├── formatters.ts              ← formatação de moeda, área, etc.
│   │   ├── slugify.ts
│   │   ├── upload.ts                  ← helpers de upload (Cloudinary/S3)
│   │   └── ai.ts                      ← cliente Claude/OpenAI para IA
│   ├── hooks/
│   │   ├── useProperty.ts
│   │   ├── useMarketAnalysis.ts
│   │   ├── useImageUpload.ts
│   │   └── useDebounce.ts
│   └── types/
│       ├── property.ts
│       ├── user.ts
│       └── market.ts
```

---

## 🗄️ Schema do Banco de Dados (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Usuários / Corretores ────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String    // bcrypt hash
  role          UserRole  @default(AGENT)
  phone         String?
  whatsapp      String?
  creci         String?
  bio           String?
  avatarUrl     String?
  company       String?   // ex: "RE/MAX INOVELAR"
  companyCreci  String?
  instagram     String?
  facebook      String?
  linkedin      String?
  youtube       String?
  telegram      String?
  twitter       String?
  active        Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  properties    Property[]
  leads         Lead[]
  activities    Activity[]

  @@map("users")
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  AGENT
}

// ─── Imóveis ──────────────────────────────────────────────────────────────────

model Property {
  id                    String            @id @default(cuid())
  ref                   String            @unique  // ex: "880391001-184"
  slug                  String            @unique  // SEO-friendly URL

  // Classificação básica (modal de cadastro inicial)
  purpose               PropertyPurpose   @default(RESIDENTIAL)  // Residencial | Comercial
  transactionType       TransactionType   @default(SALE)         // Para Venda | Para Alugar
  location              LocationType      @default(BRAZIL)       // No Brasil | No Exterior

  // Status e datas
  status                PropertyStatus    @default(DRAFT)
  contractType          ContractType?
  registrationDate      DateTime          @default(now())
  expiryDate            DateTime?
  hideOnSite            Boolean           @default(false)

  // Tipo do imóvel
  propertyType          String?           // Apartamento, Casa, Terreno, etc.
  marketStatus          String?           // Status no mercado
  condition             String?           // Condição (Novo, Usado, etc.)
  category              String?           // Categoria
  landUse               String?           // Uso do terreno
  availabilityDate      DateTime?
  constructionYear      Int?

  // Preços e valores
  price                 Decimal?          @db.Decimal(15, 2)
  priceType             PriceType?        // Valor fixo, Sob consulta, etc.
  pricePerSqm           Decimal?          @db.Decimal(10, 2)
  hidePrice             Boolean           @default(false)
  iptu                  Decimal?          @db.Decimal(10, 2)
  iptuPeriod            String?           // Mensal, Anual
  condominiumFee        Decimal?          @db.Decimal(10, 2)
  condominiumFeePeriod  String?

  // Comissões
  captureCommissionPct  Decimal?          @db.Decimal(5, 2)
  captureCommissionAmt  Decimal?          @db.Decimal(10, 2)
  captureCommissionType CommissionType    @default(PERCENTAGE)
  saleCommissionPct     Decimal?          @db.Decimal(5, 2)
  saleCommissionAmt     Decimal?          @db.Decimal(10, 2)
  saleCommissionType    CommissionType    @default(PERCENTAGE)

  // Financeiro
  iptuRegistration      String?           // Nº Contrib. IPTU/ITR
  registryNumber        String?           // Número do Registro
  financialNotes        String?

  // Dimensões e áreas
  totalArea             Decimal?          @db.Decimal(10, 2)
  usefulArea            Decimal?          @db.Decimal(10, 2)
  landArea              Decimal?          @db.Decimal(10, 2)
  cubicVolume           Decimal?          @db.Decimal(10, 2)
  landDimensionWidth    Decimal?          @db.Decimal(10, 2)
  landDimensionLength   Decimal?          @db.Decimal(10, 2)
  floors                Int?              // Nº Andares
  unitsInBuilding       Int?              // Nº de Aptos no Edifício
  maxOccupancy          Int?
  totalParkingSpots     Int?
  plateRestriction      Boolean           @default(false)  // Faixa ou Placa

  // Vagas (até 3 linhas com tipo + quantidade)
  parkingSpots          ParkingSpot[]

  // Ambientes
  environments          Int?              @default(0)
  bedrooms              Int?              @default(0)
  bathrooms             Int?              @default(0)
  suites                Int?              @default(0)
  rooms                 Room[]

  // Localização
  zipCode               String?
  address               String?
  number                String?
  complement            String?
  landmark              String?           // Ponto de referência
  neighborhood          String?
  commercialNeighborhood String?          // Bairro Comercial (Zap/Viva)
  city                  String?
  state                 String?
  region                String?
  floor                 String?           // Andar
  buildingFloors        Int?
  latitude              Decimal?          @db.Decimal(10, 7)
  longitude             Decimal?          @db.Decimal(10, 7)
  showFullAddress       Boolean           @default(false)
  keyNumber             String?           // Nº da Chave

  // Descrições (aba Descrição)
  title                 String?
  description           String?           @db.Text  // Descrição do Portal
  marketingDescription  String?           @db.Text  // Descrição de Marketing (max 350 chars)
  surroundingsInfo      String?           @db.Text  // Localização e arredores
  titleEn               String?           // Título em inglês
  descriptionEn         String?           @db.Text

  // Características do imóvel (checkboxes)
  features              PropertyFeature[]

  // Estilo de vida (checkboxes)
  lifestyles            PropertyLifestyle[]

  // Condomínio/Empreendimento
  condominiumId         String?
  condominium           Condominium?      @relation(fields: [condominiumId], references: [id])

  // Proprietário
  ownerId               String?
  owner                 Contact?          @relation(fields: [ownerId], references: [id])
  ownerName             String?           // Campo alternativo se não cadastrado

  // Corretor responsável
  agentId               String
  agent                 User              @relation(fields: [agentId], references: [id])
  secondaryAgentId      String?

  // Portais de publicação
  portals               PropertyPortal[]

  // Taxas adicionais
  additionalFees        AdditionalFee[]

  // Mídia
  images                PropertyImage[]
  videos                PropertyVideo[]
  documents             PropertyDocument[]
  virtualTourType       VirtualTourType   @default(NONE)
  virtualTourUrl        String?
  externalLink          String?

  // Análise de mercado
  marketAnalyses        MarketAnalysis[]

  // Leads e atividades
  leads                 Lead[]
  activities            Activity[]

  // Metadados
  views                 Int               @default(0)
  favorites             Int               @default(0)
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  publishedAt           DateTime?

  @@index([status, transactionType, purpose])
  @@index([city, state])
  @@index([price])
  @@index([slug])
  @@map("properties")
}

// Enums de imóvel
enum PropertyPurpose    { RESIDENTIAL COMMERCIAL }
enum TransactionType    { SALE RENT }
enum LocationType       { BRAZIL ABROAD }
enum PropertyStatus     { DRAFT ACTIVE SOLD RENTED INACTIVE SUSPENDED }
enum ContractType       { EXCLUSIVE OPEN AUTHORIZATION }
enum PriceType          { FIXED ON_REQUEST NEGOTIABLE }
enum CommissionType     { PERCENTAGE AMOUNT }
enum VirtualTourType    { NONE BANIB OTHER }

model ParkingSpot {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  quantity     Int       @default(0)
  type         String?   // Coberta, Descoberta, Box, etc.
  @@map("parking_spots")
}

model Room {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  name         String    // Sala de Estar, Cozinha, etc.
  area         Decimal?  @db.Decimal(8, 2)
  description  String?
  @@map("rooms")
}

// Características (checkboxes) — tabela de referência
model PropertyFeature {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  feature      FeatureType
  @@unique([propertyId, feature])
  @@map("property_features")
}

enum FeatureType {
  POOL GARDEN GARAGE JACUZZI SOLAR_HEATING ACCEPTS_PETS
  INDIVIDUAL_GAS_METER WHEELCHAIR_ACCESSIBLE GOURMET_BALCONY
  BARBECUE ELEVATOR GYM PARTY_ROOM PLAYGROUND SAUNA
  SECURITY_24H INTERCOM ALARM GENERATOR FURNISHED SEMI_FURNISHED
  AIR_CONDITIONING WOOD_FLOOR CERAMIC_FLOOR MARBLE_FLOOR
}

model PropertyLifestyle {
  id           String        @id @default(cuid())
  propertyId   String
  property     Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  lifestyle    LifestyleType
  @@unique([propertyId, lifestyle])
  @@map("property_lifestyles")
}

enum LifestyleType {
  RETIREMENT WATER_SPRING BEACH GOLF INVESTMENT METROPOLIS
  RANCH SKI_RESORT HOT_CLIMATE COUNTRYSIDE
}

model AdditionalFee {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  name         String
  value        Decimal   @db.Decimal(10, 2)
  period       String?
  @@map("additional_fees")
}

// ─── Imagens ──────────────────────────────────────────────────────────────────

model PropertyImage {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  url          String
  thumbnailUrl String?
  alt          String?
  caption      String?
  order        Int       @default(0)
  is360        Boolean   @default(false)
  isPanoramic  Boolean   @default(false)
  isCover      Boolean   @default(false)
  createdAt    DateTime  @default(now())
  @@map("property_images")
}

model PropertyVideo {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  youtubeUrl   String?
  platform     String?
  @@map("property_videos")
}

model PropertyDocument {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  name         String
  url          String
  type         String?   // pdf, docx, etc.
  size         Int?      // bytes
  isPublic     Boolean   @default(false)
  createdAt    DateTime  @default(now())
  @@map("property_documents")
}

// ─── Portais ──────────────────────────────────────────────────────────────────

model PropertyPortal {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  portalName   String    // ZAP, VivaReal, OLX, Imovelweb, etc.
  active       Boolean   @default(false)
  externalId   String?
  publishedAt  DateTime?
  @@unique([propertyId, portalName])
  @@map("property_portals")
}

// ─── Contatos / CRM ───────────────────────────────────────────────────────────

model Contact {
  id            String        @id @default(cuid())
  name          String
  email         String?
  phone         String?
  whatsapp      String?
  cpf           String?       @unique
  type          ContactType   @default(CLIENT)
  notes         String?       @db.Text
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  ownedProperties Property[]
  leads           Lead[]

  @@map("contacts")
}

enum ContactType { CLIENT OWNER PARTNER INVESTOR }

model Lead {
  id           String      @id @default(cuid())
  propertyId   String?
  property     Property?   @relation(fields: [propertyId], references: [id])
  contactId    String?
  contact      Contact?    @relation(fields: [contactId], references: [id])
  agentId      String?
  agent        User?       @relation(fields: [agentId], references: [id])
  name         String
  email        String?
  phone        String?
  message      String?     @db.Text
  source       LeadSource  @default(SITE)
  status       LeadStatus  @default(NEW)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@map("leads")
}

enum LeadSource { SITE WHATSAPP PORTAL REFERRAL MANUAL }
enum LeadStatus { NEW CONTACTED QUALIFIED PROPOSAL CLOSED LOST }

// ─── Condomínios/Empreendimentos ──────────────────────────────────────────────

model Condominium {
  id           String      @id @default(cuid())
  name         String
  address      String?
  city         String?
  state        String?
  zipCode      String?
  properties   Property[]
  @@map("condominiums")
}

// ─── Análise de Mercado ───────────────────────────────────────────────────────

model MarketAnalysis {
  id                   String    @id @default(cuid())
  propertyId           String
  property             Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  generatedAt          DateTime  @default(now())
  status               AnalysisStatus @default(PENDING)

  // Valores estimados pela IA
  optimisticValue      Decimal?  @db.Decimal(15, 2)
  marketValue          Decimal?  @db.Decimal(15, 2)
  competitiveValue     Decimal?  @db.Decimal(15, 2)

  // Posicionamento
  pricePositioning     String?   // "Abaixo do mercado", "Dentro", "Acima"
  marketDemand         String?   // "Alta", "Média", "Baixa"
  absoptionTime        Int?      // Tempo estimado de venda em dias
  
  // Comparativos
  comparables          Json?     // Array de imóveis comparáveis
  priceHistory         Json?     // Histórico de preços na região

  // Insights IA
  aiSummary            String?   @db.Text
  aiStrengths          Json?     // Array de pontos fortes
  aiWeaknesses         Json?     // Array de pontos fracos
  aiOpportunities      Json?     // Array de oportunidades
  aiRecommendations    Json?     // Array de recomendações

  // Métricas de mercado regional
  avgPricePerSqmRegion Decimal?  @db.Decimal(10, 2)
  priceVariation30d    Decimal?  @db.Decimal(5, 2)  // % variação 30 dias
  priceVariation90d    Decimal?  @db.Decimal(5, 2)
  totalListings        Int?      // Total de anúncios similares na região

  rawData              Json?     // Dados brutos para auditoria

  @@map("market_analyses")
}

enum AnalysisStatus { PENDING PROCESSING COMPLETED FAILED }

// ─── Atividades ───────────────────────────────────────────────────────────────

model Activity {
  id           String        @id @default(cuid())
  propertyId   String?
  property     Property?     @relation(fields: [propertyId], references: [id])
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  type         ActivityType
  description  String
  metadata     Json?
  createdAt    DateTime      @default(now())

  @@map("activities")
}

enum ActivityType {
  PROPERTY_CREATED PROPERTY_UPDATED PROPERTY_PUBLISHED PROPERTY_SOLD
  LEAD_RECEIVED LEAD_CONTACTED VISIT_SCHEDULED VISIT_DONE
  DOCUMENT_ADDED IMAGE_ADDED ANALYSIS_GENERATED NOTE_ADDED
}

// ─── Configurações do Site ────────────────────────────────────────────────────

model SiteConfig {
  id              String    @id @default(cuid())
  ownerName       String    @default("Paulo Pop")
  ownerPhotoUrl   String?
  ownerCreci      String?
  ownerBio        String?   @db.Text
  ownerWhatsapp   String?
  ownerPhone      String?
  ownerEmail      String?
  ownerInstagram  String?
  ownerFacebook   String?
  ownerLinkedin   String?
  ownerYoutube    String?
  ownerTelegram   String?
  ownerCompany    String?
  ownerAddress    String?
  metaTitle       String?
  metaDescription String?
  heroTitle       String?
  heroSubtitle    String?
  heroBgUrl       String?
  footerText      String?
  whatsappMessage String?   // Mensagem padrão WhatsApp
  updatedAt       DateTime  @updatedAt

  @@map("site_config")
}
```

---

## 🌐 Frontend Público — Páginas e Componentes

### Home (`/`)

**Referência visual**: `1774531453357_image.png` (RE/MAX site do Paulo Pop)

**Seções obrigatórias (nesta ordem)**:

1. **Header** fixo com logo "Paulo Pop", navegação (Início | Imóveis | Sobre Mim), ícone de globo/idioma, botão menu hambúrguer mobile
2. **Hero Section**:
   - Foto de fundo do imóvel destaque (configurável pelo admin)
   - Foto do dono (Paulo Pop) com avatar circular à esquerda
   - Nome, CRECI e empresa do corretor
   - Ícones de redes sociais (WhatsApp, Telegram, YouTube, Facebook, LinkedIn, Twitter/X, Instagram)
   - Tabs de busca: **Comprar** | **Alugar**
   - SearchBar com campos: Localização/ID, Tipo de Imóvel (dropdown), Dormitórios (dropdown), Faixa de Preço (dropdown), botão Buscar
3. **Seção "Meus imóveis recentemente cadastrados"** — carrossel horizontal de cards de imóveis ativos, com badge "Cadastrados Este Mês" nos recentes
4. **Seção "Sobre Mim"** — card com foto grande do Paulo Pop, informações de contato, QR code, formulário "Contate-me" (Primeiro nome, Último nome, Telefone com DDI, E-mail, Comentários, botão "Enviar mensagem" vermelho/azul, opção WhatsApp verde)
5. **Footer** — logo RE/MAX, links RE/MAX Internacional / Europa, navegação (Início, Imóveis, Sobre Mim), lista de países, copyright, Política de Privacidade / Termos de Uso

**PropertyCard** (card de imóvel na listagem/carrossel):
- Imagem com gradiente escurecendo de baixo
- Badge de status ("Cadastrados Este Mês", "Vendido", "Para Alugar")
- Preço em destaque (R$ XXX.XXX)
- Ícones: 🛏 quartos | 🚿 banheiros | 🪟 ambientes | 📐 m² | 🚗 vagas
- Tipo do imóvel e endereço completo (bairro, cidade, estado, CEP)

### Listagem de Imóveis (`/imoveis`)

- Header com barra de busca avançada (mesmos filtros da home + filtros extras: Área mínima/máxima, Características, Bairro)
- Grid responsivo de imóveis (3 colunas desktop, 2 tablet, 1 mobile)
- Sidebar com filtros (desktop) / Drawer (mobile)
- Paginação + contador "X imóveis encontrados"
- Ordenação: Mais recente, Menor preço, Maior preço, Maior área

### Página do Imóvel (`/imoveis/[slug]`)

**Referência visual**: `1774531489822_image.png`

**Layout**:
1. **Breadcrumb**: Tipo > Transação > Bairro
2. **Título**: "Apartamento - Venda - São Paulo, São Paulo"
3. **Preço** em destaque com badge "Outras moedas", ID do imóvel
4. **Endereço** com ícone de localização + link para mapa
5. **Galeria de fotos** — grid à direita (foto principal grande + 2 menores), botão "Ver todas as fotos" abre lightbox
6. **Título marketeiro** e **descrição completa** com "Veja mais da descrição >"
7. **Botão "mais informações"**
8. **Formulário "Envie sua mensagem!"** embutido
9. **Seção "Anúncios similares para venda"** — carrossel horizontal
10. **Seção "Imóvel Vendido nas Proximidades Semelhantes"** — carrossel horizontal com badge "Vendido"
11. **Barra inferior flutuante** — foto do corretor, nome, empresa, botões: Contate-me | WhatsApp

**Dados exibidos na página do imóvel**:
- Preço, tipo, endereço completo
- Área total, área útil, área do terreno
- Quartos, banheiros, suítes, vagas, ambientes
- Andar, condomínio
- Características (ícones com labels)
- Estilo de vida
- Mapa interativo (Leaflet/OpenStreetMap ou Google Maps)
- Descrição do portal
- Descrição de marketing
- Informações dos arredores
- Tour virtual (iframe se disponível)
- Documentos públicos (download)

---

## 🔐 Painel Administrativo

### Dashboard (`/admin`)

**Cards de estatísticas**:
- Total de imóveis ativos
- Novos leads (últimos 30 dias)
- Imóveis publicados este mês
- Imóveis vendidos/alugados
- Visualizações totais

**Gráficos**:
- Imóveis por status (pizza/donut)
- Leads por mês (barras)
- Preço médio por tipo (barras horizontais)

**Tabela recente**: Últimos 10 imóveis + últimos 5 leads

### Cadastro/Edição de Imóvel (`/admin/imoveis/novo` e `/admin/imoveis/[id]`)

**Modal inicial de cadastro** (referência: `1774530968339_image.png`):
- Título: "Cadastrar Imóvel"
- **Finalidade do Imóvel**: Radio buttons — Residencial | Comercial
- **Tipo de Transação**: Radio buttons — Para venda | Para Alugar
- **Tipo de Imóvel**: Dropdown obrigatório (Apartamento, Casa, Sobrado, Terreno, Sala Comercial, Loja, Galpão, Prédio, Chácara, Fazenda, Studio, Kitnet, Cobertura, Flat, Mansão, etc.)
- **Localização do Imóvel**: Radio buttons — Imóvel no Brasil | Imóvel no Exterior
- Botões: Cancelar | Salvar

**Após cadastro inicial, abrir formulário completo com abas**:

#### Aba: Principal (referência: `1774531004107_image.png`)

**Cabeçalho**:
- ID / Ref do imóvel (gerado automaticamente)
- Nome do corretor responsável
- Tabs de navegação: Principal | Descrição | Imagens e Vídeos | Documentos | Potencial Comprador | Corretores com Clientes | Atividades | Contatos | Portais | Histórico de Alterações
- Switches: Para venda/Para Alugar | Residencial/Comercial | Ocultar no site e portais

**Seção: Status e Datas**:
- Status do Imóvel (dropdown: Rascunho, Ativo, Vendido, Alugado, Inativo, Suspenso)
- Tipo do Contrato (dropdown: Não selecionado, Exclusivo, Aberto, Autorização)
- Data de Cadastro (date picker)
- Data de Validade (date picker)

**Seção: Preço e custos adicionais**:
- Valor do Imóvel (campo numérico + dropdown R$/USD/EUR)
- Tipo de Valor (dropdown: Não selecionado, Valor fixo, Sob consulta, Negociável)
- Preço/m² (calculado automaticamente + manual) + "R$" label + checkbox "Ocultar Valor no site"
- Valor do IPTU + "R$"
- Período de Pagamento (dropdown: Não selecionado, Mensal, Anual)
- Condomínio (valor) + "R$"
- Periodicidade da Taxa (dropdown)
- **Taxas adicionais**: botão "+ Adicione uma taxa adicional" → abre linha com Nome + Valor + Período

**Seção: Detalhes da Comissão**:
- Comissão de Captação: campo % + radio Porcentagem/Montante
- Comissão de Venda: campo % + radio Porcentagem/Montante

**Seção: Financeira**:
- Nº Contrib. IPTU/ITR (campo texto)
- Número do Registro (campo texto)
- Notas Financeiras (campo texto)

**Seção: Detalhes da propriedade**:
- Tipo do Imóvel (dropdown)
- Status do Mercado (dropdown)
- Data de disponibilidade (date picker)
- Construção (date picker / ano)
- Condição do Imóvel (dropdown)
- Categoria do Imóvel (dropdown)
- Uso do Terreno (dropdown)
- Total Vagas de Estacionamento (numérico)
- Nº Andares (numérico)
- Nº de Aptos no Edifício (numérico)
- Maximum Occupancy (numérico)
- Faixa ou Placa (radio: Sim/Não)
- Área Total (m²)
- Volume Cúbico (m³)
- Área do Terreno (m² + dropdown unidade)
- Dimensões do Terreno (largura x comprimento em metros)
- Área Útil (m²)
- **Nº Vagas** (3 linhas, cada uma com: campo quantidade + dropdown tipo de vaga)

**Seção: Características do Imóvel** (checkboxes em grid 3 colunas):
- Piscina, Jardim, Garagem, Aceita Pets, Registro de Gás Individual, Jacuzzi, Aquecimento Solar, Acessível a cadeiras de rodas + botão "Ver mais" para expandir lista completa

**Seção: Estilo de Vida** (checkboxes em grid 3 colunas):
- Aposentadoria, Beira Mar, Clima Quente, Fonte d'Água, Golfo, Interior, Investimento, Metrópole, Rancho e Fazenda, Ski e Resort

**Seção: Ambientes**:
- Ambientes (numérico), Dormitórios (numérico), Banheiros (numérico), Suíte(s) (numérico)
- Botão "+ Adicionar ambiente" → abre formulário: nome do ambiente, área, descrição

**Seção: Localização do Imóvel**:
- CEP (com autopreenchimento via ViaCEP)
- Endereço (texto)
- Número (texto)
- Complemento (texto)
- Ponto de Referência (texto)
- Andar (dropdown)
- Nº Andares (numérico)
- Região (dropdown com regiões do Brasil)
- Estado (dropdown UFs)
- Cidade (dropdown/busca por estado)
- Bairro Comercial — Apenas Zap/VivaReal (texto)
- Nº da Chave (texto)
- Checkbox "Mostrar endereço completo no site"
- **Mapa interativo** (Leaflet) com marcador arrastável
- Latitude / Longitude (campos manuais)
- Botão "Obtenha coordenadas" (geocodificar endereço)

**Seção: Condomínio/Empreendimento**:
- Condomínio/Empreendimento (dropdown com busca + opção criar novo)

**Seção: Proprietários**:
- Campo de busca de contato (por nome, sobrenome, contato)
- Botão "Criar Novo Contato de Proprietário"

**Seção: Representação e Parceria**:
- Corretor Representante (campo busca + botão Adicionar + Excluir + ℹ️)
- Corretor Secundário (campo busca + botão Adicionar + Excluir + ℹ️)

**Footer do formulário**:
- Botão "Imprimir PDF" (esquerda)
- Botões (direita): Cancelar | Salvar Rascunho | Salvar e Ativar

#### Aba: Descrição (referência: `1774531022516_image.png`)

**Banner AI Text Toolkit**:
- Ícone de IA (robô com laptop)
- Título: "AI Text Toolkit"
- Descrição do recurso
- Ao clicar: abre painel que usa IA (Claude API) para gerar descrição baseada nos campos preenchidos na aba Principal

**Seletor de idioma**: Portuguese - Brazil | English

**Campos** (para cada idioma):
- Título do Imóvel (campo texto + botão "Criar descrição ✨" com IA)
- Descrição do Portal (textarea grande — descrição completa)
- Descrição de Marketing (textarea — máx 350 caracteres, com contador)
- Localização e Informação dos Arredores do Imóvel (textarea)

#### Aba: Imagens e Vídeos (referência: `1774531038390_image.png`)

**Fotos**:
- Contador "X Fotos"
- Botões: "Adicionar Foto 360°" | "Adicionar Foto Panorâmica"
- Área de drag & drop ("Arraste e solte os arquivos aqui ou clique em Selecionar Arquivo")
- Botão "Selecionar arquivo"
- Galeria com miniaturas arrastáveis para reordenar
- Em cada imagem: ícone capa, editar, excluir, marcar como panorâmica/360°

**Videos**:
- Logo YouTube + campo "Link do YouTube (exceto Shorts)"

**Tour Virtual**:
- Radio buttons: Nenhum | Banib | Outro
- Campo "Link Tour Virtual"

**Link Para Outros Sites**:
- Ícone global + campo "Link externo"

#### Aba: Documentos (referência: `1774531050433_image.png`)

**Privado**:
- Seção "Documentos"
- Botão "Carregar documentos (Máx 10MB)"
- Lista de documentos carregados com: ícone tipo, nome, tamanho, data, botão download/excluir

**Público** (visível no frontend para leads):
- Mesma estrutura da seção Privado

#### Aba: Potencial Comprador

- Filtros de busca no CRM para encontrar leads/contatos com interesse no perfil do imóvel
- Campos: Tipo de imóvel buscado, faixa de preço, localização preferida, quartos mínimos
- Tabela de contatos compatíveis

#### Aba: Corretores com Clientes

- Tabela: Corretor | Contato/Cliente | Status | Data | Ações
- Botão para adicionar corretor externo com cliente interessado

#### Aba: Atividades

- Timeline vertical de todas as atividades do imóvel
- Filtros por tipo de atividade
- Campo para adicionar nota manual

#### Aba: Contatos

- Listagem de todos os leads gerados por este imóvel
- Colunas: Nome, E-mail, Telefone, Mensagem, Origem, Status, Data
- Ações: Ver detalhes, Alterar status, Marcar como contatado

#### Aba: Portais

- Grid de portais disponíveis (ZAP Imóveis, VivaReal, OLX, Imovelweb, etc.)
- Toggle on/off para cada portal
- Status de publicação e ID externo

#### Aba: Histórico de Alterações

- Tabela: Data/Hora | Usuário | Campo alterado | Valor anterior | Novo valor

---

## 📊 Análise de Mercado (referência: `1774531242049_image.png`)

**Acesso**: Via aba específica no imóvel OU seção `/admin/analise-mercado`

**Componentes**:

### 1. Estudo de Mercado (cards com 3 valores IA)

```
┌─────────────────────────────────────────────────────┐
│  📊 Estudo de Mercado                               │
│                                                     │
│  Compare os valores de outros imóveis e obtenha    │
│  o valor otimista, o valor de mercado e o          │
│  valor competitivo do imóvel cadastrado.           │
│                                                     │
│  Data de criação: XX/XX/XXXX    Status: Novo ▼     │
│                                                     │
│  [▶ Gerar Análise]  [⬇ PDF]  [⬇ XLS]             │
└─────────────────────────────────────────────────────┘

Cards de valores (após geração):
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  💎 Otimista │  │  📈 Mercado  │  │  🎯 Competit.│
│  R$ X.XXX.XX │  │  R$ X.XXX.XX │  │  R$ X.XXX.XX │
│  +X% acima   │  │  Referência  │  │  -X% abaixo  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 2. Posicionamento no Mercado

- Gauge/velocímetro visual mostrando onde o preço atual se posiciona
- Badge: "Abaixo do mercado" / "Dentro do mercado" / "Acima do mercado"
- Tempo estimado de absorção (venda)
- Demanda na região: Alta/Média/Baixa

### 3. Imóveis Comparáveis (grid de cards)

- Mini-cards com: foto thumbnail, endereço, preço, área, preço/m², status (Ativo/Vendido)

### 4. Gráfico de Preços por Período

- Linha do tempo: preço médio m² na região nos últimos 12 meses
- Marcador do preço atual do imóvel

### 5. Insights da IA (painel expandível)

```
┌─────────────────────────────────────────────────────┐
│  🤖 Análise Inteligente                             │
│                                                     │
│  ✅ Pontos Fortes                                   │
│     • ...                                           │
│                                                     │
│  ⚠️ Pontos de Atenção                              │
│     • ...                                           │
│                                                     │
│  💡 Oportunidades                                   │
│     • ...                                           │
│                                                     │
│  📋 Recomendações                                   │
│     • ...                                           │
└─────────────────────────────────────────────────────┘
```

### 6. Relatório e Contrato (referência: `1774531242049_image.png`)

**Plano de Marketing**:
- Botão "Criar Plano de Marketing" → gera via IA um plano completo (canais, estratégia, orçamento sugerido)

**Contrato**:
- Botão "Criar Contrato" → gera contrato de representação imobiliária via IA + template editável

**Artes Sugeridas** (grid de 4 colunas):
- Anúncio, Email, Ficha Técnica, Folheto
- Clique → abre editor simplificado de arte (integração com Canva API ou template PNG gerado)

**Gerar Relatório**:
- Botão "Gerar Relatório" → PDF completo com todas as informações + análise de mercado
- Botão "Enviar por email para o proprietário"
- Campo senha de 5 dígitos para proteger acesso ao relatório

---

## 🤖 Integrações de IA

### AI Text Toolkit (geração de descrição)

```typescript
// src/lib/ai.ts

export async function generatePropertyDescription(propertyData: PropertyFormData): Promise<{
  title: string
  description: string
  marketingDescription: string
  surroundingsInfo: string
}> {
  // Usar Claude API (claude-sonnet-4-20250514)
  // Prompt: recebe todos os campos do imóvel e gera textos otimizados para SEO
  // Limite marketing description: 350 chars
}

export async function generateMarketAnalysis(property: Property): Promise<MarketAnalysisResult> {
  // Usar Google Gemini API para:
  // 1. Analisar dados do imóvel
  // 2. Estimar valores (otimista, mercado, competitivo)
  // 3. Gerar insights SWOT
  // 4. Recomendar estratégia de preço
  // 5. Retornar em JSON estruturado
}

export async function generateMarketingPlan(property: Property): Promise<string> {
  // Plano de marketing completo em Markdown
}

export async function generateContract(property: Property, owner: Contact): Promise<string> {
  // Contrato de representação imobiliária em Markdown/HTML
}
```

### Variáveis de Ambiente para IA

```env
GEMINI_API_KEY=               # Google Gemini API (gemini-1.5-pro)
```

---

## 🔌 APIs Externas e Integrações

### ViaCEP (autopreenchimento de endereço)
```typescript
// GET https://viacep.com.br/ws/{cep}/json/
// Preenche: endereço, bairro, cidade, estado
```

### Upload de Imagens
```typescript
// Upload LOCAL — armazenar em /public/uploads/images/ (volume Docker)
// NÃO usar Cloudinary nem S3
// Servir via Next.js static files (/uploads/images/nome-arquivo.jpg)
// Suportar: JPEG, PNG, WEBP, HEIC
// Limite: 10MB por imagem, 100 imagens por imóvel
// Compressão automática com sharp antes de salvar
```

### Upload de Documentos
```typescript
// Upload LOCAL — armazenar em /public/uploads/documents/ (volume Docker)
// NÃO usar Cloudinary nem S3
// Máx 10MB por documento
// Tipos: PDF, DOCX, XLSX, JPG, PNG
```

### Mapa
```typescript
// Usar Leaflet.js com tiles OpenStreetMap (gratuito)
// Alternativa: Google Maps (requer API Key)
// NEXT_PUBLIC_GOOGLE_MAPS_KEY= (opcional)
// Geocodificação: OpenCage API ou Google Geocoding
```

### WhatsApp
```typescript
// Gerar links wa.me/{numero}?text={mensagem_encodada}
// Mensagem padrão configurável no admin
```

---

## 🔑 Autenticação e Autorização

```typescript
// NextAuth.js com Credentials Provider
// Sessão JWT
// Middleware protegendo /admin/**
// Roles: SUPER_ADMIN, ADMIN, AGENT
// Senha hasheada com bcrypt (12 rounds)
```

**Variáveis**:
```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## ⚙️ Variáveis de Ambiente (`.env.example`)

```env
# ─── Database ────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/paulo_pop

# ─── NextAuth ────────────────────────────────────────
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# ─── IA ──────────────────────────────────────────────
GEMINI_API_KEY=               # Google Gemini API

# ─── Upload ──────────────────────────────────────────
# Upload LOCAL — arquivos salvos em /public/uploads/ (volume Docker)
UPLOAD_DIR=./public/uploads   # caminho local de armazenamento

# ─── Mapas ───────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_KEY=       # opcional
OPENCAGE_API_KEY=                  # geocodificação

# ─── E-mail (leads e notificações) ───────────────────
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=contato@paulopop.com.br
NOTIFICATION_EMAIL=                # email do corretor

# ─── Site ────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://paulopop.com.br
NEXT_PUBLIC_SITE_NAME=Paulo Pop
NEXT_PUBLIC_WHATSAPP=5561912345678
```

---

## 🧭 Fases de Desenvolvimento

### Fase 1 — Fundação (iniciar aqui)

1. Configurar projeto Next.js 14 com TypeScript + Tailwind CSS
2. Configurar Prisma com PostgreSQL e rodar migration completa do schema acima
3. Configurar NextAuth com Credentials + criar seed do usuário admin inicial
4. Implementar upload de imagens (Cloudinary)
5. Implementar autopreenchimento de CEP (ViaCEP)

### Fase 2 — Painel Admin

6. Layout admin: Sidebar + Header responsivos
7. Modal de cadastro inicial do imóvel
8. Formulário completo com todas as abas (Principal, Descrição, Imagens, Documentos)
9. Abas restantes (Portais, Contatos, Atividades, Histórico)
10. Listagem admin com busca, filtros e paginação
11. Dashboard com estatísticas e gráficos

### Fase 3 — Frontend Público

12. Home page completa (Hero + carrossel + sobre + footer)
13. Listagem pública com filtros avançados
14. Página do imóvel (galeria, detalhes, mapa, imóveis similares)
15. Formulário de lead + integração WhatsApp

### Fase 4 — IA e Análise de Mercado

16. AI Text Toolkit (geração de descrição via Claude)
17. Análise de Mercado completa (estimativa de valores, posicionamento, comparáveis)
18. Geração de Marketing Plan e Contrato via IA
19. Geração de relatório PDF

### Fase 5 — Polimento e Produção

20. SEO: sitemap.xml, robots.txt, meta tags, OG tags, structured data (JSON-LD)
21. Performance: otimização de imagens, lazy loading, cache
22. E-mail de notificação para novos leads
23. Acessibilidade (a11y audit)
24. Testes (Vitest + Playwright)
25. Deploy (Vercel + PlanetScale/Supabase)

---

## 🔍 SEO e Metadados

Cada página de imóvel deve ter:
```typescript
// generateMetadata() retornando:
{
  title: `${property.title} | Paulo Pop`,
  description: property.marketingDescription || property.description?.substring(0, 160),
  openGraph: {
    title, description, images: [property.images[0].url],
    type: 'website', locale: 'pt_BR'
  },
  // JSON-LD:
  // "@type": "RealEstateListing"
  // com price, address, numberOfRooms, etc.
}
```

**Sitemap**:
- `/` — prioridade 1.0
- `/imoveis` — prioridade 0.9
- `/imoveis/[slug]` — prioridade 0.8 (apenas status ACTIVE)
- `/sobre` — prioridade 0.7

---

## 📧 Notificações por E-mail

### Novo Lead

- **Para o corretor**: e-mail com nome, contato, mensagem e link para o imóvel de interesse
- **Para o lead**: e-mail de confirmação "Recebemos sua mensagem. Paulo Pop entrará em contato em breve."

### Templates

Usar Resend ou Nodemailer. Templates em HTML responsivo.

---

## 🚢 Deploy e Infraestrutura

**Stack recomendada**:
- **Frontend + API Routes**: Vercel
- **Banco de dados**: Supabase (PostgreSQL) ou PlanetScale
- **Armazenamento**: Cloudinary
- **DNS**: Cloudflare

**Checklist pré-deploy**:
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Migration de produção rodada
- [ ] Seed do admin criado
- [ ] Domínio configurado no Vercel
- [ ] HTTPS ativo
- [ ] OG image padrão configurada
- [ ] Google Analytics / Pixel Meta configurados (se necessário)

---

## 🛡️ Segurança

- Validação de inputs com Zod em todas as rotas de API
- Rate limiting nas rotas públicas de lead e contato
- CSRF protection via NextAuth
- Sanitização de HTML antes de salvar descrições
- URLs de documentos privados assinadas (expiry 1h)
- Logs de auditoria em todas as ações admin

---

## 📱 Responsividade

Breakpoints Tailwind:
- `sm`: 640px — mobile landscape
- `md`: 768px — tablet
- `lg`: 1024px — desktop pequeno
- `xl`: 1280px — desktop
- `2xl`: 1536px — widescreen

Regras:
- Sidebar admin: oculta no mobile, drawer overlay
- Carrossel de imóveis: 1 card mobile, 2 tablet, 3-4 desktop
- Galeria da página do imóvel: empilhada no mobile, grid no desktop
- Formulário de cadastro: single column mobile, multi-column desktop

---

## 🧪 Testes

```bash
# Unit/Integration
npx vitest

# E2E
npx playwright test

# Casos de teste obrigatórios:
# - Cadastro de imóvel completo (happy path)
# - Autopreenchimento de CEP
# - Upload de imagem
# - Geração de descrição via IA
# - Envio de lead via formulário público
# - Autenticação admin (login/logout)
# - Busca e filtros de imóveis
```

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "typescript": "5.x",
    "@prisma/client": "latest",
    "next-auth": "4.x",
    "zod": "latest",
    "bcryptjs": "latest",
    "cloudinary": "latest",
    "@anthropic-ai/sdk": "latest",
    "leaflet": "latest",
    "react-leaflet": "latest",
    "react-dropzone": "latest",
    "react-image-lightbox": "latest",
    "@tanstack/react-query": "latest",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "recharts": "latest",
    "date-fns": "latest",
    "slugify": "latest",
    "nodemailer": "latest",
    "sharp": "latest"
  },
  "devDependencies": {
    "prisma": "latest",
    "tailwindcss": "3.x",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/leaflet": "latest",
    "@types/bcryptjs": "latest",
    "@types/nodemailer": "latest",
    "vitest": "latest",
    "@playwright/test": "latest"
  }
}
```

---

## 🏁 Comandos de Inicialização

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# 3. Inicializar banco de dados
npx prisma migrate dev --name init

# 4. Criar usuário admin inicial
npx prisma db seed

# 5. Iniciar servidor de desenvolvimento
npm run dev
```

**Seed (`prisma/seed.ts`)**:
```typescript
// Criar usuário admin:
// email: admin@paulopop.com.br
// senha: PauloPop@2025 (obrigatório trocar no primeiro acesso)
// Criar SiteConfig inicial com ownerName: "Paulo Pop"
```

---

## 📝 Notas Finais para o Claude Code

1. **Sempre ler este CLAUDE.md inteiro antes de qualquer tarefa**
2. **Consultar Google Stitch** para referências visuais de todos os componentes de UI
3. **Seguir o schema Prisma exatamente** — não improvisar campos novos sem documentar aqui
4. **Commit no GitHub após cada feature** — não acumular mudanças
5. **Nomear commits em português**: `feat: cadastro de imóvel`, `fix: autopreenchimento CEP`, `refactor: componente PropertyCard`
6. **Nunca deletar dados** — usar soft delete (adicionar campo `deletedAt DateTime?` se necessário)
7. **Logs estruturados** em todas as rotas de API (método, caminho, status, tempo de resposta)
8. **Tratar todos os erros** — nunca deixar promise não tratada ou try/catch vazio
9. **Comentar em português** todo código de lógica de negócio complexo
```
