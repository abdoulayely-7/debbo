import { storage } from './storage';

export const CYCLE_SETTINGS_KEY = 'debbo.cycle.settings';

export const DEFAULT_CYCLE_SETTINGS = {
  periodStarts: [],
  cycleLength: 28,
  periodLength: 5,
  trackingEnabled: true,
  periodEndedAt: '',
  periodAdjustment: 0,
  cycleLengthOverride: false,
};

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const toDate = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toDateValue = (date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const addDays = (date, count) => {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
};

const dayDifference = (later, earlier) => Math.round((later - earlier) / 86400000);

export const normalizeCycleSettings = (settings = {}) => {
  const source = settings && typeof settings === 'object' ? settings : {};
  const recordedStarts = Array.isArray(source.periodStarts)
    ? source.periodStarts
    : (isValidDate(source.lastPeriod) ? [source.lastPeriod] : []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    periodStarts: [...new Set(recordedStarts.filter((date) => (
      isValidDate(date) && toDate(date) <= today
    )))].sort(),
    cycleLength: Number.isInteger(Number(source.cycleLength))
      && Number(source.cycleLength) >= 21
      && Number(source.cycleLength) <= 35
      ? Number(source.cycleLength)
      : DEFAULT_CYCLE_SETTINGS.cycleLength,
    periodLength: Number.isInteger(Number(source.periodLength))
      && Number(source.periodLength) >= 1
      && Number(source.periodLength) <= 10
      ? Number(source.periodLength)
      : DEFAULT_CYCLE_SETTINGS.periodLength,
    trackingEnabled: source.trackingEnabled !== false,
    periodEndedAt: isValidDate(source.periodEndedAt) ? source.periodEndedAt : '',
    periodAdjustment: Number.isInteger(Number(source.periodAdjustment))
      ? Math.max(-5, Math.min(5, Number(source.periodAdjustment)))
      : 0,
    cycleLengthOverride: source.cycleLengthOverride === true,
  };
};

export const getCycleSettings = () => normalizeCycleSettings(
  storage.get(CYCLE_SETTINGS_KEY, DEFAULT_CYCLE_SETTINGS),
);

export const getCycleProjection = (settings, date = new Date()) => {
  const cycle = normalizeCycleSettings(settings);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const periodStarts = cycle.periodStarts;
  const lastPeriod = periodStarts.length ? toDate(periodStarts[periodStarts.length - 1]) : null;
  const allIntervals = periodStarts.slice(1).map((periodStart, index) => (
    dayDifference(toDate(periodStart), toDate(periodStarts[index]))
  ));
  const intervals = allIntervals.slice(-6);
  const cycleLength = intervals.length && !cycle.cycleLengthOverride
    ? Math.round(intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length)
    : cycle.cycleLength;
  const irregular = intervals.length < 3
    ? null
    : Math.max(...intervals) - Math.min(...intervals) > 7;
  const currentCycleLength = lastPeriod ? dayDifference(today, lastPeriod) + 1 : 0;
  const cycleAlert = intervals.some((interval) => interval < 24 || interval > 38)
    || (cycle.trackingEnabled && currentCycleLength > 38);
  const activePeriodStart = cycle.periodStarts.includes(cycle.periodEndedAt)
    ? null
    : (cycle.periodStarts[cycle.periodStarts.length - 1] || null);

  if (!lastPeriod || !cycle.trackingEnabled) {
    return {
      configured: false,
      trackingEnabled: cycle.trackingEnabled,
      periodStarts,
      intervals,
      cycleLength,
      irregular,
      cycleAlert,
      periodLength: cycle.periodLength,
      inPeriod: false,
      periodDay: null,
      nextPeriod: null,
      earliestNextPeriod: null,
      latestNextPeriod: null,
      daysUntilPeriod: null,
      overdueDays: 0,
      cycleDay: null,
    };
  }

  const nextPeriod = addDays(lastPeriod, cycleLength + cycle.periodAdjustment);
  const rawDaysUntilPeriod = dayDifference(nextPeriod, today);
  const daysUntilPeriod = Math.max(0, rawDaysUntilPeriod);
  const overdueDays = Math.max(0, -rawDaysUntilPeriod);
  const earliestInterval = intervals.length ? Math.min(...intervals) : cycleLength;
  const latestInterval = intervals.length ? Math.max(...intervals) : cycleLength;
  const earliestNextPeriod = addDays(lastPeriod, earliestInterval + cycle.periodAdjustment);
  const latestNextPeriod = addDays(lastPeriod, latestInterval + cycle.periodAdjustment);
  const periodDay = activePeriodStart ? dayDifference(today, toDate(activePeriodStart)) + 1 : null;
  const periodEnded = Boolean(cycle.periodEndedAt);
  const inPeriod = !periodEnded
    && periodDay !== null
    && periodDay >= 1
    && periodDay <= cycle.periodLength;

  return {
    configured: true,
    trackingEnabled: cycle.trackingEnabled,
    periodStarts,
    intervals,
    cycleLength,
    irregular,
    cycleAlert,
    periodLength: cycle.periodLength,
    inPeriod,
    periodDay: inPeriod ? periodDay : null,
    lastPeriod,
    nextPeriod,
    earliestNextPeriod,
    latestNextPeriod,
    daysUntilPeriod,
    overdueDays,
    cycleDay: Math.max(1, Math.min(cycleLength, dayDifference(today, lastPeriod) + 1)),
  };
};

export const getCyclePhase = (cycleDay, cycleLength) => {
  if (!cycleDay || !cycleLength) return 'Cycle à compléter';
  if (cycleDay <= 5) return 'Phase menstruelle';

  const ovulationDay = cycleLength - 14;
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) return 'Ovulation';
  if (cycleDay < ovulationDay - 1) return 'Phase folliculaire';
  return 'Phase lutéale';
};
