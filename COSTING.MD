# Project Costing Guide

Last updated: 2026-05-12

## Purpose

This document estimates the likely AWS infrastructure cost for the current project under different deployment scenarios.

It is meant to answer:

- what is the cheapest viable AWS setup for this stack
- what does the currently chosen API-first rollout roughly cost
- what does a more production-shaped deployment cost
- which services are the main cost drivers
- which costs are fixed enough to plan around now, and which are traffic-dependent

This is a planning document, not a billing invoice. All numbers below are estimates based on current public AWS pricing and the project decisions already recorded in `README.md`, `RESEARCH.MD`, and `PROGRESS.MD`.

## Current Architecture Assumed

The estimates below assume the currently chosen stack:

- Django API on ECS/Fargate
- Next.js web on ECS/Fargate
- MySQL on Amazon RDS
- Redis on ElastiCache only when needed
- S3 for static and media
- internet-facing Application Load Balancer
- region: `us-west-1` (`US West (N. California)`)

## Important Notes

- These estimates focus on AWS infrastructure only.
- Taxes are not included.
- Stripe processing fees are not included.
- Apple App Store / Google Play fees are not included.
- Domain, DNS, SSL, third-party monitoring, and external SaaS costs are not included.
- Data transfer to the public internet from ECS/ALB is not modeled in detail here because it depends heavily on traffic.
- SES cost is not modeled as a major line item because it is usually small at this stage unless email volume becomes high.
- CloudFront is not part of the current chosen architecture, so it is treated as a future optional add-on rather than part of the base scenarios.

## Pricing Inputs Used

These are the main unit prices used for the estimates below.

### ECS Fargate, Linux/x86, `us-west-1`

- vCPU: `$0.04656` per vCPU-hour
- memory: `$0.00511` per GB-hour

Useful monthly examples at `730` hours/month:

- `0.25 vCPU / 0.5 GB`: about `$10.36` / month
- `0.5 vCPU / 1 GB`: about `$20.72` / month
- `1 vCPU / 2 GB`: about `$41.45` / month

### Application Load Balancer, `us-west-1`

- ALB hourly base: `$0.0252` per hour
- ALB LCU usage: `$0.008` per LCU-hour

Useful monthly examples at `730` hours/month:

- ALB base only: about `$18.40` / month
- ALB base + `0.25` average LCU: about `$19.86` / month
- ALB base + `0.5` average LCU: about `$21.32` / month
- ALB base + `1.0` average LCU: about `$24.24` / month

### RDS MySQL, `us-west-1`

Single-AZ instance prices:

- `db.t4g.micro`: `$0.021` / hour, about `$15.33` / month
- `db.t4g.small`: `$0.043` / hour, about `$31.39` / month
- `db.t4g.medium`: `$0.085` / hour, about `$62.05` / month

Multi-AZ instance prices:

- `db.t4g.micro`: `$0.043` / hour, about `$31.39` / month
- `db.t4g.small`: `$0.085` / hour, about `$62.05` / month
- `db.t4g.medium`: `$0.171` / hour, about `$124.83` / month

GP3 storage:

- Single-AZ MySQL GP3: `$0.138` per GB-month
- Multi-AZ MySQL GP3: `$0.276` per GB-month

Backup storage beyond free allocation:

- `$0.095` per GB-month

### ElastiCache Redis, `us-west-1`

- `cache.t4g.micro` Redis: `$0.021` / hour, about `$15.33` / month
- `cache.t4g.small` Redis: `$0.042` / hour, about `$30.66` / month

### S3 Standard, `us-west-1`

- storage: `$0.026` per GB-month for the first 50 TB
- PUT/COPY/POST/LIST: `$0.0055` per 1,000 requests
- GET and similar: `$0.00044` per 1,000 requests

Useful storage examples:

- `20 GB`: about `$0.52` / month
- `50 GB`: about `$1.30` / month
- `200 GB`: about `$5.20` / month
- `500 GB`: about `$13.00` / month

### Public IPv4, `us-west-1`

- `$0.005` per in-use public IPv4 address-hour
- one public IPv4 for a full month: about `$3.65`
- two public IPv4 addresses for a full month: about `$7.30`

This matters because public-facing load balancers and public tasks can quietly add cost.

## Scenario Assumptions

To keep scenarios objective, I use a small set of repeatable sizing assumptions.

### Container Size Assumptions

- small API task: `0.5 vCPU / 1 GB`
- medium API task: `1 vCPU / 2 GB`
- small web task: `0.25 vCPU / 0.5 GB`
- medium web task: `0.5 vCPU / 1 GB`

### Traffic Assumptions

Because traffic is unknown, ALB is modeled using simple average LCU ranges:

- low traffic: `0.25 LCU`
- modest traffic: `0.5 LCU`
- production-ish small traffic: `1 LCU`
- heavier early growth: `2 LCU`

### Storage Assumptions

- early validation DB: `20 GB`
- small live DB: `50 GB`
- production small DB: `100 GB`
- production steadier DB: `200 GB`
- S3 is modeled separately for static + media

## Cost Scenarios

### Scenario 1: Cheapest Viable Public Validation

This is the lowest-cost AWS shape that still fits the current project direction:

- `1` API task on Fargate: small API size
- no frontend ECS service yet
- `1` internet-facing ALB
- low ALB traffic
- RDS MySQL Single-AZ `db.t4g.micro`
- `20 GB` RDS GP3
- no Redis
- `20 GB` S3
- about `2` public IPv4s for the ALB

Estimated monthly cost:

| Component | Estimate |
| --- | ---: |
| API Fargate | `$20.72` |
| ALB base + 0.25 LCU | `$19.86` |
| RDS `db.t4g.micro` | `$15.33` |
| RDS storage `20 GB` | `$2.76` |
| S3 `20 GB` | `$0.52` |
| Public IPv4 | `$7.30` |
| Total | `$66.49` |

Planning take:

- realistic floor is roughly `"$65-$75 / month"` before meaningful traffic egress

### Scenario 2: Current Stack, Small But More Complete

This is closer to a full small live environment while still staying cost-aware:

- `1` API task on Fargate: small API size
- `1` web task on Fargate: small web size
- `1` internet-facing ALB
- modest ALB traffic
- RDS MySQL Single-AZ `db.t4g.small`
- `50 GB` RDS GP3
- no Redis yet
- `50 GB` S3
- about `2` public IPv4s for the ALB

Estimated monthly cost:

| Component | Estimate |
| --- | ---: |
| API Fargate | `$20.72` |
| Web Fargate | `$10.36` |
| ALB base + 0.5 LCU | `$21.32` |
| RDS `db.t4g.small` | `$31.39` |
| RDS storage `50 GB` | `$6.90` |
| S3 `50 GB` | `$1.30` |
| Public IPv4 | `$7.30` |
| Total | `$99.29` |

Planning take:

- realistic full-stack floor is roughly `"$95-$115 / month"`
- if Redis is added as `cache.t4g.micro`, add about `"$15.33 / month"`

### Scenario 3: Small Production-Shaped Deployment

This is the first shape that starts to look like a serious small production setup:

- `2` API tasks on Fargate: medium API size
- `2` web tasks on Fargate: medium web size
- `1` internet-facing ALB
- around `1` average LCU
- RDS MySQL Multi-AZ `db.t4g.small`
- `100 GB` RDS GP3
- Redis `cache.t4g.small`
- `200 GB` S3
- about `2` public IPv4s for the ALB

Estimated monthly cost:

| Component | Estimate |
| --- | ---: |
| API Fargate, 2 tasks | `$82.90` |
| Web Fargate, 2 tasks | `$41.44` |
| ALB base + 1 LCU | `$24.24` |
| RDS Multi-AZ `db.t4g.small` | `$62.05` |
| RDS storage `100 GB` Multi-AZ | `$27.60` |
| Redis `cache.t4g.small` | `$30.66` |
| S3 `200 GB` | `$5.20` |
| Public IPv4 | `$7.30` |
| Total | `$281.39` |

Planning take:

- a believable small production baseline is roughly `"$280-$325 / month"`
- this is still before detailed egress, monitoring, and any CDN

### Scenario 4: More Comfortable Early Production

This assumes slightly more breathing room in the database and traffic profile:

- `2` API tasks on Fargate: medium API size
- `2` web tasks on Fargate: medium web size
- `1` internet-facing ALB
- around `2` average LCUs
- RDS MySQL Multi-AZ `db.t4g.medium`
- `200 GB` RDS GP3
- Redis `cache.t4g.small`
- `500 GB` S3
- about `2` public IPv4s for the ALB

Estimated monthly cost:

| Component | Estimate |
| --- | ---: |
| API Fargate, 2 tasks | `$82.90` |
| Web Fargate, 2 tasks | `$41.44` |
| ALB base + 2 LCUs | `$30.08` |
| RDS Multi-AZ `db.t4g.medium` | `$124.83` |
| RDS storage `200 GB` Multi-AZ | `$55.20` |
| Redis `cache.t4g.small` | `$30.66` |
| S3 `500 GB` | `$13.00` |
| Public IPv4 | `$7.30` |
| Total | `$385.41` |

Planning take:

- a more comfortable early-production baseline is roughly `"$385-$450 / month"`
- once outbound traffic, monitoring, backups, and CDN are added, this can move higher fairly quickly

## What Actually Drives Cost

For this project, the biggest cost drivers are likely to be:

1. RDS instance size and whether it is Single-AZ or Multi-AZ
2. Fargate task count and task sizing
3. ALB usage if traffic grows
4. Redis once realtime scaling moves beyond one API task
5. Data transfer and CDN once usage becomes real

In practice, database and compute decisions matter more than S3 storage at the current stage.

## What Mobile Changes

Since the mobile apps will reuse the same backend:

- mobile itself does not necessarily add a large fixed AWS line item
- the mobile launch mainly increases API traffic, ALB usage, websocket/chat activity, and database load
- push notifications may add backend work, but not necessarily a large AWS bill unless extra AWS notification services are introduced later

The likely first infra effect of mobile is:

- more API tasks
- more Redis pressure if chat grows
- more RDS load
- more media upload/storage

## Costs Not Fully Modeled Here

These can matter later and should be revisited before final production budgeting:

- internet data transfer from ECS/ALB to users
- CloudFront if static/media move behind a CDN later
- NAT Gateway if private-subnet egress is introduced
- CloudWatch logs and metrics at larger volume
- SES at higher email volume
- extra backup retention beyond free allocation
- staging environment duplication
- app-store related fees for mobile commerce

## Cost-Saving Levers

If we want to control spend, these are the most effective levers:

- stay API-first as long as possible
- keep Redis disabled until multi-task realtime behavior is truly needed
- use Single-AZ RDS until the project genuinely needs Multi-AZ resilience
- keep Fargate task sizes small and increase only after observing real pressure
- avoid adding CloudFront, NAT Gateway, and duplicate environments too early
- move to ARM Fargate if the images are made multi-arch and compatible

## Current Cost-Control Decision: RDS Single-AZ First

Based on the current project stage, the recommended RDS posture is:

- stay on `Single-AZ` for now
- treat `Multi-AZ` as a later production-hardening upgrade
- improve backup and restore discipline instead of paying early for higher DB availability

Why this is the right cost lever now:

- Single-AZ to Multi-AZ roughly doubles the instance cost for the same small MySQL class
- Single-AZ to Multi-AZ also doubles GP3 storage cost
- the current stack still includes other early-stage simplifications, so paying for DB high availability too early may not produce proportional business value yet

Small example from this project's modeled sizes:

- `db.t4g.small` Single-AZ: about `$31.39 / month`
- `db.t4g.small` Multi-AZ: about `$62.05 / month`
- `50 GB` GP3 Single-AZ: about `$6.90 / month`
- `50 GB` GP3 Multi-AZ: about `$13.80 / month`

That means a small DB footprint can move from roughly `~$38` to `~$76` monthly before considering any additional operational changes.

## AWS Process For The Single-AZ Cost-Control Path

If the current DB is already `Single-AZ`:

- no availability change is required now
- focus on backup retention, deletion protection, and restore testing

If the current DB is `Multi-AZ` and the goal is cost reduction:

1. inspect the current DB instance in the RDS console
2. take a manual snapshot before making the change
3. modify the DB instance and change `Multi-AZ deployment` to `No` if available for the current instance type and engine path
4. prefer using the maintenance window unless there is a good reason to apply immediately
5. after the change, verify automated backups, retention, and restore readiness

CLI shape for the change:

```bash
aws rds modify-db-instance \
  --db-instance-identifier <db-id> \
  --no-multi-az \
  --no-apply-immediately
```

CLI shape for backup hardening:

```bash
aws rds modify-db-instance \
  --db-instance-identifier <db-id> \
  --backup-retention-period 7 \
  --deletion-protection \
  --no-apply-immediately
```

## Backup-First Risk Reduction

If we save money by staying Single-AZ, the compensating controls should be:

- take a manual snapshot before significant DB or infrastructure changes
- keep automated backups enabled
- set a deliberate retention period such as `7` to `14` days
- enable deletion protection
- test restore from snapshot to a separate DB instance
- test point-in-time recovery at least once

This is much cheaper than Multi-AZ and gives better operational confidence than relying on backups that have never been restored in practice.

## Triggers To Move From Single-AZ To Multi-AZ Later

The project should revisit Multi-AZ when one or more of these becomes true:

- mobile app launch materially increases dependency on backend uptime
- paying users are active and DB downtime becomes commercially important
- recovery time from a DB outage becomes unacceptable
- the platform is being treated as fully production-ready
- infrastructure hardening becomes a priority over validation-stage cost control

When that happens, the move back to Multi-AZ is straightforward through the RDS console or `modify-db-instance --multi-az`.

## ARM Fargate Opportunity

The current public pricing also shows lower ARM Fargate rates in `us-west-1`:

- ARM vCPU: `$0.03725` per vCPU-hour
- ARM memory: `$0.00409` per GB-hour

If the API and web images are built and tested for ARM, Fargate compute can be reduced materially. This is one of the cleaner future optimizations if the team wants lower steady-state compute cost.

## Recommended Budget Planning View

For practical planning, I would use these numbers:

- validation phase budget: `~$75 / month`
- small full-stack live budget: `~$125 / month`
- small production budget: `~$325 / month`
- more comfortable early production budget: `~$450 / month`

These are safer planning figures than the raw minimums because they leave room for request charges, small overruns, logs, and minor growth.

## Sources

Official AWS sources used for this document:

- AWS Price List Bulk API documentation: `https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-the-aws-price-list-bulk-api-fetching-price-list-files-manually.html`
- ECS pricing feed pattern: `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonECS/current/us-west-1/index.csv`
- RDS pricing feed pattern: `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonRDS/current/us-west-1/index.csv`
- ElastiCache pricing feed pattern: `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonElastiCache/current/us-west-1/index.csv`
- S3 pricing feed pattern: `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/us-west-1/index.csv`
- ELB pricing feed pattern: `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSELB/current/index.csv`
- VPC pricing feed pattern: `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonVPC/current/us-west-1/index.csv`
- ELB pricing page: `https://aws.amazon.com/elasticloadbalancing/pricing/`

## Suggested Follow-Up

This document should be revisited when any of the following happen:

- final ECS task sizes are chosen
- Redis becomes mandatory
- Multi-AZ is enabled for real
- frontend is attached in AWS
- mobile traffic starts affecting backend load
- CloudFront is introduced
- staging/preview environments are added
