// ============================================================================
// DEBBO NAVIGATION
// Single entry point for page changes in the Debbo mini-app.
//
// Why: with a tabBar, wx.navigateTo silently fails on tab pages (only
// switchTab / reLaunch may open them), and wx.navigateBack does nothing when
// the page is the only one on the stack (deep link, DevTools compile mode,
// after reLaunch). These helpers pick the right API for each case.
// ============================================================================

import { navigateBack, navigateTo } from './navigation';

export const HOME = '/pages/accueil/index';

/** Pages declared in app.json > tabBar.list (keep in sync). */
export const TAB_PAGES = [
  '/pages/accueil/index',
  '/pages/mon-cycle/index',
  '/pages/boutique/index',
  '/pages/conseils/index',
];

const isTabPage = (url) => TAB_PAGES.indexOf(url.split('?')[0]) !== -1;

/**
 * Opens a page, using switchTab for tab pages and a stack-safe navigateTo
 * for the others.
 * @param {string} url
 */
export const go = (url) => {
  if (isTabPage(url)) {
    return wx.switchTab({ url: url.split('?')[0] });
  }
  return navigateTo(url).catch((err) => console.warn('[Debbo nav]', err));
};

/**
 * Goes back one page, or home when there is nothing to go back to.
 */
export const back = () => {
  return navigateBack(1, HOME);
};

/** Clears the stack and lands on the home tab (end of a purchase flow). */
export const home = () => wx.switchTab({ url: HOME });
