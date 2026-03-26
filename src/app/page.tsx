import { prisma } from '@/lib/prisma'
import { SearchBar } from '@/components/public/SearchBar'
import { PropertyCarousel } from '@/components/public/PropertyCarousel'
import { ContactForm } from '@/components/public/ContactForm'
import {
  Phone, MessageCircle, Send, Youtube, Facebook, Linkedin,
  Twitter, Instagram, MapPin, Building2
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paulo Pop | Corretor de Imóveis',
  description: 'Encontre o imóvel dos seus sonhos com Paulo Pop. Especialista em compra, venda e aluguel de imóveis.',
}

// Ícone do Telegram (não está no lucide-react)
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.013 9.488c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 14.49l-2.95-.924c-.642-.2-.654-.642.135-.953l11.522-4.443c.535-.194 1.003.13.575.078z" />
    </svg>
  )
}

function maskContact(value: string | null | undefined): string {
  if (!value) return ''
  if (value.length <= 6) return value
  return value.slice(0, 6) + '...'
}

export default async function HomePage() {
  const [config, recentProperties] = await Promise.all([
    prisma.siteConfig.findFirst(),
    prisma.property.findMany({
      where: { status: 'ACTIVE', hideOnSite: false },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: {
        id: true,
        slug: true,
        title: true,
        propertyType: true,
        transactionType: true,
        status: true,
        price: true,
        totalArea: true,
        bedrooms: true,
        bathrooms: true,
        environments: true,
        totalParkingSpots: true,
        neighborhood: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        images: {
          where: { isCover: true },
          take: 1,
          select: { url: true, thumbnailUrl: true },
        },
      },
    }),
  ])

  // Determinar quais são "novos" (últimos 30 dias)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const carouselProperties = recentProperties.map(p => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    totalArea: p.totalArea ? Number(p.totalArea) : null,
    coverImage: p.images[0]?.thumbnailUrl ?? p.images[0]?.url ?? null,
    isNew: p.createdAt > thirtyDaysAgo,
  }))

  const heroBg = config?.heroBgUrl
  const ownerPhoto = config?.ownerPhotoUrl
  const ownerName = config?.ownerName ?? 'Paulo Pop'
  const ownerCreci = config?.ownerCreci
  const ownerCompany = config?.ownerCompany
  const whatsapp = config?.ownerWhatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP ?? ''
  const heroTitle = config?.heroTitle ?? `Bem-vindo ao site de ${ownerName}`
  const heroSubtitle = config?.heroSubtitle ?? 'Encontre o imóvel dos seus sonhos'

  const socialLinks = [
    { href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : null, icon: <MessageCircle className="w-5 h-5" fill="white" strokeWidth={0} />, label: 'WhatsApp', color: 'bg-[#25D366]' },
    { href: config?.ownerTelegram, icon: <TelegramIcon className="w-5 h-5" />, label: 'Telegram', color: 'bg-[#0088cc]' },
    { href: config?.ownerYoutube, icon: <Youtube className="w-5 h-5" />, label: 'YouTube', color: 'bg-red-600' },
    { href: config?.ownerFacebook, icon: <Facebook className="w-5 h-5" />, label: 'Facebook', color: 'bg-[#1877F2]' },
    { href: config?.ownerLinkedin, icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', color: 'bg-[#0A66C2]' },
    { href: config?.ownerTwitter, icon: <Twitter className="w-5 h-5" />, label: 'Twitter/X', color: 'bg-black' },
    { href: config?.ownerInstagram, icon: <Instagram className="w-5 h-5" />, label: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-500' },
  ].filter(s => !!s.href)

  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center"
        aria-label="Hero"
      >
        {/* Fundo */}
        {heroBg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0D2F5E 0%, #1A4A8A 50%, #2E86DE 100%)' }}
            aria-hidden="true"
          />
        )}
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Bloco do corretor */}
            <div className="flex-shrink-0 text-white max-w-xs">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 mb-4 bg-white/10">
                {ownerPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ownerPhoto} alt={ownerName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-white/60" />
                  </div>
                )}
              </div>

              <h1 className="font-display text-3xl font-bold mb-1">{ownerName}</h1>
              {ownerCreci && <p className="text-blue-200 text-sm mb-1">CRECI {ownerCreci}</p>}
              {ownerCompany && <p className="text-blue-100 text-sm mb-4">{ownerCompany}</p>}

              {/* Redes sociais */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2" aria-label="Redes sociais">
                  {socialLinks.map(s => (
                    <a
                      key={s.label}
                      href={s.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 ${s.color}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* SearchBar */}
            <div className="flex-1 w-full">
              <div className="mb-6">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {heroTitle}
                </h2>
                <p className="text-blue-100 text-lg">{heroSubtitle}</p>
              </div>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* ── Carrossel de Imóveis ──────────────────────────────────── */}
      {carouselProperties.length > 0 && (
        <section className="py-16 bg-[#F7F9FC]" aria-labelledby="imoveis-recentes-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-[#2E86DE] uppercase tracking-widest mb-1">
                  Portfólio
                </p>
                <h2 id="imoveis-recentes-title" className="font-display text-3xl font-bold text-[#0D2F5E]">
                  Meus imóveis recentemente cadastrados
                </h2>
              </div>
              <Link
                href="/imoveis"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#2E86DE] hover:text-[#0D2F5E] transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <PropertyCarousel properties={carouselProperties} />
            <div className="mt-6 sm:hidden text-center">
              <Link
                href="/imoveis"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#2E86DE] hover:text-[#0D2F5E]"
              >
                Ver todos os imóveis →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Sobre Mim ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white" id="sobre" aria-labelledby="sobre-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Coluna esquerda — info do corretor */}
            <div>
              <p className="text-xs font-semibold text-[#2E86DE] uppercase tracking-widest mb-2">
                Corretor
              </p>
              <h2 id="sobre-title" className="font-display text-3xl md:text-4xl font-bold text-[#0D2F5E] mb-6">
                {ownerName}
              </h2>

              {/* Foto grande */}
              <div className="w-full h-72 rounded-2xl overflow-hidden mb-6 bg-[#F0F4F8]">
                {ownerPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ownerPhoto}
                    alt={ownerName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-20 h-20 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Infos de contato parcialmente ocultados */}
              <div className="space-y-3">
                {ownerCreci && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F0F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-[#0D2F5E]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">CRECI</p>
                      <p className="text-sm font-medium text-gray-800">{ownerCreci}</p>
                    </div>
                  </div>
                )}
                {config?.ownerPhone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F0F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#0D2F5E]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Telefone</p>
                      <p className="text-sm font-medium text-gray-800">
                        {maskContact(config.ownerPhone)}
                        <Link href="/sobre" className="ml-2 text-[#2E86DE] text-xs hover:underline">Ver +</Link>
                      </p>
                    </div>
                  </div>
                )}
                {whatsapp && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F0F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">WhatsApp</p>
                      <p className="text-sm font-medium text-gray-800">
                        {maskContact(whatsapp)}
                        <Link href="/sobre" className="ml-2 text-[#2E86DE] text-xs hover:underline">Ver +</Link>
                      </p>
                    </div>
                  </div>
                )}
                {config?.ownerAddress && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F0F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[#0D2F5E]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Endereço</p>
                      <p className="text-sm font-medium text-gray-800">{config.ownerAddress}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Redes sociais */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6" aria-label="Redes sociais">
                  {socialLinks.map(s => (
                    <a
                      key={s.label}
                      href={s.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 ${s.color}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Coluna direita — formulário de contato */}
            <div className="bg-[#F7F9FC] rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-5 h-5 text-[#2E86DE]" />
                <h3 className="font-display text-xl font-bold text-[#0D2F5E]">Contate-me</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Preencha o formulário e responderei em breve.
              </p>
              <ContactForm
                whatsapp={whatsapp}
                whatsappMessage={config?.whatsappMessage ?? undefined}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
