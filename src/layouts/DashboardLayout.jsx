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

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [collapsed, setCollapsed] = useState(false);

  const isRTL = i18n.dir() === "rtl";
  // Chevron points left by default; rotate to point right when collapsing in LTR, expanding in RTL
  const chevronRotate = isRTL
    ? collapsed ? "" : "rotate-180"
    : collapsed ? "rotate-180" : "";

  const primaryLinks = [
    { to: "/dashboard", label: t("nav.quickView"), icon: <IconHome /> },
    { to: "/journal",   label: t("nav.dailyJournal"), icon: <IconBook /> },
  ];

  const archiveLinks = [
    { to: "/archive", label: t("nav.masterArchive"), icon: <IconArchive /> },
    { to: "/glucose", label: t("nav.glucoseLogs"),   icon: <IconActivity /> },
    { to: "/medical", label: t("nav.medicalLogs"),   icon: <IconClipboard /> },
  ];

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar fixed inset-y-0 start-0 hidden flex-col overflow-hidden border-r border-slate-200 bg-white/90 backdrop-blur transition-[width] duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-800/90 lg:flex ${
          collapsed ? "w-16" : "w-72"
        }`}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3 p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-600 text-base font-black text-white">D</div>
          <div
            className={`overflow-hidden transition-[opacity,max-width] duration-200 ${
              collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 delay-100"
            }`}
          >
            <p className="whitespace-nowrap text-lg font-black text-slate-950 dark:text-white">{t("app.name").split(" ")[0]}</p>
            <p className="whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{t("app.name").split(" ")[1]}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-4 flex-1 space-y-5 px-2 overflow-hidden">
          {/* Primary */}
          <div>
            <div
              className={`overflow-hidden transition-[opacity,max-height] duration-200 ${
                collapsed ? "max-h-0 opacity-0" : "max-h-10 opacity-100 delay-100"
              }`}
            >
              <p className="mb-1 px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {t("nav.quickAccess")}
              </p>
            </div>
            <div className="space-y-1">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  title={collapsed ? link.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`
                  }
                >
                  {link.icon}
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-200 ${
                      collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 delay-100"
                    }`}
                  >
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Archive */}
          <div>
            <div
              className={`overflow-hidden transition-[opacity,max-height] duration-200 ${
                collapsed ? "max-h-0 opacity-0" : "max-h-10 opacity-100 delay-100"
              }`}
            >
              <p className="mb-1 px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {t("nav.archiveData")}
              </p>
            </div>
            <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800/70">
              {archiveLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  title={collapsed ? link.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-sky-600"
                        : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
                    }`
                  }
                >
                  {link.icon}
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-200 ${
                      collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 delay-100"
                    }`}
                  >
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Collapse toggle */}
        <div className="shrink-0 flex justify-center p-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={t(collapsed ? "nav.expandSidebar" : "nav.collapseSidebar")}
            className="flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <IconChevronLeft className={`h-4 w-4 transition-transform duration-300 ${chevronRotate}`} />
          </button>
        </div>
      </aside>

      {/* Main shell */}
      <div className={`dashboard-shell transition-[padding] duration-300 ease-in-out ${collapsed ? "lg:ps-16" : "lg:ps-72"}`}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 sm:px-5 lg:px-8">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.welcomeBack")}</p>
              <h1 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
                {user?.name ? t("dashboard.welcomeUser", { name: user.name }) : t("dashboard.healthTracker")}
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <nav className="hidden gap-1 md:flex lg:hidden">
                {[...primaryLinks, ...archiveLinks].map((link) => (
                  <NavLink key={link.to} to={link.to} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <Button variant="secondary" onClick={handleLogout}>{t("nav.logout")}</Button>
            </div>
          </div>
          <div className="border-t border-slate-200 px-3 py-2 dark:border-slate-700 md:hidden">
            <nav className="flex gap-2 overflow-x-auto pb-1">
              {[...primaryLinks, ...archiveLinks].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      isActive ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="px-3 py-6 sm:px-5 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
