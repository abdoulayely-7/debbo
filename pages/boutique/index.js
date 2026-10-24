Page({
  data: {
    activeFilter: 'tout',
    products: [
      { id: 'serv', cat: 'prot', emoji: '🩹', name: 'Serviettes jour ×10', vendor: 'Pharmacie partenaire Sacré-Cœur', price: '1 000 FCFA', local: false },
      { id: 'lavwax', cat: 'prot', emoji: '🎨', name: 'Serviettes lavables en wax ×3', vendor: 'Atelier de couturières, Thiès', price: '4 500 FCFA', local: true },
      { id: 'cup', cat: 'prot', emoji: '🥤', name: 'Coupe menstruelle, taille S', vendor: 'Pharmacie partenaire Sacré-Cœur', price: '6 500 FCFA', local: false },
      { id: 'culm', cat: 'prot', emoji: '👙', name: 'Culotte menstruelle, flux moyen', vendor: 'Pharmacie partenaire Point E', price: '7 000 FCFA', local: false },
      { id: 'tamp', cat: 'prot', emoji: '🔵', name: 'Tampons flux normal ×16', vendor: 'Pharmacie partenaire Liberté', price: '2 500 FCFA', local: false },
      { id: 'gel', cat: 'hyg', emoji: '🧴', name: 'Gel intime doux, pH neutre 250 ml', vendor: 'Pharmacie partenaire Point E', price: '2 800 FCFA', local: false },
      { id: 'ling', cat: 'hyg', emoji: '🧻', name: 'Lingettes intimes ×20', vendor: 'Pharmacie partenaire Liberté', price: '1 200 FCFA', local: false },
      { id: 'patch', cat: 'bien', emoji: '🌡', name: 'Patchs chauffants ×4', vendor: 'Pharmacie partenaire Sacré-Cœur', price: '2 000 FCFA', local: false },
      { id: 'bouil', cat: 'bien', emoji: '🫙', name: 'Bouillotte sèche aux graines', vendor: 'GIE de femmes, Kaolack', price: '3 500 FCFA', local: true },
      { id: 'tis', cat: 'bien', emoji: '🍵', name: 'Tisane gingembre-citronnelle ×20', vendor: 'Coopérative de femmes, Ziguinchor', price: '1 500 FCFA', local: true },
      { id: 'trousse', cat: 'acc', emoji: '👜', name: 'Trousse discrète en wax', vendor: 'Atelier de couturières, Thiès', price: '2 500 FCFA', local: true },
      { id: 'cul3', cat: 'acc', emoji: '👗', name: 'Culottes coton ×3', vendor: 'Pharmacie partenaire Mermoz', price: '3 000 FCFA', local: false },
    ],
    filtered: [],
    cartCount: 0,
  },
  goBack() { wx.navigateBack() },
  goPanier() { wx.navigateTo({ url: '/pages/panier/index' }) },
  goFicheProduit() { wx.navigateTo({ url: '/pages/fiche-produit/index' }) },
  onLoad() {
    this.setData({ filtered: this.data.products });
  },
  setFilter(e) {
    const cat = e.currentTarget.dataset.cat;
    let filtered;
    if (cat === 'tout') filtered = this.data.products;
    else if (cat === 'local') filtered = this.data.products.filter(p => p.local);
    else filtered = this.data.products.filter(p => p.cat === cat);
    this.setData({ activeFilter: cat, filtered });
  },
});
