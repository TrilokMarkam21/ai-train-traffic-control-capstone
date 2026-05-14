# AI Train Traffic Control - Backend Service
# Railway will auto-detect this at the repo root

FROM node:18-alpine AS deps

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci --only=production

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules

COPY backend/package*.json ./
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY backend/server.js ./

COPY frontend/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["npm", "start"]
