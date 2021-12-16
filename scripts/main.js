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
  moveMonsters,
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

/* ------------------------------------- Check if an hero is dead and remove the hero if dead --------------------------------------- */

// Regarder si un héro est mort. Si oui, retourne l'élément HTML correspondant au héro mort.
const isThereADeadHero = () => {
  return document.querySelector(".to-delete")
    ? document.querySelector(".to-delete")
    : false;
};

// // If true (il y a un héros mort)
const removeDeadHero = (deadHeroHTMLElement) => {
  if (deadHeroHTMLElement === false) console.log("Nobody died!");
  else {
    deadHeroHTMLElement.id = "";
    deadHeroHTMLElement.classList.remove("is-selected");
    deadHeroHTMLElement.classList.remove("hero");
    deadHeroHTMLElement.classList.remove("to-delete");
    deadHeroHTMLElement.classList.add("dead-body");
  }
};

/* ------------------------------------------------------ Turned-based system ------------------------------------------------------ */

const resetAllMonstersAttackCount = () => {
  monsters.goblin.attackActionCount === 1;
  monsters.gnoll.attackActionCount === 1;
  monsters.ogre.attackActionCount === 1;
  monsters.troll.attackActionCount === 1;
  monsters.skeleton.attackActionCount === 1;
  monsters.specter.attackActionCount === 1;
  monsters.lichKing.attackActionCount === 1;
};

const playDungeonMasterTurn = () => {
  // Reset all monsters' attack counts
  resetAllMonstersAttackCount();
  // Trigger the function to have monsters attack players a first time
  monsterAttack();
  // Trigger the function to see if some heroes are dead
  removeDeadHero(isThereADeadHero());
  // Trigger the  function that moves monsters if within range
  moveMonsters();
  // Reset all monsters' attack counts one more time (for those who will attack on the second trys)
  resetAllMonstersAttackCount();
  // Trigger the function to have monsters attack players a second time (for those who havent't already attacked)
  monsterAttack();
  // Trigger the function to see if some heroes are dead
  removeDeadHero(isThereADeadHero());
};

const chooseNextPlayer = () => {
  let currentPlayer = document.querySelector(".current-player");

  if (currentPlayer.id === "lidda") {
    // Set Jozian as the next player after Lidda if alive
    if (document.querySelector("#jozian")) {
      currentPlayer.classList.remove("current-player");
      const jozian = document.querySelector("#jozian");
      jozian.classList.add("current-player");
      // Else set Mialye if alive
    } else if (document.querySelector("#mialye")) {
      currentPlayer.classList.remove("current-player");
      const mialye = document.querySelector("#mialye");
      mialye.classList.add("current-player");
      // Else set Regdar if alive
    } else if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
      // Set dungeonMaster as the next player after Regdar
    } else if (document.querySelector("#dungeonMaster")) {
      currentPlayer.classList.remove("current-player");
      const dungeonMaster = document.querySelector("#dungeonMaster");
      dungeonMaster.classList.add("current-player");
      // Jouer le tour du maître du donjon
      playDungeonMasterTurn();
      // Else it means that the DUNGEON MASTER WON
    } else {
      throw alert("THE DUNGEON MASTER WON!");
    }
    // Reset the step counter of Lidda
    players.lidda.stepsCount = players.lidda.maxSteps;
  } else if (currentPlayer.id === "jozian") {
    // Set Mialyë as the next player after Jozian if alive
    if (document.querySelector("#mialye")) {
      currentPlayer.classList.remove("current-player");
      const mialye = document.querySelector("#mialye");
      mialye.classList.add("current-player");
      // Else set Regdar if alive
    } else if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
      // Set dungeonMaster as the next player after Regdar
    } else if (document.querySelector("#dungeonMaster")) {
      currentPlayer.classList.remove("current-player");
      const dungeonMaster = document.querySelector("#dungeonMaster");
      dungeonMaster.classList.add("current-player");
      // Jouer le tour du maître du donjon
      playDungeonMasterTurn();
      // Else set Lidda if alive
    } else if (document.querySelector("#lidda")) {
      currentPlayer.classList.remove("current-player");
      const lidda = document.querySelector("#lidda");
      lidda.classList.add("current-player");
      // Else it means that the DUNGEON MASTER WON
    } else {
      throw alert("THE DUNGEON MASTER WON!");
    }
    // Reset the step counter of Jozian
    players.jozian.stepsCount = players.jozian.maxSteps;
  } else if (currentPlayer.id === "mialye") {
    // Set Regdar as the next player after Mialyë
    if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
    } else if (document.querySelector("#dungeonMaster")) {
      // Set dungeonMaster as the next player after Regdar
      currentPlayer.classList.remove("current-player");
      const dungeonMaster = document.querySelector("#dungeonMaster");
      dungeonMaster.classList.add("current-player");
      // Jouer le tour du maître du donjon
      playDungeonMasterTurn();
      // Jouer le tour du maître du donjon
      playDungeonMasterTurn();
      // Else set Lidda if alive
    } else if (document.querySelector("#lidda")) {
      currentPlayer.classList.remove("current-player");
      const lidda = document.querySelector("#lidda");
      lidda.classList.add("current-player");
      // Else set Jozian if alive
    } else if (document.querySelector("#jozian")) {
      currentPlayer.classList.remove("current-player");
      const jozian = document.querySelector("#jozian");
      jozian.classList.add("current-player");
      // Else it means that the DUNGEON MASTER WON
    } else {
      throw alert("THE DUNGEON MASTER WON!");
    }
    // Reset the step counter of Mialyë
    players.mialye.stepsCount = players.mialye.maxSteps;
  } else if (currentPlayer.id === "regdar") {
    // Set dungeonMaster as the next player after Regdar
    currentPlayer.classList.remove("current-player");
    const dungeonMaster = document.querySelector("#dungeonMaster");
    dungeonMaster.classList.add("current-player");
    // Jouer le tour du maître du donjon
    playDungeonMasterTurn();
    // Reset the step counter of Regdar
    players.regdar.stepsCount = players.regdar.maxSteps;
  } else if (currentPlayer.id === "dungeonMaster") {
    // Set Lidda as the next player after dungeonMaster if alive
    if (document.querySelector("#lidda")) {
      currentPlayer.classList.remove("current-player");
      const lidda = document.querySelector("#lidda");
      lidda.classList.add("current-player");
      // Else set Jozian if alive
    } else if (document.querySelector("#jozian")) {
      currentPlayer.classList.remove("current-player");
      const jozian = document.querySelector("#jozian");
      jozian.classList.add("current-player");
      // Else set Mialye if alive
    } else if (document.querySelector("#mialye")) {
      currentPlayer.classList.remove("current-player");
      const mialye = document.querySelector("#mialye");
      mialye.classList.add("current-player");
      // Else set Regdar if alive
    } else if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
      // Else it means that the DUNGEON MASTER WON
    } else {
      throw alert("THE DUNGEON MASTER WON!");
    }
  }
};

/* ----------------------------------------- Intervals to update players stats every second ------------------------------------- */

setInterval(() => {
  console.log(`Vie de Lidda: ${players.lidda.health}`);
  console.log(`Statut Lidda: ${players.lidda.isAlive}`);
  // console.log(`Vie de Jozian: ${players.jozian.health}`);
  // console.log(`Statut Jozian: ${players.jozian.isAlive}`);
  // console.log(`Vie de Mialyë: ${players.mialye.health}`);
  // console.log(`Vie de Regdar: ${players.regdar.health}`);
  console.log(`attackActionCount Goblin: ${monsters.goblin.attackActionCount}`);
  console.log(`attackActionCount Gnoll: ${monsters.gnoll.attackActionCount}`);
}, 2000);

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
    selectedPosition.classList.remove("monster");
    selectedPosition.classList.add("dead-body");
  }
});
