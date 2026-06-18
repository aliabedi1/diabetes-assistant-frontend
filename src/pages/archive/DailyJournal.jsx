import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import { getGlucoseLogs } from "../../services/glucose.service";
import { getMedicalLogs } from "../../services/medical.service";
import { formatDate, unwrapCollection } from "../../utils/data";
import { useEffect } from "react";

function toInputDate(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export default function DailyJournal() {
  const { t } = useTranslation();
  const [glucoseLogs, setGlucoseLogs] = useState([]);
  const [medicalLogs, setMedicalLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      const [glucoseResponse, medicalResponse] = await Promise.all([
        getGlucoseLogs(),
        getMedicalLogs(),
      ]);

      setGlucoseLogs(unwrapCollection(glucoseResponse.data));
      setMedicalLogs(unwrapCollection(medicalResponse.data));
    }

    loadEntries().finally(() => setLoading(false));
  }, []);

  const dayEntries = useMemo(() => {
    const glucoseItems = glucoseLogs.map((log) => ({
      id: `g-${log.id || `${log.logged_at}-${log.glucose_amount}`}`,
      time: new Date(log.logged_at || log.created_at),
      type: "glucose",
      title: `${log.glucose_amount || log.amount} mg/dL`,
      detail: log.note || log.notes || "",
    }));

    const noteItems = medicalLogs.map((log) => ({
      id: `m-${log.id || `${log.created_at}-${log.type || "medical"}`}`,
      time: new Date(log.logged_at || log.created_at),
      type: "medical",
      title: log.type || t("dashboard.medicalNote"),
      detail: log.note || t("dashboard.noDescription"),
    }));

    return [...glucoseItems, ...noteItems]
      .filter((item) => isSameDay(item.time, selectedDate))
      .sort((left, right) => left.time.getTime() - right.time.getTime());
  }, [glucoseLogs, medicalLogs, selectedDate, t]);

  function shiftDay(amount) {
    setSelectedDate((current) => {
      const nextDate = new Date(current);
      nextDate.setDate(current.getDate() + amount);
      return nextDate;
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Daily Journal</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Timeline view by day</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:items-center">
            <button type="button" onClick={() => shiftDay(-1)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
              Previous Day
            </button>
            <input
              type="date"
              value={toInputDate(selectedDate)}
              onChange={(event) => setSelectedDate(new Date(event.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-sky-500 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 sm:w-auto"
            />
            <button type="button" onClick={() => shiftDay(1)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
              Next Day
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-950 dark:text-white">Timeline</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {dayEntries.length} items
          </span>
        </div>
        {loading && (
          <div className="space-y-3">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
          </div>
        )}
        {!loading && dayEntries.length === 0 && <p className="text-slate-500 dark:text-slate-400">No entries for this day.</p>}
        <div className="space-y-3">
          {dayEntries.map((entry) => (
            <div key={entry.id} className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-700/60 dark:hover:border-slate-500">
              <div className="absolute start-2 top-0 h-full w-px bg-slate-200 dark:bg-slate-600" />
              <div className="relative ms-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(entry.time)}
                    </p>
                    <p className="text-base font-bold text-slate-950 dark:text-white">{entry.title}</p>
                    {entry.detail && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{entry.detail}</p>}
                  </div>
                  <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button type="button" className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600">Edit</button>
                    <button type="button" className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 dark:bg-slate-800 dark:text-rose-300 dark:ring-rose-800">Delete</button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDate(entry.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
