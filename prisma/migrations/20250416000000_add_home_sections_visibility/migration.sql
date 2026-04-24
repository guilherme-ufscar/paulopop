-- Visibilidade das seções da home page
ALTER TABLE "site_config"
  ADD COLUMN IF NOT EXISTS "showDestaques"    BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showCompra"       BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showLocacao"      BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showApartamentos" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showCasas"        BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showTerrenos"     BOOLEAN NOT NULL DEFAULT true;
