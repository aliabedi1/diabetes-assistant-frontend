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

## Global API Error Handling Rules (Mandatory)
- Always read `MEMORY.md` before implementing any feature.
- For `422 Validation Error` responses:
  - Never show validation errors in global alerts/toasts/banners/summary blocks.
  - Parse Laravel `errors` object and map messages to corresponding inputs.
  - Render all messages under each related input (field may have multiple messages).
  - Show error styling only on inputs with validation errors.
- For `429` responses:
  - Show user-friendly rate limit feedback using app design system.
- For `401` and `403` responses:
  - Show top-middle alert notification with theme-consistent styling.
- For `500` responses:
  - Page load failures => page-level error state.
  - Form submissions => form-level error state.
  - Modal actions => modal-level error state.
  - Never fail silently.

## Global Loading Rules (Mandatory)
- On all index/list pages:
  - While loading, show skeleton loaders only.
  - Do not show empty state text/tables before loading completes.
  - Replace skeletons with real content after successful response.

## Persian Localization & RTL Rules (Mandatory)
- Persian localization must be complete on all pages/components.
- No hardcoded English visible text is allowed when language is Persian.
- Localize all card titles, section titles, labels, placeholders, buttons, tooltips, validation messages, helper texts, and dynamic status messages.
- Use consistent Persian terminology for repeated concepts across the app.
- Use professional, natural Persian wording (not literal machine translation).
- For every new page/component:
  - Add localization keys for all visible texts.
  - Add Persian translations.
  - Verify RTL compatibility (direction, alignment, spacing, icon positioning, and input layouts).
  - Verify form labels/placeholders/error states render correctly in Persian.

