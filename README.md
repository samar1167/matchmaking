# Matchmaking

Combined monorepo for the matchmaking backend and frontend.

## Structure

- `apps/api` - Django backend
- `apps/web` - Next.js frontend
- `infra/nginx` - Nginx config for production routing
- `infra/mysql` - MySQL init scripts
- `infra/docker` - Dockerfiles for app images

## Development

1. Copy env files as needed:
   - `cp .env.example .env` for shared compose values
   - `cp apps/api/.env.example apps/api/.env`
   - create or adjust `apps/web/.env`
2. Start the stack:
   - `docker compose --env-file .env -f compose.yml -f compose.dev.yml up --build`

Frontend runs on `http://localhost:3000` and backend on `http://localhost:8000`.

## Django debugging

VS Code configs are included in `.vscode/launch.json`.

- Local debug:
  - open the workspace in VS Code
  - select `Django: Local manage.py`
  - start debugging to run `apps/api/manage.py runserver 0.0.0.0:8000`
- Docker debug:
  - rebuild the API image so `debugpy` is installed:
    - `docker compose --env-file .env -f compose.yml -f compose.dev.yml -f compose.debug.yml build api`
  - start the stack with the debug overlay:
    - `docker compose --env-file .env -f compose.yml -f compose.dev.yml -f compose.debug.yml up`
  - in VS Code, select `Django: Attach to Docker`

The debug overlay exposes port `5678` for `debugpy` and keeps the usual Django server on `8000`.

## Production-style run

`docker compose --env-file .env -f compose.yml -f compose.prod.yml up -d --build`
