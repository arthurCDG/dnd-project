import { playerMotion } from "./motion.js";

// Create a 27*17 grid where each square has a class of game-square and has x and y coordinates as attributes
export const createMap = () => {
  const gameMap = document.querySelector("#game-map");

  for (let i = 1; i < 18; i++) {
    for (let j = 1; j < 28; j++) {
      const newDiv = document.createElement("div");
      newDiv.classList.add("game-square");
      newDiv.addEventListener("click", playerMotion);
      newDiv.setAttribute("data-x", i);
      newDiv.setAttribute("data-y", j);
      gameMap.appendChild(newDiv);
    }
  }
};

export const placePlayersOnMap = () => {
  // Place players on the four first columns of the first row
  const liddaSquare = document.querySelector("[data-x='1'][data-y='1']");
  liddaSquare.id = "lidda";
  liddaSquare.classList.add("current-player");
  liddaSquare.classList.add("is-filled");
  const jozianSquare = document.querySelector("[data-x='1'][data-y='2']");
  jozianSquare.id = "jozian";
  jozianSquare.classList.add("is-filled");
  const mialyeSquare = document.querySelector("[data-x='1'][data-y='3']");
  mialyeSquare.id = "mialye";
  mialyeSquare.classList.add("is-filled");
  const regdarSquare = document.querySelector("[data-x='1'][data-y='4']");
  regdarSquare.id = "regdar";
  regdarSquare.classList.add("is-filled");
};

export const placeMonstersOnMap = () => {
  const goblinSquare = document.querySelector("[data-x='8'][data-y='2']");
  goblinSquare.classList.add("goblin");
  goblinSquare.classList.add("is-filled");
  const gnollSquare = document.querySelector("[data-x='9'][data-y='3']");
  gnollSquare.classList.add("gnoll");
  gnollSquare.classList.add("is-filled");
  const ogreSquare = document.querySelector("[data-x='16'][data-y='1']");
  ogreSquare.classList.add("ogre");
  ogreSquare.classList.add("is-filled");
};

export const placeWallsOnMap = () => {
  // Place a first wall
  for (let i = 1; i < 14; i++) {
    const wallSquare = document.querySelector(`[data-x='${i}'][data-y='5']`);
    wallSquare.classList.add("wall");
  }
  for (let i = 15; i < 18; i++) {
    const wallSquare = document.querySelector(`[data-x='${i}'][data-y='5']`);
    wallSquare.classList.add("wall");
  }
  // Place doors
  const doorSquare1 = document.querySelector("[data-x='14'][data-y='5']");
  doorSquare1.classList.add("door");
};

export const placeOtherMapElements = () => {
  // Place chests
  const chestSquare1 = document.querySelector("[data-x='5'][data-y='4']");
  chestSquare1.classList.add("locked-chest");
  const chestSquare2 = document.querySelector("[data-x='5'][data-y='1']");
  chestSquare2.classList.add("locked-chest");
  const chestSquare3 = document.querySelector("[data-x='17'][data-y='1']");
  chestSquare3.classList.add("locked-chest");
  const chestSquare4 = document.querySelector("[data-x='17'][data-y='4']");
  chestSquare4.classList.add("locked-chest");
  // Place pillars
  const pillarSquare1 = document.querySelector("[data-x='11'][data-y='4']");
  pillarSquare1.classList.add("pillar");
  const pillarSquare2 = document.querySelector("[data-x='11'][data-y='3']");
  pillarSquare2.classList.add("pillar");
  // Place hidden traps
  const trapSquare1 = document.querySelector("[data-x='4'][data-y='4']");
  trapSquare1.classList.add("active-hole-trap");
  const trapSquare2 = document.querySelector("[data-x='11'][data-y='2']");
  trapSquare2.classList.add("active-fireball-trap");
  const trapSquare3 = document.querySelector("[data-x='15'][data-y='4']");
  trapSquare3.classList.add("active-poison-trap");
};
