import i18n from "../i18n";

export function unwrapCollection(payload) {
  const value = payload?.data ?? payload;

  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

export function nowDateTimeString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

export function formatDate(value) {
  if (!value) {
    return i18n.t("common.notSet");
  }

  const locale = i18n.language === "fa" ? "fa-IR-u-ca-persian" : "en";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
