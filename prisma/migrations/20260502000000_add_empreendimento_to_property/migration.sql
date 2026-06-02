-- AlterTable
ALTER TABLE "properties" ADD COLUMN "empreendimentoId" TEXT;

-- Migrar dados: IDs que existem em empreendimentos mas não em condominiums
UPDATE "properties" p
SET "empreendimentoId" = p."condominiumId", "condominiumId" = NULL
WHERE p."condominiumId" IS NOT NULL
  AND EXISTS (SELECT 1 FROM "empreendimentos" e WHERE e.id = p."condominiumId")
  AND NOT EXISTS (SELECT 1 FROM "condominiums" c WHERE c.id = p."condominiumId");

-- Limpar condominiumId inválidos restantes (que não existem em nenhuma das tabelas)
UPDATE "properties"
SET "condominiumId" = NULL
WHERE "condominiumId" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "condominiums" c WHERE c.id = "properties"."condominiumId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_empreendimentoId_fkey" FOREIGN KEY ("empreendimentoId") REFERENCES "empreendimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
