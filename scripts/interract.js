import { players } from "./players.js";
import { monsters } from "./monsters.js";
import { weapons } from "./weapons.js";
import { spells } from "./spells.js";
import { dice, throwDice } from "./dice.js";
import { totalDistanceWithSelected } from "./motion.js";
import { soundAttack, soundOfDeath, soundUnsuccesfulAttack } from "./sounds.js";
import { artefacts } from "./artefacts.js";
import { displayModal, updateVisuallyPlayersStats, updateVisuallyMonstersStats } from "./main.js";

/* ---------------------------------------------- Attack and receive damage functions ---------------------------------------------- */

// Function that receives an attacker as its argument and returns the sum of rolling dice corresponding to the weapon

const removeDiceDisplayAfter2Seconds = () => {
  setTimeout(() => {
    document.querySelector("#state").innerHTML = "";
  }, 2000);
};

const removeSelectedPosition = () => {
  if (document.querySelector(".is-selected"))
    document.querySelector(".is-selected").classList.remove("is-selected");
};

const removeCurrentPlayer = () => {
  if (document.querySelector(".current-player"))
    document
      .querySelector(".current-player")
      .classList.remove("current-player");
};

export const weaponAttack = (attacker) => {
  let totalDamageCounter = 0;
  const associatedDice = weapons[attacker.weapon].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

  removeDiceDisplayAfter2Seconds();
  removeSelectedPosition();

  return totalDamageCounter;
};

// Function that receives an attacker as its argument and returns thesum of rolling dice corresponding to the spell

export const spellAttack = (caster) => {
  let totalDamageCounter = 0;

  const associatedDice = spells[caster.spell].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

  caster.mana -= spells[caster.spell].cost;

  removeDiceDisplayAfter2Seconds();
  removeSelectedPosition();

  return totalDamageCounter;
};

// Function that updates a player's or monster's health depending on the damage inflicted and the player's or monster's shield

export const receiveDamage = (playerOrMonster, damage) => {
  if (playerOrMonster.inventory.includes("elven_mirror_shield")) {
    monsters[document.querySelector(".current-player").id].health -=
      damage - monsters[document.querySelector(".current-player").id].shield;
    if (
      damage >= monsters[document.querySelector(".current-player").id].health
    ) {
      monsters[document.querySelector(".current-player").id].isAlive = false;
      document.querySelector(".current-player").id = "";
      document.querySelector(".current-player").classList.remove("is-selected");
      document.querySelector(".current-player").classList.remove("monster");
      document.querySelector(".current-player").classList.add("dead-body");
    }
  } else if (damage >= playerOrMonster.health + playerOrMonster.shield) {
    playerOrMonster.health = 0;
    playerOrMonster.isAlive = false;
    soundOfDeath.play();
  } else if (damage > playerOrMonster.shield) {
    playerOrMonster.health -= damage - playerOrMonster.shield;
    updateVisuallyPlayersStats();
    updateVisuallyMonstersStats();
    soundAttack.play();
  } else {
    soundUnsuccesfulAttack.play();
  }
};

/* --------------------------------------------------------- Heal a player ------------------------------------------------------- */

export const healPlayer = (caster, player) => {
  if (player.health <= 0)
    displayModal(
      `${player.name} is dead! You can only save him with a resurrection spell.`
    );
  else if (caster.mana < spells[caster.spell].cost)
    displayModal("You don't have enough mana for this spell!");
  else if (player.health === player.maxHealth) {
    displayModal(`${player.name} already has full life points!`);
  } else {
    let totalHealCounter = 0;

    const associatedDice = spells[caster.spell].actionDice;
    associatedDice.forEach((dieElement) => {
      totalHealCounter += throwDice(dice[dieElement]);
    });

    player.health += totalHealCounter;
    if (player.health > player.maxHealth) player.health = player.maxHealth;
    caster.mana -= spells[caster.spell].cost;

    if (caster.mana < 0) caster.mana = 0;

    removeDiceDisplayAfter2Seconds();
    removeSelectedPosition();
  }
};

/* ------------------------------------------------------- Monster attack ------------------------------------------------------- */

// Faire un querySelectorAll de tous les ID de monstre pour obtenir tous ceux encore vivants
export const monsterAttack = () => {
  let allLivingMonsters = document.querySelectorAll(".monster");
  let allLivingHeroes = document.querySelectorAll(".hero");
  //   Si je veux utiliser totalDistanceWithSelected, je dois faire une boucle où chaque monstre va être current-player
  allLivingMonsters.forEach((monster) => {
    // Boucle sur chaque monstre (chaque monstre devient le current-player fictivement)
    let currentPlayer = document.querySelector(".current-player");
    currentPlayer.classList.remove("current-player");
    monster.classList.add("current-player");
    let monsterObject = monsters[document.querySelector(".current-player").id];
    // Boucle sur chaque héros (chaque héros devient la cible fictivement)
    for (let i = 0; i < allLivingHeroes.length; i++) {
      allLivingHeroes[i].classList.add("is-selected");
      let heroObject = players[document.querySelector(".is-selected").id];
      // Pour chaque héro ciblé, à quelle distance du monstre est-il ?
      let distance = totalDistanceWithSelected();
      // Si le monstre est sur une case adjacente est peut attaquer (son compteur n'est pas à 0) alors il attaque
      if (distance <= 1) {
        receiveDamage(heroObject, weaponAttack(monsterObject));
        break;
      }
      // Gérer le cas où le coup est fatal pour le héros
      if (heroObject.isAlive === false) {
        allLivingHeroes[i].classList.add("to-delete");
        allLivingHeroes[i].classList.remove("is-selected");
        break;
      } else {
        allLivingHeroes[i].classList.remove("is-selected");
      }
    }
  });
  // A la fin de toutes les boucles monstres, retirer le statut de current player au dernier monstre et le réattribuer au maître du donjon
  removeCurrentPlayer();
  document.querySelector("#dungeonMaster").classList.add("current-player");
};

/* ------------------------------------------------------- Speciall spells ------------------------------------------------------- */

// Il faudra préparer les fonctions d'exécution pour le sort dismiss undeads et les sorts de découverte et de désomarçage de piège

/* ---------------------------------------------------- Open chests (search) ----------------------------------------------------- */

// Il faudra préparer la fonction qui retourne un objet random parmi les weapons et spells dans l'inventaire de la personne (et check si inventaire capacity is full)
export const addRandomObjectToInventory = (player) => {
  let allObjects = [weapons, artefacts, spells];
  let randomIndex1 = Math.floor(Math.random() * 3);
  let typeOfNewObject = Object.keys(allObjects[randomIndex1]);
  let randomIndex2 = Math.floor(Math.random() * typeOfNewObject.length);
  let newObject = typeOfNewObject[randomIndex2];

  if (allObjects[randomIndex1] === weapons) {
    player.inventory.push(player.weapon);
    player.weapon = newObject;
  } else if (allObjects[randomIndex1] === spells) {
    player.inventory.push(player.spell);
    player.spell = newObject;
  } else {
    player.inventory.push(newObject);
    if (newObject === "true_seeing_orb") artefacts["true_seeing_orb"].action();
    if (newObject === "moshuga_turtle_shield") player.shield += 1;
  }
};
