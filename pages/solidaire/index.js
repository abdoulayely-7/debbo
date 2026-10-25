import { go, back } from '../../utils/helpers/debbo-nav';

Page({
  data: { defaultRound: false },
  goBack() { back() },
  goOffrir() { go('/pages/offrir-kit/index') },
  goBoutique() { go('/pages/boutique/index') },
  toggleDefault() { this.setData({ defaultRound: !this.data.defaultRound }) },
});
