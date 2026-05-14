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

# Copy frontend dist files
COPY frontend/dist ./dist

RUN echo "✅ Docker build complete. Dist files:" && ls -la dist/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["npm", "start"]