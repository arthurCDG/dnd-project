import { players } from "./players.js";
import { monsters } from "./monsters.js";
import { weapons } from "./weapons.js";
import { spells } from "./spells.js";
import { dice, throwDice } from "./dice.js";
import { totalDistanceWithSelected } from "./motion.js";

/* ---------------------------------------------- Attack and receive damage functions ---------------------------------------------- */

// Function that receives an attacker as its argument and returns the sum of rolling dice corresponding to the weapon

export const weaponAttack = (attacker) => {
  let totalDamageCounter = 0;
  const associatedDice = weapons[attacker.weapon].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

  return totalDamageCounter;
};

// Function that receives an attacker as its argument and returns thesum of rolling dice corresponding to the spell

export const spellAttack = (caster) => {
  let totalDamageCounter = 0;

  const associatedDice = spells[caster.spell].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

  caster.mana -= spells[caster.spell].cost;

  return totalDamageCounter;
};

// Function that updates a player's or monster's health depending on the damage inflicted and the player's or monster's shield

export const receiveDamage = (playerOrMonster, damage) => {
  if (damage >= playerOrMonster.health + playerOrMonster.shield) {
    playerOrMonster.health -= damage - playerOrMonster.shield;
    playerOrMonster.isAlive = false;
  } else if (damage > playerOrMonster.shield) {
    playerOrMonster.health -= damage - playerOrMonster.shield;
  }
};

/* --------------------------------------------------------- Heal a player ------------------------------------------------------- */

export const healPlayer = (caster, player) => {
  if (player.health <= 0)
    throw alert(
      `${player.name} is dead. You can only save him with a resurrection spell`
    );

  let totalHealCounter = 0;

  const associatedDice = spells[caster.spell].actionDice;
  associatedDice.forEach((dieElement) => {
    totalHealCounter += throwDice(dice[dieElement]);
  });

  player.health += totalHealCounter;
  caster.mana -= spells[caster.spell].cost;
};

/* ------------------------------------------------------- Monster attack ------------------------------------------------------- */

// Faire un querySelectorAll de tous les ID de monstre pour obtenir tous ceux encore vivants
export const monsterAttack = () => {
  let allLivingMonsters = document.querySelectorAll(".monster");
  let allLivingHeroes = document.querySelectorAll(".hero");

  //   Si je veux utiliser totalDistanceWithSelected, je dois faire une boucle où chaque monstre va être current-player
  allLivingMonsters.forEach((monster) => {
    // BOUCLE MONSTER
    let currentPlayer = document.querySelector(".current-player");
    currentPlayer.classList.remove("current-player");
    monster.classList.add("current-player");
    let monsterObject = monsters[document.querySelector(".current-player").id];
    // BOUCLE HERO
    allLivingHeroes.forEach((hero) => {
      hero.classList.add("is-selected");
      let heroObject = players[document.querySelector(".is-selected").id];
      // Pour chaque héro ciblé, à quelle distance du monstre est-il ?
      let distance = totalDistanceWithSelected();
      if (distance <= 1 && monsterObject.attackActionCount > 0) {
        receiveDamage(heroObject, weaponAttack(monsterObject));
        monsterObject.attackActionCount--;
      }
      //   else if (distance <= monsterObject.stepsCount) {
      //     // Activer ici une fonctione move monster qui va dire "ok, tout d'abord, est-ce que je peux attaquer et ne pas bouger ? Si oui j'attaque et basta, sinon je bouge j'attaque"
      //     // Il faut l'amener sur une case adjacente, mais bien vérifier que la case adjacente choisie n'est pas déjà occupée où n'est pas un mur, un coffre, un pillar
      //   }
      hero.classList.remove("is-selected");
    });
    monsterObject.attackActionCount++;
  });
  let currentPlayer = document.querySelector(".current-player");
  currentPlayer.classList.remove("current-player");
  document.querySelector("#dungeonMaster").classList.add("current-player");
};

/* ------------------------------------------------------- Speciall spells ------------------------------------------------------- */

// Il faudra préparer les fonctions d'exécution pour le sort dismiss undeads et les sorts de découverte et de désomarçage de piège

/* ---------------------------------------------------- Open chests (search) ----------------------------------------------------- */

// Il faudra préparer la fonction qui retourne un objet random parmi les weapons et spells dans l'inventaire de la personne (et check si inventaire capacity is full)
