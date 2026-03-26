import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cep = request.nextUrl.searchParams.get('cep')
  if (!cep) return NextResponse.json({ error: 'CEP não informado' }, { status: 400 })

  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const data = await res.json()
    if (data.erro) return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro ao consultar CEP' }, { status: 500 })
  }
}
