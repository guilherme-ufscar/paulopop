import { ReportClient } from './ReportClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Relatório de Análise de Mercado | Paulo Pop',
  robots: 'noindex',
}

export default function RelatorioPage({ params }: { params: { propertyId: string } }) {
  return <ReportClient propertyId={params.propertyId} />
}
