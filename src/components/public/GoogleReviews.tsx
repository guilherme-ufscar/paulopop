interface GoogleReviewsProps {
  title?: string
  className?: string
}

export function GoogleReviews({ title = 'O que nossos clientes dizem', className = '' }: GoogleReviewsProps) {
  return (
    <section className={className}>
      {title && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2E86DE]">Avaliações</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#0D2F5E]">{title}</h2>
        </div>
      )}
      <div className="elfsight-app-88dc3d84-544c-4b26-ac07-522d45347129" />
    </section>
  )
}
