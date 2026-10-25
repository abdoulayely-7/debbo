Page({
  data: {},
  onLoad() {
    // Delivery and pickup share the step-by-step order page.
    this.timer = setTimeout(() => {
      wx.redirectTo({ url: '/pages/suivi-livraison/index' });
    }, 2000);
  },
  onUnload() {
    clearTimeout(this.timer);
  },
});
