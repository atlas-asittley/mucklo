// ui_gambling.js — Lucky Luca's gambling den in Rogue's Cove.
// Three games: Dice Roll (Hi-Lo), Coin Flip, Three Card Monte.
// Depends on: state.js, gameplay.js (toast, msg), ui_hud.js (saveGame).

// ─── MENU ─────────────────────────────────────────────────────────────────────
function openGamblingMenu() {
  document.getElementById('gambling-screen').style.display = 'flex';
  document.getElementById('gambling-menu').style.display = 'block';
  document.getElementById('gambling-game-panel').style.display = 'none';
  document.getElementById('gambling-gold-val').textContent = game.player.gold;
}

function closeGamblingMenu() {
  document.getElementById('gambling-screen').style.display = 'none';
}

// ─── GAME SELECT ──────────────────────────────────────────────────────────────
const GAMBLING_CONFIGS = {
  dice:      { title: 'Dice Roll (Hi-Lo)',  min: 10,  max: 500,  payout: 2, desc: 'Guess HIGH (8+) or LOW (7 or less). Win 2x your bet.' },
  coin:      { title: 'Coin Flip',          min: 5,   max: 200,  payout: 2, desc: 'Call HEADS or TAILS. Win 2x your bet.' },
  threecard: { title: 'Three Card Monte',   min: 20,  max: 1000, payout: 3, desc: 'Find the winning card. Win 3x your bet.' },
};

function openGamblingGame(gameType) {
  let cfg = GAMBLING_CONFIGS[gameType];
  if (!cfg) return;

  document.getElementById('gambling-menu').style.display = 'none';
  let panel = document.getElementById('gambling-game-panel');
  panel.style.display = 'block';
  panel.dataset.gameType = gameType;

  document.getElementById('gambling-game-title').textContent = cfg.title;
  document.getElementById('gambling-game-desc').textContent = cfg.desc;
  document.getElementById('gambling-bet-min').textContent = cfg.min;
  document.getElementById('gambling-bet-max').textContent = cfg.max;
  let input = document.getElementById('gambling-bet-input');
  input.min = cfg.min;
  input.max = cfg.max;
  input.value = cfg.min;

  document.getElementById('gambling-animation').textContent = '';
  document.getElementById('gambling-result').textContent = '';
  document.getElementById('gambling-result').className = 'gambling-result';
  document.getElementById('gambling-gold-val').textContent = game.player.gold;

  _renderChoices(gameType);
}

function _renderChoices(gameType) {
  let btns = document.getElementById('gambling-choice-btns');
  if (gameType === 'dice') {
    btns.innerHTML = `
      <button class="gambling-choice-btn" onclick="playDice('high')">HIGH (8+)</button>
      <button class="gambling-choice-btn" onclick="playDice('low')">LOW (7 or less)</button>
    `;
  } else if (gameType === 'coin') {
    btns.innerHTML = `
      <button class="gambling-choice-btn" onclick="playCoinFlip('heads')">HEADS</button>
      <button class="gambling-choice-btn" onclick="playCoinFlip('tails')">TAILS</button>
    `;
  } else if (gameType === 'threecard') {
    _renderThreeCards();
  }
}

function backToGamblingMenu() {
  document.getElementById('gambling-game-panel').style.display = 'none';
  document.getElementById('gambling-menu').style.display = 'block';
  document.getElementById('gambling-gold-val').textContent = game.player.gold;
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
function _getValidBet(min, max) {
  let bet = parseInt(document.getElementById('gambling-bet-input').value, 10);
  if (isNaN(bet) || bet < min) {
    if (game.player.gold < min) {
      _showResult('Not enough gold! (need ' + min + 'g)', false);
      return null;
    }
    bet = min;
    document.getElementById('gambling-bet-input').value = min;
  }
  if (bet > max) {
    bet = max;
    document.getElementById('gambling-bet-input').value = max;
  }
  if (game.player.gold < bet) {
    if (game.player.gold < min) {
      _showResult('Not enough gold! (need ' + min + 'g)', false);
      return null;
    }
    bet = game.player.gold;
    document.getElementById('gambling-bet-input').value = bet;
  }
  return bet;
}

function _showResult(text, win) {
  let el = document.getElementById('gambling-result');
  el.textContent = text;
  el.className = 'gambling-result ' + (win ? 'gambling-win' : 'gambling-lose');
  document.getElementById('gambling-gold-val').textContent = game.player.gold;
}

function _setChoicesDisabled(disabled) {
  document.querySelectorAll('.gambling-choice-btn, .gambling-card-btn').forEach(b => { b.disabled = disabled; });
}

// ─── DICE ROLL ────────────────────────────────────────────────────────────────
function playDice(guess) {
  let bet = _getValidBet(10, 500);
  if (bet === null) return;

  game.player.gold -= bet;
  _setChoicesDisabled(true);

  let animEl = document.getElementById('gambling-animation');
  let frames = 0;
  let interval = setInterval(function() {
    let d1 = 1 + Math.floor(Math.random() * 6);
    let d2 = 1 + Math.floor(Math.random() * 6);
    animEl.textContent = d1 + ' + ' + d2;
    frames++;
    if (frames >= 8) {
      clearInterval(interval);
      let die1 = 1 + Math.floor(Math.random() * 6);
      let die2 = 1 + Math.floor(Math.random() * 6);
      let total = die1 + die2;
      animEl.textContent = die1 + ' + ' + die2 + ' = ' + total;
      let result = total >= 8 ? 'high' : 'low';
      let win = guess === result;
      if (win) {
        game.player.gold += bet * 2;
        _showResult('Rolled ' + total + '! You win ' + bet + 'g!', true);
        msg('Dice: ' + total + ' (' + result.toUpperCase() + ') — You win ' + bet + 'g! Gold: ' + game.player.gold);
        toast('You win ' + bet + 'g!', 'green');
      } else {
        _showResult('Rolled ' + total + '! Luca wins. You lose ' + bet + 'g.', false);
        msg('Dice: ' + total + ' (' + result.toUpperCase() + ') — You lose ' + bet + 'g. Gold: ' + game.player.gold);
        toast('Lost ' + bet + 'g!', 'red');
      }
      _setChoicesDisabled(false);
      saveGame();
    }
  }, 110);
}

// ─── COIN FLIP ────────────────────────────────────────────────────────────────
function playCoinFlip(guess) {
  let bet = _getValidBet(5, 200);
  if (bet === null) return;

  game.player.gold -= bet;
  _setChoicesDisabled(true);

  let animEl = document.getElementById('gambling-animation');
  let frames = 0;
  let sides = ['HEADS', 'TAILS'];
  let interval = setInterval(function() {
    animEl.textContent = sides[frames % 2];
    frames++;
    if (frames >= 10) {
      clearInterval(interval);
      let result = Math.random() < 0.5 ? 'heads' : 'tails';
      animEl.textContent = result.toUpperCase();
      let win = guess === result;
      if (win) {
        game.player.gold += bet * 2;
        _showResult(result.toUpperCase() + '! You win ' + bet + 'g!', true);
        msg('Coin flip: ' + result.toUpperCase() + ' — You win ' + bet + 'g! Gold: ' + game.player.gold);
        toast('You win ' + bet + 'g!', 'green');
      } else {
        _showResult(result.toUpperCase() + '! Luca wins. You lose ' + bet + 'g.', false);
        msg('Coin flip: ' + result.toUpperCase() + ' — You lose ' + bet + 'g. Gold: ' + game.player.gold);
        toast('Lost ' + bet + 'g!', 'red');
      }
      _setChoicesDisabled(false);
      saveGame();
    }
  }, 100);
}

// ─── THREE CARD MONTE ─────────────────────────────────────────────────────────
let _cardWinner = 0;

function _renderThreeCards() {
  _cardWinner = Math.floor(Math.random() * 3);
  let btns = document.getElementById('gambling-choice-btns');
  btns.innerHTML = `
    <button class="gambling-card-btn" onclick="pickCard(0)">[?]</button>
    <button class="gambling-card-btn" onclick="pickCard(1)">[?]</button>
    <button class="gambling-card-btn" onclick="pickCard(2)">[?]</button>
  `;
  let animEl = document.getElementById('gambling-animation');
  animEl.textContent = 'Luca shuffles the cards...';
  setTimeout(function() { animEl.textContent = 'Pick a card!'; }, 900);
}

function pickCard(index) {
  let bet = _getValidBet(20, 1000);
  if (bet === null) return;

  game.player.gold -= bet;
  _setChoicesDisabled(true);

  let animEl = document.getElementById('gambling-animation');
  animEl.textContent = 'Luca shuffles...';

  setTimeout(function() {
    // Reveal all cards
    let cardBtns = document.querySelectorAll('.gambling-card-btn');
    cardBtns.forEach(function(b, i) {
      b.textContent = i === _cardWinner ? '[WIN]' : '[   ]';
    });

    let win = index === _cardWinner;
    let profit = bet * 2;
    if (win) {
      game.player.gold += bet * 3;
      animEl.textContent = "That's the one!";
      _showResult('You found it! Win ' + profit + 'g!', true);
      msg('Three Card Monte: right card! You win ' + profit + 'g! Gold: ' + game.player.gold);
      toast('You win ' + profit + 'g!', 'green');
    } else {
      animEl.textContent = 'Wrong card!';
      _showResult('Wrong card! You lose ' + bet + 'g.', false);
      msg('Three Card Monte: wrong card! Luca grins. You lose ' + bet + 'g. Gold: ' + game.player.gold);
      toast('Lost ' + bet + 'g!', 'red');
    }

    setTimeout(function() {
      _setChoicesDisabled(false);
      _renderThreeCards();
      document.getElementById('gambling-result').textContent = '';
      document.getElementById('gambling-result').className = 'gambling-result';
      saveGame();
    }, 1600);
  }, 800);
}
