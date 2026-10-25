import { go } from '../../utils/helpers/debbo-nav';

Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActiveTab('home');
    }
  },
  data: {},
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
