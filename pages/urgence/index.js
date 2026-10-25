import { back, go } from '../../utils/helpers/debbo-nav';
import { MODES, setOrder } from '../../utils/debbo-order';

const KITS = {
  mini: { label: 'Kit Dépannage', amount: 500, priceLabel: '500 FCFA' },
  ess: { label: 'Kit Essentiel', amount: 1500, priceLabel: '1 500 FCFA' },
  conf: { label: 'Kit Confort', amount: 3000, priceLabel: '3 000 FCFA' },
  lav: { label: 'Kit Lavable', amount: 4500, priceLabel: '4 500 FCFA' },
};

Page({
  data: {
    mode: MODES.LIVRAISON,
    selectedPharma: 'p1',
    selectedKit: 'ess',
    kits: KITS,
  },
  onLoad(query) {
    if (query && KITS[query.kit]) this.setData({ selectedKit: query.kit });
  },
  goBack() { back() },
  goPay() {
    const kit = KITS[this.data.selectedKit];
    setOrder({ mode: this.data.mode, label: kit.label, amount: kit.amount });
    go('/pages/paiement-recap/index');
  },
  goNosKits() { go('/pages/nos-kits/index') },
  selectMode(e) { this.setData({ mode: e.currentTarget.dataset.mode }) },
  selectPharma(e) { this.setData({ selectedPharma: e.currentTarget.dataset.pharma }) },
  selectKit(e) { this.setData({ selectedKit: e.currentTarget.dataset.kit }) },
});
