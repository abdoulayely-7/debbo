import { go, back } from '../../utils/helpers/debbo-nav';
import { KITS } from '../../utils/debbo-catalog';
import {
  DAYS_BEFORE, TIMES, getReminder, setReminder, reminderLabel, subscribeReminder,
} from '../../utils/debbo-reminder';

// Demo cycle: today 22 oct., next period estimated on 27 oct. for 5 days.
const TODAY = new Date(2026, 9, 22);
const NEXT_PERIOD = new Date(2026, 9, 27);
const PERIOD_DAYS = 5;
const STRIP_DAYS = 12;
const DAY_LABELS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

const buildDays = (reminder) => {
  const dayMs = 24 * 3600 * 1000;
  return Array.from({ length: STRIP_DAYS }, (_, i) => {
    const d = new Date(TODAY.getTime() + i * dayMs);
    const untilPeriod = Math.round((NEXT_PERIOD - d) / dayMs);
    return {
      key: i,
      label: DAY_LABELS[d.getDay()],
      num: d.getDate(),
      today: i === 0,
      period: untilPeriod <= 0 && untilPeriod > -PERIOD_DAYS,
      remind: reminder.enabled && untilPeriod > 0 && untilPeriod <= reminder.daysBefore,
    };
  });
};

Page({
  data: {
    trackingOn: true,
    reminder: {},
    reminderAt: '',
    daysBefore: DAYS_BEFORE,
    times: TIMES,
    kits: KITS,
    selectedKit: KITS[1],
    days: [],
  },

  onLoad() {
    this.applyReminder(getReminder());
  },

  applyReminder(reminder) {
    this.setData({
      reminder,
      reminderAt: reminderLabel(NEXT_PERIOD, reminder),
      selectedKit: KITS.find((k) => k.id === reminder.kitId) || KITS[1],
      days: buildDays(reminder),
    });
  },

  updateReminder(patch) {
    this.applyReminder(setReminder(patch));
  },

  async toggleReminder() {
    const enabled = !this.data.reminder.enabled;
    if (enabled) {
      const res = await subscribeReminder();
      if (res === 'reject') {
        wx.showToast({ title: 'Notifications refusées dans Max it', icon: 'none' });
        return;
      }
    }
    this.updateReminder({ enabled });
    wx.showToast({ title: enabled ? 'Rappel activé' : 'Rappel désactivé', icon: 'none' });
  },

  setDaysBefore(e) { this.updateReminder({ daysBefore: Number(e.currentTarget.dataset.d) }) },
  setTime(e) { this.updateReminder({ time: e.currentTarget.dataset.t }) },
  setKit(e) { this.updateReminder({ kitId: e.currentTarget.dataset.id }) },

  goBack() { back() },
  goToReorder() { go(`/pages/urgence/index?kit=${this.data.reminder.kitId}`) },

  toggleTracking() {
    this.setData({ trackingOn: !this.data.trackingOn });
  },

  showNotif() {
    wx.showToast({ title: 'Max it · Votre commande Bien-être est à renouveler', icon: 'none', duration: 2500 });
  },

  wipeData() {
    wx.showModal({
      title: 'Effacer les données',
      content: 'Voulez-vous effacer toutes vos données de cycle ?',
      success: (res) => {
        if (res.confirm) wx.showToast({ title: 'Données effacées', icon: 'success' });
      },
    });
  },
});
