import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
      aria-label={t("language.toggle")}
      title={t("language.toggle")}
    >
      {i18n.language === "en" ? "فارسی" : "English"}
    </button>
  );
}
