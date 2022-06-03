import { players } from "./players.js";
import { traps } from "./traps.js";
import { monsters } from "./monsters.js";
import { soundTrapActivated } from "./sounds.js";
import { displayModal, updateVisuallyPlayersStats } from "./main.js";

/* ------------------------------------ Get the players object (from the players.js file) ----------------------------------------------- */

const getCurrentPlayer = () => {
  let currentPlayer = document.querySelector(".current-player");
  if (currentPlayer.id === "lidda") {
    return players.lidda;
  } else if (currentPlayer.id === "jozian") {
    return players.jozian;
  } else if (currentPlayer.id === "mialye") {
    return players.mialye;
  } else {
    return players.regdar;
  }
};

/* --------------------------- Calculate the total distance traveled by a player when clicking on a square ------------------------------ */

export const totalDistanceWithTarget = (target) => {
  let xCoordOfCurrentPlayer = document
    .querySelector(".current-player")
    .getAttribute("data-x");
  let yCoordOfCurrentPlayer = document
    .querySelector(".current-player")
    .getAttribute("data-y");

  let xCoordOfTarget = target.getAttribute("data-x");
  let yCoordOfTarget = target.getAttribute("data-y");

  return (
    Math.abs(xCoordOfCurrentPlayer - xCoordOfTarget) +
    Math.abs(yCoordOfCurrentPlayer - yCoordOfTarget)
  );
};

/* --------------------------- Calculate the total distance between current player and its selected target ------------------------------ */

export const totalDistanceWithSelected = () => {
  let xCoordOfCurrentPlayer = Number(
    document.querySelector(".current-player").getAttribute("data-x")
  );
  let yCoordOfCurrentPlayer = Number(
    document.querySelector(".current-player").getAttribute("data-y")
  );
  let xCoordOfSelected = Number(
    document.querySelector(".is-selected").getAttribute("data-x")
  );
  let yCoordOfSelected = Number(
    document.querySelector(".is-selected").getAttribute("data-y")
  );

  if (xCoordOfCurrentPlayer - xCoordOfSelected === 0) {
    return Math.abs(yCoordOfCurrentPlayer - yCoordOfSelected);
  } else if (yCoordOfCurrentPlayer - yCoordOfSelected === 0) {
    return Math.abs(xCoordOfCurrentPlayer - xCoordOfSelected);
  } else {
    return (
      Math.abs(xCoordOfCurrentPlayer - xCoordOfSelected) +
      Math.abs(yCoordOfCurrentPlayer - yCoordOfSelected)
    );
  }
};

/* -------- Check whether a player is allowed to move on the targeted square on the gameboard (compare distance with remaining steps) ------ */

const checkIfPlayerCanMove = (playerObject, target) => {
  let totalDistance = totalDistanceWithTarget(target);
  return totalDistance <= playerObject.maxSteps ? true : false;
};

/* --------------------------- Updates a player's health depending on the damage inflicted by the trap  ------------------------------------- */

const receiveTrapDamage = (player, damage) => {
  if (damage >= player.health) {
    player.isAlive = false;
    player.health = 0;
    updateVisuallyPlayersStats();
    displayModal(`${player.name} is dead. R.I.P.`);
  } else {
    player.health -= damage;
    updateVisuallyPlayersStats();
  }
};

/* ---- Move a player to a targeted square of the gameboard or select sth to interract with(callback of addEventListener on all squares) ---- */

export const showPlayerMotionPossibilities = () => {
  let currentPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPosition.id];
  let dataXAttr = currentPosition.getAttribute("data-x");
  let dataYAttr = currentPosition.getAttribute("data-y");

  for (let i = 1; i < 18; i++) {
    // Pour un X donné, on teste tous les Y
    const xDistanceBetweenSquareAndCurrentPosition = Math.abs(dataXAttr - i);
    if (xDistanceBetweenSquareAndCurrentPosition <= currentPlayerObject.stepsCount) {
      for (let j = 1; j < 28; j++) {
        // Pour chaque Y, est-ce que la différence avec dataYattr (- la distance du X avec dataXAttr) est inférieure currentPlayersObject.stepsCount ?
        const yDistanceBetweenSquareAndCurrentPosition = Math.abs(dataYAttr - j);
        if (yDistanceBetweenSquareAndCurrentPosition + xDistanceBetweenSquareAndCurrentPosition <= currentPlayerObject.stepsCount) {
          // Si oui case en bleu
          let squareToColor = document.querySelector(
            `[data-x='${i}'][data-y='${j}']`
          );
          squareToColor.classList.add("motion-possible");
        }
      }
    }
  }

};

export const hidePlayerMotionPossibilities = () => {
  document.querySelectorAll(".motion-possible").forEach((square) => {
    square.classList.remove("motion-possible");
  });
};

export const playerMotion = (event) => {
  let currentPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPosition.id];
  let newPosition = event.target;
  let canMove = checkIfPlayerCanMove(getCurrentPlayer(), newPosition);

  if (newPosition === currentPosition)
    displayModal("Yup, it's you. Want a cookie?");
  else if (
    newPosition.classList.contains("hero") ||
    newPosition.classList.contains("monster") ||
    newPosition.classList.contains("locked-chest")
  ) {
    let currentSelected = document.querySelector(".is-selected");
    if (currentSelected) {
      currentSelected.classList.remove("is-selected");
      newPosition.classList.add("is-selected");
    } else newPosition.classList.add("is-selected");
  } else if (
    !canMove ||
    currentPlayerObject.stepsCount < totalDistanceWithTarget(newPosition)
  )
    displayModal("You don't have enough steps left!");
  else if (
    newPosition.classList.contains("wall") ||
    newPosition.classList.contains("pillar")
  )
    displayModal("You can't go there!");
  // If that target of the click is a player or an object (apart from the)
  else {
    // update the stepsCount of the player by removing the current distance
    currentPlayerObject.stepsCount -= totalDistanceWithTarget(newPosition);
    // Move the current-player class to the new square where the player is
    currentPosition.classList.remove("current-player");
    newPosition.classList.add("current-player");
    // Move the is-filled class to the new square where the player is
    currentPosition.classList.remove("hero");
    newPosition.classList.add("hero");
    // Set the new square to the player ID and remove the player ID from the previous square
    newPosition.id = currentPosition.id;
    currentPosition.id = "";
    // Handle the case where the player also receives damage because it's a trap
    // And change the square's image to indicate that the trap is disabled and you can walk on it
    if (newPosition.classList.contains("active-hole-trap")) {
      receiveTrapDamage(currentPlayerObject, traps.hole);
      newPosition.classList.remove("active-hole-trap");
      newPosition.classList.add("inactive-hole-trap");
      soundTrapActivated.play();
    } else if (newPosition.classList.contains("active-fireball-trap")) {
      receiveTrapDamage(currentPlayerObject, traps.fireball);
      newPosition.classList.remove("active-fireball-trap");
      newPosition.classList.add("inactive-fireball-trap");
      soundTrapActivated.play();
    } else if (newPosition.classList.contains("active-poison-trap")) {
      receiveTrapDamage(currentPlayerObject, traps.poisonedTrap());
      newPosition.classList.remove("active-poison-trap");
      newPosition.classList.add("inactive-poison-trap");
      soundTrapActivated.play();
    } else {
      updateVisuallyPlayersStats();
    }
    // Remove player motion possibilities
    hidePlayerMotionPossibilities();
  }
};

/* -------------------- Move a monster if it is within reach of a player (but not if can already attack)  ------------------------------ */

const checkIfTargetedSquareIsValid = (square) => {
  if (
    square.id !== undefined &&
    !square.classList.contains("hero") &&
    !square.classList.contains("monster") &&
    !square.classList.contains("wall") &&
    !square.classList.contains("pillar") &&
    !square.classList.contains("opened-chest") &&
    !square.classList.contains("locked-chest") &&
    !square.classList.contains("door")
  )
    return true;
  else return false;
};

export const moveMonsters = () => {
  // QuerySelectorAllMonstersAlive and heroesalive
  let allLivingMonsters = document.querySelectorAll(".monster");
  let allLivingHeroes = document.querySelectorAll(".hero");
  // Boucle sur tous les monstres
  for (let i = 0; i < allLivingMonsters.length; i++) {
    // Boucle sur chaque monstre (chaque monstre devient le current-player fictivement)
    // S'assurer de bien enlever la classe current player à une case existante pour qu'il n'y ait pas deux current players
    if (document.querySelector(".current-player"))
      document
        .querySelector(".current-player")
        .classList.remove("current-player");
    // Faire de chaque monstre le current player à chaque itération
    allLivingMonsters[i].classList.add("current-player");
    // Récupérer la référence de l'objet du monstre correspondant
    let monsterObject = monsters[document.querySelector(".current-player").id];
    // Boucle sur chaque héros
    for (let j = 0; j < allLivingHeroes.length; j++) {
      // S'assurer de bien enlever la classe is-selected à une case existante pour qu'il n'y ait pas deux current selected
      if (document.querySelector(".is-selected"))
        document.querySelector(".is-selected").classList.remove("is-selected");
      // Sélectionner le héro à chaque fois
      allLivingHeroes[j].classList.add("is-selected");
      // Pour chaque héro ciblé, à quelle distance du monstre est-il ?
      let distance = totalDistanceWithSelected();
      // Si le monstre est à portée, avancer (sauf si attackActionCount === 0 ????)
      if (distance <= monsterObject.stepsCount && distance >= 2) {
        // Check if the square at x+1 but same y is free, if so move the monster there
        let xPlusOneAttr =
          Number(allLivingHeroes[j].getAttribute("data-x")) + 1;
        let yAttrOfHero = Number(allLivingHeroes[j].getAttribute("data-y"));
        let xPlusOneSquareOfHero = document.querySelector(
          `[data-x='${xPlusOneAttr}'][data-y='${yAttrOfHero}']`
        );
        // Check if the square at x-1 but same y is free, if so move the monster there
        let xMinusOneAttr =
          Number(allLivingHeroes[j].getAttribute("data-x")) - 1;
        let xMinusOneSquareOfHero = document.querySelector(
          `[data-x='${xMinusOneAttr}'][data-y='${yAttrOfHero}']`
        );
        // Check if the square at y+1 but same x is free, if so move the monster there
        let yPlusOneAttr =
          Number(allLivingHeroes[j].getAttribute("data-y")) + 1;
        let xAttrOfHero = Number(allLivingHeroes[j].getAttribute("data-x"));
        let yPlusOneSquareOfHero = document.querySelector(
          `[data-x='${yPlusOneAttr}'][data-y='${xAttrOfHero}']`
        );
        // Check if the square at y-1 but same x is free, if so move the monster there
        let yMinusOneAttr =
          Number(allLivingHeroes[j].getAttribute("data-y")) - 1;
        let yMinusOneSquareOfHero = document.querySelector(
          `[data-x='${yMinusOneAttr}'][data-y='${xAttrOfHero}']`
        );

        if (checkIfTargetedSquareIsValid(xPlusOneSquareOfHero)) {
          xPlusOneSquareOfHero.classList.add("monster");
          xPlusOneSquareOfHero.classList.add("current-player");
          xPlusOneSquareOfHero.id = `${monsterObject.name.toLowerCase()}`;
          allLivingMonsters[i].classList.remove("monster");
          allLivingMonsters[i].classList.remove("current-player");
          allLivingMonsters[i].id = "";
        } else if (checkIfTargetedSquareIsValid(xMinusOneSquareOfHero)) {
          xMinusOneSquareOfHero.classList.add("monster");
          xMinusOneSquareOfHero.classList.add("current-player");
          xMinusOneSquareOfHero.id = `${monsterObject.name.toLowerCase()}`;
          allLivingMonsters[i].classList.remove("monster");
          allLivingMonsters[i].classList.remove("current-player");
          allLivingMonsters[i].id = "";
        } else if (checkIfTargetedSquareIsValid(yPlusOneSquareOfHero)) {
          yPlusOneSquareOfHero.classList.add("monster");
          yPlusOneSquareOfHero.classList.add("current-player");
          yPlusOneSquareOfHero.id = `${monsterObject.name.toLowerCase()}`;
          allLivingMonsters[i].classList.remove("monster");
          allLivingMonsters[i].classList.remove("current-player");
          allLivingMonsters[i].id = "";
        } else if (checkIfTargetedSquareIsValid(yMinusOneSquareOfHero)) {
          yMinusOneSquareOfHero.classList.add("monster");
          yMinusOneSquareOfHero.classList.add("current-player");
          yMinusOneSquareOfHero.id = `${monsterObject.name.toLowerCase()}`;
          allLivingMonsters[i].classList.remove("monster");
          allLivingMonsters[i].classList.remove("current-player");
          allLivingMonsters[i].id = "";
        }
        break;
      }
      allLivingHeroes[j].classList.remove("is-selected");
    }
  }
};
