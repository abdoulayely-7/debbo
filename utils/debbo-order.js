// ============================================================================
// DEBBO ORDER
// Keeps the order being paid (delivery mode, label, amount) across the
// payment pages. Stored on the device only, like the cycle data.
// ============================================================================

const KEY = 'debbo.order';

export const MODES = {
  LIVRAISON: 'livraison',
  RETRAIT: 'retrait',
};

const DEFAULT_ORDER = {
  mode: MODES.LIVRAISON,
  label: 'Kit Essentiel',
  amount: 1500,
};

export const getOrder = () => {
  try {
    return { ...DEFAULT_ORDER, ...(wx.getStorageSync(KEY) || {}) };
  } catch (e) {
    return { ...DEFAULT_ORDER };
  }
};

export const setOrder = (patch) => {
  const next = { ...getOrder(), ...patch };
  try {
    wx.setStorageSync(KEY, next);
  } catch (e) {
    console.warn('[Debbo order] storage unavailable', e);
  }
  return next;
};

/** 6000 -> "6 000" (French thousands separator used across the app). */
export const formatFcfa = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
