import { navigateBack } from '../../../utils/helpers/navigation';

/**
 * Nav Bar Component
 * Custom navigation bar with safe area handling, back button, and title.
 * Reads system status bar height to position content below the notch,
 * and keeps clear of the host capsule (top-right menu button).
 *
 * @example
 * <app-nav-bar title="Settings" sub="Compte" showBack>
 *   <view slot="right">…</view>
 * </app-nav-bar>
 *
 * @property {string} title - Navigation bar title text
 * @property {string} sub - Optional subtitle under the title
 * @property {boolean} showBack - Show back arrow (default: true)
 * @property {string} backIcon - Image path for the back arrow (default: text chevron)
 * @property {string} fallbackUrl - Opened when there is no page to go back to
 * @property {boolean} transparent - Use transparent background
 *
 * @fires back - Before navigating back
 */
Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    title: { type: String, value: '' },
    sub: { type: String, value: '' },
    showBack: { type: Boolean, value: true },
    backIcon: { type: String, value: '/assets/icons/back.svg' },
    fallbackUrl: { type: String, value: '/pages/accueil/index' },
    transparent: { type: Boolean, value: false },
  },

  data: {
    statusBarHeight: 0,
    navHeight: 44,
    capsuleSpace: 8,
  },

  lifetimes: {
    attached() {
      const sysInfo = wx.getSystemInfoSync();
      const data = { statusBarHeight: sysInfo.statusBarHeight || 20 };

      // Leave room for the host capsule so slot content is never covered.
      const rect = typeof wx.getMenuButtonBoundingClientRect === 'function'
        ? wx.getMenuButtonBoundingClientRect()
        : null;
      if (rect && rect.left) {
        data.capsuleSpace = Math.max(8, sysInfo.windowWidth - rect.left + 8);
      }

      this.setData(data);
    },
  },

  methods: {
    goBack() {
      this.triggerEvent('back');
      return navigateBack(1, this.data.fallbackUrl);
    },
  },
});
