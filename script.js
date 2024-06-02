const gameContainer = document.querySelector(".game__container");
const cells = document.querySelectorAll(".cell");
const turnLabel = document.querySelector(".turn__label");

const XWins = document.querySelector(".X__wins");
const draw = document.querySelector(".draw");
const OWins = document.querySelector(".O__wins");

const startingStage = document.querySelector(".starting__window");
const winningStage = document.querySelector(".winning__window");
const restartStage = document.querySelector(".restart__window");
const overlay = document.querySelector(".overlay");

const vsPlayerBtn = document.querySelector(".vs__player");
const vsCpuBtn = document.querySelector(".vs__cpu");

const pickingMark = document.querySelector(".choosing__mark");
const XMark = document.querySelector(".X__mark");
const OMark = document.querySelector(".O__mark");

const restartBtn = document.querySelector(".restart__btn");
const newGameBtn = document.querySelector(".new__game");
const nextRoundBtn = document.querySelector(".continue__game");
const restartNoBtn = document.querySelector(".restart__no");
const restartYesBtn = document.querySelector(".restart__yes");

const winningMsg = document.querySelector(".winning__msg");

const winningSequence = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let availableCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let currentPlayer = "X";
let cpuPlaying = false;
let cpu, human;
let playing = true;

const changePlayer = function () {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
};

const emptyCells = function (board) {
  return board.filter((cell) => cell !== "X" && cell !== "O");
};

const winning = function (board, player) {
  for (let i = 0; i < winningSequence.length; i++) {
    if (
      board[winningSequence[i][0]] === player &&
      board[winningSequence[i][1]] === player &&
      board[winningSequence[i][2]] === player
    )
      return true;
  }
  return false;
};

//MINMAX function
const minmax = function (board, player) {
  const availableSpots = emptyCells(board);

  if (winning(board, human)) return { score: -10 };
  else if (winning(board, cpu)) return { score: 10 };
  else if (availableSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < availableSpots.length; i++) {
    const move = {};
    move.index = board[availableSpots[i]];
    board[availableSpots[i]] = player;

    if (player === cpu) {
      const result = minmax(board, human);
      move.score = result.score;
    } else {
      const result = minmax(board, cpu);
      move.score = result.score;
    }

    board[availableSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;

  if (player === cpu) {
    let bestScore = -100000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 100000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
};

const winningCandidate = function () {
  const winner = document.querySelector(`.${currentPlayer}__wins`);
  winner.textContent = +winner.textContent + 1;
  playing = false;
  if (cpuPlaying) {
    if (currentPlayer === cpu) winningMsg.textContent = "YOU LOSE";
    else if (currentPlayer === human) winningMsg.textContent = "YOU WIN";
  } else {
    winningMsg.classList.add("winner__label");
    winningMsg.textContent = `${currentPlayer} takes the round`;
  }
  winningMsg.style.color = currentPlayer === "X" ? "#31c3bd" : "#f2b137";
  nextRoundBtn.style.backgroundColor =
    currentPlayer === "O" ? "#31c3bd" : "#f2b137";
  nextRoundBtn.style.filter =
    currentPlayer === "O"
      ? "drop-shadow(0 3px 0 #1b8b88)"
      : "drop-shadow(0 3px 0 #cc8d19)";
  winningStage.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const checkDraw = function () {
  const availableEmptyCells = emptyCells(availableCells);
  if (availableEmptyCells.length === 0) {
    draw.textContent = +draw.textContent + 1;
    winningMsg.classList.remove("winner__label");
    winningMsg.textContent = "It's a draw";
    winningMsg.style.color = "#a8bfc9";
    winningStage.classList.remove("hidden");
    overlay.classList.remove("hidden");
    playing = false;
  } else return;
};

const cpuPlayer = function () {
  if (playing) {
    currentPlayer = cpu;
    const effectiveIndex = minmax(availableCells, cpu);
    const aiCell = document.querySelector(`.cell${effectiveIndex.index}`);
    aiCell.style.color = currentPlayer === "X" ? "#31c3bd" : "#f2b137";
    aiCell.textContent = cpu;
    availableCells[effectiveIndex.index] = cpu;
    if (winning(availableCells, cpu)) {
      winningCandidate();
    } else checkDraw();
    currentPlayer = human;
    turnLabel.textContent = `${currentPlayer}'s turn`;
  }
};

const updateCell = function (cell) {
  availableCells[+cell.dataset.cell] = currentPlayer;
  cell.style.color = currentPlayer === "X" ? "#31c3bd" : "#f2b137";
  cell.textContent = currentPlayer;
  if (winning(availableCells, currentPlayer)) {
    winningCandidate();
  } else checkDraw();
  changePlayer();
  turnLabel.textContent = `${currentPlayer}'s turn`;
  if (cpuPlaying) {
    setTimeout(() => cpuPlayer(), 500);
  }
};

const reset = function () {
  playing = true;
  cells.forEach((e) => {
    e.textContent = "";
  });
  currentPlayer = "X";
  turnLabel.textContent = "X's turn";
  availableCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
};

const newGame = function () {
  reset();
  XWins.textContent = 0;
  OWins.textContent = 0;
  draw.textContent = 0;
};

const hidingStages = function (...stages) {
  stages.forEach((stage) => stage.classList.add("hidden"));
};

vsPlayerBtn.addEventListener("click", function () {
  startingStage.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  cpuPlaying = false;
});

vsCpuBtn.addEventListener("click", function () {
  pickingMark.classList.remove("hidden");
});

XMark.addEventListener("click", function () {
  hidingStages(startingStage, pickingMark);
  gameContainer.classList.remove("hidden");
  cpuPlaying = true;
  human = "X";
  cpu = "O";
});

OMark.addEventListener("click", function () {
  hidingStages(startingStage, pickingMark);
  gameContainer.classList.remove("hidden");
  cpuPlaying = true;
  human = "O";
  cpu = "X";
  setTimeout(() => cpuPlayer(), 500);
});

cells.forEach((cell) => {
  cell.addEventListener("click", function () {
    if (playing) {
      if (cell.textContent === "") {
        updateCell(cell);
      } else return;
    }
  });
});

newGameBtn.addEventListener("click", function () {
  newGame();
  hidingStages(winningStage, overlay, gameContainer);
  startingStage.classList.remove("hidden");
  cpuPlaying = false;
});

nextRoundBtn.addEventListener("click", function () {
  reset();
  hidingStages(winningStage, overlay);
  if (cpuPlaying && cpu === "X") setTimeout(() => cpuPlayer(), 500);
});

restartBtn.addEventListener("click", function () {
  restartStage.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

restartNoBtn.addEventListener("click", function () {
  hidingStages(restartStage, overlay);
});

restartYesBtn.addEventListener("click", function () {
  newGame();
  hidingStages(restartStage, overlay, gameContainer);
  startingStage.classList.remove("hidden");
  cpuPlaying = false;
});
