# ──────────────────────────────────────────────────────────────────────────────
# DevFlow — Next.js Frontend
# Multi-stage build for minimal, production-ready Docker image.
#
# Stages:
#   base    — shared Alpine + Node base
#   deps    — install all dependencies (cached layer)
#   builder — compile the Next.js app in standalone mode
#   runner  — lean production image (~50 MB vs ~500 MB naive build)
#
# Build:
#   docker build -t devflow-frontend .
#
# Run:
#   docker run -p 3000:3000 \
#     -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
#     -e NEXT_PUBLIC_WS_URL=ws://localhost:8000 \
#     devflow-frontend
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: base ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
# Add libc compatibility for packages that need it (e.g. sharp)
RUN apk add --no-cache libc6-compat

# ── Stage 2: deps ─────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy only the manifests first so this layer is cached unless dependencies change
COPY package.json package-lock.json ./

# Install production + dev deps (needed for the build step)
RUN npm ci

# ── Stage 3: builder ──────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time public env vars — override these when building for staging/prod.
# They are baked into the client bundle at build time (NEXT_PUBLIC_ prefix).
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8000

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

RUN npm run build

# ── Stage 4: runner ───────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Pre-create the .next directory with the right permissions so Next.js can
# write its prerender cache on first boot
RUN mkdir .next && chown nextjs:nodejs .next

# Copy only the output of the standalone build — this is what makes the image small.
# `output: "standalone"` in next.config.mjs produces a self-contained server.js
# plus a tree-shaken copy of node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

USER nextjs

EXPOSE 3000

# Runtime env vars — these can be overridden via docker run -e or docker-compose
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# next.config.mjs sets output: "standalone" which generates server.js
CMD ["node", "server.js"]
