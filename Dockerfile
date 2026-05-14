# AI Train Traffic Control - Backend Service with Frontend

FROM node:18-alpine AS backend-deps

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=backend-deps /app/node_modules ./node_modules

COPY backend/package*.json ./
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY backend/server.js ./
COPY backend/public ./public

# Verify and copy pre-built frontend if it exists
RUN mkdir -p dist
COPY frontend/dist ./dist 2>/dev/null || true
RUN echo "Dist contents:" && ls -la dist/ || echo "dist/ is empty (using public fallback)"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["npm", "start"]