Page({
  data: {
    pin: '',
    dots: [false, false, false, false],
  },
  goBack() { wx.navigateBack() },
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
        wx.navigateTo({ url: '/pages/paiement-verification/index' });
      }, 300);
    }
  },
});
