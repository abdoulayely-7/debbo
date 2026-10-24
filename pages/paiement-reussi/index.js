Page({
  data: {},
  goBack() { wx.navigateBack() },
  goHome() { wx.reLaunch({ url: '/pages/accueil/index' }) },
});
