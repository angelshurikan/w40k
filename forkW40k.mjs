/* eslint-disable no-unused-vars */
/*
  Project: forkW40k — Foundry VTT System
  Description: Warhammer 40k (custom system) for Foundry Virtual Tabletop (Foundry VTT)

  Source of truth for metadata: system.json
    - id: forkW40k
    - title: Warhammer 40k (CUL)
    - version: 25.12.30
    - compatibility.minimum: 13

  Authors: see system.json (authors field)

  Exposed resources (declared in system.json):
    - esmodules: ["forkW40k.mjs"]
    - styles: ["forkW40k.css"]
    - packs: monsters (Actor), items (Item)
    - languages: lang/fr.json (French)

  Purpose of this header
    - Fournir la documentation principale directement dans le code (en-tête) plutôt que d'utiliser des icônes ou emoji dans des fichiers Markdown.
    - Donner des instructions d'installation rapides et des points d'entrée pour les contributeurs et l'assistant automatisé.

  Installation rapide (méthode manuelle)
    1. Copier le dossier `forkW40k` dans votre dossier Foundry Data/systems/ de l'instance Foundry VTT.
    2. Redémarrer le serveur Foundry.
    3. Lors de la création d'un nouveau Monde, sélectionner le système « Warhammer 40k (CUL) ».

  Manifest / installation automatique
    - Si vous hébergez un manifest JSON, ajoutez l'URL du manifest dans Setup → Add-on Modules → Manage Module Manifests dans Foundry.
    - Voir `system.json` pour la version et la compatibilité.

  Contribuer
    - Ouvrir une issue pour les bugs ou demandes de fonctionnalité.
    - Proposer des Pull Requests ciblées et documentées.
    - Respecter le style du code et mettre à jour `system.json` si vous changez les métadonnées exposées.

  Remarques pour l'assistant/CI
    - Lire `system.json` pour toute métadonnée (id, version, packs, languages, esmodules, styles).
    - La documentation fonctionnelle et les exemples courts doivent être placés ici (dans `forkW40k.mjs`) plutôt que d'utiliser des icônes dans des MD.
    - Ne pas ajouter de commandes d'exécution dépendantes d'un conteneur local ; Foundry tourne en environnement distant.
*/

// ... Le reste du module peut être implémenté ci-dessous ...

export const SYSTEM_ID = "forkW40k";
export const SYSTEM_VERSION = "25.12.30";
export const COMPAT_MINIMUM = 13;

// Point d'extension: initialisation du système. Compléter selon les besoins.
Hooks.once("init", () => {
  console.log(`${SYSTEM_ID} v${SYSTEM_VERSION} initialisation (compatibilité Foundry >= ${COMPAT_MINIMUM})`);

  /**
   * MondeNatalItemSheet
   * - Feuille d'Item dédiée au type `mondeNatal`
   * - Permet d'éditer l'origine (planetLabel), une description, et les caractéristiques par défaut
   * - Le transfert/copie vers l'Actor sera fait plus tard (hors périmètre V1)
   */
  class MondeNatalItemSheet extends ItemSheet {
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ["forkW40k", "sheet", "item", "monde-natal"],
        template: `systems/${SYSTEM_ID}/templates/item/monde-natal-sheet.html`,
        width: 560,
        height: 720,
        resizable: true
      });
    }

    getData(options) {
      const context = super.getData(options);

      // Alias pratique pour le template
      context.system = this.item.system || {};

      // Valeurs par défaut non persistées (évite les undefined dans l'UI)
      context.system.planetLabel = context.system.planetLabel ?? "";
      context.system.stats = context.system.stats ?? {};

      const s = context.system.stats;
      const defaults = {
        weaponSkill: 0,
        ballisticSkill: 0,
        strength: 0,
        toughness: 0,
        agility: 0,
        intelligence: 0,
        perception: 0,
        willpower: 0,
        fellowship: 0,
        fate: 0,
        insanity: 0,
        corruption: 0
      };
      for (const [k, v] of Object.entries(defaults)) {
        if (s[k] === undefined || s[k] === null || s[k] === "") s[k] = v;
      }

      return context;
    }

    async _updateObject(event, formData) {
      // Normaliser les champs numériques en entiers (si présents)
      const numKeys = [
        "system.stats.weaponSkill",
        "system.stats.ballisticSkill",
        "system.stats.strength",
        "system.stats.toughness",
        "system.stats.agility",
        "system.stats.intelligence",
        "system.stats.perception",
        "system.stats.willpower",
        "system.stats.fellowship",
        "system.stats.fate",
        "system.stats.insanity",
        "system.stats.corruption"
      ];

      const toInt = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.trunc(n) : fallback;
      };

      for (const k of numKeys) {
        if (formData[k] !== undefined) formData[k] = toInt(formData[k], 0);
      }

      await this.object.update(formData);
    }
  }

  // Enregistrer la sheet dédiée au type mondeNatal
  Items.registerSheet(SYSTEM_ID, MondeNatalItemSheet, {
    types: ["mondeNatal"],
    makeDefault: true
  });

  // Register a minimal player actor sheet for this system.
  /**
   * PlayerActorSheet
   * - Affiche un formulaire simple pour les personnages joueurs
   * - Champs : pseudo (name), vie (system.attributes.hp.value / max), mana (system.attributes.mana.value / max)
   * - Utilise les bonnes pratiques : defaultOptions, getData, activateListeners, _updateObject
   */
  class PlayerActorSheet extends ActorSheet {
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ["forkW40k", "sheet", "actor"],
        template: `systems/${SYSTEM_ID}/templates/actor/player-sheet.html`,
        width: 480,
        height: 320,
        resizable: false
      });
    }

    /**
     * Récupère les données pour le template. Nous fournissons `system` comme alias de actor.system
     * pour faciliter l'accès dans Handlebars. On expose également `canEdit` (seuls les MJ peuvent éditer).
     */
    getData(options) {
      const context = super.getData(options);
      // Exposer l'objet system (structures de données du système) sous `system`
      context.system = this.actor.system || {};
      // Garantir des valeurs d'affichage par défaut sans les persister
      context.system.attributes = context.system.attributes || {};
      context.system.attributes.hp = context.system.attributes.hp || { value: 10, max: 10 };
      context.system.attributes.mana = context.system.attributes.mana || { value: 5, max: 5 };

      // Déterminer si l'utilisateur courant peut éditer (ici : seulement les GMs)
      context.canEdit = !!(typeof game !== "undefined" && game.user && game.user.isGM);
      // stocker localement pour accès dans les méthodes
      this.canEdit = context.canEdit;

      // Attribut HTML prêt à injecter dans les inputs (soit '', soit 'disabled')
      context.canEditAttr = context.canEdit ? '' : 'disabled';

      return context;
    }

    /**
     * Activer les listeners (ex. boutons). Ici on empêche la soumission si l'utilisateur n'est pas autorisé.
     */
    activateListeners(html) {
      super.activateListeners(html);
      // Empêcher champs numériques vides
      html.find('input[type="number"]').on('change', ev => {
        const input = ev.currentTarget;
        if (input.value === "") input.value = 0;
      });

      // Bloquer la soumission pour les utilisateurs non autorisés
      html.find('form').on('submit', ev => {
        if (!this.canEdit) {
          ev.preventDefault();
          ui.notifications?.warn("Vous n'êtes pas autorisé à modifier cette fiche.");
          return false;
        }
      });
    }

    /**
     * Soumet le formulaire et met à jour l'acteur. La validation/clamping n'est appliquée que
     * si l'utilisateur a le droit d'éditer (MJ).
     */
    async _updateObject(event, formData) {
      if (!this.canEdit) {
        // Sécurité côté client : ne pas tenter la mise à jour
        ui.notifications?.warn("Modification interdite : seuls les MJ peuvent modifier les données du personnage.");
        return;
      }

      // Sanitize and clamp numeric fields for hp and mana
      const hpValueKey = "system.attributes.hp.value";
      const hpMaxKey = "system.attributes.hp.max";
      const manaValueKey = "system.attributes.mana.value";
      const manaMaxKey = "system.attributes.mana.max";

      // Helper to parse integers safely
      const parseSafeInt = (v, fallback) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.trunc(n) : fallback;
      };

      // Determine current actor values to use as fallback when max not provided in the form
      const actorHpMax = this.actor?.system?.attributes?.hp?.max ?? 10;
      const actorManaMax = this.actor?.system?.attributes?.mana?.max ?? 5;

      // Normalize hp.max
      if (formData[hpMaxKey] !== undefined) {
        let max = parseSafeInt(formData[hpMaxKey], actorHpMax);
        if (max < 1) max = 1; // hp max must be at least 1
        formData[hpMaxKey] = max;
      }

      // Normalize hp.value
      if (formData[hpValueKey] !== undefined) {
        const raw = parseSafeInt(formData[hpValueKey], 0);
        const max = formData[hpMaxKey] !== undefined ? formData[hpMaxKey] : actorHpMax;
        formData[hpValueKey] = Math.max(0, Math.min(raw, max));
      }

      // Normalize mana.max
      if (formData[manaMaxKey] !== undefined) {
        let max = parseSafeInt(formData[manaMaxKey], actorManaMax);
        if (max < 0) max = 0;
        formData[manaMaxKey] = max;
      }

      // Normalize mana.value
      if (formData[manaValueKey] !== undefined) {
        const raw = parseSafeInt(formData[manaValueKey], 0);
        const max = formData[manaMaxKey] !== undefined ? formData[manaMaxKey] : actorManaMax;
        formData[manaValueKey] = Math.max(0, Math.min(raw, max));
      }

      // Enfin, mettre à jour l'acteur avec le formData assainie
      await this.object.update(formData);
    }
  }

  // Désenregistrer la fiche core si présente pour éviter conflits, puis enregistrer la fiche du système
  try {
    Actors.unregisterSheet("core", ActorSheet);
  } catch (err) {
    // Certaines versions de Foundry peuvent lancer si l'enregistrement n'existe pas — ignorer
  }
  Actors.registerSheet(SYSTEM_ID, PlayerActorSheet, { makeDefault: true });

  // Initialiser automatiquement les attributs de base lors de la création d'un nouvel acteur
  Hooks.on("preCreateActor", (actor, createData, options, userId) => {
    // S'assurer que la structure system.attributes existe
    createData.system = createData.system || {};
    createData.system.attributes = createData.system.attributes || {};
    const attrs = createData.system.attributes;

    // Valeurs par défaut
    if (!attrs.hp) {
      attrs.hp = { value: 10, max: 10 };
    } else {
      attrs.hp.value = (attrs.hp.value !== undefined) ? Number(attrs.hp.value) : 10;
      attrs.hp.max = (attrs.hp.max !== undefined) ? Math.max(1, Number(attrs.hp.max)) : 10;
    }

    if (!attrs.mana) {
      attrs.mana = { value: 5, max: 5 };
    } else {
      attrs.mana.value = (attrs.mana.value !== undefined) ? Number(attrs.mana.value) : 5;
      attrs.mana.max = (attrs.mana.max !== undefined) ? Math.max(0, Number(attrs.mana.max)) : 5;
    }
  });

  // Bloquer côté serveur / hooks pré-update : empêcher les utilisateurs non-GM de modifier les champs système / nom
  Hooks.on("preUpdateActor", (actor, update, options, userId) => {
    try {
      const user = typeof game !== "undefined" ? game.users.get(userId) : null;
      if (user && user.isGM) return; // autorisé pour MJ

      // Autoriser uniquement les mises à jour touches 'token' (par exemple) pour les non-MJ
      const keys = Object.keys(update || {});
      const disallowed = ["system", "name"];
      if (keys.some(k => disallowed.includes(k))) {
        ui.notifications?.warn("Modification interdite : seuls les MJ peuvent modifier les données du personnage.");
        return false; // empêche la mise à jour
      }
    } catch (err) {
      // En cas d'erreur, on ne bloque pas la mise à jour pour éviter d'empêcher des opérations légitimes
      return;
    }
  });

});
