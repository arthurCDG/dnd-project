export const players = {
  jozian: {
    name: "Jozian",
    maxHealth: 9,
    health: 9,
    mana: 7,
    skills: ["dismiss_undeads"],
    maxSteps: 5,
    stepsCount: 5,
    attackCount: 1,
    maxAttackCount: 1,
    shield: 2,
    weapon: "crossbow_of_faith",
    spell: "ultimate_restoration_spell",
    inventory: [],
    inventoryCapacity: 5,
    isAlive: true,
  },
  regdar: {
    name: "Regdar",
    health: 15,
    maxHealth: 15,
    mana: null,
    skills: [],
    maxSteps: 4,
    stepsCount: 4,
    attackCount: 1,
    maxAttackCount: 1,
    shield: 2,
    weapon: "large_sword",
    spell: "",
    inventory: [],
    inventoryCapacity: 4,
    isAlive: true,
  },
  lidda: {
    name: "Lidda",
    health: 9,
    maxHealth: 9,
    mana: 4,
    skills: ["sneaky_attack", "look_for_and_dismiss_traps"],
    maxSteps: 6,
    stepsCount: 6,
    attackCount: 1,
    maxAttackCount: 1,
    shield: 2,
    weapon: "balanced_throwing_dagger",
    spell: "first_aid",
    inventory: ["yondalla_necklace", "elven_mirror_shield"],
    inventoryCapacity: 4,
    isAlive: true,
  },
  mialye: {
    name: "Mialye",
    health: 9,
    maxHealth: 9,
    mana: 9,
    skills: [],
    maxSteps: 5,
    stepsCount: 5,
    attackCount: 1,
    maxAttackCount: 1,
    shield: 2,
    weapon: "ancient_short_bow",
    spell: "magic_projectile",
    inventory: [],
    inventoryCapacity: 5,
    isAlive: true,
  },
  dungeonMaster: {
    name: "Dungeon Master",
  },
};
