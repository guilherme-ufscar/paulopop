import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateContract } from '@/lib/ai'

export async function POST(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    include: {
      owner: true,
      agent: true,
    },
  })

  if (!property) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })

  try {
    const html = await generateContract(
      {
        title: property.title,
        ref: property.ref,
        address: property.address
          ? `${property.address}, ${property.number ?? ''} ${property.complement ?? ''}`.trim()
          : null,
        city: property.city,
        state: property.state,
        price: property.price ? Number(property.price) : null,
        contractType: property.contractType,
        captureCommissionPct: property.captureCommissionPct ? Number(property.captureCommissionPct) : null,
        saleCommissionPct: property.saleCommissionPct ? Number(property.saleCommissionPct) : null,
        expiryDate: property.expiryDate?.toISOString() ?? null,
      },
      {
        name: property.owner?.name ?? property.ownerName ?? 'Proprietário',
        cpf: property.owner?.cpf ?? null,
        phone: property.owner?.phone ?? null,
        email: property.owner?.email ?? null,
      },
      {
        name: property.agent.name,
        creci: property.agent.creci ?? null,
        company: property.agent.company ?? null,
      }
    )

    return NextResponse.json({ html })
  } catch (err) {
    console.error('[Contrato] Erro:', err)
    return NextResponse.json({ error: 'Erro ao gerar contrato' }, { status: 500 })
  }
}
