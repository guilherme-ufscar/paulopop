import { prisma } from '@/lib/prisma'
import { ContactForm } from '@/components/public/ContactForm'
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
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

  return (
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
            <h2 className="font-display text-2xl font-bold text-[#0D2F5E] mb-6">
              Fale com {ownerName}
            </h2>
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
  )
}
