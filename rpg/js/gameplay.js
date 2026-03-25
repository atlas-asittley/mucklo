// gameplay.js — Core gameplay logic: player movement (with drunk wobble), NPC interaction,
// dungeon/town/world transitions, world map random encounters (tiered by road distance),
// world boss tile combat, training grounds, corpse recovery, chest/stair/sign handling,
// rat tail quest logic, enter/leave helpers for all locations, and UI helpers (msg/toast/showFloorIndicator).
// Depends on: constants.js, state.js, map.js, data.js, particles.js, combat.js (startCombat,
//   isWorldMapEncounter), ui_hud.js (toast), ui_panels.js.

// ─── WORLD MAP RANDOM ENCOUNTERS ─────────────────────────────────────────────
const WORLD_ENCOUNTER_CHANCE = {
  5:  0.05,  // T.PATH   — road
  0:  0.15,  // T.GRASS  — plains/off-road
  14: 0.20,  // T.FOREST — forest
};
const worldEncounterTiers = {
  near: ['wolf', 'bandit', 'goblin'],            // 1-3 tiles from nearest road
  mid:  ['dark_knight', 'cave_troll', 'wyvern'], // 4-7 tiles
  far:  ['wyvern'],                              // 8+ tiles (world bosses are fixed markers, not random)
};

// Returns Manhattan distance to the nearest T.PATH tile on the world map.
function distanceToNearestPath(px, py) {
  let wm = maps.world;
  for (let r = 0; r <= 20; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) + Math.abs(dy) !== r) continue;
        let nx = px + dx, ny = py + dy;
        if (nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H && wm[ny][nx] === T.PATH) return r;
      }
    }
  }
  return 20;
}

// Called on each world map step. Decrements cooldowns, rolls for encounter, starts combat if triggered.
function checkWorldMapEncounter(tile) {
  let chance = WORLD_ENCOUNTER_CHANCE[tile];
  if (!chance) return;
  // Decrement per-enemy cooldowns
  for (let key in worldEncounterCooldowns) {
    worldEncounterCooldowns[key]--;
    if (worldEncounterCooldowns[key] <= 0) delete worldEncounterCooldowns[key];
  }
  game.player.worldMapSteps++;
  if (Math.random() >= chance) return;
  // Pick tier by distance to nearest road
  let dist = distanceToNearestPath(game.player.x, game.player.y);
  let tierKey = dist <= 3 ? 'near' : dist <= 7 ? 'mid' : 'far';
  // Filter out cooldown-blocked enemies, fall back through tiers if needed
  let pool = worldEncounterTiers[tierKey].filter(k => !worldEncounterCooldowns[k]);
  if (pool.length === 0) {
    for (let t of ['near', 'mid', 'far']) {
      pool = worldEncounterTiers[t].filter(k => !worldEncounterCooldowns[k]);
      if (pool.length > 0) break;
    }
  }
  if (pool.length === 0) return; // all on cooldown
  let typeKey = pool[Math.floor(Math.random() * pool.length)];
  let type = enemyTypes[typeKey];
  // Flash effect
  document.getElementById('game').classList.add('encounter-flash');
  setTimeout(() => document.getElementById('game').classList.remove('encounter-flash'), 400);
  showFloorIndicator('! ENCOUNTER !', 1200);
  toast(`A ${type.name} appears!`, 'red');
  // Push into enemies array and start combat tagged as a world map encounter
  enemies.push({ ...type, typeKey, x: game.player.x, y: game.player.y, maxHp: type.hp, opacity: 1, isBoss: false, worldMapKey: typeKey });
  isWorldMapEncounter = true;
  startCombat(enemies.length - 1);
}

// Initiates combat against a fixed world boss tile. Unlike random encounters these
// cannot be fled, and the tile is cleared from the map after the boss is killed.
function startWorldBossCombat(typeKey, bossX, bossY) {
  let type = enemyTypes[typeKey];
  document.getElementById('game').classList.add('encounter-flash');
  setTimeout(() => document.getElementById('game').classList.remove('encounter-flash'), 400);
  showFloorIndicator('!! BOSS ENCOUNTER !!', 1800);
  toast(`The ${type.name} awakens!`, 'red');
  msg(`The ${type.name} rises to fight! This is a boss — you cannot flee!`);
  enemies.push({ ...type, typeKey, worldMapKey: typeKey, bossX, bossY,
                 x: game.player.x, y: game.player.y, maxHp: type.hp, opacity: 1, isBoss: true });
  isWorldMapEncounter = false;
  startCombat(enemies.length - 1);
}

// Displays a dramatic gold overlay when a boss drops an item, then auto-hides after 2.8s.
function showBossDropEffect(itemName, rarityLabel, rarityColor) {
  let overlay = document.getElementById('boss-drop-overlay');
  let nameEl  = document.getElementById('boss-drop-item-name');
  let rarEl   = document.getElementById('boss-drop-item-rarity');
  nameEl.textContent = itemName;
  rarEl.textContent  = rarityLabel;
  rarEl.style.color  = rarityColor || '#f39c12';
  overlay.style.display = 'flex';
  // Re-trigger animation by cloning the node
  let clone = overlay.cloneNode(true);
  overlay.parentNode.replaceChild(clone, overlay);
  clone.style.display = 'flex';
  setTimeout(() => { clone.style.display = 'none'; }, 2800);
}

// ─── MAP HELPERS ─────────────────────────────────────────────────────────────

const NAMED_MAPS = new Set(['town','world','elven_town','dragons_gate','rogue_cove','training_grounds',
  'volcanic_wastes','frozen_peaks','shadow_forest','dwarf_fortress','ruins_aethoria','the_abyss','sunken_temple','the_underworld']);
const NEW_AREAS  = new Set(['volcanic_wastes','frozen_peaks','shadow_forest','dwarf_fortress','ruins_aethoria','the_abyss','sunken_temple','the_underworld']);

// Returns true when mapId is a dungeon floor (dungeon_1/2/3), not a named location.
function isDungeonMap(mapId) { return !NAMED_MAPS.has(mapId); }

// Returns true if the map is one of the 5 new explorable areas.
function isNewArea(mapId) { return NEW_AREAS.has(mapId); }

// Shared location entry: sets map/position, clears enemies, shows floor indicator and feedback.
function enterLocation(mapId, x, y, indicatorText, toastMsg, toastColor, message) {
  game.currentMap = mapId;
  game.player.x = x;
  game.player.y = y;
  enemies = [];
  showFloorIndicator(indicatorText, 2000);
  toast(toastMsg, toastColor);
  msg(message);
}

// ─── MESSAGES & TOASTS ───────────────────────────────────────────────────────
function msg(text) {
  document.getElementById('msg-text').textContent = text;
}

function toast(text, type='') {
  let c = document.getElementById('toast-container');
  let t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = text;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2100);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function isCombatOpen() {
  return document.getElementById('combat-screen').style.display === 'flex';
}

function readSign(nx, ny) {
  if (nx === 18 && ny === 19) msg('Sign: "Training Grounds >> South"');
  else if (nx === 22 && ny === 19) msg('Sign: "<< Shop & Healer"');
  else if (nx === 7  && ny === 17) msg('Sign: "Library — Browse our collection, adventurer!"');
  else if (game.currentMap === 'the_underworld') msg('Inscription: "Abandon hope, all ye who enter here."');
  else msg('An old sign...');
}

function activateChest(map, nx, ny) {
  let key = `${game.currentMap}_${nx}_${ny}`;
  if (!chestsOpened[key]) {
    chestsOpened[key] = true;
    map[ny][nx] = T.FLOOR;
    spawnParticles(nx * TILE + TILE / 2, ny * TILE + TILE / 2, 'chest');
    openChest();
  }
}

// Shows the floor/location banner briefly, then fades it out.
function showFloorIndicator(text, duration) {
  let fi = document.getElementById('floor-indicator');
  fi.textContent = text;
  fi.classList.add('visible');
  setTimeout(() => fi.classList.remove('visible'), duration);
}

// ─── MOVEMENT ────────────────────────────────────────────────────────────────
function movePlayer(dx, dy) {
  if (isCombatOpen()) return;
  // Drunk wobble: randomize direction based on drunk level
  if ((game.player.drunkLevel || 0) > 0) {
    let wobbleChance = game.player.drunkLevel > 50 ? 0.40 : 0.20;
    if (Math.random() < wobbleChance) {
      let dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      let [rdx, rdy] = dirs[Math.floor(Math.random() * dirs.length)];
      dx = rdx; dy = rdy;
    }
    // Trigger wobble animation on the canvas
    let gameEl = document.getElementById('game');
    gameEl.classList.remove('drunk-wobble');
    void gameEl.offsetWidth; // force reflow to restart animation
    gameEl.classList.add('drunk-wobble');
    // Decay drunk level every 5 steps
    game.player.drunkStepCounter = (game.player.drunkStepCounter || 0) + 1;
    if (game.player.drunkStepCounter >= 5) {
      game.player.drunkStepCounter = 0;
      game.player.drunkLevel = Math.max(0, game.player.drunkLevel - 1);
    }
  }
  let map = getMap();
  let nx = game.player.x + dx, ny = game.player.y + dy;
  if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return;
  let tile = map[ny][nx];
  if (tile === T.WALL || tile === T.WATER || tile === T.MOUNTAIN || tile === T.ELVEN_WALL || tile === T.TREE_OF_LIFE || tile === T.MOONWELL || tile === T.DG_WALL || tile === T.WOOD_WALL || tile === T.DUMMY || tile === T.LAVA || tile === T.VOLCANIC_WALL || tile === T.ICE_WALL || tile === T.BROKEN_PILLAR || tile === T.ABYSS_WALL || tile === T.VOID_RIFT || tile === T.SUNKEN_WALL || tile === T.HELL_WALL) return;
  // On world map: no NPC/enemy interactions
  if (game.currentMap !== 'world') {
    let npcList = npcs[game.currentMap] || [];
    for (let npc of npcList) {
      if (npc.x === nx && npc.y === ny) {
        // Dungeon guard: allow passage if player meets level requirement or gate already opened
        if (npc.dungeonGuard && (game.player.lvl >= (npc.minLevel || 5) || game.flags.dragonsgateOpen)) {
          game.flags.dragonsgateOpen = true;
          break; // skip NPC block, allow movement
        }
        interactNPC(npc); return;
      }
    }
    for (let i = 0; i < enemies.length; i++) {
      if (!enemies[i].defeated && enemies[i].x === nx && enemies[i].y === ny) { startCombat(i); return; }
    }
  }
  game.player.x = nx;
  game.player.y = ny;
  checkCorpseRecovery();
  if (tile === T.GATE) {
    if (game.currentMap === 'training_grounds') { leaveTrainingGrounds(); return; }
    else if (game.currentMap === 'elven_town') enterWorldMapFromElven();
    else if (game.currentMap === 'dragons_gate') enterWorldMapFromDragonsGate();
    else if (game.currentMap === 'rogue_cove') enterWorldMapFromRogueCove();
    else if (isNewArea(game.currentMap)) { leaveNewArea(); return; }
    else enterWorldMap();
    return;
  }
  if (tile === T.WORLD_TOWN) { enterTownFromWorld(); return; }
  if (tile === T.WORLD_DUNGEON) { enterDungeon(1); return; }
  if (tile === T.WORLD_ELVEN_TOWN) { enterElvenTown(); return; }
  if (tile === T.WORLD_DRAGONS_GATE) { enterDragonsGate(); return; }
  if (tile === T.WORLD_ROGUES_COVE) { enterRogueCove(); return; }
  if (tile === T.WORLD_VOLCANIC_WASTES) { enterVolcanicWastes(); return; }
  if (tile === T.WORLD_FROZEN_PEAKS)    { enterFrozenPeaks(); return; }
  if (tile === T.WORLD_SHADOW_FOREST)   { enterShadowForest(); return; }
  if (tile === T.WORLD_DWARF_FORTRESS)  { enterDwarfFortress(); return; }
  if (tile === T.WORLD_AETHORIA)        { enterRuinsAethoria(); return; }
  if (tile === T.WORLD_ABYSS)           { enterTheAbyss(); return; }
  if (tile === T.WORLD_SUNKEN_TEMPLE)   { enterSunkenTemple(); return; }
  if (tile === T.WORLD_UNDERWORLD)      { enterTheUnderworld(); return; }
  if (tile === T.STAIRS_DOWN) {
    if (game.currentMap === 'town') { enterTrainingGrounds(); return; }
    else if (game.currentMap === 'dragons_gate') enterDungeon(1, 'down');
    else if (isDungeonMap(game.currentMap)) {
      if (currentFloor >= 3) { msg('The stairs end here — you have reached the deepest level of the dungeon.'); return; }
      enterDungeon(currentFloor + 1, 'down');
    }
    return;
  }
  if (tile === T.STAIRS_UP) {
    if (currentFloor > 1) enterDungeon(currentFloor - 1, 'up');
    else leaveDungeon();
    return;
  }
  if (tile === T.CHEST) { activateChest(map, nx, ny); return; }
  if (tile === T.SIGN) { readSign(nx, ny); return; }
  if (tile === T.WORLD_BOSS_DRAGON && !game.flags.boss_elder_dragon_dead) { startWorldBossCombat('elder_dragon', nx, ny); return; }
  if (tile === T.WORLD_BOSS_GOLEM  && !game.flags.boss_titan_golem_dead)  { startWorldBossCombat('titan_golem',  nx, ny); return; }
  if (tile === T.WORLD_BOSS_HYDRA  && !game.flags.boss_void_hydra_dead)   { startWorldBossCombat('void_hydra',   nx, ny); return; }
  if (game.currentMap === 'world') { checkWorldMapEncounter(tile); return; }
  // Random enemy spawn on floor tiles in dungeons, training grounds, and new areas.
  // Enemy spawns off-screen — at least 5 tiles (Manhattan) away from the player.
  let spawnChance = isDungeonMap(game.currentMap) ? 0.08 : game.currentMap === 'training_grounds' ? 0.06 : isNewArea(game.currentMap) ? 0.06 : 0;
  if (spawnChance > 0 && (tile === T.FLOOR || tile === T.GRASS || tile === T.GRASS_DARK || tile === T.GRASS_LIGHT || tile === T.VOLCANIC_FLOOR || tile === T.SNOW || tile === T.SHADOW_FLOOR || tile === T.SACRED_GROUND || tile === T.ABYSS_FLOOR || tile === T.SUNKEN_FLOOR || tile === T.HELL_FLOOR) && Math.random() < spawnChance) {
    if (isNewArea(game.currentMap)) {
      let pool = areaEnemyPools[game.currentMap];
      if (pool) {
        let typeKey = pool.types[Math.floor(Math.random() * pool.types.length)];
        let type = enemyTypes[typeKey];
        let spawnPos = randomFloorTile(nx, ny, 5);
        if (spawnPos) enemies.push({ ...type, typeKey, x: spawnPos.x, y: spawnPos.y, maxHp: type.hp, opacity: 1, isBoss: false });
      }
    } else {
      let floor = game.currentMap === 'training_grounds' ? 0 : currentFloor;
      let types = floorEnemies[floor] || ['slime'];
      let typeKey = types[Math.floor(Math.random() * types.length)];
      let type = enemyTypes[typeKey];
      let spawnPos = randomFloorTile(nx, ny, 5);
      if (spawnPos) {
        enemies.push({ ...type, typeKey, x: spawnPos.x, y: spawnPos.y, maxHp: type.hp, opacity: 1, isBoss: false });
      }
    }
  }
}

function interactNPC(npc) {
  if (npc.questRatTailsNPC) {
    if (!game.flags.questRatTails) game.flags.questRatTails = { started: false, count: 0, complete: false };
    let q = game.flags.questRatTails;
    if (q.complete) {
      msg("Old Farmer: \"You've already rid these grounds of those blasted mice. Thank you, adventurer!\"");
      return;
    }
    let tailCount = game.inventory.filter(id => id === 'rat_tail').length;
    if (!q.started) {
      q.started = true;
      q.count = 0;
      toast('Quest started: Rat Tails (0/10)', 'green');
      msg("Old Farmer: \"Those blasted mice in here... I've been trying to get rid of them for years. If you bring me 10 rat tails, I'll make it worth your while. Deal?\"");
    } else if (tailCount >= 10) {
      // Remove 10 rat_tails from inventory
      let removed = 0;
      for (let i = game.inventory.length - 1; i >= 0 && removed < 10; i--) {
        if (game.inventory[i] === 'rat_tail') { removeInventoryItem(i); removed++; }
      }
      addInventoryItem('ratcatchers_amulet');
      q.complete = true;
      q.count = 10;
      toast("Quest Complete! Received Ratcatcher's Amulet!", 'green');
      msg("Old Farmer: \"By the harvest gods, you actually did it! Take this amulet — it's served me well, but you've earned it.\"");
    } else {
      q.count = tailCount;
      msg(`Old Farmer: "Keep hunting those mice! You've got ${tailCount}/10 rat tails so far."`);
    }
    return;
  }
  if (npc.dungeonGuard) {
    if (game.player.lvl >= (npc.minLevel || 5) || game.flags.dragonsgateOpen) {
      game.flags.dragonsgateOpen = true;
      msg('Guard: "You have proven your worth, adventurer. The dungeon is open to you. Be warned — death waits below."');
    } else {
      msg(`Guard: "Halt! The dungeon passage is sealed. You must reach level ${npc.minLevel || 5} before I let you through. Train harder."`);
    }
    return;
  }
  msg(npc.dialog);
  if (npc.shop)            openShop();
  if (npc.elvenShop)       openElvenShop();
  if (npc.silverforgeShop) openSilverforge();
  if (npc.lorekeeperShop)  openLorekeeper();
  if (npc.herbalistShop)   openHerbalist();
  if (npc.bowyerShop)      openBowyer();
  if (npc.armoryShop)      openArmory();
  if (npc.warGoodsShop)    openWarGoods();
  if (npc.heal) {
    game.player.hp = game.player.maxHp;
    toast('Health fully restored!', 'green');
    msg('Your health has been fully restored!');
  }
  if (npc.inn) {
    game.player.hp = game.player.maxHp;
    game.player.mana = game.player.maxMana || 0;
    let drunkBefore = game.player.drunkLevel || 0;
    if (drunkBefore > 0) {
      game.player.drunkLevel = Math.max(0, drunkBefore - 10);
      let drunkMsg = game.player.drunkLevel > 0 ? ` You sleep off some of the booze. 🍺 ${game.player.drunkLevel} remaining.` : ' You sleep it off and feel sober.';
      toast('Fully rested!', 'green');
      msg('You rest and wake fully refreshed.' + drunkMsg);
    } else {
      toast('Fully rested at the Inn!', 'green');
      msg('You rest at the Inn and wake fully refreshed.');
    }
  }
  if (npc.steveBar)    openSteveBar();
  if (npc.fireShop)    openFireShop();
  if (npc.iceShop)     openIceShop();
  if (npc.shadowShop)  openShadowShop();
  if (npc.dwarfShop)   openDwarfShop();
  if (npc.holyShop)    openHolyShop();
  if (npc.voidShop)       openVoidShop();
  if (npc.sunkenShop)     openSunkenShop();
  if (npc.brimstoneShop)  openBrimstoneShop();
  if (npc.trainer) openTrainer();
  if (npc.sparring) openSparring();
  if (npc.library) openLibrary();
  if (npc.gambling) openGamblingMenu();
}

function interactInDirection(dx, dy) {
  if (isCombatOpen()) return;
  let nx = game.player.x + dx, ny = game.player.y + dy;
  if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return;
  let map = getMap();
  let tile = map[ny][nx];
  if (game.currentMap !== 'world') {
    for (let npc of (npcs[game.currentMap] || [])) {
      if (npc.x === nx && npc.y === ny) { interactNPC(npc); return; }
    }
    for (let i = 0; i < enemies.length; i++) {
      if (!enemies[i].defeated && enemies[i].x === nx && enemies[i].y === ny) { startCombat(i); return; }
    }
    if (tile === T.CHEST) { activateChest(map, nx, ny); return; }
    if (tile === T.STAIRS_DOWN) {
      game.player.x = nx; game.player.y = ny;
      if (game.currentMap === 'town') { enterTrainingGrounds(); return; }
      else if (game.currentMap === 'dragons_gate') enterDungeon(1, 'down');
      else if (isDungeonMap(game.currentMap)) {
        if (currentFloor >= 3) { msg('The stairs end here — you have reached the deepest level of the dungeon.'); return; }
        enterDungeon(currentFloor + 1, 'down');
      }
      return;
    }
    if (tile === T.STAIRS_UP) {
      game.player.x = nx; game.player.y = ny;
      if (currentFloor > 1) enterDungeon(currentFloor - 1, 'up'); else leaveDungeon();
      return;
    }
    if (tile === T.SIGN) { readSign(nx, ny); return; }
  }
  // Otherwise just move
  movePlayer(dx, dy);
}

function findSafeSpawn(map, x, y) {
  if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H && map[y][x] === T.FLOOR && !enemies.some(e => e.x === x && e.y === y)) return { x, y };
  for (let r = 1; r < Math.max(MAP_W, MAP_H); r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H && map[ny][nx] === T.FLOOR && !enemies.some(e => e.x === nx && e.y === ny)) return { x: nx, y: ny };
      }
    }
  }
  return findNearestFloor(map, x, y);
}

function enterDungeon(floor, direction = 'down') {
  // Track origin so leaveDungeon knows where to return
  if (floor === 1) game.flags.dungeonOrigin = game.currentMap;
  currentFloor = floor;
  game.currentMap = `dungeon_${floor}`;
  // Use stored static map if already generated; otherwise generate and cache it.
  let gmKey = `dragons_dungeon_floor_${floor}`;
  if (!generatedMaps[gmKey]) {
    dungeonData[game.currentMap] = generateDungeon(floor);
    generatedMaps[gmKey] = dungeonData[game.currentMap];
  } else {
    dungeonData[game.currentMap] = generatedMaps[gmKey];
  }
  let dungMap = dungeonData[game.currentMap].map;
  // Compute player spawn position first so enemies can be placed away from it.
  // Going down (entering from above) → spawn near STAIRS_UP on this floor (the entrance marker).
  // Going up (returning from below) → spawn near STAIRS_DOWN on this floor (the stairs you came from).
  let spawnTile = (direction === 'up') ? T.STAIRS_DOWN : T.STAIRS_UP;
  let stairs = findTile(dungMap, spawnTile);
  let spawnPos = findSafeSpawn(dungMap, stairs.x, stairs.y + 1);
  spawnEnemies(floor, spawnPos.x, spawnPos.y);
  game.player.x = spawnPos.x; game.player.y = spawnPos.y;
  spawnParticles(game.player.x * TILE + TILE / 2, game.player.y * TILE + TILE / 2, 'dungeon');
  showFloorIndicator(`DUNGEON LEVEL ${floor} / 3`, 2500);
  toast(`Dungeon level ${floor} / 3`, 'blue');
  msg(`Dungeon level ${floor} of 3...`);
}

function leaveDungeon() {
  enterLocation('dragons_gate', 19, 36, "DRAGON'S GATE", "Returned to Dragon's Gate", 'green', "You climb back up into Dragon's Gate.");
}

// Shared transition for any exit to the world map. Spawn position differs by origin.
function enterWorldMapAt(x, y, leaveMsg) {
  game.currentMap = 'world';
  game.player.x = x; game.player.y = y;
  enemies = [];
  showFloorIndicator('WORLD MAP', 2500);
  toast('Entered World Map', 'blue');
  msg(leaveMsg);
}

function enterWorldMap() {
  enterWorldMapAt(19, 17, 'You step out into the wider world...');
}

function enterWorldMapFromElven() {
  enterWorldMapAt(26, 11, 'You leave the Elven Town...');
}

function enterWorldMapFromDragonsGate() {
  enterWorldMapAt(19, 24, "You march out through Dragon's Gate...");
}

function enterDragonsGate() {
  enterLocation('dragons_gate', 20, 2, "DRAGON'S GATE", "Entered Dragon's Gate", 'red', "You pass through the iron gates of Dragon's Gate...");
}

function enterTownFromWorld() {
  enterLocation('town', 20, 2, 'TOWN OF ATLAS', 'Entered Town', 'green', 'Back in town.');
}

function enterElvenTown() {
  enterLocation('elven_town', 20, 2, 'ELVEN TOWN', 'Entered Elven Town', 'green', 'You enter the ancient Elven Town...');
}

function enterRogueCove() {
  enterLocation('rogue_cove', 20, 2, "ROGUE'S COVE", "Entered Rogue's Cove", 'red', "You slip through the gates of Rogue's Cove. The stench of rum and salt fills the air...");
}

function enterTrainingGrounds() {
  game.currentMap = 'training_grounds';
  game.player.x = 20; game.player.y = 6;
  enemies = [];
  spawnEnemies(0, 20, 6);
  // Extra rats — the grounds are infested
  for (let i = 0; i < 18; i++) {
    let ratType = enemyTypes['rat'];
    let pos = randomFloorTile(20, 6, 5);
    if (pos) enemies.push({ ...ratType, typeKey: 'rat', x: pos.x, y: pos.y, maxHp: ratType.hp, opacity: 1 });
  }
  showFloorIndicator('TRAINING GROUNDS', 2000);
  toast('Entered Training Grounds', 'green');
  msg('You enter the town training grounds. Watch your step — the place is crawling with rats!');
}

function leaveTrainingGrounds() {
  enterLocation('town', 20, 34, 'TOWN OF ATLAS', 'Returned to Town', 'green', 'You exit the training grounds back into town.');
}

function enterWorldMapFromRogueCove() {
  enterWorldMapAt(6, 33, "You leave Rogue's Cove behind...");
}


function enterNewArea(mapId, indicatorText, toastMsg, entryMsg, wx, wy) {
  game.currentMap = mapId;
  game.player.x = 20; game.player.y = 2;
  enemies = [];
  spawnAreaEnemies(mapId, 20, 2);
  // Store world map return coords on the area flag
  if (!game.flags.areaOrigins) game.flags.areaOrigins = {};
  game.flags.areaOrigins[mapId] = { x: wx, y: wy };
  showFloorIndicator(indicatorText, 2000);
  toast(toastMsg, 'red');
  msg(entryMsg);
}

function enterVolcanicWastes() {
  enterNewArea('volcanic_wastes', 'VOLCANIC WASTES', 'Entered Volcanic Wastes', 'The scorching heat of the Volcanic Wastes hits you like a wall of fire...', 5, 29);
}
function enterFrozenPeaks() {
  enterNewArea('frozen_peaks', 'FROZEN PEAKS', 'Entered Frozen Peaks', 'A bitter blizzard wind greets you at the Frozen Peaks...', 5, 4);
}
function enterShadowForest() {
  enterNewArea('shadow_forest', 'SHADOW FOREST', 'Entered Shadow Forest', 'You step into the Shadow Forest — darkness closes in around you...', 37, 21);
}
function enterDwarfFortress() {
  enterNewArea('dwarf_fortress', 'DWARF FORTRESS', 'Entered Dwarf Fortress', 'The iron gates of the Dwarf Fortress slam shut behind you...', 37, 11);
}
function enterRuinsAethoria() {
  enterNewArea('ruins_aethoria', 'RUINS OF AETHORIA', 'Entered Ruins of Aethoria', 'Ancient golden light filters through crumbling pillars of Aethoria...', 26, 21);
}

function enterTheAbyss() {
  let playerLevel = (game.player && game.player.lvl) || 1;
  if (playerLevel < 15) {
    toast('Level 15 required!', 'red');
    msg('An oppressive force repels you. You feel that only the most powerful warriors could survive what lies beyond. (Requires level 15)');
    return;
  }
  enterNewArea('the_abyss', 'THE ABYSS', 'Entered The Abyss', 'Reality fractures around you as you step into the Abyss. The darkness is absolute.', 20, 36);
}
function enterSunkenTemple() {
  let playerLevel = (game.player && game.player.lvl) || 1;
  if (playerLevel < 8) {
    toast('Level 8 required!', 'red');
    msg('The flooded gate is sealed by ancient magic. You feel the pressure of the deep — only those of level 8 or above may enter.');
    return;
  }
  enterNewArea('sunken_temple', 'THE SUNKEN TEMPLE', 'Entered Sunken Temple', 'Cold water rushes past your boots as you step through the flooded gate of the Sunken Temple...', 31, 32);
}
function enterTheUnderworld() {
  let playerLevel = (game.player && game.player.lvl) || 1;
  if (playerLevel < 12) {
    toast('Level 12 required!', 'red');
    msg('The iron gates of the Underworld pulse with hellfire. A voice echoes: "Only the worthy — level 12 or above — shall pass."');
    return;
  }
  enterNewArea('the_underworld', 'THE UNDERWORLD', 'Entered The Underworld', 'The iron gates swing open with a shriek of twisted metal. Brimstone fills your lungs as you descend into the Underworld...', 15, 36);
}

function leaveNewArea() {
  let origins = (game.flags.areaOrigins || {});
  let o = origins[game.currentMap] || { x: 19, y: 17 };
  let leaveMsg = `You leave ${game.currentMap.replace(/_/g,' ')} behind...`;
  enterWorldMapAt(o.x, o.y, leaveMsg);
}

function findTile(map, tile) {
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++)
      if (map[y][x] === tile) return { x, y };
  return { x: 20, y: 20 };
}

// ─── CORPSE RECOVERY ─────────────────────────────────────────────────────────
function checkCorpseRecovery() {
  if (!game.corpse) return;
  if (game.corpse.map !== game.currentMap) return;
  if (game.corpse.x !== game.player.x || game.corpse.y !== game.player.y) return;
  let recovered = [];
  for (let [slot, itemId] of Object.entries(game.corpse.items)) {
    // Always return to inventory — player must manually re-equip after recovery
    addInventoryItem(itemId);
    recovered.push(itemId);
  }
  for (let itemId of (game.corpse.inventoryItems || [])) {
    addInventoryItem(itemId);
    recovered.push(itemId);
  }
  game.corpse = null;
  let names = recovered.map(id => (itemDefs[id] || {}).name || id).join(', ');
  toast('Items recovered!', 'green');
  msg(recovered.length > 0 ? `Recovered: ${names}` : 'You recovered your corpse.');
  saveGame();
}

// ─── CHESTS ──────────────────────────────────────────────────────────────────
function openChest() {
  let drops = floorDrops[currentFloor] || floorDrops[1];
  let goldFound = 5 + Math.floor(Math.random() * 15 * currentFloor);
  game.player.gold += goldFound;
  if (Math.random() < 0.5) {
    let itemId = drops[Math.floor(Math.random() * drops.length)];
    addInventoryItem(itemId);
    let item = itemDefs[itemId];
    toast(`Found ${item.name}!`, 'green');
    msg(`Found ${goldFound} gold and ${item.name}!`);
  } else {
    toast(`Found ${goldFound} gold!`, '');
    msg(`Found ${goldFound} gold!`);
  }
}
