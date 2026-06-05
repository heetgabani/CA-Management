#!/bin/bash
echo "🚀 Starting CA Manage development environment..."

# Check Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Start infrastructure
echo "🐳 Starting PostgreSQL and Redis..."
docker compose up postgres redis -d

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec ca_manage_postgres pg_isready -U camanage -d camanage_db > /dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready!"

# Run migrations
echo "🔄 Running database migrations..."
cd "$(dirname "$0")/../.." || exit
pnpm db:migrate

echo "✅ Development environment is ready!"
echo ""
echo "  API:     http://localhost:4000"
echo "  Web:     http://localhost:3000"
echo "  Swagger: http://localhost:4000/api/docs"
echo "  DB:      postgresql://camanage:camanage_secret@localhost:5432/camanage_db"
echo ""
echo "  Run: pnpm dev"
