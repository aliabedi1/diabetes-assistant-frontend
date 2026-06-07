import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";

export default function AuthLayout({ children, title, subtitle }) {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/25" />
        <div className="absolute bottom-[-15%] right-[-5%] h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/20" />
      </div>
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[1fr_460px]">
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="inline-flex items-center gap-3 text-lg font-bold">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-600">D</span>
              {t("app.name")}
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
          <h1 className="mt-8 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:mt-12 lg:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            {t("home.description")}
          </p>
        </section>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 text-slate-950 shadow-xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:shadow-none sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
