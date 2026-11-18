#!/bin/sh
set -e

echo "⏳ Verificando e executando migrations pendentes..."
npm run migration:run:prod

echo "🚀 Iniciando aplicação NestJS..."
exec "$@"