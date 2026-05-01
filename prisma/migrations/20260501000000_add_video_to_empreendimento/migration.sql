-- AlterTable
ALTER TABLE "empreendimentos" ADD COLUMN "youtubeUrl" TEXT,
ADD COLUMN "virtualTourUrl" TEXT,
ADD COLUMN "virtualTourType" TEXT DEFAULT 'NONE';
