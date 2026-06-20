import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { useAuthStore } from "../store/auth.store";

export default function DashboardLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const primaryLinks = [
    { to: "/dashboard", label: t("nav.quickView") },
    { to: "/journal", label: t("nav.dailyJournal") },
  ];

  const archiveLinks = [
    { to: "/archive", label: t("nav.masterArchive") },
    { to: "/glucose", label: t("nav.glucoseLogs") },
    { to: "/medical", label: t("nav.medicalLogs") },
  ];

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <aside className="dashboard-sidebar fixed inset-y-0 start-0 hidden w-72 border-r border-slate-200 bg-white/90 p-6 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-600 text-lg font-black text-white">D</div>
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">{t("app.name").split(" ")[0]}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("app.name").split(" ")[1]}</p>
          </div>
        </div>
        <nav className="mt-10 space-y-6">
          <div>
            <p className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{t("nav.quickAccess")}</p>
            <div className="space-y-2">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{t("nav.archiveData")}</p>
            <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/70">
              {archiveLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive ? "bg-slate-900 text-white dark:bg-sky-600" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </aside>
      <div className="dashboard-shell lg:ps-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 sm:px-5 lg:px-8">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.welcomeBack")}</p>
              <h1 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">{user?.name || t("dashboard.healthTracker")}</h1>
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
