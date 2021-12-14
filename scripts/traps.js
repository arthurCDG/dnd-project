import { dice, throwDice } from "./dice.js";

export const traps = {
  // Will remove 1LP from the player health
  hole: 1,
  // Will remove 1LP to all players and monsters in the room (except undeads) ---> Mais pour l'instant ça ne fera qu'enlever 2LP à un joueur parce qu'on en a gros bon sang ...
  fireball: 2,
  // Will remove the result of throwing two yellow dices from the player health
  poisonedTrap: () => {
    const first_die = throwDice(dice.yellowDie);
    const second_die = throwDice(dice.yellowDie);
    return first_die + second_die;
  },
};
