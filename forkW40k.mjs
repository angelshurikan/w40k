/* eslint-disable no-unused-vars */
/**
 * Références de types pour l'IDE (Foundry VTT v13)
 * Nécessite le devDependency: @league-of-foundry-developers/foundry-vtt-types
 */
/// <reference types="@league-of-foundry-developers/foundry-vtt-types" />

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

// Constantes partagées (évite recréations à chaque submit)
const MONDE_NATAL_STAT_DEFAULTS = Object.freeze({
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
});

const MONDE_NATAL_NUM_KEYS = Object.freeze([
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
]);

// Point d'extension: initialisation du système. Compléter selon les besoins.
Hooks.once("init", () => {
  console.log(`${SYSTEM_ID} v${SYSTEM_VERSION} initialisation (compatibilité Foundry >= ${COMPAT_MINIMUM})`);

  // Helpers internes (factorisation World + Compendiums)
  const dedupeByUuid = (arr) => {
    const seen = new Set();
    return (arr || []).filter(e => {
      if (!e?.uuid) return false;
      if (seen.has(e.uuid)) return false;
      seen.add(e.uuid);
      return true;
    });
  };

  const collectItemsOfType = async (type, { includeHomeworld = false, preferCompendium = false } = {}) => {
    const out = [];

    // World (optionnel)
    if (!preferCompendium) {
      try {
        if (typeof game !== "undefined" && game.items) {
          for (const it of game.items) {
            if (it?.type === type) {
              out.push({
                uuid: it.uuid,
                name: it.name,
                source: "World",
                ...(includeHomeworld ? { homeworldUuid: it.system?.homeworldUuid ?? "" } : {})
              });
            }
          }
        }
      } catch (_) {}
    }

    // Compendiums (index)
    try {
      if (typeof game !== "undefined" && game.packs) {
        const fields = includeHomeworld ? ["type", "name", "system.homeworldUuid"] : ["type", "name"];
        for (const pack of game.packs) {
          if (pack?.documentName !== "Item") continue;
          const index = await pack.getIndex({ fields });
          for (const entry of index) {
            if (entry.type === type) {
              out.push({
                uuid: `Compendium.${pack.collection}.${entry._id}`,
                name: entry.name,
                source: pack.metadata?.label ?? pack.collection,
                ...(includeHomeworld ? { homeworldUuid: entry.system?.homeworldUuid ?? "" } : {})
              });
            }
          }
        }
      }
    } catch (_) {}

    return dedupeByUuid(out);
  };

  const buildHomeworldChoices = (homeworlds, selectedUuid) => {
    const list = dedupeByUuid(homeworlds);
    return list.map(m => ({
      ...m,
      selectedAttr: (selectedUuid && m.uuid === selectedUuid) ? "selected" : ""
    }));
  };

  const buildSelectedChoices = (items, selectedUuid) => {
    const list = dedupeByUuid(items);
    return list.map(e => ({
      ...e,
      selected: !!(selectedUuid && e.uuid === selectedUuid)
    }));
  };

  /**
   * MondeNatalItemSheet
   * - Feuille d'Item dédiée au type `mondeNatal`
   * - Édite la description (system.description) + les caractéristiques par défaut (system.stats.*)
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

      context.system = this.item.system || {};
      context.system.description = context.system.description ?? "";
      context.system.stats = context.system.stats ?? {};

      const s = context.system.stats;
      for (const [k, v] of Object.entries(MONDE_NATAL_STAT_DEFAULTS)) {
        if (s[k] === undefined || s[k] === null || s[k] === "") s[k] = v;
      }

      return context;
    }

    async _updateObject(event, formData) {
      const toInt = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.trunc(n) : fallback;
      };

      for (const k of MONDE_NATAL_NUM_KEYS) {
        if (formData[k] !== undefined) formData[k] = toInt(formData[k], 0);
      }

      if (formData["system.description"] !== undefined && formData["system.description"] !== null) {
        formData["system.description"] = String(formData["system.description"]);
      }

      await this.object.update(formData);
    }
  }

  Items.registerSheet(SYSTEM_ID, MondeNatalItemSheet, {
    types: ["mondeNatal"],
    makeDefault: true
  });

  const createHomeworldLinkedItemSheetClass = (type, templatePath, { withDescription = false } = {}) => {
    return class HomeworldLinkedItemSheet extends ItemSheet {
      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["forkW40k", "sheet", "item", type],
          template: templatePath,
          width: withDescription ? 560 : 520,
          height: withDescription ? 520 : 260,
          resizable: true
        });
      }

      async getData(options) {
        const context = await super.getData(options);
        context.system = this.item.system || {};
        context.system.homeworldUuid = context.system.homeworldUuid ?? "";
        if (withDescription) context.system.description = context.system.description ?? "";

        // Compendium only (préférence)
        const homeworlds = await collectItemsOfType("mondeNatal", { preferCompendium: true });
        context.homeworldChoices = buildHomeworldChoices(homeworlds, context.system.homeworldUuid);

        return context;
      }

      async _updateObject(event, formData) {
        if (formData["system.homeworldUuid"] !== undefined && formData["system.homeworldUuid"] !== null) {
          formData["system.homeworldUuid"] = String(formData["system.homeworldUuid"]).trim();
        }
        if (withDescription && formData["system.description"] !== undefined && formData["system.description"] !== null) {
          formData["system.description"] = String(formData["system.description"]);
        }
        await this.object.update(formData);
      }
    };
  };

  // Nouveaux types (compendium-only dans les listes)
  const PlaneteNatalItemSheet = createHomeworldLinkedItemSheetClass(
    "planeteNatal",
    `systems/${SYSTEM_ID}/templates/item/planete-natal-sheet.html`,
    { withDescription: true }
  );
  Items.registerSheet(SYSTEM_ID, PlaneteNatalItemSheet, { types: ["planeteNatal"], makeDefault: true });

  const DescriptionPhysiqueItemSheet = createHomeworldLinkedItemSheetClass(
    "descriptionPhysique",
    `systems/${SYSTEM_ID}/templates/item/description-physique-sheet.html`
  );
  Items.registerSheet(SYSTEM_ID, DescriptionPhysiqueItemSheet, { types: ["descriptionPhysique"], makeDefault: true });

  const AgeItemSheet = createHomeworldLinkedItemSheetClass(
    "age",
    `systems/${SYSTEM_ID}/templates/item/age-sheet.html`
  );
  Items.registerSheet(SYSTEM_ID, AgeItemSheet, { types: ["age"], makeDefault: true });

  const ComportementItemSheet = createHomeworldLinkedItemSheetClass(
    "comportement",
    `systems/${SYSTEM_ID}/templates/item/comportement-sheet.html`
  );
  Items.registerSheet(SYSTEM_ID, ComportementItemSheet, { types: ["comportement"], makeDefault: true });

  const ParticularitePhysiqueItemSheet = createHomeworldLinkedItemSheetClass(
    "particularitePhysique",
    `systems/${SYSTEM_ID}/templates/item/particularite-physique-sheet.html`
  );
  Items.registerSheet(SYSTEM_ID, ParticularitePhysiqueItemSheet, { types: ["particularitePhysique"], makeDefault: true });

  const CarriereItemSheet = createHomeworldLinkedItemSheetClass(
    "carriere",
    `systems/${SYSTEM_ID}/templates/item/carriere-sheet.html`
  );
  Items.registerSheet(SYSTEM_ID, CarriereItemSheet, { types: ["carriere"], makeDefault: true });

  const EffetAssermentationItemSheet = createHomeworldLinkedItemSheetClass(
    "effetAssermentation",
    `systems/${SYSTEM_ID}/templates/item/effet-assermentation-sheet.html`
  );
  Items.registerSheet(SYSTEM_ID, EffetAssermentationItemSheet, { types: ["effetAssermentation"], makeDefault: true });

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
        width: 520,
        height: 520,
        resizable: true
      });
    }

    async getData(options) {
      const context = await super.getData(options);

      context.system = this.actor.system || {};
      context.system.attributes = context.system.attributes || {};
      context.system.attributes.hp = context.system.attributes.hp || { value: 10, max: 10 };
      context.system.attributes.mana = context.system.attributes.mana || { value: 5, max: 5 };

      // Liens Personnage -> Monde natal / Apparence
      context.system.homeworldUuid = context.system.homeworldUuid ?? "";
      context.system.eyeUuid = context.system.eyeUuid ?? "";
      context.system.skinUuid = context.system.skinUuid ?? "";
      context.system.hairUuid = context.system.hairUuid ?? "";

      context.canEdit = !!(typeof game !== "undefined" && game.user && game.user.isGM);
      this.canEdit = context.canEdit;
      context.canEditAttr = context.canEdit ? "" : "disabled";

      const selectedHW = context.system.homeworldUuid;
      const selectedEye = context.system.eyeUuid;
      const selectedSkin = context.system.skinUuid;
      const selectedHair = context.system.hairUuid;

      const homeworlds = await collectItemsOfType("mondeNatal", { preferCompendium: true });
      context.homeworldChoices = buildSelectedChoices(homeworlds, selectedHW);
      context.selectedHomeworldName = (homeworlds.find(m => m.uuid === selectedHW)?.name) ?? "";

      const eyes = await collectItemsOfType("eye", { includeHomeworld: true, preferCompendium: true });
      const skins = await collectItemsOfType("skin", { includeHomeworld: true, preferCompendium: true });
      const hairs = await collectItemsOfType("hair", { includeHomeworld: true, preferCompendium: true });

      const filterBySelectedHomeworld = (arr) => selectedHW ? arr.filter(x => x.homeworldUuid === selectedHW) : [];

      const filteredEyes = filterBySelectedHomeworld(eyes);
      const filteredSkins = filterBySelectedHomeworld(skins);
      const filteredHairs = filterBySelectedHomeworld(hairs);

      const eyeChoices = buildSelectedChoices(filteredEyes, selectedEye);
      const skinChoices = buildSelectedChoices(filteredSkins, selectedSkin);
      const hairChoices = buildSelectedChoices(filteredHairs, selectedHair);

      context.eyeChoices = eyeChoices;
      context.skinChoices = skinChoices;
      context.hairChoices = hairChoices;

      context.selectedEyeName = (filteredEyes.find(e => e.uuid === selectedEye)?.name) ?? "";
      context.selectedSkinName = (filteredSkins.find(s => s.uuid === selectedSkin)?.name) ?? "";
      context.selectedHairName = (filteredHairs.find(h => h.uuid === selectedHair)?.name) ?? "";

      // --- Nouveaux types (compendium-only dans les listes) ---
      // Assurer les champs Actor AVANT usage (une seule fois)
      context.system.planeteNatalUuid = context.system.planeteNatalUuid ?? "";
      context.system.descriptionPhysiqueUuid = context.system.descriptionPhysiqueUuid ?? "";
      context.system.ageUuid = context.system.ageUuid ?? "";
      context.system.comportementUuid = context.system.comportementUuid ?? "";
      context.system.particularitePhysiqueUuid = context.system.particularitePhysiqueUuid ?? "";
      context.system.carriereUuid = context.system.carriereUuid ?? "";
      context.system.effetAssermentationUuid = context.system.effetAssermentationUuid ?? "";

      const planeteNatals = await collectItemsOfType("planeteNatal", { includeHomeworld: true, preferCompendium: true });
      const descriptionPhysiques = await collectItemsOfType("descriptionPhysique", { includeHomeworld: true, preferCompendium: true });
      const ages = await collectItemsOfType("age", { includeHomeworld: true, preferCompendium: true });
      const comportements = await collectItemsOfType("comportement", { includeHomeworld: true, preferCompendium: true });
      const particularites = await collectItemsOfType("particularitePhysique", { includeHomeworld: true, preferCompendium: true });
      const carrieres = await collectItemsOfType("carriere", { includeHomeworld: true, preferCompendium: true });
      const effetsAssermentation = await collectItemsOfType("effetAssermentation", { includeHomeworld: true, preferCompendium: true });

      // Réutiliser le filterByHomeworld déjà défini plus haut
      const filteredPlaneteNatals = filterBySelectedHomeworld(planeteNatals);
      const filteredDescriptionPhysiques = filterBySelectedHomeworld(descriptionPhysiques);
      const filteredAges = filterBySelectedHomeworld(ages);
      const filteredComportements = filterBySelectedHomeworld(comportements);
      const filteredParticularites = filterBySelectedHomeworld(particularites);
      const filteredCarrieres = filterBySelectedHomeworld(carrieres);
      const filteredEffetsAssermentation = filterBySelectedHomeworld(effetsAssermentation);


      context.planeteNatalChoices = buildSelectedChoices(filteredPlaneteNatals, context.system.planeteNatalUuid);
      context.descriptionPhysiqueChoices = buildSelectedChoices(filteredDescriptionPhysiques, context.system.descriptionPhysiqueUuid);
      context.ageChoices = buildSelectedChoices(filteredAges, context.system.ageUuid);
      context.comportementChoices = buildSelectedChoices(filteredComportements, context.system.comportementUuid);
      context.particularitePhysiqueChoices = buildSelectedChoices(filteredParticularites, context.system.particularitePhysiqueUuid);
      context.carriereChoices = buildSelectedChoices(filteredCarrieres, context.system.carriereUuid);
      context.effetAssermentationChoices = buildSelectedChoices(filteredEffetsAssermentation, context.system.effetAssermentationUuid);

      context.selectedPlaneteNatalName = (filteredPlaneteNatals.find(x => x.uuid === context.system.planeteNatalUuid)?.name) ?? "";
      context.selectedDescriptionPhysiqueName = (filteredDescriptionPhysiques.find(x => x.uuid === context.system.descriptionPhysiqueUuid)?.name) ?? "";
      context.selectedAgeName = (filteredAges.find(x => x.uuid === context.system.ageUuid)?.name) ?? "";
      context.selectedComportementName = (filteredComportements.find(x => x.uuid === context.system.comportementUuid)?.name) ?? "";
      context.selectedParticularitePhysiqueName = (filteredParticularites.find(x => x.uuid === context.system.particularitePhysiqueUuid)?.name) ?? "";
      context.selectedCarriereName = (filteredCarrieres.find(x => x.uuid === context.system.carriereUuid)?.name) ?? "";
      context.selectedEffetAssermentationName = (filteredEffetsAssermentation.find(x => x.uuid === context.system.effetAssermentationUuid)?.name) ?? "";

      return context;
    }

    async _updateObject(event, formData) {
      if (!this.canEdit) {
        ui.notifications?.warn("Modification interdite : seuls les MJ peuvent modifier les données du personnage.");
        return;
      }

      // --- Clamp HP/Mana ---
      const hpValueKey = "system.attributes.hp.value";
      const hpMaxKey = "system.attributes.hp.max";
      const manaValueKey = "system.attributes.mana.value";
      const manaMaxKey = "system.attributes.mana.max";

      const parseSafeInt = (v, fallback) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.trunc(n) : fallback;
      };

      const actorHpMax = this.actor?.system?.attributes?.hp?.max ?? 10;
      const actorManaMax = this.actor?.system?.attributes?.mana?.max ?? 5;

      if (formData[hpMaxKey] !== undefined) {
        let max = parseSafeInt(formData[hpMaxKey], actorHpMax);
        if (max < 1) max = 1;
        formData[hpMaxKey] = max;
      }

      if (formData[hpValueKey] !== undefined) {
        const raw = parseSafeInt(formData[hpValueKey], 0);
        const max = formData[hpMaxKey] !== undefined ? formData[hpMaxKey] : actorHpMax;
        formData[hpValueKey] = Math.max(0, Math.min(raw, max));
      }

      if (formData[manaMaxKey] !== undefined) {
        let max = parseSafeInt(formData[manaMaxKey], actorManaMax);
        if (max < 0) max = 0;
        formData[manaMaxKey] = max;
      }

      if (formData[manaValueKey] !== undefined) {
        const raw = parseSafeInt(formData[manaValueKey], 0);
        const max = formData[manaMaxKey] !== undefined ? formData[manaMaxKey] : actorManaMax;
        formData[manaValueKey] = Math.max(0, Math.min(raw, max));
      }

      // --- Normalisation & logique Monde natal / Eye ---
      const prevHomeworld = this.actor?.system?.homeworldUuid ?? "";

      const newHomeworld = (formData["system.homeworldUuid"] !== undefined && formData["system.homeworldUuid"] !== null)
        ? String(formData["system.homeworldUuid"]).trim()
        : undefined;

      if (newHomeworld !== undefined) {
        formData["system.homeworldUuid"] = newHomeworld;

        // Reset automatique de l'Eye si le monde natal change
        if (newHomeworld !== prevHomeworld) {
          formData["system.eyeUuid"] = "";
          formData["system.skinUuid"] = "";
          formData["system.hairUuid"] = "";
          formData["system.planeteNatalUuid"] = "";
          formData["system.descriptionPhysiqueUuid"] = "";
          formData["system.ageUuid"] = "";
          formData["system.comportementUuid"] = "";
          formData["system.particularitePhysiqueUuid"] = "";
          formData["system.carriereUuid"] = "";
          formData["system.effetAssermentationUuid"] = "";
        }
      }

      if (formData["system.eyeUuid"] !== undefined && formData["system.eyeUuid"] !== null) {
        formData["system.eyeUuid"] = String(formData["system.eyeUuid"]).trim();
      }
      if (formData["system.skinUuid"] !== undefined && formData["system.skinUuid"] !== null) {
        formData["system.skinUuid"] = String(formData["system.skinUuid"]).trim();
      }
      if (formData["system.hairUuid"] !== undefined && formData["system.hairUuid"] !== null) {
        formData["system.hairUuid"] = String(formData["system.hairUuid"]).trim();
      }

      // trim des nouveaux champs
      const trimKeys = [
        "system.planeteNatalUuid",
        "system.descriptionPhysiqueUuid",
        "system.ageUuid",
        "system.comportementUuid",
        "system.particularitePhysiqueUuid",
        "system.carriereUuid",
        "system.effetAssermentationUuid"
      ];
      for (const k of trimKeys) {
        if (formData[k] !== undefined && formData[k] !== null) formData[k] = String(formData[k]).trim();
      }

      await this.object.update(formData);
    }
  }

  // Désenregistrer la fiche core si présente, puis enregistrer la fiche du système
  try {
    Actors.unregisterSheet("core", ActorSheet);
  } catch (err) {
    // ignorer
  }
  Actors.registerSheet(SYSTEM_ID, PlayerActorSheet, { makeDefault: true });
});

// Initialiser les nouveaux acteurs avec des valeurs par défaut pour les champs système
Hooks.on("preCreateActor", (actor, createData, options, userId) => {
  // S'assurer que la structure system.attributes existe
  createData.system = createData.system || {};
  createData.system.attributes = createData.system.attributes || {};

  // Initialiser les liens personnage -> Monde natal / Apparence
  if (createData.system.homeworldUuid === undefined) createData.system.homeworldUuid = "";
  if (createData.system.eyeUuid === undefined) createData.system.eyeUuid = "";
  if (createData.system.skinUuid === undefined) createData.system.skinUuid = "";
  if (createData.system.hairUuid === undefined) createData.system.hairUuid = "";

  if (createData.system.planeteNatalUuid === undefined) createData.system.planeteNatalUuid = "";
  if (createData.system.descriptionPhysiqueUuid === undefined) createData.system.descriptionPhysiqueUuid = "";
  if (createData.system.ageUuid === undefined) createData.system.ageUuid = "";
  if (createData.system.comportementUuid === undefined) createData.system.comportementUuid = "";
  if (createData.system.particularitePhysiqueUuid === undefined) createData.system.particularitePhysiqueUuid = "";
  if (createData.system.carriereUuid === undefined) createData.system.carriereUuid = "";
  if (createData.system.effetAssermentationUuid === undefined) createData.system.effetAssermentationUuid = "";

  const attrs = createData.system.attributes;
  for (const k of Object.keys(attrs)) {
    if (attrs[k] === undefined || attrs[k] === null) {
      attrs[k] = 0;
    }
  }
});

