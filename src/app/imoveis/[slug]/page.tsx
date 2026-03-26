import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PropertyGallery } from '@/components/public/PropertyGallery'
import { ContactForm } from '@/components/public/ContactForm'
import { PropertyCard } from '@/components/public/PropertyCard'
import { PropertyCarousel } from '@/components/public/PropertyCarousel'
import { ViewCounter } from '@/components/public/ViewCounter'
import { formatCurrency, formatArea } from '@/lib/formatters'
import type { Metadata } from 'next'
import {
  MapPin, Bed, Bath, LayoutGrid, Maximize2, Car, Building2,
  ChevronRight, MessageCircle, Phone, FileText, Download,
  Globe, Layers
} from 'lucide-react'

interface Props {
  params: { slug: string }
}

const featureLabels: Record<string, string> = {
  POOL: 'Piscina', GARDEN: 'Jardim', GARAGE: 'Garagem', JACUZZI: 'Jacuzzi',
  SOLAR_HEATING: 'Aquecimento Solar', ACCEPTS_PETS: 'Aceita Pets',
  INDIVIDUAL_GAS_METER: 'Reg. Gás Individual', WHEELCHAIR_ACCESSIBLE: 'Acessível',
  GOURMET_BALCONY: 'Varanda Gourmet', BARBECUE: 'Churrasqueira', ELEVATOR: 'Elevador',
  GYM: 'Academia', PARTY_ROOM: 'Salão de Festas', PLAYGROUND: 'Playground',
  SAUNA: 'Sauna', SECURITY_24H: 'Segurança 24h', INTERCOM: 'Interfone',
  ALARM: 'Alarme', GENERATOR: 'Gerador', FURNISHED: 'Mobiliado',
  SEMI_FURNISHED: 'Semi-mobiliado', AIR_CONDITIONING: 'Ar condicionado',
  WOOD_FLOOR: 'Piso de Madeira', CERAMIC_FLOOR: 'Piso Cerâmico', MARBLE_FLOOR: 'Piso de Mármore',
}

const lifestyleLabels: Record<string, string> = {
  RETIREMENT: 'Aposentadoria', WATER_SPRING: "Fonte d'Água", BEACH: 'Beira Mar',
  GOLF: 'Golfe', INVESTMENT: 'Investimento', METROPOLIS: 'Metrópole',
  RANCH: 'Rancho e Fazenda', SKI_RESORT: 'Ski e Resort', HOT_CLIMATE: 'Clima Quente',
  COUNTRYSIDE: 'Interior',
}

const transactionLabel: Record<string, string> = {
  SALE: 'Venda', RENT: 'Aluguel',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug, status: 'ACTIVE', hideOnSite: false },
    select: {
      title: true,
      propertyType: true,
      transactionType: true,
      city: true,
      state: true,
      price: true,
      totalArea: true,
      description: true,
      marketingDescription: true,
      images: { where: { isCover: true }, take: 1, select: { url: true } },
    },
  })

  if (!property) return { title: 'Imóvel não encontrado' }

  const title = property.title
    ?? `${property.propertyType} — ${transactionLabel[property.transactionType]} — ${property.city}, ${property.state}`

  const description = property.marketingDescription
    ?? property.description?.substring(0, 160)
    ?? `${property.propertyType} para ${transactionLabel[property.transactionType].toLowerCase()} em ${property.city}, ${property.state}.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Paulo Pop`,
      description,
      images: property.images[0] ? [{ url: property.images[0].url }] : [],
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default async function PropertyPage({ params }: Props) {
  const [property, config] = await Promise.all([
    prisma.property.findUnique({
      where: { slug: params.slug, status: 'ACTIVE', hideOnSite: false },
      include: {
        images: { orderBy: { order: 'asc' } },
        features: true,
        lifestyles: true,
        documents: { where: { isPublic: true } },
        agent: { select: { name: true, avatarUrl: true, company: true, phone: true, whatsapp: true } },
      },
    }),
    prisma.siteConfig.findFirst(),
  ])

  if (!property) notFound()

  // Imóveis similares
  const similar = await prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      hideOnSite: false,
      id: { not: property.id },
      transactionType: property.transactionType,
      city: property.city ?? undefined,
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, title: true, propertyType: true, transactionType: true, status: true,
      price: true, totalArea: true, bedrooms: true, bathrooms: true, environments: true,
      totalParkingSpots: true, neighborhood: true, city: true, state: true, zipCode: true, createdAt: true,
      images: { where: { isCover: true }, take: 1, select: { url: true, thumbnailUrl: true } },
    },
  })

  // Imóveis vendidos similares
  const soldSimilar = await prisma.property.findMany({
    where: {
      status: 'SOLD',
      id: { not: property.id },
      city: property.city ?? undefined,
    },
    take: 6,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, slug: true, title: true, propertyType: true, transactionType: true, status: true,
      price: true, totalArea: true, bedrooms: true, bathrooms: true, environments: true,
      totalParkingSpots: true, neighborhood: true, city: true, state: true, zipCode: true, createdAt: true,
      images: { where: { isCover: true }, take: 1, select: { url: true, thumbnailUrl: true } },
    },
  })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const carouselMap = (items: typeof similar) => items.map(p => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    totalArea: p.totalArea ? Number(p.totalArea) : null,
    coverImage: p.images[0]?.thumbnailUrl ?? p.images[0]?.url ?? null,
    isNew: p.createdAt > thirtyDaysAgo,
  }))

  const title = property.title
    ?? `${property.propertyType} — ${transactionLabel[property.transactionType]} — ${property.city}, ${property.state}`

  const breadcrumb = [
    { label: 'Imóveis', href: '/imoveis' },
    ...(property.propertyType ? [{ label: property.propertyType, href: `/imoveis?tipo=${property.propertyType}` }] : []),
    ...(property.neighborhood ? [{ label: property.neighborhood, href: `/imoveis?q=${property.neighborhood}` }] : []),
  ]

  const agentWhatsapp = property.agent.whatsapp
    ?? config?.ownerWhatsapp
    ?? process.env.NEXT_PUBLIC_WHATSAPP ?? ''
  const agentName = property.agent.name
  const agentCompany = property.agent.company ?? config?.ownerCompany ?? ''

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: property.marketingDescription ?? property.description ?? undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/imoveis/${property.slug}`,
    image: property.images[0]?.url,
    price: property.price ? Number(property.price) : undefined,
    priceCurrency: 'BRL',
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address ?? undefined,
      addressLocality: property.city ?? undefined,
      addressRegion: property.state ?? undefined,
      postalCode: property.zipCode ?? undefined,
      addressCountry: 'BR',
    },
    numberOfRooms: property.bedrooms ?? undefined,
    floorSize: property.totalArea ? { '@type': 'QuantitativeValue', value: Number(property.totalArea), unitCode: 'MTK' } : undefined,
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Contador de views */}
      <ViewCounter propertyId={property.id} />

      <div className="min-h-screen bg-[#F0F4F8]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-400 flex-wrap">
              <Link href="/" className="hover:text-[#0D2F5E] transition-colors">Início</Link>
              {breadcrumb.map(crumb => (
                <span key={crumb.href} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  <Link href={crumb.href} className="hover:text-[#0D2F5E] transition-colors">
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cabeçalho */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0D2F5E] mb-2">
                  {title}
                </h1>
                {property.address && (
                  <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 text-[#2E86DE] flex-shrink-0" />
                    {[property.address, property.number, property.neighborhood, property.city, property.state]
                      .filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                {property.price && (
                  <p className="font-display text-3xl font-bold text-[#0D2F5E]">
                    {formatCurrency(Number(property.price))}
                    {property.transactionType === 'RENT' && (
                      <span className="text-base font-normal text-gray-500">/mês</span>
                    )}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Ref: {property.ref}</p>
              </div>
            </div>
          </div>

          {/* Galeria */}
          <div className="mb-8">
            <PropertyGallery
              images={property.images.map(img => ({ url: img.url, alt: img.alt }))}
              title={title}
            />
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna esquerda (detalhes) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats do imóvel */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-[#0D2F5E] mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Detalhes do Imóvel
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {property.totalArea && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <Maximize2 className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{formatArea(Number(property.totalArea))}</p>
                      <p className="text-xs text-gray-400">Área Total</p>
                    </div>
                  )}
                  {property.usefulArea && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <Maximize2 className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{formatArea(Number(property.usefulArea))}</p>
                      <p className="text-xs text-gray-400">Área Útil</p>
                    </div>
                  )}
                  {(property.bedrooms ?? 0) > 0 && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <Bed className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{property.bedrooms}</p>
                      <p className="text-xs text-gray-400">Dormitórios</p>
                    </div>
                  )}
                  {(property.bathrooms ?? 0) > 0 && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <Bath className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{property.bathrooms}</p>
                      <p className="text-xs text-gray-400">Banheiros</p>
                    </div>
                  )}
                  {(property.suites ?? 0) > 0 && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <Bed className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{property.suites}</p>
                      <p className="text-xs text-gray-400">Suítes</p>
                    </div>
                  )}
                  {(property.totalParkingSpots ?? 0) > 0 && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <Car className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{property.totalParkingSpots}</p>
                      <p className="text-xs text-gray-400">Vagas</p>
                    </div>
                  )}
                  {(property.environments ?? 0) > 0 && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <LayoutGrid className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{property.environments}</p>
                      <p className="text-xs text-gray-400">Ambientes</p>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex flex-col items-center p-3 bg-[#F0F4F8] rounded-xl">
                      <Building2 className="w-5 h-5 text-[#2E86DE] mb-1" />
                      <p className="font-semibold text-sm text-[#0D2F5E]">{property.floor}</p>
                      <p className="text-xs text-gray-400">Andar</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              {(property.title || property.description) && (
                <ExpandableDescription
                  title={property.title ?? undefined}
                  description={property.description ?? undefined}
                />
              )}

              {/* Características */}
              {property.features.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-[#0D2F5E] mb-4">Características</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {property.features.map(f => (
                      <div key={f.feature} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-[#2E86DE] flex-shrink-0" />
                        {featureLabels[f.feature] ?? f.feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estilo de Vida */}
              {property.lifestyles.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-[#0D2F5E] mb-4">Estilo de Vida</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.lifestyles.map(l => (
                      <span key={l.lifestyle} className="px-3 py-1.5 bg-[#F0F4F8] text-[#0D2F5E] text-sm rounded-full font-medium">
                        {lifestyleLabels[l.lifestyle] ?? l.lifestyle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações dos arredores */}
              {property.surroundingsInfo && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-[#0D2F5E] mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Localização e Arredores
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {property.surroundingsInfo}
                  </p>
                </div>
              )}

              {/* Mapa */}
              {property.latitude && property.longitude && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-[#0D2F5E] mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Localização no Mapa
                  </h2>
                  {/* Carregamento dinâmico para evitar SSR */}
                  <MapEmbedWrapper
                    latitude={Number(property.latitude)}
                    longitude={Number(property.longitude)}
                    title={title}
                  />
                </div>
              )}

              {/* Tour Virtual */}
              {property.virtualTourUrl && property.virtualTourType !== 'NONE' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-[#0D2F5E] mb-4">Tour Virtual</h2>
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <iframe
                      src={property.virtualTourUrl}
                      title="Tour Virtual"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Documentos públicos */}
              {property.documents.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-[#0D2F5E] mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documentos
                  </h2>
                  <div className="space-y-2">
                    {property.documents.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#F0F4F8] rounded-xl hover:bg-[#E2E8F0] transition-colors group"
                        aria-label={`Baixar ${doc.name}`}
                      >
                        <Download className="w-4 h-4 text-[#2E86DE] flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#0D2F5E] flex-1">{doc.name}</span>
                        {doc.type && <span className="text-xs text-gray-400 uppercase">{doc.type}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coluna direita — formulário */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-display text-lg font-bold text-[#0D2F5E] mb-1">
                  Envie sua mensagem!
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                  Entre em contato sobre este imóvel.
                </p>
                <ContactForm
                  propertyId={property.id}
                  propertySlug={property.slug}
                  whatsapp={agentWhatsapp}
                />
              </div>
            </div>
          </div>

          {/* Imóveis similares */}
          {similar.length > 0 && (
            <section className="mt-16" aria-labelledby="similares-title">
              <h2 id="similares-title" className="font-display text-2xl font-bold text-[#0D2F5E] mb-6">
                Anúncios similares para {transactionLabel[property.transactionType].toLowerCase()}
              </h2>
              <PropertyCarousel properties={carouselMap(similar)} />
            </section>
          )}

          {/* Imóveis vendidos */}
          {soldSimilar.length > 0 && (
            <section className="mt-12" aria-labelledby="vendidos-title">
              <h2 id="vendidos-title" className="font-display text-2xl font-bold text-[#0D2F5E] mb-6">
                Imóveis Vendidos nas Proximidades
              </h2>
              <PropertyCarousel properties={carouselMap(soldSimilar)} />
            </section>
          )}
        </div>
      </div>

      {/* Barra inferior flutuante — agente */}
      <AgentBar
        name={agentName}
        company={agentCompany}
        avatarUrl={property.agent.avatarUrl ?? config?.ownerPhotoUrl ?? null}
        phone={property.agent.phone ?? config?.ownerPhone ?? null}
        whatsapp={agentWhatsapp}
        propertySlug={property.slug}
      />
    </>
  )
}

// ─── Componentes internos ────────────────────────────────────────────────────

function ExpandableDescription({ title, description }: { title?: string; description?: string }) {
  // Server component — renderiza tudo expandido com CSS para "ver mais" via checkbox hack
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {title && (
        <h2 className="font-display text-xl font-bold text-[#0D2F5E] mb-3">{title}</h2>
      )}
      {description && (
        <DescriptionExpander text={description} />
      )}
    </div>
  )
}

function DescriptionExpander({ text }: { text: string }) {
  'use client'
  // Usando import dinâmico para componente client
  return <DescriptionExpanderClient text={text} />
}

// Importamos como lazy para não precisar de arquivo separado
import dynamic from 'next/dynamic'

const DescriptionExpanderClient = dynamic(() => import('@/components/public/DescriptionExpander'), { ssr: false })

const MapEmbedWrapper = dynamic(() =>
  import('@/components/public/MapEmbed').then(m => m.MapEmbed), { ssr: false }
)

// Barra inferior do agente
function AgentBar({ name, company, avatarUrl, phone, whatsapp, propertySlug }: {
  name: string
  company: string
  avatarUrl: string | null
  phone: string | null
  whatsapp: string
  propertySlug: string
}) {
  const cleanWa = whatsapp.replace(/\D/g, '')
  const waHref = cleanWa
    ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: /imoveis/${propertySlug}`)}`
    : '#'

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-2xl py-3 px-4"
      role="complementary"
      aria-label="Contato do corretor"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F0F4F8] flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-5 h-5 m-2.5 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0D2F5E] text-sm truncate">{name}</p>
            {company && <p className="text-xs text-gray-400 truncate">{company}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#0D2F5E] text-[#0D2F5E] rounded-xl text-sm font-medium hover:bg-[#0D2F5E] hover:text-white transition-colors"
              aria-label="Ligar para o corretor"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Contate-me</span>
            </a>
          )}
          {cleanWa && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#1ebe57] transition-colors"
              aria-label="Falar pelo WhatsApp"
            >
              <MessageCircle className="w-4 h-4" fill="white" strokeWidth={0} />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
