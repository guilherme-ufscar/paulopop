import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const properties = await prisma.property.findMany({
    where: { status: 'ACTIVE', hideOnSite: false },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { images: { where: { isCover: true }, take: 1 } },
  })

  const config = await prisma.siteConfig.findFirst()

  return (
    <main className="min-h-screen">
      {/* Hero Section placeholder */}
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="text-center text-white px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            {config?.ownerName ?? 'Paulo Pop'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-2">
            {config?.ownerCreci ? `CRECI ${config.ownerCreci}` : 'Corretor de Imóveis'}
          </p>
          <p className="text-lg text-blue-100 mb-8">
            {config?.heroSubtitle ?? 'Encontre o imóvel dos seus sonhos'}
          </p>
          <a
            href="/imoveis"
            className="inline-block bg-[#2E86DE] hover:bg-[#1B6EC2] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
          >
            Ver Imóveis
          </a>
        </div>
      </section>

      {/* Properties preview */}
      {properties.length > 0 && (
        <section className="py-16 px-4 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-[#0D2F5E] mb-8 text-center">
              Imóveis Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <a
                  key={property.id}
                  href={`/imoveis/${property.slug}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {property.images[0] ? (
                    <img
                      src={property.images[0].url}
                      alt={property.images[0].alt ?? property.title ?? 'Imóvel'}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem foto</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0D2F5E]">{property.title ?? property.propertyType}</h3>
                    <p className="text-gray-500 text-sm">{property.neighborhood}, {property.city}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
