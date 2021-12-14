import { players } from "./players.js";

// Get the players object (from the players.js file)
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

// Calculate the total distance traveled by a player when clicking on a square
const totalDistanceTraveledByPlayer = (target) => {
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

// Check whether a player is allowed to move on the targeted square on the gameboard (compare distance with remaining steps)
export const seeIfPlayerCanMove = (playerObject, target) => {
  let totalDistance = totalDistanceTraveledByPlayer(target);
  return totalDistance <= playerObject.maxSteps ? true : false;
};

// Move a player (the one with the current-player class on) to a targeted square of the gameboard
export const playerMotion = (event) => {
  let currentPosition = document.querySelector(".current-player");
  let currentPlayerObject = players[currentPosition.id];
  let newPosition = event.target;

  const canMove = seeIfPlayerCanMove(getCurrentPlayer(), newPosition);

  if (
    !canMove ||
    currentPlayerObject.stepsCount < totalDistanceTraveledByPlayer(newPosition)
  )
    throw alert("You don't have enough steps left!");
  else if (
    newPosition.classList.contains("wall") ||
    newPosition.classList.contains("pillar") ||
    newPosition.classList.contains("locked-chest") ||
    newPosition.classList.contains("open-chest")
  )
    throw alert("You can't go there!");
  else if (newPosition.classList.contains("is-filled"))
    throw alert("Somebody's already there!");
  else {
    // update the stepsCount of the player by removing the current distance
    // ----> DOES NOT WORK BECAUSE PLAYEROBJECT IS NOT IN THE SCOPE OF THIS FUNCTION RAAAAAAAAAAAAAAAAAAH
    currentPlayerObject.stepsCount -=
      totalDistanceTraveledByPlayer(newPosition);
    // Move the current-player class to the new square where the player is
    currentPosition.classList.remove("current-player");
    newPosition.classList.add("current-player");
    // Move the is-filled class to the new square where the player is
    currentPosition.classList.remove("is-filled");
    newPosition.classList.add("is-filled");
    // Set the new square to the player ID and remove the player ID from the previous square
    newPosition.id = currentPosition.id;
    currentPosition.id = "";
  }
};
