# Multi-stage Dockerfile for Tier 2: Server
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY database ./database
COPY server ./server

WORKDIR /app/server
RUN npm ci
RUN npm run build
RUN npx prisma generate --schema=../database/schema.prisma

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/database ./database
COPY --from=builder /app/server/package*.json ./server/
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/dist ./server/dist

WORKDIR /app/server
EXPOSE 5000

CMD ["node", "dist/index.js"]
