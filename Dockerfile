# ──────────────────────────────────────────────────────────────────
# CarbonMind AI — Cloud Run Dockerfile
# Serves FastAPI backend + static frontend from one container
# ──────────────────────────────────────────────────────────────────
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Copy the static frontend files (index.html, style.css, app.js)
# FastAPI's StaticFiles middleware will serve these at /static/*
# and the root route returns index.html directly
COPY index.html ./static/index.html
COPY style.css  ./static/style.css
COPY app.js     ./static/app.js

# Expose the Cloud Run port
EXPOSE 8080

# Start uvicorn — Cloud Run injects $PORT automatically
CMD uvicorn backend.app:app --host 0.0.0.0 --port $PORT
