import { go, back } from '../../utils/helpers/debbo-nav';
import { consumeCycleAccess, clearCycleAccess } from '../../utils/debbo-cycle-access';
import { storage } from '../../utils/storage';
import {
  CYCLE_SETTINGS_KEY, DEFAULT_CYCLE_SETTINGS, getCyclePhase, getCycleProjection, getCycleSettings,
  normalizeCycleSettings,
} from '../../utils/debbo-cycle';
import { ADVICE_PRODUCTS, KITS } from '../../utils/debbo-catalog';
import {
  DAYS_BEFORE, getReminder, setReminder, reminderLabel,
} from '../../utils/debbo-reminder';

const STRIP_DAYS = 14;
const DAY_LABELS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const LONG_DAY_LABELS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTH_LABELS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTH_SHORT_LABELS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const CYCLE_LENGTHS = Array.from({ length: 15 }, (_, index) => index + 21);
const CYCLE_LENGTH_LABELS = CYCLE_LENGTHS.map((days) => `${days} jours`);
const REMINDER_LABELS = DAYS_BEFORE.map((days) => `${days} jours avant`);
const FEELINGS = [
  { id: 'cramps', label: 'Crampes', icon: '/assets/icons/bolt.svg' },
  { id: 'fatigue', label: 'Fatigue', icon: '/assets/icons/info.svg' },
  { id: 'bloating', label: 'Ventre gonflé', icon: '/assets/icons/heart.svg' },
  { id: 'mood', label: 'Humeur changeante', icon: '/assets/icons/heart.svg' },
  { id: 'well', label: 'Tout va bien', icon: '/assets/icons/check-circle.svg' },
];
const ADVICE = {
  cramps: 'La chaleur sur le bas du ventre et une marche douce soulagent souvent les crampes légères.',
  fatigue: 'Accordez-vous une pause si possible, hydratez-vous et privilégiez un repas nourrissant.',
  bloating: 'Une marche tranquille et de l’eau peuvent aider à réduire l’inconfort.',
  mood: 'Un moment de repos et une activité qui vous fait du bien peuvent aider. Parlez-en à une sage-femme si cela vous pèse.',
  well: 'Ravie de savoir que vous vous sentez bien. Continuez à écouter votre corps.',
};
const FEELING_KEY = 'debbo.cycle.feeling';
const TODAY = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateValue = (date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const parseDate = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date, count) => {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
};

const dayDifference = (later, earlier) => Math.round((later - earlier) / 86400000);

const buildChart = (intervals) => {
  const recentIntervals = intervals.slice(-3);
  const firstCycleNumber = intervals.length - recentIntervals.length + 1;
  return recentIntervals.map((days, index) => ({
    key: firstCycleNumber + index,
    label: `Cycle ${firstCycleNumber + index}`,
    days,
    height: Math.max(24, Math.min(100, Math.round((days / 40) * 100))),
  }));
};

const getRegularityContent = (projection) => {
  if (projection.intervals.length < 3) {
    const datesNeeded = Math.max(0, 4 - projection.periodStarts.length);
    const dateWord = (count) => (count > 1 ? 'dates' : 'date');
    const regularityDescription = projection.periodStarts.length === 0
      ? 'La régularité se calcule automatiquement à partir des dates de début de vos règles.'
      : `${projection.periodStarts.length} ${dateWord(projection.periodStarts.length)} enregistrée${projection.periodStarts.length > 1 ? 's' : ''}. Ajoutez encore ${datesNeeded} ${dateWord(datesNeeded)} de début de règles pour analyser 3 cycles complets.`;
    return {
      regularityLabel: projection.periodStarts.length ? 'En cours' : 'À compléter',
      regularityDescription,
      regularityClass: 'db-cycle-status-pending',
      cycleBars: [],
      cycleAlertText: projection.cycleAlert
        ? 'Un de vos cycles dure moins de 24 jours ou plus de 38 jours. Ce repère n’est pas un diagnostic. Si cela persiste, parlez-en à une sage-femme.'
        : '',
      irregularAdviceVisible: false,
      datesNeeded,
    };
  }

  const intervals = projection.intervals.slice(-6);
  const shortest = Math.min(...intervals);
  const longest = Math.max(...intervals);
  const variation = longest - shortest;
  const regular = variation <= 7;
  const average = Math.round(intervals.reduce((sum, days) => sum + days, 0) / intervals.length);
  const alert = intervals.some((days) => days < 24 || days > 38);
  const alertText = alert
    ? 'Certains cycles sont plus courts que 24 jours ou plus longs que 38 jours. Ce repère n’est pas un diagnostic. Si cela persiste, parlez-en à une sage-femme.'
    : '';

  return {
    regularityLabel: regular ? 'Cycle régulier' : 'Cycle irrégulier',
    regularityDescription: `Moyenne ${average} jours · écart ${variation} jours entre le plus court et le plus long${regular ? ' : vos estimations sont plus fiables.' : '.'}`,
    regularityClass: regular ? 'db-cycle-status-regular' : 'db-cycle-status-irregular',
    cycleBars: buildChart(intervals),
    cycleAlertText: alertText,
    irregularAdviceVisible: !regular,
  };
};

const getRingDotStyle = (degrees) => {
  const angle = (degrees - 90) * Math.PI / 180;
  return `left:${Math.round(200 + Math.cos(angle) * 184)}rpx;top:${Math.round(200 + Math.sin(angle) * 184)}rpx;`;
};

const getPhaseDescription = (phase, inPeriod) => {
  if (inPeriod) return 'Vous êtes pendant vos règles. Reposez-vous et hydratez-vous selon vos besoins.';
  if (phase === 'Phase folliculaire') return 'Votre énergie peut remonter progressivement après les règles.';
  if (phase === 'Ovulation') return 'Cette période est estimée et ne constitue jamais une méthode de contraception.';
  if (phase === 'Phase lutéale') return 'Fatigue ou crampes légères possibles. Une tisane chaude peut aider.';
  return 'Prenez soin de vous et écoutez les besoins de votre corps.';
};

const formatLongDate = (date) => (
  `${LONG_DAY_LABELS[date.getDay()]} ${date.getDate()} ${MONTH_LABELS[date.getMonth()]}`
);

const calculateCycle = (settings, reminder, selectedDate) => {
  const projection = getCycleProjection(settings, TODAY());
  const today = TODAY();
  const periodStarts = projection.periodStarts;
  const lastPeriod = periodStarts.length ? parseDate(periodStarts[periodStarts.length - 1]) : null;
  const nextPeriod = projection.nextPeriod;
  const earliestNextPeriod = projection.earliestNextPeriod;
  const latestNextPeriod = projection.latestNextPeriod;
  const inPeriod = projection.inPeriod;
  const nextPeriodDates = new Set();

  if (nextPeriod) {
    const firstPrediction = projection.irregular ? earliestNextPeriod : nextPeriod;
    const lastPrediction = projection.irregular ? latestNextPeriod : nextPeriod;
    for (let date = firstPrediction; date <= lastPrediction; date = addDays(date, 1)) {
      nextPeriodDates.add(toDateValue(date));
    }
    for (let offset = 0; offset < projection.periodLength; offset += 1) {
      nextPeriodDates.add(toDateValue(addDays(lastPrediction, offset)));
    }
  }

  const days = Array.from({ length: STRIP_DAYS }, (_, index) => {
    const date = addDays(today, index);
    const value = toDateValue(date);
    const daysFromStart = lastPeriod ? dayDifference(date, lastPeriod) : -1;
    const period = nextPeriodDates.has(value) || (inPeriod && daysFromStart < projection.periodLength);
    const remindStart = projection.irregular ? earliestNextPeriod : nextPeriod;
    const remindEnd = remindStart ? addDays(remindStart, -reminder.daysBefore) : null;
    const remind = reminder.enabled
      && remindEnd
      && date >= remindEnd
      && date < remindStart
      && !period;

    return {
      key: value,
      value,
      label: DAY_LABELS[date.getDay()],
      number: date.getDate(),
      today: value === toDateValue(today),
      period,
      remind,
      selected: value === toDateValue(selectedDate),
    };
  });

  const selectedCycleOffset = lastPeriod ? dayDifference(selectedDate, lastPeriod) : null;
  const selectedCycleDay = selectedCycleOffset === null
    ? null
    : ((selectedCycleOffset % projection.cycleLength) + projection.cycleLength) % projection.cycleLength + 1;
  const selectedDay = days.find((item) => item.value === toDateValue(selectedDate));
  const selectedStatus = selectedDay && selectedDay.period
    ? 'Règles estimées'
    : (selectedDay && selectedDay.remind ? 'Période de rappel' : 'Jour du cycle');
  const estimateText = !projection.configured
    ? 'Sélectionnez une date de début pour estimer vos prochaines règles.'
    : (projection.overdueDays > 0
      ? `Date estimée dépassée de ${projection.overdueDays} ${projection.overdueDays === 1 ? 'jour' : 'jours'} · vos dates peuvent varier.`
      : (projection.irregular
        ? `Cycle irrégulier : entre le ${earliestNextPeriod.getDate()} ${MONTH_SHORT_LABELS[earliestNextPeriod.getMonth()]} et le ${latestNextPeriod.getDate()} ${MONTH_SHORT_LABELS[latestNextPeriod.getMonth()]}.`
        : `Vers le ${nextPeriod.getDate()} ${MONTH_SHORT_LABELS[nextPeriod.getMonth()]} · estimation.`));
  const reminderDate = projection.irregular ? earliestNextPeriod : nextPeriod;
  const regularity = getRegularityContent(projection);
  const cyclePhase = getCyclePhase(projection.cycleDay, projection.cycleLength);

  return {
    ...projection,
    ...regularity,
    cycleStatusLabel: !projection.trackingEnabled
      ? 'Suivi désactivé'
      : (projection.configured
        ? `Jour ${projection.cycleDay} sur ${projection.cycleLength}`
        : regularity.regularityLabel),
    days,
    selectedDateLabel: `${formatLongDate(selectedDate)} · ${selectedCycleDay ? `jour ${selectedCycleDay} du cycle` : 'cycle non renseigné'} · ${selectedStatus}`,
    selectedDateValue: toDateValue(selectedDate),
    nextPeriodLabel: estimateText,
    cyclePhase,
    cyclePhaseDescription: getPhaseDescription(cyclePhase, projection.inPeriod),
    periodStarts,
    lastPeriodValue: lastPeriod ? toDateValue(lastPeriod) : toDateValue(today),
    lastPeriodDay: lastPeriod ? lastPeriod.getDate() : '—',
    lastPeriodMonthYear: lastPeriod
      ? `${MONTH_SHORT_LABELS[lastPeriod.getMonth()]} ${lastPeriod.getFullYear()}`
      : 'Aucune date',
    reminderAt: reminderDate && !projection.overdueDays ? reminderLabel(reminderDate, reminder) : '',
    periodStartCount: periodStarts.length,
    cycleLengthIndex: Math.max(0, Math.min(
      CYCLE_LENGTHS.length - 1,
      CYCLE_LENGTHS.indexOf(projection.cycleLength) < 0
        ? projection.cycleLength - CYCLE_LENGTHS[0]
        : CYCLE_LENGTHS.indexOf(projection.cycleLength),
    )),
    reminderIndex: Math.max(0, DAYS_BEFORE.indexOf(reminder.daysBefore)),
    ringDegrees: projection.configured
      ? Math.round((projection.cycleDay / projection.cycleLength) * 360)
      : 0,
    ringDotStyle: projection.configured
      ? getRingDotStyle(Math.round((projection.cycleDay / projection.cycleLength) * 360))
      : '',
    ringDays: projection.daysUntilPeriod,
    displayDays: projection.daysUntilPeriod,
    inPeriod,
    periodDay: projection.periodDay,
    periodDaysRemaining: inPeriod
      ? Math.max(0, projection.periodLength - projection.periodDay + 1)
      : 0,
    estimateDaysLabel: projection.configured
      ? `${projection.daysUntilPeriod} ${projection.daysUntilPeriod === 1 ? 'jour' : 'jours'}`
      : 'À estimer',
    startButtonLabel: inPeriod ? 'Mes règles sont terminées' : 'Mes règles ont commencé',
    periodButtonAction: inPeriod ? 'finishPeriod' : 'startPeriod',
    cycleDurationHeading: projection.cycleLengthOverride
      ? 'Durée choisie'
      : (projection.intervals.length ? 'Durée moyenne' : 'Durée du cycle'),
    cycleDurationSub: projection.cycleLengthOverride
      ? 'ajustée selon votre choix'
      : (projection.intervals.length ? `${projection.intervals.length} cycle(s) enregistré(s)` : 'estimation par défaut'),
    cycleLengthLabels: CYCLE_LENGTH_LABELS,
    reminderLabels: REMINDER_LABELS,
    selectedFeelingAdvice: ADVICE[storage.get(FEELING_KEY, '')] || '',
    selectedFeeling: storage.get(FEELING_KEY, ''),
    feelingOptions: FEELINGS,
  };
};

Page({
  onShow() {
    if (!this._cycleAccessGranted) {
      this._cycleAccessGranted = consumeCycleAccess();
    }
    if (!this._cycleAccessGranted) {
      wx.reLaunch({
        url: '/pages/cycle-code/index',
        fail: (error) => {
          console.warn('[Cycle] Unable to open the access-code page:', error.errMsg);
          go('/pages/cycle-code/index');
        },
      });
      return;
    }
    this.setData({ accessGranted: true });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActiveTab('cycle');
    }
    this.refreshCycle(true);
  },

  onHide() {
    this._cycleAccessGranted = false;
    this.setData({ accessGranted: false });
    clearCycleAccess();
    this.stopCountdownAnimation();
  },

  onUnload() {
    this.stopCountdownAnimation();
  },

  data: {
    accessGranted: false,
    todayValue: toDateValue(TODAY()),
    calendarDateValue: toDateValue(TODAY()),
    cycle: DEFAULT_CYCLE_SETTINGS,
    reminder: {},
    configured: false,
    trackingEnabled: true,
    cycleLength: 28,
    cycleLengthIndex: 7,
    cycleLengthLabels: CYCLE_LENGTH_LABELS,
    reminderLabels: REMINDER_LABELS,
    reminderIndex: 2,
    reminderAt: '',
    cycleBars: [],
    regularityLabel: 'À compléter',
    regularityDescription: 'Enregistrez vos dates de début pour voir vos tendances.',
    regularityClass: 'db-cycle-status-pending',
    cycleAlertText: '',
    cyclePhase: 'Cycle à compléter',
    days: [],
    selectedDateLabel: '',
    selectedDateValue: toDateValue(TODAY()),
    nextPeriodLabel: 'Sélectionnez une date pour commencer.',
    displayDays: 0,
    ringDays: 0,
    ringDegrees: 0,
    ringDotStyle: '',
    inPeriod: false,
    periodDay: null,
    estimateDaysLabel: 'À estimer',
    periodButtonAction: 'startPeriod',
    startButtonLabel: 'Mes règles ont commencé',
    cycleDurationHeading: 'Durée du cycle',
    cycleDurationSub: 'estimation par défaut',
    periodStarts: [],
    periodStartCount: 0,
    lastPeriodValue: toDateValue(TODAY()),
    lastPeriodDay: '—',
    lastPeriodMonthYear: 'Aucune date',
    feelingOptions: FEELINGS,
    selectedFeeling: '',
    selectedFeelingAdvice: '',
    adviceProduct: ADVICE_PRODUCTS.find((product) => product.id === 'bouil'),
    reminderEnabled: true,
    kits: KITS,
    selectedKit: KITS.find((kit) => kit.id === 'ess') || KITS[0],
  },

  onLoad() {
    this._selectedDate = TODAY();
  },

  refreshCycle(animate) {
    const cycle = getCycleSettings();
    const reminder = getReminder();
    this._selectedDate = TODAY();
    this.applyCycle(cycle, reminder, animate);
  },

  applyCycle(cycle, reminder, animate = false) {
    const calculated = calculateCycle(cycle, reminder, this._selectedDate || TODAY());
    this.setData({
      cycle,
      reminder,
      trackingEnabled: cycle.trackingEnabled,
      reminderEnabled: reminder.enabled,
      ...calculated,
    });
    if (animate && calculated.configured) this.animateCountdown(calculated.daysUntilPeriod, calculated.ringDegrees);
  },

  animateCountdown(targetDays, targetDegrees) {
    this.stopCountdownAnimation();
    const reducedMotion = wx.getSystemInfoSync && wx.getSystemInfoSync().prefersReducedMotion;
    if (reducedMotion || targetDays <= 0) return;
    let step = 0;
    const duration = 500;
    const steps = Math.max(targetDays, 1);
    this.setData({ displayDays: 0, ringDegrees: 0 });
    this._countdownTimer = setInterval(() => {
      step += 1;
      const progress = Math.min(1, step / steps);
      this.setData({
        displayDays: Math.min(targetDays, step),
        ringDegrees: Math.round(targetDegrees * progress),
        ringDotStyle: getRingDotStyle(Math.round(targetDegrees * progress)),
      });
      if (progress >= 1) this.stopCountdownAnimation();
    }, Math.max(16, duration / steps));
  },

  stopCountdownAnimation() {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
      this._countdownTimer = null;
    }
  },

  saveCycle(cycle) {
    const normalized = normalizeCycleSettings(cycle);
    if (!storage.set(CYCLE_SETTINGS_KEY, normalized)) {
      wx.showToast({ title: 'Impossible d’enregistrer les données', icon: 'none' });
      return false;
    }
    this.applyCycle(normalized, this.data.reminder);
    return true;
  },

  changeCycleLength(e) {
    const cycleLength = CYCLE_LENGTHS[Number(e.detail.value)];
    this.saveCycle({ ...this.data.cycle, cycleLength, cycleLengthOverride: true });
  },

  toggleTracking() {
    const cycle = { ...this.data.cycle, trackingEnabled: !this.data.trackingEnabled };
    this.saveCycle(cycle);
  },

  setLastPeriod(e) {
    const date = e.detail.value;
    if (!date || date > this.data.todayValue) return;
    if (this.data.cycle.periodStarts.includes(date)) {
      wx.showToast({ title: 'Cette date est déjà enregistrée', icon: 'none' });
      return;
    }
    const periodStarts = [...new Set([...this.data.cycle.periodStarts, date])].sort();
    this._selectedDate = TODAY();
    if (this.saveCycle({ ...this.data.cycle, periodStarts, periodEndedAt: '', periodAdjustment: 0 })) {
      wx.showToast({ title: 'Date de début enregistrée', icon: 'success' });
    }
  },

  selectCalendarDay(e) {
    this._selectedDate = parseDate(e.currentTarget.dataset.date);
    const calculated = calculateCycle(
      this.data.cycle,
      this.data.reminder,
      this._selectedDate,
    );
    this.setData({
      selectedDateLabel: calculated.selectedDateLabel,
      selectedDateValue: calculated.selectedDateValue,
    });
  },

  startPeriod() {
    if (!this.data.trackingEnabled) {
      wx.showToast({ title: 'Activez le suivi pour enregistrer vos règles', icon: 'none' });
      return;
    }
    const today = this.data.todayValue;
    if (this.data.cycle.periodStarts.includes(today)) {
      wx.showToast({ title: 'Le début des règles est déjà enregistré pour aujourd’hui', icon: 'none' });
      return;
    }
    const periodStarts = [...new Set([...this.data.cycle.periodStarts, today])].sort();
    this._selectedDate = TODAY();
    if (this.saveCycle({ ...this.data.cycle, periodStarts, periodEndedAt: '', periodAdjustment: 0 })) {
      wx.showToast({ title: 'Début des règles enregistré', icon: 'success' });
    }
  },

  adjustNextPeriod(e) {
    const delta = Number(e.currentTarget.dataset.delta);
    const adjustment = Math.max(-5, Math.min(5, this.data.cycle.periodAdjustment + delta));
    this.saveCycle({ ...this.data.cycle, periodAdjustment: adjustment });
  },

  finishPeriod() {
    this.saveCycle({ ...this.data.cycle, periodEndedAt: this.data.todayValue });
  },

  onPeriodAction() {
    if (this.data.inPeriod) this.finishPeriod();
    else this.startPeriod();
  },

  changeReminderDays(e) {
    const reminder = setReminder({ daysBefore: DAYS_BEFORE[Number(e.detail.value)] });
    this.applyCycle(this.data.cycle, reminder);
  },

  showNotif() {
    wx.showModal({
      title: 'Votre rappel Max it',
      content: this.data.reminderAt
        ? `Vous recevrez un rappel estimé le ${this.data.reminderAt}.`
        : (this.data.overdueDays
          ? 'La date estimée est dépassée. Mettez à jour vos dates pour recalculer le rappel.'
          : 'Ajoutez une date de début de règles pour estimer votre rappel.'),
      showCancel: false,
      confirmText: 'Compris',
    });
  },

  toggleReminder() {
    const reminder = setReminder({ enabled: !this.data.reminder.enabled });
    this.applyCycle(this.data.cycle, reminder);
  },

  selectFeeling(e) {
    const feeling = e.currentTarget.dataset.feeling;
    if (!storage.set(FEELING_KEY, feeling)) {
      wx.showToast({ title: 'Impossible d’enregistrer votre sélection', icon: 'none' });
      return;
    }
    this.setData({
      selectedFeeling: feeling,
      selectedFeelingAdvice: ADVICE[feeling],
      adviceProduct: ADVICE_PRODUCTS.find((product) => product.id === 'bouil'),
    });
  },

  goToAdviceProduct() {
    go('/pages/conseils/index');
  },

  askQuestion() {
    go('/pages/conseils/index');
  },

  goToReorder() {
    go(`/pages/urgence/index?kit=${this.data.selectedKit.id}`);
  },

  goBack() { back() },

  wipeData() {
    wx.showModal({
      title: 'Effacer les données',
      content: 'Voulez-vous effacer toutes vos données de cycle ?',
      success: (res) => {
        if (!res.confirm) return;
        const settingsRemoved = storage.remove(CYCLE_SETTINGS_KEY);
        const feelingRemoved = storage.remove(FEELING_KEY);
        if (!settingsRemoved || !feelingRemoved) {
          wx.showToast({ title: 'Impossible d’effacer les données', icon: 'none' });
          return;
        }
        this._selectedDate = TODAY();
        this.applyCycle(DEFAULT_CYCLE_SETTINGS, this.data.reminder);
        this.setData({ selectedFeeling: '', selectedFeelingAdvice: '' });
        wx.showToast({ title: 'Données effacées', icon: 'success' });
      },
    });
  },
});
