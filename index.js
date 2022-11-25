const $ = (el) => document.querySelector(el);

// set the rowSize //////////
let rowSize = 5;
let getRandomLetter = () => {
  let index = Math.floor(Math.random() * letterBag.length);
  return letterBag.charAt(index);
};

let getRandomGoalWord = () => {
  let goalWordIndex = Math.floor(Math.random() * words.length);
  return words[goalWordIndex].toUpperCase();
}

// set the goalword //////////
let goalWord =  getRandomGoalWord();

let getRandomGridIndex = () => Math.floor(Math.random() * Math.pow(rowSize, 2));

// each character of the goalWord get a variable
let goalChar0, goalChar1, goalChar2, goalChar3, goalChar4;

// this painfully ensures that each position is unique -_-
goalChar0 = getRandomGridIndex();
while (
  !goalChar1 ||
  goalChar1 === goalChar0
) goalChar1 = getRandomGridIndex();
while (
  !goalChar2 ||
  goalChar2 === goalChar0 ||
  goalChar2 === goalChar1
) goalChar2 = getRandomGridIndex();
while (
  !goalChar3 ||
  goalChar3 === goalChar0 ||
  goalChar3 === goalChar1 ||
  goalChar3 === goalChar2
) goalChar3 = getRandomGridIndex();
while (
  !goalChar4 ||
  goalChar4 === goalChar0 ||
  goalChar4 === goalChar1 ||
  goalChar4 === goalChar2 ||
  goalChar4 === goalChar3
)
  goalChar4 = getRandomGridIndex();

console.log(goalWord);
console.log(goalChar0, goalChar1, goalChar2, goalChar3, goalChar4);

for (i = 0; i < Math.pow(rowSize, 2); i++) {
  let elContainer = document.createElement("div");
  let el = document.createElement("button");
  let letter = getRandomLetter();

  if (i === goalChar0 || letter === goalWord.charAt(0)) {
    letter = goalWord.charAt(0);
    el.dataset.piece = 1;
  } else if (i === goalChar1 || letter === goalWord.charAt(1)) {
    letter = goalWord.charAt(1);
    el.dataset.piece = 2;
  } else if (i === goalChar2 || letter === goalWord.charAt(2)) {
    letter = goalWord.charAt(2);
    el.dataset.piece = 3;
  } else if (i === goalChar3 || letter === goalWord.charAt(3)) {
    letter = goalWord.charAt(3);
    el.dataset.piece = 4;
  } else if (i === goalChar4 || letter === goalWord.charAt(4)) {
    letter = goalWord.charAt(4);
    el.dataset.piece = 5;
  } else {
    el.dataset.piece = 0;
  }

  el.innerText = letter;
  el.classList.add("btn", "cell");
  el.addEventListener("click", (e) => {
    e.target.classList.toggle("selected");
    swap();
  });

  // the gridx position of an element is the remainder of i / 5
  elContainer.dataset.gridx = i % rowSize;
  elContainer.dataset.gridy = Math.floor(i / rowSize);
  elContainer.classList.add("grid-item");
  elContainer.appendChild(el);
  $(".grid").appendChild(elContainer);
}

let swap = () => {
  let selections = document.querySelectorAll(".selected");
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
