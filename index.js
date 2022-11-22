const $ = el => document.querySelector(el);
let pointA, pointB, pointAParent, pointBParent;
// on drag, the dragging element is stored as pointA
const drag = (e) => {
  pointA = e.target;
  pointAParent = pointA.parentElement;
}
const allowDrop = (e) => e.preventDefault();
// on drop, the element being dropped onto is stored as pointB
// then, each element is swapped
const drop = (e) => {
  pointB = e.target;
  pointBParent = pointB.parentElement;
  pointAParent.appendChild(pointB);
  pointBParent.appendChild(pointA);
  evaluate();
}
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
    ZZ`.replace(/\s+/g, ''); // this is a regEx that removes any whitespace
  let index;
  index = Math.floor(Math.random() * letterBag.length);
  return letterBag.charAt(index);
}

let getRandomGridIndex = () => Math.floor(Math.random() * 25);
const rowSize = 5;
let goalWord = 'BUILD';
let firstPosition = getRandomGridIndex();
let secondPosition = getRandomGridIndex();
let thirdPosition = getRandomGridIndex();
let fourthPosition = getRandomGridIndex();
let fifthPosition = getRandomGridIndex();

// this painfully ensures that each position is unique -_-
if(
  secondPosition === firstPosition
) secondPosition = getRandomGridIndex();
if(
  thirdPosition === firstPosition ||
  thirdPosition === secondPosition
) thirdPosition = getRandomGridIndex();
if(
  fourthPosition === firstPosition ||
  fourthPosition === secondPosition ||
  fourthPosition === thirdPosition
) fourthPosition = getRandomGridIndex;
if(
  fifthPosition === firstPosition ||
  fifthPosition === secondPosition ||
  fifthPosition === thirdPosition ||
  fifthPosition === fourthPosition
) fifthPosition = getRandomGridIndex;

console.log(firstPosition, secondPosition, thirdPosition, fourthPosition, fifthPosition);

for(i = 0; i < Math.pow(rowSize, 2); i++) {
  let elContainer = document.createElement('div');
  let el = document.createElement('button');
  let letter = getRandomLetter();

  if(i === firstPosition) {
    letter = goalWord.charAt(0);
    el.dataset.piece = 1;
  } else if(i === secondPosition) {
    letter = goalWord.charAt(1);
    el.dataset.piece = 2;
  } else if(i === thirdPosition) {
    letter = goalWord.charAt(2);
    el.dataset.piece = 3;
  } else if(i === fourthPosition) {
    letter = goalWord.charAt(3);
    el.dataset.piece = 4;
  } else if(i === fifthPosition) {
    letter = goalWord.charAt(4);
    el.dataset.piece = 5;
  } else {
    el.dataset.piece = 0;
  }

  el.innerText = letter;
  el.classList.add('btn', 'cell');
  el.setAttribute('draggable', true);
  el.setAttribute('ondragstart', 'drag(event)');
  el.setAttribute('ondragover', 'allowDrop(event)');
  el.setAttribute('ondrop', 'drop(event)');
  // the gridx position of an element is the remainder of i / 5
  elContainer.dataset.gridx = i % rowSize;
  elContainer.dataset.gridy = Math.floor(i / rowSize);
  elContainer.classList.add('grid-item')
  elContainer.appendChild(el);
  $('.grid').appendChild(elContainer);
}

let evaluate = () => {
  document.querySelectorAll('.cell').forEach((cell) => {
    cell.classList.remove('green', 'yellow');
    let gridx = parseInt(cell.dataset.gridx);
    let gridy = parseInt(cell.dataset.gridy);
    let piece = parseInt(cell.dataset.piece); // if piece === 0, it's treated as "false"
    let cellToRight, cellBelow;
    (gridy === (rowSize - 1))
      ? cellBelow = null
      : cellBelow = $(`[data-gridx="${gridx}"][data-gridy="${gridy+1}"]`);

      if(cellBelow === null) return
      else if(!piece || !parseInt(cellBelow.dataset.piece)) return
      else {
        cell.classList.add('green');
      }
  })
}