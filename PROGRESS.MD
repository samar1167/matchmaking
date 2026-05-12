# Project Progress Tracker

Last updated: 2026-05-12

## Purpose

This file is the working progress ledger for the matchmaking project across its full lifecycle. It is meant to help track:

- what is already complete
- what is assumed complete for planning purposes
- what is next
- what is temporary or stage-specific
- what must change before production hardening
- small pending items that are easy to overlook

This document is intentionally operational. It should be updated as work progresses so that future planning, implementation, and release decisions can be made from one place.

## Current Planning Assumption

For the purpose of this tracker, the following assumption is currently being made:

- backend is complete enough to support the product
- web is complete enough to support the product
- the next major product expansion is native-feeling mobile support for Android and iOS

This assumption should be revised later if backend or web gaps are discovered.

## Project Snapshot

Project shape today:

- monorepo with `apps/api` and `apps/web`
- Django backend with REST APIs, authentication, chat/realtime support, payments, storage integrations, and supporting business logic
- Next.js web frontend
- Docker-based local development
- AWS deployment path defined, with API-first rollout strategy already chosen

Current product maturity:

- backend and web are treated as feature-complete for the current planning stage
- infrastructure is in a staged rollout state rather than fully hardened production state
- mobile apps are not yet implemented and are the next major delivery stream

## Status Summary

### Overall Program Status

- Backend: assumed complete
- Web: assumed complete
- Mobile: not started
- AWS production hardening: partially defined, not complete
- Operational maturity: early-to-mid stage

### High-Level Milestones

- [x] Monorepo established
- [x] Backend application implemented
- [x] Web application implemented
- [x] Local Docker workflow established
- [x] AWS deployment direction chosen
- [x] Initial architecture and research documented
- [ ] Public AWS rollout fully stabilized
- [ ] Mobile application architecture chosen
- [ ] Android app implemented
- [ ] iOS app implemented
- [ ] Production hardening completed
- [ ] Release-readiness checklist completed

## Completed Work

The following appears complete or substantially complete based on the current repository and planning assumption:

### Product Foundation

- backend and frontend live in one coordinated monorepo
- API and web are separated cleanly as distinct applications
- local development flow exists using Docker Compose

### Backend Capabilities

- Django backend implemented
- REST API layer implemented
- JWT-based authentication present
- user/profile domain model present
- compatibility and matchmaking logic present
- chat/realtime support present
- payment-related backend support present
- email-related support present
- S3-backed file storage support present
- Swagger/OpenAPI support present

### Web Capabilities

- Next.js frontend implemented
- auth flows exist
- dashboard/profile/results/connections/private-persons/payment-history/chat related screens exist
- client-side service and state patterns are already established

### Infrastructure Direction

- Dockerfiles exist for API and web
- Compose files exist for dev/prod-style setups
- AWS rollout path has been documented
- ECS/Fargate, RDS, S3, and optional ElastiCache decisions have already been made

## Current Workstreams

These are the active or upcoming workstreams that should shape future planning.

### 1. Mobile Application Workstream

Goal:

- deliver mobile apps for Android and iOS based on the existing backend

Current status:

- not started

Key dependency:

- backend API contracts must remain stable enough for mobile reuse

### 2. Cloud Stabilization Workstream

Goal:

- move from initial AWS validation setup to more stable production operation

Current status:

- architecture mostly decided
- some rollout shortcuts are still intentionally in place

### 3. Production Hardening Workstream

Goal:

- track and close the gap between current staged deployment choices and full production expectations

Current status:

- not complete
- several deferred items already identified and logged below

## Mobile App Planning Record

This section is intentionally included now so future mobile work can be tracked in the same file.

### Mobile Goal

- support both Android and iOS using the existing backend as the main platform service layer

### Mobile Planning Status

- product intent recorded
- implementation not started
- technical approach finalized at a planning level

### Mobile Strategy Locked

- framework: Flutter
- codebase strategy: one shared mobile codebase for Android and iOS
- release order: Android first, then iOS
- app type: user-facing app only
- UX direction: adapt existing web UX, but redesign interactions for mobile patterns instead of copying screens literally
- device target: phone-first UI only
- connectivity model: basic online-only behavior for v1

### Mobile Decisions Pending

- define shared design and navigation patterns in detail
- define auth/token storage implementation on mobile
- define websocket/chat implementation details on mobile
- define app-store deployment process in detail
- define analytics/crash-reporting approach
- define image upload constraints and media-handling details on mobile

### Mobile V1 Scope Locked

Included in v1:

- full authentication flows
- onboarding and profile flows
- full profile editing
- photo upload
- matchmaking and results
- connections
- chat
- private persons
- payments and subscriptions
- push notifications

Excluded from v1:

- admin or staff tools
- tablet-first layouts
- offline-first behavior

### Mobile V1 Scope Notes

- private persons is a mandatory feature for v1 and should not be treated as optional scope
- mobile should be treated as a primary product client, not as a companion app
- app flows should feel native to mobile even when reusing existing product concepts from web
- payments should be planned around native app-store compliant flows rather than assuming web payment behavior can be reused directly

### Recommended Mobile Milestones

- [x] confirm mobile product scope for first release
- [x] choose framework for Android and iOS delivery
- [ ] map backend endpoints used by web and mobile
- [ ] define shared API client/auth strategy for mobile
- [ ] define mobile UI architecture
- [ ] define mobile navigation structure and screen inventory
- [ ] build authentication flows
- [ ] build profile and onboarding flows
- [ ] build private persons flows
- [ ] build matchmaking/results flows
- [ ] build chat/connections flows
- [ ] build payments/subscription flows with store-compliant purchase handling
- [ ] implement push notification flows
- [ ] test across Android and iOS devices
- [ ] prepare store release assets and compliance items

### Mobile Backend Support Required

The current mobile plan implies backend follow-up work in addition to the existing web/backend implementation.

- [ ] confirm all mobile-required endpoints already exist and are stable
- [ ] document endpoint coverage for auth, profile, results, private persons, chat, and payments
- [ ] add device token registration and management for push notifications
- [ ] define server-side notification triggers for chat and important account events
- [ ] review JWT refresh/session behavior for long-lived mobile app usage
- [ ] verify mobile-friendly upload handling for profile photos
- [ ] review websocket behavior for background/foreground mobile app usage
- [ ] identify payment flow differences required for app-store compliance

### Mobile Production Risks To Track

- app-store compliant payment rules may require flow changes from current web payment assumptions
- push notifications introduce additional provider, token, and delivery-state complexity
- chat on mobile requires careful background/resume behavior and unread-state handling
- image upload needs testing for compression, file sizes, and user experience on phones
- Android-first release should not lead to iOS-specific requirements being discovered too late

## Temporary Measures To Revisit

This section is critical. It records measures that are acceptable now but are likely to need changes before or during production.

Each item should later be moved to either completed, replaced, or intentionally accepted long-term.

### Infrastructure And Deployment

- API-first rollout is being used before frontend cloud rollout is fully attached
- first public AWS path uses a single ECS API task
- autoscaling is intentionally not enabled in the first phase
- health checks are currently temporary and may need stronger app-specific endpoints
- frontend production attachment is deferred until API validation completes

### Security And Secrets

- runtime config is currently expected through ECS environment variables instead of a stronger secret-management setup
- this should later be reviewed for migration to Secrets Manager or SSM Parameter Store where appropriate

### Assets And Delivery

- static files and media use direct S3 URLs for now
- static and media are currently expected to be publicly readable by URL
- CloudFront is not yet in front of S3
- asset delivery and access-control strategy should be revisited later

### Realtime / Redis

- Redis is optional in the current single-task phase
- in-memory Channels layer is acceptable only while the API remains single-task
- Redis should become mandatory before multi-instance realtime scaling

### Release Discipline

- mutable deployment tags such as `latest` have been used in examples, though immutable versioned tags are preferred
- image-tag discipline should be enforced consistently before more frequent production rollouts

### Frontend Dependency Stability

- frontend dependencies currently use several `"latest"` version specifiers
- this speeds current iteration but should be revisited for reproducible builds and safer releases

## Production Gap Register

This register tracks work that may be easy to postpone now but should be revisited before calling the system production-ready.

### High Priority Gaps

- [ ] formal secret management strategy
- [ ] CloudFront or equivalent CDN strategy for static/media
- [ ] final public asset access-control decision
- [ ] multi-instance websocket strategy with Redis
- [ ] autoscaling strategy for ECS services
- [ ] stronger health-check endpoint design
- [ ] deployment rollback procedure
- [ ] release/versioning discipline for images and app builds
- [ ] monitoring and alerting baseline
- [ ] backup/recovery review for production database

### Medium Priority Gaps

- [ ] tighten dependency pinning policy
- [ ] review public/private bucket and object policies
- [ ] logging retention and log shipping strategy
- [ ] operational runbook for common incidents
- [ ] CORS/host/origin finalization for production environments
- [ ] performance review under expected load

### Mobile-Related Production Gaps

- [ ] mobile auth/session expiration UX
- [ ] push notification provider and server integration
- [ ] app-store asset and policy readiness
- [ ] crash reporting and mobile observability
- [ ] mobile-specific privacy and data-handling review
- [ ] app-store compliant purchase flow design and backend reconciliation
- [ ] mobile upload constraints and media optimization policy

## Small Things Easy To Overlook

This section is intentionally for low-visibility items that often get missed until late.

- [ ] define a final health-check endpoint instead of relying on temporary paths
- [ ] confirm final environment variable inventory for API, web, and future mobile builds
- [ ] verify media/static cache headers and invalidation plan
- [ ] confirm production-ready email sender/domain setup
- [ ] confirm Stripe production credential rollout and webhook handling checklist
- [ ] verify websocket base URLs for deployed web and future mobile clients
- [ ] confirm log file strategy inside containers versus stdout-first logging
- [ ] review whether local-only assumptions still exist in code or docs
- [ ] verify all user-facing links and callback URLs for production domains
- [ ] create app release checklist for Android and iOS once mobile starts

## Suggested Next Steps

These are the most sensible next planning moves based on the project’s current stage.

### Immediate Next Steps

- [x] decide the mobile framework and app architecture direction
- [ ] inventory backend APIs the mobile app will consume
- [x] define the first mobile release scope
- [ ] stabilize AWS API deployment path
- [ ] turn the production gap register into a phased hardening plan

### Next Mobile Planning Actions

- [ ] create a screen-by-screen mobile feature map from existing web flows
- [ ] create an endpoint inventory for every mobile v1 feature
- [ ] identify backend changes needed specifically for push notifications and app-store payments
- [ ] define Flutter project architecture, package structure, and state-management approach
- [ ] define media upload approach for mobile profile photos
- [ ] define Android-first release checklist while keeping iOS constraints visible

### After That

- [ ] start mobile implementation
- [ ] prepare production-readiness checklist by environment
- [ ] close the highest-risk temporary measures first

## Update Log

Use this section to append meaningful updates over time.

### 2026-05-12

- created initial lifecycle tracker
- recorded working assumption that backend and web are complete
- added mobile workstream as the next major phase
- added temporary-measures register for later production cleanup
- added production gap register and overlooked-items checklist
- finalized high-level mobile direction through user discussion
- locked Flutter as the shared mobile framework
- locked Android-first release order with iOS following after
- locked v1 mobile scope including auth, profile, photo upload, matchmaking, connections, chat, private persons, payments, and push notifications
- recorded that mobile payments must follow native app-store compliant flows

## How To Use This File

When updating this file later:

- change status markers as work completes
- add new temporary shortcuts immediately when they are introduced
- move items out of the production gap register only when actually resolved
- append dated entries to the update log
- treat this file as the primary continuity document for planning and execution

## Notes

- This file is a planning and execution tracker, not a source of truth for implementation details.
- Detailed architectural rationale belongs in `RESEARCH.MD`.
- Day-to-day implementation can be driven from this file by converting sections into concrete tasks over time.
