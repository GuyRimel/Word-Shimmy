const $ = (el) => document.querySelector(el);
let pointA, pointB, pointAParent, pointBParent;
// on drag, the dragging element is stored as pointA
const drag = (e) => {
  pointA = e.target;
  pointAParent = pointA.parentElement;
  pointA.classList.add("dragging");
};
const allowDrop = (e) => e.preventDefault();
// on drop, the element being dropped onto is stored as pointB
// then, each element is swapped
const drop = (e) => {
  pointB = e.target;
  pointBParent = pointB.parentElement;
  pointAParent.appendChild(pointB);
  pointBParent.appendChild(pointA);
  pointA.classList.remove("dragging", "dragover");
  pointB.classList.remove("dragging", "dragover");
  evaluate();
};
let getRandomLetter = () => {
  let letterBag = `
    AAAAAAAAAA
    BB
    CCC
    DDD
    EEEEEEEEEE
    FF
    GG
    HHH
    IIIIIIII
    JJ
    KK
    LLLLLL
    MMM
    NNNNNN
    OOOOOOOO
    PPPP
    QQ
    RRRRRRRR
    SSSSSSSS
    TTTTTTTT
    UUUUUU
    VVV
    WW
    XX
    YYYYY
    ZZ`.replace(/\s+/g, ""); // this is a regEx that removes any whitespace
  let index;
  index = Math.floor(Math.random() * letterBag.length);
  return letterBag.charAt(index);
};

let rowSize = 5;
let getRandomGridIndex = () => Math.floor(Math.random() * Math.pow(rowSize, 2));
let goalWord = "FEAST"; // set the goalword

// this painfully ensures that each position is unique -_-
let letter0 = getRandomGridIndex();
let letter1 = getRandomGridIndex();
let letter2 = getRandomGridIndex();
let letter3 = getRandomGridIndex();
let letter4 = getRandomGridIndex();
while (letter1 === letter0) letter1 = getRandomGridIndex();
while (letter2 === letter0 || letter2 === letter1)
  letter2 = getRandomGridIndex();
while (letter3 === letter0 || letter3 === letter1 || letter3 === letter2)
  letter3 = getRandomGridIndex();
while (
  letter4 === letter0 ||
  letter4 === letter1 ||
  letter4 === letter2 ||
  letter4 === letter3
)
  letter4 = getRandomGridIndex();

console.log(letter0, letter1, letter2, letter3, letter4);

for (i = 0; i < Math.pow(rowSize, 2); i++) {
  let elContainer = document.createElement("div");
  let el = document.createElement("button");
  let letter = getRandomLetter();

  if (i === letter0 || letter === goalWord.charAt(0)) {
    letter = goalWord.charAt(0);
    el.dataset.piece = 1;
  } else if (i === letter1 || letter === goalWord.charAt(1)) {
    letter = goalWord.charAt(1);
    el.dataset.piece = 2;
  } else if (i === letter2 || letter === goalWord.charAt(2)) {
    letter = goalWord.charAt(2);
    el.dataset.piece = 3;
  } else if (i === letter3 || letter === goalWord.charAt(3)) {
    letter = goalWord.charAt(3);
    el.dataset.piece = 4;
  } else if (i === letter4 || letter === goalWord.charAt(4)) {
    letter = goalWord.charAt(4);
    el.dataset.piece = 5;
  } else {
    el.dataset.piece = 0;
  }

  el.innerText = letter;
  el.classList.add("btn", "cell");
  el.setAttribute("draggable", true);
  el.setAttribute("ondragstart", "drag(event)");
  el.setAttribute("ondragover", "allowDrop(event)");
  el.setAttribute("ondrop", "drop(event)");
  el.addEventListener("dragover", (e) => {
    e.target.classList.add("dragover");
  });
  el.addEventListener("dragleave", (e) => {
    e.target.classList.remove("dragover");
  });
  // the gridx position of an element is the remainder of i / 5
  elContainer.dataset.gridx = i % rowSize;
  elContainer.dataset.gridy = Math.floor(i / rowSize);
  elContainer.classList.add("grid-item");
  elContainer.appendChild(el);
  $(".grid").appendChild(elContainer);
}

let evaluate = () => {
  document.querySelectorAll(".cell").forEach((cell) => {
    let gridx = parseInt(cell.parentElement.dataset.gridx);
    let gridy = parseInt(cell.parentElement.dataset.gridy);
    let piece = parseInt(cell.dataset.piece); // if piece === 0, it's treated as "false"
    let cellAbove, cellAbovePiece;
    if (gridy === 0) {
      cellAbove = null;
      cellAbovePiece = null;
    } else {
      cellAbove = $(`[data-gridx="${gridx}"][data-gridy="${gridy - 1}"] .cell`);
      cellAbovePiece = parseInt(cellAbove.dataset.piece);
    }

    console.log(
      'cell:',cell.innerText, gridx, gridy,
      '\ncellAbove:',cellAbove
      )
      
      
    cell.classList.remove("green", "yellow");
    
    if (piece && cellAbovePiece) {
      cell.classList.add("yellow");
      cellAbove.classList.add("yellow");
    }
    if (piece && cellAbovePiece && piece === cellAbovePiece + 1) {
      cell.classList.remove("yellow");
      cellAbove.classList.remove("yellow");
      cell.classList.add("green");
      cellAbove.classList.add("green");
    }
  });
};

evaluate();
