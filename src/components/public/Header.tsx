'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/imoveis', label: 'Imóveis' },
  { href: '/sobre', label: 'Sobre Mim' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fechar menu ao trocar de rota
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isHero = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || !isHero || mobileOpen
            ? 'bg-white shadow-md'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className={cn(
                'font-display text-xl md:text-2xl font-bold tracking-tight transition-colors',
                scrolled || !isHero || mobileOpen
                  ? 'text-[#0D2F5E]'
                  : 'text-white'
              )}
              aria-label="Paulo Pop — Início"
            >
              Paulo Pop
            </Link>

            {/* Navegação desktop */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative pb-1',
                    'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#2E86DE] after:transition-all',
                    pathname === link.href ? 'after:w-full' : 'after:w-0 hover:after:w-full',
                    scrolled || !isHero
                      ? pathname === link.href
                        ? 'text-[#2E86DE]'
                        : 'text-gray-700 hover:text-[#0D2F5E]'
                      : pathname === link.href
                        ? 'text-[#2E86DE]'
                        : 'text-white/90 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Ícones direita */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Selecionar idioma"
                className={cn(
                  'p-2 rounded-full transition-colors',
                  scrolled || !isHero || mobileOpen
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-white/80 hover:text-white'
                )}
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Hamburger mobile */}
              <button
                type="button"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(v => !v)}
                className={cn(
                  'md:hidden p-2 rounded-full transition-colors',
                  scrolled || !isHero || mobileOpen
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:text-white/80'
                )}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Navegação mobile">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-[#0D2F5E] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Spacer para páginas não-hero */}
      {pathname !== '/' && <div className="h-16 md:h-20" />}
    </>
  )
}
