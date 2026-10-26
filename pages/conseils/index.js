import { back } from '../../utils/helpers/debbo-nav';
import { ADVICE_PRODUCTS } from '../../utils/debbo-catalog';

Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActiveTab('conseils');
    }
  },
  data: {
    adviceProducts: ADVICE_PRODUCTS,
    sections: [
      {
        id: 0, open: true,
        q: 'Toutes les combien changer de protection ?',
        body: 'Une serviette jetable se change toutes les 4 à 6 heures, plus souvent si le flux est abondant. Ne gardez pas la même toute la journée, même si elle semble peu remplie.\n\nUne serviette lavable se rince à l\'eau froide, puis se lave au savon et sèche au soleil.',
        note: 'Relu par une sage-femme partenaire · mis à jour oct. 2026',
      },
      {
        id: 1, open: false,
        q: 'Douleurs : qu\'est-ce qui aide ?',
        body: 'La chaleur sur le bas du ventre, la marche douce et une bonne hydratation soulagent souvent. Le paracétamol peut aider ; demandez conseil au pharmacien pour le dosage.\n\nUne douleur qui vous empêche d\'aller au travail ou en cours n\'est pas « normale » : parlez-en à une sage-femme.',
        note: '',
      },
      {
        id: 2, open: false,
        q: 'Quand consulter sans attendre',
        body: 'Saignements qui remplissent une protection en moins d\'une heure, plusieurs heures de suite.\n\nFièvre, malaise ou vertiges pendant les règles.\n\nRègles absentes plus de 3 mois, ou saignements entre les règles.',
        note: '',
      },
      {
        id: 3, open: false,
        q: 'Vrai ou faux ? Ce qu\'on lit sur les réseaux',
        body: '',
        myths: [
          { type: 'warn', label: 'Faux', text: '« Il ne faut pas se laver pendant les règles. » Une toilette quotidienne à l\'eau claire est recommandée.' },
          { type: 'warn', label: 'Faux', text: '« Un sang foncé veut dire qu\'on est malade. » La couleur varie naturellement au fil des jours.' },
          { type: 'ok', label: 'Vrai', text: '« Le cycle peut changer avec le stress ou un voyage. » Un décalage de quelques jours est courant.' },
        ],
        note: '',
      },
    ],
  },
  goBack() { back() },
  toggleSection(e) {
    const id = e.currentTarget.dataset.id;
    const sections = this.data.sections.map(s => ({ ...s, open: s.id === id ? !s.open : s.open }));
    this.setData({ sections });
  },
  askQuestion() {
    wx.showToast({ title: 'Question envoyée. Vous recevrez une notification « Nouveau message Bien-être ».', icon: 'none', duration: 2500 });
  },
});
