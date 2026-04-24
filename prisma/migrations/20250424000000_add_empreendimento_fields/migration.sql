-- CreateEnum
CREATE TYPE "EmpreendimentoStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- CreateEnum
CREATE TYPE "EmpreendimentoImageCategory" AS ENUM ('FACHADA', 'AREAS_COMUNS', 'TIPOLOGIA', 'LAZER', 'LOCALIZACAO');

-- AlterTable: add new fields to condominiums
ALTER TABLE "condominiums"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "subtitle" TEXT,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "status" "EmpreendimentoStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "tipologiasDescription" TEXT,
  ADD COLUMN "lazerDescription" TEXT,
  ADD COLUMN "neighborhood" TEXT,
  ADD COLUMN "latitude" DECIMAL(10,7),
  ADD COLUMN "longitude" DECIMAL(10,7),
  ADD COLUMN "locationDescription" TEXT,
  ADD COLUMN "priceFrom" DECIMAL(15,2),
  ADD COLUMN "priceTo" DECIMAL(15,2),
  ADD COLUMN "paymentInfo" TEXT,
  ADD COLUMN "banks" TEXT,
  ADD COLUMN "totalUnits" INTEGER,
  ADD COLUMN "deliveryDate" TEXT,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Populate slug for existing rows (using id as fallback)
UPDATE "condominiums" SET "slug" = id WHERE "slug" IS NULL;

-- Make slug NOT NULL and UNIQUE after populating
ALTER TABLE "condominiums"
  ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "condominiums_slug_key" ON "condominiums"("slug");

-- CreateTable: empreendimento_images
CREATE TABLE "empreendimento_images" (
  "id" TEXT NOT NULL,
  "condominiumId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "alt" TEXT,
  "caption" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "category" "EmpreendimentoImageCategory" NOT NULL DEFAULT 'FACHADA',

  CONSTRAINT "empreendimento_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "empreendimento_images"
  ADD CONSTRAINT "empreendimento_images_condominiumId_fkey"
  FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
