import { go } from '../../utils/helpers/debbo-nav';
import { getReminder } from '../../utils/debbo-reminder';
import { getCyclePhase, getCycleProjection, getCycleSettings } from '../../utils/debbo-cycle';

const getPeriodCountdown = (days, phase, overdueDays = 0, trackingEnabled = true) => {
  if (!trackingEnabled) {
    return {
      bannerCountdown: 'Suivi désactivé',
      bannerStatus: 'Mon cycle',
      bannerUrgent: false,
      periodTileText: 'Suivi désactivé',
    };
  }
  if (days === null) {
    return {
      bannerCountdown: 'Ajoutez vos dates',
      bannerStatus: 'Mon cycle',
      bannerUrgent: false,
      periodTileText: 'Renseignez le calendrier',
    };
  }
  if (overdueDays > 0) {
    return {
      bannerCountdown: `Date estimée dépassée de ${overdueDays} ${overdueDays === 1 ? 'jour' : 'jours'}`,
      bannerStatus: 'Urgent',
      bannerUrgent: true,
      periodTileText: 'Date estimée dépassée',
    };
  }
  if (days === 0) {
    return {
      bannerCountdown: 'Vos règles aujourd’hui',
      bannerStatus: 'Urgent',
      bannerUrgent: true,
      periodTileText: 'Règles aujourd’hui',
    };
  }
  const duration = `${days} ${days === 1 ? 'jour' : 'jours'}`;
  return {
    bannerCountdown: `Vos règles dans ${duration}`,
    bannerStatus: days < 5 ? 'Urgent' : phase,
    bannerUrgent: days < 5,
    periodTileText: `Règles dans ${duration}`,
  };
};

Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActiveTab('home');
    }
    const r = getReminder();
    const cycleSettings = getCycleSettings();
    const projection = getCycleProjection(cycleSettings);
    const countdown = getPeriodCountdown(
      projection.daysUntilPeriod,
      getCyclePhase(projection.cycleDay, projection.cycleLength),
      projection.overdueDays,
      projection.trackingEnabled,
    );
    this.setData({
      reminderText: r.enabled ? `Rappel kit J-${r.daysBefore}` : 'Rappel kit désactivé',
      ...countdown,
    });
  },
  data: {
    reminderText: '',
    bannerCountdown: '',
    bannerStatus: '',
    bannerUrgent: false,
    periodTileText: '',
  },
  goToUrgence() { go('/pages/urgence/index') },
  goToCycle() { go('/pages/cycle-code/index') },
  goToBoutique() { go('/pages/boutique/index') },
  goToNosKits() { go('/pages/nos-kits/index') },
  goToConseils() { go('/pages/conseils/index') },
  goToSolidaire() { go('/pages/solidaire/index') },
  goToHistorique() { go('/pages/historique/index') },
  goToVieprivee() { go('/pages/vie-privee/index') },
  goToReorder() { go('/pages/urgence/index') },
});
