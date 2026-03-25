// ui_hud.js — HUD menu bar (MENU toggle, SAVE sub-menu), save/load system,
// and click-outside close handlers for all overlay panels.
// Depends on: state.js, gameplay.js (isDungeonMap), map.js (generateDungeon, findSafeSpawn, spawnEnemies)

// ─── HUD MENU ────────────────────────────────────────────────────────────────
let hudMenuOpen = false;

function toggleHudMenu() {
  hudMenuOpen = !hudMenuOpen;
  document.getElementById('hud-menu-items').classList.toggle('open', hudMenuOpen);
  document.getElementById('hud-menu-toggle').classList.toggle('active', hudMenuOpen);
  if (!hudMenuOpen) closeSaveMenu();
}

function closeHudMenu() {
  hudMenuOpen = false;
  let items = document.getElementById('hud-menu-items');
  let toggle = document.getElementById('hud-menu-toggle');
  if (items) items.classList.remove('open');
  if (toggle) toggle.classList.remove('active');
  closeSaveMenu();
}

// ─── SAVE SUB-MENU ───────────────────────────────────────────────────────────
let saveMenuOpen = false;
let lastSaveTime = null;

function toggleSaveMenu() {
  saveMenuOpen = !saveMenuOpen;
  document.getElementById('hud-save-sub').classList.toggle('open', saveMenuOpen);
  document.getElementById('hud-save-toggle').classList.toggle('active', saveMenuOpen);
  if (saveMenuOpen) updateSaveStatus();
}

function closeSaveMenu() {
  saveMenuOpen = false;
  let sub = document.getElementById('hud-save-sub');
  let toggle = document.getElementById('hud-save-toggle');
  if (sub) sub.classList.remove('open');
  if (toggle) toggle.classList.remove('active');
}

function updateSaveStatus() {
  let el = document.getElementById('hud-save-status');
  if (!el) return;
  if (!lastSaveTime) {
    el.textContent = localStorage.getItem('atlasRPG') ? 'Save exists' : 'No save found';
    return;
  }
  let mins = Math.floor((Date.now() - lastSaveTime) / 60000);
  el.textContent = mins < 1 ? 'Last saved: just now' : 'Last saved: ' + mins + 'm ago';
}

function hudSaveGame() {
  saveGame();
  toast('Game Saved!', 'green');
}

// ─── NEW GAME ─────────────────────────────────────────────────────────────────
function confirmNewGame() {
  closeHudMenu();
  document.getElementById('new-game-confirm-overlay').style.display = 'flex';
}

function cancelNewGame() {
  document.getElementById('new-game-confirm-overlay').style.display = 'none';
}

function startNewGame() {
  localStorage.removeItem('atlasRPG');
  location.reload();
}

// ─── CLICK-OUTSIDE TO CLOSE ──────────────────────────────────────────────────
function initClickOutsideHandlers() {
  let panels = [
    { screenId: 'inventory-screen', closeFn: closeInventory         },
    { screenId: 'shop-screen',      closeFn: closeShop              },
    { screenId: 'trainer-screen',   closeFn: closeTrainer           },
    { screenId: 'stats-screen',     closeFn: closeStats             },
    { screenId: 'sparring-screen',  closeFn: closeSparring          },
    { screenId: 'oc-skills-screen', closeFn: closeOutOfCombatSkills },
    { screenId: 'library-screen',   closeFn: closeLibrary           },
  ];
  for (let { screenId, closeFn } of panels) {
    let screen = document.getElementById(screenId);
    if (!screen) continue;
    screen.addEventListener('click', function(e) {
      if (!document.contains(e.target)) return;
      if (!e.target.closest('.panel-wrap')) closeFn();
    });
  }
  // Close combat screen when clicking outside panel after battle ends
  let combatScreen = document.getElementById('combat-screen');
  if (combatScreen) {
    combatScreen.addEventListener('click', function(e) {
      if (game.battleEnded && !e.target.closest('.panel-wrap')) leaveCombatScreen();
    });
  }
  // Close HUD menu when clicking/tapping outside it.
  // touchstart is needed because the canvas touchstart calls e.preventDefault(),
  // which suppresses the synthetic click event on mobile.
  function closeHudMenuIfOutside(e) {
    if (hudMenuOpen && !document.getElementById('hud-menu-bar').contains(e.target)) {
      closeHudMenu();
    }
  }
  document.addEventListener('click', closeHudMenuIfOutside);
  document.addEventListener('touchstart', closeHudMenuIfOutside, { passive: true });
  // Dismiss item tooltip when clicking/tapping outside it
  document.addEventListener('click', function(e) {
    let tip = document.getElementById('item-tooltip');
    if (tip && tip.style.display !== 'none' && !tip.contains(e.target)) {
      hideTooltip();
    }
  });
  document.addEventListener('touchstart', function(e) {
    let tip = document.getElementById('item-tooltip');
    if (tip && tip.style.display !== 'none' && !tip.contains(e.target)) {
      hideTooltip();
    }
  }, { passive: true });
}

// ─── SAVE / LOAD ─────────────────────────────────────────────────────────────
function buildSaveState() {
  return { player:game.player, inventory:game.inventory, inventoryIds:game.inventoryIds, _nextItemId:game._nextItemId,
    lockedItems:game.lockedItems, equipped:game.equipped,
    currentMap:game.currentMap, flags:game.flags, kills:game.kills, currentFloor, chestsOpened,
    corpse: game.corpse, generatedMaps };
}

function saveGame() {
  localStorage.setItem('atlasRPG', JSON.stringify(buildSaveState()));
  lastSaveTime = Date.now();
}

function exportSave() {
  let state = buildSaveState();
  let blob = new Blob([JSON.stringify(state)], {type: 'application/json'});
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url; a.download = 'realm_of_atlas_save.json';
  a.click(); URL.revokeObjectURL(url);
  toast('Save exported!', 'green');
  closeHudMenu();
}

function importSave() {
  let input = document.createElement('input');
  input.type = 'file'; input.accept = '.json,application/json';
  input.onchange = e => {
    let file = e.target.files[0]; if (!file) return;
    let reader = new FileReader();
    reader.onload = ev => {
      try {
        let state = JSON.parse(ev.target.result);
        if (!state.player || !state.inventory || !state.equipped) throw new Error('Invalid');
        localStorage.setItem('atlasRPG', JSON.stringify(state));
        toast('Save imported! Reloading...', 'green');
        setTimeout(() => location.reload(), 1000);
      } catch(err) { toast('Invalid save file!', ''); }
    };
    reader.readAsText(file);
  };
  input.click();
  closeHudMenu();
}

// ─── VERSION ─────────────────────────────────────────────────────────────────
function showVersion() {
  let el = document.getElementById('game-version');
  if (!el) return;
  if (typeof GAME_VERSION !== 'undefined') {
    el.textContent = 'v' + GAME_VERSION.commit;
  }
}

function loadGame() {
  let saved = localStorage.getItem('atlasRPG');
  if (saved) {
    let state = JSON.parse(saved);
    game.player = state.player;
    game.inventory = state.inventory || [];
    game.inventoryIds = state.inventoryIds || game.inventory.map((id, i) => id + '_' + (i + 1));
    game._nextItemId = state._nextItemId || game.inventoryIds.length;
    game.lockedItems = state.lockedItems || [];
    game.equipped = state.equipped || {};
    // Migrate old saves: old format had weapon/weaponIndex/armor/armorIndex keys
    if (game.equipped.MAIN_HAND === undefined) {
      let oldEq = game.equipped;
      let newEq = { HEAD: null, CHEST: null, HANDS: null, FEET: null, MAIN_HAND: null, OFF_HAND: null, RING: null, AMULET: null };
      let toRemove = [];
      if (oldEq.weapon) {
        let idx = (oldEq.weaponIndex !== null && oldEq.weaponIndex !== undefined && game.inventory[oldEq.weaponIndex] === oldEq.weapon)
          ? oldEq.weaponIndex : game.inventory.indexOf(oldEq.weapon);
        if (idx !== -1) { newEq.MAIN_HAND = oldEq.weapon; toRemove.push(idx); }
      }
      if (oldEq.armor) {
        let idx = (oldEq.armorIndex !== null && oldEq.armorIndex !== undefined && game.inventory[oldEq.armorIndex] === oldEq.armor)
          ? oldEq.armorIndex : game.inventory.indexOf(oldEq.armor);
        if (idx !== -1) { newEq.CHEST = oldEq.armor; toRemove.push(idx); }
      }
      toRemove.sort((a, b) => b - a);
      for (let idx of toRemove) { game.inventory.splice(idx, 1); game.inventoryIds.splice(idx, 1); }
      game.equipped = newEq;
    } else {
      // Ensure all 8 slots exist (handles partially migrated saves)
      let slots = ['HEAD','CHEST','HANDS','FEET','MAIN_HAND','OFF_HAND','RING','AMULET'];
      for (let s of slots) { if (game.equipped[s] === undefined) game.equipped[s] = null; }
    }
    // Migrate old saves: ensure stats exist
    if (!game.player.STR) game.player.STR = 10;
    if (!game.player.DEX) game.player.DEX = 10;
    if (!game.player.CON) game.player.CON = 10;
    if (!game.player.INT) game.player.INT = 10;
    if (!game.player.WIS) game.player.WIS = 10;
    if (!game.player.CHA) game.player.CHA = 10;
    if (game.player.skillPoints === undefined) game.player.skillPoints = 0;
    if (!game.player.learnedSkills) game.player.learnedSkills = [];
    if (!game.player.skillXP) game.player.skillXP = {};
    if (!game.setBonus) game.setBonus = {};
    // Recalc maxHp to match CON (for old saves that had 100 base)
    let expectedMaxHp = 100 + game.player.CON * 5;
    if (game.player.maxHp < expectedMaxHp) game.player.maxHp = expectedMaxHp;
    game.currentMap = state.currentMap || 'town';
    game.flags = state.flags || {};
    game.kills = state.kills || 0;
    game.corpse = state.corpse || null;
    currentFloor = state.currentFloor || 0;
    chestsOpened = state.chestsOpened || {};
    if (!game.player.deaths) game.player.deaths = 0;
    if (game.player.drunkLevel === undefined) game.player.drunkLevel = 0;
    if (game.player.drunkStepCounter === undefined) game.player.drunkStepCounter = 0;
    // Backward compat: saves without a class default to warrior
    if (!game.player.class) game.player.class = 'warrior';
    // Migrate old saves: initialize mana if missing
    if (game.player.maxMana === undefined || game.player.maxMana === 0) {
      let cls = CLASS_DEFS[game.player.class] || CLASS_DEFS.warrior;
      game.player.maxMana = cls.baseMana + (game.player.INT || 10) * cls.manaPerInt;
      game.player.mana = game.player.maxMana;
    }
    if (game.player.mana === undefined) game.player.mana = game.player.maxMana;
    // Restore static dungeon maps from save so layouts persist across reloads.
    if (state.generatedMaps) {
      for (let floor = 1; floor <= 3; floor++) {
        let gmKey = `dragons_dungeon_floor_${floor}`;
        if (state.generatedMaps[gmKey]) {
          generatedMaps[gmKey] = state.generatedMaps[gmKey];
          dungeonData[`dungeon_${floor}`] = state.generatedMaps[gmKey];
        }
      }
    }
    // Migrate: regenerate floor 3 if it was saved without STAIRS_DOWN (old save).
    // Old floor 3 maps had no down stairs, leaving the stair pocket isolated from rooms.
    let f3Key = 'dragons_dungeon_floor_3';
    if (generatedMaps[f3Key]) {
      let hasDown = generatedMaps[f3Key].map.some(row => row.includes(T.STAIRS_DOWN));
      if (!hasDown) { generatedMaps[f3Key] = null; dungeonData['dungeon_3'] = null; }
    }
    if (isDungeonMap(game.currentMap)) {
      // If the stored map wasn't in the save (old save), generate fresh and cache it.
      let gmKey = `dragons_dungeon_floor_${currentFloor}`;
      if (!generatedMaps[gmKey]) {
        dungeonData[game.currentMap] = generateDungeon(currentFloor);
        generatedMaps[gmKey] = dungeonData[game.currentMap];
      } else {
        dungeonData[game.currentMap] = generatedMaps[gmKey];
      }
      spawnEnemies(currentFloor, game.player.x, game.player.y);
      // Use findSafeSpawn to avoid placing player on an enemy tile
      let safePos = findSafeSpawn(dungeonData[game.currentMap].map, game.player.x, game.player.y);
      game.player.x = safePos.x;
      game.player.y = safePos.y;
    }
    return true;
  }
  return false;
}
