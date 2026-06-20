# MEMORY

Important project context and conventions for future work.

## Stack & Runtime
- React 19 + Vite 8 + Tailwind CSS v4.
- State: Zustand v5 (`src/store/*`).
- i18n: `react-i18next` with English/Persian in `src/i18n/*`.
- API base URL defaults to `http://127.0.0.1:8000/api` and can be overridden by `VITE_API_URL`.
- Date picker: `react-multi-date-picker` with `react-date-object` for Jalali calendar support.

## File Organization

```
src/
  api/          — LEGACY: thin re-exports of src/services/*. Do NOT add new files here.
  services/     — Canonical service layer. All pages import from here.
    api.js      — Axios instance with Bearer token + 401 auto-redirect.
    auth.service.js
    glucose.service.js
    medical.service.js
  store/
    auth.store.js   — login/register/logout/loadUser + token + user.
    theme.store.js  — dark mode toggle (class-based).
  pages/
    auth/       — Login.jsx, Register.jsx
    dashboard/  — Dashboard.jsx (redesigned: chart, quick-add, health snapshot)
    glucose/    — GlucoseLogs.jsx
    medical/    — MedicalLogs.jsx
    archive/    — DailyJournal.jsx, MasterArchive.jsx
    Home.jsx, notfound/NotFound.jsx
  components/ui/
    Alert.jsx       — type: "error" | "success" | "info". Renders null when children empty.
    Button.jsx
    Card.jsx        — rounded-3xl glass card.
    DateTimeField.jsx — Locale-aware date+time picker (Jalali in Persian, Gregorian otherwise).
    Input.jsx       — Accepts error prop (string or string[]); renders field-level messages.
    StatCard.jsx    — Unused decorative stat card. Do not depend on it.
  layouts/
    DashboardLayout.jsx — Sidebar + sticky header + Outlet.
    AuthLayout.jsx
  routes/
    index.jsx         — AppRoutes (public + protected).
    ProtectedRoutes.jsx
  hooks/
    useAuth.js        — Thin wrapper around useAuthStore. Mostly unused; prefer direct store import.
  utils/
    apiErrors.js      — getFieldErrors(), getStatusMessage().
    data.js           — unwrapCollection(), formatDate().
    token.js          — getToken/setToken/removeToken (localStorage).
  i18n/
    en.json, fa.json  — All visible text must be localized here.
    index.js          — Sets RTL direction on languageChanged.
```

## Theme & Language Behavior
- Dark mode is class-based and configured in `src/index.css` with:
  - `@custom-variant dark (&:where(.dark, .dark *));`
- Theme state + toggling live in `src/store/theme.store.js`.
- Language direction (`rtl`/`ltr`) is centralized in `src/i18n/index.js` via `languageChanged` listener.

## UI Decisions
- App is now light-first by default, with dark mode parity.
- Inputs and textarea styling are theme-aware for strong text contrast.
- Home register CTA uses high-contrast colors in both themes.

## Reusable Patterns

### Loading skeleton
```jsx
{loading && (
  <>
    <div className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-700/60" />
    <div className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-700/60" />
    <div className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-700/60" />
  </>
)}
```

### Form error/success pattern
```jsx
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [fieldErrors, setFieldErrors] = useState({});

// In catch:
if (requestError?.response?.status === 422) {
  setFieldErrors(getFieldErrors(requestError));
} else {
  setError(getStatusMessage(requestError, t("...")));
}

// In JSX:
<Alert>{error}</Alert>
<Alert type="success">{success}</Alert>
<Input error={fieldErrors.field_name} ... />
```

### Field update handler
```jsx
function updateField(event) {
  const { name, value } = event.target;
  setForm((current) => ({ ...current, [name]: value }));
  setFieldErrors((current) => ({ ...current, [name]: undefined }));
}
```

### Unwrapping API responses
```js
const items = unwrapCollection(response.data); // handles Laravel paginated or plain array
```

### Page layout
- Two-column grid: `<div className="grid gap-4 sm:gap-6 xl:grid-cols-[420px_1fr]">`
- Sidebar panels with `xl:sticky xl:top-24`

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

## Medical Log Field Names (Critical)
The medical log API returns `type` and `note` (NOT `title` or `description`).
- `log.type` — category/kind of medical log
- `log.note` — text content
- `log.amount` — numeric value
- `log.logged_at` or `log.created_at` — timestamp

## Known Issues / Partially Implemented Features

1. **DailyJournal.jsx and MasterArchive.jsx** — All visible text is hardcoded English with no i18n. Must be localized.
2. **GlucoseLogs.jsx and MedicalLogs.jsx** — Use native `<input type="datetime-local">` instead of `<DateTimeField>`. Violates the Locale-Aware DateTime Rule. Should be replaced.
3. **MasterArchive.jsx** — References `log.title` and `log.description` from medical logs, but the API returns `log.type` and `log.note`. This is a data field mismatch causing empty content.
4. **Edit/Delete buttons in DailyJournal.jsx** — Rendered but not functional (no handlers, no API calls).
5. **formatDate() in utils/data.js** — Hardcodes `"en"` locale. Does not adapt to Persian. Use locale-aware formatting when building new date displays.
6. **DashboardLayout.jsx** — Navigation labels ("Quick-View", "Daily Journal", "Quick Access", "Archive / Data", "Master Archive") are hardcoded in English and not i18n'd.
7. **StatCard component** — Exists but is unused anywhere in the app.
8. **useAuth hook** — Thin wrapper, essentially unused. Pages import directly from `useAuthStore`.

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


## Locale-Aware DateTime Rule (Mandatory)
- Quick Add `logged_at` is optional (`nullable datetime`) and defaults to null when not set.
- Use `<DateTimeField>` component (`src/components/ui/DateTimeField.jsx`) for ALL datetime inputs.
  - Do NOT use native `<input type="datetime-local">` — it breaks Persian/Jalali support.
- Datetime picker must support date + hour/minute only (no seconds UI).
- When language is Persian (`fa`):
  - Use Jalali calendar.
  - Ensure full RTL compatibility (direction, alignment, spacing, icon/input placement).
  - Localize month/day labels to Persian.
- For non-Persian languages: use Gregorian calendar and standard locale formatting.
- Datetime picker must follow current theme (light/dark) and input design system.
- Include `logged_at` in payload only when user provides it.
- All future datetime fields must follow this exact rule.
