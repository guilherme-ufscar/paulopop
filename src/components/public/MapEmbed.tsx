'use client'

import { useEffect, useRef } from 'react'

interface MapEmbedProps {
  latitude: number
  longitude: number
  title?: string
}

export function MapEmbed({ latitude, longitude, title }: MapEmbedProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstance.current) return

    import('leaflet').then(L => {
      if (!mapRef.current || mapInstance.current) return

      // Corrigir ícone padrão do Leaflet no Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        scrollWheelZoom: false,
        // Desabilita animações de fade para evitar problema de tiles fantasmas
        fadeAnimation: false,
        zoomAnimation: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(title ?? 'Imóvel')
        .openPopup()

      mapInstance.current = map

      // Chamar invalidateSize várias vezes garante que o Leaflet
      // recalcula corretamente independente do timing do hydration
      setTimeout(() => map.invalidateSize(), 0)
      setTimeout(() => map.invalidateSize(), 200)
      setTimeout(() => map.invalidateSize(), 600)

      // ResizeObserver para recalcular quando o container muda de tamanho
      // (ex: sidebar fecha, janela é redimensionada)
      if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
        const ro = new ResizeObserver(() => {
          map.invalidateSize()
        })
        ro.observe(wrapperRef.current)
        // Guardar o observer para cleanup
        ;(map as Record<string, unknown>).__ro = ro
      }
    })

    return () => {
      if (mapInstance.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ro = (mapInstance.current as any).__ro as ResizeObserver | undefined
        if (ro) ro.disconnect()
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [latitude, longitude, title])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin="anonymous"
      />
      {/* Wrapper com altura explícita via style para garantir que o Leaflet
          veja as dimensões corretas independente do Tailwind ser aplicado */}
      <div ref={wrapperRef} style={{ width: '100%', height: '320px', borderRadius: '1rem', overflow: 'hidden' }}>
        <div
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          aria-label={`Mapa da localização: ${title ?? 'Imóvel'}`}
          role="img"
        />
      </div>
    </>
  )
}
