# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Admin dashboard for a Manga Reader social platform. Built with React 19 + TypeScript + Vite (SWC) + Material UI 7 + Tailwind CSS 4. Uses Yarn as package manager.

## Commands

```bash
yarn dev            # Start dev server on port 3039
yarn build          # Production build
yarn lint           # ESLint check
yarn lint:fix       # ESLint auto-fix
yarn fm:check       # Prettier check
yarn fm:fix         # Prettier format
yarn fix:all        # Lint + format fix
yarn tsc:dev        # Dev server + TypeScript watch (parallel)
yarn tsc:watch      # TypeScript type-checking in watch mode
```

No test framework is configured.

## Path Aliases

Defined in both `tsconfig.json` and `vite.config.ts`:

| Alias | Path |
|-------|------|
| `@src/*` | `src/*` |
| `@api/*` | `src/api/*` |
| `@pages/*` | `src/pages/*` |
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@hooks/*` | `src/hooks/*` |
| `@utils/*` | `src/utils/*` |
| `@config/*` | `src/config/*` |
| `@types/*` | `src/types/*` |
| `@services/*` | `src/services/*` |

## Architecture

### API Layer
- Axios instance in `src/api/api.ts` with interceptors (`src/api/interceptors.ts`) that inject the auth token on every request
- API endpoint paths centralized in `src/config/api-path.config.ts`
- Services in `src/services/` are static classes that call the Axios instance (e.g., `MangaService.getListManga(query)`)

### Authentication
- JWT stored in localStorage under key `admin_token`, managed by `AdminAuthService`
- `ProtectedRoute` component in `src/routes/components/` guards dashboard routes
- Unauthenticated users redirect to `/sign-in`

### Routing
- Route paths defined as `ERouterConfig` enum in `src/config/router.config.ts`
- Route tree in `src/routes/sections.tsx` — dashboard routes are lazy-loaded with `Suspense`
- Two layouts: `DashboardLayout` (protected) and `AuthLayout` (public)

### Page Pattern
Each feature page (manga, novel, user, category, etc.) follows a consistent pattern:
- Directory-based structure under `src/pages/<feature>/`
- Table views with `*TableHead`, `*TableRow`, `*TableToolbar` components co-located with the page
- Modal components for create/edit/detail actions (e.g., `AddCategoryModal.tsx`, `UserDetailModal.tsx`)
- Local state for pagination, filters, and modal visibility — no global state management

### Styling
- MUI components as the primary UI library with a custom theme (`src/theme/`)
- Tailwind CSS for utility classes alongside MUI
- Iconify with Solar icon set for icons

### Forms & Validation
- React Hook Form + Yup schemas for form handling

### Environment
- `VITE_API_URL` env variable for the API base URL
- Deployed via Firebase and Vercel

## Code Style

- ESLint flat config with: TypeScript strict rules, React Hooks, perfectionist (import sorting), unused-imports removal
- Prettier: single quotes, trailing commas (es5), semicolons, 100 char width, 2-space indent
