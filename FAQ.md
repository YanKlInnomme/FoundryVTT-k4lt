# KULT: Divinity Lost — FAQ

## Table of contents

- [Français](#français)
  - [1. Installation, versions et écosystème](#1-installation-versions-et-écosystème)
  - [2. Création et progression des personnages](#2-création-et-progression-des-personnages)
  - [3. Avantages, Désavantages, Atouts et Retenues](#3-avantages-désavantages-atouts-et-retenues)
  - [4. Relations et Ressorts dramatiques](#4-relations-et-ressorts-dramatiques)
  - [5. Armes, Armures et combat](#5-armes-armures-et-combat)
  - [6. Partage et affichage](#6-partage-et-affichage)
  - [7. Langues, traductions et scénarios](#7-langues-traductions-et-scénarios)
  - [8. Migration et dépannage](#8-migration-et-dépannage)
  - [9. Contenu IA optionnel et scénarios enrichis](#9-contenu-ia-optionnel-et-scénarios-enrichis)
- [English](#english)
  - [1. Installation, Versions and Ecosystem](#1-installation-versions-and-ecosystem)
  - [2. Character Creation and Advancement](#2-character-creation-and-advancement)
  - [3. Advantages, Disadvantages, Edge and Hold](#3-advantages-disadvantages-edge-and-hold)
  - [4. Relationships and Dramatic Hooks](#4-relationships-and-dramatic-hooks)
  - [5. Weapons, Armor, and Combat](#5-weapons-armor-and-combat)
  - [6. Sharing and Display](#6-sharing-and-display)
  - [7. Languages, Translations, and Scenarios](#7-languages-translations-and-scenarios)
  - [8. Migration and Troubleshooting](#8-migration-and-troubleshooting)
  - [9. Optional AI Content and Enhanced Scenarios](#9-optional-ai-content-and-enhanced-scenarios)

---

# Français
## 1. Installation, versions et écosystème
### De quoi ai-je besoin pour jouer à KULT: Divinity Lost sur Foundry VTT ?
Pour jouer, il faut au minimum :
- **Foundry VTT v14** ;
- le système **KULT: Divinity Lost (4th Edition)** (`k4lt`).
Le système `k4lt` contient les fiches de Personnages Joueurs et de Personnages Non-Joueurs, les règles automatisées, les différents types d'objets ainsi que les compendiums nécessaires au jeu.
La version actuelle du système est **6.2.0.0**. Son manifeste indique une compatibilité minimale avec **Foundry VTT 14**, vérifiée avec la version **14.368**.
Les modules complémentaires ne sont pas nécessaires pour lancer le système `k4lt`. En revanche, certains ont leurs propres dépendances : par exemple, `k4lt-fr` nécessite **Babele**, **libWrapper** et `k4lt-assets`.
### À quoi servent `k4lt`, `k4lt-fr`, `k4lt-en`, `k4lt-assets` et `k4lt-assets-ai` ?
L'écosystème est séparé en plusieurs paquets afin de distinguer clairement le système de jeu, les contenus linguistiques et les ressources supplémentaires.
- `k4lt` — **KULT: Divinity Lost (4th Edition)**  
  Il s'agit du **système de jeu principal**. C'est le seul élément indispensable pour créer un monde KULT et jouer. Il contient les fiches, les mécaniques et automatisations, ainsi que les compendiums de base.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt)
- `k4lt-fr` — module francophone  
  Il fournit notamment la **traduction française complète des compendiums** ainsi que du contenu complémentaire en français, dont des scénarios adaptés pour Foundry VTT.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt-fr)
- `k4lt-en` — module anglophone  
  Il ajoute du contenu complémentaire destiné aux utilisateurs anglophones, notamment des scénarios adaptés pour Foundry VTT.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt-en)
- `k4lt-assets` — ressources partagées  
  Il contient les ressources communes nécessaires aux contenus proposés par les modules linguistiques. Il ne contient **aucun contenu généré par IA**.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt-assets)
- `k4lt-assets-ai` — ressources IA partagées  
  Il contient séparément les ressources générées par IA. Ce module est **strictement optionnel** et distribué séparément de l'installateur Foundry.
### Le module `k4lt-assets-ai` est-il obligatoire ?
**Non.**
Le système `k4lt`, le module de ressources `k4lt-assets` et les contenus qui s'appuient sur ces ressources fonctionnent sans `k4lt-assets-ai`.
Le module `k4lt-assets-ai` est uniquement destiné aux utilisateurs qui souhaitent utiliser les ressources supplémentaires générées par IA. Il est volontairement séparé du reste de l'écosystème et doit être installé manuellement.
Son activation reste facultative : aucun contenu IA n'est imposé pour utiliser le système ou les modules principaux.
### Pourquoi certains anciens visuels ne sont-ils plus inclus dans le système ?
La nouvelle organisation des ressources distingue le contenu sans IA des ressources générées par IA, mais cela ne signifie pas que tous les anciens visuels ont été conservés dans l'un ou l'autre module.
Certains anciens visuels ont simplement été retirés de la version actuelle du système. C'est notamment le cas des taches de sang présentes dans d'anciennes versions.
Les ressources IA actuellement proposées sont regroupées dans `k4lt-assets-ai`, qui est distribué séparément et reste entièrement optionnel. L'absence d'un ancien visuel dans l'installation standard ne signifie donc pas nécessairement qu'il est disponible dans ce module.
## 2. Création et progression des personnages
### Comment créer un nouveau personnage ?
Créez un **Personnage Joueur**, puis ouvrez sa fiche.
La fiche permet ensuite de lancer la création guidée de deux manières :
- en utilisant un **Archétype** ;
- ou en choisissant une création **sans Archétype**.
L'assistant de création guide le choix des Traits, la répartition des Caractéristiques, le Métier et l'Apparence, puis affiche un récapitulatif avant d'appliquer les choix au personnage.
### Puis-je créer un personnage avec ou sans Archétype ?
**Oui.**
La création guidée propose les deux parcours. Avec un Archétype, le système utilise ses groupes de choix et ses Traits liés pour guider la création. Sans Archétype, la création reste libre tout en permettant de configurer les Caractéristiques, le Métier et l'Apparence.
Dans les deux cas, les suggestions proposées par le système restent des aides : le Métier et l'Apparence peuvent également être saisis librement.
### Quelle est la différence entre l'Archétype et le Métier ?
L'**Archétype** et le **Métier** sont deux éléments distincts de la fiche.
L'Archétype porte les éléments mécaniques liés au type de personnage : état de conscience, choix de Traits, prérequis et possibilités de progression.
Le Métier décrit ce que fait ou faisait le personnage dans sa vie. Le système peut proposer des Métiers correspondant à l'Archétype choisi, mais il est également possible d'en saisir un autre librement.
Un personnage ne change donc pas d'Archétype simplement parce que son Métier change, et inversement.
### Comment fonctionne l'Expérience dans la version actuelle ?
Les propriétaires d'un Personnage Joueur peuvent **cocher eux-mêmes les cases d'Expérience** sur leur fiche.
Lorsque les **5 cases** sont cochées, le système envoie une demande de validation aux MJ. L'Expérience n'est donc pas convertie automatiquement sans validation.
Si aucun compte MJ n'existe dans le monde, les 5 PX sont conservés afin qu'ils ne soient pas perdus, mais ils ne sont pas convertis en point de progression.
### Que se passe-t-il lorsque les 5 cases d'Expérience sont cochées ?
Une demande de validation est envoyée en privé aux MJ.
Si un MJ l'accepte :
- les 5 PX sont remis à zéro ;
- le personnage reçoit **1 point de progression** à utiliser dans son suivi de progression.
Si la demande n'est pas validée, l'Expérience reste sur la fiche.
### Comment fonctionne la progression ?
La fiche dispose d'un suivi de progression adapté à l'**état de conscience** du personnage : Dormeur·euse, Conscient·e ou Éclairé·e.
Les choix proposés dépendent de cet état et du nombre de progressions déjà acquises. Le système gère notamment les prérequis, les augmentations de Caractéristiques, l'acquisition d'Avantages ou de Capacités, les changements d'Archétype et les choix qui ne deviennent disponibles qu'après un certain nombre de progressions.
Lorsqu'un choix de progression est appliqué, le système enregistre son coût et ses effets. Les progressions peuvent également être remboursées ; le système conserve alors les choix initiaux et recalcule les points encore disponibles.
### Comment fonctionne la progression d'un personnage Dormeur ?
La progression d'un personnage **Dormeur** comporte six étapes.
Pour les cinq premières, le personnage se souvient de quelque chose à propos de son **Sombre Secret**.
À la sixième, il s'éveille et devient **Conscient** : un Archétype Conscient est choisi, le personnage conserve son Sombre Secret et ses Désavantages, puis le joueur choisit trois Avantages issus de son nouvel Archétype.
Le système suit ces étapes directement dans l'onglet de progression de la fiche.
### Comment faire passer rapidement un personnage de Dormeur à Conscient ?
Le moyen le plus simple consiste à **glisser-déposer un Archétype Conscient sur la fiche du personnage**.
Le compendium **Macros** contient également la macro `Advance Sleeper to Aware`. Elle permet au MJ de faire passer directement un personnage Dormeur à l'état Conscient en réinitialisant d'abord sa progression, en lui attribuant l'Expérience nécessaire et en appliquant les améliorations correspondant à sa progression de Dormeur.
La macro est surtout utile lorsque l'on souhaite reproduire automatiquement les étapes de progression du Dormeur avant son passage à l'état Conscient ; pour une transition directe, le glisser-déposer d'un Archétype Conscient suffit.
## 3. Avantages, Désavantages, Atouts et Retenues
### Comment sont ajoutés les Atouts et les Retenues ?
Dans la plupart des cas, **automatiquement**.
Lorsqu'un joueur effectue le jet d'un Avantage utilisant des **Atouts**, ou d'un Désavantage utilisant des **Retenues**, le système ajoute directement le nombre correspondant au résultat obtenu.
Les valeurs sont définies sur le Trait pour les trois niveaux de résultat : **15+**, **10–14** et **9 ou moins**. Le compteur est donc mis à jour au moment du jet sans qu'il soit normalement nécessaire d'intervenir manuellement.
### Dois-je ajouter manuellement les Atouts ou les Retenues après un jet ?
En règle générale, **non**.
Le système automatise leur acquisition chaque fois que le résultat du Trait détermine directement un nombre d'Atouts ou de Retenues.
Une intervention manuelle reste toutefois nécessaire dans certains cas, notamment lorsqu'un résultat donne accès à **plusieurs options** et que le nombre réellement obtenu dépend d'un choix effectué après le jet. Si le choix du joueur doit augmenter un compteur d'Atouts ou de Retenues, **c'est le MJ qui applique cette augmentation sur la fiche**.
### Comment un joueur dépense-t-il ses Atouts ?
Le compteur d'Atouts apparaît directement à côté de l'Avantage concerné.
Lorsqu'un Atout est dépensé, le joueur peut **diminuer le compteur** à l'aide du bouton prévu à cet effet. L'acquisition des Atouts étant normalement automatique lors du jet, le joueur n'a pas besoin d'un bouton pour en ajouter dans le fonctionnement courant.
### Pourquoi un joueur peut-il voir ses Retenues mais pas les modifier ?
Parce que les **Retenues appartiennent au MJ**.
Elles sont associées au Désavantage qui les a générées et restent visibles sur la fiche du personnage, mais leur gestion manuelle est réservée au MJ. Cela correspond au fonctionnement des règles : le MJ reçoit ces Retenues et décide ensuite quand les dépenser pour activer les effets du Désavantage.
### À quoi sert la fenêtre Hold Tracker qui s'ouvre chez le MJ ?
Le **Hold Tracker** donne au MJ une vue d'ensemble des Retenues de la table.
Pour chaque Personnage Joueur, il affiche le **total des Retenues actuellement disponibles**, toutes sources confondues. Un clic sur le personnage ouvre directement sa fiche afin de consulter les Désavantages concernés et leurs compteurs respectifs.
Par défaut, le tracker n'affiche que les PJ attribués à des joueurs. Un paramètre de monde permet d'afficher tous les PJ si nécessaire.
### Comment savoir à quel Désavantage appartiennent les Retenues affichées dans le Hold Tracker ?
Le nombre affiché dans le Hold Tracker est un **total par personnage**.
Pour connaître le détail, cliquez sur le personnage dans le tracker : sa fiche s'ouvre et permet de voir combien de Retenues sont associées à chacun de ses Désavantages.
Le tracker sert donc de vue synthétique ; la fiche du personnage conserve le détail par Trait.
### Dans quels cas faut-il ajuster manuellement un compteur ?
Principalement lorsque le résultat d'un Trait ne détermine pas directement une quantité fixe.
C'est notamment le cas de certains résultats proposant **plusieurs options à choisir**. Le système ne peut pas toujours déduire automatiquement combien d'Atouts ou de Retenues doivent finalement être conservés, puisque cela dépend du choix effectué après le jet.
Dans ces situations, **toute augmentation manuelle du compteur est appliquée par le MJ**, qu'il s'agisse d'Atouts ou de Retenues. Le joueur peut en revanche diminuer lui-même ses Atouts lorsqu'il les dépense.
## 4. Relations et Ressorts dramatiques
### Comment ajouter une Relation à un personnage ?
Une Relation est un **objet Relation**.
Pour l'ajouter à un Personnage Joueur, le **MJ crée d'abord la Relation dans le monde** et peut en donner les permissions au joueur. Tant qu'elle existe comme objet indépendant, le joueur peut alors la modifier selon les permissions accordées. Une fois prête, elle peut être **glissée-déposée dans la zone Relations** de la fiche du personnage.
La Relation peut ensuite être liée à un personnage précis : ouvrez la fiche de la Relation et glissez le personnage dans la zone prévue. Lorsqu'un personnage est lié, son portrait et son nom peuvent être repris directement dans l'affichage de la Relation.
### Pourquoi glisser directement un autre PJ dans la zone Relations ne crée-t-il pas une Relation ?
Parce que la zone Relations de la fiche attend une **Relation**, et non directement un personnage.
Si vous voulez relier la Relation à un autre PJ :
1. créez ou utilisez une Relation ;
2. déposez-la dans la zone Relations du personnage ;
3. ouvrez ensuite la Relation et glissez le PJ concerné dans son champ de liaison.
Le glisser-déposer direct d'un personnage sur la zone Relations n'est donc pas interprété comme la création automatique d'une nouvelle Relation.
### Pourquoi le glisser-déposer d'une Relation ou d'un Ressort dramatique peut-il ne pas fonctionner ?
Le personnage doit être **possédé par l'utilisateur** qui effectue le glisser-déposer, et l'élément déposé doit être du bon type.
La zone Relations accepte les **Relations**, tandis que la zone Ressorts dramatiques accepte les **Ressorts dramatiques**.
Glisser directement un personnage dans l'une de ces deux zones ne fonctionne pas : un personnage peut être lié **à l'intérieur** d'une Relation ou d'un Ressort dramatique, mais il ne remplace pas la Relation ou le Ressort lui-même.
### Quelles permissions un joueur doit-il avoir pour ajouter une Relation ou un Ressort dramatique à sa fiche ?
La Relation ou le Ressort dramatique est créé par le **MJ**, qui peut ensuite accorder au joueur les permissions nécessaires pour l'ouvrir et le modifier directement dans le monde. Le joueur peut donc préparer ou ajuster librement son contenu tant que l'objet reste indépendant, selon le niveau de permission accordé.
Lorsqu'il est ensuite **glissé-déposé sur la fiche du personnage**, Foundry en crée une copie imbriquée dans la fiche. À partir de ce moment, les modifications de cette version intégrée sont effectuées par le **MJ**. Il s'agit du fonctionnement retenu par le système pour ces éléments narratifs partagés, en s'appuyant sur la logique habituelle des permissions de Foundry VTT.
### Pourquoi les Relations ne sont-elles pas de simples champs de texte ?
Parce qu'une Relation contient davantage qu'un simple nom.
Une Relation peut contenir :
- un résumé ;
- une description ;
- une valeur de Relation : **Neutre (0)**, **Significative (+1)** ou **Vitale (+2)** ;
- un lien vers un personnage.
Ce lien permet notamment d'afficher directement le portrait et le nom du personnage associé tout en conservant les informations propres à la Relation.
### Je suis joueur : pourquoi ne puis-je pas modifier librement mes Relations et mes Ressorts dramatiques ?
Parce que le système ne les considère pas comme de simples notes personnelles de la fiche, mais comme des **éléments narratifs partagés** entre le joueur, le MJ et parfois les autres joueurs.
C'est directement cohérent avec la manière dont **KULT: Divinity Lost** décrit ces mécaniques. Dans *Beyond Darkness and Madness*, les Ressorts dramatiques sont présentés comme des sous-intrigues initiées par les joueurs mais construites au niveau du groupe : les joueurs se proposent mutuellement des Ressorts, le consentement du joueur concerné est central, et le texte insiste sur le fait que la narration collective du groupe prime sur le Ressort individuel. Les Relations suivent la même logique : elles évoluent avec la fiction, peuvent impliquer plusieurs personnages, et leurs changements sont discutés entre joueur et MJ — voire entre les deux joueurs concernés lorsqu'il s'agit d'une Relation entre PJ.
Le système Foundry reflète donc cette logique, mais avec une distinction importante : **avant le glisser-déposer**, la Relation ou le Ressort dramatique est un objet indépendant du monde. Le MJ peut en donner les permissions au joueur, qui peut alors l'ouvrir et le modifier à sa convenance.
C'est seulement **une fois l'objet glissé-déposé sur la fiche** — et donc imbriqué au personnage — que son édition est réservée au MJ. Le joueur conserve toutefois les actions qui lui reviennent directement pendant la partie : il peut notamment consulter ces éléments et marquer lui-même un Ressort dramatique comme **Accompli**.
Ce choix n'est pas destiné à empêcher les joueurs de « tricher » : il sert à distinguer ce qui relève de la gestion personnelle du personnage de ce qui constitue un élément partagé de la fiction.
### Comment créer et gérer un Ressort dramatique ?
Un Ressort dramatique est un **objet Ressort dramatique**.
Le **MJ crée d'abord le Ressort dramatique dans le monde** et peut en donner les permissions au joueur afin qu'il puisse le compléter ou le modifier. Une fois prêt, il est glissé dans la zone **Ressorts dramatiques** du Personnage Joueur.
Un Ressort dramatique peut contenir une description et être lié à un autre élément. Le système accepte comme lien un **personnage**, ou certains objets : **Sombre Secret**, **Équipement** ou **Arme**.
Le joueur peut marquer directement le Ressort dramatique comme **Accompli** depuis sa fiche. Les commandes d'édition et de suppression du Ressort dramatique restent réservées au MJ dans la fiche du Personnage Joueur.
### Pourquoi accomplir un Ressort dramatique n'ajoute-t-il pas automatiquement 1 PX ?
Dans les règles générales, accomplir un Ressort dramatique rapporte normalement **1 PX**. Cependant, tous les Ressorts dramatiques ne suivent pas nécessairement cette règle : certains effets particuliers peuvent créer un Ressort dramatique qui **ne rapporte aucun PX**.
Le système sépare donc les deux actions :
- le Ressort dramatique est marqué **Accompli** ;
- l'Expérience est cochée séparément lorsqu'elle doit effectivement être accordée.
Cela évite d'attribuer automatiquement un PX dans les cas où le Ressort dramatique ne doit pas en rapporter.
## 5. Armes, Armures et combat
### Pourquoi ne puis-je pas créer directement une Arme ou une Armure depuis la fiche ?
La fiche de Personnage Joueur permet de créer directement de l'**Équipement**, mais les **Armes** et les **Armures** sont gérées comme des objets structurés à part entière.
Une Arme peut contenir plusieurs attaques, chacune avec ses propres dommages, coût en munitions, effet et description. Une Armure possède notamment une valeur de protection et un état équipé/non équipé.
Les Armes et Armures sont donc ajoutées à la fiche par **glisser-déposer**, depuis un compendium ou depuis les objets du monde.
### Comment ajouter une Arme ou une Armure personnalisée ?
Le **MJ crée d'abord l'Arme ou l'Armure dans le monde** et renseigne ses propriétés.
Comme pour les Relations et les Ressorts dramatiques, il peut accorder au joueur des permissions sur cet objet tant qu'il reste indépendant dans le monde. Le joueur peut alors le consulter ou le modifier selon les permissions accordées.
Une fois l'objet prêt, il suffit de le **glisser-déposer dans la zone Armes ou Armures** de la fiche. La copie imbriquée dans le personnage est ensuite gérée depuis sa fiche.
### Pourquoi les Armes et les Armures ont-elles leurs propres objets ?
Parce qu'elles portent des informations utilisées directement par les automatisations du système.
Une Arme peut notamment définir :
- une ou plusieurs attaques ;
- les dommages de chaque attaque ;
- un éventuel coût en munitions ;
- des effets particuliers ;
- les distances auxquelles elle peut être utilisée.
Une Armure possède une **valeur de protection** prise en compte lorsqu'elle est équipée.
Cette structure permet au système d'utiliser directement ces données pendant les Actions plutôt que de traiter l'Arme ou l'Armure comme une simple ligne de texte.
### Comment utiliser l'Action Engager le combat ?
Lorsque vous lancez **Engager le combat**, le système ouvre un sélecteur de combat.
Il affiche les **Armes actuellement équipées** sur le personnage ainsi que les différentes attaques disponibles pour chacune d'elles. Sélectionnez l'attaque que vous utilisez : le système lance alors l'Action et transmet avec le jet les informations de l'attaque choisie, notamment ses dommages, son effet et son éventuel coût en munitions.
Si l'attaque consomme des munitions, celles-ci sont déduites automatiquement.
### Pourquoi Engager le combat me demande-t-il de sélectionner une Arme et une attaque ?
Parce que le résultat du combat dépend de **la manière dont le personnage attaque**.
Une même Arme peut proposer plusieurs attaques avec des dommages, des effets ou des coûts en munitions différents. Le sélecteur permet donc au système de savoir précisément quelle attaque est utilisée et d'afficher les bonnes informations avec le jet.
Seules les Armes **équipées** apparaissent dans ce sélecteur.
### Puis-je utiliser Engager le combat sans arme ?
**Oui.**
Le système représente simplement le combat à mains nues par une Arme appelée **Désarmé·e** (`Unarmed` en anglais).
Pour combattre à mains nues, cet objet doit être présent dans l'inventaire du personnage et être **équipé**. Il apparaît alors dans le sélecteur de combat comme n'importe quelle autre Arme.
Cela correspond également aux règles de KULT, dans lesquelles une attaque à mains nues possède sa propre valeur de dommages.
### Pourquoi l'Arme Désarmé·e n'est-elle pas toujours considérée comme équipée ?
C'est volontaire.
Le système ne suppose pas qu'un personnage est **toujours capable d'attaquer à mains nues**. Il peut être attaché, immobilisé, inconscient ou se trouver dans une autre situation où ce type d'attaque n'est pas possible.
L'objet **Désarmé·e** doit donc être équipé lorsque cette possibilité est réellement disponible, plutôt que d'être imposé en permanence par le système.
### Comment les Armures sont-elles prises en compte ?
Une Armure doit être **équipée** pour être prise en compte.
Lors d'un jet d'**Encaisser les blessures**, le système demande les dommages subis puis ajoute automatiquement la valeur de protection de toutes les Armures équipées au modificateur du jet.
Il n'est donc pas nécessaire d'ajouter manuellement leur valeur à chaque fois.
## 6. Partage et affichage
### Comment partager un Avantage, un Désavantage ou un autre élément affiché depuis la fiche ?
Ouvrez simplement l'élément depuis la fiche du Personnage Joueur.
Dans la fenêtre de consultation, ouvrez le menu **⋮** en haut à droite puis choisissez **Partager**. Le système affiche alors la liste des utilisateurs actuellement connectés : sélectionnez les destinataires souhaités, puis validez.
La même logique s'applique aux différents éléments affichés dans cette visionneuse, comme les Avantages, Désavantages, Capacités, Armes, Armures, Relations, Ressorts dramatiques, etc.
### Puis-je partager un élément uniquement avec certains joueurs ?
**Oui.**
Le partage est **ciblé**. Vous choisissez précisément les utilisateurs qui doivent recevoir la fenêtre : un seul joueur, plusieurs joueurs, un MJ, ou toute combinaison d'utilisateurs actuellement connectés.
Il n'est donc pas nécessaire d'afficher l'information à toute la table.
### Le partage modifie-t-il les permissions sur l'objet ?
**Non.**
Partager une fenêtre ne donne ni propriété ni droit d'édition sur l'objet concerné. Le système ouvre simplement sa **visionneuse** chez les destinataires sélectionnés.
Les permissions Foundry de l'objet restent inchangées.
### Puis-je partager une image uniquement avec certains joueurs ?
**Oui.**
Le partage d'images utilise le même sélecteur de destinataires. Lorsque vous choisissez de partager une image, vous pouvez sélectionner exactement les utilisateurs actuellement connectés qui doivent la voir.
Cela permet, par exemple, de montrer une illustration ou un indice à un seul joueur sans l'afficher aux autres.
### Pourquoi la fiche n'affiche-t-elle pas toujours les mêmes contrôles au joueur et au MJ ?
Parce que certaines actions appartiennent au **joueur**, tandis que d'autres relèvent de la **gestion du MJ**.
Le système adapte donc les contrôles affichés selon le rôle de l'utilisateur et le type d'élément concerné. Par exemple, le joueur peut dépenser ses Atouts, marquer un Ressort dramatique comme Accompli ou gérer certains éléments personnels, tandis que le MJ conserve les contrôles nécessaires pour les Retenues, certaines modifications d'objets imbriqués ou d'autres éléments narratifs partagés.
L'objectif n'est pas de masquer arbitrairement des fonctions, mais d'afficher à chacun les actions qui lui reviennent dans le fonctionnement du système.
## 7. Langues, traductions et scénarios
### Existe-t-il une version française du système ?
Le système principal **`k4lt`** contient directement l'interface française, mais les contenus traduits sont complétés par le module **`k4lt-fr`**.
Ce module ajoute notamment les traductions françaises des compendiums du système, y compris les **Archétypes**, **Métiers**, **Apparences**, **Armes**, **Armures** et **Équipements spéciaux**, ainsi que d'autres contenus complémentaires.
**Attention : ces traductions sont mes propres traductions et adaptations pour Foundry VTT. Elles ne constituent pas la traduction française canonique publiée par Arkhane Asylum Publishing.**
Cette différence peut parfois rendre un terme difficile à retrouver si vous le cherchez sous son nom officiel français. Par exemple :
- **Prévoyant** dans la VF d'Arkhane Asylum correspond à **Préparé·e** dans `k4lt-fr` ;
- **Conscience augmentée** correspond à **Sensibilité accrue** dans `k4lt-fr`.
Il s'agit bien des mêmes Avantages que dans la version originale anglaise ; seuls l'intitulé et la formulation française diffèrent. Ces écarts sont volontaires, car les textes français d'Arkhane Asylum ne peuvent pas être repris tels quels dans le module.
Pour fonctionner, `k4lt-fr` utilise également **Babele**, **libWrapper** et **`k4lt-assets`**.
### Quels scénarios prêts à jouer sont disponibles en français ?
Le module **`k4lt-fr`** contient actuellement trois aventures prêtes à jouer :
- **La Galerie des Âmes** ;
- **Oakwood Heights VF** ;
- **Écho du passé**.
Elles sont préparées pour Foundry VTT avec les Journaux, personnages, PNJ, scènes et autres éléments nécessaires à leur utilisation directement dans un monde.
### Quels scénarios prêts à jouer sont disponibles en anglais ?
Le module **`k4lt-en`** propose actuellement leurs équivalents anglophones :
- **Gallery of Souls** ;
- **Oakwood Heights** ;
- **An Echo From the Past**.
Le module `k4lt-en` nécessite le système `k4lt` et le module de ressources **`k4lt-assets`**.
### Existe-t-il une version française de The Black Madonna ?
**Non.**
Le module Foundry VTT de **The Black Madonna** reste disponible en anglais uniquement. Le module `k4lt-fr` ne traduit pas automatiquement son contenu et il n'existe pas actuellement de version française officielle de ce module.
Pour les groupes qui souhaitent néanmoins jouer la campagne en français, **Deep Translate** peut traduire un monde Foundry complet avec DeepL tout en conservant sa structure et sa mise en forme. Cela peut rendre la campagne VO exploitable en français, mais **cela ne constitue pas une traduction officielle**.
## 8. Migration et dépannage
### Une mise à jour du module met-elle à jour les aventures déjà importées ?
**Non, pas automatiquement.** Les documents importés dans le monde sont des copies de ceux du compendium. Une mise à jour de k4lt-fr ou de k4lt-en ne remplace pas automatiquement ces copies ni vos modifications personnelles.
Pour bénéficier des corrections, comparez les documents avec ceux du compendium et réimportez les éléments concernés si nécessaire, en conservant vos notes et personnalisations.
Les **macros des sept sceaux d'Écho du Passé / An Echo From the Past** déjà importées doivent notamment être réimportées pour recevoir les corrections concernant les Archétypes distincts des Métiers, les états de conscience et les récompenses.
### Que faire si un ancien personnage n'utilise pas les versions actuelles de ses Traits ?
Le compendium **Macros** contient la macro `Update PC Traits to v14`.
Elle permet au MJ de sélectionner un ou plusieurs Personnages Joueurs provenant d'une version antérieure du système et de remplacer leurs **Avantages**, **Désavantages**, **Capacités** et **Limitations** par leurs versions actuelles prévues pour la v14.
Cette macro est particulièrement utile pour les personnages conservés d'une ancienne campagne ou importés depuis un monde créé avant la migration vers Foundry VTT v14.
### Pourquoi mon personnage possède-t-il deux fois l'Arme Désarmé·e ?
Sur certains personnages anciens, le drapeau permettant au système d'identifier l'Arme **Désarmé·e** comme arme de départ peut être absent.
Le compendium **Macros** contient la macro `Fix Starting Weapon Flags`. Elle marque l'Arme Désarmé·e existante comme arme de départ afin d'éviter que le système n'en ajoute une nouvelle copie.
Cette macro est destinée aux personnages existants concernés par ce problème ; elle n'est normalement pas nécessaire pour les personnages créés avec les versions actuelles du système.
### La Stabilité et les Blessures sont-elles automatiquement prises en compte dans les jets ?
**Oui.**
Le système prend automatiquement en compte la **Stabilité** lorsqu'elle doit modifier un jet, notamment pour les Désavantages, **Garder le contrôle** et **Voir à travers l'Illusion**.
Lorsque des Blessures doivent également modifier le même jet, les deux effets sont cumulés automatiquement. Il n'est donc pas nécessaire de recalculer manuellement ces modificateurs avant chaque jet.
### Les Conditions influencent-elles automatiquement la Stabilité ?
**Oui, lorsqu'elles sont applicables.**
Depuis la migration vers la v14 du système, les Conditions sont prises en compte automatiquement dans la Stabilité lorsqu'elles doivent l'être. Le joueur et le MJ n'ont donc pas à reporter manuellement leurs effets dans les jets concernés.
### Que vérifier en premier si un comportement semble différent de celui décrit dans cette FAQ ?
Vérifiez d'abord :
- que **Foundry VTT** et le système `k4lt` utilisent des versions compatibles ;
- que le système et les modules complémentaires sont **à jour** ;
- que le personnage n'est pas issu d'une version ancienne nécessitant une macro de migration ;
- que les modules requis par `k4lt-fr` ou `k4lt-en` sont bien installés et activés ;
- et, lorsqu'un problème concerne un objet ou un glisser-déposer, que les **permissions Foundry VTT** nécessaires sont correctement définies.
Pour un personnage ancien, les macros de migration fournies dans le compendium **Macros** doivent être privilégiées plutôt qu'une correction manuelle de chaque élément.
## 9. Contenu IA optionnel et scénarios enrichis
### Pourquoi existe-t-il un module séparé `k4lt-assets-ai` ?
Le module `k4lt-assets-ai` regroupe uniquement les ressources générées à l'aide d'outils d'IA.
Il est séparé de `k4lt-assets` afin que les modules distribués via les canaux officiels de Foundry VTT restent conformes à la politique IA de Foundry, tout en permettant aux utilisateurs qui le souhaitent de continuer à utiliser ces ressources complémentaires.
Les contenus de `k4lt-assets-ai` sont **non officiels**, ne font pas partie du matériel canonique de KULT et ne sont ni approuvés, ni soutenus, ni révisés par Helmgast ou les détenteurs des droits.
### Le module `k4lt-assets-ai` est-il nécessaire pour jouer ?
**Non.**
Les modules principaux et les scénarios fonctionnent sans lui.
`k4lt-assets-ai` ajoute uniquement des ressources visuelles et sonores supplémentaires destinées à enrichir certains scénarios. Son installation et son utilisation restent donc entièrement facultatives.
### Comment installer `k4lt-assets-ai` ?
Le module n'est pas distribué dans le gestionnaire officiel de modules de Foundry VTT.
La méthode recommandée consiste à utiliser l'URL du manifeste :
`https://github.com/YanKlInnomme/FoundryVTT-k4lt-assets-ai/releases/latest/download/module.json`
Dans Foundry VTT :
1. ouvrez **Modules complémentaires** ;
2. cliquez sur **Installer un module** ;
3. collez l'URL dans le champ **URL du manifeste** ;
4. installez le module ;
5. activez-le ensuite dans votre monde.
Il peut également être installé manuellement depuis les Releases GitHub.
### Si j'installe `k4lt-assets-ai`, les ressources IA sont-elles automatiquement utilisées ?
**Non.**
Le simple fait d'installer le module n'impose rien.
Pour les scénarios compatibles, une option permet d'**activer ou de désactiver les ressources IA supplémentaires**. Il est donc possible de conserver le scénario entièrement sans IA, ou d'activer ces ressources au cas par cas.
### Comment activer les ressources supplémentaires pour un scénario ?
Après avoir activé k4lt-assets-ai et importé un scénario compatible, **rechargez le monde (F5)** pour faire apparaître le dialogue. Les ressources supplémentaires sont inactives par défaut : **Oui** les active, tandis que **Non** les laisse inactives.
La case **Ne plus afficher** masque ce dialogue pour les prochaines utilisations. Les options restent accessibles dans **Paramètres de jeu**, dans la section du module **KULT: Divinity Lost - AI Assets**.
Chaque scénario dispose de sa propre option : La Galerie des Âmes, Oakwood Heights, The Black Madonna et Écho du Passé.
Pour désactiver des ressources déjà activées, ouvrez les **paramètres du monde**, puis les options du module **KULT: Divinity Lost - AI Assets**, **décochez la case correspondant au scénario** et enregistrez les modifications.
### Où trouver les journaux additionnels importés ?
Lorsque les ressources sont activées, ces journaux sont importés depuis les compendiums de k4lt-assets-ai dans le dossier du scénario :
- **Sketches** dans **La Galerie des Âmes / Gallery of Souls** ;
- **Immersion Kit** dans **Oakwood Heights VF / Oakwood Heights** ;
- **Galerie / Gallery** dans **Écho du Passé / An Echo From the Past**.
### Quels scénarios disposent actuellement de ressources supplémentaires dans `k4lt-assets-ai` ?
Le module propose actuellement des ressources optionnelles pour plusieurs contenus :
- **La Galerie des Âmes / Gallery of Souls** : 27 portraits pour PJ et PNJ, ainsi que 10 illustrations représentant les croquis de Christian Starker ;
- **Oakwood Heights / Oakwood Heights VF** : 23 portraits pour PJ et PNJ, ainsi qu'un kit d'immersion de 9 illustrations ;
- **Écho du Passé / An Echo From the Past** : 39 portraits, comprenant les formes réelles de certains personnages et plusieurs variantes, 7 illustrations de lieux et un journal Galerie disponible en français et en anglais ;
- **The Black Madonna / La Madone Noire** : 62 portraits de PNJ, 11 illustrations de lieux, 3 illustrations scénaristiques et 3 pistes audio MP3.
Ces ressources s'ajoutent aux ressources non-IA déjà utilisées par les aventures ; elles restent entièrement facultatives.
### Pourquoi parler de scénarios « prêts à jouer en un clic » avec `k4lt-assets-ai` ?
Les scénarios fonctionnent déjà sans ce module, avec les ressources autorisées dans les modules officiels.
`k4lt-assets-ai` ajoute toutefois les portraits, illustrations d'ambiance, aides visuelles et contenus audio qui permettent de disposer d'une présentation beaucoup plus complète dès l'importation du scénario.
C'est dans ce sens qu'il peut transformer un scénario déjà préparé pour Foundry en une expérience plus proche du **« prêt à jouer en un clic »**, sans pour autant être nécessaire à son fonctionnement.

---
# English
## 1. Installation, Versions and Ecosystem
### What do I need to play KULT: Divinity Lost on Foundry VTT?
At minimum, you need:
- **Foundry VTT v14**;
- the **KULT: Divinity Lost (4th Edition)** game system (`k4lt`).
The `k4lt` system contains Player Character and Non-Player Character sheets, automated rules, the different Item types, and the compendiums required to play.
The current system version is **6.2.0.0**. Its manifest requires **Foundry VTT 14** at minimum and is verified with **14.368**.
Add-on modules are not required to run the `k4lt` game system itself. However, some have their own dependencies: for example, `k4lt-fr` requires **Babele**, **libWrapper**, and `k4lt-assets`.
### What are `k4lt`, `k4lt-fr`, `k4lt-en`, `k4lt-assets`, and `k4lt-assets-ai` for?
The ecosystem is split into several packages so the game system, language-specific content, and additional assets remain clearly separated.
- `k4lt` — **KULT: Divinity Lost (4th Edition)**  
  This is the **main game system**. It is the only required package for creating a KULT world and playing. It contains the character sheets, mechanics and automation, and the core compendiums.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt)
- `k4lt-fr` — French-language module  
  It provides, among other things, **complete French translations of the compendiums** and additional French content, including scenarios adapted for Foundry VTT.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt-fr)
- `k4lt-en` — English-language module  
  It provides additional content for English-speaking users, including scenarios adapted for Foundry VTT.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt-en)
- `k4lt-assets` — shared assets  
  It contains shared resources required by content provided through the language modules. It contains **no AI-generated content**.  
  [GitHub](https://github.com/YanKlInnomme/FoundryVTT-k4lt-assets)
- `k4lt-assets-ai` — shared AI assets  
  It separately contains AI-generated resources. This module is **strictly optional** and is distributed separately from Foundry's package installer.
### Is the `k4lt-assets-ai` module required?
**No.**
The `k4lt` game system, the `k4lt-assets` resource module, and content relying on those resources work without `k4lt-assets-ai`.
The `k4lt-assets-ai` module is only intended for users who want to use the additional AI-generated resources. It is deliberately separated from the rest of the ecosystem and must be installed manually.
Enabling it is optional: no AI-generated content is required to use the game system or the main modules.
### Why are some older visual assets no longer included in the system?
The current asset structure separates non-AI content from AI-generated resources, but this does not mean that every visual asset from older versions has been preserved in one module or the other.
Some older visual assets were simply removed from the current version of the system. This is notably the case for the blood splatter assets included in older versions.
The AI-generated resources currently available are grouped in `k4lt-assets-ai`, which is distributed separately and remains completely optional. Therefore, if an older visual asset is missing from the standard installation, that does not necessarily mean it is available in this module.
## 2. Character Creation and Advancement
### How do I create a new character?
Create a **Player Character**, then open its sheet.
The sheet provides two guided creation paths:
- creation with an **Archetype**;
- or creation **without an Archetype**.
The character creation workflow guides you through Trait selection, Attribute distribution, Occupation and Appearance, then shows a review before applying the choices to the character.
### Can I create a character with or without an Archetype?
**Yes.**
Guided creation supports both paths. With an Archetype, the system uses its choice groups and linked Traits to guide character creation. Without an Archetype, creation remains free while still allowing you to configure Attributes, Occupation, and Appearance.
In both cases, system suggestions are only aids: Occupation and Appearance can also be entered freely.
### What is the difference between Archetype and Occupation?
**Archetype** and **Occupation** are separate elements on the character sheet.
The Archetype carries the mechanical elements associated with the character type: state of consciousness, Trait choices, prerequisites, and advancement options.
Occupation describes what the character does or did in their life. The system can suggest Occupations associated with the selected Archetype, but a different Occupation can also be entered freely.
Changing an Occupation therefore does not change the character's Archetype, and vice versa.
### How does Experience work in the current version?
Owners of a Player Character can **mark their own Experience boxes** directly on their sheet.
When all **5 boxes** are marked, the system sends a validation request to the GMs. Experience is therefore not converted automatically without GM approval.
If no GM account exists in the world, the 5 XP are kept so they are not lost, but they are not converted into an Advancement Point.
### What happens when all 5 Experience boxes are marked?
A validation request is sent privately to the GMs.
If a GM approves it:
- the 5 XP are reset;
- the character gains **1 Advancement Point** to use in their advancement track.
If the request is not approved, the Experience remains on the character sheet.
### How does advancement work?
The character sheet provides advancement tracking based on the character's **state of consciousness**: Sleeper, Aware, or Enlightened.
The available choices depend on that state and on how many advancements the character has already gained. The system handles prerequisites, Attribute increases, acquisition of Advantages or Abilities, Archetype changes, and options that only become available after a certain number of advancements.
When an advancement is applied, the system records its cost and effects. Advancements can also be refunded; the system then preserves the character's initial choices and recalculates the points still available.
### How does Sleeper advancement work?
A **Sleeper** character has six advancement steps.
For the first five, the character remembers something about their **Dark Secret**.
On the sixth, they awaken and become **Aware**: an Aware Archetype is selected, the character keeps their Dark Secret and Disadvantages, and the player chooses three Advantages from the new Archetype.
The system tracks these steps directly in the character sheet's advancement section.
### How can I quickly advance a Sleeper to Aware?
The simplest method is to **drag and drop an Aware Archetype onto the character sheet**.
The **Macros** compendium also contains the `Advance Sleeper to Aware` macro. It allows the GM to move a Sleeper directly to the Aware state by first resetting their advancement, granting the necessary Experience, and applying all improvements associated with Sleeper advancement.
The macro is mainly useful when you want to reproduce the Sleeper's advancement steps automatically before the transition to Aware; for a direct transition, dragging and dropping an Aware Archetype is enough.
## 3. Advantages, Disadvantages, Edge and Hold
### How are Edge and Hold added?
In most cases, **automatically**.
When a player rolls an Advantage that uses **Edge**, or a Disadvantage that uses **Hold**, the system directly adds the amount corresponding to the roll result.
The values are defined on the Trait for the three result ranges: **15+**, **10–14**, and **9 or less**. The counter is therefore updated when the roll is made, and normally requires no manual intervention.
### Do I need to add Edge or Hold manually after a roll?
As a general rule, **no**.
The system automates their acquisition whenever the Trait result directly determines a number of Edge or Hold.
Manual adjustment may still be required in some cases, particularly when a result provides **several options** and the final amount depends on a choice made after the roll. If the player's choice should increase an Edge or Hold counter, **the GM applies that increase on the character sheet**.
### How does a player spend Edge?
The Edge counter appears directly next to the relevant Advantage.
When an Edge is spent, the player can **decrease the counter** using the corresponding control. Since Edge is normally gained automatically when the Advantage is rolled, the player does not need a control to add it during normal play.
### Why can a player see Hold but not modify it?
Because **Hold belongs to the GM**.
Hold is associated with the Disadvantage that generated it and remains visible on the character sheet, but manual management is reserved for the GM. This follows the game rules: the GM receives the Hold and later decides when to spend it to activate the Disadvantage's effects.
### What is the GM Hold Tracker for?
The **Hold Tracker** gives the GM an overview of the table's Hold.
For each Player Character, it displays the **total Hold currently available**, regardless of source. Clicking a character opens their sheet directly so the GM can inspect the relevant Disadvantages and their individual counters.
By default, the tracker only displays PCs assigned to players. A world setting can be used to display all PCs if needed.
### How can I see which Disadvantage the Hold in the Hold Tracker belongs to?
The number shown in the Hold Tracker is a **total per character**.
To see the breakdown, click the character in the tracker. Their sheet opens and shows how much Hold is associated with each Disadvantage.
The tracker is therefore a summary view, while the character sheet keeps the detailed counters by Trait.
### When should a counter be adjusted manually?
Mainly when a Trait result does not directly determine a fixed amount.
This can happen with results that offer **several options to choose from**. The system cannot always determine automatically how much Edge or Hold should ultimately remain, because that depends on the choice made after the roll.
In those situations, **any manual increase to the counter is applied by the GM**, whether it is Edge or Hold. Players can, however, decrease their own Edge when they spend it.
## 4. Relationships and Dramatic Hooks
### How do I add a Relationship to a character?
A Relationship is a **Relationship item**.
To add one to a Player Character, the **GM first creates the Relationship in the world** and can grant the player permission to it. While it remains an independent world item, the player can edit it according to the permissions granted. Once ready, it can be **dragged and dropped into the Relationships area** of the character sheet.
The Relationship can then be linked to a specific character: open the Relationship and drag the character into its link area. When a character is linked, its portrait and name can be used directly in the Relationship display.
### Why doesn't dragging another PC directly into the Relationships area create a Relationship?
Because the Relationships area expects a **Relationship**, not a character directly.
If you want the Relationship to point to another PC:
1. create or use a Relationship;
2. drop it into the character's Relationships area;
3. open the Relationship and drag the relevant PC into its link field.
Dropping a character directly onto the Relationships area is therefore not interpreted as creating a new Relationship automatically.
### Why might drag and drop of a Relationship or Dramatic Hook not work?
The character must be **owned by the user** performing the drag and drop, and the dropped element must be of the correct type.
The Relationships area accepts `relationship` Items, while the Dramatic Hooks area accepts `dramatichook` Items.
Dropping a character directly into either area does not work: a character can be linked **inside** a Relationship or Dramatic Hook, but it does not replace the Relationship or Hook itself.
### What permissions does a player need to add a Relationship or Dramatic Hook to their sheet?
The Relationship or Dramatic Hook is created by the **GM**, who can then grant the player permission to open and edit it directly in the world. The player can therefore prepare or adjust its content freely while it remains an independent item, according to the permission level granted.
Once it is **dragged and dropped onto the character sheet**, Foundry creates an embedded copy on that character. From that point on, editing that embedded version is handled by the **GM**. This is the workflow used by the system for these shared narrative elements, built on Foundry VTT's normal permission model.
### Why aren't Relationships simple text fields?
Because a Relationship contains more than just a name.
A Relationship can contain:
- a summary;
- a description;
- a Relationship value: **Neutral (0)**, **Meaningful (+1)**, or **Vital (+2)**;
- a link to a character.
That link makes it possible to display the linked character's portrait and name while keeping the Relationship's own information.
### I'm a player: why can't I freely edit my Relationships and Dramatic Hooks?
Because the system does not treat them as simple private notes on the character sheet, but as **shared narrative elements** between the player, the GM, and sometimes the other players.
This directly reflects how **KULT: Divinity Lost** describes these mechanics. In *Beyond Darkness and Madness*, Dramatic Hooks are presented as player-initiated subplots that are shaped at the group level: players suggest Hooks for one another, the affected player's consent is central, and the text stresses that the group's collective storytelling comes before any individual Hook. Relationships follow the same logic: they evolve through the fiction, may involve several characters, and changes are discussed between player and GM — or between both players when the Relationship is between PCs.
The Foundry implementation therefore mirrors that approach, but with an important distinction: **before drag and drop**, the Relationship or Dramatic Hook is an independent world item. The GM can grant the player permission to it, allowing the player to open and edit it freely.
Only **after the item has been dragged onto the character sheet** — and therefore embedded in the character — is its editing reserved for the GM. Players still retain the actions that belong directly to them during play: they can view these elements and, for example, mark a Dramatic Hook as **Completed** themselves.
This is not intended as an anti-cheating restriction. It is meant to distinguish personal character management from elements that are shared parts of the fiction.
### How do I create and manage a Dramatic Hook?
A Dramatic Hook is a structured element that can be added to a Player Character.
The **GM first creates the Dramatic Hook in the world** and can grant the player permission to complete or edit it. Once ready, it is dragged into the Player Character's **Dramatic Hooks** area.
A Dramatic Hook can contain a description and can be linked to another element. The system accepts a **character**, or certain items: **Dark Secret**, **Gear**, or **Weapon**.
The player can mark the Dramatic Hook as **Completed** directly from their sheet. Edit and delete controls for the Item remain restricted to the GM on the Player Character sheet.
### Why doesn't completing a Dramatic Hook automatically add 1 XP?
Under the general rules, completing a Dramatic Hook normally grants **1 XP**. However, not every Dramatic Hook necessarily follows that rule: some specific effects can create a Dramatic Hook that **grants no XP**.
The system therefore keeps the two actions separate:
- the Dramatic Hook is marked **Completed**;
- Experience is marked separately when it should actually be awarded.
This prevents the system from automatically granting XP in cases where that Dramatic Hook should not provide any.
## 5. Weapons, Armor, and Combat
### Why can't I create a Weapon or Armor directly from the character sheet?
The Player Character sheet allows **Gear** to be created directly, but **Weapons** and **Armor** are handled as separate structured items.
A Weapon can contain several attacks, each with its own Harm, ammo cost, effect, and description. Armor includes a protection rating and an equipped/unequipped state.
Weapons and Armor are therefore added to the sheet by **drag and drop**, either from a compendium or from world items.
### How do I add a custom Weapon or Armor?
The **GM first creates the Weapon or Armor in the world** and configures its properties.
As with Relationships and Dramatic Hooks, the GM can grant the player permissions on that item while it remains independent in the world. The player can then view or edit it according to the permissions granted.
Once the item is ready, simply **drag and drop it into the Weapons or Armor area** of the character sheet. The embedded copy is then managed from the character sheet.
### Why do Weapons and Armor use their own items?
Because they carry information that is used directly by the system's automation.
A Weapon can define, among other things:
- one or more attacks;
- the Harm of each attack;
- an optional ammo cost;
- special effects;
- the distances at which it can be used.
Armor has a **protection rating** that is taken into account while it is equipped.
This structure lets the system use those values directly during Moves instead of treating a Weapon or Armor as a simple line of text.
### How do I use Engage in Combat?
When you roll **Engage in Combat**, the system opens a combat selector.
It displays the character's **currently equipped Weapons** and the available attacks for each one. Select the attack you are using: the system then rolls the Move and includes the selected attack's information, including its Harm, effect, and any ammo cost.
If the attack consumes ammunition, it is deducted automatically.
### Why does Engage in Combat ask me to select a Weapon and an attack?
Because the combat result depends on **how the character is attacking**.
A single Weapon can provide several attacks with different Harm values, effects, or ammo costs. The selector therefore tells the system exactly which attack is being used and lets it display the correct information with the roll.
Only **equipped** Weapons appear in this selector.
### Can I use Engage in Combat without a weapon?
**Yes.**
The system simply represents unarmed combat with a Weapon called **Unarmed**.
To fight unarmed, that item must be present in the character's inventory and be **equipped**. It will then appear in the combat selector like any other Weapon.
This also reflects the KULT rules, where an unarmed attack has its own Harm value.
### Why isn't the Unarmed Weapon always treated as equipped?
This is intentional.
The system does not assume that a character is **always able to attack unarmed**. They may be restrained, immobilized, unconscious, or in another situation where such an attack is not possible.
The **Unarmed** item therefore needs to be equipped when that option is actually available, rather than being forced on at all times by the system.
### How is Armor taken into account?
Armor must be **equipped** to apply.
When rolling **Endure Injury**, the system asks how much Harm was suffered and then automatically adds the protection rating of all equipped Armor to the roll modifier.
There is therefore no need to add the Armor value manually each time.
## 6. Sharing and Display
### How do I share an Advantage, Disadvantage, or another element displayed from the character sheet?
Simply open the element from the Player Character sheet.
In the viewer window, open the **⋮** menu in the top-right corner and choose **Share**. The system then displays the list of currently connected users: select the recipients you want, then confirm.
The same workflow applies to the different elements displayed in this viewer, such as Advantages, Disadvantages, Abilities, Weapons, Armor, Relationships, Dramatic Hooks, and so on.
### Can I share an element with only certain players?
**Yes.**
Sharing is **targeted**. You choose exactly which users should receive the window: one player, several players, a GM, or any combination of currently connected users.
There is therefore no need to reveal the information to the whole table.
### Does sharing change the item's permissions?
**No.**
Sharing a window does not grant ownership or editing rights over the item. The system simply opens its **viewer** for the selected recipients.
The Foundry permissions on the item remain unchanged.
### Can I share an image with only certain players?
**Yes.**
Image sharing uses the same recipient selector. When sharing an image, you can choose exactly which currently connected users should see it.
This makes it possible, for example, to show an illustration or clue to a single player without displaying it to everyone else.
### Why doesn't the character sheet always show the same controls to players and GMs?
Because some actions belong to the **player**, while others are part of **GM management**.
The system therefore adapts the available controls according to the user's role and the type of element involved. For example, players can spend their Edge, mark a Dramatic Hook as Completed, or manage certain personal elements, while the GM retains the controls needed for Hold, some edits to embedded items, and other shared narrative elements.
The goal is not to hide functions arbitrarily, but to show each user the actions that belong to them within the system's workflow.
## 7. Languages, Translations, and Scenarios
### Is there a French version of the system?
The main **`k4lt`** system includes the French interface directly, while translated content is extended by the **`k4lt-fr`** module.
This module adds French translations for the system compendiums, including **Archetypes**, **Occupations**, **Appearance**, **Weapons**, **Armor**, and **Special Equipment**, along with other additional content.
**Important: these are my own translations and adaptations for Foundry VTT. They are not the canonical French translation published by Arkhane Asylum Publishing.**
This can occasionally make a term difficult to find if you search for it using its official French name. For example:
- **Prévoyant** in Arkhane Asylum's French edition appears as **Préparé·e** in `k4lt-fr`;
- **Conscience augmentée** appears as **Sensibilité accrue** in `k4lt-fr`.
These are the same Advantages as in the original English edition; only the French title and wording differ. These differences are intentional because Arkhane Asylum's French text cannot be reused verbatim in the module.
To work, `k4lt-fr` also uses **Babele**, **libWrapper**, and **`k4lt-assets`**.
### Which ready-to-play scenarios are available in French?
The **`k4lt-fr`** module currently contains three ready-to-play adventures:
- **La Galerie des Âmes**;
- **Oakwood Heights VF**;
- **Écho du passé**.
They are prepared for Foundry VTT with Journals, characters, NPCs, scenes, and the other elements needed to use them directly in a world.
### Which ready-to-play scenarios are available in English?
The **`k4lt-en`** module currently provides their English counterparts:
- **Gallery of Souls**;
- **Oakwood Heights**;
- **An Echo From the Past**.
The `k4lt-en` module requires the `k4lt` system and the **`k4lt-assets`** resource module.
### Is there a French version of The Black Madonna?
**No.**
The Foundry VTT module for **The Black Madonna** remains available in English only. The `k4lt-fr` module does not automatically translate its content, and there is currently no official French version of this module.
For groups that still want to play the campaign in French, **Deep Translate** can translate an entire Foundry world with DeepL while preserving its structure and formatting. This can make the English campaign usable in French, but **it is not an official translation**.
## 8. Migration and Troubleshooting
### Does updating a module update adventures already imported into a world?
**No, not automatically.** World documents are copies of the compendium documents. Updating k4lt-fr or k4lt-en does not automatically replace these copies or your personal changes.
To receive corrections, compare the documents with their compendium counterparts and reimport the affected elements if needed, keeping your notes and customizations.
The **seven seal macros from An Echo From the Past / Écho du Passé** must specifically be reimported to receive fixes for Archetypes as separate items from Occupations, consciousness states, and rewards.
### What should I do if an older character is not using the current versions of its Traits?
The **Macros** compendium contains the `Update PC Traits to v14` macro.
It allows the GM to select one or more Player Characters from an earlier system version and replace their **Advantages**, **Disadvantages**, **Abilities**, and **Limitations** with the current versions intended for v14.
This is especially useful for characters kept from an older campaign or imported from a world created before the Foundry VTT v14 migration.
### Why does my character have two Unarmed Weapons?
On some older characters, the flag used by the system to identify the **Unarmed** Weapon as a starting weapon may be missing.
The **Macros** compendium contains the `Fix Starting Weapon Flags` macro. It marks the existing Unarmed Weapon as a starting weapon so the system does not add another copy.
This macro is intended for existing characters affected by that issue; it should not normally be needed for characters created with current versions of the system.
### Are Stability and Wounds automatically taken into account in rolls?
**Yes.**
The system automatically applies **Stability** when it should modify a roll, including Disadvantages, **Keep It Together**, and **See Through the Illusion**.
When Wounds should also affect the same roll, both effects are combined automatically. There is therefore no need to recalculate these modifiers manually before each roll.
### Do Conditions automatically affect Stability?
**Yes, when applicable.**
Since the system's v14 migration, Conditions are automatically taken into account for Stability when relevant. Players and GMs therefore do not need to manually transfer their effects into the affected rolls.
### What should I check first if something behaves differently from what this FAQ describes?
First check:
- that **Foundry VTT** and the `k4lt` system are using compatible versions;
- that the system and add-on modules are **up to date**;
- whether the character comes from an older version and requires a migration macro;
- that the modules required by `k4lt-fr` or `k4lt-en` are installed and enabled;
- and, for issues involving items or drag and drop, that the required **Foundry VTT permissions** are correctly configured.
For older characters, the migration macros provided in the **Macros** compendium should be preferred over manually fixing each element one by one.
## 9. Optional AI Content and Enhanced Scenarios
### Why is there a separate `k4lt-assets-ai` module?
The `k4lt-assets-ai` module contains only resources generated with AI tools.
It is kept separate from `k4lt-assets` so that modules distributed through Foundry VTT's official channels remain compliant with Foundry's AI policy, while still allowing users who want them to use these additional resources.
The content in `k4lt-assets-ai` is **unofficial**, is not part of KULT's canonical material, and has not been approved, endorsed, or reviewed by Helmgast or the KULT rights holders.
### Is `k4lt-assets-ai` required to play?
**No.**
The main modules and scenarios work without it.
`k4lt-assets-ai` only adds additional visual and audio resources designed to enhance certain scenarios. Installing and using it is therefore entirely optional.
### How do I install `k4lt-assets-ai`?
The module is not distributed through Foundry VTT's official package browser.
The recommended method is to use the manifest URL:
`https://github.com/YanKlInnomme/FoundryVTT-k4lt-assets-ai/releases/latest/download/module.json`
In Foundry VTT:
1. open **Add-on Modules**;
2. click **Install Module**;
3. paste the URL into the **Manifest URL** field;
4. install the module;
5. then enable it in your world.
It can also be installed manually from the GitHub Releases page.
### If I install `k4lt-assets-ai`, are the AI resources automatically used?
**No.**
Installing the module does not force anything.
For compatible scenarios, an option allows the additional AI resources to be **enabled or disabled**. You can therefore keep a scenario entirely AI-free or activate the extra resources on a case-by-case basis.
### How do I enable additional resources for a scenario?
After enabling k4lt-assets-ai and importing a compatible scenario, **reload the world (F5)** to display the dialog. Additional resources are disabled by default: **Yes** enables them, while **No** leaves them disabled.
The **Do not show again** checkbox hides the dialog for subsequent use. The options remain available in **Game Settings**, under **KULT: Divinity Lost - AI Assets**.
Each scenario has its own option: Gallery of Souls, Oakwood Heights, The Black Madonna, and An Echo From the Past.
To disable resources that are already enabled, open the **world settings**, go to the **KULT: Divinity Lost - AI Assets** module options, **uncheck the box for the scenario**, and save your changes.
### Where can I find imported additional journals?
When the resources are enabled, these journals are imported from the k4lt-assets-ai compendiums into the scenario's journal folder:
- **Sketches** in **Gallery of Souls / La Galerie des Âmes**;
- **Immersion Kit** in **Oakwood Heights / Oakwood Heights VF**;
- **Gallery / Galerie** in **An Echo From the Past / Écho du Passé**.
### Which scenarios currently have additional resources in `k4lt-assets-ai`?
The module currently provides optional resources for several pieces of content:
- **Gallery of Souls / La Galerie des Âmes**: 27 PC and NPC portraits, plus 10 illustrations depicting Christian Starker's sketches;
- **Oakwood Heights / Oakwood Heights VF**: 23 PC and NPC portraits, plus a 9-image immersion kit;
- **An Echo From the Past / Écho du Passé**: 39 portraits, including some characters’ real forms and several variants, 7 location illustrations, and a Gallery journal available in English and French;
- **The Black Madonna / La Madone Noire**: 62 NPC portraits, 11 location illustrations, 3 story-related illustrations, and 3 MP3 audio tracks.
These resources are added on top of the non-AI assets already used by the adventures; they remain entirely optional.
### Why describe scenarios as “one-click ready-to-play” with `k4lt-assets-ai`?
The scenarios already work without this module, using the resources allowed in the officially distributed modules.
However, `k4lt-assets-ai` adds portraits, atmospheric illustrations, visual aids, and audio content that make the presentation much more complete immediately after importing the adventure.
That is the sense in which it can turn an already prepared Foundry scenario into something closer to a **“one-click ready-to-play”** experience, without being required for the scenario to function.