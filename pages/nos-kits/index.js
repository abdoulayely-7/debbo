import { go } from '../../utils/helpers/debbo-nav';
import { KITS } from '../../utils/debbo-catalog';

Page({
  data: {
    kits: KITS,
  },
  goCommander(e) { go(`/pages/urgence/index?kit=${e.currentTarget.dataset.id}`) },
  goBoutique() { go('/pages/boutique/index') },
});
