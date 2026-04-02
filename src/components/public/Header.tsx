'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, Menu, Phone, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/imoveis?transacao=comprar', label: 'Comprar' },
  { href: '/imoveis?transacao=alugar', label: 'Alugar' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

const propertyCategories = [
  { href: '/imoveis', label: 'Todos os imoveis' },
  { href: '/imoveis?tipo=Apartamento', label: 'Apartamentos' },
  { href: '/imoveis?tipo=Casa', label: 'Casas' },
  { href: '/imoveis?tipo=Terreno', label: 'Terrenos' },
  { href: '/imoveis?tipo=Sala Comercial', label: 'Comerciais' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDesktopDropdownOpen(false)
    setMobileCategoriesOpen(false)
  }, [pathname])

  const isHero = pathname === '/'
  const isSolid = scrolled || !isHero || mobileOpen
  const imoveisActive = pathname.startsWith('/imoveis')

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          isSolid
            ? 'bg-white/92 shadow-[0_18px_50px_-28px_rgba(8,30,63,0.55)] backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 md:pt-5 lg:px-8">
          <div
            className={cn(
              'flex items-center justify-between rounded-[28px] border px-4 py-3 md:px-6 md:py-4 transition-all duration-300',
              isSolid
                ? 'border-slate-200/80 bg-white/90'
                : 'border-white/15 bg-white/10 backdrop-blur-md'
            )}
          >
            <Link href="/" className="flex items-center gap-3 transition-colors" aria-label="Paulo Pop - Inicio">
              <span
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                  isSolid
                    ? 'border-[#0D2F5E]/10 bg-[#F7F9FC] text-[#0D2F5E]'
                    : 'border-white/20 bg-white/10 text-white'
                )}
              >
                PP
              </span>
              <span className="flex flex-col">
                <span
                  className={cn(
                    'font-display text-xl font-bold tracking-tight md:text-2xl transition-colors',
                    isSolid ? 'text-[#0D2F5E]' : 'text-white'
                  )}
                >
                  Paulo Pop
                </span>
                <span
                  className={cn(
                    'hidden text-[11px] uppercase tracking-[0.28em] md:block',
                    isSolid ? 'text-slate-500' : 'text-white/65'
                  )}
                >
                  Consultoria Imobiliaria
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-2 xl:flex" aria-label="Navegacao principal">
              <Link
                href="/"
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  pathname === '/'
                    ? isSolid
                      ? 'bg-[#0D2F5E] text-white'
                      : 'bg-white text-[#0D2F5E]'
                    : isSolid
                      ? 'text-slate-700 hover:bg-slate-100 hover:text-[#0D2F5E]'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                )}
              >
                Inicio
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setDesktopDropdownOpen(true)}
                onMouseLeave={() => setDesktopDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setDesktopDropdownOpen(value => !value)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                    imoveisActive
                      ? isSolid
                        ? 'bg-[#0D2F5E] text-white'
                        : 'bg-white text-[#0D2F5E]'
                      : isSolid
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-[#0D2F5E]'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                  )}
                  aria-expanded={desktopDropdownOpen}
                  aria-haspopup="menu"
                >
                  Imoveis
                  <ChevronDown className={cn('h-4 w-4 transition-transform', desktopDropdownOpen && 'rotate-180')} />
                </button>

                {desktopDropdownOpen && (
                  <div className="absolute left-0 top-full w-64 rounded-[24px] border border-slate-200 bg-white pt-6 pb-3 px-3 shadow-[0_24px_60px_-30px_rgba(8,30,63,0.35)]">
                    <div className="flex flex-col gap-1" role="menu" aria-label="Categorias de imoveis">
                      {propertyCategories.map(category => (
                        <Link
                          key={category.href}
                          href={category.href}
                          className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0D2F5E]"
                          role="menuitem"
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {navLinks.slice(1).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                    pathname === link.href
                      ? isSolid
                        ? 'bg-[#0D2F5E] text-white'
                        : 'bg-white text-[#0D2F5E]'
                      : isSolid
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-[#0D2F5E]'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/contato"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  isSolid
                    ? 'border-slate-200 text-slate-700 hover:border-[#2E86DE] hover:text-[#0D2F5E]'
                    : 'border-white/20 text-white hover:bg-white/10'
                )}
              >
                <Phone className="h-4 w-4" />
                Contato
              </Link>
              <Link
                href="/imoveis"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  isSolid
                    ? 'bg-[#0D2F5E] text-white hover:bg-[#081E3F]'
                    : 'bg-white text-[#0D2F5E] hover:bg-[#F7F9FC]'
                )}
              >
                Ver imoveis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/contato"
                className={cn(
                  'rounded-full border p-2 transition-colors',
                  isSolid
                    ? 'border-slate-200 text-slate-700'
                    : 'border-white/20 text-white'
                )}
                aria-label="Contato"
              >
                <Phone className="h-4 w-4" />
              </Link>
              <button
                type="button"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(value => !value)}
                className={cn(
                  'rounded-full border p-2 transition-colors',
                  isSolid
                    ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'border-white/20 text-white hover:bg-white/10'
                )}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="px-4 pt-3 md:hidden">
            <nav
              className="mx-auto flex max-w-7xl flex-col gap-2 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-34px_rgba(8,30,63,0.7)]"
              aria-label="Navegacao mobile"
            >
              <Link href="/" className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Inicio
              </Link>

              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(value => !value)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                aria-expanded={mobileCategoriesOpen}
              >
                Imoveis
                <ChevronDown className={cn('h-4 w-4 transition-transform', mobileCategoriesOpen && 'rotate-180')} />
              </button>

              {mobileCategoriesOpen && (
                <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-2">
                  {propertyCategories.map(category => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.slice(1).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/contato"
                className="inline-flex items-center justify-between rounded-2xl bg-[#F7F9FC] px-4 py-3 text-sm font-medium text-[#0D2F5E]"
              >
                Falar comigo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {!isHero && <div className="h-[92px] md:h-[112px]" />}
    </>
  )
}
