-- Empreendimentos (lançamentos / projetos imobiliários)
CREATE TABLE "empreendimentos" (
  "id"             TEXT NOT NULL,
  "slug"           TEXT NOT NULL,
  "name"           TEXT NOT NULL,
  "tagline"        TEXT,
  "description"    TEXT,
  "status"         TEXT NOT NULL DEFAULT 'DRAFT',
  "address"        TEXT,
  "neighborhood"   TEXT,
  "city"           TEXT,
  "state"          TEXT,
  "latitude"       DOUBLE PRECISION,
  "longitude"      DOUBLE PRECISION,
  "architect"      TEXT,
  "deliveryDate"   TEXT,
  "totalUnits"     INTEGER,
  "floors"         INTEGER,
  "bedroomsMin"    INTEGER,
  "bedroomsMax"    INTEGER,
  "areaMin"        DOUBLE PRECISION,
  "areaMax"        DOUBLE PRECISION,
  "priceMin"       DECIMAL(15,2),
  "priceMax"       DECIMAL(15,2),
  "financing"      TEXT,
  "coverUrl"       TEXT,
  "logoUrl"        TEXT,
  "amenities"      TEXT,
  "highlights"     TEXT,
  "ctaLabel"       TEXT,
  "ctaWhatsapp"    TEXT,
  "ctaUrl"         TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "empreendimentos_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "empreendimentos_slug_key" ON "empreendimentos"("slug");

CREATE TABLE "empreendimento_images" (
  "id"                 TEXT NOT NULL,
  "empreendimentoId"   TEXT NOT NULL,
  "url"                TEXT NOT NULL,
  "caption"            TEXT,
  "order"              INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "empreendimento_images_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "empreendimento_images_empreendimentoId_fkey"
    FOREIGN KEY ("empreendimentoId") REFERENCES "empreendimentos"("id") ON DELETE CASCADE
);

CREATE TABLE "empreendimento_floor_plans" (
  "id"                 TEXT NOT NULL,
  "empreendimentoId"   TEXT NOT NULL,
  "url"                TEXT NOT NULL,
  "caption"            TEXT,
  "order"              INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "empreendimento_floor_plans_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "empreendimento_floor_plans_empreendimentoId_fkey"
    FOREIGN KEY ("empreendimentoId") REFERENCES "empreendimentos"("id") ON DELETE CASCADE
);
