---
phase: 2
plan: 3
wave: 2
gap_closure: false
---

# Plan 2.3: Quick Add Task Modal

## Objective
Build the "capture in <2 seconds" Quick Add — a modal triggered by the center "+" button. Minimal friction: type title, optionally set priority/date, hit enter. Matches SPEC goal #5.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/store/taskStore.ts
- src/components/layout/BottomNav.tsx

## Tasks

<task type="auto">
  <name>Create QuickAdd modal component</name>
  <files>
    src/components/tasks/QuickAddModal.tsx
  </files>
  <action>
    1. Full-screen modal overlay with glassmorphic panel
    2. Auto-focus text input on open
    3. Minimal fields visible by default:
       - Title input (large, prominent)
       - Date pill (defaults to selected day, tappable to change)
       - Priority selector (3 colored dots: H/M/L, default Medium)
    4. "More options" expandable section:
       - Time picker
       - Tags input (comma separated or chip-style)
       - Notes/description textarea
       - Recurrence selector
    5. Submit: Enter key or tap button
    6. Dismiss: tap outside or swipe down
    7. Framer Motion: slide up from bottom, backdrop blur

    CRITICAL: Title + Enter must work in <2 seconds from tap to saved.
  </action>
  <verify>
    Tap + → modal opens → type title → Enter → task appears in list
    Measure: under 2 seconds flow
  </verify>
  <done>
    Quick add opens instantly, saves task on Enter, closes smoothly.
  </done>
</task>

<task type="auto">
  <name>Wire QuickAdd to BottomNav + button</name>
  <files>
    src/components/layout/BottomNav.tsx
    src/components/tasks/QuickAddModal.tsx
  </files>
  <action>
    1. Center "+" button in BottomNav triggers QuickAdd modal
    2. Also support keyboard shortcut: "N" key opens Quick Add (global)
    3. Pass currently selected date as default date
    4. On successful add: brief success toast/animation
  </action>
  <verify>
    Click + → modal → add task → appears in today's list immediately
    Press N → same flow
  </verify>
  <done>
    + button and N shortcut both open Quick Add, task saves to correct date.
  </done>
</task>

<task type="auto">
  <name>Create inline tag parser</name>
  <files>
    src/lib/parseTaskInput.ts
  </files>
  <action>
    1. Parse natural shortcuts from title input:
       - "#tag" → extracts tag
       - "!h" / "!m" / "!l" → sets priority
       - "tomorrow" / "today" / "monday" → sets date
    2. Example: "Buy groceries #home !h tomorrow"
       → title: "Buy groceries", tags: ["home"], priority: "high", date: tomorrow
    3. Strip parsed tokens from displayed title
  </action>
  <verify>
    Unit test parseTaskInput with various inputs
  </verify>
  <done>
    Parser extracts tags, priority, date keywords from free-text input.
  </done>
</task>

## Must-Haves
- [ ] Quick Add opens in <200ms
- [ ] Title + Enter saves task in <2s total flow
- [ ] Default date = currently selected day
- [ ] Priority selector works
- [ ] Modal dismissible (tap outside / swipe down)

## Success Criteria
- [ ] Full flow under 2 seconds (open → type → save)
- [ ] Inline tag parsing works (#tag, !priority)
- [ ] Task immediately appears in day view after save
- [ ] Keyboard shortcut (N) works on desktop

## Dependencies
- Plan 2.2 (task store + TaskCard)
- Plan 1.3 (BottomNav + button)
