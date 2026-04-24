interface MapEmbedProps {
  latitude: number
  longitude: number
  title?: string
}

export function MapEmbed({ latitude, longitude, title }: MapEmbedProps) {
  const delta = 0.008
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div style={{ width: '100%', height: '320px', borderRadius: '1rem', overflow: 'hidden' }}>
      <iframe
        title={`Mapa da localização: ${title ?? 'Imóvel'}`}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
