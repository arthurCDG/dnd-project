export const spells = {
  dismiss_undeads: {
    name: "Dismiss Undeads",
    cost: 1,
    actionDice: ["dismissUndeadsDie"],
  },
  first_aid: {
    name: "First Aid",
    cost: 2,
    actionDice: ["purpleDie"],
  },
  sneaky_attack: {
    name: "Sneaky Attack",
    cost: 1,
    actionDice: ["purpleDie"],
  },
  look_for_traps: {
    name: "Look for traps",
    cost: 0,
    actionDice: ["discoverTrapsDie"],
  },
  dismiss_traps: {
    name: "Dismiss traps",
    cost: 0,
    actionDice: ["dismissTrapsDie"],
  },
  ultimate_restoration_spell: {
    name: "Ultimate restoration spell",
    cost: 3,
    actionDice: ["redDie", "purpleDie"],
  },
  yondalla_necklace: {
    name: "Yondalla Necklace",
    cost: 4,
    actionDice: ["purpleDie", "purpleDie"],
  },
  magic_projectile: {
    name: "Magic projectile",
    cost: 2,
    actionDice: ["orangeDie", "orangeDie"],
  },
};

// --> Ensuite j'utiliserai le fonctionnement d'indexation d'objet/array indirect pour aller chercher l'effet et le coût du sort utilisé par le joueur
// let activatedSkillByThePlayer = 'dismiss_undeads'
// skills[activatedSkillByThePlayer].effect
