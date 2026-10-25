import { go } from '../../utils/helpers/debbo-nav';
import { PRODUCTS } from '../../utils/debbo-catalog';

const FILTERS = [
  { key: 'tout', label: 'Tout' },
  { key: 'prot', label: 'Protections' },
  { key: 'hyg', label: 'Hygiène' },
  { key: 'bien', label: 'Bien-être' },
  { key: 'acc', label: 'Accessoires' },
  { key: 'local', label: 'Fait au Sénégal' },
];

Page({
  data: {
    filters: FILTERS,
    activeFilter: 'tout',
    filtered: PRODUCTS,
    cartCount: 0,
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActiveTab('boutique');
    }
  },
  goPanier() { go('/pages/panier/index') },
  goFicheProduit(e) { go(`/pages/fiche-produit/index?id=${e.currentTarget.dataset.id}`) },
  addQuick() {
    this.setData({ cartCount: this.data.cartCount + 1 });
    wx.showToast({ title: 'Ajouté au panier', icon: 'none', duration: 1200 });
  },
  setFilter(e) {
    const cat = e.currentTarget.dataset.cat;
    let filtered = PRODUCTS;
    if (cat === 'local') filtered = PRODUCTS.filter((p) => p.local);
    else if (cat !== 'tout') filtered = PRODUCTS.filter((p) => p.cat === cat);
    this.setData({ activeFilter: cat, filtered });
  },
});
