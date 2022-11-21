const $ = el => document.querySelector(el);
let pointA, pointAText, pointB, pointBText;
// on drag, the variables pointA(i.e., the element)
// and pointAText(i.e., the element's innerText) are stored
const drag = (e) => {
  pointA = e.target;
  pointAText = e.target.innerText;
}
const allowDrop = (e) => e.preventDefault();
// on drop, pointB and pointBText are stored
// then, each element's innertext is swapped with the stored text
const drop = (e) => {
  pointB = e.target;
  pointBText = e.target.innerText;

  pointA.innerText = pointBText;
  pointB.innerText = pointAText;
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
    ZZZ`.replace(/\s+/g, ''); // this is a regEx that removes any whitespace
  let index;
  index = Math.floor(Math.random() * letterBag.length);
  return letterBag.charAt(index);
}

let getRandomGridIndex = () => Math.round(Math.random() * Math.pow(rowSize, 2));
const rowSize = 5;
let goalWord = 'BUILD';
let firstPosition = getRandomGridIndex();
let secondPosition = getRandomGridIndex();
let thirdPosition = getRandomGridIndex();
let fourthPosition = getRandomGridIndex();
let fifthPosition = getRandomGridIndex();

// this painfully ensures that each position is unique -_-
if(
  secondPosition === firstPosition ||
  isNaN(secondPosition)
) secondPosition = getRandomGridIndex();
if(
  thirdPosition === firstPosition ||
  thirdPosition === secondPosition ||
  isNaN(thirdPosition)
) thirdPosition = getRandomGridIndex();
if(
  fourthPosition === firstPosition ||
  fourthPosition === secondPosition ||
  fourthPosition === thirdPosition ||
  isNaN(fourthPosition)
) fourthPosition = getRandomGridIndex;
if(
  fifthPosition === firstPosition ||
  fifthPosition === secondPosition ||
  fifthPosition === thirdPosition ||
  fifthPosition === fourthPosition ||
  isNaN(fifthPosition)
) fifthPosition = getRandomGridIndex;

console.log(firstPosition, secondPosition, thirdPosition, fourthPosition, fifthPosition);

for(i = 0; i < Math.pow(rowSize, 2); i++) {
  let el = document.createElement('button');
  let letter = getRandomLetter();

  if(i === firstPosition) letter = goalWord.charAt(0);
  if(letter === goalWord.charAt(0)) el.dataset.piece = 0;

  if(i === secondPosition) letter = goalWord.charAt(1);
  if(letter === goalWord.charAt(1)) el.dataset.piece = 1;

  if(i === thirdPosition) letter = goalWord.charAt(2);
  if(letter === goalWord.charAt(2)) el.dataset.piece = 2;

  if(i === fourthPosition) letter = goalWord.charAt(3);
  if(letter === goalWord.charAt(3)) el.dataset.piece = 3;

  if(i === fifthPosition) letter = goalWord.charAt(4);
  if(letter === goalWord.charAt(4)) el.dataset.piece = 4;

  el.innerText = letter;
  el.classList.add('grid-item', 'btn', 'cell');
  el.setAttribute('draggable', true);
  el.setAttribute('ondragstart', 'drag(event)');
  el.setAttribute('ondragover', 'allowDrop(event)');
  el.setAttribute('ondrop', 'drop(event)');
  // the gridx position of an element is the remainder of i / 5
  el.dataset.gridx = i % rowSize;
  el.dataset.gridy = Math.floor(i / rowSize);
  $('.grid').appendChild(el);
}

let evaluate = () => {
  document.querySelectorAll('.cell').forEach((cell) => {
    if(!cell.dataset.piece) return;
    let gridx = parseInt(cell.dataset.gridx);
    let gridy = parseInt(cell.dataset.gridy);
    let cellAbove, cellToRight, cellBelow, cellToLeft;
    gridy === 0
      ? cellAbove = null
      : cellAbove = $(`[data-gridx="${gridx}"][data-gridy="${gridy-1}"]`);
      
    gridx === rowSize-1
      ? cellToRight = null
      : cellToRight = $(`[data-gridx="${gridx+1}"][data-gridy="${gridy}"]`);

    gridy === rowSize-1
      ? cellBelow = null
      : cellBelow = $(`[data-gridx="${gridx}"][data-gridy="${gridy+1}"]`);

    gridx === rowSize-1
      ? cellToLeft = null
      : cellToLeft = $(`[data-gridx="${gridx-1}"][data-gridy="${gridy}"]`);

    if(cellAbove && cellAbove.dataset.piece) {
      if(parseInt(cellAbove.dataset.piece) === parseInt(cell.dataset.piece) -1) {
        cell.classList.add('green');
        cellToRight.classList.add('green');
      }
    }
  })
}