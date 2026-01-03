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
     * pour faciliter l'accès dans Handlebars.
     */
    getData(options) {
      const context = super.getData(options);
      // Exposer l'objet system (structures de données du système) sous `system`
      context.system = this.actor.system || {};
      // Garantir des valeurs d'affichage par défaut sans les persister
      context.system.attributes = context.system.attributes || {};
      context.system.attributes.hp = context.system.attributes.hp || { value: 10, max: 10 };
      context.system.attributes.mana = context.system.attributes.mana || { value: 5, max: 5 };
      return context;
    }

    /**
     * Activer les listeners (ex. boutons). Ici aucun contrôle spécifique nécessaire, mais
     * la méthode est fournie pour extension future.
     */
    activateListeners(html) {
      super.activateListeners(html);
      // Exemple : empêcher les champs numériques d'être vides
      html.find('input[type="number"]').on('change', ev => {
        const input = ev.currentTarget;
        if (input.value === "") input.value = 0;
      });
    }

    /**
     * Soumet le formulaire et met à jour l'acteur.
     */
    async _updateObject(event, formData) {
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

      // Finally, update the actor with the sanitized formData
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

});
