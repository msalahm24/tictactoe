
const arrayofwin =[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];
let trackxo;
let humanPlayer ='O';
let computerplayer = 'X';

const cells = document.querySelectorAll('.cell');
begingame();

function selectSym(sym){
  humanPlayer = sym;
  computerplayer = sym==='O' ? 'X' :'O';
  trackxo = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick, false);
  }
  if (computerplayer === 'X') {
    change(movebest(),computerplayer);
  }
  document.querySelector('.selectSym').style.display = "none";
}
// restart the game again
function begingame() {
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innerText ="";
  document.querySelector('.selectSym').style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
}

// to give you the control of add x or o
function change(elementid, player) {
  trackxo[elementid] = player;
  document.getElementById(elementid).innerHTML = player;
  let gameWon = checkWin(trackxo, player);
  if (gameWon) End(gameWon);
  iftie();
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of arrayofwin.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function turnClick(element) {
  if (typeof trackxo[element.target.id] ==='number') {
    change(element.target.id, humanPlayer);
    if (!checkWin(trackxo, humanPlayer) && !iftie())
      change(movebest(), computerplayer);
  }
}
// the behave of the game where game over
function End(gameWon){
  for (let index of arrayofwin[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player === humanPlayer ? "blue" : "red";
  }
  for (let i=0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  whowinner(gameWon.player === humanPlayer ? "You win!" : "You lose");
}
//to indicate the winner of the game
function whowinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}/// to indiacte the free spaces in the game
function elementempty() {
  return trackxo.filter((elm, i) => i===elm);
}
 //this function to indicate the best spot to move
function movebest(){
  return maxmin(trackxo, computerplayer).index;
}
  // this will indicate if tie or not
function iftie() {
  if (elementempty().length === 0){
    for (cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener('click',turnClick, false);
    }
    whowinner("Tie game");
    return true;
  } 
  return false;
}

function maxmin(newBoard, player) {
  var availSpots = elementempty(newBoard);
  
  if (checkWin(newBoard, humanPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, computerplayer)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  //moves numbers
  var moshens = [];
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    
    if (player === computerplayer)
      move.score = maxmin(newBoard, humanPlayer).score;
    else
       move.score =  maxmin(newBoard, computerplayer).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === computerplayer && move.score === 10) || (player === humanPlayer && move.score === -10))
      return move;
    else 
      moshens.push(move);
  }
  // bestscore and move
  let bestMove, bestScore;
  if (player === computerplayer) {
    bestScore = -1000;
    for(let i = 0; i < moshens.length; i++) {
      if (moshens[i].score > bestScore) {
        bestScore = moshens[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moshens.length; i++) {
      if (moshens[i].score < bestScore) {
        bestScore = moshens[i].score;
        bestMove = i;
      }
    }
  }
  
  return moshens[bestMove];
}