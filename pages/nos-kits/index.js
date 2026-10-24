Page({
  data: {},
  goBack() { wx.navigateBack() },
  goRetirer() { wx.navigateTo({ url: '/pages/urgence/index' }) },
  goBoutique() { wx.navigateTo({ url: '/pages/boutique/index' }) },
});
