Page({
  data: { selectedAmount: 1500 },
  goBack() { wx.navigateBack() },
  goSolidaire() { wx.navigateTo({ url: '/pages/solidaire/index' }) },
  goBuyRelative() { wx.navigateTo({ url: '/pages/paiement-recap/index' }) },
  selectAmount(e) { this.setData({ selectedAmount: Number(e.currentTarget.dataset.amount) }) },
  giveAsso() { wx.navigateTo({ url: '/pages/paiement-recap/index' }) },
});
