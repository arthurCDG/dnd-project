export const dice = {
  yellowDie: [0, 0, 0, 1, 1, 1],
  orangeDie: [0, 0, 1, 1, 2, 2],
  redDie: [0, 1, 2, 2, 3, 3],
  purpleDie: [1, 2, 2, 3, 3, 3],
  starDie: [0, 0, 0, 1, 1, 1],
  discoverTrapsDie: [0, 0, 1, 1, 2, 2],
  dismissTrapsDie: [0, 0, 1, 1, 2, 2],
  dismissUndeadsDie: [0, 0, 1, 1, 2, 2],
};

export const throwDice = (die) => {
  const randomIndex = Math.floor(Math.random() * 6);
  return die[randomIndex];
};
