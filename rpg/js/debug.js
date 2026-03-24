// debug.js — Debug/cheat mode: toggle overlay, stat/gold/level/item cheats,
// teleport menu, and debug stats panel. All cheats are gated behind debugMode.
// Depends on: state.js, data.js (enemies, itemDefs), map.js (currentFloor),
//   combat.js (applyLevelUp, combatEnemy, updateCombatUI, combatWin).

// ─── SHARED DEBUG UI HELPERS ──────────────────────────────────────────────────
const DEBUG_PANEL_STYLE =
  'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
  'background:rgba(0,10,0,0.96);border:1px solid #0f0;border-radius:6px;padding:14px;' +
  'z-index:200;min-width:200px;box-shadow:0 4px 24px rgba(0,0,0,0.9);font-family:inherit;';

const DEBUG_BTN_BASE =
  'display:block;width:100%;font-family:inherit;font-size:7px;letter-spacing:0.5px;' +
  'padding:7px 10px;margin-bottom:4px;border-radius:3px;cursor:pointer;text-align:left;touch-action:manipulation;';

function makeDebugBtn(label, cb, color) {
  let btn = document.createElement('button');
  btn.textContent = label;
  let isRed = color === 'red';
  let bg     = isRed ? 'rgba(30,0,0,0.9)' : 'rgba(0,30,0,0.9)';
  let border = isRed ? '#a00' : '#0a0';
  let text   = isRed ? '#f44' : '#0f0';
  btn.style.cssText = `${DEBUG_BTN_BASE}background:${bg};border:1px solid ${border};color:${text};`;
  btn.onmouseenter = () => { btn.style.background = isRed ? 'rgba(60,0,0,0.9)' : 'rgba(0,60,0,0.9)'; btn.style.borderColor = isRed ? '#f44' : '#0f0'; };
  btn.onmouseleave = () => { btn.style.background = bg; btn.style.borderColor = border; };
  btn.onclick = cb;
  return btn;
}

function makeDebugTitle(text) {
  let el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = 'color:#0f0;font-size:9px;letter-spacing:2px;text-align:center;margin-bottom:10px;border-bottom:1px solid #050;padding-bottom:8px;';
  return el;
}

function makeDebugSectionLabel(text) {
  let lbl = document.createElement('div');
  lbl.textContent = text;
  lbl.style.cssText = 'color:#050;font-size:7px;letter-spacing:1px;margin:8px 0 4px;';
  return lbl;
}

function toggleDebugMode() {
  debugMode = !debugMode;
  document.getElementById('debug-indicator').style.display = debugMode ? 'block' : 'none';
  document.getElementById('debug-info').style.display = debugMode ? 'block' : 'none';
  document.getElementById('debug-gear-btn').classList.toggle('visible', debugMode);
  if (!debugMode) {
    document.getElementById('mobile-debug-panel').classList.remove('open');
  }
  toast(debugMode ? 'DEBUG ON' : 'DEBUG OFF', debugMode ? 'green' : '');
}

function toggleMobileDebugPanel() {
  if (!debugMode) toggleDebugMode();
  let panel = document.getElementById('mobile-debug-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) updateMobileDebugInfo();
}

function updateMobileDebugInfo() {
  let el = document.getElementById('mobile-debug-info-text');
  el.innerHTML = `X:${game.player.x} Y:${game.player.y}<br>ENEMIES:${enemies.length} FLOOR:${currentFloor}`;
}

function cheatSkillPoints() {
  if (!debugMode) return;
  game.player.skillPoints = (game.player.skillPoints || 0) + 10;
  toast('+10 Skill Points', 'green');
}

function cheatGold() {
  if (!debugMode) return;
  game.player.gold += 1000;
  toast('+1000 Gold', 'green');
}

function cheatLevelUp() {
  if (!debugMode) return;
  game.player.xp = 0;
  applyLevelUp();
  toast(`LEVEL UP! Now level ${game.player.lvl}! +3 Skill Pts!`, 'green');
}

function cheatFullHeal() {
  if (!debugMode) return;
  game.player.hp = game.player.maxHp;
  toast('Full Heal!', 'green');
}

function cheatItems() {
  if (!debugMode) return;
  addInventoryItem('hp_potion'); addInventoryItem('wooden_sword'); addInventoryItem('cloth_armor');
  toast('Added: HP Potion, Wooden Sword, Cloth Armor', 'green');
}

function cheatGodMode() {
  if (!debugMode) return;
  if (!game.player.learnedSkills) game.player.learnedSkills = [];
  if (game.player.learnedSkills.includes('cheat_god_mode')) {
    toast('GOD MODE already learned!', 'green');
    return;
  }
  game.player.learnedSkills.push('cheat_god_mode');
  toast('Learned: CHEAT: GOD MODE skill!', 'green');
}

function cheatInstantKill() {
  if (!debugMode) return;
  if (!combatEnemy || document.getElementById('combat-screen').style.display === 'none') {
    toast('Not in combat!', '');
    return;
  }
  combatEnemy.hp = 0;
  updateCombatUI();
  combatWin();
  toast('INSTANT KILL!', 'green');
}

function teleportMenu() {
  if (!debugMode) return;
  // Toggle: close if already open
  let existing = document.getElementById('teleport-panel');
  if (existing) { existing.remove(); return; }

  const LOCATIONS = [
    { name: 'Town',              map: 'town',              x: 20, y: 2  },
    { name: 'World Map',         map: 'world',             x: 20, y: 20 },
    { name: 'Elven Town',        map: 'elven_town',        x: 20, y: 2  },
    { name: "Dragon's Gate",     map: 'dragons_gate',      x: 20, y: 2  },
    { name: "Dragon's Dungeon Floor 1", floor: 1 },
    { name: "Dragon's Dungeon Floor 2", floor: 2 },
    { name: "Dragon's Dungeon Floor 3", floor: 3 },
    { name: 'Sparring Arena',    map: 'town',              x: 24, y: 30 },
    { name: "Rogue's Cove",      map: 'rogue_cove',        x: 20, y: 2  },
    { name: 'Training Grounds',  map: 'training_grounds',  x: 20, y: 2  },
    { name: 'Volcanic Wastes',   map: 'volcanic_wastes',   x: 5,  y: 29 },
    { name: 'Frozen Peaks',      map: 'frozen_peaks',      x: 5,  y: 4  },
    { name: 'Shadow Forest',     map: 'shadow_forest',     x: 37, y: 21 },
    { name: 'Dwarf Fortress',    map: 'dwarf_fortress',    x: 37, y: 11 },
    { name: 'Ruins of Aethoria', map: 'ruins_aethoria',    x: 26, y: 21 },
    { name: 'The Abyss',         map: 'the_abyss',         x: 20, y: 36 },
    { name: 'The Underworld',    map: 'the_underworld',    x: 15, y: 36 },
    { name: 'The Sunken Temple', map: 'sunken_temple',     x: 31, y: 32 },
  ];

  let panel = document.createElement('div');
  panel.id = 'teleport-panel';
  panel.style.cssText = DEBUG_PANEL_STYLE;
  panel.appendChild(makeDebugTitle('[ DEBUG TELEPORT ]'));

  for (let loc of LOCATIONS) {
    panel.appendChild(makeDebugBtn(loc.name, () => {
      panel.remove();
      if (loc.floor) {
        enterDungeon(loc.floor);
      } else {
        enterLocation(loc.map, loc.x, loc.y, 'TELEPORT', `Teleported: ${loc.name}`, 'green', `[DEBUG] Teleported to ${loc.name}.`);
      }
      // Snap camera and visual player position instantly
      playerVisX = game.player.x * TILE;
      playerVisY = game.player.y * TILE;
      targetCamX = game.player.x * TILE - canvas.width / 2 + TILE / 2;
      targetCamY = game.player.y * TILE - canvas.height / 2 + TILE / 2;
      camX = targetCamX;
      camY = targetCamY;
    }));
  }

  panel.appendChild(makeDebugBtn('[ CLOSE ]', () => panel.remove(), 'red'));
  document.body.appendChild(panel);
}

function cheatMaxHp() {
  if (!debugMode) return;
  game.player.maxHp += 100;
  game.player.hp = Math.min(game.player.hp + 100, game.player.maxHp);
  toast('+100 Max HP', 'green');
}

function copyCoords() {
  if (!debugMode) return;
  let text = `x:${game.player.x} y:${game.player.y}`;
  navigator.clipboard.writeText(text).then(() => {
    toast('Coordinates copied to clipboard!', 'green');
  });
}

function cheatStat(stat) {
  if (!debugMode) return;
  let amt = parseInt(prompt(`Add how much to ${stat}?`, '1')) || 1;
  game.player[stat] = (game.player[stat] || 10) + amt;
  toast(`+${amt} ${stat} (now ${game.player[stat]})`, 'green');
}

function openDebugPanel() {
  if (!debugMode) return;
  // Toggle: close if already open
  let existing = document.getElementById('debug-stat-panel');
  if (existing) { existing.remove(); return; }

  let panel = document.createElement('div');
  panel.id = 'debug-stat-panel';
  panel.style.cssText = DEBUG_PANEL_STYLE + 'min-width:240px;max-height:90vh;overflow-y:auto;';
  panel.appendChild(makeDebugTitle('[ DEBUG STATS ]'));

  panel.appendChild(makeDebugSectionLabel('── RESOURCES ──'));
  panel.appendChild(makeDebugBtn('+10 Skill Points', () => { cheatSkillPoints(); }));
  panel.appendChild(makeDebugBtn('+1000 Gold', () => { cheatGold(); }));
  panel.appendChild(makeDebugBtn('+1 Level', () => { cheatLevelUp(); }));

  panel.appendChild(makeDebugSectionLabel('── STATS ──'));
  for (let stat of ['STR','DEX','CON','INT','WIS','CHA']) {
    panel.appendChild(makeDebugBtn(`+? ${stat}`, () => { cheatStat(stat); }));
  }

  panel.appendChild(makeDebugSectionLabel('── HP ──'));
  panel.appendChild(makeDebugBtn('+100 Max HP', () => { cheatMaxHp(); }));
  panel.appendChild(makeDebugBtn('Full Heal', () => { cheatFullHeal(); }));

  panel.appendChild(makeDebugSectionLabel('── ITEMS ──'));
  panel.appendChild(makeDebugBtn('Add Basic Loadout', () => { cheatItems(); }));

  panel.appendChild(makeDebugSectionLabel('── TOOLS ──'));
  panel.appendChild(makeDebugBtn('Copy Coords', () => { copyCoords(); }));
  panel.appendChild(makeDebugBtn('Teleport...', () => { panel.remove(); teleportMenu(); }));
  panel.appendChild(makeDebugBtn('[ CLOSE ]', () => panel.remove(), 'red'));

  // Close on ESC or click outside
  function onKey(e) {
    if (e.key === 'Escape') { panel.remove(); document.removeEventListener('keydown', onKey); }
  }
  document.addEventListener('keydown', onKey);

  function onOutsideClick(e) {
    if (!panel.contains(e.target)) {
      panel.remove();
      document.removeEventListener('mousedown', onOutsideClick);
      document.removeEventListener('keydown', onKey);
    }
  }
  setTimeout(() => document.addEventListener('mousedown', onOutsideClick), 0);

  document.body.appendChild(panel);
}

function updateDebugInfo() {
  if (!debugMode) return;
  let el = document.getElementById('debug-info');
  el.textContent = `X:${game.player.x} Y:${game.player.y} | ENEMIES:${enemies.length} | FLOOR:${currentFloor}`;
  let panel = document.getElementById('mobile-debug-panel');
  if (panel.classList.contains('open')) updateMobileDebugInfo();
}
