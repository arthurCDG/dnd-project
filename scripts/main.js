import { players } from "./players.js";
import { monsters } from "./monsters.js";
import { spells } from "./spells.js";
import { weapons } from "./weapons.js";
import { dice, throwDice } from "./dice.js";
import { traps } from "./traps.js";
import {
  createMap,
  placePlayersOnMap,
  placeMonstersOnMap,
  placeWallsOnMap,
  placeOtherMapElements,
} from "./grid.js";

/* ------------------------------------- Initialize gameboard, players, monsters and objects --------------------------------------- */

const initializeMap = () => {
  createMap();
  placePlayersOnMap();
  placeMonstersOnMap();
  placeWallsOnMap();
  placeOtherMapElements();
};

initializeMap();

/* ------------------------------------------------------ Turned-based system ------------------------------------------------------ */

const chooseNextPlayer = () => {
  let currentPlayer = document.querySelector(".current-player");

  if (currentPlayer.id === "lidda") {
    // Set Jozian as the next player after Lidda
    const jozian = document.querySelector("#jozian");
    jozian.classList.add("current-player");
    // Reset the step counter of Lidda
    players.lidda.stepsCount = players.lidda.maxSteps;
  } else if (currentPlayer.id === "jozian") {
    // Set Mialyë as the next player after Jozian
    const mialye = document.querySelector("#mialye");
    mialye.classList.add("current-player");
    // Reset the step counter of Jozian
    players.jozian.stepsCount = players.jozian.maxSteps;
  } else if (currentPlayer.id === "mialye") {
    // Set Regdar as the next player after Mialyë
    const regdar = document.querySelector("#regdar");
    regdar.classList.add("current-player");
    // Reset the step counter of Mialyë
    players.mialye.stepsCount = players.mialye.maxSteps;
  } else if (currentPlayer.id === "regdar") {
    /* --------------------------------------------------------- */
    // Exécution de la fonction qui fait avancer certains monstres vers un héros choisi un hasard, en fonction de leur distance (si + 6, n'avancent pas)
    /* --------------------------------------------------------- */
    // Set Lidda as the next player after Regdar
    const lidda = document.querySelector("#lidda");
    lidda.classList.add("current-player");
    // Reset the step counter of Regdar
    players.regdar.stepsCount = players.regdar.maxSteps;
  }
  // Remove the previous player from the current-player class
  currentPlayer.classList.remove("current-player");
};

/* ---------------------------------------------- Attack and receive damage functions ---------------------------------------------- */

// Function that receives an attacker as its argument and returns the sum of rolling dice corresponding to the weapon

const weaponAttack = (attacker) => {
  let totalDamageCounter = 0;

  const associatedDice = weapons[attacker.weapon].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

  return totalDamageCounter;
};

// Function that receives an attacker as its argument and returns thesum of rolling dice corresponding to the spell

const spellAttack = (caster) => {
  let totalDamageCounter = 0;

  const associatedDice = spells[caster.spell].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

  caster.mana -= spells[caster.spell].cost;

  return totalDamageCounter;
};

// Function that updates a player's or monster's health depending on the damage inflicted and the player's or monster's shield

const receiveDamage = (playerOrMonster, damage) => {
  if (damage >= playerOrMonster.health + playerOrMonster.shield) {
    throw alert(`${playerOrMonster.name} is dead`);
  } else if (damage > playerOrMonster.shield) {
    playerOrMonster.health -= damage - playerOrMonster.shield;
  }
};

// Function that updates a player's health depending on the damage inflicted by the trap or by a spell

const receiveTrapOrSpellDamage = (playerOrMonster, damage) => {
  if (damage >= playerOrMonster.health + playerOrMonster.shield) {
    throw alert(`${playerOrMonster.name} is dead`);
  } else {
    playerOrMonster.health -= damage;
  }
};

/* ------------------------------------------------------- Heal a player ------------------------------------------------------- */

const healPlayer = (caster, player) => {
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

/* ------------------------------------------------------- Speciall spells ------------------------------------------------------- */

// Il faudra préparer les fonctions d'exécution pour le sort dismiss undeads et les sorts de découverte et de désomarçage de piège

/* ------------------------------------------------------- Event listeners ------------------------------------------------------- */

const endOfTurnBtn = document.querySelector("#btn-end-of-turn");
endOfTurnBtn.addEventListener("click", chooseNextPlayer);
