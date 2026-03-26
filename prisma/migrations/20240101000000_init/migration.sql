-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'AGENT');

-- CreateEnum
CREATE TYPE "PropertyPurpose" AS ENUM ('RESIDENTIAL', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('BRAZIL', 'ABROAD');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SOLD', 'RENTED', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('EXCLUSIVE', 'OPEN', 'AUTHORIZATION');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('FIXED', 'ON_REQUEST', 'NEGOTIABLE');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- CreateEnum
CREATE TYPE "VirtualTourType" AS ENUM ('NONE', 'BANIB', 'OTHER');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('POOL', 'GARDEN', 'GARAGE', 'JACUZZI', 'SOLAR_HEATING', 'ACCEPTS_PETS', 'INDIVIDUAL_GAS_METER', 'WHEELCHAIR_ACCESSIBLE', 'GOURMET_BALCONY', 'BARBECUE', 'ELEVATOR', 'GYM', 'PARTY_ROOM', 'PLAYGROUND', 'SAUNA', 'SECURITY_24H', 'INTERCOM', 'ALARM', 'GENERATOR', 'FURNISHED', 'SEMI_FURNISHED', 'AIR_CONDITIONING', 'WOOD_FLOOR', 'CERAMIC_FLOOR', 'MARBLE_FLOOR');

-- CreateEnum
CREATE TYPE "LifestyleType" AS ENUM ('RETIREMENT', 'WATER_SPRING', 'BEACH', 'GOLF', 'INVESTMENT', 'METROPOLIS', 'RANCH', 'SKI_RESORT', 'HOT_CLIMATE', 'COUNTRYSIDE');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('CLIENT', 'OWNER', 'PARTNER', 'INVESTOR');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('SITE', 'WHATSAPP', 'PORTAL', 'REFERRAL', 'MANUAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'CLOSED', 'LOST');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('PROPERTY_CREATED', 'PROPERTY_UPDATED', 'PROPERTY_PUBLISHED', 'PROPERTY_SOLD', 'LEAD_RECEIVED', 'LEAD_CONTACTED', 'VISIT_SCHEDULED', 'VISIT_DONE', 'DOCUMENT_ADDED', 'IMAGE_ADDED', 'ANALYSIS_GENERATED', 'NOTE_ADDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'AGENT',
    "phone" TEXT,
    "whatsapp" TEXT,
    "creci" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "company" TEXT,
    "companyCreci" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "telegram" TEXT,
    "twitter" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "purpose" "PropertyPurpose" NOT NULL DEFAULT 'RESIDENTIAL',
    "transactionType" "TransactionType" NOT NULL DEFAULT 'SALE',
    "location" "LocationType" NOT NULL DEFAULT 'BRAZIL',
    "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
    "contractType" "ContractType",
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "hideOnSite" BOOLEAN NOT NULL DEFAULT false,
    "propertyType" TEXT,
    "marketStatus" TEXT,
    "condition" TEXT,
    "category" TEXT,
    "landUse" TEXT,
    "availabilityDate" TIMESTAMP(3),
    "constructionYear" INTEGER,
    "price" DECIMAL(15,2),
    "priceType" "PriceType",
    "pricePerSqm" DECIMAL(10,2),
    "hidePrice" BOOLEAN NOT NULL DEFAULT false,
    "iptu" DECIMAL(10,2),
    "iptuPeriod" TEXT,
    "condominiumFee" DECIMAL(10,2),
    "condominiumFeePeriod" TEXT,
    "captureCommissionPct" DECIMAL(5,2),
    "captureCommissionAmt" DECIMAL(10,2),
    "captureCommissionType" "CommissionType" NOT NULL DEFAULT 'PERCENTAGE',
    "saleCommissionPct" DECIMAL(5,2),
    "saleCommissionAmt" DECIMAL(10,2),
    "saleCommissionType" "CommissionType" NOT NULL DEFAULT 'PERCENTAGE',
    "iptuRegistration" TEXT,
    "registryNumber" TEXT,
    "financialNotes" TEXT,
    "totalArea" DECIMAL(10,2),
    "usefulArea" DECIMAL(10,2),
    "landArea" DECIMAL(10,2),
    "cubicVolume" DECIMAL(10,2),
    "landDimensionWidth" DECIMAL(10,2),
    "landDimensionLength" DECIMAL(10,2),
    "floors" INTEGER,
    "unitsInBuilding" INTEGER,
    "maxOccupancy" INTEGER,
    "totalParkingSpots" INTEGER,
    "plateRestriction" BOOLEAN NOT NULL DEFAULT false,
    "environments" INTEGER DEFAULT 0,
    "bedrooms" INTEGER DEFAULT 0,
    "bathrooms" INTEGER DEFAULT 0,
    "suites" INTEGER DEFAULT 0,
    "zipCode" TEXT,
    "address" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "landmark" TEXT,
    "neighborhood" TEXT,
    "commercialNeighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "region" TEXT,
    "floor" TEXT,
    "buildingFloors" INTEGER,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "showFullAddress" BOOLEAN NOT NULL DEFAULT false,
    "keyNumber" TEXT,
    "title" TEXT,
    "description" TEXT,
    "marketingDescription" TEXT,
    "surroundingsInfo" TEXT,
    "titleEn" TEXT,
    "descriptionEn" TEXT,
    "condominiumId" TEXT,
    "ownerId" TEXT,
    "ownerName" TEXT,
    "agentId" TEXT NOT NULL,
    "secondaryAgentId" TEXT,
    "virtualTourType" "VirtualTourType" NOT NULL DEFAULT 'NONE',
    "virtualTourUrl" TEXT,
    "externalLink" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_spots" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT,

    CONSTRAINT "parking_spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" DECIMAL(8,2),
    "description" TEXT,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_features" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "feature" "FeatureType" NOT NULL,

    CONSTRAINT "property_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_lifestyles" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "lifestyle" "LifestyleType" NOT NULL,

    CONSTRAINT "property_lifestyles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_fees" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "period" TEXT,

    CONSTRAINT "additional_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is360" BOOLEAN NOT NULL DEFAULT false,
    "isPanoramic" BOOLEAN NOT NULL DEFAULT false,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_videos" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "platform" TEXT,

    CONSTRAINT "property_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_documents" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "size" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_portals" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "portalName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "externalId" TEXT,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "property_portals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "cpf" TEXT,
    "type" "ContactType" NOT NULL DEFAULT 'CLIENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "contactId" TEXT,
    "agentId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'SITE',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condominiums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,

    CONSTRAINT "condominiums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_analyses" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "optimisticValue" DECIMAL(15,2),
    "marketValue" DECIMAL(15,2),
    "competitiveValue" DECIMAL(15,2),
    "pricePositioning" TEXT,
    "marketDemand" TEXT,
    "absoptionTime" INTEGER,
    "comparables" JSONB,
    "priceHistory" JSONB,
    "aiSummary" TEXT,
    "aiStrengths" JSONB,
    "aiWeaknesses" JSONB,
    "aiOpportunities" JSONB,
    "aiRecommendations" JSONB,
    "avgPricePerSqmRegion" DECIMAL(10,2),
    "priceVariation30d" DECIMAL(5,2),
    "priceVariation90d" DECIMAL(5,2),
    "totalListings" INTEGER,
    "rawData" JSONB,

    CONSTRAINT "market_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "userId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_config" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL DEFAULT 'Paulo Pop',
    "ownerPhotoUrl" TEXT,
    "ownerCreci" TEXT,
    "ownerBio" TEXT,
    "ownerWhatsapp" TEXT,
    "ownerPhone" TEXT,
    "ownerEmail" TEXT,
    "ownerInstagram" TEXT,
    "ownerFacebook" TEXT,
    "ownerLinkedin" TEXT,
    "ownerYoutube" TEXT,
    "ownerTelegram" TEXT,
    "ownerCompany" TEXT,
    "ownerAddress" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroBgUrl" TEXT,
    "footerText" TEXT,
    "whatsappMessage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "properties_ref_key" ON "properties"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_status_transactionType_purpose_idx" ON "properties"("status", "transactionType", "purpose");

-- CreateIndex
CREATE INDEX "properties_city_state_idx" ON "properties"("city", "state");

-- CreateIndex
CREATE INDEX "properties_price_idx" ON "properties"("price");

-- CreateIndex
CREATE INDEX "properties_slug_idx" ON "properties"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "property_features_propertyId_feature_key" ON "property_features"("propertyId", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "property_lifestyles_propertyId_lifestyle_key" ON "property_lifestyles"("propertyId", "lifestyle");

-- CreateIndex
CREATE UNIQUE INDEX "property_portals_propertyId_portalName_key" ON "property_portals"("propertyId", "portalName");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_cpf_key" ON "contacts"("cpf");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_spots" ADD CONSTRAINT "parking_spots_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_lifestyles" ADD CONSTRAINT "property_lifestyles_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_fees" ADD CONSTRAINT "additional_fees_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_videos" ADD CONSTRAINT "property_videos_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_documents" ADD CONSTRAINT "property_documents_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_portals" ADD CONSTRAINT "property_portals_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_analyses" ADD CONSTRAINT "market_analyses_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

