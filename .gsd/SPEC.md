# SPEC.md — Project Specification

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: No code may be written until this spec is marked `FINALIZED`.

## Vision
A sleek, minimalistic, and highly convenient personal planner accessible via Web, designed as a Progressive Web App (PWA) for desktop and mobile home screens. Focus on extreme UI/UX craft, smooth calendar integration, and smart notifications.

## Goals
1. **Glassmorphic / Dark Neon Design** — visually pleasing and fast.
2. **Infinite Navigation Calendar** — fluid scrolling, day/week views.
3. **PWA Support** — add to home screen, quick loading.
4. **Actionable Notifications** — reminders for deadlines.
5. **Quick Add Utility** — capture ideas in <2 seconds.
6. **Backend Sync & Deployment** — state saved on server.

## Non-Goals (Out of Scope)
- Team Collaboration / Groups (Single User first).
- Advanced Analytics/Charts (Keep it action-oriented).

## Constraints
- **Stack**: Next.js App Router, Tailwind CSS, Framer Motion, Prisma ORM.
- **Performance** — Must load on mobile in <1s.
- **Offline Capable** — Basic features must work without internet.

## Success Criteria
- [x] Working PWA manifest support
- [x] Fluid Infinite-scroll Calendar (Day/Week)
- [x] Working Reminders (Browser API / push)
- [x] Database Persistence (No lost data on reload)

## Features
- [x] **Time Boxing**: Drag and drop tasks onto the calendar timeline.
- [x] **Priority Matrix**: Color-coded urgency (H/M/L).
- [x] **Recurrence Editor**: "Every Monday at 9am".
- [x] **Dynamic Sort**: Filter by Tag or Context (e.g., #work, #home).
- [x] **Sub-tasks / Checklists**: Breakdown inside cards.

---

*Last updated: 2026-03-23*
