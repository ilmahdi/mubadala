#!/bin/sh
set -e

# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------
run_dev() {
  echo "Running frontend in development mode..."
  exec npm run dev -- -H "$FRONT_HOST" -p "$FRONT_PORT"
}

run_prod() {
  echo "Running frontend in production mode..."

  if [ "$BUILD_FRONT" = "true" ]; then
    echo "Building the frontend application..."
    npm run build
  fi

  exec npm run start
}

# -------------------------------------------------------------------
# Startup
# -------------------------------------------------------------------
if [ "$DEV_MODE" = "true" ]; then
  run_dev
else
  run_prod
fi
