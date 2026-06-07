import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/20" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-400/15" />
      </div>
      <section className="relative mx-auto max-w-7xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-lg font-black">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-600">D</span>
            {t("app.name")}
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <Link to="/login" className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10">{t("nav.login")}</Link>
            <Link to="/register" className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300">{t("nav.register") || "Register"}</Link>
          </div>
        </nav>
        <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-white/10 dark:bg-white/10 dark:text-sky-100">
              {t("app.tagline")}
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              {t("home.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t("home.description")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button as={Link} to="/register">{t("home.getStarted") || "Get started"}</Button>
              <Button as={Link} to="/login" variant="secondary">{t("home.openDashboard")}</Button>
            </div>
          </div>
          <Card className="bg-white/95 text-slate-950 shadow-lg shadow-slate-200/60 dark:bg-slate-800/95 dark:text-white dark:shadow-none">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("home.today")}</p>
                <h2 className="text-2xl font-black">{t("home.healthSummary")}</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">{t("home.synced")}</span>
            </div>
            <div className="space-y-4">
              {[
                [t("home.glucose"), "112 mg/dL", t("home.stable")],
                [t("home.medicalLogs"), `3 ${t("home.notes")}`, t("home.thisWeek")],
                [t("home.lastCheckIn"), "8:30 AM", t("home.morningReading")],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-700/50">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
