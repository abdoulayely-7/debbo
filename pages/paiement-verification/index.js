import { MODES, getOrder } from '../../utils/debbo-order';

Page({
  data: {},
  onLoad() {
    this.timer = setTimeout(() => {
      const url = getOrder().mode === MODES.LIVRAISON
        ? '/pages/suivi-livraison/index'
        : '/pages/paiement-reussi/index';
      wx.redirectTo({ url });
    }, 2000);
  },
  onUnload() {
    clearTimeout(this.timer);
  },
});
