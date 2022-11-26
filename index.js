const $ = (el) => document.querySelector(el); // shorthand for querySelector
const $$ = (el) => document.querySelectorAll(el); // shorthand for querySelectorAll

// GLOBAL VARIABLES //////////
let rowSize = 5;
let goalWord;
// each character of the goalWord gets a variable for it's grid index
let goalChar0index, goalChar1index, goalChar2index, goalChar3index, goalChar4index; 

// UTILITY FUNCS //////////
(function buildGrid() {
  for (i = 0; i < Math.pow(rowSize, 2); i++) {
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
};

function getRandomGridIndex() {
  return Math.floor(Math.random() * Math.pow(rowSize, 2));
};

function setRandomGoalWord() {
  let goalWordIndex = Math.floor(Math.random() * words.length);
  goalWord = words[goalWordIndex].toUpperCase();
}

// this painfully ensures that each position is unique -_-
function setGoalCharIndexes() {
  goalChar0index = getRandomGridIndex();
  while (
    !goalChar1index ||
    goalChar1index === goalChar0index
    ) goalChar1index = getRandomGridIndex();
    while (
      !goalChar2index ||
    goalChar2index === goalChar0index ||
    goalChar2index === goalChar1index
    ) goalChar2index = getRandomGridIndex();
    while (
      !goalChar3index ||
    goalChar3index === goalChar0index ||
    goalChar3index === goalChar1index ||
    goalChar3index === goalChar2index
    ) goalChar3index = getRandomGridIndex();
    while (
      !goalChar4index ||
      goalChar4index === goalChar0index ||
      goalChar4index === goalChar1index ||
      goalChar4index === goalChar2index ||
    goalChar4index === goalChar3index
  ) goalChar4index = getRandomGridIndex();
};

function setGridLetters() {
  $$('.cell').forEach((cell, i) => {
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
  })
}

let swap = () => {
  let selections = $$(".selected");
  if (selections.length === 2) {
    let pointA = selections[0];
    let pointB = selections[1];
    let pointAParent = pointA.parentElement;
    let pointBParent = pointB.parentElement;
    let Ax = pointA.getBoundingClientRect().x;
    let Ay = pointA.getBoundingClientRect().y;
    let Bx = pointB.getBoundingClientRect().x;
    let By = pointB.getBoundingClientRect().y;
    let movex = Bx - Ax;
    let movey = By - Ay;
    
    // console.log(Ax, Ay, Bx, By);
    
    pointAParent.appendChild(pointB);
    pointBParent.appendChild(pointA);
    pointA.classList.remove("selected");
    pointB.classList.remove("selected");
    void pointA.offsetWidth;
    pointA.style.transform = `translate(${movex}px,${movey}px)`;
    void pointA.offsetWidth;
    pointA.style.transform = "none";
    evaluate();
  }
};

function dealEm(){
  setRandomGoalWord();
  setGoalCharIndexes();
  setGridLetters();
}

dealEm();

console.log(goalWord);
console.log(goalChar0index, goalChar1index, goalChar2index, goalChar3index, goalChar4index);

let evaluate = () => {
  document.querySelectorAll(".cell").forEach((cell) => {
    let gridx = parseInt(cell.parentElement.dataset.gridx);
    let gridy = parseInt(cell.parentElement.dataset.gridy);
    let piece = parseInt(cell.dataset.piece); // if piece === 0, it's treated as "false"
    let cellLeft, cellLeftPiece;
    if (gridx === 0) {
      cellLeft = null;
      cellLeftPiece = null;
    } else {
      cellLeft = $(`[data-gridx="${gridx - 1}"][data-gridy="${gridy}"] .cell`);
      cellLeftPiece = parseInt(cellLeft.dataset.piece);
    }

    // console.log(
    //   'cell:',cell.innerText, gridx, gridy,
    //   '\ncellLeft:','cellLeft?:',Boolean(cellLeft)
    //   )

    cell.classList.remove("green", "yellow");

    if (piece && cellLeftPiece) {
      cell.classList.add("yellow");
      cellLeft.classList.add("yellow");
    }
    if (piece && cellLeftPiece && piece === cellLeftPiece + 1) {
      cell.classList.remove("yellow");
      cellLeft.classList.remove("yellow");
      cell.classList.add("green");
      cellLeft.classList.add("green");
    }

    if (
      document.querySelectorAll(`[data-gridy="${gridy}"] .cell.green`)
        .length !== 5
    ) {
      if (gridx + gridy === 8)
        $(".score").innerText = parseInt($(".score").innerText) - 10;
    } else {
      $(".score").innerText = parseInt($(".score").innerText);
      alert(goalWord + "!!!");
    }
  });
};

evaluate();
