# Matchmaking

Combined monorepo for the matchmaking backend and frontend.

## Structure

- `apps/api` - Django backend
- `apps/web` - Next.js frontend
- `infra/mysql` - MySQL init scripts
- `infra/docker` - Dockerfiles for app images

## Development

1. Copy env files as needed:
   - `cp .env.example .env` for shared compose values
   - `cp apps/api/.env.example apps/api/.env`
   - create or adjust `apps/web/.env`
2. Start the stack:
   - `docker compose --env-file .env -f compose.yml -f compose.dev.yml up --build`

Frontend runs on `http://localhost:3047` and backend on `http://localhost:8047`.

## Profile Pictures on S3

The API can store uploaded profile pictures in AWS S3.

Set these variables in `apps/api/.env` to enable it:

- `USE_S3_MEDIA_STORAGE=True`
- `AWS_STORAGE_BUCKET_NAME=...`
- `AWS_S3_REGION_NAME=...`

Credentials can come from either:

- `AWS_ACCESS_KEY_ID=...`
- `AWS_SECRET_ACCESS_KEY=...`

Or, when running on AWS, from the ECS task role or another IAM role in the default AWS credential chain.

Optional settings:

- `AWS_S3_CUSTOM_DOMAIN=cdn.example.com`
- `AWS_S3_ENDPOINT_URL=...`
- `AWS_QUERYSTRING_AUTH=False`
- `AWS_S3_CACHE_CONTROL=max-age=86400`

If `USE_S3_MEDIA_STORAGE` is not enabled, uploads fall back to local Django media storage.

## Django Static Files on S3

The API can also publish Django static files to S3 during `collectstatic`, which is useful for ECS deployments without a reverse proxy serving `/static/`.

Set these variables in `apps/api/.env`:

- `USE_S3_STATIC_STORAGE=True`
- `AWS_S3_REGION_NAME=...`

Use either:

- `AWS_STATIC_BUCKET_NAME=...`

Or reuse the media bucket:

- `AWS_STORAGE_BUCKET_NAME=...`

Optional settings:

- `AWS_STATIC_CUSTOM_DOMAIN=static.example.com`
- `AWS_STATIC_LOCATION=static`

When S3 static storage is enabled, `collectstatic` uploads files to that S3 location and Django serves static asset URLs from S3 instead of the local filesystem.

## Email via AWS SES

The API can send transactional emails such as account verification and password reset through AWS SES using `boto3`.

Set these variables in `apps/api/.env`:

- `USE_AWS_SES_EMAIL=True`
- `DEFAULT_FROM_EMAIL=verified-sender@yourdomain.com`
- `AWS_SES_REGION_NAME=ap-south-1`

Credentials can either reuse the existing AWS credentials already used for S3:

- `AWS_ACCESS_KEY_ID=...`
- `AWS_SECRET_ACCESS_KEY=...`

Or you can provide SES-specific credentials:

- `AWS_SES_ACCESS_KEY_ID=...`
- `AWS_SES_SECRET_ACCESS_KEY=...`
- `AWS_SES_SESSION_TOKEN=...`

Optional setting:

- `AWS_SES_CONFIGURATION_SET=transactional`

If `USE_AWS_SES_EMAIL` is not enabled, Django continues using the configured `EMAIL_BACKEND` value, which defaults to the console backend for local development.

## Django debugging

VS Code configs are included in `.vscode/launch.json`.

- Local debug:
  - open the workspace in VS Code
  - select `Django: Local manage.py`
  - start debugging to run `apps/api/manage.py runserver 0.0.0.0:8047`
- Docker debug:
  - rebuild the API image so `debugpy` is installed:
    - `docker compose --env-file .env -f compose.yml -f compose.dev.yml -f compose.debug.yml build api`
  - start the stack with the debug overlay:
    - `docker compose --env-file .env -f compose.yml -f compose.dev.yml -f compose.debug.yml up`
  - in VS Code, select `Django: Attach to Docker`

The debug overlay exposes port `5678` for `debugpy` and keeps the usual Django server on `8047`.

## Production-style run

`docker compose --env-file .env -f compose.yml -f compose.prod.yml up -d --build`

The production compose overlay exposes the frontend on `http://localhost:3047` and the backend on `http://localhost:8047` directly, without a repository-managed reverse proxy.
