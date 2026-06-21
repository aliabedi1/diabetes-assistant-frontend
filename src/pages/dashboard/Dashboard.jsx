import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import DateTimeField from "../../components/ui/DateTimeField";
import Alert from "../../components/ui/Alert";
import { createGlucoseLog, getGlucoseLogs } from "../../services/glucose.service";
import { createMedicalLog, getMedicalLogs } from "../../services/medical.service";
import { formatDate, unwrapCollection } from "../../utils/data";
import { useAuthStore } from "../../store/auth.store";

const FILTER_OPTIONS = [
  { key: "3h", hours: 3 },
  { key: "12h", hours: 12 },
  { key: "24h", hours: 24 },
  { key: "7d", hours: 24 * 7 },
];

function getStatusFromAverage(value, t) {
  if (!value || Number.isNaN(value)) {
    return { label: t("dashboard.statusNoData"), color: "slate", rating: "—" };
  }

  if (value < 80) {
    return { label: t("dashboard.statusLowTrend"), color: "amber", rating: "C" };
  }

  if (value <= 140) {
    return { label: t("dashboard.statusInRange"), color: "emerald", rating: "A" };
  }

  if (value <= 180) {
    return { label: t("dashboard.statusElevated"), color: "orange", rating: "B" };
  }

  return { label: t("dashboard.statusHighRisk"), color: "rose", rating: "D" };
}

const PLOT_W = 100;
const PLOT_H = 44;
const AXIS_W = 22; // label column on each side

function generateAxisTicks(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    return [min, max].filter(Number.isFinite);
  }
  const rawStep = (max - min) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = Math.ceil(rawStep / mag) * mag || 1;
  const ticks = [];
  for (let v = Math.floor(min / step) * step; v <= max + step * 0.5; v += step) ticks.push(v);
  return ticks.filter((v) => v >= min - step * 0.01 && v <= max + step * 0.01);
}

function toLocalDigits(num, lang) {
  return lang === "fa"
    ? String(Math.round(num)).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
    : String(Math.round(num));
}

function buildSeriesPath(points, tsFrom, tsTo, vMin, vMax) {
  if (!points.length) return { d: "", dots: [] };
  const tRange = Math.max(tsTo - tsFrom, 1);
  const vRange = Math.max(vMax - vMin, 1);
  const mapped = points.map((p) => ({
    x: ((p.ts - tsFrom) / tRange) * PLOT_W,
    y: PLOT_H - ((p.v - vMin) / vRange) * PLOT_H,
  }));
  return {
    d: mapped.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" "),
    dots: mapped,
  };
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const user = useAuthStore((state) => state.user);
  const [glucoseLogs, setGlucoseLogs] = useState([]);
  const [medicalLogs, setMedicalLogs] = useState([]);
  const [quickForm, setQuickForm] = useState({ glucose_amount: "", note: "", logged_at: "" });
  const [filterKey, setFilterKey] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMobileQuickAdd, setShowMobileQuickAdd] = useState(true);

  async function loadDashboard() {
    const [glucoseResponse, medicalResponse] = await Promise.all([
      getGlucoseLogs(),
      getMedicalLogs(),
    ]);

    setGlucoseLogs(unwrapCollection(glucoseResponse.data));
    setMedicalLogs(unwrapCollection(medicalResponse.data));
  }

  useEffect(() => {
    loadDashboard()
      .catch(() => setError(t("common.error")))
      .finally(() => setLoading(false));
  }, [t]);

  const latestGlucose = glucoseLogs[0];
  const recentSevenDays = useMemo(() => {
    const start = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return glucoseLogs.filter((log) => new Date(log.logged_at || log.created_at).getTime() >= start);
  }, [glucoseLogs]);

  const averageGlucose = recentSevenDays.length
    ? Math.round(recentSevenDays.reduce((total, log) => total + Number(log.glucose_amount || log.amount || 0), 0) / recentSevenDays.length)
    : null;

  const healthStatus = getStatusFromAverage(averageGlucose, t);

  const glucoseChartPoints = useMemo(() => {
    const option = FILTER_OPTIONS.find((item) => item.key === filterKey) || FILTER_OPTIONS[2];
    const from = Date.now() - option.hours * 3600000;
    return glucoseLogs
      .filter((log) => {
        const ts = new Date(log.logged_at || log.created_at).getTime();
        return Number.isFinite(ts) && ts >= from;
      })
      .sort((a, b) => new Date(a.logged_at || a.created_at).getTime() - new Date(b.logged_at || b.created_at).getTime())
      .map((log) => ({ ts: new Date(log.logged_at || log.created_at).getTime(), v: Number(log.glucose_amount || log.amount || 0) }));
  }, [filterKey, glucoseLogs]);

  const medicalChartPoints = useMemo(() => {
    const option = FILTER_OPTIONS.find((item) => item.key === filterKey) || FILTER_OPTIONS[2];
    const from = Date.now() - option.hours * 3600000;
    return medicalLogs
      .filter((log) => {
        const ts = new Date(log.logged_at || log.created_at).getTime();
        return Number.isFinite(ts) && ts >= from && Number(log.amount) > 0;
      })
      .sort((a, b) => new Date(a.logged_at || a.created_at).getTime() - new Date(b.logged_at || b.created_at).getTime())
      .map((log) => ({ ts: new Date(log.logged_at || log.created_at).getTime(), v: Number(log.amount) }));
  }, [filterKey, medicalLogs]);

  const chartTimeTo = Date.now();
  const chartTimeFrom = (() => {
    const option = FILTER_OPTIONS.find((o) => o.key === filterKey) || FILTER_OPTIONS[2];
    return chartTimeTo - option.hours * 3600000;
  })();

  const glucoseMin = Math.min(...glucoseChartPoints.map((p) => p.v), 60);
  const glucoseMax = Math.max(...glucoseChartPoints.map((p) => p.v), 220);
  const glucoseTicks = generateAxisTicks(glucoseMin, glucoseMax);

  const hasMedicalData = medicalChartPoints.length > 0;
  const medicalMin = hasMedicalData ? Math.min(...medicalChartPoints.map((p) => p.v)) : 0;
  const medicalMax = hasMedicalData ? Math.max(...medicalChartPoints.map((p) => p.v)) : 10;
  const medicalTicks = hasMedicalData ? generateAxisTicks(medicalMin, medicalMax) : [];

  const glucoseSeries = buildSeriesPath(glucoseChartPoints, chartTimeFrom, chartTimeTo, glucoseMin, glucoseMax);
  const medicalSeries = buildSeriesPath(medicalChartPoints, chartTimeFrom, chartTimeTo, medicalMin, medicalMax);

  const mergedHistory = useMemo(() => {
    const glucoseItems = glucoseLogs.map((log) => ({
      id: `g-${log.id || `${log.logged_at}-${log.glucose_amount}`}`,
      type: "glucose",
      timestamp: log.logged_at || log.created_at,
      title: `${log.glucose_amount || log.amount} mg/dL`,
      detail: log.note || log.notes || "",
    }));

    const noteItems = medicalLogs.map((log) => ({
      id: `m-${log.id || `${log.created_at}-${log.type || "medical"}`}`,
      type: "note",
      timestamp: log.logged_at || log.created_at,
      title: log.type || t("dashboard.medicalNote"),
      detail: log.note || t("dashboard.noDescription"),
    }));

    return [...glucoseItems, ...noteItems]
      .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
      .slice(0, 10);
  }, [glucoseLogs, medicalLogs, t]);

  async function submitQuickAdd(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const glucoseValue = Number(quickForm.glucose_amount);
    const hasGlucose = Number.isFinite(glucoseValue) && glucoseValue > 0;
    const hasNote = Boolean(quickForm.note.trim());
    const hasLoggedAt = Boolean(quickForm.logged_at);

    if (!hasGlucose && !hasNote) {
      setError(t("dashboard.quickEntryValidation"));
      setSaving(false);
      return;
    }

    try {
      const requests = [];

      if (hasGlucose) {
        requests.push(
          createGlucoseLog({
            glucose_amount: glucoseValue,
            ...(hasLoggedAt ? { logged_at: quickForm.logged_at } : {}),
            note: hasNote ? quickForm.note.trim() : "",
          }),
        );
      }

      if (hasNote) {
        requests.push(
          createMedicalLog({
            amount: 0,
            type: "quick-note",
            note: quickForm.note.trim(),
            ...(hasLoggedAt ? { logged_at: quickForm.logged_at } : {}),
          }),
        );
      }

      await Promise.all(requests);
      await loadDashboard();
      setQuickForm({ glucose_amount: "", note: "", logged_at: "" });
      setSuccess(t("dashboard.quickEntrySaved"));
    } catch {
      setError(t("dashboard.quickEntrySaveError"));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    function onScroll() {
      setShowMobileQuickAdd(window.scrollY < 220);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const statusColors = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
  };

  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.6fr_0.9fr]">
      <div className="space-y-6">
        <Card className="p-0">
          <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("dashboard.overview")}</p>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("dashboard.glucoseTrend")}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFilterKey(option.key)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      filterKey === option.key
                        ? "bg-sky-600 text-white dark:bg-sky-500"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                    aria-pressed={filterKey === option.key}
                  >
                    {option.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.latestReading")}</p>
                <p className="text-3xl font-black text-slate-950 dark:text-white">{latestGlucose ? `${latestGlucose.glucose_amount || latestGlucose.amount} mg/dL` : "—"}</p>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {latestGlucose ? formatDate(latestGlucose.logged_at || latestGlucose.created_at) : t("dashboard.noReadingsYet")}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/60">
              <svg
                viewBox={`0 0 ${AXIS_W * 2 + PLOT_W} ${PLOT_H + 8}`}
                className="h-40 w-full sm:h-52"
                role="img"
                aria-label={t("dashboard.glucoseTrend")}
              >
                <g transform={`translate(${AXIS_W}, 4)`}>
                  {/* Horizontal grid lines at glucose tick positions */}
                  {glucoseTicks.map((tick) => {
                    const y = (PLOT_H - ((tick - glucoseMin) / (glucoseMax - glucoseMin || 1)) * PLOT_H).toFixed(1);
                    return <line key={tick} x1="0" y1={y} x2={PLOT_W} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-600/60" strokeWidth="0.5" />;
                  })}

                  {/* Target range band 80–140 mg/dL */}
                  {(() => {
                    const vRange = glucoseMax - glucoseMin || 1;
                    const y1 = PLOT_H - ((Math.min(140, glucoseMax) - glucoseMin) / vRange) * PLOT_H;
                    const y2 = PLOT_H - ((Math.max(80, glucoseMin) - glucoseMin) / vRange) * PLOT_H;
                    return y1 < y2 ? <rect x="0" y={y1.toFixed(1)} width={PLOT_W} height={(y2 - y1).toFixed(1)} fill="currentColor" className="text-emerald-400/15 dark:text-emerald-400/10" /> : null;
                  })()}

                  {/* Medical series — dashed violet, drawn first so glucose renders on top */}
                  {hasMedicalData && medicalSeries.d && (
                    <path d={medicalSeries.d} fill="none" stroke="currentColor" className="text-violet-500 dark:text-violet-400" strokeWidth="1.6" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
                  )}
                  {hasMedicalData && medicalSeries.dots.map((pt, i) => (
                    <circle key={i} cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="1.6" fill="currentColor" className="text-violet-500 dark:text-violet-400" />
                  ))}

                  {/* Glucose series — solid sky */}
                  {glucoseSeries.d && (
                    <path d={glucoseSeries.d} fill="none" stroke="currentColor" className="text-sky-600 dark:text-sky-400" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
                  )}
                  {glucoseSeries.dots.map((pt, i) => (
                    <circle key={i} cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="1.4" fill="currentColor" className="text-sky-500 dark:text-sky-300" />
                  ))}
                </g>

                {/* Glucose Y-axis labels — logical start (left LTR, right RTL) */}
                {glucoseTicks.map((tick) => {
                  const svgY = (PLOT_H - ((tick - glucoseMin) / (glucoseMax - glucoseMin || 1)) * PLOT_H + 4 + 1.5).toFixed(1);
                  return (
                    <text key={tick} x={isRTL ? AXIS_W + PLOT_W + 2 : AXIS_W - 2} y={svgY} textAnchor={isRTL ? "start" : "end"} fontSize="4.5" fill="currentColor" className="text-sky-500 dark:text-sky-400">
                      {toLocalDigits(tick, i18n.language)}
                    </text>
                  );
                })}

                {/* Medical Y-axis labels — logical end (right LTR, left RTL) */}
                {hasMedicalData && medicalTicks.map((tick) => {
                  const svgY = (PLOT_H - ((tick - medicalMin) / (medicalMax - medicalMin || 1)) * PLOT_H + 4 + 1.5).toFixed(1);
                  return (
                    <text key={tick} x={isRTL ? AXIS_W - 2 : AXIS_W + PLOT_W + 2} y={svgY} textAnchor={isRTL ? "end" : "start"} fontSize="4.5" fill="currentColor" className="text-violet-500 dark:text-violet-400">
                      {toLocalDigits(tick, i18n.language)}
                    </text>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="3" aria-hidden="true"><line x1="0" y1="1.5" x2="16" y2="1.5" stroke="currentColor" className="text-sky-500" strokeWidth="2" /></svg>
                  {t("nav.glucoseLogs")}
                </span>
                {hasMedicalData && (
                  <span className="flex items-center gap-1.5">
                    <svg width="16" height="3" aria-hidden="true"><line x1="0" y1="1.5" x2="16" y2="1.5" stroke="currentColor" className="text-violet-500" strokeWidth="2" strokeDasharray="3 2" /></svg>
                    {t("nav.medicalLogs")}
                  </span>
                )}
                <span className="ms-auto">{glucoseChartPoints.length} {t("dashboard.pointsShown")}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t("dashboard.targetRangeHint")}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">{t("dashboard.contextualHistory")}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {mergedHistory.length} {t("dashboard.recentCount")}
            </span>
          </div>
          <div className="space-y-3">
            {loading && (
              <>
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
              </>
            )}
            {!loading && mergedHistory.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-700/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-slate-950 dark:text-white">{item.title}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.type === "glucose" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300" : "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300"}`}>
                    {item.type === "glucose" ? t("home.glucose") : t("dashboard.medicalNote")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDate(item.timestamp)}</p>
                {item.detail && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>}
              </div>
            ))}
            {!loading && mergedHistory.length === 0 && <p className="text-slate-500 dark:text-slate-400">{t("dashboard.noMedicalLogs")}</p>}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card id="quick-add-panel" className="xl:sticky xl:top-24">
          <h3 className="text-xl font-black text-slate-950 dark:text-white">{t("dashboard.quickAdd")}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("dashboard.quickAddSubtitle")}</p>
          <form onSubmit={submitQuickAdd} className="mt-5 space-y-3">
            <div className="space-y-2">
              <Alert>{error}</Alert>
              <Alert type="success">{success}</Alert>
            </div>
            <Input
              label={t("glucose.glucoseAmount")}
              name="glucose_amount"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="120"
              value={quickForm.glucose_amount}
              onChange={(event) => setQuickForm((state) => ({ ...state, glucose_amount: event.target.value }))}
            />
            <Input
              label={t("glucose.notes")}
              name="note"
              value={quickForm.note}
              onChange={(event) => setQuickForm((state) => ({ ...state, note: event.target.value }))}
              placeholder={t("glucose.notesPlaceholder")}
            />
            <DateTimeField
              label={t("common.loggedAt")}
              value={quickForm.logged_at}
              onChange={(nextValue) => setQuickForm((state) => ({ ...state, logged_at: nextValue }))}
              placeholder={t("common.loggedAtPlaceholder")}
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 active:scale-[0.99] hover:bg-sky-700 disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
            >
              {saving ? t("common.loading") : t("dashboard.saveQuickLog")}
            </button>
          </form>
        </Card>

        <Card>
          <h3 className="text-xl font-black text-slate-950 dark:text-white">{t("dashboard.healthSnapshot")}</h3>
          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/60">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.sevenDayAvg")}</p>
                <p className="text-2xl font-black text-slate-950 dark:text-white">{averageGlucose ? `${averageGlucose} mg/dL` : "—"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${statusColors[healthStatus.color]}`}>
                {healthStatus.label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/60">
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("dashboard.rating")}</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{healthStatus.rating}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/60">
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("dashboard.highs")}</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{recentSevenDays.filter((log) => Number(log.glucose_amount || log.amount || 0) > 180).length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/60">
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("dashboard.lows")}</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{recentSevenDays.filter((log) => Number(log.glucose_amount || log.amount || 0) < 80).length}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-black text-slate-950 dark:text-white">{t("dashboard.profile")}</h3>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.signedInAs")}</p>
            <p className="text-lg font-bold text-slate-950 dark:text-white">{user?.name || "Patient"}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || t("dashboard.noEmailAvailable")}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/60 dark:text-sky-300">{t("dashboard.units")}</span>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">{t("dashboard.mobileReady")}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">{t("dashboard.fastEntryMode")}</span>
          </div>
        </Card>
      </div>
      <a
        href="#quick-add-panel"
        className={`fixed bottom-4 right-4 z-30 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition lg:hidden ${showMobileQuickAdd ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"}`}
      >
        {t("dashboard.quickAddFab")}
      </a>
    </div>
  );
}
