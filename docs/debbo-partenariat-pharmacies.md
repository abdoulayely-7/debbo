# Debbo — Partenariat pharmacies et faisabilité

Document de préparation pour le hackathon : comment fonctionne le partenariat avec les pharmacies, ce qu'on leur dit, ce qu'on dit au jury, et pourquoi le projet est réalisable.

> **Statut honnête :** les pharmacies affichées dans la démo (« Pharmacie partenaire Sacré-Cœur », « Liberté », « Point E », « Mermoz ») sont **fictives**. Aucun accord n'est signé à ce jour. On présente un **modèle de partenariat** et un **plan de pilote**, pas des partenaires existants.

---

## 1. Le partenariat en une phrase

La pharmacie de quartier prépare un kit d'hygiène menstruelle déjà payé dans Max it. Elle le remet sur présentation d'un code, au comptoir ou à un livreur. Personne n'a rien à demander à voix haute.

## 2. Pourquoi passer par les pharmacies

| Atout | Pourquoi c'est important pour Debbo |
|---|---|
| **Maillage dense** | Le Sénégal compte plus d'un millier d'officines privées (les sources varient entre ~1 060 et ~1 700 selon l'année), dont plus de 500 dans la région de Dakar. Une pharmacie est presque toujours à quelques minutes à pied. |
| **Confiance** | Les produits viennent d'un circuit contrôlé : pas de contrefaçon, pas de produits périmés. |
| **Horaires** | Les officines ouvrent tard, et les pharmacies de garde couvrent la nuit et le week-end, c'est-à-dire précisément les moments d'urgence. |
| **Stock existant** | Serviettes, tampons, lingettes et coupes sont déjà vendus en officine. Debbo n'ajoute pas de logistique de stock. |
| **Discrétion** | Le comptoir de pharmacie est un lieu neutre. Avec un code, la cliente n'a même pas besoin de nommer le produit. |

## 3. Ce que la pharmacie y gagne

- **Des ventes en plus** : des clientes qui, sinon, auraient acheté au marché ou dans une boutique, ou se seraient débrouillées sans protection.
- **Un paiement garanti** : la commande est payée dans Max it avant d'arriver au comptoir. Pas d'impayé, pas de monnaie à rendre.
- **Aucun investissement** : pas de matériel à acheter, pas de logiciel à installer (voir section 5).
- **Une image positive** : participer à « Debbo Solidaire » (kits pour les élèves) est un geste visible dans le quartier.
- **Du passage** : une cliente qui retire son kit peut acheter autre chose sur place.

**Modèle économique proposé (à valider en pilote) :** la pharmacie vend au prix public. Debbo prend une commission sur chaque kit vendu par l'app. Le taux se négocie avec les premières pharmacies, et on ne l'annonce pas au jury comme un chiffre acquis.

## 4. Ce que fait la pharmacie, concrètement

### Retrait au comptoir

1. La cliente paie dans Max it. La pharmacie reçoit une notification : « Commande DB-9126 · Kit Essentiel ».
2. Le pharmacien prépare le kit dans un **sachet opaque** fourni par Debbo, avec seulement le code écrit dessus.
3. La cliente montre le code **DB-9126** au comptoir.
4. Le pharmacien vérifie le code et remet le sachet. La commande passe à « Remis ».

### Livraison

1. Les étapes 1 et 2 sont identiques.
2. Un livreur partenaire passe récupérer le sachet scellé.
3. Chez la cliente, celle-ci donne au livreur le **code de remise** (ex. 4821) affiché dans l'app. Le livreur ne connaît pas le contenu du sachet.

### Kits pré-assemblés

Pour aller vite aux heures de pointe, la pharmacie peut préparer à l'avance quelques kits de chaque type (Dépannage, Essentiel, Confort, Lavable). Le contenu est fixe et identique dans toutes les pharmacies, ce qui évite les erreurs.

## 5. L'outil côté pharmacie

L'outil est volontairement minimal pour le pilote :

- **Une page web simple** (« Debbo Pharmacie ») ouverte sur le téléphone ou la tablette du comptoir. Elle affiche la liste des commandes, un bouton « Prêt » et un champ pour vérifier le code.
- **Une alerte** par SMS ou WhatsApp à chaque nouvelle commande, pour ne rien rater si la page n'est pas ouverte.
- **Aucune intégration** au logiciel de gestion de l'officine pour le pilote. Le stock reste géré comme d'habitude.

C'est ce qui rend le partenariat facile à accepter : en 10 minutes de formation, le personnel sait s'en servir.

## 6. La livraison

Debbo **n'emploie pas de livreurs**. La livraison passe par un acteur existant du dernier kilomètre à Dakar :

- **Paps** (startup sénégalaise de livraison, active depuis 2016) ;
- **Yango Delivery** (livraison moto à Dakar depuis 2022).

Pour le pilote, la course peut être commandée manuellement depuis l'outil pharmacie. Une intégration par API vient ensuite, si les volumes le justifient. L'écran de suivi « moto » de la démo montre l'expérience visée. La position réelle du livreur viendra de l'API du partenaire de livraison.

## 7. Le paiement

- La cliente paie dans **Max it**, avec son code secret habituel. Debbo est une mini-app du Max Store, comme d'autres services partenaires déjà intégrés (par exemple la billetterie du BRT de Dakar).
- Dans l'historique Max it, la ligne s'affiche comme **« Achat Bien-être »**, sans nom de produit.
- Il y a deux options pour reverser l'argent aux pharmacies, à trancher avec Orange :
  1. Debbo est le marchand unique et reverse chaque semaine à chaque pharmacie sa part, moins la commission ;
  2. chaque pharmacie a son propre compte marchand Orange Money et Debbo facture sa commission à part.

## 8. Cadre réglementaire et vie privée

- **Pas de médicaments** : Debbo vend uniquement des produits d'hygiène et de bien-être (serviettes, tampons, lingettes, coupes, culottes, patchs chauffants, tisane). Aucune ordonnance n'est nécessaire. Ce choix est délibéré : la vente et la livraison de médicaments sont beaucoup plus encadrées.
- **Données minimales chez la pharmacie** : elle voit un code et un type de kit, **pas le nom** de la cliente.
- **Données de cycle sur le téléphone** : le suivi du cycle n'est jamais envoyé au serveur. Il est protégé par un code distinct du code Max it et s'efface en un geste.
- **Protection des données** : le traitement doit être déclaré auprès de la CDP (Commission de protection des données personnelles, loi 2008-12). C'est une étape prévue avant le lancement public.

## 9. Faisabilité

### Déjà démontré dans le prototype

- Le parcours complet dans une mini-app TCMPP (la technologie des mini-apps Max it) : commande → paiement → retrait par code ou livraison suivie.
- La boutique, les kits, les conseils, le suivi de cycle protégé et le rappel de kit discret.
- Le libellé neutre dans l'historique et les notifications sans mot sur les règles.

### À construire pour un pilote

| Chantier | Effort estimé | Dépendance |
|---|---|---|
| Back-end des commandes (API + base de données) | 2 à 3 semaines | — |
| Page « Debbo Pharmacie » + alertes SMS/WhatsApp | 1 à 2 semaines | — |
| Paiement marchand Max it réel | Selon Orange | Accord Orange/Sonatel |
| Notifications de rappel (abonnement TCMPP) | Quelques jours | Template créé dans la console |
| Livraison via un partenaire | Manuel d'abord, API ensuite | Accord Paps ou Yango |

### Plan de pilote proposé (6 semaines)

- **5 pharmacies** dans un même secteur de Dakar (ex. Sacré-Cœur, Liberté, Point E).
- **1 partenaire de livraison.**
- **1 établissement scolaire** pour la Boîte Debbo (kits gratuits chez l'infirmière).
- **Indicateurs suivis** : nombre de commandes, délai entre paiement et remise, part retrait/livraison, taux de réachat après rappel, retours des pharmaciens.

## 10. Risques et réponses

| Risque | Réponse |
|---|---|
| La pharmacie oublie une commande | Alerte SMS/WhatsApp + relance automatique après 10 minutes ; la cliente peut basculer vers une autre pharmacie. |
| Rupture de stock | La pharmacie se met en « rupture » dans l'outil et l'app propose la plus proche ayant le kit (déjà visible dans la démo). |
| Le livreur connaît le contenu | Sachet opaque scellé + code de remise : il ne voit ni produit ni nom. |
| Faible adoption par les pharmacies | Zéro investissement, paiement garanti, formation de 10 minutes, commission seulement sur les ventes réalisées. |
| Dépendance à Orange | Debbo reste une mini-app : le même code peut être publié sur d'autres super-apps TCMPP. |

## 11. Ce qu'on dit

### Au pharmacien (30 secondes)

> « Bonjour Docteur. Debbo est une mini-app dans Max it pour les femmes et les jeunes filles qui ont besoin de protections, souvent en urgence. Elles paient dans Max it, vous recevez la commande, vous préparez un sachet, et elles viennent le chercher avec un code, ou un livreur passe le prendre. L'argent est déjà encaissé, vous n'avez rien à installer, et ce sont des ventes que vous ne faites pas aujourd'hui. On cherche cinq pharmacies du quartier pour un essai de six semaines. »

### Au jury (30 secondes)

> « Debbo s'appuie sur ce qui existe déjà : Max it pour payer, les pharmacies pour le stock et la confiance, les livreurs moto de Dakar pour la livraison. On n'achète pas de stock et on n'emploie pas de livreurs : on orchestre. La pharmacie gagne des ventes payées d'avance, la cliente gagne en discrétion et en rapidité, et une partie de chaque achat finance des kits pour les élèves. Le prototype montre le parcours complet ; la prochaine étape est un pilote avec cinq pharmacies. »

### Questions probables du jury

- **« Pourquoi une pharmacie accepterait ? »** Ventes en plus, payées d'avance, sans investissement, avec une formation de 10 minutes.
- **« Vous avez déjà des pharmacies partenaires ? »** Pas encore : les noms de la démo sont fictifs. Le pilote de 5 pharmacies est la première étape.
- **« Et si la cliente n'a pas Max it ? »** Max it est la cible du hackathon. Le code étant une mini-app TCMPP, il peut aussi être publié ailleurs.
- **« Comment gagnez-vous de l'argent ? »** Avec une commission sur chaque kit et une commission sur la boutique. Les dons et le geste solidaire de 200 FCFA vont aux associations partenaires.
- **« Et la vie privée ? »** Les données de cycle restent sur le téléphone, la pharmacie ne voit qu'un code, l'historique Max it affiche « Achat Bien-être » et les notifications ne parlent jamais de règles.

---

## Sources

- Nombre d'officines et répartition à Dakar : [Team France Export — Médicaments au Sénégal](https://www.teamfrance-export.fr/fiche-marche/sante/medicaments-et-biotechs/SN), [CIOPF — Fiche Sénégal](https://www.ciopf.org/Fiches-des-pays/Senegal), [ARP — Pharmaciens retenus par région](https://arp.sn/liste-des-pharmaciens-retenus-par-regions/)
- Cadre d'ouverture des établissements pharmaceutiques : [Décret 2023-2421](https://arp.sn/wp-content/uploads/2024/03/Decret-2023-2421-du-27-decembre-2023-fixant-les-conditions-douverture-et-dexploitation-dun-etablissement-pharmaceutique.pdf)
- Max it, paiement marchand et mini-apps partenaires : [Orange Sénégal — Paiement marchand](https://www.orange.sn/actualite/paiement-marchand-2), [Sonatel — SunuBRT dans Max it](https://sonatel.sn/orange-et-dakar-mobilite-sallient-pour-accelerer-la-digitalisation-des-services-du-brt-grace-a-la-super-app-max-it/)
- Livraison à Dakar : [Jeune Afrique — Paps](https://www.jeuneafrique.com/408674/economie/start-up-africaine-de-semaine-paps-lappli-de-livraison-veut-aller-vite/), [Dakaractu — Yango Delivery](https://www.dakaractu.com/Yango-Delivery-lance-l-offre-Cargo-pour-les-colis-volumineux-a-Dakar_a257426.html)
- Notifications d'abonnement TCMPP : [Tencent Cloud — Open APIs](https://www.tencentcloud.com/document/product/1219/57734)
