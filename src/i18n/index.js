import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fa from "./fa.json";

function applyLanguageAttributes(language) {
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  document.documentElement.lang = language;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

applyLanguageAttributes(i18n.language || "en");
i18n.on("languageChanged", applyLanguageAttributes);

export default i18n;
