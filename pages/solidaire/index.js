Page({
  data: { defaultRound: false },
  goBack() { wx.navigateBack() },
  goOffrir() { wx.navigateTo({ url: '/pages/offrir-kit/index' }) },
  goBoutique() { wx.navigateTo({ url: '/pages/boutique/index' }) },
  toggleDefault() { this.setData({ defaultRound: !this.data.defaultRound }) },
});
