// ============================================================================
// DEBBO CATALOG
// Demo data shared by Boutique, Fiche produit, Panier and Nos kits.
// Photos: /assets/images (sources and licences in assets/images/CREDITS.md).
// ============================================================================

import { formatFcfa } from './debbo-order';

const IMG = '/assets/images/products/';

export const PRODUCTS = [
  { id: 'serv', cat: 'prot', name: 'Serviettes jour ×10', vendor: 'Pharmacie partenaire Sacré-Cœur', price: 1000, local: false,
    desc: 'Serviettes avec ailettes, 24 cm, pour un flux moyen. Vendues en pharmacie.' },
  { id: 'lavwax', cat: 'prot', name: 'Serviettes lavables en wax ×3', vendor: 'Atelier de couturières, Thiès', price: 4500, local: true,
    desc: 'Coton absorbant, dessus en wax, pression pour fixer à la culotte. Environ 2 ans d\'usage.' },
  { id: 'cup', cat: 'prot', name: 'Coupe menstruelle, taille S', vendor: 'Pharmacie partenaire Sacré-Cœur', price: 6500, local: false,
    desc: 'Silicone médical, jusqu\'à 8 h. Se stérilise à l\'eau bouillante entre deux cycles.' },
  { id: 'culm', cat: 'prot', name: 'Culotte menstruelle, flux moyen', vendor: 'Pharmacie partenaire Point E', price: 7000, local: false,
    desc: 'Remplace 2 à 3 serviettes. Se rince à l\'eau froide puis se lave en machine.' },
  { id: 'tamp', cat: 'prot', name: 'Tampons flux normal ×16', vendor: 'Pharmacie partenaire Liberté', price: 2500, local: false,
    desc: 'À changer toutes les 4 à 6 heures. Notice en français dans la boîte.' },
  { id: 'gel', cat: 'hyg', name: 'Gel intime doux, pH neutre 250 ml', vendor: 'Pharmacie partenaire Point E', price: 2800, local: false,
    desc: 'Sans savon ni parfum, pour la toilette externe uniquement.' },
  { id: 'ling', cat: 'hyg', name: 'Lingettes intimes ×20', vendor: 'Pharmacie partenaire Liberté', price: 1200, local: false,
    desc: 'Sans alcool, pratiques à l\'école ou au travail.' },
  { id: 'patch', cat: 'bien', name: 'Patchs chauffants ×4', vendor: 'Pharmacie partenaire Sacré-Cœur', price: 2000, local: false,
    desc: 'Chaleur douce pendant 8 h contre les crampes. Ne pas poser sur la peau nue.' },
  { id: 'bouil', cat: 'bien', name: 'Bouillotte sèche aux graines', vendor: 'GIE de femmes, Kaolack', price: 3500, local: true,
    desc: 'Se chauffe 1 min au micro-ondes. Housse lavable cousue à la main.' },
  { id: 'tis', cat: 'bien', name: 'Tisane gingembre-citronnelle ×20', vendor: 'Coopérative de femmes, Ziguinchor', price: 1500, local: true,
    desc: 'Gingembre et citronnelle de Casamance. Une tasse chaude soulage les crampes légères.' },
  { id: 'trousse', cat: 'acc', name: 'Trousse discrète en wax', vendor: 'Atelier de couturières, Thiès', price: 2500, local: true,
    desc: 'Doublure imperméable, deux poches. Rien n\'indique ce qu\'elle contient.' },
  { id: 'cul3', cat: 'acc', name: 'Culottes coton ×3', vendor: 'Pharmacie partenaire Mermoz', price: 3000, local: false,
    desc: 'Coton respirant, tailles S à XL.' },
].map((p) => ({ ...p, image: `${IMG}${p.id}.jpg`, priceLabel: `${formatFcfa(p.price)} FCFA` }));

export const KITS = [
  { id: 'mini', name: 'Kit Dépannage', image: `${IMG}serv.jpg`, price: 500, tag: 'Petit budget', tagClass: 'db-chip-ok',
    pitch: 'Pour tenir une demi-journée, le temps de rentrer.',
    items: [['×3', 'Serviettes jour', 'ailettes, 24 cm'], ['×2', 'Lingettes intimes', 'sans alcool'], ['×1', 'Sachet opaque refermable', 'pour jeter discrètement']] },
  { id: 'ess', name: 'Kit Essentiel', image: `${IMG}serv-nuit.jpg`, price: 1500, tag: 'Le plus choisi', tagClass: 'db-chip-ind',
    pitch: 'Pour un cycle de 4 à 5 jours avec un flux moyen.',
    items: [['×8', 'Serviettes jour', 'ailettes, 24 cm'], ['×2', 'Serviettes nuit', '29 cm, plus absorbantes'], ['×4', 'Lingettes intimes', 'sans alcool'], ['×2', 'Sachets opaques refermables', '']] },
  { id: 'conf', name: 'Kit Confort', image: `${IMG}patch.jpg`, price: 3000, tag: 'Douleurs', tagClass: 'db-chip-acc',
    pitch: 'Le Kit Essentiel, plus de quoi soulager les crampes.',
    items: [['×1', 'Kit Essentiel', 'contenu complet'], ['×2', 'Patchs chauffants', '8 h de chaleur'], ['×1', 'Culotte de rechange', 'coton']] },
  { id: 'lav', name: 'Kit Lavable', image: `${IMG}lavwax.jpg`, price: 4500, tag: 'Économique sur la durée', tagClass: 'db-chip-ind',
    pitch: 'Cousu à Thiès, réutilisable environ 2 ans.',
    items: [['×3', 'Serviettes lavables en wax', 'coton absorbant'], ['×1', 'Trousse imperméable', 'pour le transport']] },
].map((k) => ({ ...k, priceLabel: `${formatFcfa(k.price)} FCFA` }));

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
