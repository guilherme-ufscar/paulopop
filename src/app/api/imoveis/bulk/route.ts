export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/imoveis/bulk
// Body: { action: 'delete' | 'status', ids: string[], status?: string }
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const { action, ids, status } = body as {
    action: 'delete' | 'status'
    ids: string[]
    status?: string
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'Nenhum imóvel selecionado' }, { status: 400 })
  }

  if (action === 'delete') {
    await prisma.property.deleteMany({ where: { id: { in: ids } } })
    return NextResponse.json({ success: true, count: ids.length })
  }

  if (action === 'status') {
    if (!status) return NextResponse.json({ error: 'Status não informado' }, { status: 400 })
    await prisma.property.updateMany({
      where: { id: { in: ids } },
      data: {
        status: status as never,
        ...(status === 'ACTIVE' ? { publishedAt: new Date() } : {}),
      },
    })
    return NextResponse.json({ success: true, count: ids.length })
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
}
