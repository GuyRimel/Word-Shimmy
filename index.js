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
    el.classList.add("cell");
    el.addEventListener("click", (e) => {
      swap(e.target);
    });
    $(".grid").appendChild(elContainer);
  }
  let skipBtn = document.createElement('button');
  let burnBtn = document.createElement('button');
  let xupBtn = document.createElement('button');
  let guessBtn = document.createElement('button');
  
  skipBtn.innerText = 'Skip';
  skipBtn.classList.add('btn', 'skip-btn');
  skipBtn.addEventListener('click', skip);
  burnBtn.innerText = 'Burn';
  burnBtn.classList.add('btn', 'burn-btn');
  burnBtn.addEventListener('click', burn);
  xupBtn.innerText = 'X-Up';
  xupBtn.classList.add('btn', 'xup-btn', 'disabled');
  xupBtn.addEventListener('click', xup);
  guessBtn.innerText = 'Guess';
  guessBtn.classList.add('btn', 'guess-btn');
  guessBtn.addEventListener('click', guess);
  $(".grid").appendChild(skipBtn);
  $(".grid").appendChild(burnBtn);
  $(".grid").appendChild(xupBtn);
  $(".grid").appendChild(guessBtn);
})();

function skip() {
  message = "skipped";
  say(message);
  evaluate();
  dealEm();
  clearSelections();
}

function burn() {
  $('.burn-btn').classList.add('disabled');
  $$('.cell').forEach(cell => {
    cell.classList.add('burn');
  });
  message = 'burn';
  colorize();
  moves -= 5;
  updateHUD();
}

function xup() {
  $('.xup-btn').classList.add('disabled');
  multiplier += 3;
  updateHUD();
}

function guess() {
  guessWord = prompt("The word is...", "");
  if(!guessWord) return;
  else if(guessWord.toUpperCase() === goalWord) {
    isVictory = true;
  }
  evaluate();
  clearSelections();
}

function clearSelections() {
  let selections = $$(".selected");
  selections.forEach((selection)=> selection.classList.remove('selected'));
}

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

function swap(target) {
  target.classList.toggle("selected");
  let selections = $$(".selected");
  if (selections.length >= 2) {
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
  }
}

function colorize() {
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

    cell.classList.remove("green", "yellow", "orange");

    if(message == 'burn' && goalWord.indexOf(cellLetter) !== -1) cell.classList.add('orange');
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
}

function evaluate() {
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
    streak++;
    console.log(streak, (streak % 3));
    if(streak % 2 === 0) $('.burn-btn').classList.remove('disabled');
    if(streak % 3 === 0) $('.xup-btn').classList.remove('disabled');
    moves += moveBonus;
    if (moves >= maxMoves) {
      moves = maxMoves;
      message = "max moves";
      multiplier++;
    } else {
      message = "victory";
    }
    say(message);
    dealEm();
    roundScore = Math.round((500 / movesItTook) * multiplier);
    score += roundScore;
    movesItTook = 1;
  } else {
    moves--;
    movesItTook++;
    roundScore = Math.round((500 / movesItTook) * multiplier);
    if (moves < 1) {
      gameOver();
    }
  }
  updateHUD();
}

function say(message) {
  $(".banner").classList.remove("hidden");
  $(".banner-text-bottom").innerText = `* ${goalWord} *`;
  
  if (message === "bonus streak") {
    $(".banner-text-top").innerHTML =
    `😆 BONUS STREEEAK<span class="yellow-text"> x ${multiplier}!</span>`;
  } else if (message === "bonus") {
    $(".banner-text-top").innerHTML = `😀 BONUS<span class="yellow-text"> x ${multiplier}!</span>`;
  }
  if (message === "victory") {
    $(".banner-text-top").innerHTML = "Nice! 🙂";
  }
  if(message === "skipped") {
    $(".banner-text-top").innerHTML = "Skipped 😣";
  }
}

function updateHUD() {
  $(".moves").innerText = moves;
  $(".score").innerText = score;
  $(".round-score").innerText = roundScore;
  $(".multiplier").innerText = multiplier;
  if (movesItTook >= 1) {
    $(".banner").classList.add("hidden");
  }
}

function removeBurns() {
  $$('.cell').forEach(cell => cell.classList.remove('burn'))
}

function dealEm() {
  updateHUD();
  setRandomGoalWord();
  setGoalCharIndexes();
  setGridLetters();
  removeBurns();
  colorize();
  isVictory = false;

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
  $('.game-view').classList.remove('display-none');
  $('.menu-view').classList.add('display-none');
  setDifficulty(difficulty);
  reset();
  dealEm();
}

function quit() {
  $('.game-view').classList.add('display-none');
  $('.menu-view').classList.remove('display-none');
}

function rules() {
  alert('there are no rules yet O_O !');
}

function highScores() {
  alert('there are no high scores yet O_O !');
}