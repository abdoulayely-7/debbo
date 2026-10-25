import { home, go } from '../../utils/helpers/debbo-nav';
import { MODES, formatFcfa, getOrder } from '../../utils/debbo-order';

// Route on the stylised map, in fractions of its width/height (axis-aligned
// streets). Swap for <map> + MapContext.translateMarker when the host ships
// a map SDK.
const ROUTE = [[0.16, 0.82], [0.16, 0.55], [0.47, 0.55], [0.47, 0.32], [0.8, 0.32], [0.8, 0.2]];
const TICK_MS = 1600;      // one setData per tick, CSS interpolates between
const PAID_MS = 1800;      // step 1 -> 2
const PREP_MS = 5000;      // step 2 -> 3
const RIDE_MS = 40000;     // demo ride duration (step 3)
const ETA_MAX_MIN = 14;

const STEPS = {
  [MODES.LIVRAISON]: [
    { label: 'Payé', title: 'Paiement confirmé' },
    { label: 'Préparé', title: 'Préparation à la pharmacie' },
    { label: 'En route', title: 'Votre livreuse arrive' },
    { label: 'Livré', title: 'Remise du kit' },
  ],
  [MODES.RETRAIT]: [
    { label: 'Payé', title: 'Paiement confirmé' },
    { label: 'Préparé', title: 'Préparation à la pharmacie' },
    { label: 'Prêt', title: 'Prêt au comptoir' },
    { label: 'Retiré', title: 'Kit retiré' },
  ],
};

const segLen = (a, b, w, h) => Math.abs((b[0] - a[0]) * w) + Math.abs((b[1] - a[1]) * h);

Page({
  data: {
    order: {},
    amountLabel: '',
    isDelivery: true,
    steps: [],
    stage: 0,          // progress: 0 payé, 1 préparation, 2 en route / prêt, 3 terminé
    view: 0,           // step shown in the panel (can be a past step)
    done: false,       // kit received / picked up
    etaMin: ETA_MAX_MIN,
    etaLabel: '~30',   // header bubble: estimate until the ride starts
    moto: { x: 0, y: 0, flip: false },
    segments: [],
    pins: {},
    mapReady: false,
    rating: 0,
    courier: { name: 'Awa', plate: 'DK-4821-B', rating: '4,9' },
    orderCode: 'DB-9126',
    handoverCode: '4821',
    pharmacy: { name: 'Pharmacie partenaire Sacré-Cœur', walk: '5 min à pied', hours: 'Ouverte jusqu\'à 23 h' },
  },

  onLoad() {
    const order = getOrder();
    const isDelivery = order.mode !== MODES.RETRAIT;
    this.setData({
      order,
      isDelivery,
      amountLabel: formatFcfa(order.amount),
      steps: STEPS[isDelivery ? MODES.LIVRAISON : MODES.RETRAIT],
    });
    this.timers = [
      setTimeout(() => this.goStage(1), PAID_MS),
      setTimeout(() => this.goStage(2), PAID_MS + PREP_MS),
    ];
  },

  onUnload() {
    this.timers.forEach(clearTimeout);
    clearInterval(this.rideTimer);
  },

  /** Advances progress; the panel follows unless the user is reviewing a past step. */
  goStage(stage) {
    const follow = this.data.view === this.data.stage;
    this.setData({ stage, view: follow ? stage : this.data.view }, () => {
      if (stage === 2 && this.data.isDelivery) this.startRide();
      if (follow) this.onViewChanged();
    });
  },

  onStepChange(e) {
    const index = e.detail.index;
    if (index > this.data.stage) return;
    this.setData({ view: index }, () => this.onViewChanged());
  },

  backToCurrent() {
    this.setData({ view: this.data.stage }, () => this.onViewChanged());
  },

  /** The map only exists while step 3 is shown: measure it each time. */
  onViewChanged() {
    if (this.data.view !== 2 || !this.data.isDelivery) return;
    wx.createSelectorQuery()
      .select('#map')
      .boundingClientRect((rect) => {
        if (!rect || !rect.width) return;
        this.layout(rect.width, rect.height);
        if (this.rideStart) this.tick();
      })
      .exec();
  },

  startRide() {
    this.rideStart = Date.now();
    this.rideTimer = setInterval(() => this.tick(), TICK_MS);
    this.tick();
  },

  layout(w, h) {
    this.w = w;
    this.h = h;
    this.lengths = ROUTE.slice(1).map((p, i) => segLen(ROUTE[i], p, w, h));
    this.total = this.lengths.reduce((a, b) => a + b, 0);
    const segments = ROUTE.slice(1).map((p, i) => {
      const a = ROUTE[i];
      const horizontal = a[1] === p[1];
      return {
        horizontal,
        left: Math.min(a[0], p[0]) * w,
        top: Math.min(a[1], p[1]) * h,
        size: horizontal ? Math.abs(p[0] - a[0]) * w : Math.abs(p[1] - a[1]) * h,
      };
    });
    const start = ROUTE[0];
    const end = ROUTE[ROUTE.length - 1];
    this.setData({
      segments,
      pins: { start: { x: start[0] * w, y: start[1] * h }, end: { x: end[0] * w, y: end[1] * h } },
      moto: this.pointAt(this.progress()),
      mapReady: true,
    });
  },

  progress() {
    if (!this.rideStart) return 0;
    // Aim one tick ahead so the CSS transition ends where the courier is.
    return Math.min(1, (Date.now() - this.rideStart + TICK_MS) / RIDE_MS);
  },

  /** Position along the route for progress t in [0, 1]. */
  pointAt(t) {
    if (!this.total) return this.data.moto;
    let d = t * this.total;
    for (let i = 0; i < this.lengths.length; i += 1) {
      const a = ROUTE[i];
      const b = ROUTE[i + 1];
      if (d <= this.lengths[i] || i === this.lengths.length - 1) {
        const k = this.lengths[i] ? Math.min(1, d / this.lengths[i]) : 1;
        return {
          x: (a[0] + (b[0] - a[0]) * k) * this.w,
          y: (a[1] + (b[1] - a[1]) * k) * this.h,
          flip: b[0] < a[0],
        };
      }
      d -= this.lengths[i];
    }
    return this.data.moto;
  },

  tick() {
    const t = this.progress();
    const etaMin = Math.max(1, Math.ceil((1 - t) * ETA_MAX_MIN));
    const patch = { etaMin, etaLabel: String(etaMin) };
    if (this.data.mapReady && this.data.view === 2) patch.moto = this.pointAt(t);
    this.setData(patch);
    if (t >= 1) {
      clearInterval(this.rideTimer);
      if (typeof wx.vibrateShort === 'function') wx.vibrateShort({ type: 'medium', fail() {} });
      this.goStage(3);
    }
  },

  confirmReceived() {
    this.timers.forEach(clearTimeout);
    clearInterval(this.rideTimer);
    this.setData({ stage: 3, view: 3, done: true });
  },

  rate(e) { this.setData({ rating: Number(e.currentTarget.dataset.n) }) },
  callCourier() { wx.showToast({ title: 'Appel masqué vers Awa', icon: 'none' }) },
  messageCourier() { wx.showToast({ title: 'Message envoyé : « Je descends »', icon: 'none' }) },
  goHome() { home() },
  goReorder() { go('/pages/urgence/index') },
});
