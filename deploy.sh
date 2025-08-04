#!/bin/bash

APP_DIR=~/skills_streak

echo "📦 Switching to app directory: $APP_DIR"
cd $APP_DIR || { echo "❌ Directory not found"; exit 1; }

echo "🧹 Stopping old containers..."
docker compose down

echo "🐳 Pulling latest Docker image..."
docker compose pull

echo "🚀 Restarting Docker containers..."
docker compose up -d

echo "✅ Deployment complete."