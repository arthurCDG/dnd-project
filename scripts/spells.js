export const spells = {
  dismiss_undeads: {
    name: "Dismiss Undeads",
    cost: 1,
    type: "support",
    actionDice: ["dismissUndeadsDie"],
  },
  first_aid: {
    name: "First Aid",
    cost: 2,
    type: "heal",
    actionDice: ["orangeDie", "orangeDie"],
  },
  sneaky_attack: {
    name: "Sneaky Attack",
    cost: 1,
    type: "attack",
    actionDice: ["purpleDie"],
  },
  look_for_traps: {
    name: "Look for traps",
    cost: 0,
    type: "support",
    actionDice: ["discoverTrapsDie"],
  },
  dismiss_traps: {
    name: "Dismiss traps",
    cost: 0,
    type: "support",
    actionDice: ["dismissTrapsDie"],
  },
  ultimate_restoration_spell: {
    name: "Ultimate restoration spell",
    cost: 3,
    type: "heal",
    actionDice: ["redDie", "purpleDie"],
  },
  yondalla_necklace: {
    name: "Yondalla Necklace",
    cost: 4,
    type: "support",
    actionDice: ["purpleDie", "purpleDie"],
  },
  magic_projectile: {
    name: "Magic projectile",
    cost: 2,
    type: "attack",
    actionDice: ["orangeDie", "orangeDie"],
  },
};
