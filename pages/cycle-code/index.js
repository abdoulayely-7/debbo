Page({
  data: {
    code: '',
    dots: [false, false, false, false]
  },
  goBack() { wx.navigateBack() },
  pressKey(e) {
    const key = e.currentTarget.dataset.key;
    let code = this.data.code;
    if (key === '⌫') {
      code = code.slice(0, -1);
    } else if (code.length < 4) {
      code = code + key;
    }
    const dots = [code.length > 0, code.length > 1, code.length > 2, code.length > 3];
    this.setData({ code, dots });
    if (code.length === 4) {
      if (code === '1234') {
        wx.navigateTo({ url: '/pages/mon-cycle/index' });
      } else {
        setTimeout(() => {
          this.setData({ code: '', dots: [false, false, false, false] });
          wx.showToast({ title: 'Code incorrect', icon: 'none' });
        }, 300);
      }
    }
  },
  forgot() {
    wx.showToast({ title: 'Données effacées', icon: 'success' });
    this.setData({ code: '', dots: [false, false, false, false] });
  }
});
