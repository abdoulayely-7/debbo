import { back, go } from '../../utils/helpers/debbo-nav';
import { formatFcfa, getOrder } from '../../utils/debbo-order';

Page({
  data: {
    order: {},
    amountLabel: '',
  },
  onShow() {
    const order = getOrder();
    this.setData({ order, amountLabel: formatFcfa(order.amount) });
  },
  goBack() { back() },
  goConfirm() { go('/pages/paiement-code/index') },
});
