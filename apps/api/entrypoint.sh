#!/bin/bash
set -e

echo "Waiting for MySQL..."
until python -c "
import MySQLdb
MySQLdb.connect(host='${DB_HOST}', user='${DB_USER}', passwd='${DB_PASSWORD}', db='${DB_NAME}')
" 2>/dev/null; do
  echo "MySQL not ready — retrying in 2s..."
  sleep 2
done

echo "MySQL ready."

cd /app

mkdir -p /app/logs

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec daphne \
    --bind 0.0.0.0 \
    --port 8047 \
    --access-log /app/logs/access.log \
    config.asgi:application
