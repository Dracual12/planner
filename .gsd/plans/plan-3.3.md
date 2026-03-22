---
phase: 3
plan: 3
wave: 3
gap_closure: false
---

# Plan 3.3: Sync Local State with Backend

## Objective
Connect the Zustand frontend store to the API routes. Replace localStorage persistence with real database sync. Handle optimistic updates for instant UX.

## Context
Load these files for context:
- src/store/taskStore.ts
- src/app/api/tasks/route.ts
- src/types/task.ts

## Tasks

<task type="auto">
  <name>Create API client layer</name>
  <files>
    src/lib/api/tasks.ts
  </files>
  <action>
    1. Create typed fetch wrappers:
       - fetchTasksByDate(date: string): Promise<Task[]>
       - createTask(data: CreateTaskInput): Promise<Task>
       - updateTask(id: string, data: Partial<Task>): Promise<Task>
       - deleteTask(id: string): Promise<void>
       - toggleComplete(id: string): Promise<Task>
       - reorderTasks(ids: string[]): Promise<void>
       - addSubtask(taskId: string, title: string): Promise<Subtask>
       - toggleSubtask(taskId: string, subId: string): Promise<Subtask>
    2. Base fetch with error handling, JSON parsing
    3. Throw typed errors for UI to catch
  </action>
  <verify>
    Import and call fetchTasksByDate — returns tasks from DB
  </verify>
  <done>
    All API functions typed and working.
  </done>
</task>

<task type="auto">
  <name>Refactor taskStore for API sync</name>
  <files>
    src/store/taskStore.ts
  </files>
  <action>
    1. Replace localStorage persistence with API calls
    2. Optimistic updates pattern:
       - Update local state immediately
       - Fire API call in background
       - On error: rollback local state + show error toast
    3. Add loading states: isLoading, isSaving
    4. Add fetchTasks(date) action that calls API
    5. Cache fetched days to avoid re-fetching:
       Map<dateString, Task[]>
    6. Keep localStorage as offline fallback (sync when back online)
  </action>
  <verify>
    Add task → appears instantly → persists after full page reload
    Disconnect network → add task → reconnect → task syncs
  </verify>
  <done>
    Store syncs with backend, optimistic updates feel instant, offline fallback works.
  </done>
</task>

<task type="auto">
  <name>Add SWR or React Query for data fetching</name>
  <files>
    package.json
    src/hooks/useTasks.ts
  </files>
  <action>
    1. npm install swr
    2. Create useTasks(date) hook:
       - Uses SWR for fetch + cache + revalidation
       - Auto-revalidates on window focus
       - Stale-while-revalidate for instant page loads
    3. Create useTask(id) for single task detail
    4. Integrate with Zustand for mutations (SWR for reads, Zustand for writes)

    USE: SWR — lightweight, built by Vercel, perfect for Next.js
    AVOID: React Query if SWR is sufficient (simpler mental model)
  </action>
  <verify>
    Switch tabs and come back → data refreshes automatically
    Multiple components reading same date → single fetch
  </verify>
  <done>
    SWR handles caching/revalidation, Zustand handles mutations.
  </done>
</task>

<task type="auto">
  <name>Add error handling and sync indicator</name>
  <files>
    src/components/ui/SyncStatus.tsx
    src/components/ui/Toast.tsx
  </files>
  <action>
    1. SyncStatus.tsx: small indicator in header
       - Green dot: synced
       - Yellow spinning: syncing
       - Red dot: offline / error
    2. Toast.tsx: minimal notification for errors
       - "Failed to save task — retrying..."
       - "Back online — syncing..."
    3. Auto-retry failed mutations (3 attempts with backoff)
  </action>
  <verify>
    Kill API → add task → shows error toast → restart API → syncs
  </verify>
  <done>
    User always knows sync state, errors are recoverable.
  </done>
</task>

## Must-Haves
- [ ] All CRUD operations hit the database
- [ ] Optimistic updates (no perceived lag)
- [ ] Data survives full page reload
- [ ] Offline fallback to localStorage
- [ ] Sync status indicator

## Success Criteria
- [ ] Add task → reload page → task still there (from DB)
- [ ] Optimistic update feels instant (<50ms UI response)
- [ ] Network error → graceful fallback → auto-retry
- [ ] No duplicate tasks after sync conflicts

## Dependencies
- Plan 3.2 (API routes working)
- Plan 2.2 (Zustand store structure)
