export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ContactForm } from '@/components/public/ContactForm'
import { formatCurrency, formatArea } from '@/lib/formatters'
import type { Metadata } from 'next'
import {
  MapPin, ChevronRight, MessageCircle, Phone,
  Building2, Bed, Bath, Car, Maximize2, Calendar,
  Layers, DollarSign, TreePine, Navigation
} from 'lucide-react'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const emp = await prisma.condominium.findUnique({
    where: { slug: params.slug, status: 'ACTIVE' },
    select: { name: true, subtitle: true, description: true, city: true, state: true },
  })
  if (!emp) return { title: 'Empreendimento não encontrado' }
  return {
    title: emp.name,
    description: emp.subtitle ?? emp.description?.substring(0, 160) ?? emp.name,
    openGraph: {
      title: `${emp.name} | Paulo Pop`,
      description: emp.subtitle ?? emp.description?.substring(0, 160) ?? '',
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default async function EmpreendimentoPage({ params }: Props) {
  const [emp, config] = await Promise.all([
    prisma.condominium.findUnique({
      where: { slug: params.slug, status: 'ACTIVE' },
      include: {
        images: { orderBy: [{ category: 'asc' }, { order: 'asc' }] },
        properties: {
          where: { status: 'ACTIVE', hideOnSite: false },
          include: {
            images: { where: { isCover: true }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.siteConfig.findFirst(),
  ])

  if (!emp) notFound()

  const imagesOf = (cat: string) => emp.images.filter(i => i.category === cat)
  const heroImages = [...imagesOf('FACHADA'), ...imagesOf('AREAS_COMUNS')]
  const coverImage = heroImages[0]

  const ownerName = config?.ownerName ?? 'Paulo Pop'
  const ownerPhoto = config?.ownerPhotoUrl ?? null
  const ownerWhatsapp = (config?.ownerWhatsapp ?? '').replace(/\D/g, '')
  const ownerPhone = config?.ownerPhone ?? null
  const ownerCreci = config?.ownerCreci ?? null
  const ownerCompany = config?.ownerCompany ?? null

  const waText = encodeURIComponent(`Olá! Tenho interesse no empreendimento ${emp.name}.`)
  const waHref = ownerWhatsapp ? `https://wa.me/${ownerWhatsapp}?text=${waText}` : '#'

  const transactionLabel: Record<string, string> = { SALE: 'Venda', RENT: 'Aluguel' }

  return (
    <>
      <div className="min-h-screen bg-[#F0F4F8] pb-24">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="relative h-[60vh] min-h-[420px] bg-[#0D2F5E] overflow-hidden">
          {coverImage && (
            <Image
              src={coverImage.url}
              alt={coverImage.alt ?? emp.name}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2F5E]/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-10 max-w-7xl mx-auto">
            <p className="text-blue-300 text-sm font-medium mb-2 uppercase tracking-wide">Empreendimento</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">{emp.name}</h1>
            {emp.subtitle && <p className="text-blue-100 text-lg md:text-xl">{emp.subtitle}</p>}
            {(emp.city || emp.state) && (
              <p className="flex items-center gap-1.5 text-blue-200 text-sm mt-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {[emp.neighborhood, emp.city, emp.state].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1 text-sm text-gray-400 flex-wrap">
              <Link href="/" className="hover:text-[#0D2F5E] transition-colors">Início</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600">{emp.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Badges rápidos ────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-4">
            {emp.totalUnits && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Layers className="w-4 h-4 text-[#2E86DE]" />
                <span><strong>{emp.totalUnits}</strong> unidades</span>
              </div>
            )}
            {emp.deliveryDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#2E86DE]" />
                <span>Entrega: <strong>{emp.deliveryDate}</strong></span>
              </div>
            )}
            {emp.priceFrom && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-[#2E86DE]" />
                <span>
                  A partir de <strong>{formatCurrency(Number(emp.priceFrom))}</strong>
                  {emp.priceTo ? ` até ${formatCurrency(Number(emp.priceTo))}` : ''}
                </span>
              </div>
            )}
            {emp.properties.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#2E86DE] font-medium">
                <Building2 className="w-4 h-4" />
                <span>{emp.properties.length} unidade{emp.properties.length > 1 ? 's' : ''} disponível{emp.properties.length > 1 ? 'is' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Conteúdo principal ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Coluna esquerda */}
          <div className="lg:col-span-2 space-y-10">

            {/* Sobre o empreendimento */}
            {emp.description && (
              <section>
                <SectionTitle>Sobre o Empreendimento</SectionTitle>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{emp.description}</p>
                </div>
              </section>
            )}

            {/* Galeria fachada/áreas comuns */}
            {heroImages.length > 1 && (
              <section>
                <SectionTitle>Fachada e Áreas Comuns</SectionTitle>
                <ImageGallery images={heroImages.map(i => ({ url: i.url, alt: i.alt ?? undefined, caption: i.caption ?? undefined }))} />
              </section>
            )}

            {/* Apartamentos / Tipologias */}
            {(emp.tipologiasDescription || imagesOf('TIPOLOGIA').length > 0) && (
              <section>
                <SectionTitle>Apartamentos e Tipologias</SectionTitle>
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                  {emp.tipologiasDescription && (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{emp.tipologiasDescription}</p>
                  )}
                  {imagesOf('TIPOLOGIA').length > 0 && (
                    <ImageGallery images={imagesOf('TIPOLOGIA').map(i => ({ url: i.url, alt: i.alt ?? undefined, caption: i.caption ?? undefined }))} />
                  )}
                </div>
              </section>
            )}

            {/* Área de Lazer */}
            {(emp.lazerDescription || imagesOf('LAZER').length > 0) && (
              <section>
                <SectionTitle icon={<TreePine className="w-5 h-5" />}>Área de Lazer</SectionTitle>
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                  {emp.lazerDescription && (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{emp.lazerDescription}</p>
                  )}
                  {imagesOf('LAZER').length > 0 && (
                    <ImageGallery images={imagesOf('LAZER').map(i => ({ url: i.url, alt: i.alt ?? undefined, caption: i.caption ?? undefined }))} />
                  )}
                </div>
              </section>
            )}

            {/* Financeiro */}
            {(emp.priceFrom || emp.priceTo || emp.paymentInfo || emp.banks) && (
              <section>
                <SectionTitle icon={<DollarSign className="w-5 h-5" />}>Preço e Formas de Pagamento</SectionTitle>
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                  {(emp.priceFrom || emp.priceTo) && (
                    <div className="p-4 bg-[#F0F4F8] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Valores</p>
                      <p className="text-2xl font-bold text-[#0D2F5E]">
                        {emp.priceFrom && emp.priceTo
                          ? `${formatCurrency(Number(emp.priceFrom))} a ${formatCurrency(Number(emp.priceTo))}`
                          : emp.priceFrom
                            ? `A partir de ${formatCurrency(Number(emp.priceFrom))}`
                            : `Até ${formatCurrency(Number(emp.priceTo))}`}
                      </p>
                    </div>
                  )}
                  {emp.paymentInfo && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Formas de Pagamento</p>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{emp.paymentInfo}</p>
                    </div>
                  )}
                  {emp.banks && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Bancos Financiadores</p>
                      <p className="text-gray-600 text-sm">{emp.banks}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Localização */}
            {(emp.locationDescription || emp.address || imagesOf('LOCALIZACAO').length > 0) && (
              <section>
                <SectionTitle icon={<Navigation className="w-5 h-5" />}>Localização</SectionTitle>
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                  {emp.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-[#2E86DE] mt-0.5 flex-shrink-0" />
                      <span>{[emp.address, emp.neighborhood, emp.city, emp.state, emp.zipCode].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {emp.locationDescription && (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{emp.locationDescription}</p>
                  )}
                  {emp.latitude && emp.longitude && (
                    <div className="rounded-xl overflow-hidden h-64 bg-gray-100">
                      <iframe
                        title="Mapa do empreendimento"
                        src={`https://maps.google.com/maps?q=${emp.latitude},${emp.longitude}&z=15&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {imagesOf('LOCALIZACAO').length > 0 && (
                    <ImageGallery images={imagesOf('LOCALIZACAO').map(i => ({ url: i.url, alt: i.alt ?? undefined, caption: i.caption ?? undefined }))} />
                  )}
                </div>
              </section>
            )}

            {/* Unidades disponíveis */}
            {emp.properties.length > 0 && (
              <section>
                <SectionTitle icon={<Building2 className="w-5 h-5" />}>
                  Unidades Disponíveis ({emp.properties.length})
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {emp.properties.map(p => {
                    const cover = p.images[0]
                    const title = p.title ?? `${p.propertyType ?? 'Unidade'} — ${p.neighborhood ?? p.city ?? ''}`
                    return (
                      <Link key={p.id} href={`/imoveis/${p.slug}`}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="relative h-44 bg-gray-100">
                          {cover ? (
                            <Image
                              src={cover.thumbnailUrl ?? cover.url}
                              alt={title}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Building2 className="w-10 h-10 m-auto mt-14 text-gray-300" />
                          )}
                          <span className="absolute top-3 left-3 bg-[#0D2F5E] text-white text-xs font-medium px-2 py-1 rounded-full">
                            {transactionLabel[p.transactionType] ?? p.transactionType}
                          </span>
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-[#0D2F5E] text-sm mb-1 truncate">{title}</p>
                          {p.price && (
                            <p className="text-lg font-bold text-[#2E86DE] mb-2">{formatCurrency(Number(p.price))}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                            {p.totalArea && (
                              <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{formatArea(Number(p.totalArea))}</span>
                            )}
                            {(p.bedrooms ?? 0) > 0 && (
                              <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms} dorms</span>
                            )}
                            {(p.bathrooms ?? 0) > 0 && (
                              <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms} banheiros</span>
                            )}
                            {(p.totalParkingSpots ?? 0) > 0 && (
                              <span className="flex items-center gap-1"><Car className="w-3 h-3" />{p.totalParkingSpots} vagas</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Corretor */}
            <section>
              <SectionTitle>Seu Corretor</SectionTitle>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#F0F4F8] flex-shrink-0 relative">
                    {ownerPhoto ? (
                      <Image src={ownerPhoto} alt={ownerName} fill sizes="64px" className="object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 m-4 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#0D2F5E] text-lg">{ownerName}</p>
                    {ownerCompany && <p className="text-sm text-gray-500">{ownerCompany}</p>}
                    {ownerCreci && <p className="text-xs text-gray-400">CRECI: {ownerCreci}</p>}
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {ownerPhone && (
                    <a href={`tel:${ownerPhone}`}
                      className="flex items-center gap-2 px-4 py-2 border border-[#0D2F5E] text-[#0D2F5E] rounded-xl text-sm font-medium hover:bg-[#0D2F5E] hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                      Ligar
                    </a>
                  )}
                  {ownerWhatsapp && (
                    <a href={waHref} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#1ebe57] transition-colors">
                      <MessageCircle className="w-4 h-4" fill="white" strokeWidth={0} />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </section>

          </div>

          {/* Coluna direita — formulário fixo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-display text-lg font-bold text-[#0D2F5E] mb-1">Tenho interesse!</h2>
              <p className="text-sm text-gray-400 mb-5">Deixe seu contato e entraremos em breve.</p>
              <ContactForm whatsapp={ownerWhatsapp} />
            </div>
          </div>

        </div>
      </div>

      {/* Barra inferior do corretor */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-2xl py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F0F4F8] flex-shrink-0 relative">
              {ownerPhoto ? (
                <Image src={ownerPhoto} alt={ownerName} fill sizes="40px" className="object-cover" />
              ) : (
                <Building2 className="w-5 h-5 m-2.5 text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0D2F5E] text-sm truncate">{ownerName}</p>
              {ownerCompany && <p className="text-xs text-gray-400 truncate">{ownerCompany}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {ownerPhone && (
              <a href={`tel:${ownerPhone}`}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#0D2F5E] text-[#0D2F5E] rounded-xl text-sm font-medium hover:bg-[#0D2F5E] hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Ligar</span>
              </a>
            )}
            {ownerWhatsapp && (
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#1ebe57] transition-colors">
                <MessageCircle className="w-4 h-4" fill="white" strokeWidth={0} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ── Componentes internos ──────────────────────────────────────────────────────

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-bold text-[#0D2F5E] mb-4 flex items-center gap-2">
      {icon && <span className="text-[#2E86DE]">{icon}</span>}
      {children}
    </h2>
  )
}

function ImageGallery({ images }: { images: { url: string; alt?: string; caption?: string }[] }) {
  if (images.length === 0) return null
  if (images.length === 1) {
    return (
      <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
        <Image src={images[0].url} alt={images[0].alt ?? ''} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
        {images[0].caption && (
          <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">{images[0].caption}</p>
        )}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((img, i) => (
        <div key={img.url + i} className={`relative rounded-xl overflow-hidden bg-gray-100 ${i === 0 ? 'col-span-2 md:col-span-2 aspect-video' : 'aspect-video'}`}>
          <Image
            src={img.url}
            alt={img.alt ?? ''}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {img.caption && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 text-center">{img.caption}</p>
          )}
        </div>
      ))}
    </div>
  )
}
