import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário admin padrão
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@paulopop.com.br' },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await prisma.user.create({
      data: {
        name: 'Paulo Pop',
        email: 'admin@paulopop.com.br',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        creci: '12345-F',
        company: 'Paulo Pop Imóveis',
      },
    })
    console.log('Admin criado: admin@paulopop.com.br / admin123')
  } else {
    console.log('Admin já existe, pulando seed.')
  }

  // Criar configuração inicial do site
  const existingConfig = await prisma.siteConfig.findFirst()
  if (!existingConfig) {
    await prisma.siteConfig.create({
      data: {
        ownerName: 'Paulo Pop',
        ownerCreci: '12345-F',
        ownerCompany: 'Paulo Pop Imóveis',
        metaTitle: 'Paulo Pop | Corretor de Imóveis',
        metaDescription: 'Encontre o imóvel dos seus sonhos com Paulo Pop. Especialista em compra, venda e aluguel de imóveis.',
        heroTitle: 'Encontre o imóvel dos seus sonhos',
        heroSubtitle: 'Especialista em compra, venda e aluguel de imóveis com atendimento personalizado.',
        whatsappMessage: 'Olá Paulo! Vi seu site e gostaria de mais informações sobre um imóvel.',
      },
    })
    console.log('Configuração do site criada.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
