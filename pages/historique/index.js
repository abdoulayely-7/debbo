import { go, back } from '../../utils/helpers/debbo-nav';

Page({
  data: {},
  goBack() { back() },
  goUrgence() { go('/pages/urgence/index') },
  showNotif() { wx.showToast({ title: 'Votre rappel Max it — Rappel discret', icon: 'none', duration: 2000 }) },
});
