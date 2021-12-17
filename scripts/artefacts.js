export const artefacts = {
  true_seeing_orb: {
    name: "True Seeing Orb",
    action: () => {
      document.querySelectorAll(".active-hole-trap").forEach((trap) => {
        trap.classList.add("visible-trap");
      });
      document.querySelectorAll(".active-fireball-trap").forEach((trap) => {
        trap.classList.add("visible-trap");
      });
      document.querySelectorAll(".active-poison-trap").forEach((trap) => {
        trap.classList.add("visible-trap");
      });
    },
    img: "../img/game_cards/true_seeing_orb.png",
  },
  elven_mirror_shield: {
    name: "Elven Mirror Shield",
    action: "",
    img: "../img/game_cards/true_seeing_orb.png",
  },
  moshuga_turtle_shield: {
    name: "Moshuga Turtle Shield",
    action: "",
    img: "../img/game_cards/true_seeing_orb.png",
  },
};
