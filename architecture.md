# Diagramme relations (mermaid)

> Correspondance Foundry VTT (v13)
>
> - `MondeNatal` est un **Item** de type `mondeNatal`.
> - Champs (implémentation actuelle) :
>   - `item.name` → `title`
>   - `item.details.description` → `description`
>   - `item.system.stats.*` → caractéristiques :
>     `weaponSkill`, `ballisticSkill`, `strength`, `toughness`, `agility`, `intelligence`,
>     `perception`, `willpower`, `fellowship`, `fate`, `insanity`, `corruption`
>
```mermaid
classDiagram
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
````
