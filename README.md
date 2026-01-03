Warhammer 40k (CUL) — Système Foundry VTT
=========================================

Description
-----------
Ce dépôt contient un système de jeu pour Foundry Virtual Tabletop (Foundry VTT).
Il s'agit d'un système nommé "Warhammer 40k (CUL)" conçu pour être installé dans une instance Foundry VTT et utilisé comme base de règles, d'acteurs et d'objets.

Métadonnées du système
----------------------
- id : `forkW40k`
- titre : `Warhammer 40k (CUL)`
- version : `25.12.30`
- compatibilité Foundry : minimum `13`, vérifié `13`
- modules ES : `forkW40k.mjs`
- feuilles de style : `forkW40k.css`

Prérequis
---------
- Foundry VTT (version 13 ou supérieure recommandée, voir la clé "compatibility" dans `system.json`).
- Navigateur moderne (Chrome, Firefox, Edge).

Installation
------------
Méthode manuelle :
1. Copier le dossier du système (ce dépôt) dans le répertoire de données de Foundry :
   - Sous l'instance Foundry, placez le dossier du système dans `Data/systems/`.
2. Redémarrez le serveur Foundry.
3. Au moment de créer un nouveau Monde, sélectionnez "Warhammer 40k (CUL)" dans la liste des systèmes.

Méthode via manifest (optionnel) :
- Si vous fournissez une URL de manifest JSON, vous pouvez l'ajouter dans la liste des manifests de Foundry (Setup → Add-on Modules → Manage Module Manifests) pour permettre une installation automatique via l'interface.

Activation et utilisation
-------------------------
1. Créer un nouveau Monde (Setup → Create World) et sélectionner le système `Warhammer 40k (CUL)` dans la liste déroulante "System".
2. Ouvrir le Monde créé et importer les packs de compendium si nécessaire (les packs fournis sont décrits dans `packs/`).
3. Configurer les paramètres du Monde selon vos préférences (Configuration du Monde → Paramètres du Monde).

Structure du dépôt
------------------
Voici les fichiers et dossiers importants contenus dans ce dépôt :

- `system.json` — Métadonnées du système (id, titre, version, compatibilité, modules, styles, packs, langues, etc.).
- `forkW40k.mjs` — Module JavaScript principal du système.
- `forkW40k.css` — Feuille(s) de style du système.
- `lang/fr.json` — Traductions françaises fournies.
- `packs/monsters/` — Conteneur de compendium pour acteurs/monstres.
- `packs/items/` — Conteneur de compendium pour objets.

Contribuer
----------
Les contributions sont bienvenues.
- Ouvrez une issue pour signaler un bug ou proposer une fonctionnalité.
- Soumettez une pull request (PR) avec une description claire des changements.
- Respectez le style du code et ajoutez des tests ou exemples si nécessaire.

Licence
-------
Licence : À définir (par défaut: MIT recommandée). Si vous souhaitez une autre licence, ajoutez un fichier `LICENSE` à la racine du projet et mettez à jour ce README.

Support et contact
-------------------
Les informations d'auteur/contacts sont configurées dans `system.json`. Mettez à jour ces champs si vous voulez fournir un e-mail, site web ou Discord.

Remarques finales
-----------------
Ce README fournit les étapes essentielles pour installer et utiliser ce système Foundry VTT. Si vous voulez que j'ajoute :
- Une licence précise (ex. MIT),
- Une URL de manifest pour installation automatique,
- Des captures d'écran ou exemples plus détaillés d'utilisation,
indiquez-le et j'adapterai le fichier.

