---
phase: 3
plan: 1
wave: 3
gap_closure: false
---

# Plan 3.1: Prisma Schema & Database Setup

## Objective
Define the database schema with Prisma ORM, setup PostgreSQL connection, and create migrations. This is the persistence backbone — no more lost data on reload.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/types/task.ts
- src/store/taskStore.ts

## Tasks

<task type="auto">
  <name>Install Prisma and initialize</name>
  <files>
    package.json
    prisma/schema.prisma
    .env
  </files>
  <action>
    1. npm install prisma @prisma/client
    2. npx prisma init
    3. Configure .env with DATABASE_URL (PostgreSQL)
    4. Add .env to .gitignore if not already

    AVOID: committing .env with real credentials
  </action>
  <verify>
    npx prisma --version — shows installed version
    prisma/schema.prisma exists
  </verify>
  <done>
    Prisma initialized, schema file created, .env configured.
  </done>
</task>

<task type="auto">
  <name>Define database schema</name>
  <files>
    prisma/schema.prisma
  </files>
  <action>
    model Task {
      id          String    @id @default(cuid())
      title       String
      description String?
      priority    Priority  @default(MEDIUM)
      date        DateTime
      time        String?
      duration    Int?      // minutes
      completed   Boolean   @default(false)
      tags        String[]  // PostgreSQL array
      order       Int       @default(0)
      createdAt   DateTime  @default(now())
      updatedAt   DateTime  @updatedAt
      subtasks    Subtask[]
      recurrence  Recurrence?
    }

    model Subtask {
      id        String  @id @default(cuid())
      title     String
      completed Boolean @default(false)
      taskId    String
      task      Task    @relation(fields: [taskId], references: [id], onDelete: Cascade)
    }

    model Recurrence {
      id        String @id @default(cuid())
      frequency String // daily, weekly, monthly
      interval  Int    @default(1)
      days      Int[]  // day numbers
      taskId    String @unique
      task      Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
    }

    enum Priority {
      HIGH
      MEDIUM
      LOW
    }
  </action>
  <verify>
    npx prisma validate — no errors
  </verify>
  <done>
    Schema validates, all task fields mapped, relations correct.
  </done>
</task>

<task type="auto">
  <name>Run initial migration</name>
  <files>
    prisma/migrations/
  </files>
  <action>
    1. npx prisma migrate dev --name init
    2. npx prisma generate (generate client)
    3. Verify generated client types match our Task interface
  </action>
  <verify>
    npx prisma migrate status — shows applied migration
    npx prisma studio — opens and shows empty tables
  </verify>
  <done>
    Migration applied, database tables created, Prisma Client generated.
  </done>
</task>

<task type="auto">
  <name>Create Prisma singleton for Next.js</name>
  <files>
    src/lib/prisma.ts
  </files>
  <action>
    Standard Next.js Prisma singleton pattern:
    - Prevent multiple instances in dev (hot reload)
    - Export shared prisma client

    import { PrismaClient } from "@prisma/client"
    const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
    export const prisma = globalForPrisma.prisma ?? new PrismaClient()
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
  </action>
  <verify>
    Import prisma in a server component — no runtime errors
  </verify>
  <done>
    Prisma client singleton works in dev and production.
  </done>
</task>

<task type="checkpoint:decision">
  <name>Database hosting choice</name>
  <files>-</files>
  <action>
    User decides where to host PostgreSQL:
    - Option A: Vercel Postgres (if deploying to Vercel)
    - Option B: Supabase (free tier, generous limits)
    - Option C: Railway (simple, good DX)
    - Option D: Local Docker for now, decide later
  </action>
  <verify>Connection string works in .env</verify>
  <done>Database accessible, connection tested.</done>
</task>

## Must-Haves
- [ ] Prisma schema matches Task type interface
- [ ] Migration runs without errors
- [ ] Prisma Client generates typed queries
- [ ] Singleton pattern prevents connection leaks
- [ ] .env not committed to git

## Success Criteria
- [ ] `npx prisma validate` passes
- [ ] `npx prisma studio` shows correct tables
- [ ] Can create/read a task via Prisma Client in a test script

## Dependencies
- Plan 2.2 (Task types finalized)
