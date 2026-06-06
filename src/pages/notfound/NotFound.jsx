import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6 dark:bg-slate-900">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">404</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950 dark:text-white">{t("notFound.title")}</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">{t("notFound.description")}</p>
        <Button as={Link} to="/" className="mt-8">{t("notFound.backHome")}</Button>
      </div>
    </main>
  );
}
