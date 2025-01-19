![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FYanKlInnomme%2FFoundryVTT-k4lt%2Fmaster%2Fsystem.json&query=%24.compatibility.verified&label=foundry%20vtt&color=%23ee9b3a) ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FYanKlInnomme%2FFoundryVTT-k4lt%2Fmaster%2Fsystem.json&query=%24.version&label=version&color=%230f2f2b) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/YanKlInnomme/FoundryVTT-k4lt/total) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-raw/YanKlInnomme/FoundryVTT-k4lt) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed-raw/YanKlInnomme/FoundryVTT-k4lt) ![GitHub forks](https://img.shields.io/github/forks/YanKlInnomme/FoundryVTT-k4lt) ![GitHub Repo stars](https://img.shields.io/github/stars/YanKlInnomme/FoundryVTT-k4lt) [![Static Badge](https://img.shields.io/badge/buy_me_a_coffee-FFDD00?logo=Buy%20Me%20A%20Coffee&logoColor=black)](https://www.buymeacoffee.com/yank)

**See below for the English version**

# Système de Jeu KULT: Divinity Lost pour Foundry VTT
Kult est un jeu de rôle d'horreur qui se concentre sur les peurs et les pulsions enfouies dans notre subconscient. Les joueurs incarnent des personnages aux sombres secrets et évoluent dans des villes industrielles, affrontant des cultes sataniques, des tueurs psychopathes, des multinationales corrompues et bien plus encore.

Attention, ce jeu explore des thèmes matures liés à l'horreur psychologique et corporelle. Au sein des différents ouvrages qui le constitue, on y trouve des exemples explicites d'abus physiques et mentaux, de violence, d'agression sexuelle, d'exploitation religieuse, de maltraitance des enfants, de maladie mentale, d'enlèvement et de rapt, de cruauté et de mort animale, de grossesse et d'accouchement, de fausse couche et d'avortement, de consommation de drogue, d'automutilation et de suicide, de sang et de mort.

Ce système de jeu est un ensemble de fichiers qui fournissent à Foundry VTT toutes les informations nécessaires pour prendre en charge les règles, les mécanismes et les éléments de jeu spécifiques à KULT: Divinity Lost.

![Capture d'écran 2025-01-16 092150](https://github.com/user-attachments/assets/3665a9e6-41d0-4aba-98d3-07569e33bfb1)
![Capture d'écran 2025-01-16 092327](https://github.com/user-attachments/assets/1ff4e22c-df6b-4f6a-93bf-2ab53e1668a0)
![Capture d’écran 2024-03-07 234841](https://github.com/YanKlInnomme/FoundryVTT-k4lt/assets/100078854/aefb90b2-9af0-4149-ba5b-dc205895ff06)

Si vous appréciez le système et que vous avez les moyens de le faire, vous pouvez me soutenir en m'offrant un café sur Buy Me a Coffee (https://www.buymeacoffee.com/yank). Votre geste sera grandement apprécié et contribuera à soutenir le développement continu. Quoi qu'il en soit, je vous souhaite une expérience enrichissante et divertissante. N'hésitez pas à me contacter pour partager vos commentaires ou signaler tout problème éventuel.

## Prérequis

Afin de fonctionner ce système nécessite l'installation et la configuration de Foundry VTT. Le logiciel est téléchargeable à l'adresse suivante : https://foundryvtt.com/

## Licences

Cette adaptation numérique est un contenu non officiel de KULT: Divinity Lost, autorisé par la [politique de contenu d'Helmgast](https://helmgast.se/en/meta/fan-content-policy). En outre, ce projet inclut :

- **Contenu et logo** : KULT et les logos, personnages, noms et ressemblances qui y sont associés sont des marques commerciales ou des marques déposées de Cabinet Licensing LLC. [Kult Divinity Lost](https://kultdivinitylost.com/) est développé et publié par Helmgast AB. Utilisées avec autorisation. Tous droits réservés. Les parties de ce projet protégées par ce copyright ne peuvent être distribuées commercialement ou librement. Cela inclut les illustrations, le logo et le texte couverts par le droit d'auteur.

- **Code source** : Tout le code source _(javascript, css, etc.)_ est sous licence [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

- **Foundry VTT** : Le projet est créé conformément à l'[accord de licence limitée de Foundry VTT concernant le développement de paquets](https://foundryvtt.com/article/license/).

- **Icônes** : Les icônes du dossier `assets/moves/` sont une gracieuseté de [Game-icons.net](https://game-icons.net/) et sont sous licence [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

- **Polices de caractères** : Les polices utilisées dans ce projet ont leurs propres licences.

## Contributeur·rice·s précédent·e·s
 * Tom LaPorta (https://gitlab.com/fattom23) - Versions 0.7 à 1.2
 * Astarte Horns (https://github.com/astarte-horns) - Versions 1.3 à 1.5
 * Roberto Lorite (https://www.comunidadumbria.com/) - Traduction brésilienne

## Version 4.0.0.1
 * Correction d'un bug mineur dans le compendium 'Capacités'

## Version 4.0.0.0
 * Migration v12 véritablement complète (enfin j'espère, j'avais oublié les objets) du système (select>selectOptions)
 * Ajout des conditions 'En colère', 'Triste', 'Effrayé·e', 'Accablé·e de culpabilité', 'Obsédé·e', 'Distrait·e' et 'Hanté·e' pour les personnages joueurs, y compris gestion de la retenue pour 'Hanté·e'
 * Création de questionnaires liés aux conditions (outil de narration, créé par mes soins)
 * Mise en évidence des conditions actives via un badge sur la fiche du personnage
 * Ajout d'une gestion complète de la progression (Points d'EXPérience, Niveau, État de conscience, Progressions, etc.) pour les personnages joueurs
 * Mise en évidence des personnages joueurs dans l'onglet Acteurs en y ajoutant l'état de conscience et le niveau
 * Passage automatique de niveau lors de l'acquisition de 5 points d'EXPérience avec message dans le chat
 * Mise à jour de l'ensemble des fichiers de langue (.json) avec l'ajout des nouvelles entrées (à vérifier par les concerné·e·s)

## Version 3.2.0.0
 * Migration v12 complète du système (select>selectOptions et mergeObject>foundry.utils.mergeObject)
 * Ajout des objets 'Famille' et 'Métier' pour les personnages joueurs
 * Gestion dynamiques des sections 'Métiers', 'Avantages', 'Capacités', 'Limitations' et 'Familles' dans la fiche du personnage
 * Correction de l'affichage en privé (seulement pour le MJ et le joueur concerné) du résultat des jets de dés pour les actions 'Désavantages'

## Version 3.1.3.0
 * Ajout de la traduction en Russe par kevintheradioguy (https://github.com/kevintheradioguy) (fichier ru.json)
 * Modification du niveau maximun des caractéristiques à +5
 * Prise en compte de la présence de l'objet 'Dents serrées' sur la fiche du personnage pour les lancers de dés

## Version 3.1.2.1
 * Ajout de la traduction en Ukrainien par JornieNonsubia (https://github.com/JornieNonsubia) (fichier uk.json)

## Version 3.1.2.0
 * Mise à jour du mode de débogage, y compris traductions
 * Optimisation de l'image d'arrière-plan de la fiche de personnage (background-sheet.svg) de 1.76Mb à 516kB
 * Ajout d'un mode basse résolution pour changer l'image d'arrière-plan de la fiche de personnage (background-sheet.webp) pour les ordinateurs à faible spécification
 * Ajout des niveaux d'attributs sur la fiche des PNJ

## Version 3.1.1.0
 * Correction des modificateurs 'Mod. Continu' et 'Mod. Situation' (affichage dans le chat des valeurs prises en compte lors du lancer + remise à zéro automatique du modificateur 'Mod. Situation' après le jet)
 * Affichage en privé (seulement pour le MJ et le joueur concerné) du résultat des jets de dés pour les actions 'Désavantages'
 * Ajout d'une vignette spécifique pour le système de jeu (thumbnail.webp), l'image lors de la création de monde reste inchangée (background.webp)

## Version 3.1.0.0
 * Passage à la version 12 de Foundry VTT

## Version 3.0.1.1
 * Corrections mineures des compendiums 'Actions', 'Avantages', 'Capacités', 'Sombres Secrets', 'Désavantages' et 'Limitations'
 * Corrections mineures dans le fichier de langue (fr.json)

## Version 3.0.0.1
 * Ajout du compendium 'Exemples de personnages'

## Version 3.0.0.0
 * Ajout des compendiums 'Avantages', 'Désavantages', 'Sombres Secrets', 'Capacités' et 'Limitations'
 * Suppression du compendium 'Examples'
 * Corrections orthographiques dans les fichiers linguistiques
 * Agrandissement du champ de saisie de la portée dans l'objet 'Arme'
 * Mise à jour des liens Boutique, Dépot et Donation dans l'onglet 'Paramètres' 

## Version 2.1.4.2
 * Ajout de la traduction en Italien par Arcadio21 (https://github.com/Arcadio21) (fichier it.json) 

## Version 2.1.4.1
 * Correction pour prise en compte des malus dû à la stabilité sur les jets de 'Désavantages'

## Version 2.1.4.0
 * Mise à jour du système de jet de dés par Kristov (https://github.com/Qaw) pour assurer un bon fonctionnement du module Nice so Dice (https://gitlab.com/riccisi/foundryvtt-dice-so-nice) et permettre de réaliser des jets cachés

## Version 2.1.3.3
 * Ajout de la traduction en Polonais par Otimor (https://github.com/otimor) (fichier pl.json) 

## Version 2.1.3.2
 * Ajout de la traduction en Allemand par Devilscryer (https://github.com/Devilscryer) (fichier de.json) 

## Version 2.1.3.1
 * Correction de l'affichage de l'entrée 'options' dans le chat (le html n'était pas pris en compte)

## Version 2.1.3.0
 * Passage en vectoriel pour l'arrière-plan des fiches (background-sheet.svg)
 * Ajout des objets 'Capacité' et 'Limitation' pour les Illuminés
 * Ajout des espaces 'Capacités' et 'Limitations' dans la fiche joueur avec prise en charge du glisser/déposer
 * Correction du compendium 'Moves' notamment l'action 'Influence Other' qui était incomplète
 * Ajout des liens Boutique, Dépot et Tipeee dans l'onglet 'Paramètres' 

## Version 2.1.2.1
 * Mise à jour des valeurs disponibles pour les caractéristiques
 * Réactivation du glisser-déposer par Kristov (https://github.com/Qaw)
 * Résolution du problème de duplication des actions lors de la copie ou de l'importation d'un PJ par Kristov (https://github.com/Qaw)

## Version 2.1.2.0
 * Affichage aléatoire d'images dans les résultats par Kristov (https://github.com/Qaw)
 * Ajout d'un template distinct pour le chat par Kristov (https://github.com/Qaw)
 * Mise à jour des traductions en duo avec Kristov (https://github.com/Qaw)
 * Optimisation globale du code

## Version 2.1.1.0
 * Mise à jour visuelle de l'affichage des résultats des actions

## Version 2.1.0.0
 * Mise à jour suite à la sortie la version 11 de Foundry VTT
 * Migration des compendiums 'examples' et 'moves' de NeDB vers LevelDB (NeDB est mort, vive LevelDB)
 * Mise à jour des chemins d'accès aux packs dans le manifest 

## Version 2.0.1.1
 * Correction de la nonincrémentation de 'token' par Kristov (https://github.com/Qaw)

## Version 2.0.1.0
 * Correction nom des actions non défini : move.system.name > move.name (fichier k4ltActor.js)

## Version 2.0.0.9
 * Suppression de l'attribut éditable des images sur les items 'Avantages', 'Désavantages' et 'Sombres secrets'
 * Prise en compte correct de l'attribut 'passif' (affichage avertissement et pas de lancer de dés)

## Version 2.0.0.8
 * Mise à jour de la traduction en Espagnol par MaeseFingolf (https://github.com/MaeseFingolf) (fichier es.json) 
 * Corrections mineures sur les fichiers de langues (fichiers en.json & fr.json)
 * Ajout d'un arrière plan spécifique au système lors de l'accès à la partie
 * Ajout de titres éditables dans la zone 'contexte'

## Version 2.0.0.7
 * Amélioration du contraste dans les zones texte (notamment 'Qui es-tu' ?)
 * Reformulation de la formule liée à la stabilité pour la prise en compte correcte du modificateur Garder le contrôle

## Version 2.0.0.6
 * Correction de la stabilité (prise en compte correcte du modificateur Garder le contrôle: -2 et non -3)

## Version 2.0.0.5
 * Mise à jour de la fiche de Personnage Non Joueur
 * Corrections mineures

## Version 2.0.0.0
 * Ajout de la traduction partielle en Français (fichier fr.json)
 * Ajout des onglets 'Contexte' et 'Notes'
 * Ajout des zones éditables 'Ce à quoi vous tenez', 'Ce que vous possédez', 'Relations avec les autres personnages' et 'Ressorts dramatiques'
 * Ajout du champ 'Options' dans Actions pour éviter l'affichage 'undefined' dans le tchat
 * Mise à jour globale de l'esthétique et notamment concernant la fiche de Personnage Joueur
 * Modification esthétique et fonctionnelle de la Pause
 * Nettoyage du code et Migration en V10 réalisé par Kristov (https://github.com/Qaw)
 * Refonte globale du processus de gestion des Blessures réalisée par Kristov (https://github.com/Qaw)
 * Suppression de l'attribut éditable des images sur les items 'Actions'
 * Suppression des champs basiques (Yeux, Taille, Age, etc.) au profit d'une zone plus concrète 'Qui êtes-vous ?'
 * Suppression du lancer de dés sur les items 'Relations' de la fiche PJ

## Version 1.5.0.0
 * Ajout des champs manquants dans la fiche de Personnage Non Joueur, y compris réorganisation
 * Correction de la fiche de Personnage Non Joueur

## Version 1.4.1.0
 * Correction des attributs uniquement dans la plage -3 à 3

## Version 1.4.0.1
 * Correction des liens incorrects dans le fichier 'system.json'

## Version 1.4.0.0
 * Ajout de la traduction espagnole

## Version 1.3.1.0
 * Correction de l'erreur de suppression des actions du Personnage Joueur

## Version 1.3.0.0
 * Ajout du champ 'Options' dans Avantages et Désavantages

## Version 1.2.3.0
 * Migration du système en V9.269

## Version 1.2.2.0
 * Correction des entrées invalides dans le fichier manifeste

## Version 1.2.1.0
 * Correction des entrées invalides dans le fichier manifeste

---------------------------------------------------------------------

# KULT: Divinity Lost Game System for Foundry VTT
Kult is a horror role-playing game that focuses on the fears and impulses buried in our subconscious. Players embody characters with dark secrets and evolve in industrial cities, confronting satanic cults, psychopathic killers, corrupt multinationals and much more.

Be warned: this game explores mature themes of psychological and body horror. Within the various books that make it up, there are explicit examples of physical and mental abuse, violence, sexual assault, religious exploitation, child abuse, mental illness, kidnapping and abduction, animal cruelty and death, pregnancy and childbirth, miscarriage and abortion, drug use, self-mutilation and suicide, blood and death.

This game system is a set of files that provide Foundry VTT with all the information needed to support the rules, mechanics and gameplay elements specific to KULT: Divinity Lost.

If you like the system and have the means to do so, you can buy me a coffee (https://www.buymeacoffee.com/yank) to show your support and help me continue development. In any case, I hope you have a great time, and please don't hesitate to contact me to give me your opinion or report any problems.

## Requirements

This system requires the installation and configuration of Foundry VTT. The software can be downloaded from the following address: https://foundryvtt.com/

## Licenses

This digital adaptation is unofficial content from KULT: Divinity Lost, authorized by [Helmgast content policy](https://helmgast.se/en/meta/fan-content-policy). In addition, this project includes:

- **Content and Logo**: KULT and associated logos, characters, names and likenesses are trademarks or registered trademarks of Cabinet Licensing LLC. [Kult Divinity Lost](https://kultdivinitylost.com/) is developed and published by Helmgast AB. Used with permission. All rights reserved. Portions of this project protected by this copyright may not be distributed commercially or freely. This includes illustrations, logo and text covered by copyright.

- **Source code**: All source code _(javascript, css, etc.)_ is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

- **Foundry VTT**: The project is created in accordance with the [Foundry VTT Limited License Agreement for Module Development](https://foundryvtt.com/article/license/).

- **Icons** : The icons in the `assets/moves/` folder are courtesy of [Game-icons.net](https://game-icons.net/) and are licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

- **Fonts** : The fonts used in this project have their own licenses.

## Previous contributors

 * Tom LaPorta (https://gitlab.com/fattom23) - Versions 0.7 to 1.2
 * Astarte Horns (https://github.com/astarte-horns) - Versions 1.3 to 1.5
 * Roberto Lorite (https://www.comunidadumbria.com/) - Brazilian translation

## Version 4.0.0.1
 * Fixed a minor bug in the 'Abilities' compendium

## Version 4.0.0.0
 * Full migration to v12 of the system (select>selectOptions and mergeObject>foundry.utils.mergeObject)
 * Added 'Angry', 'Sad', 'Scared', 'Guilt Ridden', 'Obsessed', 'Distracted' and 'Haunted' conditions for player characters, including hold management for 'Haunted'
 * Creation of questionnaires related to conditions (narrative tool, created by myself)
 * Highlighting of active conditions via a badge on the character sheet
 * Added complete progression management (Experience Points, Level, State of consciousness, Progressions, etc.) for player characters
 * Highlighting of player characters in the Actors tab by adding the state of consciousness and level
 * Automatic level increase when acquiring 5 Experience Points with a message in the chat
 * Update of all language files (.json) with the addition of new entries (to be checked by those concerned)

## Version 3.2.0.0
 * Full migration to v12 of the system (select>selectOptions and mergeObject>foundry.utils.mergeObject)
 * Added 'Family' and 'Occupation' objects for player characters
 * Dynamic management of the 'Occupations', 'Advantages', 'Abilities', 'Limitations' and 'Families' sections in the character sheet
 * Correction of the private display (only for the GM and the player concerned) of the dice roll results for 'Disadvantages' actions

## Version 3.1.3.0
 * Russian translation added by kevintheradioguy (https://github.com/kevintheradioguy) (ru.json file)
 * Modification of the maximum level of attributes to +5
 * Taking into account the presence of the 'Gritted Teeth' object on the character sheet for dice rolls

## Version 3.1.2.1
 * Ukrainian translation added by JornieNonsubia (https://github.com/JornieNonsubia) (uk.json file)

## Version 3.1.2.0
 * Update of the debug mode, including translations
 * Optimization of the character sheet background image (background-sheet.svg) from 1.76Mb to 516kB
 * Addition of a low resolution mode to switch the character sheet background image (background-sheet.webp) for low specification computers
 * Addition of attribute levels on the NPC sheet

## Version 3.1.1.0
 * Correction of the 'Ongoing' and 'Forward' modifiers (display in the chat of the values taken into account during the roll + automatic reset of the 'Forward' modifier after the roll)
 * Private display (only for the GM and the player concerned) of the dice roll results for 'Disadvantages' moves
 * Addition of a specific thumbnail for the game system (thumbnail.webp), the image when creating a world remains unchanged (background.webp)

## Version 3.1.0.0
 * Upgrade to Foundry VTT version 12

## Version 3.0.1.1
 * Minor corrections to the 'Actions', 'Advantages', 'Abilities', 'Dark Secrets', 'Disadvantages' and 'Limitations' compendiums.
 * Minor corrections to the french language file (fr.json)

## Version 3.0.0.1
 * Added 'Character Examples' compendium

## Version 3.0.0.0
 * Added 'Advantages', 'Disadvantages', 'Dark Secrets', 'Abilities' and 'Limitations' compendiums
 * Removal of the 'Examples' compendium
 * Spelling corrections in language files
 * Enlarged scope input field in 'Weapon' object
 * Shop, Deposit and Donation links updated in 'Settings' tab

## Version 2.1.4.2
 * Italian translation added by Arcadio21 (https://github.com/Arcadio21) (it.json file)

## Version 2.1.4.1
 * Correction to take into account stability malus on 'Disadvantages' rolls

## Version 2.1.4.0
 * Update of the dice roll system by Kristov (https://github.com/Qaw) to ensure smooth operation of the Nice so Dice module (https://gitlab.com/riccisi/foundryvtt-dice-so-nice) and enable hidden rolls

## Version 2.1.3.3
 * Polish translation added by Otimor (https://github.com/otimor) (pl.json file)

## Version 2.1.3.2
 * German translation added by Devilscryer (https://github.com/Devilscryer) (de.json file) 

## Version 2.1.3.1
 * Fixed display of 'options' entry in chat (html was not considered)

## Version 2.1.3.0
 * Vectorization of sheet background (background-sheet.svg)
 * Added 'Ability' and 'Limitation' objects for Enlightened
 * Added 'Abilities' and 'Limitations' spaces in the player sheet with drag'n'drop support
 * Corrected the 'Moves' compendium, in particular the 'Influence Other' action, which was incomplete.
 * Store, Deposit and Tipeee links added to 'Settings' tab

## Version 2.1.2.1
 * Updated available values for features
 * Drag'n'drop reactivated by Kristov (https://github.com/Qaw)
 * Action duplication problem solved when copying or importing a PJ by Kristov (https://github.com/Qaw)

## Version 2.1.2.0
 * Random image display in results by Kristov (https://github.com/Qaw)
 * Separate chat template added by Kristov (https://github.com/Qaw)
 * Translation update duo with Kristov (https://github.com/Qaw)
 * Global code optimization

## Version 2.1.1.0
 * Visual update of action results display

## Version 2.1.0.0
 * Updated after the release of Foundry VTT version 11
 * Migration of the 'examples' and 'moves' compendiums from NeDB to LevelDB (NeDB is dead, long live LevelDB)
 * Updated package paths in the manifest 

## Version 2.0.1.1
 * Correction of the non-increment of 'token' by Kristov (https://github.com/Qaw)

## Version 2.0.1.0
 * Correction name of actions not defined : move.system.name > move.name (file k4ltActor.js)

## Version 2.0.0.9
 * Removed the editable image attribute on 'Advantages', 'Disadvantages' and 'Dark Secrets' items
 * Correct consideration of the 'passive' attribute (display warning and no dice roll)

## Version 2.0.0.8
 * Update of Spanish translation by MaeseFingolf (https://github.com/MaeseFingolf) (es.json file)
 * Minor corrections on language files (en.json & fr.json files)
 * Added a system specific background when accessing the game
 * Added editable titles in the 'background' area

## Version 2.0.0.7
 * Improved contrast in text boxes (especially 'Who are you'?)
 * Rewording of the stability formula to correctly reflect the 'Keep Control' modifier

## Version 2.0.0.6
 * Stability correction (correct consideration of the Keep It Together modifier: -2 and not -3)

## Version 2.0.0.5
 * Update of the Non-Player Character form
 * Minor corrections

## Version 2.0.0.0
 * Add the partial French translation (fr.json file)
 * Added 'Background' and 'Notes' tabs
 * Added editable fields 'What you hold dear', 'Things in your possession', 'Relation to the other characters' and 'Dramatic Hooks'.
 * Added 'Options' field in Actions to avoid 'undefined' display in chat
 * General aesthetic update, particularly to the character sheet
 * Aesthetic and functional changes to Pause
 * Code cleanup and migration to V10 by Kristov (https://github.com/Qaw)
 * Global overhaul of the Wound management process by Kristov (https://github.com/Qaw)
 * Removed the editable image attribute on 'moves' items.
 * Removal of basic fields (eyes, height, age, etc.) in favour of a more concrete 'Who are you?
 * Removed the dice roll on 'Relationships' items in the PJ sheet

## Version 1.5.0.0
 * Added missing fields to the Non-Player Character form, including reorganisation
 * Correcting the Non-Player Character form

## Version 1.4.1.0
 * Correction of attributes only in the range -3 to 3

## Version 1.4.0.1
 * Fixed incorrect links in 'system.json' file

## Version 1.4.0.0
 * Added Spanish translation

## Version 1.3.1.0
 * Fixed the error of deleting the Player Character's actions

## Version 1.3.0.0
 * Added 'Options' field to Advantages and Disadvantages

## Version 1.2.3.0
 * Migration of the system to V9.269

## Version 1.2.2.0
 * Fix invalid entries in the manifest file

## Version 1.2.1.0
 * Fixed invalid entries in manifest file
