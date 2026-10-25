import { back, go } from '../../utils/helpers/debbo-nav';
import { MODES, formatFcfa, setOrder } from '../../utils/debbo-order';

Page({
  data: {
    mode: MODES.LIVRAISON,
    items: [
      { id: 'lavwax', name: 'Serviettes lavables en wax ×3', vendor: 'Atelier de couturières, Thiès', price: 4500, qty: 1 },
      { id: 'tis', name: 'Tisane gingembre-citronnelle ×20', vendor: 'Coopérative de femmes, Ziguinchor', price: 1500, qty: 1 },
    ],
    total: '',
  },
  onLoad() { this.refreshTotal(this.data.items) },
  goBack() { back() },
  goPay() {
    const amount = this.data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    if (!amount) return;
    setOrder({ mode: this.data.mode, label: 'Panier Boutique', amount });
    go('/pages/paiement-recap/index');
  },
  selectMode(e) { this.setData({ mode: e.currentTarget.dataset.mode }) },
  changeQty(e) {
    const { id, d } = e.currentTarget.dataset;
    const items = this.data.items
      .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + Number(d)) } : item))
      .filter((item) => item.qty > 0);
    this.refreshTotal(items);
  },
  refreshTotal(items) {
    const amount = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    this.setData({ items, total: formatFcfa(amount) });
  },
});
