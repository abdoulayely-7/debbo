Page({
  data: {},
  goBack() { wx.navigateBack() },
  addToCart() { wx.navigateTo({ url: '/pages/panier/index' }) },
});
