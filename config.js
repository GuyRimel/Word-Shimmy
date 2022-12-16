const $ = (el) => document.querySelector(el); // shorthand for querySelector
const $$ = (el) => document.querySelectorAll(el); // shorthand for querySelectorAll

// GLOBAL VARIABLES //////////
let rowSize = 5;
let goalWord;
let message = "";
let guessWord = "";
let moves = 10;
let movesItTook = 1;
let moveBonus = 9;
let maxMoves = 20;
let score = 0;
let roundScore = 500;
let multiplier = 1;
let streak = 0;
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
  string = string.charAt(0).toUpperCase() + string.slice(1);
  $('.current-difficulty').innerText = string;
  setColors();
}

function setColors() {
  $('body').classList.remove('.easy-bg', 'normal-bg', 'hard-bg');
  $('body').classList.add(`${difficulty}-bg`);
  $$('.difficulty h3').forEach(el => el.classList.remove('selected-btn'));
  $(`.${difficulty}-btn`).classList.add('selected-btn');
  $$('.game-view *').forEach(el => el.classList.remove('easy', 'normal', 'hard'));
  $('.very-top').classList.add(difficulty);
  $('.hud').classList.add(difficulty);
}

function reset() {
  goalWord = null;
  message = "";
  guessWord = "";
  moves = 10;
  movesItTook = 1;
  score = 0;
  roundScore = 500;
  multiplier = 1;
  streak = 0;
  isVictory = false;
  $(".banner").classList.add("hidden");
  updateHUD();
}

let wordShimmyData;
if(localStorage.getItem(wordShimmyData)) {
} else {
  wordShimmyData = {
    highScores: {
      easy: [0, 0, 0],
      normal: [0, 0, 0 ],
      hard: [0, 0, 0]
    }
  }
}
localStorage.setItem('wordShimmyData', JSON.stringify(wordShimmyData));