import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generatePropertyDescription } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()

  try {
    const result = await generatePropertyDescription(body)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[AI] Erro ao gerar descrição:', err)
    return NextResponse.json(
      { error: 'Erro ao gerar descrição com IA' },
      { status: 500 }
    )
  }
}
