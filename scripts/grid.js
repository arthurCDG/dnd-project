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
  const liddaSquare = document.querySelector("[data-x='2'][data-y='2']");
  liddaSquare.id = "lidda";
  liddaSquare.classList.add("current-player");
  liddaSquare.classList.add("hero");
  const jozianSquare = document.querySelector("[data-x='2'][data-y='3']");
  jozianSquare.id = "jozian";
  jozianSquare.classList.add("hero");
  const mialyeSquare = document.querySelector("[data-x='2'][data-y='4']");
  mialyeSquare.id = "mialye";
  mialyeSquare.classList.add("hero");
  const regdarSquare = document.querySelector("[data-x='2'][data-y='5']");
  regdarSquare.id = "regdar";
  regdarSquare.classList.add("hero");
};

export const placeMonstersOnMap = () => {
  const goblinSquare = document.querySelector("[data-x='8'][data-y='2']");
  goblinSquare.id = "goblin";
  goblinSquare.classList.add("monster");
  const gnollSquare = document.querySelector("[data-x='9'][data-y='3']");
  gnollSquare.id = "gnoll";
  gnollSquare.classList.add("monster");
  const ogreSquare = document.querySelector("[data-x='15'][data-y='2']");
  ogreSquare.id = "ogre";
  ogreSquare.classList.add("monster");
  const lichKingSquare = document.querySelector("[data-x='3'][data-y='26']");
  lichKingSquare.id = "lichKing";
  lichKingSquare.classList.add("monster");
  const trollSquare = document.querySelector("[data-x='12'][data-y='10']");
  trollSquare.id = "troll";
  trollSquare.classList.add("monster");
  const specterSquare = document.querySelector("[data-x='14'][data-y='24']");
  specterSquare.id = "specter";
  specterSquare.classList.add("monster");
  const skeletonSquare = document.querySelector("[data-x='11'][data-y='17']");
  skeletonSquare.id = "skeleton";
  skeletonSquare.classList.add("monster");
  const slimeSquare = document.querySelector("[data-x='4'][data-y='13']");
  slimeSquare.id = "slime";
  slimeSquare.classList.add("monster");
  const minotaurSquare = document.querySelector("[data-x='7'][data-y='12']");
  minotaurSquare.id = "minotaur";
  minotaurSquare.classList.add("monster");
  const wyvernSquare = document.querySelector("[data-x='15'][data-y='13']");
  wyvernSquare.id = "wyvern";
  wyvernSquare.classList.add("monster");
};

export const placeWallsOnMap = () => {
  // Place north wall
  for (let i = 1; i < 28; i++) {
    const wallSquare1 = document.querySelector(`[data-x='1'][data-y='${i}']`);
    wallSquare1.classList.add("wall");
  }
  // Place east wall
  for (let i = 1; i < 18; i++) {
    const wallSquare = document.querySelector(`[data-x='${i}'][data-y='27']`);
    wallSquare.classList.add("wall");
  }
  // Place south wall
  for (let i = 1; i < 28; i++) {
    const wallSquare1 = document.querySelector(`[data-x='17'][data-y='${i}']`);
    wallSquare1.classList.add("wall");
  }
  // Place west wall
  for (let i = 1; i < 18; i++) {
    const wallSquare = document.querySelector(`[data-x='${i}'][data-y='1']`);
    wallSquare.classList.add("wall");
  }
  // Place a first vertical inner wall
  for (let i = 1; i < 14; i++) {
    const wallSquare = document.querySelector(`[data-x='${i}'][data-y='7']`);
    wallSquare.classList.add("wall");
  }
  for (let i = 15; i < 18; i++) {
    const wallSquare = document.querySelector(`[data-x='${i}'][data-y='7']`);
    wallSquare.classList.add("wall");
  }
  // Place a second vertical inner wall
  for (let i = 1; i < 10; i++) {
    const wallSquare = document.querySelector(`[data-x='${i}'][data-y='18']`);
    wallSquare.classList.add("wall");
  }
  // Lock the lich king room
  for (let i = 18; i < 23; i++) {
    const wallSquare = document.querySelector(`[data-x='10'][data-y='${i}']`);
    wallSquare.classList.add("wall");
  }
  for (let i = 24; i < 28; i++) {
    const wallSquare = document.querySelector(`[data-x='10'][data-y='${i}']`);
    wallSquare.classList.add("wall");
  }
  // Place doors
  const doorSquare1 = document.querySelector("[data-x='14'][data-y='7']");
  doorSquare1.classList.add("door1");
  const doorSquare2 = document.querySelector("[data-x='10'][data-y='23']");
  doorSquare2.classList.add("door2");
};

export const placeOtherMapElements = () => {
  // Place chests
  const chestSquare1 = document.querySelector("[data-x='5'][data-y='6']");
  chestSquare1.classList.add("locked-chest");
  const chestSquare2 = document.querySelector("[data-x='5'][data-y='2']");
  chestSquare2.classList.add("locked-chest");
  const chestSquare3 = document.querySelector("[data-x='16'][data-y='2']");
  chestSquare3.classList.add("locked-chest");
  const chestSquare4 = document.querySelector("[data-x='16'][data-y='6']");
  chestSquare4.classList.add("locked-chest");
  const chestSquare5 = document.querySelector("[data-x='7'][data-y='26']");
  chestSquare5.classList.add("locked-chest");
  const chestSquare6 = document.querySelector("[data-x='8'][data-y='26']");
  chestSquare6.classList.add("locked-chest");
  const chestSquare7 = document.querySelector("[data-x='2'][data-y='20']");
  chestSquare7.classList.add("locked-chest");
  const chestSquare8 = document.querySelector("[data-x='2'][data-y='21']");
  chestSquare8.classList.add("locked-chest");
  for (let i = 11; i < 15; i++) {
    const chestSquare = document.querySelector(`[data-x='2'][data-y='${i}']`);
    chestSquare.classList.add("locked-chest");
  }
  for (let i = 14; i < 17; i++) {
    const chestSquare = document.querySelector(`[data-x='${i}'][data-y='26']`);
    chestSquare.classList.add("locked-chest");
  }
  // Place pillars
  const pillarSquare1 = document.querySelector("[data-x='11'][data-y='4']");
  pillarSquare1.classList.add("pillar");
  const pillarSquare2 = document.querySelector("[data-x='11'][data-y='3']");
  pillarSquare2.classList.add("pillar");
  const pillarSquare3 = document.querySelector("[data-x='2'][data-y='26']");
  pillarSquare3.classList.add("pillar");
  const pillarSquare4 = document.querySelector("[data-x='4'][data-y='26']");
  pillarSquare4.classList.add("pillar");
  const pillarSquare5 = document.querySelector("[data-x='10'][data-y='17']");
  pillarSquare5.classList.add("pillar");
  const pillarSquare6 = document.querySelector("[data-x='11'][data-y='18']");
  pillarSquare6.classList.add("pillar");
  for (let i = 4; i < 7; i++) {
    const pillarSquare = document.querySelector(`[data-x='7'][data-y='${i}']`);
    pillarSquare.classList.add("pillar");
  }
  for (let i = 8; i < 11; i++) {
    const pillarSquare = document.querySelector(`[data-x='2'][data-y='${i}']`);
    pillarSquare.classList.add("pillar");
  }
  for (let i = 15; i < 18; i++) {
    const pillarSquare = document.querySelector(`[data-x='2'][data-y='${i}']`);
    pillarSquare.classList.add("pillar");
  }
  for (let i = 10; i < 16; i++) {
    const pillarSquare = document.querySelector(`[data-x='6'][data-y='${i}']`);
    pillarSquare.classList.add("pillar");
  }
  for (let i = 6; i < 10; i++) {
    const pillarSquare = document.querySelector(`[data-x='${i}'][data-y='10']`);
    pillarSquare.classList.add("pillar");
  }
  // Place decoration
  const brasero1 = document.querySelector("[data-x='9'][data-y='22']");
  brasero1.classList.add("brasero");
  const brasero2 = document.querySelector("[data-x='16'][data-y='8']");
  brasero2.classList.add("brasero");
  const brasero3 = document.querySelector("[data-x='9'][data-y='24']");
  brasero3.classList.add("brasero");
  // Place hidden traps
  const trapSquare1 = document.querySelector("[data-x='4'][data-y='4']");
  trapSquare1.classList.add("active-hole-trap");
  const trapSquare2 = document.querySelector("[data-x='12'][data-y='5']");
  trapSquare2.classList.add("active-hole-trap");
  const trapSquare3 = document.querySelector("[data-x='11'][data-y='2']");
  trapSquare3.classList.add("active-fireball-trap");
  const trapSquare4 = document.querySelector("[data-x='15'][data-y='4']");
  trapSquare4.classList.add("active-poison-trap");
  const trapSquare5 = document.querySelector("[data-x='15'][data-y='6']");
  trapSquare5.classList.add("active-poison-trap");
  // Place keys
  const keySquare1 = document.querySelector("[data-x='8'][data-y='6']");
  keySquare1.classList.add("key1");
  const keySquare2 = document.querySelector("[data-x='7'][data-y='11']");
  keySquare2.classList.add("key2");
};
