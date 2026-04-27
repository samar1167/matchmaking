FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci --include=dev

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web/package.json ./package.json
COPY apps/web/package-lock.json ./package-lock.json
COPY apps/web/next.config.ts ./next.config.ts
COPY apps/web/postcss.config.js ./postcss.config.js
COPY apps/web/tailwind.config.ts ./tailwind.config.ts
COPY apps/web/tsconfig.json ./tsconfig.json
COPY apps/web/next-env.d.ts ./next-env.d.ts
COPY apps/web/app ./app
COPY apps/web/components ./components
COPY apps/web/hooks ./hooks
COPY apps/web/lib ./lib
COPY apps/web/public ./public
COPY apps/web/services ./services
COPY apps/web/store ./store
COPY apps/web/types ./types
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 3000
CMD ["npm", "run", "start"]
