# AI Train Traffic Control - Backend Service with Frontend
# Updated: Build frontend from source during Docker build
FROM node:18-alpine AS frontend-builder

WORKDIR /build

COPY frontend/package*.json ./
COPY frontend/package-lock.json* ./
RUN npm ci

COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/*.config.* ./
COPY frontend/tsconfig.json ./
COPY frontend/index.html ./
RUN npm run build

# Stage 2: Install backend dependencies
FROM node:18-alpine AS backend-deps

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Runtime
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=backend-deps /app/node_modules ./node_modules

COPY backend/package*.json ./
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY backend/server.js ./

COPY --from=frontend-builder /build/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["npm", "start"]
