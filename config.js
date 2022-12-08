const $ = (el) => document.querySelector(el); // shorthand for querySelector
const $$ = (el) => document.querySelectorAll(el); // shorthand for querySelectorAll

// GLOBAL VARIABLES //////////
let rowSize = 5;
let goalWord;
let message = "";
let guessWord = "";
let moves = 10;
let movesItTook = 0;
let moveBonus = 9;
let maxMoves = 20;
let score = 0;
let multiplier = 1;
let difficulty = null;
let isVictory = false;
// each character of the goalWord gets a variable for it's grid index
let goalChar0index,
  goalChar1index,
  goalChar2index,
  goalChar3index,
  goalChar4index;

function setDifficulty(string) {
  if (string === "easy") {
    moveBonus = 9;
    maxMoves = 20;
  } else if (string === "hard") {
    moveBonus = 7;
    maxMoves = 10;
  } else {
    string = 'normal';
    moveBonus = 8;
    maxMoves = 15;
  }
  difficulty = string;
  
  $('body').classList.remove('.easy-bg', 'normal-bg', 'hard-bg');
  $('body').classList.add(`${string}-bg`);
  $$('.difficulty h3').forEach(el => el.classList.remove('selected-btn'));
  $(`.${string}-btn`).classList.add('selected-btn');
  $$('.game-view *').forEach(el => el.classList.remove('easy', 'normal', 'hard'));
  $('.very-top').classList.add(string);
  $('.hud').classList.add(string);
  string = string.charAt(0).toUpperCase() + string.slice(1);
  $('.current-difficulty').innerText = string;
}

function reset() {
  goalWord = null;
  message = "";
  guessWord = "";
  moves = 10;
  movesItTook = 0;
  score = 0;
  multiplier = 1;
  isVictory = false;
  $(".banner").classList.add("hidden");
  updateHUD();
}
