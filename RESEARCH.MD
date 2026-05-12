# Project Research And Decision Record

## Purpose

This document records the major high-level decisions that have already been taken for the matchmaking project so that a new contributor can understand the current direction quickly. It is intentionally focused on architecture, stack, deployment, and cost tradeoffs rather than implementation detail.

Primary source for this document:

- `README.md`
- `apps/api/config/settings.py`
- `apps/api/requirements.txt`
- `apps/web/package.json`
- `compose.yml`
- `compose.dev.yml`
- `compose.prod.yml`

## Project Stage

The project is in an early deployment transition stage:

- Core backend and frontend applications already exist in a single monorepo.
- Local Docker-based development is working.
- AWS rollout decisions have been made, but the public cloud deployment is intentionally being introduced in phases.
- The current rollout strategy is API-first, with the frontend to be attached later after backend validation.

This means the project is beyond prototyping, but still optimizing for low-risk validation rather than full production hardening.

## Monorepo Decision

Decision:

- Keep backend and frontend in one repository.

Current structure:

- `apps/api`: Django backend
- `apps/web`: Next.js frontend
- `infra/mysql`: MySQL bootstrap scripts
- `infra/docker`: Dockerfiles and image build context

Why this appears to have been chosen:

- Easier coordination between API and frontend while the product and contracts are still evolving.
- Shared deployment and environment conventions across the stack.
- Lower operational complexity for a small team.

Tradeoff:

- Simpler coordination now, but tighter coupling between app release cycles.

## Application Stack

### Backend

Decision:

- Use Django as the backend framework, with Django REST Framework for APIs.

Observed stack:

- Django 4.2
- Django REST Framework
- SimpleJWT for authentication
- MySQL as the primary database
- Channels and Daphne for realtime/WebSocket support
- `channels-redis` available when Redis is enabled
- `drf-yasg` for Swagger/OpenAPI docs
- `django-storages` + `boto3` for S3-backed asset storage
- Stripe SDK for payments
- SES support for email delivery

Why this is a sensible fit:

- Django provides fast iteration for auth, admin, data modeling, and transactional workflows.
- DRF supports a clear API boundary for the separate frontend.
- Channels adds chat/realtime capability without changing the core backend stack.

Tradeoff:

- Django + Channels is productive, but horizontal scaling for realtime features requires more infrastructure discipline than a purely stateless API.

### Frontend

Decision:

- Use Next.js with React and TypeScript for the web app.

Observed stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand for client-side state
- Axios for API communication

Why this appears to have been chosen:

- Good balance of developer speed and structure for a product UI.
- Simple client-side service layer pattern is already in place.
- Zustand keeps frontend state management lightweight.

Tradeoff:

- Current package versions are pinned as `"latest"` in several places, which speeds iteration but increases reproducibility risk over time.

## Architecture Decisions

### API + Web Separation

Decision:

- Keep backend and frontend as separate applications and separate containers.

Observed shape:

- Backend listens on `8047`
- Frontend listens on `3047`
- Frontend uses explicit API and WebSocket base URLs

Why:

- Clear boundary between UI and backend logic.
- Allows the API to be deployed and tested independently.
- Makes phased AWS rollout easier.

### Realtime Strategy

Decision:

- Support realtime chat using Django Channels.
- Use Redis-backed channel layers when needed, but allow in-memory channel layers when operating as a single API task.

Why this matters:

- This is an explicit scalability tradeoff.
- In-memory channels reduce infrastructure and cost for single-task deployment.
- Redis becomes necessary once multiple API tasks must share websocket events.

Tradeoff:

- Current approach is cost-efficient for initial rollout, but not suitable for multi-instance realtime reliability.

### Authentication Strategy

Decision:

- Use JWT-based authentication with refresh tokens.

Observed behavior:

- Access tokens are short-lived.
- Refresh tokens are longer-lived and rotated.
- DRF default permission is authenticated access unless an endpoint overrides it.

Why:

- Fits a separate frontend/backend architecture well.
- Avoids server-rendered session coupling.

## Data And Persistence Decisions

### Primary Database

Decision:

- Use MySQL as the main relational database.
- Local development uses Dockerized MySQL.
- AWS deployment uses Amazon RDS for MySQL.

Why this appears to have been chosen:

- Relational modeling fits users, profiles, preferences, compatibility results, payments, and chat records.
- RDS reduces database operations burden during AWS rollout.

### Cache And Messaging

Decision:

- Keep Django cache local/in-memory by default.
- Use Redis primarily for Channels/WebSocket coordination rather than as a hard requirement for all environments.

Why:

- Avoids premature infrastructure complexity.
- Keeps the application runnable locally and in low-cost single-task AWS deployments.

Tradeoff:

- Cache strategy is simple, but not designed for distributed caching yet.

## File Storage Decisions

Decision:

- Store Django static files and user-uploaded media in S3.
- Use one shared bucket for both static and media, separated by prefixes.

Current conventions:

- Bucket example: `luster-dev`
- Static prefix: `static/`
- Media prefix: `media/`

Why:

- Avoids serving persistent files from application containers.
- Works well with ECS/Fargate where containers should stay replaceable.
- Simplifies early AWS rollout.

Important current choice:

- Direct S3 URLs are being used for now instead of CloudFront.
- Static and media are currently expected to be publicly readable by URL.

Tradeoff:

- This is cheaper and simpler in the short term.
- It is less polished and less controlled than placing CloudFront in front of S3 later.

## Deployment Decisions

### Containerization

Decision:

- Standardize local and cloud runtime around Docker containers.

Observed shape:

- Separate Dockerfiles for API and web
- Docker Compose for local development
- ECS/Fargate planned for AWS runtime

Why:

- Keeps local and deployment environments closer together.
- Supports an API-first phased rollout.

### AWS Runtime

Decision:

- Deploy on AWS ECS using Fargate.
- Do not use a repository-managed Nginx reverse proxy in the current design.

Why this matters:

- Fargate reduces server management overhead.
- Skipping Nginx simplifies the initial rollout and removes one more component from the stack.

Tradeoff:

- Application containers must handle their own runtime concerns cleanly.
- More advanced traffic management can be added later if needed.

### Rollout Strategy

Decision:

- Use an API-first public rollout.
- Start with one ECS API task behind an internet-facing ALB.
- Delay autoscaling and frontend attachment until the API is validated.

Why:

- Minimizes moving parts in the first public AWS test.
- Makes debugging easier.
- Reduces cost while basic deployment behavior is being proven.

Tradeoff:

- Not production-scaled yet.
- Frontend deployment remains a later step.

## Cost-Driven Decisions

Several choices in the current project stage are clearly cost-conscious and should be considered intentional unless requirements change.

### Cost Optimizations Already Chosen

- Use ECS/Fargate without adding extra reverse-proxy infrastructure.
- Roll out the API before the frontend to reduce initial surface area.
- Run a single API task first.
- Skip autoscaling in the first public phase.
- Use direct S3 URLs instead of CloudFront for now.
- Store ECS runtime config in environment variables instead of paying for Secrets Manager immediately.
- Allow the API to run without Redis in single-task mode.
- Treat ElastiCache as optional during the current stage and removable if not actively needed.

### Cost Consequences

These choices reduce monthly spend and setup time, but they defer some production-grade concerns:

- secret-management maturity
- CDN/performance optimization
- multi-instance websocket delivery
- autoscaling resilience
- stronger public asset controls

## Operational Decisions

### Environment Configuration

Decision:

- Keep environment-driven configuration across local and cloud setups.

Observed pattern:

- Shared compose env usage at repo root
- API-specific env file under `apps/api`
- Web-specific env file under `apps/web`
- AWS runtime values injected through ECS environment configuration

Why:

- Makes the same application runnable in local Docker and cloud environments with minimal code changes.

### Image Delivery

Decision:

- Build images locally, push to private ECR, and deploy ECS task revisions from image tags.
- Prefer immutable versioned tags over relying on `latest`.

Why:

- This is a practical release discipline for ECS.
- It reduces ambiguity during deployments and rollbacks.

## Security And Maturity Notes

The current decisions show a clear preference for shipping and validation over final hardening.

Notable current-state decisions:

- Some runtime configuration is stored directly in ECS environment variables rather than a dedicated secret store.
- Static and media objects are currently expected to be public by URL.
- Direct S3 delivery is preferred over CDN or signed delivery.
- Redis is optional in the current single-task phase.

These are not necessarily mistakes. They appear to be deliberate stage-appropriate tradeoffs. A future maintainer should revisit them when the project moves from validation to scale and hardening.

## What A New Maintainer Should Assume

- The current architecture optimizes for fast iteration and low-cost AWS validation.
- The backend is the operational center of the system right now.
- Realtime support exists, but is only fully scalable once Redis-backed multi-task deployment is introduced.
- Asset storage has already been externalized to S3, which is an important containerization decision that should be preserved.
- The project expects eventual production improvements, but has intentionally postponed some of them.

## Recommended Future Revisit Points

These are the most likely decisions to revisit once usage or team size grows:

- move ECS secrets from plain environment variables to Secrets Manager or SSM
- add CloudFront in front of static/media if performance or access control becomes important
- make Redis mandatory when running more than one API task
- introduce autoscaling and stronger health-check endpoints
- pin frontend dependency versions more tightly for reproducible builds
- decide whether backend and frontend should continue releasing from one repo long term

## Summary

At the current stage, the project has chosen a pragmatic architecture:

- Django + DRF + Channels backend
- Next.js + React frontend
- MySQL for primary data
- optional Redis for realtime scaling
- S3 for static and media storage
- ECS/Fargate for AWS deployment
- API-first phased rollout
- multiple deliberate cost-saving shortcuts that are acceptable for the current validation phase

This should be read as the project's current operating philosophy: keep the system simple, deployable, and inexpensive while validating the product and infrastructure path.
