/**
 * Custom Tab Bar (Debbo)
 * Rendered by /custom-tab-bar (app.json > tabBar.custom = true).
 * Four tabs plus a raised "Urgence" action in the middle, so the core
 * need ("J'ai besoin maintenant") is one tap away from every tab.
 *
 * Tab pages sync the highlight in onShow:
 *   this.getTabBar && this.getTabBar().setActiveTab('home')
 *
 * @property {string} activeTab - home | cycle | boutique | conseils
 * @fires change - detail: { tab }
 */
import { go } from '../../../../utils/helpers/debbo-nav';

const TABS = [
  { key: 'home', label: 'Accueil', icon: 'home', url: '/pages/accueil/index' },
  { key: 'cycle', label: 'Cycle', icon: 'cycle', url: '/pages/cycle-code/index' },
  { key: 'sos', label: 'Urgence', url: '/pages/urgence/index', action: true },
  { key: 'boutique', label: 'Boutique', icon: 'store', url: '/pages/boutique/index' },
  { key: 'conseils', label: 'Conseils', icon: 'tips', url: '/pages/conseils/index' },
];

Component({
  properties: {
    activeTab: { type: String, value: 'home' },
  },

  data: {
    tabs: TABS,
  },

  methods: {
    onTap(e) {
      const { key } = e.currentTarget.dataset;
      const tab = TABS.find((t) => t.key === key);
      if (!tab) return;

      if (tab.action) {
        go(tab.url);
        return;
      }
      if (key === this.data.activeTab) return;

      if (typeof wx.vibrateShort === 'function') {
        wx.vibrateShort({ type: 'light', fail() {} });
      }
      this.triggerEvent('change', { tab: key });
      go(tab.url);
    },
  },
});
