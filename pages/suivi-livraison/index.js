import { home } from '../../utils/helpers/debbo-nav';
import { getOrder } from '../../utils/debbo-order';

// Route on the stylised map, in fractions of its width/height (axis-aligned
// streets). Swap for <map> + MapContext.translateMarker when the host ships
// a map SDK.
const ROUTE = [[0.16, 0.82], [0.16, 0.55], [0.47, 0.55], [0.47, 0.32], [0.8, 0.32], [0.8, 0.2]];
const TICK_MS = 1600;        // one setData per tick, CSS interpolates between
const RIDE_MS = 45000;       // demo ride duration
const PREP_MS = 3000;        // "préparée en pharmacie" before the ride starts
const ETA_MAX_MIN = 14;

const segLen = (a, b, w, h) => Math.abs((b[0] - a[0]) * w) + Math.abs((b[1] - a[1]) * h);

Page({
  data: {
    order: {},
    stage: 'prep',            // prep | ride | arrived
    etaMin: ETA_MAX_MIN,
    moto: { x: 0, y: 0, flip: false },
    segments: [],
    pins: {},
    ready: false,
    courier: { name: 'Awa', plate: 'DK-4821-B', rating: '4,9' },
    handoverCode: '4821',
  },

  onLoad() {
    this.setData({ order: getOrder() });
  },

  onReady() {
    wx.createSelectorQuery()
      .select('#map')
      .boundingClientRect((rect) => {
        if (!rect) return;
        this.layout(rect.width, rect.height);
        this.startAt = Date.now();
        this.timer = setInterval(() => this.tick(), TICK_MS);
        this.tick();
      })
      .exec();
  },

  onUnload() {
    clearInterval(this.timer);
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
      pins: {
        start: { x: start[0] * w, y: start[1] * h },
        end: { x: end[0] * w, y: end[1] * h },
      },
      moto: { x: start[0] * w, y: start[1] * h, flip: false },
      ready: true,
    });
  },

  /** Position along the route for progress t in [0, 1]. */
  pointAt(t) {
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
    const elapsed = Date.now() - this.startAt;
    if (elapsed < PREP_MS) return;

    // Aim one tick ahead so the CSS transition ends where the courier is.
    const t = Math.min(1, (elapsed - PREP_MS + TICK_MS) / RIDE_MS);
    const arrived = t >= 1;
    this.setData({
      stage: arrived ? 'arrived' : 'ride',
      moto: this.pointAt(t),
      etaMin: Math.max(1, Math.ceil((1 - t) * ETA_MAX_MIN)),
    });

    if (arrived) {
      clearInterval(this.timer);
      if (typeof wx.vibrateShort === 'function') wx.vibrateShort({ type: 'medium', fail() {} });
    }
  },

  callCourier() {
    wx.showToast({ title: 'Appel masqué vers Awa', icon: 'none' });
  },

  messageCourier() {
    wx.showToast({ title: 'Message envoyé : « Je descends »', icon: 'none' });
  },

  goHome() { home() },
});
