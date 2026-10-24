Page({
  data: {},
  goBack() { wx.navigateBack() },
  goUrgence() { wx.navigateTo({ url: '/pages/urgence/index' }) },
  showNotif() { wx.showToast({ title: 'Votre rappel Max it — Rappel discret', icon: 'none', duration: 2000 }) },
});
