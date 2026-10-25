// ============================================================================
// DEBBO REMINDER
// "Rappel de kit": a discreet notification a few days before the estimated
// period, so the kit can be reordered in one tap. Settings stay on the device,
// like the rest of the cycle data.
// ============================================================================

const KEY = 'debbo.reminder';

/**
 * Subscription template created in the TCMPP console
 * (Mini program management > Message subscription). Leave empty to keep the
 * reminder local only (demo mode).
 */
export const REMINDER_TEMPLATE_ID = '';

export const DAYS_BEFORE = [1, 2, 3, 5];

export const TIMES = [
  { key: 'matin', label: 'Matin', hour: 8 },
  { key: 'midi', label: 'Midi', hour: 12 },
  { key: 'soir', label: 'Soir', hour: 19 },
];

const DEFAULT_REMINDER = {
  enabled: true,
  daysBefore: 3,
  time: 'matin',
  kitId: 'ess',
};

const DAY_NAMES = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MONTH_NAMES = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export const getReminder = () => {
  try {
    return { ...DEFAULT_REMINDER, ...(wx.getStorageSync(KEY) || {}) };
  } catch (e) {
    return { ...DEFAULT_REMINDER };
  }
};

export const setReminder = (patch) => {
  const next = { ...getReminder(), ...patch };
  try {
    wx.setStorageSync(KEY, next);
  } catch (e) {
    console.warn('[Debbo reminder] storage unavailable', e);
  }
  return next;
};

/**
 * When the reminder fires, as a French label.
 * @param {Date} nextPeriod - Estimated first day of the next period
 * @param {object} reminder - { daysBefore, time }
 * @returns {string} e.g. "sam. 24 oct. à 8 h"
 */
export const reminderLabel = (nextPeriod, reminder) => {
  const d = new Date(nextPeriod.getTime());
  d.setDate(d.getDate() - reminder.daysBefore);
  const time = TIMES.find((t) => t.key === reminder.time) || TIMES[0];
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} à ${time.hour} h`;
};

/**
 * Asks the host (Max it) for permission to send the reminder. Resolves to
 * 'accept' | 'reject' | 'local' (no template configured / API missing).
 */
export const subscribeReminder = () => new Promise((resolve) => {
  if (!REMINDER_TEMPLATE_ID || typeof wx.requestSubscribeMessage !== 'function') {
    resolve('local');
    return;
  }
  wx.requestSubscribeMessage({
    tmplIds: [REMINDER_TEMPLATE_ID],
    success: (res) => resolve(res[REMINDER_TEMPLATE_ID] === 'accept' ? 'accept' : 'reject'),
    fail: () => resolve('local'),
  });
});
