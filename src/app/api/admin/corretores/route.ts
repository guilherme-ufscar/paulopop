export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/admin/corretores — lista todos os corretores
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      whatsapp: true,
      creci: true,
      company: true,
      avatarUrl: true,
      active: true,
      createdAt: true,
      _count: { select: { properties: true } },
    },
  })

  return NextResponse.json(users)
}

// POST /api/admin/corretores — cria novo corretor
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json() as {
    name: string
    email: string
    password: string
    role?: string
    phone?: string
    whatsapp?: string
    creci?: string
    company?: string
    companyCreci?: string
    bio?: string
    instagram?: string
    facebook?: string
    linkedin?: string
    youtube?: string
  }

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({ where: { email: body.email } })
  if (exists) {
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(body.password, 12)

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashed,
      role: (body.role as 'ADMIN' | 'AGENT') ?? 'AGENT',
      phone: body.phone,
      whatsapp: body.whatsapp,
      creci: body.creci,
      company: body.company,
      companyCreci: body.companyCreci,
      bio: body.bio,
      instagram: body.instagram,
      facebook: body.facebook,
      linkedin: body.linkedin,
      youtube: body.youtube,
    },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json(user, { status: 201 })
}
