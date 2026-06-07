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

  const links = [
    { to: "/dashboard", label: t("nav.overview") },
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
        <nav className="mt-10 space-y-2">
          {links.map((link) => (
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
        </nav>
      </aside>
      <div className="dashboard-shell lg:ps-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.welcomeBack")}</p>
              <h1 className="text-xl font-bold text-slate-950 dark:text-white">{user?.name || t("dashboard.healthTracker")}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <nav className="hidden gap-1 md:flex lg:hidden">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <Button variant="secondary" onClick={handleLogout}>{t("nav.logout")}</Button>
            </div>
          </div>
        </header>
        <main className="px-5 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
