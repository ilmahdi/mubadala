#!/bin/sh
set -e

# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------
wait_for_db() {
  echo "Waiting for database at $DB_HOST:$DB_PORT..."
  while ! nc -z "$DB_HOST" "$DB_PORT"; do
    sleep 1
  done
  echo "Database is up"
}

# -------------------------------------------------------------------
# Startup
# -------------------------------------------------------------------
pip install --no-cache-dir -r requirements.txt

wait_for_db

if [ "$DEV_MODE" = "true" ]; then
  echo "Running Django in development mode..."
  exec python manage.py runserver "$BACK_HOST:$BACK_PORT"
fi

echo "Running Django in production mode..."

if [ "$BUILD_BACK" = "true" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput
fi

echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application \
  --bind "$BACK_HOST:$BACK_PORT" \
  --workers 3 \
  --timeout 120
