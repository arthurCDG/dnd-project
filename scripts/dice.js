export const dice = {
  yellowDie: [
    { number: 0, img: "../img/dice-images/0_0.png" },
    { number: 1, img: "../img/dice-images/0_1.png" },
    { number: 0, img: "../img/dice-images/0_2.png" },
    { number: 1, img: "../img/dice-images/0_3.png" },
    { number: 1, img: "../img/dice-images/0_4.png" },
    { number: 1, img: "../img/dice-images/0_5.png" },
  ],
  orangeDie: [
    { number: 1, img: "../img/dice-images/1_0.png" },
    { number: 2, img: "../img/dice-images/1_1.png" },
    { number: 1, img: "../img/dice-images/1_2.png" },
    { number: 2, img: "../img/dice-images/1_3.png" },
    { number: 1, img: "../img/dice-images/1_4.png" },
    { number: 1, img: "../img/dice-images/1_5.png" },
  ],
  redDie: [
    { number: 3, img: "../img/dice-images/3_0.png" },
    { number: 0, img: "../img/dice-images/3_1.png" },
    { number: 3, img: "../img/dice-images/3_2.png" },
    { number: 2, img: "../img/dice-images/3_3.png" },
    { number: 2, img: "../img/dice-images/3_4.png" },
    { number: 2, img: "../img/dice-images/3_5.png" },
  ],
  purpleDie: [
    { number: 2, img: "../img/dice-images/2_0.png" },
    { number: 3, img: "../img/dice-images/2_1.png" },
    { number: 3, img: "../img/dice-images/2_2.png" },
    { number: 3, img: "../img/dice-images/2_3.png" },
    { number: 2, img: "../img/dice-images/2_4.png" },
    { number: 2, img: "../img/dice-images/2_5.png" },
  ],
  starDie: [
    { number: 1, img: "../img/dice-images/4_0.png" },
    { number: 0, img: "../img/dice-images/4_1.png" },
    { number: 1, img: "../img/dice-images/4_2.png" },
    { number: 0, img: "../img/dice-images/4_3.png" },
    { number: 1, img: "../img/dice-images/4_4.png" },
    { number: 0, img: "../img/dice-images/4_5.png" },
  ],
  discoverTrapsDie: [
    { number: 1, img: "../img/dice-images/7_0.png" },
    { number: 2, img: "../img/dice-images/7_1.png" },
    { number: 0, img: "../img/dice-images/7_2.png" },
    { number: 0, img: "../img/dice-images/7_5.png" },
    { number: 1, img: "../img/dice-images/7_4.png" },
    { number: 0, img: "../img/dice-images/7_5.png" },
  ],
  dismissTrapsDie: [
    { number: 1, img: "../img/dice-images/6_0.png" },
    { number: 0, img: "../img/dice-images/6_1.png" },
    { number: 1, img: "../img/dice-images/6_2.png" },
    { number: 1, img: "../img/dice-images/6_5.png" },
    { number: 1, img: "../img/dice-images/6_4.png" },
    { number: 1, img: "../img/dice-images/6_5.png" },
  ],
  dismissUndeadsDie: [
    { number: 0, img: "../img/dice-images/5_0.png" },
    { number: 2, img: "../img/dice-images/5_1.png" },
    { number: 1, img: "../img/dice-images/5_2.png" },
    { number: 3, img: "../img/dice-images/5_5.png" },
    { number: 0, img: "../img/dice-images/5_4.png" },
    { number: 0, img: "../img/dice-images/5_5.png" },
  ],
};

export const throwDice = (die) => {
  const randomIndex = Math.floor(Math.random() * 6);
  let diceImage = document.createElement("img");
  diceImage.src = die[randomIndex].img;
  diceImage.style.width = "60px";
  document.querySelector("#state").appendChild(diceImage);
  return die[randomIndex].number;
};
