# Diagramme relations (mermaid)

> Correspondance Foundry VTT (v13)
>
> - `MondeNatal` est un **Item** de type `mondeNatal`.
> - `Eye` est un **Item** de type `eye` (titre uniquement).
> - Champs (implémentation actuelle) :
>   - `MondeNatal.item.name` → `title`
>   - `MondeNatal.item.system.description` → `description`
>   - `MondeNatal.item.system.stats.*` → caractéristiques :
>     `weaponSkill`, `ballisticSkill`, `strength`, `toughness`, `agility`, `intelligence`,
>     `perception`, `willpower`, `fellowship`, `fate`, `insanity`, `corruption`
>   - `Eye.item.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Personnage.actor.system.homeworldUuid` → référence vers un `MondeNatal` (UUID)
>   - `Personnage.actor.system.eyeUuid` → référence vers un `Eye` (UUID)

```mermaid
classDiagram
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

    %% Personnage référence un MondeNatal et un Eye (filtré par Eye.homeworldUuid)
    Personnage --> MondeNatal
    Personnage --> Eye
```
