import Link from 'next/link'

const countries = [
  'Angola', 'Brasil', 'Cabo Verde', 'França', 'Moçambique',
  'Portugal', 'Reino Unido', 'Suíça', 'EUA', 'Emirados Árabes',
]

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/imoveis', label: 'Imóveis' },
  { href: '/sobre', label: 'Sobre Mim' },
  { href: '/contato', label: 'Contato' },
]

const institutionalLinks = [
  { href: 'https://www.remax.com', label: 'RE/MAX Internacional' },
  { href: 'https://www.remax.eu', label: 'RE/MAX Europa' },
]

interface FooterProps {
  ownerName?: string
  ownerCompany?: string
}

export function Footer({ ownerName = 'Paulo Pop', ownerCompany }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0D2F5E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Coluna 1 — Logo e descrição */}
          <div className="lg:col-span-1">
            <p className="font-display text-2xl font-bold mb-2">{ownerName}</p>
            {ownerCompany && (
              <p className="text-blue-300 text-sm mb-4">{ownerCompany}</p>
            )}
            <p className="text-blue-200 text-sm leading-relaxed">
              Corretor de imóveis especializado em compra, venda e aluguel.
              Atendimento personalizado para encontrar o imóvel dos seus sonhos.
            </p>
          </div>

          {/* Coluna 2 — Links institucionais */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-blue-300 mb-4">
              Institucional
            </h3>
            <ul className="space-y-2">
              {institutionalLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Países */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-blue-300 mb-4">
              Países
            </h3>
            <ul className="grid grid-cols-2 gap-1">
              {countries.map(country => (
                <li key={country}>
                  <span className="text-blue-200 text-sm">{country}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 — Legal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-blue-300 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos-de-uso"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-blue-200/50 hover:text-blue-200 text-xs transition-colors"
                >
                  Área do Corretor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
          <p>© {currentYear} {ownerName}. Todos os direitos reservados.</p>
          <p>Desenvolvido com Next.js</p>
        </div>
      </div>
    </footer>
  )
}
