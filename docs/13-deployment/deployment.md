# Deployment — Docker & Vercel

## What Is It?

Deployment is the process of putting your Next.js application on a server so users can access it. We will cover two approaches: **Vercel** (the creators of Next.js, fully managed) and **Docker** (self-hosted containerization).

## Why Does It Matter?

- **Vercel** — Easiest, fastest, zero-config deployment with built-in CI/CD and edge caching
- **Docker** — Complete control, no vendor lock-in, can be hosted anywhere (AWS, DigitalOcean, local server)
- **Environment Management** — Safely handling secrets across dev, staging, and production

## How Does It Fit into DevFlow?

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect Vercel to your GitHub repository
3. Add environment variables (`NEXT_PUBLIC_API_URL`, etc.)
4. Vercel automatically builds and deploys on every push
5. PRs get automatic preview URLs

### Docker Deployment (Self-Hosted)

For self-hosting, we use a multi-stage Dockerfile to minimize the final image size.

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
# Note: In a real CI, you'd pass ENV vars here for build-time evaluation
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Important Next.js Config for Docker

To use the `standalone` output feature (which copies only the required files for production), update your `next.config.js`:

```javascript
// next.config.js
module.exports = {
  output: "standalone",
  // ... other config
}
```

## Common Mistakes

1. **Leaking secrets** — Prefixing secret keys with `NEXT_PUBLIC_` exposes them to the browser
2. **Missing build env vars** — Next.js evaluates `NEXT_PUBLIC_` variables at *build time*, not runtime
3. **Huge Docker images** — Not using multi-stage builds or the `standalone` output feature
4. **Ignoring caching** — Not leveraging Next.js Image Optimization caching in Docker

## What I Should Be Able to Do Afterward

- [ ] Deploy a Next.js app to Vercel with continuous integration
- [ ] Write a multi-stage Dockerfile for Next.js
- [ ] Configure environment variables safely
- [ ] Understand build-time vs runtime environment variables
- [ ] Run the Next.js frontend alongside the FastAPI backend using Docker Compose
