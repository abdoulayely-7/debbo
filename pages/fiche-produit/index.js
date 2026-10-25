import { go } from '../../utils/helpers/debbo-nav';
import { findProduct } from '../../utils/debbo-catalog';

Page({
  data: {
    product: {},
  },
  onLoad(query) {
    this.setData({ product: findProduct(query && query.id) });
  },
  addToCart() { go('/pages/panier/index') },
});
