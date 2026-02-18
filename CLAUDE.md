# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

No test framework is configured yet.

## Architecture

This is a **Next.js 16** project using the App Router, React 19, TypeScript 5, and Tailwind CSS 4.

### Key Configuration

- **Path alias:** `@/*` maps to the project root (e.g., `import X from '@/app/...'`)
- **ESLint:** v9 flat config format (`eslint.config.mjs`), extends `core-web-vitals` and `typescript`
- **Tailwind CSS v4:** Uses `@import "tailwindcss"` syntax in `app/globals.css` with CSS variables for theming
- **TypeScript:** Strict mode enabled, bundler module resolution

### Styling

- Tailwind utility classes for all styling
- Dark mode via `prefers-color-scheme` media query and Tailwind `dark:` prefix
- Theme colors defined as CSS variables (`--background`, `--foreground`) in `app/globals.css`
- Geist font family loaded via `next/font` with CSS variables `--font-geist-sans` and `--font-geist-mono`

### Conventions

- All components are server components by default (no `'use client'` unless needed)
- Typed props using `Readonly<{ ... }>` pattern
- Next.js `Metadata` API for SEO (exported from layout files)
- `next/image` for optimized images
