# Diabetes Assistant Frontend

Modern React + Tailwind frontend for a Laravel Sanctum API.

## API Routes Used

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/glucose/logs`
- `POST /api/glucose/logs`
- `GET /api/medical/logs`
- `POST /api/medical/logs`

## Setup

```bash
npm install
npm run dev
```

The default API URL is `http://127.0.0.1:8000/api`. Override it with:

```bash
VITE_API_URL=http://your-laravel-app.test/api
```

## Features

- Token-based auth with persistent local storage.
- Protected dashboard routes.
- High-efficiency dashboard with:
  - Interactive glucose trend visualization (`3h`, `12h`, `24h`, `7d` filters).
  - Quick Add module for rapid glucose + short clinical note entry.
  - Contextual merged history feed (glucose logs + medical notes).
  - Health Snapshot (7-day average, highs/lows, status rating).
  - Compact profile card and responsive mobile-first layout.
- Glucose log list and create form.
- Medical log list and create form.
- Responsive Tailwind UI.
