# Phase 18 — Deployment

## Objective

Prepare the Next.js application for production and deploy it. We will configure the Dockerfile for self-hosting and verify environment variables.

---

## Concepts Learned

- Next.js `standalone` output mode
- Multi-stage Docker builds for Node.js
- Production environment variable handling

**Relevant docs**:
- `13-deployment/deployment.md`

---

## Features After This Phase

- [ ] `next.config.js` optimized for production
- [ ] `Dockerfile` created and optimized
- [ ] Frontend successfully runs in a Docker container connected to the backend

---

## Completion Checklist

- [ ] Set `output: "standalone"` in `next.config.js`
- [ ] Create the multi-stage `Dockerfile`
- [ ] Add the frontend service to the project's root `docker-compose.yml`
- [ ] Run `docker-compose up --build` and verify the frontend is accessible on `http://localhost:3000`
- [ ] Verify that the frontend can successfully communicate with the backend API from within the Docker network
- [ ] (Optional) Deploy to Vercel by linking the GitHub repository
