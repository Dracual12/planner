---
phase: 2
plan: 1
wave: 2
gap_closure: false
---

# Plan 2.1: Infinite Scroll Day Strip Calendar

## Objective
Build the core calendar component — a horizontally scrollable, infinite day strip showing dates. Tapping a day shows that day's tasks. This is the primary navigation surface of the app.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/components/layout/AppShell.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Install date utility library</name>
  <files>
    package.json
  </files>
  <action>
    npm install date-fns

    USE: date-fns — tree-shakeable, no global mutation
    AVOID: moment.js — huge bundle, deprecated
  </action>
  <verify>
    import { format } from "date-fns" — no errors
  </verify>
  <done>
    date-fns installed and importable.
  </done>
</task>

<task type="auto">
  <name>Create DayStrip component</name>
  <files>
    src/components/calendar/DayStrip.tsx
    src/components/calendar/DayCell.tsx
  </files>
  <action>
    1. DayStrip.tsx: horizontal scrollable container
       - Renders ~60 days (30 past + 30 future) initially
       - Each day = DayCell component
       - Scroll snaps to center
       - Selected day highlighted with neon accent
       - Today marked distinctly
    2. DayCell.tsx: single day pill
       - Shows: weekday abbreviation (Mon), date number (23), month if first of month
       - States: default, today, selected, has-tasks (dot indicator)
       - Tap to select
    3. Infinite scroll: detect scroll near edges → prepend/append 30 more days
       - Use IntersectionObserver on sentinel elements at edges
       - Maintain scroll position when prepending

    USE: CSS scroll-snap for smooth experience
    AVOID: Virtual scroll libraries — overkill for date cells
  </action>
  <verify>
    npm run dev — scroll left/right through dates
    Dates extend infinitely in both directions
  </verify>
  <done>
    Day strip scrolls smoothly, infinite in both directions, today highlighted, tap selects day.
  </done>
</task>

<task type="auto">
  <name>Create WeekStrip alternate view</name>
  <files>
    src/components/calendar/WeekStrip.tsx
    src/components/calendar/CalendarToggle.tsx
  </files>
  <action>
    1. WeekStrip.tsx: shows full week (Mon-Sun) in wider cells
       - Vertical swipe/button to switch weeks
       - Same selection behavior as DayStrip
    2. CalendarToggle.tsx: small toggle to switch Day ↔ Week view
       - Sits in the header area
       - Animated transition between views (Framer Motion)
    3. Store view preference in localStorage
  </action>
  <verify>
    Toggle between Day and Week views — both render correctly
  </verify>
  <done>
    Both views working, toggle persists preference.
  </done>
</task>

<task type="auto">
  <name>Integrate calendar into Today page</name>
  <files>
    src/app/page.tsx
  </files>
  <action>
    1. Place DayStrip/WeekStrip at top of Today page
    2. Below calendar: placeholder area for "Selected Day's Tasks"
    3. Show selected date as heading: "Monday, March 23"
    4. Animate date change with Framer Motion (fade/slide)
  </action>
  <verify>
    Select different days — heading updates, task area shows selected date
  </verify>
  <done>
    Calendar integrated, date selection flows to task area below.
  </done>
</task>

## Must-Haves
- [ ] Horizontal infinite scroll day picker
- [ ] Today highlighted
- [ ] Day/Week view toggle
- [ ] Selected day updates task view area
- [ ] Smooth scroll performance on mobile

## Success Criteria
- [ ] Can scroll 6+ months in either direction without lag
- [ ] 60fps scroll on mobile (no jank)
- [ ] View toggle persists across reload

## Dependencies
- Plan 1.3 (layout shell + Framer Motion)
