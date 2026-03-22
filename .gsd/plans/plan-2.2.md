---
phase: 2
plan: 2
wave: 2
gap_closure: false
---

# Plan 2.2: Task Cards with Drag-and-Drop

## Objective
Build the task card system — visual task cards with priority colors, subtask progress, tags, and drag-and-drop for time-boxing onto calendar slots.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/components/calendar/DayStrip.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Define Task types and local state</name>
  <files>
    src/types/task.ts
    src/store/taskStore.ts
  </files>
  <action>
    1. Create src/types/task.ts:
       interface Task {
         id: string
         title: string
         description?: string
         priority: "high" | "medium" | "low"
         date: string (ISO date)
         time?: string (HH:mm)
         duration?: number (minutes)
         completed: boolean
         tags: string[]
         recurrence?: RecurrenceRule
         subtasks: Subtask[]
         createdAt: string
         updatedAt: string
       }
       interface Subtask { id: string; title: string; completed: boolean }
       interface RecurrenceRule { frequency: "daily"|"weekly"|"monthly"; interval: number; days?: number[] }

    2. Create src/store/taskStore.ts using Zustand:
       - tasks: Task[]
       - addTask, updateTask, deleteTask, toggleComplete, reorderTasks
       - getTasksByDate(date) selector
       - Persist to localStorage via zustand/middleware

    USE: Zustand — minimal, no boilerplate, built-in persist
    AVOID: Redux — overkill for single-user app
  </action>
  <verify>
    Import taskStore in a component — no TS errors, add/get works
  </verify>
  <done>
    Task types defined, Zustand store with localStorage persistence working.
  </done>
</task>

<task type="auto">
  <name>Create TaskCard component</name>
  <files>
    src/components/tasks/TaskCard.tsx
    src/components/tasks/PriorityBadge.tsx
    src/components/tasks/SubtaskProgress.tsx
    src/components/tasks/TagChip.tsx
  </files>
  <action>
    1. TaskCard.tsx: glass-style card showing:
       - Left border color by priority (red=high, yellow=medium, green=low)
       - Title (strikethrough if completed)
       - Time slot if assigned (e.g., "9:00 - 10:00")
       - Subtask progress bar (2/5 completed)
       - Tag chips (#work, #home)
       - Checkbox to toggle completion (with Framer Motion scale animation)
       - Swipe left to delete (optional, mobile gesture)
    2. PriorityBadge.tsx: colored dot/pill
    3. SubtaskProgress.tsx: mini progress bar
    4. TagChip.tsx: small rounded tag label

    Glassmorphic styling: backdrop-blur, translucent bg, subtle border
  </action>
  <verify>
    Render TaskCard with mock data — all elements visible
  </verify>
  <done>
    Task card renders with priority color, subtasks, tags, completion toggle.
  </done>
</task>

<task type="auto">
  <name>Create TaskList for selected day</name>
  <files>
    src/components/tasks/TaskList.tsx
    src/app/page.tsx
  </files>
  <action>
    1. TaskList.tsx:
       - Receives date prop
       - Fetches tasks from store via getTasksByDate
       - Renders TaskCards in a vertical list
       - Groups by: timed tasks (sorted by time), then untimed tasks
       - Empty state: subtle message "No tasks for this day"
       - Framer Motion AnimatePresence for add/remove animations
    2. Integrate into Today page below the calendar strip
    3. Add a few hardcoded mock tasks for development
  </action>
  <verify>
    Select different days — task list updates accordingly
    Complete a task — strikethrough animation plays
  </verify>
  <done>
    Task list renders per selected day, animations smooth, empty state works.
  </done>
</task>

<task type="auto">
  <name>Implement drag-and-drop time boxing</name>
  <files>
    src/components/tasks/DraggableTaskCard.tsx
    src/components/calendar/TimeSlots.tsx
  </files>
  <action>
    1. Install @dnd-kit/core and @dnd-kit/sortable
    2. DraggableTaskCard.tsx: wrap TaskCard with useDraggable
    3. TimeSlots.tsx: vertical time grid (6am-midnight, 30min slots)
       - Each slot is a droppable zone
       - Drop a task → assigns time to that task
       - Visual feedback: ghost card while dragging
    4. Reorder tasks within list via drag (sortable)

    USE: @dnd-kit — modern, accessible, React 18+ compatible
    AVOID: react-beautiful-dnd — deprecated
  </action>
  <verify>
    Drag a task card onto a time slot — task gets assigned to that time
    Drag to reorder — order persists
  </verify>
  <done>
    Tasks draggable to time slots, reorderable, state persists in store.
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Review task card design and drag UX</name>
  <files>-</files>
  <action>
    User tests on mobile viewport:
    1. Task cards look glassmorphic and readable
    2. Priority colors distinct
    3. Drag feels natural (long press to initiate on mobile)
    4. Time boxing works as expected
  </action>
  <verify>Visual + interaction testing</verify>
  <done>User approves task card UX.</done>
</task>

## Must-Haves
- [ ] Task data model with all spec fields
- [ ] Zustand store with localStorage persistence
- [ ] Visual task cards with priority, tags, subtasks
- [ ] Drag-and-drop to time slots
- [ ] Completion toggle with animation
- [ ] Tasks grouped by day

## Success Criteria
- [ ] Tasks persist across page reload (localStorage)
- [ ] Drag-and-drop works on desktop and mobile
- [ ] No layout shifts during drag operations
- [ ] Empty state renders gracefully

## Dependencies
- Plan 2.1 (calendar + day selection)
- npm install: zustand, @dnd-kit/core, @dnd-kit/sortable
