export const dice = {
  yellowDie: [0, 0, 1, 1, 1, 1],
  orangeDie: [1, 2, 1, 2, 1, 1],
  redDie: [3, 0, 1, 2, 2, 2],
  purpleDie: [2, 3, 2, 3, 2, 2],
  starDie: [0, 0, 0, 1, 1, 1],
  discoverTrapsDie: [1, 2, 0, 0, 1, 0],
  dismissTrapsDie: [0, 1, 1, 1, 1, 1],
  dismissUndeadsDie: [0, 2, 1, 3, 0, 0],
};

export const throwDice = (die) => {
  const randomIndex = Math.floor(Math.random() * 6);
  return die[randomIndex];
};
