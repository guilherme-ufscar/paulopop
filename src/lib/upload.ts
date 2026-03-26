import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_BASE = process.env.UPLOAD_DIR ?? './public/uploads'

export async function saveImage(file: File): Promise<{ url: string; thumbnailUrl: string }> {
  const sharp = (await import('sharp')).default
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const dir = path.join(process.cwd(), UPLOAD_BASE, 'images')
  await fs.mkdir(dir, { recursive: true })

  const ext = 'webp'
  const filename = `${uuidv4()}.${ext}`
  const thumbFilename = `thumb_${filename}`

  // Imagem principal (max 1920px, qualidade 85)
  await sharp(buffer)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(dir, filename))

  // Thumbnail (400px)
  await sharp(buffer)
    .resize(400, 300, { fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(path.join(dir, thumbFilename))

  return {
    url: `/uploads/images/${filename}`,
    thumbnailUrl: `/uploads/images/${thumbFilename}`,
  }
}

export async function saveDocument(file: File): Promise<{ url: string; size: number }> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const dir = path.join(process.cwd(), UPLOAD_BASE, 'documents')
  await fs.mkdir(dir, { recursive: true })

  const originalExt = file.name.split('.').pop() ?? 'bin'
  const filename = `${uuidv4()}.${originalExt}`

  await fs.writeFile(path.join(dir, filename), buffer)

  return {
    url: `/uploads/documents/${filename}`,
    size: buffer.length,
  }
}

export async function deleteFile(url: string): Promise<void> {
  const relativePath = url.replace(/^\//, '')
  const fullPath = path.join(process.cwd(), 'public', relativePath)
  try {
    await fs.unlink(fullPath)
  } catch {
    // Arquivo pode não existir, ignorar
  }
}
