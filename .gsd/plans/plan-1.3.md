---
phase: 1
plan: 3
wave: 1
gap_closure: false
---

# Plan 1.3: Base Layout, Navigation & Theme

## Objective
Establish the visual foundation: dark neon / glassmorphic theme, global layout shell with bottom navigation (mobile-first), and Framer Motion setup. All future UI builds on this.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/app/layout.tsx
- src/app/globals.css

## Tasks

<task type="auto">
  <name>Install Framer Motion</name>
  <files>
    package.json
  </files>
  <action>
    npm install framer-motion
  </action>
  <verify>
    import { motion } from "framer-motion" — no TS errors
  </verify>
  <done>
    framer-motion in dependencies, importable.
  </done>
</task>

<task type="auto">
  <name>Define Dark Neon Theme & CSS Variables</name>
  <files>
    src/app/globals.css
    tailwind.config.ts (if needed for custom colors)
  </files>
  <action>
    1. Define CSS custom properties in globals.css:
       --bg-primary: #0a0a0f (deep dark)
       --bg-glass: rgba(255,255,255,0.05) (glassmorphic surface)
       --border-glass: rgba(255,255,255,0.1)
       --accent-neon: #7c5cfc (purple neon)
       --accent-cyan: #00e5ff
       --text-primary: #f0f0f0
       --text-secondary: #888
    2. Setup glassmorphic utility classes:
       .glass { backdrop-filter: blur(12px); background: var(--bg-glass); border: 1px solid var(--border-glass); }
    3. Set body background to dark gradient
    4. Configure font: Inter or system-ui

    AVOID: light mode for now — dark only per spec
  </action>
  <verify>
    Page renders with dark background, no white flash on load.
  </verify>
  <done>
    Dark neon palette applied globally, glass utility class available.
  </done>
</task>

<task type="auto">
  <name>Create App Shell Layout</name>
  <files>
    src/app/layout.tsx
    src/components/layout/AppShell.tsx
    src/components/layout/BottomNav.tsx
    src/components/layout/Header.tsx
  </files>
  <action>
    1. Create src/components/layout/ directory
    2. AppShell.tsx: wrapper with flex column, min-h-screen, dark bg
    3. Header.tsx: minimal top bar — date display, settings icon
    4. BottomNav.tsx: fixed bottom navigation with 3-4 tabs:
       - Today (calendar icon)
       - Tasks (checklist icon)
       - Quick Add (+ button, prominent center)
       - Settings (gear icon)
    5. Use Framer Motion for tab switch animations (layoutId)
    6. Update layout.tsx to use AppShell as wrapper

    USE: Lucide React for icons (lightweight, tree-shakeable)
    AVOID: Heavy icon libraries like FontAwesome
  </action>
  <verify>
    npm run dev — shell renders with header + bottom nav
    Navigation tabs are tappable, centered + button visible
  </verify>
  <done>
    App shell with header + bottom nav renders, mobile-friendly, glassmorphic styling applied.
  </done>
</task>

<task type="auto">
  <name>Create placeholder pages for each tab</name>
  <files>
    src/app/page.tsx (Today)
    src/app/tasks/page.tsx
    src/app/settings/page.tsx
  </files>
  <action>
    1. Clean up default page.tsx — simple "Today" heading
    2. Create src/app/tasks/page.tsx — "Tasks" placeholder
    3. Create src/app/settings/page.tsx — "Settings" placeholder
    4. Each page: just a centered title with glass card styling
  </action>
  <verify>
    All routes load: /, /tasks, /settings
    Bottom nav highlights active tab
  </verify>
  <done>
    3 routes working, navigation between them smooth.
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Visual review of app shell</name>
  <files>-</files>
  <action>
    User reviews on mobile viewport (375px):
    1. Dark neon theme looks good
    2. Bottom nav is thumb-friendly
    3. Glass effect visible on cards
    4. No layout overflow / scroll issues
  </action>
  <verify>
    Visual inspection in browser, mobile device toolbar
  </verify>
  <done>
    User approves visual direction.
  </done>
</task>

## Must-Haves
- [ ] Dark neon color scheme applied globally
- [ ] Glassmorphic card style available
- [ ] Bottom navigation with 3+ tabs
- [ ] Framer Motion installed and working
- [ ] Mobile-first responsive layout

## Success Criteria
- [ ] App shell renders on mobile (375px) without overflow
- [ ] Tab navigation works between pages
- [ ] Glass blur effect visible on surfaces
- [ ] No white flash on initial load

## Dependencies
- Plan 1.1 (scaffolding complete)
- npm install: framer-motion, lucide-react
