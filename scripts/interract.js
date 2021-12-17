import { players } from "./players.js";
import { monsters } from "./monsters.js";
import { weapons } from "./weapons.js";
import { spells } from "./spells.js";
import { dice, throwDice } from "./dice.js";
import { totalDistanceWithSelected } from "./motion.js";
import { soundAttack, soundOfDeath, soundUnsuccesfulAttack } from "./sounds.js";
import { artefacts } from "./artefacts.js";

/* ---------------------------------------------- Attack and receive damage functions ---------------------------------------------- */

// Function that receives an attacker as its argument and returns the sum of rolling dice corresponding to the weapon

export const weaponAttack = (attacker) => {
  let totalDamageCounter = 0;
  const associatedDice = weapons[attacker.weapon].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

  // Retirer les images des dés après 2 secondes
  setTimeout(() => {
    document.querySelector("#state").innerHTML = "";
  }, 2000);

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

  return totalDamageCounter;
};

// Function that updates a player's or monster's health depending on the damage inflicted and the player's or monster's shield

export const receiveDamage = (playerOrMonster, damage) => {
  if (playerOrMonster.inventory.includes("elven_mirror_shield")) {
    monsters[document.querySelector(".current-player").id].health -= damage;
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
    playerOrMonster.health -= damage - playerOrMonster.shield;
    playerOrMonster.isAlive = false;
    soundOfDeath.play();
  } else if (damage > playerOrMonster.shield) {
    playerOrMonster.health -= damage - playerOrMonster.shield;
    soundAttack.play();
  } else {
    soundUnsuccesfulAttack.play();
  }
};

/* --------------------------------------------------------- Heal a player ------------------------------------------------------- */

export const healPlayer = (caster, player) => {
  if (player.health <= 0)
    throw alert(
      `${player.name} is dead! You can only save him with a resurrection spell.`
    );
  else if (player.health === player.maxHealth) {
    throw alert(`${player.name} already has full life points!`);
  } else {
    let totalHealCounter = 0;

    const associatedDice = spells[caster.spell].actionDice;
    associatedDice.forEach((dieElement) => {
      totalHealCounter += throwDice(dice[dieElement]);
    });

    player.health += totalHealCounter;
    caster.mana -= spells[caster.spell].cost;
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
      }
      // Gérer le cas où le coup est fatal pour le héros
      if (heroObject.health <= 0) {
        heroObject.isAlive = false;
        allLivingHeroes[i].classList.add("to-delete");
        allLivingHeroes[i].classList.remove("is-selected");
      } else {
        allLivingHeroes[i].classList.remove("is-selected");
      }
    }
  });
  // A la fin de toutes les boucles monstres, retirer le statut de current player au dernier monstre et le réattribuer au maître du donjon
  let currentPlayer = document.querySelector(".current-player");
  currentPlayer.classList.remove("current-player");
  document.querySelector("#dungeonMaster").classList.add("current-player");
};

/* ------------------------------------------------------- Speciall spells ------------------------------------------------------- */

// Il faudra préparer les fonctions d'exécution pour le sort dismiss undeads et les sorts de découverte et de désomarçage de piège

/* ---------------------------------------------------- Open chests (search) ----------------------------------------------------- */

// Il faudra préparer la fonction qui retourne un objet random parmi les weapons et spells dans l'inventaire de la personne (et check si inventaire capacity is full)
export const addRandomObjectToInventory = () => {
  throw alert("it works");
};
// Si l'objet est obtenu est true_seeing_orb, alors exécution de artefacts[true_seeing_orb].action()
// Si l'objet obtenu est moshuga_turtle_shieild, alors le player.shield += 1;
