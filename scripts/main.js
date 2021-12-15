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
import {
  totalDistanceWithTarget,
  totalDistanceWithSelected,
} from "./motion.js";
import {
  weaponAttack,
  spellAttack,
  receiveDamage,
  healPlayer,
  monsterAttack,
} from "./interract.js";

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
    currentPlayer.classList.remove("current-player");
    const jozian = document.querySelector("#jozian");
    jozian.classList.add("current-player");
    // Reset the step counter of Lidda
    players.lidda.stepsCount = players.lidda.maxSteps;
  } else if (currentPlayer.id === "jozian") {
    // Set Mialyë as the next player after Jozian
    currentPlayer.classList.remove("current-player");
    const mialye = document.querySelector("#mialye");
    mialye.classList.add("current-player");
    // Reset the step counter of Jozian
    players.jozian.stepsCount = players.jozian.maxSteps;
  } else if (currentPlayer.id === "mialye") {
    // Set Regdar as the next player after Mialyë
    currentPlayer.classList.remove("current-player");
    const regdar = document.querySelector("#regdar");
    regdar.classList.add("current-player");
    // Reset the step counter of Mialyë
    players.mialye.stepsCount = players.mialye.maxSteps;
  } else if (currentPlayer.id === "regdar") {
    // Set dungeonMaster as the next player after Regdar
    currentPlayer.classList.remove("current-player");
    const dungeonMaster = document.querySelector("#dungeonMaster");
    dungeonMaster.classList.add("current-player");
    // Trigger the function to have monsters move and attack
    monsterAttack();
    // Reset the step counter of Regdar
    players.regdar.stepsCount = players.regdar.maxSteps;
  } else if (currentPlayer.id === "dungeonMaster") {
    // Set Lidda as the next player after dungeonMaster
    currentPlayer.classList.remove("current-player");
    const lidda = document.querySelector("#lidda");
    lidda.classList.add("current-player");
  }
  // // Remove the previous player from the current-player class
  // currentPlayer.classList.remove("current-player");
};

/* ----------------------------------------- Intervals to update players stats every second ------------------------------------- */

// setInterval(() => {
//   console.log(`Vie de Lidda: ${players.lidda.health}`);
//   console.log(`Vie de Jozian: ${players.jozian.health}`);
//   console.log(`Vie de Mialyë: ${players.mialye.health}`);
//   console.log(`Vie de Regdar: ${players.regdar.health}`);
//   console.log(`Vie de Goblin: ${monsters.goblin.health}`);
// }, 5000);

/* ------------------------------------------------------- Event listeners ------------------------------------------------------- */

document
  .querySelector("#btn-end-of-turn")
  .addEventListener("click", chooseNextPlayer);

document.querySelector("#btn-attack").addEventListener("click", () => {
  let currentPlayerPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPlayerPosition.id];
  let selectedPosition = document.querySelector(".is-selected");
  let selectedPositionObject = monsters[selectedPosition.id];

  if (totalDistanceWithSelected() === 1)
    receiveDamage(selectedPositionObject, weaponAttack(currentPlayerObject));
  if (selectedPositionObject.health <= 0) {
    selectedPosition.id = "";
    selectedPosition.classList.remove("is-selected");
    selectedPosition.classList.remove("is-filled");
    selectedPosition.classList.add("dead-body");
  }
});
