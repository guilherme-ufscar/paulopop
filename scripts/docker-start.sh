#!/bin/sh
set -eu

echo "Applying database migrations..."
./node_modules/.bin/prisma migrate deploy

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Running seed..."
  node ./dist-scripts/prisma/seed.js
fi

exec node server.js
