// data_enemies.js — Enemy type definitions, floor/area spawn tables, spawn helpers.
// Depends on: constants.js (T, MAP_W, MAP_H), map.js (getMap).
// Provides: enemyTypes, floorEnemies, floorBosses, areaEnemyPools, spawnAreaEnemies,
//           bossLoot, enemies, chestsOpened, WALKABLE_TILES, isWalkableTile,
//           randomFloorTile, spawnEnemies.

const enemyTypes = {
  // ── Dungeon enemies (floor 1 ×2, floor 2 ×5, floor 3 ×10 of base) ─────────
  slime:         { name:'Slime',          color:'#4a4',    hp:24,     atk:12,  def:0,   xp:8,   gold:[2,5],      drawKey:'slime'    },
  giant_rat:     { name:'Giant Rat',      color:'#864',    hp:36,     atk:20,  def:2,   xp:12,  gold:[3,8],      drawKey:'giant_rat' },
  skeleton:      { name:'Skeleton',       color:'#ddd',    hp:150,    atk:80,  def:10,  xp:20,  gold:[8,15],     drawKey:'skeleton' },
  bat:           { name:'Cave Bat',       color:'#639',    hp:110,    atk:70,  def:5,   xp:15,  gold:[5,10],     drawKey:'bat'      },
  knight:        { name:'Dark Knight',    color:'#335',    hp:450,    atk:240, def:50,  xp:35,  gold:[15,25],    drawKey:'knight',   damageType:'dark' },
  dragon:        { name:'Dragon',         color:'#a22',    hp:1000,   atk:360, def:80,  xp:100, gold:[50,100],   drawKey:'dragon', isBoss:true, damageType:'fire' },
  // ── Training Grounds (beginner area, tiered by player level) ─────────────
  // Tier 1 (lvl 1-2): Rat, Rabbit, Bird, Squirrel
  rat:       { name:'Rat',       color:'#7a6a55', hp:60,  atk:16, def:0, xp:15, gold:[1,2],   drawKey:'rat',      drops:['rat_tail'],          dropChance:0.2,  minLevel:1 },
  rabbit:    { name:'Rabbit',    color:'#e0e0e0', hp:75,  atk:24, def:1, xp:25, gold:[2,4],   drawKey:'rabbit',   drops:['rabbit_fur_jacket'], dropChance:0.3,  minLevel:1 },
  bird:      { name:'Bird',      color:'#3377bb', hp:80,  atk:30, def:2, xp:35, gold:[4,7],   drawKey:'bird',     drops:['feather'],           dropChance:0.35, minLevel:1 },
  squirrel:  { name:'Squirrel',  color:'#7a3a10', hp:65,  atk:20, def:1, xp:20, gold:[3,5],   drawKey:'squirrel', drops:['acorn'],             dropChance:0.4,  minLevel:1 },
  // Tier 3 (lvl 3-4): Mole, Frog
  mole:      { name:'Mole',      color:'#5c4033', hp:100, atk:40, def:3, xp:45, gold:[7,10],  drawKey:'mole',     minLevel:3 },
  frog:      { name:'Frog',      color:'#4caf50', hp:90,  atk:44, def:2, xp:50, gold:[9,12],  drawKey:'frog',     minLevel:3 },
  // Tier 4 (lvl 5-6): Badger, Snake
  badger:    { name:'Badger',    color:'#78909c', hp:150, atk:56, def:6, xp:70, gold:[14,18], drawKey:'badger',   minLevel:5 },
  snake:     { name:'Snake',     color:'#8bc34a', hp:120, atk:64, def:4, xp:65, gold:[12,15], drawKey:'snake',    minLevel:5 },
  // Tier 5 (lvl 7+): Wild Boar, Hawk
  wild_boar: { name:'Wild Boar', color:'#8d6e63', hp:200, atk:80, def:8, xp:90, gold:[18,24], drawKey:'wild_boar', minLevel:7 },
  hawk:      { name:'Hawk',      color:'#ff8f00', hp:180, atk:90, def:5, xp:80, gold:[16,22], drawKey:'hawk',     minLevel:7 },
  // ── World map — Near road (1-3 tiles) — warmup ────────────────────────────
  wolf:          { name:'Wolf',           color:'#8b5e3c', hp:80,     atk:30,  def:2,   xp:15,  gold:[8,12],     drawKey:'wolf'         },
  bandit:        { name:'Bandit',         color:'#654321', hp:120,    atk:40,  def:5,   xp:20,  gold:[12,18],    drawKey:'bandit'       },
  goblin:        { name:'Goblin',         color:'#5a8f3c', hp:60,     atk:36,  def:3,   xp:15,  gold:[10,14],    drawKey:'goblin'       },
  // ── Dungeon floor bosses ───────────────────────────────────────────────────
  slime_king:    { name:'Slime King',     color:'#22bb55', hp:300,    atk:40,  def:5,   xp:40,  gold:[20,30],    drawKey:'slime_king',  isBoss:true },
  skeleton_king: { name:'Skeleton King', color:'#eeeebb', hp:800,    atk:140, def:25,  xp:60,  gold:[30,50],    drawKey:'skeleton_king', isBoss:true, damageType:'dark' },
  // ── World map — Mid distance (4-7 tiles) — dangerous ─────────────────────
  dark_knight:   { name:'Dark Knight',    color:'#334466', hp:5000,   atk:160, def:20,  xp:80,  gold:[45,55],    drawKey:'dark_knight', isBoss:true, damageType:'dark' },
  cave_troll:    { name:'Cave Troll',     color:'#556b2f', hp:8000,   atk:120, def:30,  xp:90,  gold:[50,60],    drawKey:'cave_troll',  isBoss:true },
  wyvern:        { name:'Wyvern',         color:'#8b0000', hp:4000,   atk:200, def:15,  xp:100, gold:[60,70],    drawKey:'wyvern'       },
  // ── World map — Far from road (8+ tiles) — world boss markers ─────────────
  elder_dragon:  { name:'Elder Dragon',   color:'#cc2200', hp:500000, atk:600, def:80,  xp:500, gold:[180,220],  drawKey:'elder_dragon', isBoss:true },
  void_hydra:    { name:'Void Hydra',     color:'#6600cc', hp:400000, atk:500, def:60,  xp:450, gold:[160,200],  drawKey:'void_hydra',  isBoss:true, damageType:'dark' },
  titan_golem:   { name:'Titan Golem',    color:'#778899', hp:800000, atk:400, def:150, xp:400, gold:[130,170],  drawKey:'titan_golem', isBoss:true },
  // ── Volcanic Wastes (level 5+ scaling) ────────────────────────────────────
  ember_sprite:    { name:'Ember Sprite',    color:'#ff4500', hp:40,  atk:30, def:2,  xp:25,  gold:[8,14],   drawKey:'ember_sprite',    damageType:'fire' },
  lava_crab:       { name:'Lava Crab',       color:'#8b2500', hp:80,  atk:40, def:8,  xp:40,  gold:[14,22],  drawKey:'lava_crab',       damageType:'fire' },
  fire_elemental:  { name:'Fire Elemental',  color:'#ff6600', hp:150, atk:70, def:5,  xp:80,  gold:[22,34],  drawKey:'fire_elemental',  damageType:'fire' },
  molten_golem:    { name:'Molten Golem',    color:'#5a1a0a', hp:300, atk:100, def:15, xp:150, gold:[40,60],  drawKey:'molten_golem',    damageType:'fire', isBoss:true },
  // ── Frozen Peaks (level 6+ scaling) ───────────────────────────────────────
  frost_sprite:      { name:'Frost Sprite',      color:'#a8d8ea', hp:30,  atk:24, def:3,  xp:20,  gold:[7,12],   drawKey:'frost_sprite',      damageType:'ice' },
  snow_wolf:         { name:'Snow Wolf',          color:'#e8f4f8', hp:90,  atk:44, def:6,  xp:45,  gold:[15,25],  drawKey:'snow_wolf',         damageType:'ice' },
  ice_revenant:      { name:'Ice Revenant',       color:'#1a5c7a', hp:160, atk:60, def:12, xp:85,  gold:[25,40],  drawKey:'ice_revenant',      damageType:'ice' },
  ancient_frost_giant: { name:'Ancient Frost Giant', color:'#0d2d44', hp:350, atk:90, def:20, xp:180, gold:[50,80],  drawKey:'ancient_frost_giant', damageType:'ice', isBoss:true },
  // ── Shadow Forest (level 7+ scaling) ──────────────────────────────────────
  shadow_spider:   { name:'Shadow Spider',   color:'#1a1a0a', hp:50,  atk:36, def:4,  xp:35,  gold:[10,18],  drawKey:'shadow_spider',   damageType:'poison' },
  venom_wolf:      { name:'Venom Wolf',      color:'#2d3a1a', hp:100, atk:50, def:5,  xp:50,  gold:[16,26],  drawKey:'venom_wolf',      damageType:'poison' },
  forest_wraith:   { name:'Forest Wraith',   color:'#3d2b1f', hp:180, atk:70, def:8,  xp:90,  gold:[28,44],  drawKey:'forest_wraith',   damageType:'dark' },
  ancient_treant:  { name:'Ancient Treant',  color:'#0a1a0a', hp:400, atk:80, def:25, xp:200, gold:[60,90],  drawKey:'ancient_treant',  damageType:'poison', isBoss:true },
  // ── Dwarf Fortress (level 8+ scaling) ─────────────────────────────────────
  dwarf_militia:   { name:'Dwarf Militia',   color:'#5a5a5a', hp:120, atk:50, def:10, xp:55,  gold:[18,28],  drawKey:'dwarf_militia'   },
  rock_golem:      { name:'Rock Golem',      color:'#3a3a3a', hp:250, atk:70, def:20, xp:100, gold:[30,50],  drawKey:'rock_golem'      },
  siege_dwarf:     { name:'Siege Dwarf',     color:'#8b6914', hp:180, atk:80, def:8,  xp:80,  gold:[25,40],  drawKey:'siege_dwarf'     },
  forge_guardian:  { name:'Forge Guardian',  color:'#cd9b1d', hp:500, atk:110, def:30, xp:250, gold:[70,110], drawKey:'forge_guardian',  isBoss:true },
  // ── Ruins of Aethoria (level 9+ scaling) ──────────────────────────────────
  skeleton_archer:  { name:'Skeleton Archer',  color:'#d4a017', hp:80,  atk:56, def:5,  xp:45,  gold:[14,24],  drawKey:'skeleton_archer'  },
  undead_knight:    { name:'Undead Knight',    color:'#8b6914', hp:200, atk:80, def:15, xp:100, gold:[32,52],  drawKey:'undead_knight'    },
  corrupted_priest: { name:'Corrupted Priest', color:'#f5e6c8', hp:150, atk:60, def:10, xp:80,  gold:[26,42],  drawKey:'corrupted_priest', damageType:'holy' },
  ancient_guardian: { name:'Ancient Guardian', color:'#4a3728', hp:600, atk:120, def:35, xp:300, gold:[90,140], drawKey:'ancient_guardian', damageType:'holy', isBoss:true },
  // ── The Abyss (level 15+ required) ────────────────────────────────────────
  abyssal_crawler: { name:'Abyssal Crawler', color:'#1a0a2a', hp:800,  atk:160, def:20, xp:250,  gold:[80,120],  drawKey:'abyssal_crawler', damageType:'dark' },
  void_wraith:     { name:'Void Wraith',     color:'#2a0a3a', hp:1200, atk:200, def:30, xp:400,  gold:[120,180], drawKey:'void_wraith',     damageType:'dark' },
  reality_ripper:  { name:'Reality Ripper',  color:'#0a1a3a', hp:1500, atk:240, def:40, xp:600,  gold:[160,240], drawKey:'reality_ripper',  damageType:'dark' },
  elder_thing:     { name:'Elder Thing',     color:'#1a0a1a', hp:2000, atk:300, def:50, xp:800,  gold:[200,300], drawKey:'elder_thing',     damageType:'dark' },
  the_unnamed_one: { name:'The Unnamed One', color:'#0a0014', hp:5000, atk:400, def:80, xp:2000, gold:[400,600], drawKey:'the_unnamed_one', damageType:'dark', isBoss:true },
  // ── Sunken Temple (level 8+ scaling) ──────────────────────────────────────
  drowned_spirit:   { name:'Drowned Spirit',   color:'#4a8ab0', hp:200,  atk:60,  def:8,  xp:80,  gold:[20,35],  drawKey:'drowned_spirit',   damageType:'ice'  },
  water_elemental:  { name:'Water Elemental',  color:'#1a5a7a', hp:350,  atk:90,  def:15, xp:150, gold:[40,65],  drawKey:'water_elemental',  damageType:'ice'  },
  temple_guardian:  { name:'Temple Guardian',  color:'#2a3a4a', hp:500,  atk:110, def:25, xp:200, gold:[60,90],  drawKey:'temple_guardian'                     },
  siren:            { name:'Siren',            color:'#6090b0', hp:250,  atk:80,  def:10, xp:160, gold:[45,70],  drawKey:'siren',            damageType:'ice'  },
  drowned_king:     { name:'The Drowned King', color:'#0a2a3a', hp:1500, atk:160, def:40, xp:800, gold:[250,350],drawKey:'drowned_king',     damageType:'ice', isBoss:true },
  // ── The Underworld (level 12+ required) ──────────────────────────────────
  imp:            { name:'Imp',            color:'#8b0000', hp:150,  atk:70,  def:5,   xp:60,   gold:[10,20],  drawKey:'imp',            damageType:'fire' },
  hell_hound:     { name:'Hell Hound',     color:'#3a0a0a', hp:300,  atk:110, def:12,  xp:120,  gold:[20,35],  drawKey:'hell_hound',     damageType:'fire' },
  demon_soldier:  { name:'Demon Soldier',  color:'#5a0a0a', hp:450,  atk:140, def:20,  xp:180,  gold:[35,55],  drawKey:'demon_soldier',  damageType:'fire' },
  tormented_soul: { name:'Tormented Soul', color:'#2a2a3a', hp:250,  atk:90,  def:8,   xp:100,  gold:[18,30],  drawKey:'tormented_soul', damageType:'dark' },
  pit_fiend:      { name:'Pit Fiend',      color:'#3a0505', hp:2500, atk:260, def:60,  xp:1500, gold:[200,400],drawKey:'pit_fiend',      damageType:'fire', isBoss:true },
};
const floorEnemies = { 0:['rat','rat','rat','rat','rat','rat','rat','rat','rat','rat','rabbit','bird','squirrel','mole','frog'], 1:['slime','giant_rat'], 2:['skeleton','bat'], 3:['knight','dragon'] };
// One guaranteed boss per dungeon floor (separate from random enemy pool)
const floorBosses = { 1:'slime_king', 2:'skeleton_king' };

// ── Named area enemy pools (for the 5 new explorable areas) ─────────────────
const areaEnemyPools = {
  volcanic_wastes: { types: ['ember_sprite','lava_crab','fire_elemental'], boss: 'molten_golem',    count: 8 },
  frozen_peaks:    { types: ['frost_sprite','snow_wolf','ice_revenant'],   boss: 'ancient_frost_giant', count: 8 },
  shadow_forest:   { types: ['shadow_spider','venom_wolf','forest_wraith'],boss: 'ancient_treant', count: 16 },
  dwarf_fortress:  { types: ['dwarf_militia','rock_golem','siege_dwarf'],  boss: 'forge_guardian', count: 8 },
  ruins_aethoria:  { types: ['skeleton_archer','undead_knight','corrupted_priest'], boss: 'ancient_guardian', count: 8 },
  the_abyss:       { types: ['abyssal_crawler','void_wraith','reality_ripper','elder_thing'], boss: 'the_unnamed_one', count: 8 },
  sunken_temple:   { types: ['drowned_spirit','water_elemental','temple_guardian','siren'],  boss: 'drowned_king',   count: 8 },
  the_underworld:  { types: ['imp','hell_hound','demon_soldier','tormented_soul'], boss: 'pit_fiend', count: 8 },
};

// Spawn enemies for a named area (separate from the numeric-floor dungeon system).
function spawnAreaEnemies(areaKey, playerX, playerY) {
  enemies = [];
  let pool = areaEnemyPools[areaKey];
  if (!pool) return;
  for (let i = 0; i < pool.count; i++) {
    let typeKey = pool.types[Math.floor(Math.random() * pool.types.length)];
    let type = enemyTypes[typeKey];
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...type, typeKey, x: pos.x, y: pos.y, maxHp: type.hp, opacity: 1 });
  }
  // Spawn boss (~33% chance)
  if (pool.boss && Math.random() < 0.33) {
    let bossType = enemyTypes[pool.boss];
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...bossType, typeKey: pool.boss, x: pos.x, y: pos.y, maxHp: bossType.hp, opacity: 1 });
  }
}

// ─── BOSS LOOT TABLES ─────────────────────────────────────────────────────────
// Maps enemy typeKey → { item: itemId, chance: 0-1 }
const bossLoot = {
  dragon:        { item: 'dragon_slayer_sword', chance: 1.0 },
  skeleton_king: { item: 'bone_crown',          chance: 1.0 },
  slime_king:    { item: 'slime_core_ring',     chance: 1.0 },
  elder_dragon:  { item: 'dragon_heart_amulet', chance: 1.0 },
  titan_golem:   { item: 'titan_greaves',       chance: 0.8 },
  void_hydra:    { item: 'hydra_venom_blade',   chance: 0.8 },
  dark_knight:     { item: 'dark_knight_cuirass', chance: 0.6 },
  cave_troll:      { item: 'troll_hide_boots',    chance: 0.6 },
  the_unnamed_one: { item: 'void_reaver',          chance: 1.0 },
  drowned_king:    { item: 'trident_of_the_deep',  chance: 1.0 },
  pit_fiend:       { item: 'infernal_cleaver',      chance: 1.0 },
};

let enemies = [];
let chestsOpened = {};

// Returns a random floor tile position at least minDist tiles (Manhattan) from (avoidX, avoidY).
// avoidX/avoidY/minDist are optional. Tries up to 100 times, then falls back to any floor tile.
const WALKABLE_TILES = new Set([T.FLOOR, T.GRASS, T.GRASS_DARK, T.GRASS_LIGHT, T.VOLCANIC_FLOOR, T.SNOW, T.SHADOW_FLOOR, T.SACRED_GROUND, T.PATH, T.RING, T.DG_FLOOR, T.ELVEN_FLOOR, T.SAND, T.PLANK_FLOOR, T.DOCK, T.ABYSS_FLOOR, T.SUNKEN_FLOOR, T.HELL_FLOOR]);
function isWalkableTile(t) { return WALKABLE_TILES.has(t); }

function randomFloorTile(avoidX, avoidY, minDist) {
  let map = getMap();
  let hasAvoid = avoidX !== undefined && avoidY !== undefined && minDist > 0;
  for (let attempt = 0; attempt < 100; attempt++) {
    let x = 2 + Math.floor(Math.random() * (MAP_W - 4));
    let y = 2 + Math.floor(Math.random() * (MAP_H - 4));
    if (!isWalkableTile(map[y][x])) continue;
    if (hasAvoid && Math.abs(x - avoidX) + Math.abs(y - avoidY) < minDist) continue;
    return { x, y };
  }
  // Fallback: any walkable tile with no distance requirement
  for (let attempt = 0; attempt < 50; attempt++) {
    let x = 2 + Math.floor(Math.random() * (MAP_W - 4));
    let y = 2 + Math.floor(Math.random() * (MAP_H - 4));
    if (isWalkableTile(map[y][x])) return { x, y };
  }
  return null;
}

// playerX/playerY: expected player spawn position — enemies will spawn at least 5 tiles away.
function spawnEnemies(floor, playerX, playerY) {
  enemies = [];
  let types = floorEnemies[floor] || ['slime'];
  if (floor === 0) {
    let playerLevel = (typeof game !== 'undefined' && game.player) ? (game.player.lvl || 1) : 1;
    types = types.filter(k => (enemyTypes[k].minLevel || 1) <= playerLevel);
    if (!types.length) types = ['rat'];
  }
  let flags = (typeof game !== 'undefined' && game.flags) ? game.flags : {};
  let bossAdded = false;
  for (let i = 0; i < 5 + floor * 3; i++) {
    let typeKey = types[Math.floor(Math.random() * types.length)];
    let type = enemyTypes[typeKey];
    // At most one boss from the random pool per floor; skip if already killed
    if (type.isBoss) {
      if (bossAdded || flags[`boss_${typeKey}_dead`]) continue;
      bossAdded = true;
    }
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...type, typeKey, x: pos.x, y: pos.y, maxHp: type.hp, opacity: 1 });
  }
  // Rare Slime King spawn in Training Grounds (~20% chance)
  if (floor === 0 && Math.random() < 0.2) {
    let slimeKingType = enemyTypes['slime_king'];
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...slimeKingType, typeKey: 'slime_king', x: pos.x, y: pos.y, maxHp: slimeKingType.hp, opacity: 1 });
  }
  // Spawn guaranteed floor boss (one per floor, skip if already killed)
  let bossKey = floorBosses[floor];
  if (bossKey && !bossAdded && !flags[`boss_${bossKey}_dead`]) {
    let bossType = enemyTypes[bossKey];
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...bossType, typeKey: bossKey, x: pos.x, y: pos.y, maxHp: bossType.hp, opacity: 1 });
  }
}
