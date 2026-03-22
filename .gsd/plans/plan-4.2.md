---
phase: 4
plan: 2
wave: 3
gap_closure: false
---

# Plan 4.2: Visual Polish — Gradients, Animations & Performance

## Objective
Final visual polish pass: refine glassmorphic effects, add micro-animations, optimize performance for <1s mobile load. Make it feel premium.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/app/globals.css
- src/components/ (all components)

## Tasks

<task type="auto">
  <name>Enhance glassmorphic design system</name>
  <files>
    src/app/globals.css
    src/components/ui/GlassCard.tsx
  </files>
  <action>
    1. Refine glass effects:
       - Multiple glass levels: glass-subtle, glass-medium, glass-heavy
       - Subtle gradient borders (animated on hover)
       - Inner glow on active elements
    2. Background: animated gradient mesh (subtle, not distracting)
       - Dark purple → deep blue → black gradient
       - Slow CSS animation (60s cycle)
    3. GlassCard.tsx: reusable component with glass levels
    4. Neon accent refinement:
       - Glow effect on primary actions (box-shadow with accent color)
       - Pulse animation on notifications/badges
  </action>
  <verify>
    Visual review — glass effects layered correctly, no performance issues
  </verify>
  <done>
    Glass effects polished, consistent across all surfaces.
  </done>
</task>

<task type="auto">
  <name>Add micro-animations throughout</name>
  <files>
    src/lib/animations.ts
    src/components/tasks/TaskCard.tsx
    src/components/calendar/DayCell.tsx
    src/components/layout/BottomNav.tsx
  </files>
  <action>
    1. Create shared Framer Motion variants in animations.ts:
       - fadeIn, slideUp, scaleIn, staggerChildren
    2. TaskCard animations:
       - Completion: checkbox scales + confetti particles (tiny)
       - Delete: swipe out + fade
       - Reorder: layout animation (smooth position swap)
    3. Calendar:
       - Day selection: spring scale + color transition
       - Date change: content crossfade
    4. Navigation:
       - Tab switch: underline slides with spring physics
       - Page transitions: fade + slight slide
    5. QuickAdd:
       - Modal entrance: spring from bottom
       - Success: task card "flies" to list position

    AVOID: animations longer than 300ms — keep it snappy
    AVOID: animations on scroll — performance killer
  </action>
  <verify>
    Navigate through app — all transitions smooth, no jank
    60fps on mobile device
  </verify>
  <done>
    Every interaction has subtle, fast animation. Feels alive but not slow.
  </done>
</task>

<task type="auto">
  <name>Performance optimization</name>
  <files>
    next.config.ts
    src/app/layout.tsx
  </files>
  <action>
    1. Font optimization:
       - Use next/font with Inter (variable weight)
       - Preload, swap display
    2. Image optimization:
       - Use next/image for any icons/assets
       - WebP format where possible
    3. Code splitting:
       - Dynamic import for QuickAddModal (not needed on initial load)
       - Dynamic import for Settings page
       - Lazy load heavy components (DnD, ReminderPicker)
    4. CSS optimization:
       - Purge unused Tailwind classes (automatic with v4)
       - Minimize backdrop-filter usage on low-end devices
       - Reduce motion media query respect
    5. Bundle analysis:
       - npm install @next/bundle-analyzer
       - Check total JS bundle < 150KB gzipped
    6. Lighthouse targets:
       - Performance: >90
       - Accessibility: >90
       - Best Practices: >90
       - PWA: pass
  </action>
  <verify>
    Lighthouse audit on mobile simulation
    npm run build — check bundle sizes
    First load JS < 150KB
  </verify>
  <done>
    Lighthouse >90 all categories, <1s FCP on 4G mobile simulation.
  </done>
</task>

<task type="auto">
  <name>Responsive polish & touch optimization</name>
  <files>
    src/app/globals.css
    src/components/ (various)
  </files>
  <action>
    1. Touch targets: minimum 44x44px for all interactive elements
    2. Safe areas: respect notch/home indicator (env(safe-area-inset-*))
    3. Tablet layout: wider cards, 2-column task list on iPad
    4. Desktop: max-width container, keyboard navigation hints
    5. Haptic feedback hints (vibrate API on task complete, if supported)
    6. Pull-to-refresh on task list (native feel)
    7. Overscroll behavior: contain (no bounce to browser chrome)
  </action>
  <verify>
    Test on iPhone viewport (375px), iPad (768px), Desktop (1440px)
    No overflow, no tiny tap targets
  </verify>
  <done>
    Responsive across all breakpoints, touch-friendly, feels native.
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Final visual and UX review</name>
  <files>-</files>
  <action>
    User reviews complete app:
    1. Visual: dark neon theme polished, glass effects good
    2. Animations: smooth, not overdone, 60fps
    3. Mobile: feels like a native app
    4. Performance: loads fast, no jank
    5. PWA: install and use from home screen
  </action>
  <verify>
    User testing on real device
  </verify>
  <done>
    User approves for launch.
  </done>
</task>

## Must-Haves
- [ ] Glassmorphic design polished and consistent
- [ ] Micro-animations on all interactions
- [ ] Lighthouse Performance >90
- [ ] First load <1s on mobile 4G
- [ ] Responsive: mobile, tablet, desktop
- [ ] prefers-reduced-motion respected

## Success Criteria
- [ ] Lighthouse: >90 across all categories
- [ ] Bundle size: <150KB gzipped JS
- [ ] FCP: <1s on 4G simulation
- [ ] 60fps animations on mid-range mobile
- [ ] User approves visual direction

## Dependencies
- All previous plans complete
- This is the final polish pass
