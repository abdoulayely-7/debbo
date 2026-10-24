Page({
  data: {},
  goBack() { wx.navigateBack() },
  goConfirm() { wx.navigateTo({ url: '/pages/paiement-code/index' }) },
});
