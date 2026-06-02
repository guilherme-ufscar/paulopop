export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { SearchBar } from '@/components/public/SearchBar'
import { PropertyCarousel } from '@/components/public/PropertyCarousel'
import { ContactForm } from '@/components/public/ContactForm'
import { GoogleReviews } from '@/components/public/GoogleReviews'

export const metadata: Metadata = {
  title: 'Paulo Pop | Corretor de Imoveis',
  description: 'Encontre o imovel ideal com consultoria personalizada para compra, venda e locacao.',
}

type HomeProperty = {
  id: string
  slug: string
  title: string | null
  propertyType: string | null
  transactionType: string
  status: string
  price: number | null
  totalArea: number | null
  bedrooms: number | null
  bathrooms: number | null
  environments: number | null
  totalParkingSpots: number | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  coverImage: string | null
  createdAt: Date
  isNew: boolean
}

function maskContact(value: string | null | undefined): string {
  if (!value) return ''
  if (value.length <= 6) return value
  return `${value.slice(0, 6)}...`
}

function sectionProperties(properties: HomeProperty[], predicate: (property: HomeProperty) => boolean, take = 8) {
  return properties.filter(predicate).slice(0, take)
}

interface PropertySectionProps {
  eyebrow: string
  title: string
  description: string
  href: string
  ctaLabel: string
  properties: HomeProperty[]
  backgroundClassName?: string
  sectionId: string
}

function PropertySection({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  properties,
  backgroundClassName = 'bg-white',
  sectionId,
}: PropertySectionProps) {
  return (
    <section className={`${backgroundClassName} py-20`} aria-labelledby={sectionId}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2E86DE]">{eyebrow}</p>
            <h2 id={sectionId} className="mt-3 font-display text-4xl font-bold text-[#0D2F5E]">
              {title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#0D2F5E]/10 bg-white px-5 py-3 text-sm font-semibold text-[#0D2F5E] transition hover:border-[#2E86DE] hover:text-[#2E86DE]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <PropertyCarousel properties={properties} />
        ) : (
          <div className="rounded-[30px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-display text-3xl font-bold text-[#0D2F5E]">Nenhum imovel encontrado</p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Assim que novos imoveis entrarem nessa categoria, eles vao aparecer aqui.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default async function HomePage() {
  const [config, recentProperties, blogPosts] = await Promise.all([
    prisma.siteConfig.findFirst(),
    prisma.property.findMany({
      where: { status: 'ACTIVE', hideOnSite: false },
      orderBy: { createdAt: 'desc' },
      take: 24,
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
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        slug: true, title: true, excerpt: true, coverUrl: true,
        category: true, publishedAt: true,
      },
    }),
  ])

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const properties: HomeProperty[] = recentProperties.map(property => ({
    ...property,
    price: property.price ? Number(property.price) : null,
    totalArea: property.totalArea ? Number(property.totalArea) : null,
    coverImage: property.images[0]?.thumbnailUrl ?? property.images[0]?.url ?? null,
    isNew: property.createdAt > thirtyDaysAgo,
  }))

  const ownerPhoto = config?.ownerPhotoUrl
  const ownerName = config?.ownerName ?? 'Paulo Pop'
  const ownerCreci = config?.ownerCreci
  const ownerCompany = config?.ownerCompany
  const whatsapp = config?.ownerWhatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP ?? ''
  const heroTitle = config?.heroTitle ?? `Encontre o proximo imovel com a consultoria de ${ownerName}`
  const heroSubtitle =
    config?.heroSubtitle ??
    'Uma home mais direta para quem quer comprar, vender ou alugar com criterio, contexto e agilidade.'

  const saleProperties = sectionProperties(properties, property => property.transactionType === 'SALE')
  const rentProperties = sectionProperties(properties, property => property.transactionType === 'RENT')
  const apartments = sectionProperties(properties, property => /apartamento|studio|flat|cobertura|kitnet/i.test(property.propertyType ?? ''))
  const houses = sectionProperties(properties, property => /casa|sobrado|mansao|chacara/i.test(property.propertyType ?? ''))
  const lands = sectionProperties(properties, property => /terreno|fazenda/i.test(property.propertyType ?? ''))

  const journeySteps = [
    'Entendimento do momento e do perfil do cliente',
    'Selecao objetiva de opcoes e visitas mais produtivas',
    'Negociacao com mais clareza, leitura de mercado e acompanhamento',
  ]

  const reasons = [
    {
      title: 'Curadoria mais enxuta',
      text: 'Menos excesso de listagem e mais opcoes que fazem sentido para a busca.',
    },
    {
      title: 'Acompanhamento proximo',
      text: 'Contato direto, alinhamento de expectativa e proximo passo claro em cada fase.',
    },
    {
      title: 'Leitura comercial',
      text: 'Comparacao de preco, perfil da regiao e posicionamento do imovel na negociacao.',
    },
  ]

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paulopop.com.br'

  const realEstateAgentJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: ownerName,
    url: siteUrl,
    ...(ownerPhoto ? { image: ownerPhoto } : {}),
    ...(config?.ownerPhone ? { telephone: config.ownerPhone } : {}),
    ...(config?.ownerEmail ? { email: config.ownerEmail } : {}),
    ...(ownerCreci ? { identifier: { '@type': 'PropertyValue', name: 'CRECI', value: ownerCreci } } : {}),
    ...(config?.ownerAddress ? { address: { '@type': 'PostalAddress', streetAddress: config.ownerAddress, addressRegion: 'DF', addressCountry: 'BR' } } : {}),
    ...(config?.logoUrl ? { logo: config.logoUrl } : {}),
    ...(ownerCompany ? { worksFor: { '@type': 'Organization', name: ownerCompany } } : {}),
    sameAs: [
      config?.ownerInstagram,
      config?.ownerFacebook,
      config?.ownerLinkedin,
      config?.ownerYoutube,
      config?.ownerTwitter,
    ].filter(Boolean),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentJsonLd) }}
      />
      <section className="relative overflow-hidden bg-[#07172f] text-white" aria-label="Hero">
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: config?.heroBgUrl
              ? undefined
              : 'radial-gradient(circle at 15% 20%, rgba(91,164,245,0.32), transparent 30%), linear-gradient(135deg, #07172f 0%, #0D2F5E 55%, #1B6EC2 100%)',
          }}
        />
        {config?.heroBgUrl && (
          <Image
            src={config.heroBgUrl}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,23,47,0.92)_8%,rgba(7,23,47,0.76)_45%,rgba(7,23,47,0.88)_100%)]" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 md:pb-24 md:pt-40 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_360px]">
            <div className="max-w-3xl">
              <h1 className="font-display text-5xl font-bold leading-[0.98] text-white sm:text-6xl xl:text-7xl">
                {heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                {heroSubtitle}
              </p>

              <div className="mt-8">
                <SearchBar />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/12 bg-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-[24px] bg-white/10">
                  {ownerPhoto ? (
                    <Image
                      src={ownerPhoto}
                      alt={ownerName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-8 w-8 text-white/60" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8cc4ff]">Corretor</p>
                  <h2 className="mt-1 font-display text-3xl font-bold text-white">{ownerName}</h2>
                  {ownerCompany && <p className="text-sm text-slate-300">{ownerCompany}</p>}
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-200">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-[#8cc4ff]" />
                  Atendimento consultivo para escolher com mais seguranca.
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <MapPin className="h-4 w-4 text-[#8cc4ff]" />
                  Leitura de mercado, perfil da regiao e apoio na negociacao.
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0D2F5E] transition hover:bg-[#F7F9FC]"
                >
                  Conhecer perfil
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Falar agora
                </Link>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-sm text-slate-300">
                {ownerCreci && <p>CRECI {ownerCreci}</p>}
                {whatsapp && <p className="mt-1">WhatsApp: {maskContact(whatsapp)}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {(config?.showDestaques ?? true) && properties.length > 0 && (
        <PropertySection
          eyebrow="Destaques"
          title="Imoveis em destaque na home"
          description="Uma selecao inicial para quem quer visualizar oportunidades logo de cara."
          href="/imoveis"
          ctaLabel="Ver todos os imoveis"
          properties={properties.slice(0, 10)}
          backgroundClassName="bg-[#f6f7fb]"
          sectionId="imoveis-destaque-title"
        />
      )}

      {(config?.showCompra ?? true) && saleProperties.length > 0 && (
        <PropertySection
          eyebrow="Compra"
          title="Imoveis para quem esta buscando comprar"
          description="Oportunidades organizadas para quem quer sair da busca generica e comparar melhor."
          href="/imoveis?transacao=comprar"
          ctaLabel="Ver opcoes de compra"
          properties={saleProperties}
          backgroundClassName="bg-white"
          sectionId="comprar-title"
        />
      )}

      {(config?.showLocacao ?? true) && rentProperties.length > 0 && (
        <PropertySection
          eyebrow="Locacao"
          title="Oportunidades para alugar com mais rapidez"
          description="Uma secao focada em quem quer praticidade sem abrir mao de comparacao e contexto."
          href="/imoveis?transacao=alugar"
          ctaLabel="Ver opcoes para alugar"
          properties={rentProperties}
          backgroundClassName="bg-[#f8fafc]"
          sectionId="alugar-title"
        />
      )}

      {(config?.showApartamentos ?? true) && apartments.length > 0 && (
        <PropertySection
          eyebrow="Categoria"
          title="Apartamentos em destaque"
          description="Uma selecao para quem quer praticidade urbana, moradia ou investimento."
          href="/imoveis?tipo=Apartamento"
          ctaLabel="Ver apartamentos"
          properties={apartments}
          backgroundClassName="bg-white"
          sectionId="apartamentos-title"
        />
      )}

      {(config?.showCasas ?? true) && houses.length > 0 && (
        <PropertySection
          eyebrow="Categoria"
          title="Casas e sobrados"
          description="Imoveis para quem busca mais espaco, conforto e flexibilidade no dia a dia."
          href="/imoveis?tipo=Casa"
          ctaLabel="Ver casas"
          properties={houses}
          backgroundClassName="bg-[#f8fafc]"
          sectionId="casas-title"
        />
      )}

      {(config?.showTerrenos ?? true) && lands.length > 0 && (
        <PropertySection
          eyebrow="Categoria"
          title="Terrenos e areas"
          description="Oportunidades para construir, expandir ou investir com visao de longo prazo."
          href="/imoveis?tipo=Terreno"
          ctaLabel="Ver terrenos"
          properties={lands}
          backgroundClassName="bg-white"
          sectionId="terrenos-title"
        />
      )}

      <section className="bg-[#f6f7fb] py-20" aria-labelledby="processo-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2E86DE]">Como funciona</p>
            <h2 id="processo-title" className="mt-3 max-w-xl font-display text-4xl font-bold text-[#0D2F5E]">
              Uma jornada mais clara do primeiro contato ate a negociacao
            </h2>
            <div className="mt-8 space-y-4">
              {journeySteps.map(step => (
                <div key={step} className="flex items-start gap-3 rounded-[24px] bg-white p-5 shadow-[0_18px_50px_-40px_rgba(8,30,63,0.45)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2E86DE]" />
                  <p className="text-sm leading-7 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#0D2F5E] p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8cc4ff]">Atendimento</p>
            <h3 className="mt-3 font-display text-4xl font-bold">Escolha com menos ruido</h3>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              O foco aqui e simplificar a decisao sem perder profundidade. Menos excesso de informacao e mais criterio no que entra para comparacao.
            </p>
            <Link
              href="/contato"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0D2F5E] transition hover:bg-[#F7F9FC]"
            >
              Conversar sobre a busca
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20" id="sobre" aria-labelledby="sobre-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {reasons.map(reason => (
              <div key={reason.title} className="rounded-[28px] border border-slate-200 bg-[#f8fafc] p-7">
                <h2 className="font-display text-3xl font-bold text-[#0D2F5E]">{reason.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{reason.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_520px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2E86DE]">Sobre</p>
              <h2 id="sobre-title" className="mt-3 max-w-xl font-display text-4xl font-bold text-[#0D2F5E]">
                Atendimento humano, leitura de mercado e acompanhamento real
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Cada cliente chega com uma urgencia, um objetivo e um nivel de clareza diferente. O trabalho aqui e transformar isso em uma busca mais bem orientada e uma negociacao mais segura.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0D2F5E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#081E3F]"
                >
                  Ver perfil completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/imoveis"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#2E86DE] hover:text-[#0D2F5E]"
                >
                  Explorar portfolio
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[#f6f9fc] p-6 shadow-[0_24px_60px_-42px_rgba(8,30,63,0.45)]">
              <div className="relative h-64 overflow-hidden rounded-[28px] bg-[#dbe7f3]">
                {ownerPhoto ? (
                  <Image
                    src={ownerPhoto}
                    alt={ownerName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2 className="h-20 w-20 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-[28px] bg-white p-6">
                <h3 className="font-display text-3xl font-bold text-[#0D2F5E]">{ownerName}</h3>
                {ownerCompany && <p className="mt-1 text-sm text-slate-500">{ownerCompany}</p>}
                {ownerCreci && <p className="mt-3 text-sm font-medium text-slate-700">CRECI {ownerCreci}</p>}
                {whatsapp && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    {maskContact(whatsapp)}
                  </p>
                )}
                {config?.ownerPhone && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-[#0D2F5E]" />
                    {maskContact(config.ownerPhone)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Avaliações Google ─── */}
      <section className="bg-[#f6f7fb] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GoogleReviews />
        </div>
      </section>

      {/* ─── Seção Blog ─── */}
      {blogPosts.length > 0 && (
        <section className="bg-[#f6f7fb] py-20" aria-labelledby="blog-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2E86DE]">Blog</p>
                <h2 id="blog-title" className="mt-3 font-display text-4xl font-bold text-[#0D2F5E]">
                  Artigos e dicas do mercado
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Informação para quem quer tomar decisões melhores na compra, venda ou aluguel.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 self-start rounded-full border border-[#0D2F5E]/10 bg-white px-5 py-3 text-sm font-semibold text-[#0D2F5E] transition hover:border-[#2E86DE] hover:text-[#2E86DE]"
              >
                Ver todos os artigos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-[0_4px_24px_-8px_rgba(8,30,63,0.12)] hover:shadow-[0_8px_32px_-8px_rgba(8,30,63,0.2)] hover:border-[#2E86DE]/30 transition-all"
                  aria-label={`Ler: ${post.title}`}
                >
                  <div className="aspect-[16/9] bg-[#dbe7f3] overflow-hidden">
                    {post.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl font-bold text-[#0D2F5E]/20">PP</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block px-2.5 py-0.5 bg-[#E8F1FB] text-[#0D2F5E] text-xs font-medium rounded-full mb-3">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#0D2F5E] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E86DE] group-hover:gap-2 transition-all ml-auto">
                        Ler <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#0D2F5E] py-20 text-white" aria-labelledby="contato-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8cc4ff]">Contato</p>
            <h2 id="contato-title" className="mt-3 max-w-md font-display text-4xl font-bold">
              Fale sobre o imovel que voce quer encontrar
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200">
              Se a ideia for comprar, vender ou alugar, a conversa pode comecar por aqui. Eu retorno com orientacao e proximos passos.
            </p>
            {config?.ownerAddress && (
              <p className="mt-6 flex items-center gap-2 text-sm text-slate-200">
                <MapPin className="h-4 w-4 text-[#8cc4ff]" />
                {config.ownerAddress}
              </p>
            )}
          </div>

          <div className="rounded-[32px] bg-white p-6 text-slate-900 shadow-[0_30px_80px_-50px_rgba(4,13,31,1)]">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-[#2E86DE]" />
              <h3 className="font-display text-2xl font-bold text-[#0D2F5E]">Contate-me</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Envie sua mensagem e eu retorno com orientacao personalizada.
            </p>
            <div className="mt-6">
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
