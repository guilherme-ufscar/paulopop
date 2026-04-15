-- Adicionar campos faltando em site_config
ALTER TABLE "site_config" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "site_config" ADD COLUMN IF NOT EXISTS "ogImageUrl" TEXT;
ALTER TABLE "site_config" ADD COLUMN IF NOT EXISTS "ownerCompanyCreci" TEXT;
ALTER TABLE "site_config" ADD COLUMN IF NOT EXISTS "ownerTwitter" TEXT;

-- Criar tabela de depoimentos
CREATE TABLE IF NOT EXISTS "testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatarUrl" TEXT,
    "source" TEXT DEFAULT 'manual',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);
