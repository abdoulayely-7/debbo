import { go, back } from '../../utils/helpers/debbo-nav';

Page({
  data: { selectedAmount: 1500 },
  goBack() { back() },
  goSolidaire() { go('/pages/solidaire/index') },
  goBuyRelative() { go('/pages/paiement-recap/index') },
  selectAmount(e) { this.setData({ selectedAmount: Number(e.currentTarget.dataset.amount) }) },
  giveAsso() { go('/pages/paiement-recap/index') },
});
