Page({
  data: {
    mode: 'retrait',
    selectedPharma: 'p1',
    selectedKit: 'ess',
  },
  goBack() { wx.navigateBack() },
  goPay() { wx.navigateTo({ url: '/pages/paiement-recap/index' }) },
  goNosKits() { wx.navigateTo({ url: '/pages/nos-kits/index' }) },
  selectMode(e) { this.setData({ mode: e.currentTarget.dataset.mode }) },
  selectPharma(e) { this.setData({ selectedPharma: e.currentTarget.dataset.pharma }) },
  selectKit(e) { this.setData({ selectedKit: e.currentTarget.dataset.kit }) },
});
