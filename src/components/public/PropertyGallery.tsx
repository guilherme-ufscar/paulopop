'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { LayoutGrid } from 'lucide-react'

interface GalleryImage {
  url: string
  alt?: string | null
}

interface PropertyGalleryProps {
  images: GalleryImage[]
  title?: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 bg-gradient-to-br from-[#0D2F5E]/10 to-[#2E86DE]/10 rounded-2xl flex items-center justify-center">
        <LayoutGrid className="w-16 h-16 text-gray-300" />
      </div>
    )
  }

  const slides = images.map(img => ({ src: img.url, alt: img.alt ?? title ?? '' }))

  function openAt(i: number) {
    setIndex(i)
    setOpen(true)
  }

  const main = images[0]
  const secondary = images.slice(1, 3)
  const remaining = images.length - 3

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden">
        {images.length === 1 ? (
          // Somente 1 imagem
          <button
            type="button"
            onClick={() => openAt(0)}
            className="w-full h-72 md:h-[480px] block"
            aria-label="Abrir galeria de fotos"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={main.url} alt={main.alt ?? title ?? ''} className="w-full h-full object-cover" />
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2 h-72 md:h-[480px]">
            {/* Foto principal */}
            <button
              type="button"
              onClick={() => openAt(0)}
              className={`relative overflow-hidden rounded-l-2xl ${secondary.length === 0 ? 'col-span-2 rounded-2xl' : ''}`}
              aria-label="Ver foto principal"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={main.url} alt={main.alt ?? title ?? ''} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </button>

            {/* Fotos secundárias */}
            {secondary.length > 0 && (
              <div className="flex flex-col gap-2">
                {secondary.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => openAt(i + 1)}
                    className={`relative flex-1 overflow-hidden ${i === 0 ? 'rounded-tr-2xl' : 'rounded-br-2xl'}`}
                    aria-label={`Ver foto ${i + 2}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt ?? title ?? ''} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    {/* Overlay "Ver todas" na última foto */}
                    {i === secondary.length - 1 && remaining > 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">+{remaining} fotos</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botão "Ver todas as fotos" */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => openAt(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-[#0D2F5E] font-semibold text-sm rounded-xl shadow-md transition-colors"
            aria-label={`Ver todas as ${images.length} fotos`}
          >
            <LayoutGrid className="w-4 h-4" />
            Ver todas as fotos ({images.length})
          </button>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' } }}
      />
    </>
  )
}
