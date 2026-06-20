# Graph Report - .  (2026-06-20)

## Corpus Check
- Corpus is ~10,786 words - fits in a single context window. You may not need a graph.

## Summary
- 155 nodes · 286 edges · 22 communities (13 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Glucose & Medical Data|Glucose & Medical Data]]
- [[_COMMUNITY_Project Dependencies|Project Dependencies]]
- [[_COMMUNITY_Page Components & Routing|Page Components & Routing]]
- [[_COMMUNITY_Auth & Feature Pages|Auth & Feature Pages]]
- [[_COMMUNITY_Dashboard & API Rules|Dashboard & API Rules]]
- [[_COMMUNITY_Axios & Auth Services|Axios & Auth Services]]
- [[_COMMUNITY_UI Toggles & Auth Layout|UI Toggles & Auth Layout]]
- [[_COMMUNITY_Dev Tools & ESLint|Dev Tools & ESLint]]
- [[_COMMUNITY_Auth Guards & README|Auth Guards & README]]
- [[_COMMUNITY_App Entry & Assets|App Entry & Assets]]
- [[_COMMUNITY_Dark Mode & Theme|Dark Mode & Theme]]
- [[_COMMUNITY_Hero Image|Hero Image]]
- [[_COMMUNITY_React Logo|React Logo]]
- [[_COMMUNITY_Rate Limit Handling|Rate Limit Handling]]
- [[_COMMUNITY_Server Error Handling|Server Error Handling]]
- [[_COMMUNITY_Skeleton Loading|Skeleton Loading]]
- [[_COMMUNITY_Icons Sprite|Icons Sprite]]
- [[_COMMUNITY_Create Glucose Log|Create Glucose Log]]
- [[_COMMUNITY_Fetch Glucose Logs|Fetch Glucose Logs]]

## God Nodes (most connected - your core abstractions)
1. `useAuthStore` - 13 edges
2. `Button()` - 8 edges
3. `Card()` - 8 edges
4. `formatDate()` - 7 edges
5. `Alert()` - 6 edges
6. `Input()` - 6 edges
7. `Dashboard()` - 6 edges
8. `unwrapCollection()` - 6 edges
9. `scripts` - 5 edges
10. `ThemeToggle()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Token-based Auth with Persistent Local Storage` --semantically_similar_to--> `Auth API Routes (/api/auth/*)`  [INFERRED] [semantically similar]
  README.md → MEMORY.md
- `Protected Dashboard Routes` --semantically_similar_to--> `401/403 Auth Error Alert Rule`  [INFERRED] [semantically similar]
  README.md → MEMORY.md
- `Vite Logo SVG (Purple Lightning Bolt with Parentheses)` --semantically_similar_to--> `App Favicon SVG (Purple Lightning Bolt Icon)`  [INFERRED] [semantically similar]
  src/assets/vite.svg → public/favicon.svg
- `HTML Entry Point (index.html)` --references--> `App Favicon SVG (Purple Lightning Bolt Icon)`  [EXTRACTED]
  index.html → public/favicon.svg
- `useAuth()` --calls--> `useAuthStore`  [EXTRACTED]
  src/hooks/useAuth.js → src/store/auth.store.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard Feature Modules** — memory_dashboard, memory_glucose_chart, memory_quick_add, memory_merged_history, memory_health_snapshot [EXTRACTED 1.00]
- **Global API Error Handling Rules** — memory_422_handling, memory_429_handling, memory_401_403_handling, memory_500_handling [EXTRACTED 1.00]
- **Localization and RTL System** — memory_i18n_react_i18next, memory_language_direction, memory_persian_localization, memory_datetime_rule [EXTRACTED 1.00]

## Communities (22 total, 9 thin omitted)

### Community 0 - "Glucose & Medical Data"
Cohesion: 0.15
Nodes (15): DailyJournal(), toInputDate(), ENTITY_OPTIONS, Dashboard(), FILTER_OPTIONS, getChartPath(), getStatusFromAverage(), createGlucoseLog() (+7 more)

### Community 1 - "Project Dependencies"
Cohesion: 0.09
Nodes (21): dependencies, axios, @headlessui/react, i18next, react, react-dom, react-i18next, react-multi-date-picker (+13 more)

### Community 2 - "Page Components & Routing"
Cohesion: 0.15
Nodes (12): App(), MasterArchive(), Login(), Register(), GlucoseLogs(), useAuth(), DashboardLayout(), MedicalLogs() (+4 more)

### Community 3 - "Auth & Feature Pages"
Cohesion: 0.42
Nodes (7): AuthLayout(), Alert(), Button(), variants, Input(), getFieldErrors(), getStatusMessage()

### Community 4 - "Dashboard & API Rules"
Cohesion: 0.16
Nodes (15): 422 Validation Error Handling Rule, API Base URL (VITE_API_URL env var), Dashboard Page (src/pages/dashboard/Dashboard.jsx), Locale-Aware DateTime Picker Rule (Jalali/Gregorian), Glucose API Routes (/api/glucose/logs), Interactive Glucose Chart with Time Filters, Health Snapshot (Trend Rating, Counters), i18n: react-i18next with English/Persian (+7 more)

### Community 5 - "Axios & Auth Services"
Cohesion: 0.24
Nodes (5): api, login(), logout(), me(), register()

### Community 6 - "UI Toggles & Auth Layout"
Cohesion: 0.42
Nodes (4): LanguageToggle(), ThemeToggle(), Home(), useThemeStore

### Community 7 - "Dev Tools & ESLint"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+2 more)

### Community 8 - "Auth Guards & README"
Cohesion: 0.33
Nodes (6): 401/403 Auth Error Alert Rule, Auth API Routes (/api/auth/*), Diabetes Assistant Frontend Project, Laravel Sanctum API Backend, Protected Dashboard Routes, Token-based Auth with Persistent Local Storage

### Community 9 - "App Entry & Assets"
Cohesion: 0.50
Nodes (4): Vite Logo SVG (Purple Lightning Bolt with Parentheses), HTML Entry Point (index.html), Main JSX Entry Script (src/main.jsx), App Favicon SVG (Purple Lightning Bolt Icon)

## Knowledge Gaps
- **45 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tools & ESLint` to `Project Dependencies`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `useAuthStore` connect `Page Components & Routing` to `Glucose & Medical Data`, `Auth & Feature Pages`, `Axios & Auth Services`, `UI Toggles & Auth Layout`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Glucose & Medical Data` be split into smaller, more focused modules?**
  _Cohesion score 0.14814814814814814 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Page Components & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._