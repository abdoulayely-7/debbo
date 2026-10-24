Page({
  data: {},
  goBack() { wx.navigateBack() },
  goConseils() { wx.navigateTo({ url: '/pages/conseils/index' }) },
  wipeAll() {
    wx.showModal({
      title: 'Tout effacer',
      content: 'Supprimer toutes vos données Debbo de ce téléphone ?',
      success: (res) => {
        if (res.confirm) wx.showToast({ title: 'Données effacées', icon: 'success' });
      }
    });
  },
});
