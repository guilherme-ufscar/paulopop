export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { ContactForm } from '@/components/public/ContactForm'
import { MapPin, Phone, Mail, MessageCircle, UserCircle2 } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato | Paulo Pop',
  description: 'Entre em contato com Paulo Pop. Tire dúvidas sobre compra, venda ou aluguel de imóveis.',
}

export default async function ContatoPage() {
  const config = await prisma.siteConfig.findFirst()
  const whatsapp = config?.ownerWhatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP ?? ''
  const ownerName = config?.ownerName ?? 'Paulo Pop'

  const contacts = [
    config?.ownerPhone && { icon: <Phone className="w-5 h-5 text-[#2E86DE]" />, label: 'Telefone', value: config.ownerPhone, href: `tel:${config.ownerPhone}` },
    whatsapp && { icon: <MessageCircle className="w-5 h-5 text-[#25D366]" />, label: 'WhatsApp', value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, '')}` },
    config?.ownerEmail && { icon: <Mail className="w-5 h-5 text-[#2E86DE]" />, label: 'E-mail', value: config.ownerEmail, href: `mailto:${config.ownerEmail}` },
    config?.ownerAddress && { icon: <MapPin className="w-5 h-5 text-[#2E86DE]" />, label: 'Endereço', value: config.ownerAddress, href: null },
  ].filter(Boolean)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paulopop.com.br'
  const realEstateAgentJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: ownerName,
    url: siteUrl,
    ...(config?.ownerPhotoUrl ? { image: config.ownerPhotoUrl } : {}),
    ...(config?.ownerPhone ? { telephone: config.ownerPhone } : {}),
    ...(config?.ownerEmail ? { email: config.ownerEmail } : {}),
    ...(config?.ownerCreci ? { identifier: { '@type': 'PropertyValue', name: 'CRECI', value: config.ownerCreci } } : {}),
    ...(config?.ownerAddress ? { address: { '@type': 'PostalAddress', streetAddress: config.ownerAddress, addressRegion: 'DF', addressCountry: 'BR' } } : {}),
    ...(config?.logoUrl ? { logo: config.logoUrl } : {}),
    ...(config?.ownerCompany ? { worksFor: { '@type': 'Organization', name: config.ownerCompany } } : {}),
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
      <div className="min-h-screen bg-[#F0F4F8]">
      <div className="bg-[#0D2F5E] py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2E86DE] text-xs font-semibold uppercase tracking-widest mb-2">Fale Conosco</p>
          <h1 className="font-display text-4xl font-bold text-white">Contato</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informações */}
          <div>
            {/* Foto e apresentação */}
            <div className="flex items-center gap-5 mb-8">
              {config?.ownerPhotoUrl ? (
                <Image
                  src={config.ownerPhotoUrl}
                  alt={`Foto de ${ownerName}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover shadow-md flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#E8F1FB] flex items-center justify-center flex-shrink-0 shadow-md">
                  <UserCircle2 className="w-12 h-12 text-[#2E86DE]" />
                </div>
              )}
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0D2F5E]">
                  Fale com {ownerName}
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  Corretor de Imóveis
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              Estou disponível para ajudá-lo a encontrar o imóvel ideal ou esclarecer qualquer dúvida
              sobre compra, venda ou aluguel de imóveis.
            </p>

            <div className="space-y-4">
              {contacts.map((c) => c && (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{c.label}</p>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-medium text-[#0D2F5E] hover:text-[#2E86DE] transition-colors"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="font-medium text-gray-700">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-[#0D2F5E] mb-5">
              Envie uma mensagem
            </h2>
            <ContactForm
              whatsapp={whatsapp}
              whatsappMessage={config?.whatsappMessage ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
