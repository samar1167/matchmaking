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

## Current AWS Deployment Decisions

These are the deployment decisions currently chosen for the AWS rollout:

- ECS will be used without a repository-managed Nginx reverse proxy.
- The frontend container listens on `3047`.
- The API container listens on `8047`.
- Django static files are published to S3.
- User-uploaded media, including profile pictures, are stored in S3.
- Static and media currently share one bucket, separated by prefixes:
  - `static/`
  - `media/`
- Direct S3 URLs are being used for now instead of CloudFront.
- Static and media are currently expected to be publicly readable by URL.
- The first ECS rollout is API-first; the frontend service can be attached later.
- The first public AWS test path uses an internet-facing ALB with a single API ECS task and no autoscaling.

Current non-secret bucket settings used in local testing:

- `AWS_STORAGE_BUCKET_NAME=luster-dev`
- `AWS_S3_REGION_NAME=us-west-1`
- `AWS_STATIC_LOCATION=static`
- `AWS_MEDIA_LOCATION=media`

## AWS Deployment Workflow

This is the step-by-step deployment path currently being followed for AWS.

### 1. Local Verification Against AWS Services

- Local Docker development was updated to use ports `3047` for the frontend and `8047` for the API.
- The base `compose.yml` should not hardcode `DB_HOST`, `DB_PORT`, or `REDIS_URL` for the API when testing against AWS-managed services.
- `apps/api/.env` is the source of truth for local-to-AWS database and Redis testing.

### 2. S3 For Static And Media

- A shared S3 bucket is being used:
  - bucket: `luster-dev`
  - static prefix: `static/`
  - media prefix: `media/`
- Current flags:
  - `USE_S3_STATIC_STORAGE=True`
  - `USE_S3_MEDIA_STORAGE=True`
- Direct S3 URLs are being used for now.
- For browser access, the bucket policy and public-access settings must allow `GetObject` for the required `static/` and `media/` keys.

### 3. Container Images

- ECR private repositories were created for:
  - `luster-api`
  - `luster-web`
- Images are built locally and pushed to ECR.
- ECS pulls images from ECR; source code does not need to live in AWS.

### 4. IAM Roles

- ECS task execution role:
  - example name: `ecsTaskExecutionRoleLuster`
  - attach `AmazonECSTaskExecutionRolePolicy`
- ECS task role:
  - example name: `ecsTaskRoleLuster`
  - attach application permissions for:
    - S3 access to `luster-dev`
    - SES send access if email is enabled
- ECS also requires the ECS service-linked role:
  - `AWSServiceRoleForECS`

### 5. Data Services

- MySQL is hosted on Amazon RDS.
- Redis is hosted on Amazon ElastiCache.
- RDS local testing required removing the Compose override that forced `DB_HOST=db`.
- ElastiCache is intended for ECS runtime use; it is not expected to be directly reachable from a developer laptop.

### 6. ECS Cluster

- A dedicated ECS cluster is used for the app.
- If cluster creation fails due to a missing ECS service-linked role, create `AWSServiceRoleForECS` first.
- If a failed cluster leaves behind a CloudFormation stack, delete that stack before retrying with the same cluster name.

### 7. API Task Definition

- The first ECS rollout uses an API-only task definition before attaching the web service.
- Recommended API task-definition basics:
  - launch type: Fargate
  - network mode: `awsvpc`
  - task role: `ecsTaskRoleLuster`
  - execution role: `ecsTaskExecutionRoleLuster`
  - container port: `8047`
  - image: ECR `luster-api`
- Runtime config is currently being provided as ECS environment variables instead of Secrets Manager to reduce cost.
- The production API image copies the Django app into `/app`, so the container entrypoint must run from `/app` rather than `/app/matchmaking_project`.

### 8. API-First Public Access

- For the first public test, the API is exposed through an internet-facing Application Load Balancer.
- Current rollout intent:
  - one ECS API task
  - no autoscaling yet
  - ALB listener on `80`
  - ALB forwards to an API target group on port `8047`
- Temporary target-group health check:
  - path: `/swagger/`
- The API security group should allow inbound `8047` only from the ALB security group.

### 8a. Rebuilding The API Image After A Fix

When the API container code or entrypoint changes, rebuild and repush the API image before redeploying ECS.

Build locally from the repository root:

- `docker build -f infra/docker/api.Dockerfile -t matchmaking-api:latest .`
- `docker build -f infra/docker/api.Dockerfile -t luster-api:latest .`

Tag for ECR:

- `docker tag luster-api:latest 634952168556.dkr.ecr.us-west-1.amazonaws.com/luster-api:latest`

Push to ECR:

- `docker push 634952168556.dkr.ecr.us-west-1.amazonaws.com/luster-api:latest`

Recommended for safer deployments:

- use a versioned tag instead of only `latest`, for example:
  - `luster-api:2026-05-10-1`

After pushing:

- register or select the latest API task-definition revision
- recreate or update the ECS API service to use that revision

### 8b. WSL Docker ECR Login Stability

When using Docker Desktop through WSL, `docker login` and `docker push` may repeatedly fail with WSL or credential-helper errors even when AWS authentication itself is correct.

Practical workaround:

- inspect `~/.docker/config.json`
- keep the `auths` section
- remove unstable helper settings such as:
  - `credsStore`
  - broken `credHelpers`

Recommended minimal shape:

```json
{
  "auths": {
    "634952168556.dkr.ecr.us-west-1.amazonaws.com": {
      "auth": "..."
    }
  }
}
```

Notes:

- ECR login tokens still expire and must be refreshed periodically
- removing the helper avoids repeated WSL credential-storage failures
- this stores Docker auth locally instead of using a helper, which is acceptable for local development but not ideal for high-security environments

### 9. Frontend Later

- The frontend ECS service will be attached after the API is verified in AWS.
- The frontend image should be rebuilt with the final public API and WebSocket base URLs once the final ALB DNS name or domain is known.

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

## Local AWS-S3 Testing

The local development API command in `compose.dev.yml` does not run `collectstatic`; it runs migrations and `runserver`.

To test S3-backed static files locally:

1. Start the stack:
   - `docker compose --env-file .env -f compose.yml -f compose.dev.yml up --build`
2. Run `collectstatic` manually:
   - `docker compose --env-file .env -f compose.yml -f compose.dev.yml exec api python manage.py collectstatic --noinput`
3. Verify uploaded static files under the configured S3 `static/` prefix.

To test S3-backed media locally:

1. Start the stack.
2. Upload a profile picture or other media through the app.
3. Verify uploaded files under the configured S3 `media/` prefix.

For the current direct-S3 setup, public browser reads require the bucket policy and public access settings to allow `GetObject` for the relevant `static/` and `media/` objects.

When testing local containers against AWS-managed services such as RDS, the API container reads `DB_HOST`, `DB_PORT`, and `REDIS_URL` from `apps/api/.env`. The base `compose.yml` should not override those values.

## Current Temporary Public Test Setup

This section should stay at the bottom of the README and reflect the current non-production public test posture.

- ECS API is currently being tested without an ALB.
- The API task is being accessed directly through its public IP on port `8047`.
- The ECS task security group currently allows public inbound access using `0.0.0.0/0` for the required test port.
- `ALLOWED_HOSTS=*` is acceptable only as a temporary live-test setting.
- SSL/HTTPS is not enabled yet.

## Before Production

The following items must be revisited before treating the AWS deployment as production-ready:

- Replace direct public-IP access with an internet-facing ALB.
- Move from plain HTTP to HTTPS using ACM and a real domain.
- Remove `ALLOWED_HOSTS=*` and replace it with the real domain and any required trusted hostnames.
- Tighten the ECS task security group so the API accepts traffic only from the ALB security group.
- Revisit CORS so it only allows the real frontend origin(s).
- Rebuild and deploy the frontend with the final public API and WebSocket URLs.
- Review whether direct public S3 URLs are still acceptable or whether CloudFront/private media handling is needed.
- Move sensitive ECS environment variables to Secrets Manager or another secret-management solution if cost and security tradeoffs allow.
- Revisit autoscaling, abuse protection, and rate limiting once public usage increases.

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
