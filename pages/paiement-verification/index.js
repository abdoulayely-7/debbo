Page({
  data: {},
  onLoad() {
    setTimeout(() => {
      wx.redirectTo({ url: '/pages/paiement-reussi/index' });
    }, 2000);
  },
});
