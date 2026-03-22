---
phase: 4
plan: 1
wave: 3
gap_closure: false
---

# Plan 4.1: Push Notifications & Reminders

## Objective
Implement actionable push reminders so users never miss deadlines. Browser Notification API for web, with service worker for background delivery.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/sw.ts (service worker)
- src/store/taskStore.ts
- prisma/schema.prisma

## Tasks

<task type="auto">
  <name>Add reminder fields to Task model</name>
  <files>
    prisma/schema.prisma
    src/types/task.ts
  </files>
  <action>
    1. Add to Task model:
       reminder    DateTime?   // when to fire notification
       reminderSent Boolean   @default(false)
    2. Run migration: npx prisma migrate dev --name add-reminders
    3. Update TypeScript types to match
  </action>
  <verify>
    npx prisma validate — passes
  </verify>
  <done>
    Reminder fields in DB and types.
  </done>
</task>

<task type="auto">
  <name>Create notification permission flow</name>
  <files>
    src/hooks/useNotifications.ts
    src/components/ui/NotificationPrompt.tsx
  </files>
  <action>
    1. useNotifications hook:
       - Check Notification.permission
       - Request permission if "default"
       - Track permission state
       - scheduleReminder(task) — schedule via setTimeout or service worker
    2. NotificationPrompt.tsx:
       - Non-intrusive banner asking to enable notifications
       - Show on first task creation with a time set
       - "Enable reminders" button
       - Dismissible, don't ask again if denied

    AVOID: requesting permission on page load — bad UX, browsers block this
    USE: contextual prompt after user sets a reminder time
  </action>
  <verify>
    Set task reminder → permission prompt → allow → notification fires at time
  </verify>
  <done>
    Permission flow smooth, contextual, non-annoying.
  </done>
</task>

<task type="auto">
  <name>Implement reminder scheduling</name>
  <files>
    src/lib/notifications/scheduler.ts
    src/sw.ts
  </files>
  <action>
    1. For foreground (tab open):
       - On page load, check upcoming reminders (next 24h)
       - Schedule with setTimeout
       - Show Notification with task title, priority color icon
       - Actions: "Complete" and "Snooze 10min"
    2. For background (service worker):
       - Use service worker periodic sync (if supported)
       - Fallback: check reminders on service worker activate
       - Show notification via self.registration.showNotification
    3. Notification content:
       - Title: task title
       - Body: time + priority
       - Icon: app icon
       - Actions: [{ action: "complete", title: "Done" }, { action: "snooze", title: "+10min" }]
    4. Handle notification click → open app to that task's date
  </action>
  <verify>
    Create task with reminder 1 min from now → notification fires
    Click "Complete" on notification → task marked done
  </verify>
  <done>
    Reminders fire on time, actions work, background delivery functional.
  </done>
</task>

<task type="auto">
  <name>Add reminder UI to task creation/edit</name>
  <files>
    src/components/tasks/QuickAddModal.tsx
    src/components/tasks/ReminderPicker.tsx
  </files>
  <action>
    1. ReminderPicker.tsx:
       - Quick options: "At time", "15min before", "1h before", "1 day before"
       - Custom time picker
       - Small bell icon in QuickAdd "more options"
    2. Show active reminder on TaskCard (small bell icon)
    3. Edit reminder from task detail view
  </action>
  <verify>
    Add task with "15min before" reminder → notification fires 15min before task time
  </verify>
  <done>
    Reminder setting integrated into task creation flow.
  </done>
</task>

## Must-Haves
- [ ] Browser Notification API integration
- [ ] Contextual permission request (not on page load)
- [ ] Reminders fire at correct time
- [ ] Notification actions: Complete / Snooze
- [ ] Works in background (service worker)

## Success Criteria
- [ ] Notification fires within 30s of scheduled time
- [ ] "Complete" action marks task done
- [ ] "Snooze" reschedules by 10 minutes
- [ ] Permission denial handled gracefully (no repeated prompts)

## Dependencies
- Plan 1.2 (service worker setup)
- Plan 3.2 (API routes for task updates)
