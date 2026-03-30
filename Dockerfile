# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci --legacy-peer-deps --no-audit --no-fund

FROM base AS prod-deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --legacy-peer-deps --no-audit --no-fund

FROM base AS builder
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
ENV NEXTAUTH_SECRET=build-secret
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npx tsc prisma/seed.ts --module commonjs --target es2020 --moduleResolution node --esModuleInterop --outDir dist-scripts --skipLibCheck
RUN --mount=type=cache,target=/app/.next/cache npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/dist-scripts ./dist-scripts
COPY --from=builder /app/scripts/docker-start.sh ./scripts/docker-start.sh
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p ./public/uploads/images ./public/uploads/documents
RUN chmod +x ./scripts/docker-start.sh
RUN chown -R nextjs:nodejs ./public/uploads ./prisma ./dist-scripts ./scripts ./prisma.config.ts
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["sh", "./scripts/docker-start.sh"]
