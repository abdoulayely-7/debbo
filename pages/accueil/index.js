import { go } from '../../utils/helpers/debbo-nav';
import { getReminder } from '../../utils/debbo-reminder';

Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActiveTab('home');
    }
    const r = getReminder();
    this.setData({ reminderText: r.enabled ? `Rappel kit J-${r.daysBefore}` : 'Rappel kit désactivé' });
  },
  data: {
    reminderText: '',
  },
  goToUrgence() { go('/pages/urgence/index') },
  goToCycle() { go('/pages/cycle-code/index') },
  goToBoutique() { go('/pages/boutique/index') },
  goToNosKits() { go('/pages/nos-kits/index') },
  goToConseils() { go('/pages/conseils/index') },
  goToSolidaire() { go('/pages/solidaire/index') },
  goToHistorique() { go('/pages/historique/index') },
  goToVieprivee() { go('/pages/vie-privee/index') },
  goToReorder() { go('/pages/urgence/index') },
});
