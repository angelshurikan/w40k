<!--
📝 Fichier : .github/copilot-instructions.md
- Rôle : Consignes spécifiques pour l'assistant / contributors du projet forkW40k.
- But  : Documenter que le dépôt est un Système Foundry VTT (v13) - Warhammer 40k custom,
         et donner les instructions d'installation, d'utilisation et de contribution.
-->

# Instructions projet — forkW40k (FR)

🧭 Résumé

- Ce dépôt est un SYSTÈME pour Foundry Virtual Tabletop (Foundry VTT) — version 13.
- Thème : Warhammer 40k (custom system).

<!-- 📝 Ajout: déclaration claire du type de projet -->

## Métadonnées importantes

- id : `forkW40k`
- titre : `Warhammer 40k (CUL)`
- version : voir `system.json` (ex : `25.12.30`).
- compatibilité Foundry : minimum `13` (compatibility.minimum dans `system.json`).

<!-- 📝 Ajout: utiliser system.json comme source de vérité pour id/version/compat -->

## Objectif du fichier

- Fournir des consignes rapides pour les contributeurs et pour l'assistant automatique (Copilot/CI).
- Expliquer l'installation manuelle et via manifest, la structure du dépôt et les points de contribution.

<!-- 📝 Ajout: objectif court et usage -->

## Installation (méthode manuelle)

1. Copier le dossier du système (`forkW40k`) dans le répertoire Foundry `Data/systems/` de votre instance Foundry VTT.
2. Redémarrer le serveur Foundry.
3. Lors de la création d'un nouveau Monde, sélectionner le système `Warhammer 40k (CUL)`.

<!-- 📝 Ajout: instructions manuelles concises -->

## Installation via manifest (optionnel)

- Si vous hébergez un manifest JSON, ajoutez son URL dans Setup → Add-on Modules → Manage Module Manifests de Foundry pour permettre l'installation automatique.
- Exemple minimal de manifest (hébergement requis) :

```json
{
  "name": "forkW40k",
  "title": "Warhammer 40k (CUL)",
  "description": "Système Foundry VTT - Warhammer 40k custom",
  "version": "25.12.30",
  "compatibleCoreVersion": "13"
}
```

<!-- 📝 Ajout: snippet manifest exemple -->

## Activation et utilisation

1. Créer un nouveau Monde (Setup → Create World) et choisir `Warhammer 40k (CUL)` comme System.
2. Importer les compendiums depuis le dossier `packs/` si nécessaire.
3. Configurer les paramètres du Monde via Configuration → Paramètres du Monde.

<!-- 📝 Ajout: guide d'activation court -->

## Structure du dépôt (points importants)

- `system.json` — métadonnées et configuration principale du système.  <!-- 🔗 Mise à jour: source de vérité -->
- `forkW40k.mjs` — module JS principal.  <!-- 📝 Ajout: logique front/module -->
- `forkW40k.css` — styles du système.  <!-- 📝 Ajout: styles personnalisés -->
- `lang/fr.json` — traductions françaises.  <!-- 📝 Ajout: localisation FR -->
- `packs/monsters/` — compendium d'acteurs/monstres (fichiers pack).  <!-- 📝 Ajout: compendium -->
- `packs/items/` — compendium d'objets.  <!-- 📝 Ajout: compendium -->

<!-- 📝 Ajout: liste courte des fichiers clés -->

## Contribuer

- Ouvrir une issue pour bug / demande de fonctionnalité.
- Proposer une Pull Request (PR) claire et ciblée.
- Respecter le style du code et ajouter des exemples/tests si applicable.

<!-- 📝 Ajout: flow de contribution -->

## Licence

- Par défaut: ajouter un fichier `LICENSE` (MIT recommandé) si vous voulez autoriser une large réutilisation.

<!-- 📝 Ajout: laisser le mainteneur choisir la licence -->

## Remarques pour l'assistant / CI

- Se référer à `system.json` pour la compatibilité et les ressources exposées (`esmodules`, `styles`, `packs`, `languages`).
- N'ajouter aucune commande d'exécution (Symfony/Docker) dans ce dépôt — l'instance Foundry tourne sur un serveur distant.

<!-- 📝 Ajout: consigne pour l'assistant -->

## Contact / Auteur

- Les informations d'auteur/configuration sont dans `system.json` (champ `authors`). Mettez-les à jour si nécessaire.

<!-- 📝 Ajout: pointer vers system.json pour les contacts -->

<!-- Commentaire inline : fichier mis à jour pour correspondre au projet Foundry VTT v13 / Warhammer 40k custom -->
