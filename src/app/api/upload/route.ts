export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveImage, saveDocument } from '@/lib/upload'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const type = formData.get('type') as string | null

  if (!file) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 400 })
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'Arquivo muito grande (máx 10MB)' }, { status: 400 })
  }

  try {
    if (type === 'document') {
      const result = await saveDocument(file)
      return NextResponse.json({ success: true, ...result, name: file.name, type: file.name.split('.').pop() })
    } else {
      const result = await saveImage(file)
      return NextResponse.json({ success: true, ...result })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Upload error:', message)
    return NextResponse.json(
      { error: `Erro ao fazer upload: ${message}` },
      { status: 500 }
    )
  }
}
