import { go, back } from '../../utils/helpers/debbo-nav';

Page({
  data: {
    pin: '',
    dots: [false, false, false, false],
  },
  goBack() { back() },
  pressKey(e) {
    const key = e.currentTarget.dataset.key;
    let pin = this.data.pin;
    if (key === '⌫') {
      pin = pin.slice(0, -1);
    } else if (pin.length < 4) {
      pin = pin + key;
    }
    const dots = [pin.length > 0, pin.length > 1, pin.length > 2, pin.length > 3];
    this.setData({ pin, dots });
    if (pin.length === 4) {
      setTimeout(() => {
        go('/pages/paiement-verification/index');
      }, 300);
    }
  },
});
