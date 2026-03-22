# Roadmap

> **Current Phase:** 4 - Polish & Notifications
> **Status:** ✅ Complete — All Phases Done

## Must-Haves (from SPEC)
- [x] Next.js PWA Setup
- [x] Calendar Core Interface
- [x] Database Persistence (Prisma setup)

---

## Phases

### Phase 1: Foundation & Scaffold
**Status:** ✅ Complete
**Objective:** Initialize Next.js project, setup Tailwind CSS, add Framer Motion, and configure basic layout with PWA support.

**Plans:**
- [x] Plan 1.1: Scaffolding with `npx create-next-app` → [plan-1.1.md](plans/plan-1.1.md)
- [x] Plan 1.2: PWA manifest & service worker → [plan-1.2.md](plans/plan-1.2.md)
- [x] Plan 1.3: Base layout, navigation & dark neon theme → [plan-1.3.md](plans/plan-1.3.md)

**Delivers:** Installable PWA shell with dark neon glassmorphic UI, bottom navigation, placeholder pages.
**Dependencies:** None
**Installs:** framer-motion, lucide-react, @serwist/next, serwist

---

### Phase 2: Core UI & Calendar
**Status:** ✅ Complete
**Objective:** Create the Calendar view (day/week strip) and full task system.

**Plans:**
- [x] Plan 2.1: Infinite scroll day strip + week view → [plan-2.1.md](plans/plan-2.1.md)
- [x] Plan 2.2: Task cards, Zustand store, drag-and-drop → [plan-2.2.md](plans/plan-2.2.md)
- [x] Plan 2.3: Quick Add modal with inline parsing → [plan-2.3.md](plans/plan-2.3.md)

**Delivers:** Working planner UI — calendar navigation, task cards with priorities/tags/subtasks, drag time-boxing, Quick Add in <2s.
**Dependencies:** Phase 1
**Installs:** date-fns, zustand, @dnd-kit/core, @dnd-kit/sortable

---

### Phase 3: Backend & Database
**Status:** ✅ Complete
**Objective:** Persist all data to PostgreSQL, replace localStorage.

**Plans:**
- [x] Plan 3.1: Prisma schema & database setup → [plan-3.1.md](plans/plan-3.1.md)
- [x] Plan 3.2: API routes for CRUD + validation → [plan-3.2.md](plans/plan-3.2.md)
- [x] Plan 3.3: Sync frontend store with backend (SWR + optimistic) → [plan-3.3.md](plans/plan-3.3.md)

**Delivers:** Full persistence — data survives reload, sync indicator, offline fallback, optimistic updates.
**Dependencies:** Phase 2
**Installs:** prisma, @prisma/client, zod, swr

---

### Phase 4: Polish & Notifications
**Status:** ✅ Complete
**Objective:** Push reminders, visual polish, performance optimization for launch.

**Plans:**
- [x] Plan 4.1: Push notifications & reminders → [plan-4.1.md](plans/plan-4.1.md)
- [x] Plan 4.2: Visual polish, animations & performance → [plan-4.2.md](plans/plan-4.2.md)

**Delivers:** Actionable reminders (complete/snooze), polished glassmorphic design, Lighthouse >90, <1s mobile load.
**Dependencies:** Phase 3

---

## Progress Summary

| Phase | Status | Plans | Complete |
|-------|--------|-------|----------|
| 1 | ✅ | 3/3 | 2026-03-23 |
| 2 | ✅ | 3/3 | 2026-03-23 |
| 3 | ✅ | 3/3 | 2026-03-23 |
| 4 | ✅ | 2/2 | 2026-03-23 |

## Dependency Graph

```
Plan 1.1 (done) → Plan 1.2 → Plan 1.3
                                  ↓
                   Plan 2.1 → Plan 2.2 → Plan 2.3
                                  ↓
                   Plan 3.1 → Plan 3.2 → Plan 3.3
                                            ↓
                              Plan 4.1 ← Plan 4.2
```
