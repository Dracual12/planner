---
phase: 1
plan: 1
wave: 1
gap_closure: false
---

# Plan 1.1: Scaffolding with `create-next-app`

## Objective
Bootstrap the Next.js project with TypeScript, Tailwind CSS, ESLint, and App Router. This is the foundation everything else builds on.

## Context
Load these files for context:
- .gsd/SPEC.md
- package.json
- src/app/layout.tsx

## Tasks

<task type="auto">
  <name>Initialize Next.js project</name>
  <files>
    package.json
    src/app/layout.tsx
    src/app/page.tsx
    src/app/globals.css
    tsconfig.json
    next.config.ts
    tailwind.config.ts
    postcss.config.mjs
  </files>
  <action>
    Run `npx create-next-app@latest` with options:
    - TypeScript: Yes
    - Tailwind CSS: Yes
    - ESLint: Yes
    - App Router: Yes
    - Src directory: Yes
    - Import alias: @/*
  </action>
  <verify>
    npm run dev -- builds without errors
    npm run build -- compiles successfully
  </verify>
  <done>
    Project starts on localhost:3000, TypeScript + Tailwind working.
  </done>
</task>

## Must-Haves
- [x] Next.js 16 running with App Router
- [x] TypeScript configured
- [x] Tailwind CSS operational
- [x] ESLint configured

## Success Criteria
- [x] `npm run dev` starts without errors
- [x] `npm run build` compiles successfully

## Status: COMPLETE
