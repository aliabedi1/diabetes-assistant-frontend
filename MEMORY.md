# MEMORY

Important project context and conventions for future work.

## Stack & Runtime
- Frontend: React + Vite + Tailwind CSS v4.
- State: Zustand (`src/store/*`).
- i18n: `react-i18next` with English/Persian in `src/i18n/*`.
- API base URL defaults to `http://127.0.0.1:8000/api` and can be overridden by `VITE_API_URL`.

## Theme & Language Behavior
- Dark mode is class-based and configured in `src/index.css` with:
  - `@custom-variant dark (&:where(.dark, .dark *));`
- Theme state + toggling live in `src/store/theme.store.js`.
- Language direction (`rtl`/`ltr`) is centralized in `src/i18n/index.js` via `languageChanged` listener.

## UI Decisions
- App is now light-first by default, with dark mode parity.
- Inputs and textarea styling are theme-aware for strong text contrast.
- Home register CTA uses high-contrast colors in both themes.

## Dashboard (Redesigned)
- File: `src/pages/dashboard/Dashboard.jsx`
- Includes:
  - Interactive glucose chart with filters (`3h`, `12h`, `24h`, `7d`).
  - Quick Add for glucose and short clinical note.
  - Contextual merged history (glucose + medical logs).
  - Health Snapshot with simple trend rating and high/low counters.
  - Compact profile card.

## API Routes Used
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- Glucose:
  - `GET /api/glucose/logs`
  - `POST /api/glucose/logs`
- Medical:
  - `GET /api/medical/logs`
  - `POST /api/medical/logs`

## Notes
- `rg` is unavailable in this environment; use `grep`/`find` when searching.
- Keep text labels resilient with fallbacks where missing translations may occur.
