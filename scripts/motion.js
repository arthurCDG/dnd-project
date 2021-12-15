import { players } from "./players.js";
import { traps } from "./traps.js";

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
  let xCoordOfCurrentPlayer = document
    .querySelector(".current-player")
    .getAttribute("data-x");
  let yCoordOfCurrentPlayer = document
    .querySelector(".current-player")
    .getAttribute("data-y");
  let xCoordOfSelected = document
    .querySelector(".is-selected")
    .getAttribute("data-x");
  let yCoordOfSelected = document
    .querySelector(".is-selected")
    .getAttribute("data-y");

  return (
    Math.abs(xCoordOfCurrentPlayer - xCoordOfSelected) +
    Math.abs(yCoordOfCurrentPlayer - yCoordOfSelected)
  );
};

/* -------- Check whether a player is allowed to move on the targeted square on the gameboard (compare distance with remaining steps) ------ */

const checkIfPlayerCanMove = (playerObject, target) => {
  let totalDistance = totalDistanceWithTarget(target);
  return totalDistance <= playerObject.maxSteps ? true : false;
};

/* --------------------------- Updates a player's health depending on the damage inflicted by the trap  ------------------------------------- */

const receiveTrapDamage = (player, damage) => {
  if (damage >= player.health + player.shield) {
    player.isAlive = false;
    throw alert(`${player.name} is dead`);
  } else {
    player.health -= damage;
  }
};

/* ---- Move a player to a targeted square of the gameboard or select sth to interract with(callback of addEventListener on all squares) ---- */

export const playerMotion = (event) => {
  let currentPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPosition.id];
  let newPosition = event.target;
  let canMove = checkIfPlayerCanMove(getCurrentPlayer(), newPosition);

  if (newPosition === currentPosition)
    console.log("Yup, it's you. Want a cookie?");
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
    throw alert("You don't have enough steps left!");
  else if (
    newPosition.classList.contains("wall") ||
    newPosition.classList.contains("pillar")
  )
    throw alert("You can't go there!");
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
    // & change the square's image to indicate that the trap is disabled and you can walk on it
    if (newPosition.classList.contains("active-hole-trap")) {
      receiveTrapDamage(currentPlayerObject, traps.hole);
      newPosition.classList.remove("active-hole-trap");
      newPosition.classList.add("inactive-hole-trap");
    } else if (newPosition.classList.contains("active-fireball-trap")) {
      receiveTrapDamage(currentPlayerObject, traps.fireball);
      newPosition.classList.remove("active-fireball-trap");
      newPosition.classList.add("inactive-fireball-trap");
    } else if (newPosition.classList.contains("active-poison-trap")) {
      receiveTrapDamage(currentPlayerObject, traps.poisonedTrap());
      newPosition.classList.remove("active-poison-trap");
      newPosition.classList.add("inactive-poison-trap");
    }
  }
};
