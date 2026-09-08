# CodeCraftor Client AI

AI-assisted client acquisition operating system for CodeCraftor.

See `docs/README.md` for the full documentation ? Phase 1 (prospect
capture, AI extraction, ICP scoring, outreach) and **Phase 2**
(conversations, follow-ups, tags, activity timeline, AI conversation
analysis & next best action).

```
backend/   Express + TypeScript + Prisma + OpenAI
frontend/  Next.js 14 (App Router) + TypeScript + Tailwind
docs/      Full Phase 1 documentation
```

## 60-second start

```bash
# backend
cd backend
cp .env.example .env       # fill DATABASE_URL, JWT_SECRET, (optional) OPENAI_API_KEY
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev                # http://localhost:4000

# frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:3000
```

Demo login: `demo@codecraftor.dev` / `demo1234` (seeded; marked `[DEV DEMO]`).

## Modernized dependency stack (current)

| Area         | Stack                                                             |
|--------------|-------------------------------------------------------------------|
| Frontend     | Next.js 16 · React 19 · TypeScript 5.7 · Tailwind 3.4 (LTS)      |
| Backend      | Node.js 20.9+ · Express 5 · TypeScript 5.7                       |
| Database     | PostgreSQL 14+ · Prisma 7.10 (with @prisma/adapter-pg)          |
| AI           | OpenAI Node SDK 7.8                                               |
| Security     | helmet 8.3 · cors 2.8 · express-rate-limit 8.7 · zod 4.5          |

See docs/README.md for the full modernization report (before/after table,
compatibility fixes, verification log) and the **Phase 2** feature set,
routes, AI contracts, and verification report.
