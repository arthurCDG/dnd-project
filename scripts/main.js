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

const playDungeonMasterTurn = () => {
  // Trigger the  function that moves monsters if within range
  moveMonsters();
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
  // Remove the target
  if (document.querySelector(".is-selected")) {
    let selected = document.querySelector(".is-selected");
    selected.classList.remove("is-selected");
  }
};

/* ----------------------------------------- Intervals to update players stats every second ------------------------------------- */

setInterval(() => {
  document.querySelector("#life-of-lidda").innerHTML = players.lidda.health;
  document.querySelector("#mana-of-lidda").innerHTML = players.lidda.mana;
  document.querySelector("#steps-of-lidda").innerHTML =
    players.lidda.stepsCount;
  document.querySelector("#shield-of-lidda").innerHTML = players.lidda.shield;
  document.querySelector("#inventory-of-lidda").innerHTML =
    players.lidda.inventory;

  document.querySelector("#life-of-jozian").innerHTML = players.jozian.health;
  document.querySelector("#mana-of-jozian").innerHTML = players.jozian.mana;
  document.querySelector("#steps-of-jozian").innerHTML =
    players.jozian.stepsCount;
  document.querySelector("#shield-of-jozian").innerHTML = players.jozian.shield;
  document.querySelector("#inventory-of-jozian").innerHTML =
    players.jozian.inventory;

  document.querySelector("#life-of-mialye").innerHTML = players.mialye.health;
  document.querySelector("#mana-of-mialye").innerHTML = players.mialye.mana;
  document.querySelector("#steps-of-mialye").innerHTML =
    players.mialye.stepsCount;
  document.querySelector("#shield-of-mialye").innerHTML = players.mialye.shield;
  document.querySelector("#inventory-of-mialye").innerHTML =
    players.mialye.inventory;

  document.querySelector("#life-of-regdar").innerHTML = players.regdar.health;
  document.querySelector("#mana-of-regdar").innerHTML = players.regdar.mana;
  document.querySelector("#steps-of-regdar").innerHTML =
    players.regdar.stepsCount;
  document.querySelector("#shield-of-regdar").innerHTML = players.regdar.shield;
  document.querySelector("#inventory-of-regdar").innerHTML =
    players.regdar.inventory;
}, 50);

/* ------------------------------------------------------- Event listeners ------------------------------------------------------- */

window.addEventListener("load", () => {
  let textContainer = document.querySelector("#title span");
  let text = "DUNGEONS-&-DRAGONS";

  let i = 0;
  let speed = 50;

  function typeWriter() {
    if (i < text.length) {
      if (text[i] === ".") textContainer.innerText += "";
      else textContainer.innerText += ` ${text[i]}`;
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();
});

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

document.querySelector("#btn-search").addEventListener("click", () => {
  // Mettre ici la fonction de search random sur les coffres
});

document.querySelector(".key1").addEventListener("click", () => {
  document.querySelector(".door1").classList.remove("door1");
  document.querySelector(".key1").classList.remove("key1");
});

document.querySelector(".key2").addEventListener("click", () => {
  document.querySelector(".door2").classList.remove("door1");
  document.querySelector(".key2").classList.remove("key1");
});
