---
phase: 3
plan: 2
wave: 3
gap_closure: false
---

# Plan 3.2: API Routes for CRUD Operations

## Objective
Create Next.js API routes (Route Handlers) for all task operations. RESTful endpoints that the frontend will call to persist tasks to PostgreSQL.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/lib/prisma.ts
- prisma/schema.prisma
- src/types/task.ts

## Tasks

<task type="auto">
  <name>Create tasks CRUD routes</name>
  <files>
    src/app/api/tasks/route.ts
    src/app/api/tasks/[id]/route.ts
  </files>
  <action>
    1. GET /api/tasks?date=2026-03-23
       - Fetch tasks for a specific date
       - Optional: ?from=&to= for date range
       - Include subtasks in response
       - Sort by: time (nulls last), then order

    2. POST /api/tasks
       - Create new task
       - Body: { title, priority, date, time?, tags?, subtasks? }
       - Validate required fields
       - Return created task with id

    3. PATCH /api/tasks/[id]
       - Update any task fields
       - Partial update (only sent fields)
       - Handle subtask updates

    4. DELETE /api/tasks/[id]
       - Delete task and cascade subtasks
       - Return 204

    5. PATCH /api/tasks/[id]/complete
       - Toggle completion status
       - Convenience endpoint for quick toggle

    All routes use src/lib/prisma.ts singleton.
    Return proper HTTP status codes.
    Validate input shapes.
  </action>
  <verify>
    curl tests:
    - POST /api/tasks → 201 + task object
    - GET /api/tasks?date=today → array with created task
    - PATCH /api/tasks/:id → 200 + updated task
    - DELETE /api/tasks/:id → 204
  </verify>
  <done>
    All CRUD endpoints working, proper status codes, data persists in DB.
  </done>
</task>

<task type="auto">
  <name>Create subtasks routes</name>
  <files>
    src/app/api/tasks/[id]/subtasks/route.ts
  </files>
  <action>
    1. POST /api/tasks/[id]/subtasks — add subtask
    2. PATCH /api/tasks/[id]/subtasks/[subId] — update/toggle subtask
    3. DELETE /api/tasks/[id]/subtasks/[subId] — remove subtask
  </action>
  <verify>
    Add subtask to task → shows in GET /api/tasks response
  </verify>
  <done>
    Subtask CRUD works, nested under parent task.
  </done>
</task>

<task type="auto">
  <name>Create reorder endpoint</name>
  <files>
    src/app/api/tasks/reorder/route.ts
  </files>
  <action>
    1. PUT /api/tasks/reorder
       - Body: { orderedIds: string[] }
       - Updates order field for each task
       - Used after drag-and-drop reorder
    2. Batch update in transaction for consistency
  </action>
  <verify>
    Reorder 3 tasks → GET returns new order
  </verify>
  <done>
    Reorder persists, transaction ensures consistency.
  </done>
</task>

<task type="auto">
  <name>Add input validation with Zod</name>
  <files>
    src/lib/validations/task.ts
    package.json
  </files>
  <action>
    1. npm install zod
    2. Define Zod schemas matching Task interface
    3. Validate all POST/PATCH bodies in route handlers
    4. Return 400 with clear error messages on validation failure
  </action>
  <verify>
    POST with missing title → 400 + error message
    POST with invalid priority → 400 + error message
  </verify>
  <done>
    All inputs validated, clear error messages on bad requests.
  </done>
</task>

## Must-Haves
- [ ] GET tasks by date works
- [ ] POST creates task in database
- [ ] PATCH updates task fields
- [ ] DELETE removes task
- [ ] Input validation on all mutations
- [ ] Subtask CRUD operational

## Success Criteria
- [ ] All endpoints return correct HTTP status codes
- [ ] Data persists in PostgreSQL (verify via Prisma Studio)
- [ ] Invalid inputs rejected with clear errors
- [ ] Reorder endpoint handles concurrent requests safely

## Dependencies
- Plan 3.1 (Prisma schema + client)
