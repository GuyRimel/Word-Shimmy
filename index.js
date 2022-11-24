const $ = (el) => document.querySelector(el);

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
let goalWordIndex = Math.floor(Math.random() * words.length);
let goalWord = words[goalWordIndex].toUpperCase(); // set the goalword

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

console.log(goalWord);
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
  let selections = document.querySelectorAll('.selected');
  if(selections.length === 2) {
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
    pointA.style.transform = 'none';
    evaluate();
  } 
}

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

    if(document.querySelectorAll(`[data-gridy="${gridy}"] .cell.green`).length !== 5) {
        if(gridx + gridy === 8)$('.score').innerText = parseInt($('.score').innerText) - 10;
      } else {
        $('.score').innerText = parseInt($('.score').innerText);
        alert(goalWord + '!!!');
      }
  });
};

evaluate();
