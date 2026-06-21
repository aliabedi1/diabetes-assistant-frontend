import _DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useTranslation } from "react-i18next";

// Vite 8 does not unwrap __esModule CJS interop; resolve the actual component manually.
const DatePicker = _DatePicker.default ?? _DatePicker;

export default function DateTimeField({ label, value, onChange, error, placeholder, className = "" }) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  function handleChange(nextValue) {
    if (!nextValue) {
      onChange("");
      return;
    }

    const jsDate = nextValue?.toDate?.();

    if (!jsDate || Number.isNaN(jsDate.getTime())) {
      onChange("");
      return;
    }

    // Reject future timestamps (belt-and-suspenders alongside maxDate)
    if (jsDate > new Date()) {
      onChange("");
      return;
    }

    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, "0");
    const day = String(jsDate.getDate()).padStart(2, "0");
    const hours = String(jsDate.getHours()).padStart(2, "0");
    const minutes = String(jsDate.getMinutes()).padStart(2, "0");

    onChange(`${year}-${month}-${day} ${hours}:${minutes}:00`);
  }

  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
      <DatePicker
        value={value ? new Date(value.replace(" ", "T")) : ""}
        onChange={handleChange}
        maxDate={new Date()}
        format="YYYY/MM/DD HH:mm"
        disableSecond
        calendar={isFa ? persian : undefined}
        locale={isFa ? persian_fa : undefined}
        calendarPosition={isFa ? "bottom-right" : "bottom-left"}
        inputClass={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-500 focus:ring-4 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 ${error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-900/40" : "border-slate-300 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/50"} ${className}`}
        containerClassName="w-full"
        placeholder={placeholder}
      />
      {error && (Array.isArray(error) ? (
        <div className="mt-2 space-y-1">
          {error.map((message, index) => (
            <span key={index} className="block text-sm text-rose-600 dark:text-rose-400">{message}</span>
          ))}
        </div>
      ) : <span className="mt-2 block text-sm text-rose-600 dark:text-rose-400">{error}</span>)}
    </label>
  );
}
