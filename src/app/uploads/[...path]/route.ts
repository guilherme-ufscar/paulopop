import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

const MIME: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const segments = params.path ?? []

  // Impedir path traversal
  if (segments.some(s => s === '..' || s.includes('\0'))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const UPLOAD_BASE = process.env.UPLOAD_DIR
    ?? path.join(process.cwd(), 'public', 'uploads')

  const filePath = path.join(UPLOAD_BASE, ...segments)

  // Garantir que o caminho resolvido está dentro do diretório de uploads
  const resolvedBase = path.resolve(UPLOAD_BASE)
  const resolvedFile = path.resolve(filePath)
  if (!resolvedFile.startsWith(resolvedBase)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const buffer = await fs.readFile(resolvedFile)
    const ext = resolvedFile.split('.').pop()?.toLowerCase() ?? ''
    const contentType = MIME[ext] ?? 'application/octet-stream'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
