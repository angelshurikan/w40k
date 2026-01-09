# Diagramme relations (mermaid)

> Correspondance Foundry VTT (v13)
>
> - `MondeNatal` est un **Item** de type `mondeNatal`.
> - `Eye` est un **Item** de type `eye` (titre uniquement).
> - `Skin` est un **Item** de type `skin` (titre uniquement).
> - `Hair` est un **Item** de type `hair` (titre uniquement).
> - `PlaneteNatal` est un **Item** de type `planeteNatal` (titre + description).
> - `DescriptionPhysique` est un **Item** de type `descriptionPhysique` (titre uniquement).
> - `Age` est un **Item** de type `age` (titre uniquement).
> - `Comportement` est un **Item** de type `comportement` (titre uniquement).
> - `ParticularitePhysique` est un **Item** de type `particularitePhysique` (titre uniquement).
> - `Carriere` est un **Item** de type `carriere` (titre uniquement).
> - `EffetAssermentation` est un **Item** de type `effetAssermentation` (titre uniquement).
>
>   - `MondeNatal.item.name` → `title`
>   - `MondeNatal.item.system.description` → `description`
>   - `MondeNatal.item.system.stats.*` → caractéristiques :
>     `weaponSkill`, `ballisticSkill`, `strength`, `toughness`, `agility`, `intelligence`,
>     `perception`, `willpower`, `fellowship`, `fate`, `insanity`, `corruption`
>   - `Eye.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Skin.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Hair.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Personnage.actor.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Personnage.actor.system.eyeUuid` → référence vers un `Eye` (UUID)
>   - `Personnage.actor.system.skinUuid` → référence vers un `Skin` (UUID)
>   - `Personnage.actor.system.hairUuid` → référence vers un `Hair` (UUID)
>   - `PlaneteNatal.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `PlaneteNatal.item.system.description` → description
>   - `DescriptionPhysique.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Age.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Comportement.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `ParticularitePhysique.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Carriere.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `EffetAssermentation.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>
>   - `Personnage.actor.system.planeteNatalUuid` → référence vers un `PlaneteNatal` (UUID)
>   - `Personnage.actor.system.descriptionPhysiqueUuid` → référence vers un `DescriptionPhysique` (UUID)
>   - `Personnage.actor.system.ageUuid` → référence vers un `Age` (UUID)
>   - `Personnage.actor.system.comportementUuid` → référence vers un `Comportement` (UUID)
>   - `Personnage.actor.system.particularitePhysiqueUuid` → référence vers un `ParticularitePhysique` (UUID)
>   - `Personnage.actor.system.carriereUuid` → référence vers un `Carriere` (UUID)
>   - `Personnage.actor.system.effetAssermentationUuid` → référence vers un `EffetAssermentation` (UUID)

```mermaid
classDiagram
    class Skin {
      int id
      string title
      string homeworldUuid
    }

    class Hair {
      int id
      string title
      string homeworldUuid
    }

    class Eye {
      int id
      string title
      string homeworldUuid
    }

    class Personnage {
      int id
      string firstName
      string lastName
      enum[H|F] gender
      int experienceMax
      int experienceCurrent
      int hpMax
      int hpCurrent
      int manaMax
      int manaCurrent
      ---
      string homeworldUuid
      string eyeUuid
      string skinUuid
      string hairUuid
    }

    class MondeNatal {
      int id
      string title
      string description
      ---
      int weaponSkill
      int ballisticSkill
      int strength
      int toughness
      int agility
      int intelligence
      int perception
      int willpower
      int fellowship
      int fate
      int insanity
      int corruption
    }

    class PlaneteNatal {
      string title
      string description
      string homeworldUuid
    }
    class DescriptionPhysique {
      string title
      string homeworldUuid
    }
    class Age {
      string title
      string homeworldUuid
    }
    class Comportement {
      string title
      string homeworldUuid
    }
    class ParticularitePhysique {
      string title
      string homeworldUuid
    }
    class Carriere {
      string title
      string homeworldUuid
    }
    class EffetAssermentation {
      string title
      string homeworldUuid
    }

    %% MondeNatal définit les valeurs de base (copiées) des caractéristiques du Personnage
    Personnage <|-- MondeNatal

    %% Eye référence un MondeNatal
    Eye --> MondeNatal

    %% Skin référence un MondeNatal
    Skin --> MondeNatal

    %% Hair référence un MondeNatal
    Hair --> MondeNatal

    %% Personnage référence un MondeNatal et un Eye (filtré par Eye.homeworldUuid)
    Personnage --> MondeNatal
    Personnage --> Eye
    Personnage --> Skin
    Personnage --> Hair

    Personnage --> PlaneteNatal
    Personnage --> DescriptionPhysique
    Personnage --> Age
    Personnage --> Comportement
    Personnage --> ParticularitePhysique
    Personnage --> Carriere
    Personnage --> EffetAssermentation

    PlaneteNatal --> MondeNatal
    DescriptionPhysique --> MondeNatal
    Age --> MondeNatal
    Comportement --> MondeNatal
    ParticularitePhysique --> MondeNatal
    Carriere --> MondeNatal
    EffetAssermentation --> MondeNatal
```
