Page({
  data: {
    trackingOn: true,
    days: [
      { label: 'jeu', num: 22, today: true,  period: false, remind: false },
      { label: 'ven', num: 23, today: false, period: false, remind: false },
      { label: 'sam', num: 24, today: false, period: false, remind: true  },
      { label: 'dim', num: 25, today: false, period: false, remind: true  },
      { label: 'lun', num: 26, today: false, period: false, remind: true  },
      { label: 'mar', num: 27, today: false, period: true,  remind: false },
      { label: 'mer', num: 28, today: false, period: true,  remind: false },
      { label: 'jeu', num: 29, today: false, period: true,  remind: false },
      { label: 'ven', num: 30, today: false, period: true,  remind: false },
      { label: 'sam', num: 31, today: false, period: true,  remind: false },
      { label: 'dim', num: 1,  today: false, period: false, remind: false },
      { label: 'lun', num: 2,  today: false, period: false, remind: false },
    ]
  },
  goBack() { wx.navigateBack() },
  goToReorder() { wx.navigateTo({ url: '/pages/urgence/index' }) },
  toggleTracking() {
    this.setData({ trackingOn: !this.data.trackingOn });
  },
  showNotif() {
    wx.showToast({ title: 'Votre rappel Max it — J-3', icon: 'none', duration: 2000 });
  },
  wipeData() {
    wx.showModal({
      title: 'Effacer les données',
      content: 'Voulez-vous effacer toutes vos données de cycle ?',
      success: (res) => {
        if (res.confirm) wx.showToast({ title: 'Données effacées', icon: 'success' });
      }
    });
  }
});
