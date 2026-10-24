Page({
  data: {
    mode: 'retrait',
    items: [
      { id: 'lavwax', name: 'Serviettes lavables en wax ×3', price: 4500, qty: 1 },
      { id: 'tis', name: 'Tisane gingembre-citronnelle ×20', price: 1500, qty: 1 },
    ],
  },
  goBack() { wx.navigateBack() },
  goPay() { wx.navigateTo({ url: '/pages/paiement-recap/index' }) },
  selectMode(e) { this.setData({ mode: e.currentTarget.dataset.mode }) },
  changeQty(e) {
    const { id, d } = e.currentTarget.dataset;
    const items = this.data.items.map(item => {
      if (item.id === id) {
        const qty = Math.max(0, item.qty + Number(d));
        return { ...item, qty };
      }
      return item;
    }).filter(item => item.qty > 0);
    this.setData({ items });
  },
  get total() {
    return this.data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
});
