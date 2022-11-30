const $ = (el) => document.querySelector(el); // shorthand for querySelector
const $$ = (el) => document.querySelectorAll(el); // shorthand for querySelectorAll

// GLOBAL VARIABLES //////////
let rowSize = 5;
let goalWord;
let moves = 10;
let movesItTook = 0;
let moveBonus = 9;
let maxMoves = 25;
let score = 0;
let message = '';
// each character of the goalWord gets a variable for it's grid index
let goalChar0index,
  goalChar1index,
  goalChar2index,
  goalChar3index,
  goalChar4index;

// UTILITY FUNCS //////////
(function buildGrid() {
  for (i = 0; i < 25; i++) {
    let elContainer = document.createElement("div");
    let el = document.createElement("button");
    // the gridx position of an element is the remainder of i / 5
    elContainer.dataset.gridx = i % rowSize;
    elContainer.dataset.gridy = Math.floor(i / rowSize);
    elContainer.classList.add("grid-item");
    elContainer.appendChild(el);
    $(".grid").appendChild(elContainer);
    el.classList.add("btn", "cell");
    el.addEventListener("click", (e) => {
      e.target.classList.toggle("selected");
      swap();
    });
  }
})();

function getRandomLetter() {
  let index = Math.floor(Math.random() * letterBag.length);
  return letterBag.charAt(index);
}

function getRandomGridIndex() {
  return Math.floor(Math.random() * Math.pow(rowSize, 2));
}

function setRandomGoalWord() {
  let goalWordIndex = Math.floor(Math.random() * words.length);
  goalWord = words[goalWordIndex].toUpperCase();
}

// this painfully ensures that each position is unique -_-
function setGoalCharIndexes() {
  goalChar0index = getRandomGridIndex();
  while (!goalChar1index || goalChar1index === goalChar0index)
    goalChar1index = getRandomGridIndex();
  while (
    !goalChar2index ||
    goalChar2index === goalChar0index ||
    goalChar2index === goalChar1index
  )
    goalChar2index = getRandomGridIndex();
  while (
    !goalChar3index ||
    goalChar3index === goalChar0index ||
    goalChar3index === goalChar1index ||
    goalChar3index === goalChar2index
  )
    goalChar3index = getRandomGridIndex();
  while (
    !goalChar4index ||
    goalChar4index === goalChar0index ||
    goalChar4index === goalChar1index ||
    goalChar4index === goalChar2index ||
    goalChar4index === goalChar3index
  )
    goalChar4index = getRandomGridIndex();
}

function setGridLetters() {
  $$(".cell").forEach((cell, i) => {
    let letter = getRandomLetter();
    if (i === goalChar0index) {
      letter = goalWord.charAt(0);
    } else if (i === goalChar1index) {
      letter = goalWord.charAt(1);
    } else if (i === goalChar2index) {
      letter = goalWord.charAt(2);
    } else if (i === goalChar3index) {
      letter = goalWord.charAt(3);
    } else if (i === goalChar4index) {
      letter = goalWord.charAt(4);
    }

    let indexOfLetter = goalWord.indexOf(letter);
    cell.innerText = letter;
    cell.dataset.piece = indexOfLetter + 1;
  });
}

let swap = () => {
  let selections = $$(".selected");
  if (selections.length === 2) {
    navigator.vibrate(25);
    let pointA = selections[0];
    let pointB = selections[1];
    let pointAParent = pointA.parentElement;
    let pointBParent = pointB.parentElement;

    pointAParent.appendChild(pointB);
    pointBParent.appendChild(pointA);
    pointA.classList.remove("selected");
    pointB.classList.remove("selected");
    colorize();
    evaluate();
  } else {
    navigator.vibrate(15);
  }
};

let colorize = () => {
  document.querySelectorAll(".cell").forEach((cell) => {
    let gridx = parseInt(cell.parentElement.dataset.gridx);
    let gridy = parseInt(cell.parentElement.dataset.gridy);
    let cellLetter = cell.innerText;
    let letter0 = goalWord.charAt(0);
    let letter1 = goalWord.charAt(1);
    let letter2 = goalWord.charAt(2);
    let letter3 = goalWord.charAt(3);
    let letter4 = goalWord.charAt(4);
    let cellLeft, cellLeftLetter;

    if (gridx === 0) {
      cellLeftLetter = null;
    } else {
      cellLeft = $(`[data-gridx="${gridx - 1}"][data-gridy="${gridy}"] .cell`);
      cellLeftLetter = cellLeft.innerText;
    }

    cell.classList.remove("green", "yellow");

    if (
      (cellLeftLetter === letter0 && cellLetter === letter1) ||
      (cellLeftLetter === letter1 && cellLetter === letter2) ||
      (cellLeftLetter === letter2 && cellLetter === letter3) ||
      (cellLeftLetter === letter3 && cellLetter === letter4)
    ) {
      cell.classList.add("green");
      cellLeft.classList.add("green");
    } else if (
      goalWord.indexOf(cellLetter) > -1 &&
      goalWord.indexOf(cellLeftLetter) > -1
    ) {
      cell.classList.add("yellow");
      if (cellLeft) cellLeft.classList.add("yellow");
    }
  });
};

let evaluate = () => {
  let isVictory = false;
  for (i = 0; i < 5; i++) {
    let rowString = "";
    for (ii = 0; ii < 5; ii++) {
      rowString += $(`[data-gridy="${i}"][data-gridx="${ii}"] .cell`).innerText;
    }
    if (rowString === goalWord) {
      isVictory = true;
      break;
    }
  }

  if (isVictory) {
    moves += moveBonus;
    if (moves > maxMoves) {
      moves = maxMoves;
      message = "bonus"
      score += 100;
    } else {
      message = "victory"
    }
    say(message);
    score += Math.round(500 / movesItTook);
    movesItTook = 0;
    updateHUD();
    dealEm();
    console.log('moves: ', moves, '\nscore: ', score)
  } else {
    moves--;
    movesItTook++;
    updateHUD();
    console.log('moves: ', moves, '\nscore: ', score)
    if (moves < 1) {
      gameOver();
      console.log("moves: ", moves);
    }
  }
};

function say(message) {
  $('.banner-text').classList.remove('hidden');
  if (message === "victory") {
    $('.banner-text').innerText = goalWord + '!!!' + '😀';
  }
  else if(message === "bonus") {
    $('.banner-text').innerText =
      `${goalWord}!!!!!
        MOVE MAX-OUT BONUS!!! +100 POINTS 😱`
  }
  setTimeout(()=>{$('.banner-text').classList.add('hidden')}, 4000);
}

function updateHUD() {
  $(".moves").innerText = moves;
  $(".score").innerText = score;
}

function dealEm() {
  setRandomGoalWord();
  setGoalCharIndexes();
  setGridLetters();
  colorize();

  console.log(goalWord);
  console.log(
    goalChar0index,
    goalChar1index,
    goalChar2index,
    goalChar3index,
    goalChar4index
  );
}

function gameOver() {
  let response = confirm(
    `GAME OVER
    Final Score: ${$(".score").innerText}
    
    The word was "${goalWord}"
    Play Again?`
  );
  if (response) startGame();
}

function startGame() {
  moves = 10;
  score = 0;
  updateHUD();
  dealEm();
}
startGame();
