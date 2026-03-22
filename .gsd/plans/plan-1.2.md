---
phase: 1
plan: 2
wave: 1
gap_closure: false
---

# Plan 1.2: PWA Manifest & Service Worker Setup

## Objective
Make the app installable as a PWA on mobile and desktop. Configure manifest.json, generate placeholder icons, and setup a basic service worker for offline shell caching.

## Context
Load these files for context:
- .gsd/SPEC.md
- src/app/layout.tsx
- next.config.ts

## Tasks

<task type="auto">
  <name>Install next-pwa or serwist</name>
  <files>
    package.json
    next.config.ts
  </files>
  <action>
    1. Install `@serwist/next` and `serwist` (modern next-pwa replacement)
    2. Configure next.config.ts to wrap with serwist plugin
    3. Setup service worker entry at src/sw.ts

    USE: @serwist/next — actively maintained, supports Next.js App Router
    AVOID: next-pwa — abandoned, doesn't support Next.js 14+
  </action>
  <verify>
    npm run build — should generate sw.js in .next/
  </verify>
  <done>
    Service worker generated on build, no build errors.
  </done>
</task>

<task type="auto">
  <name>Create Web App Manifest</name>
  <files>
    public/manifest.json
    src/app/layout.tsx
  </files>
  <action>
    1. Create public/manifest.json with:
       - name: "Planner"
       - short_name: "Planner"
       - theme_color: "#0a0a0a" (dark neon base)
       - background_color: "#0a0a0a"
       - display: "standalone"
       - start_url: "/"
       - icons: reference 192x192 and 512x512 PNGs
    2. Add <link rel="manifest"> to layout.tsx metadata
    3. Add meta tags: theme-color, apple-mobile-web-app-capable
  </action>
  <verify>
    Open DevTools → Application → Manifest — all fields populated, no warnings.
  </verify>
  <done>
    Manifest loads in browser, "Install App" prompt available in Chrome.
  </done>
</task>

<task type="auto">
  <name>Generate Placeholder PWA Icons</name>
  <files>
    public/icons/icon-192x192.png
    public/icons/icon-512x512.png
    public/icons/apple-touch-icon.png
  </files>
  <action>
    1. Create public/icons/ directory
    2. Generate simple placeholder icons (solid dark with "P" letter or gradient)
    3. Sizes: 192x192, 512x512, 180x180 (apple-touch-icon)
    4. Reference them in manifest.json and layout.tsx
  </action>
  <verify>
    Icons load at /icons/icon-192x192.png etc.
  </verify>
  <done>
    All icon sizes present, referenced in manifest, no 404s.
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Verify PWA installability</name>
  <files>-</files>
  <action>
    User opens the app in Chrome, checks:
    1. "Install" button appears in address bar
    2. Lighthouse PWA audit passes core checks
  </action>
  <verify>
    Chrome DevTools → Lighthouse → PWA audit
  </verify>
  <done>
    App is installable, manifest valid, service worker registered.
  </done>
</task>

## Must-Haves
- [ ] manifest.json with correct fields
- [ ] Service worker registers on page load
- [ ] App installable on Chrome/Safari
- [ ] Icons present (192, 512, apple-touch)

## Success Criteria
- [ ] Lighthouse PWA audit: no critical errors
- [ ] "Add to Home Screen" works on mobile
- [ ] Offline shell loads (blank page OK, no crash)
