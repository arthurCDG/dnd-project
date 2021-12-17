import { players } from "./players.js";
import { traps } from "./traps.js";
import { monsters } from "./monsters.js";
import { soundTrapActivated } from "./sounds.js";

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
    }
  }
};

/* -------------------- Move a monster if it is withing reach of a player (but not if can already attack)  ------------------------------ */

export const moveMonsters = () => {
  // QuerySelectorAllMonstersAlive and heroesalive
  let allLivingMonsters = document.querySelectorAll(".monster");
  let allLivingHeroes = document.querySelectorAll(".hero");
  // Boucle sur tous les monstres
  for (let i = 0; i < allLivingMonsters.length; i++) {
    // Boucle sur chaque monstre (chaque monstre devient le current-player fictivement)
    let currentPlayer = document.querySelector(".current-player");
    currentPlayer.classList.remove("current-player");
    allLivingMonsters[i].classList.add("current-player");
    let monsterObject = monsters[document.querySelector(".current-player").id];
    // Boucle sur chaque héros
    for (let j = 0; j < allLivingHeroes.length; j++) {
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

        console.log(xPlusOneSquareOfHero);
        console.log(typeof xPlusOneSquareOfHero.id);

        if (
          xPlusOneSquareOfHero.id !== undefined &&
          !xPlusOneSquareOfHero.classList.contains("hero") &&
          !xPlusOneSquareOfHero.classList.contains("monster") &&
          !xPlusOneSquareOfHero.classList.contains("wall") &&
          !xPlusOneSquareOfHero.classList.contains("opened-chest") &&
          !xPlusOneSquareOfHero.classList.contains("locked-chest") &&
          !xPlusOneSquareOfHero.classList.contains("door")
        ) {
          xPlusOneSquareOfHero.classList.add("monster");
          xPlusOneSquareOfHero.classList.add("current-player");
          xPlusOneSquareOfHero.id = `${monsterObject.name.toLowerCase()}`;
          allLivingMonsters[i].classList.remove("monster");
          allLivingMonsters[i].classList.remove("current-player");
          allLivingMonsters[i].id = "";
        } else if (
          xMinusOneSquareOfHero.id !== undefined &&
          !xMinusOneSquareOfHero.classList.contains("hero") &&
          !xMinusOneSquareOfHero.classList.contains("monster") &&
          !xMinusOneSquareOfHero.classList.contains("wall") &&
          !xMinusOneSquareOfHero.classList.contains("opened-chest") &&
          !xMinusOneSquareOfHero.classList.contains("locked-chest") &&
          !xMinusOneSquareOfHero.classList.contains("door")
        ) {
          xMinusOneSquareOfHero.classList.add("monster");
          xMinusOneSquareOfHero.classList.add("current-player");
          xMinusOneSquareOfHero.id = `${monsterObject.name.toLowerCase()}`;
          allLivingMonsters[i].classList.remove("monster");
          allLivingMonsters[i].classList.remove("current-player");
          allLivingMonsters[i].id = "";
        } else if (
          yPlusOneSquareOfHero.id !== undefined &&
          !yPlusOneSquareOfHero.classList.contains("hero") &&
          !yPlusOneSquareOfHero.classList.contains("monster") &&
          !yPlusOneSquareOfHero.classList.contains("wall") &&
          !yPlusOneSquareOfHero.classList.contains("opened-chest") &&
          !yPlusOneSquareOfHero.classList.contains("locked-chest") &&
          !yPlusOneSquareOfHero.classList.contains("door")
        ) {
          yPlusOneSquareOfHero.classList.add("monster");
          yPlusOneSquareOfHero.classList.add("current-player");
          yPlusOneSquareOfHero.id = `${monsterObject.name.toLowerCase()}`;
          allLivingMonsters[i].classList.remove("monster");
          allLivingMonsters[i].classList.remove("current-player");
          allLivingMonsters[i].id = "";
        } else if (
          yMinusOneSquareOfHero.id !== undefined &&
          !yMinusOneSquareOfHero.classList.contains("hero") &&
          !yMinusOneSquareOfHero.classList.contains("monster") &&
          !yMinusOneSquareOfHero.classList.contains("wall") &&
          !yMinusOneSquareOfHero.classList.contains("opened-chest") &&
          !yMinusOneSquareOfHero.classList.contains("locked-chest") &&
          !yMinusOneSquareOfHero.classList.contains("door")
        ) {
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
