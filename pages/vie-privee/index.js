import { go, back } from '../../utils/helpers/debbo-nav';

Page({
  data: {},
  goBack() { back() },
  goConseils() { go('/pages/conseils/index') },
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
