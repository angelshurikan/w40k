# Diagramme relations (mermaid)

> Correspondance Foundry VTT (v13)
>
> - `MondeNatal` est un **Item** de type `mondeNatal`.
> - `Eye` est un **Item** de type `eye` (titre uniquement).
> - `Skin` est un **Item** de type `skin` (titre uniquement).
> - `Hair` est un **Item** de type `hair` (titre uniquement).
> - Champs (implémentation actuelle) :
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
```
