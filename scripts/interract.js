import { players } from "./players.js";
import { monsters } from "./monsters.js";
import { weapons } from "./weapons.js";
import { spells } from "./spells.js";
import { dice, throwDice } from "./dice.js";
import { totalDistanceWithSelected } from "./motion.js";

/* ---------------------------------------------- Attack and receive damage functions ---------------------------------------------- */

// Function that receives an attacker as its argument and returns the sum of rolling dice corresponding to the weapon

export const weaponAttack = (attacker) => {
  let totalDamageCounter = 0;
  const associatedDice = weapons[attacker.weapon].actionDice;
  associatedDice.forEach((dieElement) => {
    totalDamageCounter += throwDice(dice[dieElement]);
  });

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
  if (damage >= playerOrMonster.health + playerOrMonster.shield) {
    playerOrMonster.health -= damage - playerOrMonster.shield;
    playerOrMonster.isAlive = false;
  } else if (damage > playerOrMonster.shield) {
    playerOrMonster.health -= damage - playerOrMonster.shield;
  }
};

/* --------------------------------------------------------- Heal a player ------------------------------------------------------- */

export const healPlayer = (caster, player) => {
  if (player.health <= 0)
    throw alert(
      `${player.name} is dead. You can only save him with a resurrection spell`
    );

  let totalHealCounter = 0;

  const associatedDice = spells[caster.spell].actionDice;
  associatedDice.forEach((dieElement) => {
    totalHealCounter += throwDice(dice[dieElement]);
  });

  player.health += totalHealCounter;
  caster.mana -= spells[caster.spell].cost;
};

/* ------------------------------------------------------- Monster attack ------------------------------------------------------- */

// Faire un querySelectorAll de tous les ID de monstre pour obtenir tous ceux encore vivants
export const monsterAttack = () => {
  let allLivingMonsters = document.querySelectorAll(".monster");
  let allLivingHeroes = document.querySelectorAll(".hero");

  //   Si je veux utiliser totalDistanceWithSelected, je dois faire une boucle où chaque monstre va être current-player
  allLivingMonsters.forEach((monster) => {
    // BOUCLE MONSTER
    let currentPlayer = document.querySelector(".current-player");
    currentPlayer.classList.remove("current-player");
    monster.classList.add("current-player");
    let monsterObject = monsters[document.querySelector(".current-player").id];
    // BOUCLE HERO
    allLivingHeroes.forEach((hero) => {
      hero.classList.add("is-selected");
      let heroObject = players[document.querySelector(".is-selected").id];
      // Pour chaque héro ciblé, à quelle distance du monstre est-il ?
      let distance = totalDistanceWithSelected();
      if (distance <= 1 && monsterObject.attackActionCount > 0) {
        receiveDamage(heroObject, weaponAttack(monsterObject));
        monsterObject.attackActionCount--;
      } else if (distance <= monsterObject.stepsCount) moveMonster(hero);
      if (heroObject.health <= 0) {
        // hero.id = "";
        // hero.classList.remove("is-selected");
        // hero.classList.remove("hero");
        // hero.classList.add("dead-body");
        heroObject.isAlive = false;
        hero.classList.add("to-delete");
      } else {
        hero.classList.remove("is-selected");
      }
    });
    monsterObject.attackActionCount++;
  });

  // Mettre à jour les héros morts après la boucle des monstres (sinon ça casse)
  const checkIfTHereAreDeadHeroes = (allLivingHeroes) => {
    allLivingHeroes.forEach((hero) => {
      return document.querySelector(".to-delete")
        ? document.querySelector(".to-delete")
        : false;
    });
  };

  // If true (il y a un héros mort)
  const removeDeadHeroes = (hero) => {
    if (hero === false) console.log("Nobody died!");
    else {
      hero.id = "";
      hero.classList.remove("is-selected");
      hero.classList.remove("hero");
      hero.classList.remove("to-delete");
      hero.classList.add("dead-body");
    }
  };

  removeDeadHeroes(checkIfTHereAreDeadHeroes(allLivingHeroes));

  // Retirer le statut de current player au dernier monstre et le réattribuer au maître du donjon
  let currentPlayer = document.querySelector(".current-player");
  currentPlayer.classList.remove("current-player");
  document.querySelector("#dungeonMaster").classList.add("current-player");
};

/* ---------------------------------------------------- Monster auto motion ----------------------------------------------------- */

//  Il faut l'amener sur une case adjacente, mais bien vérifier que la case adjacente choisie n'est pas déjà occupée où n'est pas un mur, un coffre, un pillar
// Si toutes les cases adjacentes sont occupées, il faut l'amener sur une case à 2 de distance en vérifiant les mêmes choses
// Il faut donc faire une boucle, mais comment ????
// Et à la fin, bien sûr, enlever l'ID et la classe monster de la case précédente de laquelle le monstre est parti !
const moveMonster = (hero) => {
  // Pour déplacer le monstre, je pars de la position du hero vers lequel je me déplace
  // La position du hero est celle du selected player (on l'obtient dans la fonction d'attaque)
  // [LOOP] Vérifier la disponibilitié de toutes les cases adjacentes (x+1 / x-1 / y+1 / y-1) --> c'est-à-dire la case n'a pas d'ID de joueur et n'a pas de class chest, wall ou pillar
  // Dès que une case est libre, j'y déplace le monstre, avec son ID et sa classe monster, je suppprime son ID et sa classe monster de l'autre case
  // (ET JE DECOMPTE SES STEPS AFIN QU'IL NE BOUGE PAS 30 FOIS)
  // ELSE - [LOOP] Si aucune case n'est libre, je vérifie la disponibilité de toutes les cases autour (x+2 / x-2 / y+2 / y-2)
  // Dès que une case est libre, -- même chose que 2 lignes plus haut
  // Si à ce moment-là aucune case n'est libre, je choisis de laisser le monstre sur place
};

/* ------------------------------------------------------- Speciall spells ------------------------------------------------------- */

// Il faudra préparer les fonctions d'exécution pour le sort dismiss undeads et les sorts de découverte et de désomarçage de piège

/* ---------------------------------------------------- Open chests (search) ----------------------------------------------------- */

// Il faudra préparer la fonction qui retourne un objet random parmi les weapons et spells dans l'inventaire de la personne (et check si inventaire capacity is full)
