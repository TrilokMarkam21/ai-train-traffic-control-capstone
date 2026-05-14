# AI Train Traffic Control - Microservice Dockerfile
# ====================================================
# Production-ready container image for the AI prediction service

# Use Python 3.11 slim base image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=10000

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Copy trained ML models (critical — contains xgboost_model.pkl, train_model.pkl, etc.)
COPY model/ ./model/

# Create logs directory
RUN mkdir -p logs

# Expose port (Render sets PORT env var)
EXPOSE $PORT

# Health check using the PORT env var
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:${PORT:-10000}/health')" || exit 1

# Run the application — use $PORT from Render environment
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
