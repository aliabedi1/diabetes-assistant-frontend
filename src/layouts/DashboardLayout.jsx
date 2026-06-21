import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { useAuthStore } from "../store/auth.store";

function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function IconArchive() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}
function IconChevronLeft({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function IconMenu({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

const PRIMARY_LINKS = [
  { to: "/dashboard", labelKey: "nav.quickView",    icon: <IconHome /> },
  { to: "/journal",   labelKey: "nav.dailyJournal", icon: <IconBook /> },
];
const ARCHIVE_LINKS = [
  { to: "/archive", labelKey: "nav.masterArchive", icon: <IconArchive /> },
  { to: "/glucose", labelKey: "nav.glucoseLogs",   icon: <IconActivity /> },
  { to: "/medical", labelKey: "nav.medicalLogs",   icon: <IconClipboard /> },
];

// Shared nav content for both desktop sidebar and mobile drawer.
// collapsed=false is always used for mobile drawer.
function SidebarNav({ collapsed = false, onNavigate }) {
  const { t } = useTranslation();
  return (
    <>
      {/* Logo */}
      <div className={`flex shrink-0 items-center gap-3 p-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-600 text-base font-black text-white">
          D
        </div>
        {!collapsed && (
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">{t("app.name").split(" ")[0]}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("app.name").split(" ")[1]}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1 space-y-5 px-2">
        <div>
          {!collapsed && (
            <p className="mb-1 px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {t("nav.quickAccess")}
            </p>
          )}
          <div className="space-y-1">
            {PRIMARY_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                title={collapsed ? t(link.labelKey) : undefined}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl py-2.5 text-sm font-semibold transition-colors ${
                    collapsed ? "justify-center px-2" : "gap-3 px-4"
                  } ${
                    isActive
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`
                }
              >
                {link.icon}
                {!collapsed && t(link.labelKey)}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          {!collapsed && (
            <p className="mb-1 px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {t("nav.archiveData")}
            </p>
          )}
          <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800/70">
            {ARCHIVE_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                title={collapsed ? t(link.labelKey) : undefined}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center rounded-xl py-2 text-sm font-semibold transition-colors ${
                    collapsed ? "justify-center px-1" : "gap-3 px-2.5"
                  } ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-sky-600"
                      : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
                  }`
                }
              >
                {link.icon}
                {!collapsed && t(link.labelKey)}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRTL = i18n.dir() === "rtl";
  // Chevron points left by default.
  // LTR: expanded=← (correct), collapsed=→ (rotate-180)
  // RTL: expanded=→ (rotate-180), collapsed=← (no rotation)
  const chevronRotate = isRTL
    ? collapsed ? "" : "rotate-180"
    : collapsed ? "rotate-180" : "";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">

      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile drawer (slides from start side) ─────────────────── */}
      <aside
        className={`fixed inset-y-0 start-0 z-40 flex w-72 flex-col border-e border-slate-200 bg-white/95 backdrop-blur transition-transform duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-800/95 lg:hidden ${
          mobileOpen
            ? "translate-x-0 rtl:translate-x-0"
            : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* ── Desktop sidebar ────────────────────────────────────────── */}
      {/* overflow-hidden clips content so the width transition is the only animation needed */}
      <aside
        className={`dashboard-sidebar fixed inset-y-0 start-0 hidden flex-col overflow-hidden border-r border-slate-200 bg-white/90 backdrop-blur transition-[width] duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-800/90 lg:flex ${
          collapsed ? "w-16" : "w-72"
        }`}
      >
        <SidebarNav collapsed={collapsed} />

        {/* Collapse toggle */}
        <div className="flex shrink-0 justify-center border-t border-slate-200 p-3 dark:border-slate-700">
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={t(collapsed ? "nav.expandSidebar" : "nav.collapseSidebar")}
            className="flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <IconChevronLeft className={`h-4 w-4 transition-transform duration-300 ${chevronRotate}`} />
          </button>
        </div>
      </aside>

      {/* ── Main shell ─────────────────────────────────────────────── */}
      <div
        className={`dashboard-shell transition-[padding] duration-300 ease-in-out ${
          collapsed ? "lg:ps-16" : "lg:ps-72"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-5 lg:px-8">
            {/* Hamburger — mobile only; as first DOM child it sits at the logical start
                (left in LTR, right in RTL) which matches which side the drawer opens from */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t("nav.openMenu")}
              className="flex shrink-0 items-center justify-center rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
            >
              <IconMenu className="h-5 w-5" />
            </button>

            {/* Welcome text — grows to fill space */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.welcomeBack")}</p>
              <h1 className="truncate text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
                {user?.name ? t("dashboard.welcomeUser", { name: user.name }) : t("dashboard.healthTracker")}
              </h1>
            </div>

            {/* Controls */}
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Button variant="secondary" onClick={handleLogout}>{t("nav.logout")}</Button>
            </div>
          </div>
        </header>

        <main className="px-3 py-6 sm:px-5 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
