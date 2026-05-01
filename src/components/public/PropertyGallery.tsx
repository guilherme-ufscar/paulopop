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

const MAX_VISIBLE = 9

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
  const visible = images.slice(0, MAX_VISIBLE)
  const remaining = images.length - MAX_VISIBLE

  function openAt(i: number) {
    setIndex(i)
    setOpen(true)
  }

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {visible.map((img, i) => {
            const isLast = i === visible.length - 1
            const showOverlay = isLast && remaining > 0
            return (
              <button
                key={img.url + i}
                type="button"
                onClick={() => openAt(i)}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 focus:outline-none"
                aria-label={`Ver foto ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? title ?? ''}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {showOverlay && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <span className="text-white font-semibold text-base">+{remaining} fotos</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={() => openAt(0)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-[#0D2F5E] font-semibold text-xs rounded-lg shadow-md transition-colors"
            aria-label={`Ver todas as ${images.length} fotos`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Ver todas ({images.length})
          </button>
        )}
      </div>

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
