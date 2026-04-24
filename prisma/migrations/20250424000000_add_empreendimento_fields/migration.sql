-- Adiciona campos extras ao modelo Empreendimento (já criado pela migration anterior)
ALTER TABLE "empreendimentos"
  ADD COLUMN IF NOT EXISTS "zipCode" TEXT,
  ADD COLUMN IF NOT EXISTS "locationDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "paymentInfo" TEXT,
  ADD COLUMN IF NOT EXISTS "banks" TEXT,
  ADD COLUMN IF NOT EXISTS "tipologiasDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "lazerDescription" TEXT;

-- Adiciona campos extras ao modelo EmpreendimentoImage
ALTER TABLE "empreendimento_images"
  ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "alt" TEXT,
  ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'FACHADA';
