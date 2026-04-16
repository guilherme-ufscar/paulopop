export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  MapPin, BedDouble, Maximize2, Building2, Calendar,
  CheckCircle, MessageCircle, Phone, ChevronRight,
  Layers, Users,
} from 'lucide-react'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const item = await prisma.empreendimento.findUnique({ where: { slug } })
  if (!item) return {}
  return {
    title: item.name,
    description: item.tagline ?? item.description ?? undefined,
    openGraph: { images: item.coverUrl ? [item.coverUrl] : [] },
  }
}

function fmt(value: { toString(): string } | number | string | null | undefined) {
  if (value === null || value === undefined) return null
  const n = Number(value.toString())
  if (isNaN(n)) return null
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function parseLines(text: string | null | undefined): string[] {
  if (!text) return []
  return text.split('\n').map(l => l.trim()).filter(Boolean)
}

function WhatsAppCTA({ phone, label, className }: { phone: string; label?: string | null; className?: string }) {
  const num = phone.replace(/\D/g, '')
  return (
    <a
      href={`https://wa.me/${num}?text=${encodeURIComponent('Olá! Tenho interesse neste empreendimento.')}`}
      target="_blank" rel="noopener noreferrer"
      className={className ?? 'inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#1ebe5d] transition-colors'}
    >
      <MessageCircle className="w-5 h-5" />
      {label ?? 'Falar com corretor'}
    </a>
  )
}

export default async function EmpreendimentoPage({ params }: Params) {
  const { slug } = await params
  const [item, config] = await Promise.all([
    prisma.empreendimento.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        images: { orderBy: { order: 'asc' } },
        floorPlanImages: { orderBy: { order: 'asc' } },
      },
    }),
    prisma.siteConfig.findFirst(),
  ])
  if (!item) notFound()

  const whatsapp = item.ctaWhatsapp ?? config?.ownerWhatsapp ?? ''
  const ctaLabel = item.ctaLabel ?? 'Quero saber mais'
  const amenities = parseLines(item.amenities)
  const highlights = parseLines(item.highlights)

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden" aria-label="Apresentação do empreendimento">
        {item.coverUrl ? (
          <Image src={item.coverUrl} alt={item.name} fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D2F5E] to-[#2E86DE]" />
        )}
        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          {item.logoUrl && (
            <div className="mb-6">
              <Image src={item.logoUrl} alt={`Logo ${item.name}`} width={160} height={60} className="object-contain" />
            </div>
          )}
          {item.neighborhood && (
            <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-2">{item.neighborhood}</p>
          )}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">{item.name}</h1>
          {item.tagline && (
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl">{item.tagline}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {whatsapp && <WhatsAppCTA phone={whatsapp} label={ctaLabel} />}
            <a href="#sobre" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/40 text-white rounded-full font-semibold text-sm hover:border-white transition-colors backdrop-blur-sm">
              Conhecer o projeto <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FICHA RÁPIDA ── */}
      {(item.bedroomsMin ?? item.areaMin ?? item.floors ?? item.totalUnits ?? item.deliveryDate) && (
        <section className="bg-[#0D2F5E] py-6" aria-label="Ficha técnica rápida">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-white text-center">
              {(item.bedroomsMin ?? item.bedroomsMax) && (
                <div className="flex flex-col items-center gap-1">
                  <BedDouble className="w-5 h-5 text-[#2E86DE]" />
                  <span className="text-xl font-bold">
                    {item.bedroomsMin === item.bedroomsMax
                      ? item.bedroomsMin
                      : `${item.bedroomsMin ?? '?'} a ${item.bedroomsMax ?? '?'}`}
                  </span>
                  <span className="text-xs text-white/60">Quartos</span>
                </div>
              )}
              {(item.areaMin ?? item.areaMax) && (
                <div className="flex flex-col items-center gap-1">
                  <Maximize2 className="w-5 h-5 text-[#2E86DE]" />
                  <span className="text-xl font-bold">
                    {item.areaMin === item.areaMax
                      ? `${item.areaMin}m²`
                      : `${item.areaMin ?? '?'} – ${item.areaMax ?? '?'}m²`}
                  </span>
                  <span className="text-xs text-white/60">Área</span>
                </div>
              )}
              {item.floors && (
                <div className="flex flex-col items-center gap-1">
                  <Layers className="w-5 h-5 text-[#2E86DE]" />
                  <span className="text-xl font-bold">{item.floors}</span>
                  <span className="text-xs text-white/60">Pavimentos</span>
                </div>
              )}
              {item.totalUnits && (
                <div className="flex flex-col items-center gap-1">
                  <Users className="w-5 h-5 text-[#2E86DE]" />
                  <span className="text-xl font-bold">{item.totalUnits}</span>
                  <span className="text-xs text-white/60">Unidades</span>
                </div>
              )}
              {item.deliveryDate && (
                <div className="flex flex-col items-center gap-1">
                  <Calendar className="w-5 h-5 text-[#2E86DE]" />
                  <span className="text-xl font-bold">{item.deliveryDate}</span>
                  <span className="text-xs text-white/60">Entrega</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SOBRE / DESTAQUES ── */}
      {(item.description || highlights.length > 0) && (
        <section id="sobre" className="py-20 bg-[#f6f7fb]" aria-labelledby="sobre-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-3">Sobre o empreendimento</p>
                <h2 id="sobre-title" className="font-display text-4xl font-bold text-[#0D2F5E] mb-6">{item.name}</h2>
                {item.description && <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>}
              </div>
              {highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map((h, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2E86DE] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── GALERIA ── */}
      {item.images.length > 0 && (
        <section className="py-20 bg-white" aria-label="Galeria de fotos">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-3">Galeria</p>
            <h2 className="font-display text-4xl font-bold text-[#0D2F5E] mb-10">Conheça o empreendimento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {item.images.map((img, i) => (
                <div key={img.id} className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto md:h-[400px]' : 'aspect-square'}`}>
                  <Image src={img.url} alt={img.caption ?? `Foto ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PREÇO / FINANCIAMENTO ── */}
      {(item.priceMin ?? item.priceMax ?? item.financing) && (
        <section className="py-20 bg-[#0D2F5E]" aria-label="Preço e financiamento">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-3">Investimento</p>
            <h2 className="font-display text-4xl font-bold mb-4">
              {fmt(item.priceMin) && fmt(item.priceMax) && item.priceMin !== item.priceMax
                ? `A partir de ${fmt(item.priceMin)}`
                : fmt(item.priceMin ?? item.priceMax) ?? 'Consulte o valor'}
            </h2>
            {item.priceMax && item.priceMin && item.priceMin !== item.priceMax && (
              <p className="text-white/60 mb-4">até {fmt(item.priceMax)}</p>
            )}
            {item.financing && (
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 text-sm mb-8">
                <CheckCircle className="w-4 h-4 text-[#2E86DE]" />
                Financiamento: {item.financing}
              </div>
            )}
            {whatsapp && (
              <div className="mt-4">
                <WhatsAppCTA phone={whatsapp} label={ctaLabel} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── AMENIDADES ── */}
      {amenities.length > 0 && (
        <section className="py-20 bg-[#f6f7fb]" aria-label="Lazer e infraestrutura">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-3">Lazer & Infraestrutura</p>
            <h2 className="font-display text-4xl font-bold text-[#0D2F5E] mb-10">Qualidade de vida no seu dia a dia</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {amenities.map((a, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8F1FB] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-[#2E86DE]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PLANTAS ── */}
      {item.floorPlanImages.length > 0 && (
        <section className="py-20 bg-white" aria-label="Plantas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-3">Plantas</p>
            <h2 className="font-display text-4xl font-bold text-[#0D2F5E] mb-10">Conheça os layouts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {item.floorPlanImages.map((img, i) => (
                <div key={img.id} className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image src={img.url} alt={img.caption ?? `Planta ${i + 1}`} fill className="object-contain p-2" />
                  </div>
                  {img.caption && <p className="text-center text-sm text-gray-500 p-3 border-t border-gray-100">{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCALIZAÇÃO ── */}
      {(item.address ?? item.city) && (
        <section className="py-20 bg-[#f6f7fb]" aria-label="Localização">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-3">Localização</p>
                <h2 className="font-display text-4xl font-bold text-[#0D2F5E] mb-6">Bem localizado, bem conectado</h2>
                {item.address && (
                  <div className="flex items-start gap-3 text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 text-[#2E86DE] flex-shrink-0 mt-0.5" />
                    <span>{[item.address, item.neighborhood, item.city, item.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
              {/* Mapa simples via OpenStreetMap embed */}
              {item.latitude && item.longitude && (
                <div className="h-64 rounded-2xl overflow-hidden shadow-sm">
                  <iframe
                    title="Localização no mapa"
                    width="100%" height="100%" style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${item.longitude - 0.01}%2C${item.latitude - 0.01}%2C${item.longitude + 0.01}%2C${item.latitude + 0.01}&layer=mapnik&marker=${item.latitude}%2C${item.longitude}`}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ── */}
      <section className="py-24 bg-[#0D2F5E]" aria-label="Contato">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-4">Pronto para o próximo passo?</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Entre em contato e garanta sua unidade
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Fale com {config?.ownerName ?? 'o corretor'} e tire todas as suas dúvidas sobre {item.name}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {whatsapp && (
              <WhatsAppCTA phone={whatsapp} label={ctaLabel}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-full font-semibold text-base shadow-xl hover:bg-[#1ebe5d] transition-colors" />
            )}
            {config?.ownerPhone && (
              <a href={`tel:${config.ownerPhone}`}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-base hover:border-white transition-colors">
                <Phone className="w-5 h-5" /> {config.ownerPhone}
              </a>
            )}
          </div>
          <div className="mt-10">
            <p className="text-white/40 text-sm mb-2">
              {config?.ownerName}
              {config?.ownerCreci ? ` · CRECI ${config.ownerCreci}` : ''}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
