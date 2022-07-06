import {
  players,
  playersArray,
  playersAndDungeonMasterArray,
} from "./players.js";
import { monsters, monstersArray } from "./monsters.js";
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
  showPlayerMotionPossibilities,
  hidePlayerMotionPossibilities,
} from "./motion.js";
import {
  weaponAttack,
  spellAttack,
  receiveDamage,
  healPlayer,
  monsterAttack,
  addRandomObjectToInventory,
} from "./interract.js";
import {
  soundTurnChange,
  soundDoorOpened,
  soundChestOpened,
} from "./sounds.js";

/* ------------------------------------- Initialize gameboard, players, monsters and objects --------------------------------------- */

const initializeMap = () => {
  createMap();
  placePlayersOnMap();
  placeMonstersOnMap();
  placeWallsOnMap();
  placeOtherMapElements();
};

/* ----------------------------------------------------- Display modals/popups ----------------------------------------------------- */

export const displayModal = (text) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal");
  modal.innerText = text;
  const form = document.createElement("form");
  form.method = "dialog";
  modal.appendChild(form);
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("btn");
  closeBtn.innerText = "close";
  form.appendChild(closeBtn);
  document.querySelector("body").appendChild(modal);
  modal.showModal();
  closeBtn.addEventListener("click", () => {
    modal.close("closed modal");
  });
};

export const displayEndGameModal = (text) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal");
  modal.innerText = text;
  const form = document.createElement("form");
  form.method = "dialog";
  modal.appendChild(form);
  const startAgainBtn = document.createElement("button");
  startAgainBtn.classList.add("btn");
  startAgainBtn.innerText = "Reload";
  form.appendChild(startAgainBtn);
  document.querySelector("body").appendChild(modal);
  modal.showModal();
  startAgainBtn.addEventListener("click", () => {
    window.location.reload();
  });
};

/* ------------------------------------- Check if an hero is dead or if they won over DM --------------------------------------- */

// Regarder si un héro est mort. Si oui, retourne l'élément HTML correspondant au héro mort.
const areThereDeadHeros = () => {
  return document.querySelectorAll(".to-delete")
    ? document.querySelectorAll(".to-delete")
    : false;
};

// If true (il y a un héros mort)
const removeDeadHeros = (deadHerosHTMLElement) => {
  if (deadHerosHTMLElement !== false) {
    for (let i = 0; i < deadHerosHTMLElement.length; i++) {
      deadHerosHTMLElement[i].id = "";
      deadHerosHTMLElement[i].classList.remove("hero");
      deadHerosHTMLElement[i].classList.remove("to-delete");
      deadHerosHTMLElement[i].classList.add("dead-body");
    }
  }
};

// Check if the players won over the dungeon master (but start only after the page loaded completely)
const checkIfPlayersWon = () => {
  if (!document.querySelector("#lichking"))
    displayEndGameModal("VICTORY! You defeated the Lich King!");
};

//! OLD COLD TO ERASE IF THE GAME IS WORKING
// setTimeout(() => {
//   setInterval(() => {
//     if (!document.querySelector("#lichking"))
//       displayEndGameModal("VICTORY! You defeated the Lich King!");
//   }, 1000);
// }, 25000);

/* ------------------------------------------------------ Turned-based system ------------------------------------------------------ */

const playDungeonMasterTurn = () => {
  // Trigger the  function that moves monsters if within range
  moveMonsters();
  // Trigger the function to have monsters attack players a second time (for those who havent't already attacked)
  monsterAttack();
  // Check if the LichKing died attacking the heroes (in case of a shield)
  checkIfPlayersWon();
  // Trigger the function to see if some heroes are dead
  removeDeadHeros(areThereDeadHeros());
  // Automatically change Current Player to the next one
  chooseNextPlayer();
};

const chooseNextPlayer = () => {
  let currentPlayer = document.querySelector(".current-player");
  soundTurnChange.play();
  hidePlayerMotionPossibilities();

  /* -------------------- Trying to refactor my code from lines 174 and on ------ */

  // for (let i = 0; i < playersAndDungeonMasterArray.length; i++) {
  //   if (currentPlayer.id === "dungeonMaster") {
  //     playDungeonMasterTurn();
  //   } else if (currentPlayer.id === playersAndDungeonMasterArray[i]) {
  //     // Reset the step counter of the ex current-player
  //     players[playersAndDungeonMasterArray[i]].stepsCount =
  //       players[playersAndDungeonMasterArray[i]].maxSteps;
  //     // Then pass on next player in the array as the current player (if alive)
  //     if (
  //       document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 1) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       )
  //     ) {
  //       currentPlayer.classList.remove("current-player");
  //       const newPlayer = document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 1) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       );
  //       newPlayer.classList.add("current-player");
  //       // showPlayerMotionPossibilities();
  //     } else if (
  //       document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 2) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       )
  //     ) {
  //       currentPlayer.classList.remove("current-player");
  //       const newPlayer = document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 2) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       );
  //       newPlayer.classList.add("current-player");
  //       // showPlayerMotionPossibilities();
  //     } else if (
  //       document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 3) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       )
  //     ) {
  //       currentPlayer.classList.remove("current-player");
  //       const newPlayer = document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 3) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       );
  //       newPlayer.classList.add("current-player");
  //       // showPlayerMotionPossibilities();
  //     } else if (
  //       document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 4) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       )
  //     ) {
  //       currentPlayer.classList.remove("current-player");
  //       const newPlayer = document.querySelector(
  //         `#${
  //           playersAndDungeonMasterArray[
  //             (i + 4) % playersAndDungeonMasterArray.length
  //           ]
  //         }`
  //       );
  //       newPlayer.classList.add("current-player");
  //       playDungeonMasterTurn();
  //       // Else it means that the DUNGEON MASTER WON
  //     } else {
  //       displayEndGameModal("THE DUNGEON MASTER WON!");
  //     }
  //   }
  // }

  /* ------------ The good code below ------------------ */

  if (currentPlayer.id === "lidda") {
    // Set Jozian as the next player after Lidda if alive
    if (document.querySelector("#jozian")) {
      currentPlayer.classList.remove("current-player");
      const jozian = document.querySelector("#jozian");
      jozian.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Else set Mialye if alive
    } else if (document.querySelector("#mialye")) {
      currentPlayer.classList.remove("current-player");
      const mialye = document.querySelector("#mialye");
      mialye.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Else set Regdar if alive
    } else if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Set dungeonMaster as the next player after Regdar
    } else if (document.querySelector("#dungeonMaster")) {
      currentPlayer.classList.remove("current-player");
      const dungeonMaster = document.querySelector("#dungeonMaster");
      dungeonMaster.classList.add("current-player");
      // Jouer le tour du maître du donjon
      playDungeonMasterTurn();
      // Else it means that the DUNGEON MASTER WON
    } else {
      displayEndGameModal("THE DUNGEON MASTER WON!");
    }
    // Reset the step counter of Lidda
    players.lidda.stepsCount = players.lidda.maxSteps;
  } else if (currentPlayer.id === "jozian") {
    // Set Mialyë as the next player after Jozian if alive
    if (document.querySelector("#mialye")) {
      currentPlayer.classList.remove("current-player");
      const mialye = document.querySelector("#mialye");
      mialye.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Else set Regdar if alive
    } else if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
      showPlayerMotionPossibilities();
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
      showPlayerMotionPossibilities();
      // Else it means that the DUNGEON MASTER WON
    } else {
      displayEndGameModal("THE DUNGEON MASTER WON!");
    }
    // Reset the step counter of Jozian
    players.jozian.stepsCount = players.jozian.maxSteps;
  } else if (currentPlayer.id === "mialye") {
    // Set Regdar as the next player after Mialyë
    if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
      showPlayerMotionPossibilities();
    } else if (document.querySelector("#dungeonMaster")) {
      // Set dungeonMaster as the next player after Regdar
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
      showPlayerMotionPossibilities();
      // Else set Jozian if alive
    } else if (document.querySelector("#jozian")) {
      currentPlayer.classList.remove("current-player");
      const jozian = document.querySelector("#jozian");
      jozian.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Else it means that the DUNGEON MASTER WON
    } else {
      displayEndGameModal("THE DUNGEON MASTER WON!");
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
      showPlayerMotionPossibilities();
      // Else set Jozian if alive
    } else if (document.querySelector("#jozian")) {
      currentPlayer.classList.remove("current-player");
      const jozian = document.querySelector("#jozian");
      jozian.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Else set Mialye if alive
    } else if (document.querySelector("#mialye")) {
      currentPlayer.classList.remove("current-player");
      const mialye = document.querySelector("#mialye");
      mialye.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Else set Regdar if alive
    } else if (document.querySelector("#regdar")) {
      currentPlayer.classList.remove("current-player");
      const regdar = document.querySelector("#regdar");
      regdar.classList.add("current-player");
      showPlayerMotionPossibilities();
      // Else it means that the DUNGEON MASTER WON
    } else {
      displayEndGameModal("THE DUNGEON MASTER WON!");
    }
  }

  // Remove the target
  if (document.querySelector(".is-selected")) {
    let selected = document.querySelector(".is-selected");
    selected.classList.remove("is-selected");
  }

  // Reset all attack counts
  players.lidda.attackCount = players.lidda.maxAttackCount;
  players.jozian.attackCount = players.jozian.maxAttackCount;
  players.mialye.attackCount = players.mialye.maxAttackCount;
  players.regdar.attackCount = players.regdar.maxAttackCount;
  // Reset all heal counts
  players.lidda.healCount = players.lidda.maxHealCount;
  players.jozian.healCount = players.jozian.maxHealCount;
  players.mialye.healCount = players.mialye.maxHealCount;
  players.regdar.healCount = players.regdar.maxHealCount;
};

/* ----------------------------------------- Method to update players stats after an action (motion/attack/heal/loot) ------------------------------------- */

// Function to update each player's stats visually
export const updateVisuallyPlayersStats = () => {
  playersArray.forEach((player) => {
    document.querySelector(`#life-of-${player}`).innerHTML =
      players[`${player}`].health;
    document.querySelector(`#mana-of-${player}`).innerHTML =
      players[`${player}`].mana;
    document.querySelector(`#steps-of-${player}`).innerHTML =
      players[`${player}`].stepsCount;
    document.querySelector(`#shield-of-${player}`).innerHTML =
      players[`${player}`].shield;

    const spacedPlayerInventory =
      players[`${player}`].inventory.length > 0
        ? players[`${player}`].inventory.map((item) =>
            item.replaceAll("_", " ")
          )
        : players[`${player}`].inventory;

    document.querySelector(`#inventory-of-${player}`).innerHTML =
      spacedPlayerInventory;
    document.querySelector(`#weapon-of-${player}`).innerHTML = players[
      `${player}`
    ].weapon.replaceAll("_", " ");
  });
};

// Function to update each monster's stats visually
export const updateVisuallyMonstersStats = () => {
  // monstersArray.forEach((monster) => {
  //   document.querySelector(`#life-of-${monster}`).innerHTML =
  //     monsters[`${monster}`].health;
  //   document.querySelector(`#mana-of-${monster}`).innerHTML =
  //     monsters[`${monster}`].mana;
  //   document.querySelector(`#steps-of-${monster}`).innerHTML =
  //     monsters[`${monster}`].stepsCount;
  //   document.querySelector(`#shield-of-${monster}`).innerHTML =
  //     monsters[`${monster}`].shield;

  //   const spacedMonsterInventory =
  //     monsters[`${monster}`].inventory.length > 0
  //       ? monsters[`${monster}`].inventory.map((item) =>
  //           item.replaceAll("_", " ")
  //         )
  //       : monsters[`${monster}`].inventory;

  //   document.querySelector(`#inventory-of-${monster}`).innerHTML =
  //     spacedMonsterInventory;
  //   document.querySelector(`#weapon-of-${monster}`).innerHTML = monsters[
  //     `${monster}`
  //   ].weapon.replaceAll("_", " ");
  // });
};

/* ------------------------------------------------------- Event listeners ------------------------------------------------------- */

// Event listener to load the first image, explanation text and map at windows load
window.addEventListener("load", () => {
    document.querySelector("#game-map").style.backgroundImage =
    "url(img/dnd-logo.png)";
    document.querySelector("#control-panel").style.display = "none";
  
    setTimeout(() => {
    document.querySelector("#game-map").style.backgroundImage =
      "url(img/background/dungeon-gameboard-optim.jpg)";
    document.querySelector("#title").remove();
    document.querySelector("#control-panel").style.display = "flex";
    initializeMap();
    updateVisuallyPlayersStats();
    updateVisuallyMonstersStats();

    // typeWriter();
  }, 4000);

  // document.querySelector("#control-panel").style.display = "none";
  // document.querySelector("#title").height = "400px";

  // let textContainer = document.querySelector("#title p");
  // let text =
  //   "Nos quatre héros viennent de pénétrer dans le donjon. Leur objectif : obtenir la couronne du roi liche. Mais attention, ils devront faire face à des monstres sanguinaires et des pièges vicieux sur leur passage.";
  // let i = 0;
  // let speed = 50;

  // function typeWriter() {
  //   if (i < text.length) {
  //     textContainer.textContent += `${text.charAt(i)}`;
  //     i++;
  //     setTimeout(typeWriter, speed);
  //   }
  // }

  // setTimeout(() => {
  //   document.querySelector("#stat-panel").style.display = "flex";
  //   document.querySelector("#control-panel").style.display = "flex";
  //   document.querySelector("#stat-panel").style.height = "470px";
  //   document.querySelector("#stat-panel").style.margin = "35px 0 0 0";

  // }, 18000);
});

// Event listeners to attach players and monsters modals to buttons

document.querySelector("#player-btn-lidda").addEventListener("click", () => {
    document.querySelector("#lidda-dialog").showModal();
  });

document.querySelector("#lidda-modal-close-btn").addEventListener("click", () => {
  document.querySelector("#lidda-dialog").close("Closed modal");
})

document.querySelector("#player-btn-jozian").addEventListener("click", () => {
  document.querySelector("#jozian-dialog").showModal();
});

document.querySelector("#jozian-modal-close-btn").addEventListener("click", () => {
document.querySelector("#jozian-dialog").close("Closed modal");
})

document.querySelector("#player-btn-mialye").addEventListener("click", () => {
  document.querySelector("#mialye-dialog").showModal();
});

document.querySelector("#mialye-modal-close-btn").addEventListener("click", () => {
document.querySelector("#mialye-dialog").close("Closed modal");
})

document.querySelector("#player-btn-regdar").addEventListener("click", () => {
  document.querySelector("#regdar-dialog").showModal();
});

document.querySelector("#regdar-modal-close-btn").addEventListener("click", () => {
document.querySelector("#regdar-dialog").close("Closed modal");
})

// Event listener on the "next" button to trigger the chooseNextPlayer function
document
  .querySelector("#btn-end-of-turn")
  .addEventListener("click", chooseNextPlayer);

// Event listener on the "attack" button to check whether an heroe can attack and if so to deal damage and handle monster death
document.querySelector("#btn-attack").addEventListener("click", () => {
  let currentPlayerPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPlayerPosition.id];
  let selectedPosition = document.querySelector(".is-selected");
  let selectedPositionObject = monsters[selectedPosition.id];

  if (selectedPosition.classList.contains("hero")) {
    displayModal("You can't attack another hero!");
  } else if (selectedPosition.classList.contains("locked-chest")) {
    displayModal("Click on Search if you wish to open the chest!");
  } else if (currentPlayerObject.attackCount < 1) {
    displayModal("You already attacked during this turn");
  } else if (totalDistanceWithSelected() > 1) {
    displayModal("You are too far away from the monster!");
  } else {
    if (totalDistanceWithSelected() === 1)
      receiveDamage(selectedPositionObject, weaponAttack(currentPlayerObject));
    currentPlayerObject.attackCount--;
    if (selectedPositionObject.health <= 0) {
      selectedPosition.id = "";
      selectedPosition.classList.remove("is-selected");
      selectedPosition.classList.remove("monster");
      selectedPosition.classList.add("dead-body");
    }
    // Function to see if players won the game because the dead target was the Lich King
    checkIfPlayersWon();
  }
});

// Event listener on the "spell" button to check whether an heroe can cast a spell and if so to deal damage and handle monster death
document.querySelector("#btn-spell").addEventListener("click", () => {
  let currentPlayerPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPlayerPosition.id];
  let selectedPosition = document.querySelector(".is-selected");
  let selectedPositionObject = monsters[selectedPosition.id];

  if (selectedPosition.classList.contains("hero")) {
    displayModal("You can't attack another hero!");
  } else if (currentPlayerObject.attackCount < 1) {
    displayModal("You already attacked during this turn!");
  } else if (totalDistanceWithSelected() > 2) {
    displayModal("You are too far away from the monster!");
  } else if (spells[currentPlayerObject.spell].type !== "attack") {
    displayModal("You can't attack with your current equipped spell!");
  } else {
    if (totalDistanceWithSelected() <= 2)
      receiveDamage(selectedPositionObject, spellAttack(currentPlayerObject));
    currentPlayerObject.attackCount--;
    if (selectedPositionObject.health <= 0) {
      selectedPosition.id = "";
      selectedPosition.classList.remove("is-selected");
      selectedPosition.classList.remove("monster");
      selectedPosition.classList.add("dead-body");
    }
    // Function to see if players won the game because the dead target was the Lich King
    checkIfPlayersWon();
  }
});

// Event listener on the "search" button to check whether an heroe is within distance to rummage through the chest, has inventory space, and if so to add a random object
document.querySelector("#btn-search").addEventListener("click", () => {
  let currentPlayerPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPlayerPosition.id];
  let selectedPosition = document.querySelector(".is-selected");

  if (
    totalDistanceWithSelected() > 1 &&
    selectedPosition.classList.contains("locked-chest")
  ) {
    displayModal("You are too far from the chest to open it!");
  } else if (
    totalDistanceWithSelected() === 1 &&
    selectedPosition.classList.contains("locked-chest")
  ) {
    if (
      currentPlayerObject.inventory.length ===
      currentPlayerObject.inventoryCapacity
    ) {
      selectedPosition.classList.remove("is-selected");
      displayModal("You are already at full capacity!");
    } else {
      soundChestOpened.play();
      selectedPosition.classList.remove("locked-chest");
      selectedPosition.classList.add("opened-chest");
      selectedPosition.classList.remove("is-selected");
      addRandomObjectToInventory(currentPlayerObject);
      updateVisuallyPlayersStats();
    }
  }
});

// Event listener on the "heal" button to check whether an heroe is within distance of the selected player, if the selected target is not a monster, and if so to trigger the heal function
document.querySelector("#btn-heal").addEventListener("click", () => {
  let currentPlayerPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPlayerPosition.id];
  let selectedPosition = document.querySelector(".is-selected");
  let selectedPositionObject = players[selectedPosition.id];

  if (selectedPosition.classList.contains("monster")) {
    displayModal("You can't heal a monster!");
  } else if (totalDistanceWithSelected() > 2) {
    displayModal("You are too far away to heal the player!");
  } else {
    healPlayer(currentPlayerObject, selectedPositionObject);
    currentPlayerObject.healCount--;
    selectedPosition.classList.remove("is-selected");
    updateVisuallyPlayersStats();
  }
});

// Event listeners to link keys with doors
const intervalId = setTimeout(() => {
  document.querySelector(".key1").addEventListener("click", () => {
    document.querySelector(".door1").classList.remove("door1");
    document.querySelector(".key1").classList.remove("key1");
    soundDoorOpened.play();
  });

  document.querySelector(".key2").addEventListener("click", () => {
    document.querySelector(".door2").classList.remove("door2");
    document.querySelector(".key2").classList.remove("key2");
    soundDoorOpened.play();
  });
  clearTimeout(intervalId);
}, 15000);
