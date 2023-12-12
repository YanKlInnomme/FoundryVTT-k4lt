**See below for the English version**

# Système de Jeu KULT: Divinity Lost pour Foundry VTT
Kult est un jeu de rôle d'horreur qui se concentre sur les peurs et les pulsions enfouies dans notre subconscient. Les joueurs incarnent des personnages aux sombres secrets et évoluent dans des villes industrielles, affrontant des cultes sataniques, des tueurs psychopathes, des multinationales corrompues et bien plus encore.

Ce système de jeu est un ensemble de fichiers qui fournissent à Foundry VTT toutes les informations nécessaires pour prendre en charge les règles, les mécanismes et les éléments de jeu spécifiques à KULT: Divinity Lost.

Cette adaptation numérique est un contenu non officiel de KULT: Divinity Lost autorisé par la politique de contenu d'Helmgast (https://helmgast.se/en/meta/fan-content-policy).

![Capture d’écran 2023-07-26 095550](https://github.com/YanKlInnomme/FoundryVTT-k4lt/assets/100078854/12de9632-3c98-4a0e-af85-a6900b38438f)
![Capture d’écran 2023-07-26 095717](https://github.com/YanKlInnomme/FoundryVTT-k4lt/assets/100078854/28bd913c-e8b1-44a8-97ce-40273e8ff703)

Si vous appréciez le système et que vous avez les moyens de le faire, vous pouvez me soutenir via Tipeee (https://fr.tipeee.com/yank/news) pour m'aider à continuer l'aventure. Dans tous les cas, je vous souhaite de vous amuser pleinement, et n'hésitez pas à me contacter pour me donner votre avis ou me signaler tout problème éventuel.

## Prérequis

Afin de fonctionner ce système nécessite l'installation et la configuration de Foundry VTT. Le logiciel est téléchargeable à l'adresse suivante : https://foundryvtt.com/

## Contributeur·rice·s précédent·e·s

 * Tom LaPorta (https://gitlab.com/fattom23) - Versions 0.7 à 1.2
 * Astarte Horns (https://github.com/astarte-horns) - Versions 1.3 à 1.5
 * Roberto Lorite (https://www.comunidadumbria.com/) - Traduction brésilienne

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
 * Ajout de titres éditables dans la zone "contexte"

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
 * Ajout des zones éditables "Ce à quoi vous tenez", "Ce que vous possédez", "Relations avec les autres personnages" et "Ressorts dramatiques"
 * Ajout du champ 'Options' dans Actions pour éviter l'affichage 'undefined' dans le tchat
 * Mise à jour globale de l'esthétique et notamment concernant la fiche de Personnage Joueur
 * Modification esthétique et fonctionnelle de la Pause
 * Nettoyage du code et Migration en V10 réalisé par Kristov (https://github.com/Qaw)
 * Refonte globale du processus de gestion des Blessures réalisée par Kristov (https://github.com/Qaw)
 * Suppression de l'attribut éditable des images sur les items 'Actions'
 * Suppression des champs basiques (Yeux, Taille, Age, etc.) au profit d'une zone plus concrète "Qui êtes-vous ?"
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
Kult is a horror role-playing game that focuses on the fears and impulses buried in our subconscious. Players take on the role of characters with dark secrets and move through industrial cities, battling satanic cults, psychopathic killers, corrupt multinational corporations and more.

This game system is a set of files that provides Foundry VTT with all the information needed to support the rules, mechanics and gameplay elements specific to KULT: Divinity Lost.

This digital adaptation is unofficial content of KULT: Divinity Lost, allowed by the content policy of Helmgast (https://helmgast.se/en/meta/fan-content-policy).

If you like the system and have the means, you can support me via Tipeee (https://fr.tipeee.com/yank/news) to help me continue the adventure. In any case, have fun and don't hesitate to contact me to give me your opinion or to report any problems.

## Requirements

This system requires the installation and configuration of Foundry VTT. The software can be downloaded from the following address: https://foundryvtt.com/

## Previous contributors

 * Tom LaPorta (https://gitlab.com/fattom23) - Versions 0.7 to 1.2
 * Astarte Horns (https://github.com/astarte-horns) - Versions 1.3 to 1.5
 * Roberto Lorite (https://www.comunidadumbria.com/) - Brazilian translation

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
 * Added editable titles in the "background" area

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
 * Removal of basic fields (eyes, height, age, etc.) in favour of a more concrete "Who are you?
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
