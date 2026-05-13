# Multi-stage build for AI Train Traffic Control Backend
# This Dockerfile assumes build context is the repo root when used with Railway

# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /build

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Stage 2: Runtime stage
FROM node:18-alpine

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy node_modules from builder
COPY --from=builder /build/node_modules ./node_modules

# Copy backend package files
COPY backend/package*.json ./

# Copy backend source code (excluding dist)
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY backend/server.js ./

# Copy frontend dist
COPY frontend/dist ./frontend-dist

# Create symlink for static serving
RUN ln -s /app/frontend-dist /app/dist

# Expose port 3000 (Railway will assign dynamic $PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start application
CMD ["npm", "start"]