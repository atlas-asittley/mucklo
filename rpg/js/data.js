// data.js — Static game data: class definitions (5 classes), rarity tiers, set definitions,
// enemy types (dungeon floors + training grounds tiered by player level + world map tiers + bosses),
// boss loot tables, NPC definitions (town/training grounds/Dragon's Gate/Elven Town/Rogue's Cove),
// item definitions (weapons, armor, consumables, alcoholic drinks, quest items, boss drops),
// shop item lists per vendor (9 vendors), skill definitions with cooldowns/class restrictions,
// skill rank system, library books, and per-floor loot tables.
// Also holds mutable enemies[] and chestsOpened.
// Depends on: constants.js (MAP_W, MAP_H, T), map.js (getMap).

// ─── CLASS DEFINITIONS ────────────────────────────────────────────────────────
// statMods: delta from base 10. startHp/Atk/Def: initial combat stats.
// startSkills: pre-learned skill IDs. classRestriction on items lists which
// non-warrior classes may equip the item (warrior always bypasses restrictions).
const CLASS_DEFS = {
  warrior: {
    name: 'Warrior', icon: '⚔️',
    statMods: { STR: 3, CON: 2, INT: -2, WIS: -1 },
    startHp: 120, startAtk: 12, startDef: 8,
    startSkills: [],
    armorTypes: 'All armor', weaponTypes: 'All weapons',
    desc: 'Unstoppable frontliner. High HP and raw power.',
    baseMana: 20, manaPerInt: 2,
  },
  ranger: {
    name: 'Ranger', icon: '🏹',
    statMods: { DEX: 3, WIS: 2, CON: -2, STR: -1 },
    startHp: 85, startAtk: 10, startDef: 4,
    startSkills: [],
    armorTypes: 'Light armor', weaponTypes: 'Bows, daggers, staffs',
    desc: 'Agile archer with evasion and healing.',
    baseMana: 40, manaPerInt: 3,
  },
  mage: {
    name: 'Mage', icon: '🔮',
    statMods: { INT: 4, WIS: 2, CON: -3, STR: -2 },
    startHp: 65, startAtk: 6, startDef: 2,
    startSkills: [],
    armorTypes: 'Robes only', weaponTypes: 'Staffs, daggers, orbs',
    desc: 'Devastating spellcaster with powerful magic.',
    baseMana: 100, manaPerInt: 10,
  },
  paladin: {
    name: 'Paladin', icon: '🛡️',
    statMods: { STR: 2, CON: 2, WIS: 2, DEX: -1, INT: -1 },
    startHp: 110, startAtk: 10, startDef: 7,
    startSkills: [],
    armorTypes: 'Medium/heavy armor', weaponTypes: 'Swords, shields, staves',
    desc: 'Holy warrior blending combat and healing.',
    baseMana: 50, manaPerInt: 5,
  },
  rogue: {
    name: 'Rogue', icon: '🗡️',
    statMods: { DEX: 3, STR: 2, CON: -2, WIS: -1 },
    startHp: 80, startAtk: 11, startDef: 3,
    startSkills: [],
    armorTypes: 'Light armor', weaponTypes: 'Daggers, bows',
    desc: 'Fast and lethal, built for critical strikes.',
    baseMana: 30, manaPerInt: 3,
  },
};

const RARITY = {
  common:    { label:'Common',    color:'#9d9d9d', badge:''  },
  uncommon:  { label:'Uncommon',  color:'#2ecc71', badge:'◆' },
  rare:      { label:'Rare',      color:'#3498db', badge:'★' },
  epic:      { label:'Epic',      color:'#9b59b6', badge:'✦' },
  legendary: { label:'Legendary', color:'#f39c12', badge:'★' },
};

// ─── SET DEFINITIONS ─────────────────────────────────────────────────────────
// bonuses: { <pieces>: { stats: {atk,def,maxHp,STR,...}, passives: {dodge,crit,...} } }
const SET_DEFS = {
  moonlight: {
    name: 'Moonlight Set',
    bonuses: {
      2: { passives: { dodge: 5 } },
      3: { passives: { dodge: 10 }, stats: { INT: 5 } },
    },
  },
  silverforge: {
    name: 'Silverforge Set',
    bonuses: {
      2: { stats: { def: 3, atk: 2 } },
      3: { stats: { def: 6, atk: 4 }, passives: { thorns: 3 } },
    },
  },
  shadow: {
    name: 'Shadow Set',
    bonuses: {
      2: { passives: { crit: 8 } },
      3: { passives: { crit: 15, lifesteal: 5 } },
    },
  },
  dragon_scale: {
    name: 'Dragon Scale Set',
    bonuses: {
      2: { stats: { maxHp: 100, def: 5 } },
      3: { stats: { maxHp: 200, def: 10 }, passives: { burn: 5 } },
      4: { stats: { maxHp: 300, def: 15 }, passives: { burn: 10, reflect: 10 } },
    },
  },
  warriors_pride: {
    name: "Warrior's Pride Set",
    bonuses: {
      2: { stats: { atk: 5, STR: 2 } },
    },
  },
};

const enemyTypes = {
  // ── Dungeon enemies (floor 1 ×2, floor 2 ×5, floor 3 ×10 of base) ─────────
  slime:         { name:'Slime',          color:'#4a4',    hp:24,     atk:6,   def:0,   xp:8,   gold:[2,5],      drawKey:'slime'    },
  giant_rat:     { name:'Giant Rat',      color:'#864',    hp:36,     atk:10,  def:2,   xp:12,  gold:[3,8],      drawKey:'giant_rat' },
  skeleton:      { name:'Skeleton',       color:'#ddd',    hp:150,    atk:40,  def:10,  xp:20,  gold:[8,15],     drawKey:'skeleton' },
  bat:           { name:'Cave Bat',       color:'#639',    hp:110,    atk:35,  def:5,   xp:15,  gold:[5,10],     drawKey:'bat'      },
  knight:        { name:'Dark Knight',    color:'#335',    hp:450,    atk:120, def:50,  xp:35,  gold:[15,25],    drawKey:'knight',   damageType:'dark' },
  dragon:        { name:'Dragon',         color:'#a22',    hp:1000,   atk:180, def:80,  xp:100, gold:[50,100],   drawKey:'dragon', isBoss:true, damageType:'fire' },
  // ── Training Grounds (beginner area, tiered by player level) ─────────────
  // Tier 1 (lvl 1-2): Rat, Rabbit, Bird, Squirrel
  rat:       { name:'Rat',       color:'#7a6a55', hp:3,  atk:1,  def:0, xp:2,  gold:[1,1],   drawKey:'rat',      drops:['rat_tail'],          dropChance:0.2,  minLevel:1 },
  rabbit:    { name:'Rabbit',    color:'#e0e0e0', hp:8,  atk:2,  def:0, xp:5,  gold:[2,3],   drawKey:'rabbit',   drops:['rabbit_fur_jacket'], dropChance:0.3,  minLevel:1 },
  bird:      { name:'Bird',      color:'#3377bb', hp:15, atk:5,  def:1, xp:10, gold:[4,6],   drawKey:'bird',     drops:['feather'],           dropChance:0.35, minLevel:1 },
  squirrel:  { name:'Squirrel',  color:'#7a3a10', hp:12, atk:4,  def:0, xp:7,  gold:[3,4],   drawKey:'squirrel', drops:['acorn'],             dropChance:0.4,  minLevel:1 },
  // Tier 3 (lvl 3-4): Mole, Frog
  mole:      { name:'Mole',      color:'#5c4033', hp:25, atk:8,  def:2, xp:15, gold:[6,8],   drawKey:'mole',     minLevel:3 },
  frog:      { name:'Frog',      color:'#4caf50', hp:20, atk:10, def:1, xp:18, gold:[8,10],  drawKey:'frog',     minLevel:3 },
  // Tier 4 (lvl 5-6): Badger, Snake
  badger:    { name:'Badger',    color:'#78909c', hp:40, atk:12, def:4, xp:25, gold:[12,15], drawKey:'badger',   minLevel:5 },
  snake:     { name:'Snake',     color:'#8bc34a', hp:30, atk:15, def:2, xp:22, gold:[10,12], drawKey:'snake',    minLevel:5 },
  // Tier 5 (lvl 7+): Wild Boar, Hawk
  wild_boar: { name:'Wild Boar', color:'#8d6e63', hp:60, atk:18, def:6, xp:35, gold:[16,20], drawKey:'wild_boar', minLevel:7 },
  hawk:      { name:'Hawk',      color:'#ff8f00', hp:45, atk:20, def:3, xp:30, gold:[15,18], drawKey:'hawk',     minLevel:7 },
  // ── World map — Near road (1-3 tiles) — warmup ────────────────────────────
  wolf:          { name:'Wolf',           color:'#8b5e3c', hp:80,     atk:15,  def:2,   xp:15,  gold:[8,12],     drawKey:'wolf'         },
  bandit:        { name:'Bandit',         color:'#654321', hp:120,    atk:20,  def:5,   xp:20,  gold:[12,18],    drawKey:'bandit'       },
  goblin:        { name:'Goblin',         color:'#5a8f3c', hp:60,     atk:18,  def:3,   xp:15,  gold:[10,14],    drawKey:'goblin'       },
  // ── Dungeon floor bosses ───────────────────────────────────────────────────
  slime_king:    { name:'Slime King',     color:'#22bb55', hp:300,    atk:20,  def:5,   xp:40,  gold:[20,30],    drawKey:'slime_king',  isBoss:true },
  skeleton_king: { name:'Skeleton King', color:'#eeeebb', hp:800,    atk:70,  def:25,  xp:60,  gold:[30,50],    drawKey:'skeleton_king', isBoss:true, damageType:'dark' },
  // ── World map — Mid distance (4-7 tiles) — dangerous ─────────────────────
  dark_knight:   { name:'Dark Knight',    color:'#334466', hp:5000,   atk:80,  def:20,  xp:80,  gold:[45,55],    drawKey:'dark_knight', isBoss:true, damageType:'dark' },
  cave_troll:    { name:'Cave Troll',     color:'#556b2f', hp:8000,   atk:60,  def:30,  xp:90,  gold:[50,60],    drawKey:'cave_troll',  isBoss:true },
  wyvern:        { name:'Wyvern',         color:'#8b0000', hp:4000,   atk:100, def:15,  xp:100, gold:[60,70],    drawKey:'wyvern'       },
  // ── World map — Far from road (8+ tiles) — world boss markers ─────────────
  elder_dragon:  { name:'Elder Dragon',   color:'#cc2200', hp:500000, atk:300, def:80,  xp:500, gold:[180,220],  drawKey:'elder_dragon', isBoss:true },
  void_hydra:    { name:'Void Hydra',     color:'#6600cc', hp:400000, atk:250, def:60,  xp:450, gold:[160,200],  drawKey:'void_hydra',  isBoss:true, damageType:'dark' },
  titan_golem:   { name:'Titan Golem',    color:'#778899', hp:800000, atk:200, def:150, xp:400, gold:[130,170],  drawKey:'titan_golem', isBoss:true },
  // ── Volcanic Wastes (level 5+ scaling) ────────────────────────────────────
  ember_sprite:    { name:'Ember Sprite',    color:'#ff4500', hp:40,  atk:15, def:2,  xp:25,  gold:[8,14],   drawKey:'ember_sprite',    damageType:'fire' },
  lava_crab:       { name:'Lava Crab',       color:'#8b2500', hp:80,  atk:20, def:8,  xp:40,  gold:[14,22],  drawKey:'lava_crab',       damageType:'fire' },
  fire_elemental:  { name:'Fire Elemental',  color:'#ff6600', hp:150, atk:35, def:5,  xp:80,  gold:[22,34],  drawKey:'fire_elemental',  damageType:'fire' },
  molten_golem:    { name:'Molten Golem',    color:'#5a1a0a', hp:300, atk:50, def:15, xp:150, gold:[40,60],  drawKey:'molten_golem',    damageType:'fire', isBoss:true },
  // ── Frozen Peaks (level 6+ scaling) ───────────────────────────────────────
  frost_sprite:      { name:'Frost Sprite',      color:'#a8d8ea', hp:30,  atk:12, def:3,  xp:20,  gold:[7,12],   drawKey:'frost_sprite',      damageType:'ice' },
  snow_wolf:         { name:'Snow Wolf',          color:'#e8f4f8', hp:90,  atk:22, def:6,  xp:45,  gold:[15,25],  drawKey:'snow_wolf',         damageType:'ice' },
  ice_revenant:      { name:'Ice Revenant',       color:'#1a5c7a', hp:160, atk:30, def:12, xp:85,  gold:[25,40],  drawKey:'ice_revenant',      damageType:'ice' },
  ancient_frost_giant: { name:'Ancient Frost Giant', color:'#0d2d44', hp:350, atk:45, def:20, xp:180, gold:[50,80],  drawKey:'ancient_frost_giant', damageType:'ice', isBoss:true },
  // ── Shadow Forest (level 7+ scaling) ──────────────────────────────────────
  shadow_spider:   { name:'Shadow Spider',   color:'#1a1a0a', hp:50,  atk:18, def:4,  xp:35,  gold:[10,18],  drawKey:'shadow_spider',   damageType:'poison' },
  venom_wolf:      { name:'Venom Wolf',      color:'#2d3a1a', hp:100, atk:25, def:5,  xp:50,  gold:[16,26],  drawKey:'venom_wolf',      damageType:'poison' },
  forest_wraith:   { name:'Forest Wraith',   color:'#3d2b1f', hp:180, atk:35, def:8,  xp:90,  gold:[28,44],  drawKey:'forest_wraith',   damageType:'dark' },
  ancient_treant:  { name:'Ancient Treant',  color:'#0a1a0a', hp:400, atk:40, def:25, xp:200, gold:[60,90],  drawKey:'ancient_treant',  damageType:'poison', isBoss:true },
  // ── Dwarf Fortress (level 8+ scaling) ─────────────────────────────────────
  dwarf_militia:   { name:'Dwarf Militia',   color:'#5a5a5a', hp:120, atk:25, def:10, xp:55,  gold:[18,28],  drawKey:'dwarf_militia'   },
  rock_golem:      { name:'Rock Golem',      color:'#3a3a3a', hp:250, atk:35, def:20, xp:100, gold:[30,50],  drawKey:'rock_golem'      },
  siege_dwarf:     { name:'Siege Dwarf',     color:'#8b6914', hp:180, atk:40, def:8,  xp:80,  gold:[25,40],  drawKey:'siege_dwarf'     },
  forge_guardian:  { name:'Forge Guardian',  color:'#cd9b1d', hp:500, atk:55, def:30, xp:250, gold:[70,110], drawKey:'forge_guardian',  isBoss:true },
  // ── Ruins of Aethoria (level 9+ scaling) ──────────────────────────────────
  skeleton_archer:  { name:'Skeleton Archer',  color:'#d4a017', hp:80,  atk:28, def:5,  xp:45,  gold:[14,24],  drawKey:'skeleton_archer'  },
  undead_knight:    { name:'Undead Knight',    color:'#8b6914', hp:200, atk:40, def:15, xp:100, gold:[32,52],  drawKey:'undead_knight'    },
  corrupted_priest: { name:'Corrupted Priest', color:'#f5e6c8', hp:150, atk:30, def:10, xp:80,  gold:[26,42],  drawKey:'corrupted_priest', damageType:'holy' },
  ancient_guardian: { name:'Ancient Guardian', color:'#4a3728', hp:600, atk:60, def:35, xp:300, gold:[90,140], drawKey:'ancient_guardian', damageType:'holy', isBoss:true },
  // ── The Abyss (level 15+ required) ────────────────────────────────────────
  abyssal_crawler: { name:'Abyssal Crawler', color:'#1a0a2a', hp:800,  atk:80,  def:20, xp:250,  gold:[80,120],  drawKey:'abyssal_crawler', damageType:'dark' },
  void_wraith:     { name:'Void Wraith',     color:'#2a0a3a', hp:1200, atk:100, def:30, xp:400,  gold:[120,180], drawKey:'void_wraith',     damageType:'dark' },
  reality_ripper:  { name:'Reality Ripper',  color:'#0a1a3a', hp:1500, atk:120, def:40, xp:600,  gold:[160,240], drawKey:'reality_ripper',  damageType:'dark' },
  elder_thing:     { name:'Elder Thing',     color:'#1a0a1a', hp:2000, atk:150, def:50, xp:800,  gold:[200,300], drawKey:'elder_thing',     damageType:'dark' },
  the_unnamed_one: { name:'The Unnamed One', color:'#0a0014', hp:5000, atk:200, def:80, xp:2000, gold:[400,600], drawKey:'the_unnamed_one', damageType:'dark', isBoss:true },
  // ── Sunken Temple (level 8+ scaling) ──────────────────────────────────────
  drowned_spirit:   { name:'Drowned Spirit',   color:'#4a8ab0', hp:200,  atk:30,  def:8,  xp:80,  gold:[20,35],  drawKey:'drowned_spirit',   damageType:'ice'  },
  water_elemental:  { name:'Water Elemental',  color:'#1a5a7a', hp:350,  atk:45,  def:15, xp:150, gold:[40,65],  drawKey:'water_elemental',  damageType:'ice'  },
  temple_guardian:  { name:'Temple Guardian',  color:'#2a3a4a', hp:500,  atk:55,  def:25, xp:200, gold:[60,90],  drawKey:'temple_guardian'                     },
  siren:            { name:'Siren',            color:'#6090b0', hp:250,  atk:40,  def:10, xp:160, gold:[45,70],  drawKey:'siren',            damageType:'ice'  },
  drowned_king:     { name:'The Drowned King', color:'#0a2a3a', hp:1500, atk:80,  def:40, xp:800, gold:[250,350],drawKey:'drowned_king',     damageType:'ice', isBoss:true },
  // ── The Underworld (level 12+ required) ──────────────────────────────────
  imp:            { name:'Imp',            color:'#8b0000', hp:150,  atk:35,  def:5,   xp:60,   gold:[10,20],  drawKey:'imp',            damageType:'fire' },
  hell_hound:     { name:'Hell Hound',     color:'#3a0a0a', hp:300,  atk:55,  def:12,  xp:120,  gold:[20,35],  drawKey:'hell_hound',     damageType:'fire' },
  demon_soldier:  { name:'Demon Soldier',  color:'#5a0a0a', hp:450,  atk:70,  def:20,  xp:180,  gold:[35,55],  drawKey:'demon_soldier',  damageType:'fire' },
  tormented_soul: { name:'Tormented Soul', color:'#2a2a3a', hp:250,  atk:45,  def:8,   xp:100,  gold:[18,30],  drawKey:'tormented_soul', damageType:'dark' },
  pit_fiend:      { name:'Pit Fiend',      color:'#3a0505', hp:2500, atk:130, def:60,  xp:1500, gold:[200,400],drawKey:'pit_fiend',      damageType:'fire', isBoss:true },
};
const floorEnemies = { 0:['rat','rat','rat','rat','rat','rabbit','bird','squirrel','mole','frog'], 1:['slime','giant_rat'], 2:['skeleton','bat'], 3:['knight','dragon'] };
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
  for (let i = 0; i < 5 + floor * 3; i++) {
    let typeKey = types[Math.floor(Math.random() * types.length)];
    let type = enemyTypes[typeKey];
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...type, typeKey, x: pos.x, y: pos.y, maxHp: type.hp, opacity: 1 });
  }
  // Rare Slime King spawn in Training Grounds (~20% chance)
  if (floor === 0 && Math.random() < 0.2) {
    let slimeKingType = enemyTypes['slime_king'];
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...slimeKingType, typeKey: 'slime_king', x: pos.x, y: pos.y, maxHp: slimeKingType.hp, opacity: 1 });
  }
  // Spawn guaranteed floor boss (separate from random pool)
  let bossKey = floorBosses[floor];
  if (bossKey) {
    let bossType = enemyTypes[bossKey];
    let pos = randomFloorTile(playerX, playerY, 5);
    if (pos) enemies.push({ ...bossType, typeKey: bossKey, x: pos.x, y: pos.y, maxHp: bossType.hp, opacity: 1 });
  }
}

const npcs = {
  training_grounds: [
    { x:17, y:6, name:'Old Guard', drawKey:'guard', dialog:"Welcome to the Training Grounds! These peaceful gardens are home to rabbits, squirrels, birds, and mice. Train here before venturing into the wider world!" },
    { x:24, y:6, name:'Old Farmer', drawKey:'elder', questRatTailsNPC:true, dialog:"Those blasted mice in here... I've been trying to get rid of them for years. If you bring me 10 rat tails, I'll make it worth your while. Deal?" }
  ],
  town: [
    { x:12, y:14, name:'Shopkeeper', drawKey:'shopkeeper', dialog:'Welcome! Browse my wares.', shop:true },
    { x:28, y:14, name:'Healer',     drawKey:'healer',     dialog:'Let me restore your health...', heal:true },
    { x:12, y:26, name:'Old Man',    drawKey:'elder',      dialog:'The world beyond the roads is dangerous. Train in the grounds to the east before venturing out. And watch your step — the wilderness holds creatures that will swallow you whole.' },
    { x:28, y:26, name:'Guard',      drawKey:'guard',      dialog:'Be careful out there, adventurer.' },
    { x:20, y:19, name:'Villager',   drawKey:'villager',   dialog:"I heard there's a dragon on the 3rd floor!" },
    { x:34, y:14, name:'Master',     drawKey:'elder',      dialog:'Spend your skill points to grow stronger. Visit me after leveling up!', trainer:true },
    { x:34, y:26, name:'Sparring Master', drawKey:'guard', dialog:'Step into the ring and test your skills! No death here — only glory.', sparring:true },
    { x:7,  y:14, name:'Librarian',      drawKey:'elder', dialog:'Browse our collection, adventurer.', library:true },
  ],
  dragons_gate: [
    { x:20, y:4,  name:"Commander Rael",  drawKey:'guard',      dialog:"Dragon's Gate stands between civilization and the abyss. We hold the line here. Move along, soldier." },
    { x:7,  y:12, name:'Ironhelm',        drawKey:'shopkeeper', dialog:'Finest heavy armor in the realm. My steel has kept more soldiers alive than prayers ever have.', armoryShop:true },
    { x:32, y:12, name:'Siegemaster',     drawKey:'elder',      dialog:'War is a craft. Browse my stock and arm yourself properly before you march into that dungeon.', warGoodsShop:true },
    { x:32, y:25, name:'Guild Recruiter', drawKey:'villager',   dialog:"The dungeon below Dragon's Gate? Three floors of death. Monsters, traps, a dragon on the last floor. You'll need to be level 5 just to get past the gate guard." },
    { x:20, y:33, name:'City Guard',      drawKey:'guard',      dialog:'Halt! The dungeon passage is sealed to the weak. Prove yourself — reach level 5 and I will let you through.', dungeonGuard:true, minLevel:5 },
  ],
  rogue_cove: [
    { x:22, y:9,  name:'Captain Blackheart', drawKey:'guard',      dialog:"Welcome to Rogue's Cove, landlubber. Watch yer coin purse — this city has more nimble fingers than a ship's rigging." },
    { x:17, y:9,  name:'Guard',              drawKey:'guard',      dialog:'Move along. No bloodshed in the Cove streets — take disputes to the docks if you must.' },
    { x:6,  y:4,  name:'Madam Scarlet',      drawKey:'healer',     dialog:'Looking for rest and fine company? The Scarlet Lady offers the finest beds in the Cove.', inn:true },
    { x:6,  y:16, name:'Lucky Luca',         drawKey:'shopkeeper', dialog:"Care to test your luck, traveler? I have three games. The house always wins... eventually.", gambling:true },
    { x:26, y:16, name:'Salty Steve',        drawKey:'villager',   dialog:"Best rum in all the Cove, and that's a guarantee signed in salt. Pull up a stool, friend.", steveBar:true },
  ],
  volcanic_wastes: [
    { x:8,  y:18, name:'Pyromancer Zara', drawKey:'elder', dialog:'The heat here is my home, traveler. Browse my wares — forged in fire and fury.', fireShop:true },
    { x:25, y:15, name:'Fire Warden',     drawKey:'guard', dialog:'Watch your step — the lava flows shift without warning. Stay on the path.' },
  ],
  frozen_peaks: [
    { x:30, y:16, name:'Ice Merchant Kold', drawKey:'elder', dialog:'Brr! Welcome to the Frozen Emporium, the coldest shop in the world. Browse quickly before you freeze!', iceShop:true },
    { x:10, y:20, name:'Mountain Scout',    drawKey:'guard', dialog:'The peaks grow more treacherous further in. The frost giants have been restless lately.' },
  ],
  shadow_forest: [
    { x:7,  y:17, name:'Witch of the Woods', drawKey:'elder', dialog:'Ah, a visitor ventures into my forest. I have goods that might aid your survival here...', shadowShop:true },
    { x:25, y:10, name:'Lost Wanderer',      drawKey:'villager', dialog:"Don't go too deep into the forest. The ancient treant... it moves. It watches." },
  ],
  dwarf_fortress: [
    { x:9,  y:11, name:'Master Smith Thrain', drawKey:'shopkeeper', dialog:"Finest dwarven steel in all the realm. My forge burns day and night — nothing leaves here untempered.", dwarfShop:true },
    { x:30, y:11, name:'Quartermaster',       drawKey:'guard',      dialog:'This fortress has stood for three hundred years. The enemy will not breach these walls on my watch.' },
    { x:9,  y:29, name:'Drill Sergeant',      drawKey:'guard',      dialog:"You there! You've got soft hands. Train harder before you face the deeper threats of this realm." },
  ],
  ruins_aethoria: [
    { x:29, y:6,  name:'Elder Seraphina', drawKey:'elder', dialog:'These ruins hold the memory of an ancient civilization. Their power lingers still — as do their guardians.', holyShop:true },
    { x:20, y:13, name:'Tomb Scholar',    drawKey:'villager', dialog:'The inscriptions warn of an Ancient Guardian — the last sentinel of Aethoria. It will not yield willingly.' },
  ],
  the_abyss: [
    { x:8, y:9, name:'The Oracle', drawKey:'elder', dialog:'You dare enter the Abyss? Turn back, mortal. Only the void awaits you here.', voidShop:true },
  ],
  the_underworld: [
    { x:8, y:18, name:'Fallen Angel', drawKey:'fallen_angel', dialog:'I was cast down for questioning the order of heaven. Now I guard this gate against the unworthy.', brimstoneShop:true },
    { x:25, y:10, name:'Chained Shade', drawKey:'elder', dialog:'Chains of hellfire bind us here forever. But you... you still have a chance to leave.' },
  ],
  sunken_temple: [
    { x:8,  y:13, name:'Old Diver', drawKey:'old_diver', dialog:'These ruins have been flooded for centuries. The treasures within... some say they\'re cursed.', sunkenShop:true },
    { x:25, y:8,  name:'Temple Shade', drawKey:'elder', dialog:'"Here lies the king who dared defy the tide. His kingdom drowned. His treasure remains." — Inscription above the gate.' },
  ],
  elven_town: [
    { x:13, y:15, name:'Elven Merchant',    drawKey:'elven_merchant',   dialog:'Welcome to the Elven Market! Our goods are crafted with ancient magic.', elvenShop:true },
    { x:27, y:15, name:'Elven Town Master', drawKey:'elven_elder',       dialog:'You have found the hidden Elven Town. May the forest guide your path, adventurer.' },
    // Shop NPCs
    { x:5,  y:17, name:'Ironsmith Galadrel', drawKey:'elven_blacksmith', dialog:'My forge burns with moonfire. Every blade I craft sings with elven steel.', silverforgeShop:true },
    { x:36, y:11, name:'Innkeeper Miravel',  drawKey:'elven_innkeeper',  dialog:'Rest your weary bones, traveler. The Moonpetal Inn welcomes you.', inn:true },
    { x:28, y:5,  name:'Lorekeeper Thaeris', drawKey:'elven_lorekeeper', dialog:'Knowledge older than the stars awaits within these shelves. Browse, if you dare.', lorekeeperShop:true },
    { x:5,  y:30, name:'Herbalist Sylune',   drawKey:'elven_herbalist',  dialog:"The forest provides all remedies. Come, choose from nature's bounty.", herbalistShop:true },
    { x:36, y:30, name:'Bowyer Fenrath',     drawKey:'elven_bowyer',     dialog:'A true archer is patient, precise, and never wastes an arrow. Let me show you.', bowyerShop:true },
    // Non-shop NPCs
    { x:19, y:22, name:'Elder Sylvaril',  drawKey:'elven_elder',    dialog:'Long have the elves walked these lands. We were here before your kingdoms rose, and shall remain when they are dust.' },
    { x:22, y:3,  name:'Guard Captain',   drawKey:'guard',           dialog:'This road leads deeper into elven territory. Beyond this village, the ancient forest grows treacherous.' },
    { x:17, y:20, name:'Young Elf',       drawKey:'elven_villager',  dialog:'Psst! The lorekeeper keeps a secret passage in his archive... or so the other children say!' }
  ]
};

// ─── SPARRING ─────────────────────────────────────────────────────────────────
const sparringOpponents = [
  { name:'Training Dummy', hp:1000000, atk:1, def:0, xp:5, drawKey:'skeleton', label:'BEGINNER' },
];

// ─── ITEMS ───────────────────────────────────────────────────────────────────
const itemDefs = {
  // ── Alcoholic Drinks (Salty Steve's Bar, Rogue's Cove) ───────────────────
  ale:        { name:'Ale',          type:'consumable', effect:'drunk', drunkValue:10, value:8,  icon:'🍺', color:'#9d9d9d', rarity:'common',   desc:"A pint of ale. Drink responsibly." },
  whiskey:    { name:'Whiskey',      type:'consumable', effect:'drunk', drunkValue:25, value:20, icon:'🥃', color:'#2ecc71', rarity:'uncommon', desc:'Strong spirits. Handle with care.' },
  firebrandy: { name:'Fire Brendy',  type:'consumable', effect:'drunk', drunkValue:50, value:45, icon:'🔥', color:'#3498db', rarity:'rare',     desc:'Burning hot dragon brandy. Not for the faint of heart.' },
  // ── Training Grounds Drops ────────────────────────────────────────────────
  ratcatchers_amulet: { name:"Ratcatcher's Amulet", type:'armor', slot:'AMULET', def:0, value:200, icon:'📿', color:'#3498db', rarity:'rare', allStatsBonus:3, desc:'Awarded for ridding the Training Grounds of mice.' },
  rabbit_fur_jacket: { name:'Rabbit Fur Jacket', type:'armor', slot:'CHEST', def:2, value:50, icon:'🛡', color:'#2ecc71', rarity:'uncommon', statBonuses:{DEX:1}, desc:'Made from the finest rabbit furs. Soft and surprisingly protective.' },
  acorn:             { name:'Acorn',              type:'consumable', heal:5,  value:10, icon:'🌰', color:'#9d9d9d', rarity:'common',   desc:'A healthy snack. Restores 5 HP.' },
  feather:           { name:'Feather',            type:'material',           value:4,  icon:'🪶', color:'#9d9d9d', rarity:'common',   desc:'A fine bird feather. Used for arrows.' },
  rat_tail:          { name:'Rat Tail',           type:'material',           value:2,  icon:'🐭', color:'#9d9d9d', rarity:'common',   desc:'Not very useful, but someone might want it.' },
  // ── Common ────────────────────────────────────────────────────────────────
  wooden_sword:  { name:'Wooden Sword',    type:'weapon', slot:'MAIN_HAND', atk:3,  value:0,    icon:'⚔', color:'#9d9d9d', rarity:'common',    classRestriction:['paladin'] },
  cloth_armor:   { name:'Cloth Armor',     type:'armor',  slot:'CHEST',     def:2,  value:0,    icon:'🛡', color:'#9d9d9d', rarity:'common'    },
  hp_potion:     { name:'Health Potion',   type:'consumable', heal:25, value:40,   icon:'⬡', color:'#9d9d9d', rarity:'common'    },
  antidote:      { name:'Antidote',        type:'consumable', heal:10, value:80,   icon:'💧', color:'#9d9d9d', rarity:'common'    },
  torn_cloth:    { name:'Torn Cloth',      type:'armor',  slot:'CHEST',     def:1,  value:20,   icon:'🛡', color:'#9d9d9d', rarity:'common'    },
  rusty_dagger:  { name:'Rusty Dagger',    type:'weapon', slot:'MAIN_HAND', atk:2,  value:32,   icon:'⚔', color:'#9d9d9d', rarity:'common',    classRestriction:['ranger','mage','rogue'] },
  // ── Uncommon ──────────────────────────────────────────────────────────────
  iron_sword:    { name:'Iron Sword',      type:'weapon', slot:'MAIN_HAND', atk:7,  value:120,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  leather_armor: { name:'Leather Armor',   type:'armor',  slot:'CHEST',     def:5,  value:100,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','rogue'] },
  steel_sword:   { name:'Steel Sword',     type:'weapon', slot:'MAIN_HAND', atk:12, value:320,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  chain_mail:    { name:'Chain Mail',      type:'armor',  slot:'CHEST',     def:9,  value:280,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  big_hp_potion: { name:'Big Health Pot',  type:'consumable', heal:60, value:120,  icon:'⬡', color:'#2ecc71', rarity:'uncommon'  },
  mana_potion:   { name:'Mana Potion',     type:'consumable', heal:40, value:80,   icon:'💧', color:'#2ecc71', rarity:'uncommon'  },
  elven_sword:   { name:'Elven Sword',     type:'weapon', slot:'MAIN_HAND', atk:8,  value:480,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  silver_dagger: { name:'Silver Dagger',   type:'weapon', slot:'MAIN_HAND', atk:5,  value:280,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','mage','rogue'] },
  elven_chain:   { name:'Elven Chain',     type:'armor',  slot:'CHEST',     def:6,  value:400,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','rogue'] },
  silver_shield: { name:'Silver Shield',   type:'armor',  slot:'OFF_HAND',  def:4,  value:320,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  scroll_of_protection: { name:'Scroll of Protection', type:'permanent', stat:'DEF', statBonus:2, value:200, icon:'📜', color:'#2ecc71', rarity:'uncommon' },
  herb_potion:   { name:'Herb Potion',     type:'consumable', heal:30, value:60,   icon:'⬡', color:'#2ecc71', rarity:'uncommon'  },
  silver_arrowBundle: { name:'Silver Arrows x20', type:'consumable', atkBoost:5, value:120, icon:'🏹', color:'#2ecc71', rarity:'uncommon' },
  archery_training:   { name:'Archery Lesson (DEX +1)', type:'training', stat:'DEX', statBonus:1, value:80, icon:'🎯', color:'#2ecc71', rarity:'uncommon' },
  hunter_bow:    { name:'Hunter Bow',      type:'weapon', slot:'MAIN_HAND', atk:6,  value:220,  icon:'🏹', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','rogue'] },
  serpent_ring:  { name:'Serpent Ring',    type:'armor',  slot:'RING',      def:3,  value:320,  icon:'💍', color:'#2ecc71', rarity:'uncommon', passive:{poison:3} },
  gloves_of_swiftness: { name:'Gloves of Swiftness', type:'armor', slot:'HANDS', def:0, value:380, icon:'🧤', color:'#2ecc71', rarity:'uncommon', passive:{dodge:5}, statBonuses:{DEX:2} },
  // ── Rare ──────────────────────────────────────────────────────────────────
  flame_sword:   { name:'Flame Sword',     type:'weapon', slot:'MAIN_HAND', atk:18, value:600,  icon:'🔥', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  plate_armor:   { name:'Plate Armor',     type:'armor',  slot:'CHEST',     def:14, value:520,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  elven_bow:     { name:'Elven Bow',       type:'weapon', slot:'MAIN_HAND', atk:15, value:480,  icon:'🏹', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'] },
  elven_cloak:   { name:'Elven Cloak',     type:'armor',  slot:'CHEST',     def:11, value:400,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'] },
  moonbow:       { name:'Moonbow',         type:'weapon', slot:'MAIN_HAND', atk:10, value:600,  icon:'🏹', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'] },
  ancient_map:   { name:'Ancient Map',     type:'special', goldBonus:50,            value:320,  icon:'🗺', color:'#3498db', rarity:'rare'      },
  big_herb_potion: { name:'Big Herb Potion', type:'consumable', heal:80, value:160, icon:'⬡', color:'#3498db', rarity:'rare'      },
  poison_arrowBundle: { name:'Poison Arrows x10', type:'consumable', heal:20,    value:180,  icon:'🏹', color:'#3498db', rarity:'rare'     },
  runic_blade:   { name:'Runic Blade',     type:'weapon', slot:'MAIN_HAND', atk:9,  value:440,  icon:'⚔', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  scale_mail:    { name:'Scale Mail',      type:'armor',  slot:'CHEST',     def:8,  value:380,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  thornmail:     { name:'Thornmail',       type:'armor',  slot:'CHEST',     def:7,  value:560,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'], passive:{thorns:8}, statBonuses:{DEX:-1} },
  ember_cloak:   { name:'Ember Cloak',     type:'armor',  slot:'CHEST',     def:5,  value:500,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'], passive:{burn:5} },
  // ── Epic ──────────────────────────────────────────────────────────────────
  elven_blade:   { name:'Elven Blade',     type:'weapon', slot:'MAIN_HAND', atk:20, value:800,  icon:'⚔', color:'#9b59b6', rarity:'epic',      classRestriction:['paladin'] },
  tome_of_wisdom:{ name:'Tome of Wisdom',  type:'permanent', stat:'INT', statBonus:2, value:800,  icon:'📖', color:'#9b59b6', rarity:'epic'   },
  elixir_of_life:{ name:'Elixir of Life',  type:'permanent', stat:'CON', statBonus:1, value:1200, icon:'⬡', color:'#9b59b6', rarity:'epic'   },
  void_staff:    { name:'Void Staff',      type:'weapon', slot:'MAIN_HAND', atk:12, value:800,  icon:'⚔', color:'#9b59b6', rarity:'epic',      classRestriction:['ranger','mage','paladin'], intBonus:4 },
  crystal_shield:{ name:'Crystal Shield',  type:'armor',  slot:'OFF_HAND',  def:10, value:720,  icon:'🛡', color:'#9b59b6', rarity:'epic',      classRestriction:['paladin'] },
  amulet_of_sentinel: { name:'Amulet of the Sentinel', type:'armor', slot:'AMULET', def:4, value:1000, icon:'📿', color:'#9b59b6', rarity:'epic', passive:{reflect:15} },
  boots_of_the_wind:  { name:'Boots of the Wind',      type:'armor', slot:'FEET',   def:0, value:880,  icon:'👢', color:'#9b59b6', rarity:'epic', passive:{dodge:12}, statBonuses:{DEX:6} },
  // ── Set Items: Moonlight (Rare) ───────────────────────────────────────────
  moonlight_robe:       { name:'Moonlight Robe',        type:'armor',  slot:'CHEST',     def:8,  value:720,  icon:'🛡', color:'#3498db', rarity:'rare', set:'moonlight',   classRestriction:['mage'], statBonuses:{INT:3} },
  moonlight_ring:       { name:'Moonlight Ring',         type:'armor',  slot:'RING',      def:0,  value:480,  icon:'💍', color:'#3498db', rarity:'rare', set:'moonlight',   statBonuses:{INT:3,WIS:2} },
  moonlight_amulet:     { name:'Moonlight Amulet',       type:'armor',  slot:'AMULET',    def:0,  value:600,  icon:'📿', color:'#3498db', rarity:'rare', set:'moonlight',   statBonuses:{INT:4,CON:2} },
  // ── Set Items: Silverforge (Epic) ─────────────────────────────────────────
  silverforge_plate:    { name:'Silverforge Plate',      type:'armor',  slot:'CHEST',     def:12, value:1120, icon:'🛡', color:'#9b59b6', rarity:'epic', set:'silverforge', classRestriction:['paladin'], statBonuses:{STR:4} },
  silverforge_gauntlets:{ name:'Silverforge Gauntlets',  type:'armor',  slot:'HANDS',     def:3,  value:800,  icon:'🧤', color:'#9b59b6', rarity:'epic', set:'silverforge', classRestriction:['paladin'], atk:6 },
  silverforge_blade:    { name:'Silverforge Blade',      type:'weapon', slot:'MAIN_HAND', atk:14, value:1280, icon:'⚔', color:'#9b59b6', rarity:'epic', set:'silverforge', classRestriction:['paladin'], def:3 },
  // ── Dragon's Gate: Armory (Uncommon/Rare/Epic) ────────────────────────────
  iron_shield:     { name:'Iron Shield',      type:'armor',  slot:'OFF_HAND',  def:8,  value:480,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  tower_shield:    { name:'Tower Shield',     type:'armor',  slot:'OFF_HAND',  def:12, value:1000, icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'], statBonuses:{CON:5} },
  heavy_plate:     { name:'Heavy Plate',      type:'armor',  slot:'CHEST',     def:15, value:1200, icon:'🛡', color:'#9b59b6', rarity:'epic',      classRestriction:['paladin'], statBonuses:{DEX:-2} },
  // ── Dragon's Gate: War Goods (Uncommon/Rare) ──────────────────────────────
  warhammer:       { name:'Warhammer',        type:'weapon', slot:'MAIN_HAND', atk:12, value:880,  icon:'⚔', color:'#3498db', rarity:'rare',      classRestriction:[], def:3 },
  crossbow:        { name:'Crossbow',         type:'weapon', slot:'MAIN_HAND', atk:10, value:720,  icon:'🏹', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'], statBonuses:{DEX:2} },
  ballista_bolt_bundle: { name:'Ballista Bolts ×50', type:'consumable', atkBoost:8, value:320, icon:'🏹', color:'#2ecc71', rarity:'uncommon' },
  // ── Boss Drop: Dungeon ─────────────────────────────────────────────────────
  slime_core_ring:   { name:'Core of the Slime King',      type:'armor',  slot:'RING',      def:0,  value:0, icon:'💍', color:'#2ecc71', rarity:'uncommon', allStatsBonus:3 },
  bone_crown:        { name:'Crown of the Skeleton King',  type:'armor',  slot:'HEAD',      def:0,  value:0, icon:'👑', color:'#3498db', rarity:'rare',   statBonuses:{INT:5, WIS:5}, passive:{xpBonus:10} },
  dark_knight_cuirass:{ name:"Dark Knight's Armor",        type:'armor',  slot:'CHEST',     def:12, value:0, icon:'🛡', color:'#3498db', rarity:'rare',   statBonuses:{STR:3} },
  troll_hide_boots:  { name:'Boots of the Troll',          type:'armor',  slot:'FEET',      def:8,  value:0, icon:'👢', color:'#3498db', rarity:'rare',   statBonuses:{CON:4} },
  // ── Boss Drop: World Map ───────────────────────────────────────────────────
  dragon_slayer_sword: { name:'Blade of the Dragon Slayer', type:'weapon', slot:'MAIN_HAND', atk:20, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', set:'dragon_scale', passive:{burn:15, lifesteal:10} },
  dragon_heart_amulet: { name:'Heart of the Elder Dragon',  type:'armor',  slot:'AMULET',   def:0,  value:0, icon:'📿', color:'#f39c12', rarity:'legendary', allStatsBonus:8,  passive:{regen:15, reflect:20} },
  titan_greaves:       { name:'Greaves of the Titan',       type:'armor',  slot:'FEET',      def:10, value:0, icon:'👢', color:'#9b59b6', rarity:'epic',      statBonuses:{CON:5}, passive:{thorns:10} },
  hydra_venom_blade:   { name:"Void Hydra's Fang",          type:'weapon', slot:'MAIN_HAND', atk:15, value:0, icon:'⚔', color:'#9b59b6', rarity:'epic',      passive:{poison:20} },
  // ── Volcanic Wastes: Fire Shop ────────────────────────────────────────────
  fire_staff:    { name:'Fire Staff',    type:'weapon', slot:'MAIN_HAND', atk:8,  value:180, icon:'⚔', color:'#ff4500', rarity:'rare',   classRestriction:['mage','ranger','paladin'], intBonus:4, passive:{burn:3}, damageType:'fire' },
  lava_blade:    { name:'Lava Blade',    type:'weapon', slot:'MAIN_HAND', atk:10, value:220, icon:'⚔', color:'#8b2500', rarity:'rare',   classRestriction:['paladin'], passive:{burn:5}, damageType:'fire' },
  // ember_cloak already exists in the codebase — reused in the fire shop list
  // ── Frozen Peaks: Ice Shop ────────────────────────────────────────────────
  frost_dagger:    { name:'Frost Dagger',    type:'weapon', slot:'MAIN_HAND', atk:9,  value:200, icon:'⚔', color:'#a8d8ea', rarity:'rare',   classRestriction:['ranger','mage','rogue'], damageType:'ice', statBonuses:{DEX:2} },
  glacier_shield:  { name:'Glacier Shield',  type:'armor',  slot:'OFF_HAND',  def:8,  value:170, icon:'🛡', color:'#1a5c7a', rarity:'rare',   classRestriction:['paladin'], statBonuses:{CON:3} },
  winter_cloak:    { name:'Winter Cloak',    type:'armor',  slot:'CHEST',     def:4,  value:150, icon:'🛡', color:'#e8f4f8', rarity:'uncommon', classRestriction:['ranger','rogue'], statBonuses:{INT:3} },
  // ── Shadow Forest: Shadow Shop ────────────────────────────────────────────
  venom_fang:    { name:'Venom Fang',    type:'weapon', slot:'MAIN_HAND', atk:7,  value:150, icon:'⚔', color:'#2d3a1a', rarity:'uncommon', classRestriction:['ranger','mage','rogue'], passive:{poison:8}, damageType:'poison' },
  shadow_cloak:  { name:'Shadow Cloak',  type:'armor',  slot:'CHEST',     def:5,  value:130, icon:'🛡', color:'#1a1a0a', rarity:'uncommon', classRestriction:['ranger','rogue'], statBonuses:{DEX:3} },
  dark_tome:     { name:'Dark Tome',     type:'permanent', stat:'INT', statBonus:4, value:200, icon:'📖', color:'#3d2b1f', rarity:'rare' },
  // ── Dwarf Fortress: Thrain's Forge ───────────────────────────────────────
  dwarven_plate: { name:'Dwarven Plate', type:'armor',  slot:'CHEST',     def:15, value:350, icon:'🛡', color:'#5a5a5a', rarity:'epic',   classRestriction:['paladin'], statBonuses:{CON:2} },
  battle_axe:    { name:'Battle Axe',    type:'weapon', slot:'MAIN_HAND', atk:14, value:300, icon:'⚔', color:'#8b6914', rarity:'epic',   classRestriction:['paladin'], def:3 },
  mithril_helm:  { name:'Mithril Helm',  type:'armor',  slot:'HEAD',      def:6,  value:220, icon:'👑', color:'#cd9b1d', rarity:'rare',   statBonuses:{INT:2} },
  // ── Ruins of Aethoria: Temple of the Ancients ─────────────────────────────
  holy_avenger:  { name:'Holy Avenger',  type:'weapon', slot:'MAIN_HAND', atk:12, value:400, icon:'⚔', color:'#d4a017', rarity:'epic',   classRestriction:['paladin'], intBonus:5, statBonuses:{WIS:5}, damageType:'holy' },
  divine_shield: { name:'Divine Shield', type:'armor',  slot:'OFF_HAND',  def:10, value:350, icon:'🛡', color:'#f5e6c8', rarity:'epic',   classRestriction:['paladin'], passive:{reflect:10} },
  sunblade:      { name:'Sunblade',      type:'weapon', slot:'MAIN_HAND', atk:11, value:380, icon:'⚔', color:'#d4a017', rarity:'epic',   classRestriction:['paladin'], statBonuses:{STR:3}, damageType:'holy' },
  // ── Resist Items ──────────────────────────────────────────────────────────
  fire_resist_amulet: { name:'Fire Resist Amulet', type:'armor', slot:'AMULET', def:0, value:150, icon:'📿', color:'#ff4500', rarity:'uncommon', passive:{fireResist:5},      desc:'Reduces fire damage taken by 5%.' },
  ice_ward:           { name:'Ice Ward',           type:'armor', slot:'AMULET', def:0, value:150, icon:'📿', color:'#a8d8ea', rarity:'uncommon', passive:{iceResist:5},       desc:'Reduces ice damage taken by 5%.' },
  lightning_rod:      { name:'Lightning Rod',      type:'armor', slot:'AMULET', def:0, value:150, icon:'📿', color:'#ffe066', rarity:'uncommon', passive:{lightningResist:5}, desc:'Reduces lightning damage taken by 5%.' },
  // ── Legendary ─────────────────────────────────────────────────────────────
  dragonslayer:  { name:'Dragon Slayer',   type:'weapon', slot:'MAIN_HAND', atk:25, value:0,    icon:'⚡', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'] },
  crown_of_ages: { name:'Crown of Ages',   type:'permanent', allStats:5,            value:2000, icon:'👑', color:'#f39c12', rarity:'legendary' },
  blade_of_the_ancient_dragon: { name:'Blade of the Ancient Dragon', type:'weapon', slot:'MAIN_HAND', atk:20, value:1600, icon:'⚔', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'] },
  heart_of_the_mountain: { name:'Heart of the Mountain', type:'armor', slot:'AMULET', def:0, value:1800, icon:'📿', color:'#f39c12', rarity:'legendary', passive:{regen:10}, statBonuses:{CON:5}, allStatsBonus:3 },
  ring_of_the_dragon:    { name:'Ring of the Dragon',    type:'armor', slot:'RING',   atk:8, value:2000, icon:'💍', color:'#f39c12', rarity:'legendary', passive:{lifesteal:15, burn:8} },
  // ── The Abyss: Boss Drop ──────────────────────────────────────────────────
  void_reaver: { name:'Void Reaver', type:'weapon', slot:'MAIN_HAND', atk:25, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', passive:{lifesteal:20, darkDamage:15}, desc:'Forged from the essence of the void itself.' },
  // ── Sunken Temple: Boss Drop ───────────────────────────────────────────────
  trident_of_the_deep: { name:'Trident of the Deep', type:'weapon', slot:'MAIN_HAND', atk:18, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'], whileEquipped:{iceDamage:12}, passive:{poison:5}, desc:'Once wielded by the Drowned King himself.' },
  // ── The Underworld: Boss Drop ─────────────────────────────────────────────
  infernal_cleaver:   { name:'Infernal Cleaver',   type:'weapon', slot:'MAIN_HAND', atk:22, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'], whileEquipped:{fireDamage:15}, onHit:{chance:0.10, effect:'burn'}, desc:'Forged in the fires of the eternal pit.' },
  // ── The Underworld: Brimstone Bazaar shop ─────────────────────────────────
  demon_slayer_blade: { name:'Demon Slayer Blade', type:'weapon', slot:'MAIN_HAND', atk:14, value:400, icon:'⚔', color:'#3498db', rarity:'rare', classRestriction:['paladin'], statBonuses:{STR:5}, whileEquipped:{fireDamage:8}, desc:'+20% damage vs demons.' },
  hellfire_plate:     { name:'Hellfire Plate',     type:'armor',  slot:'CHEST',     def:11, value:380, icon:'🛡', color:'#3498db', rarity:'rare', classRestriction:['paladin'], statBonuses:{CON:4}, passive:{fireResist:20}, desc:'Forged from hellfire-tempered iron.' },
  infernal_ring:      { name:'Infernal Ring',      type:'armor',  slot:'RING',      def:0,  value:350, icon:'💍', color:'#3498db', rarity:'rare', allStatsBonus:4, whileEquipped:{fireDamage:5}, passive:{lifesteal:8}, desc:'A ring pulsing with infernal energy.' },
  // ── Sunken Temple: Sunken Reliquary shop ──────────────────────────────────
  coral_blade:    { name:'Coral Blade',    type:'weapon', slot:'MAIN_HAND', atk:10, value:280, icon:'⚔', color:'#3498db', rarity:'rare',   classRestriction:['paladin'], whileEquipped:{waterDamage:6}, passive:{poison:3}, desc:'A blade grown from living coral.' },
  tidal_shield:   { name:'Tidal Shield',   type:'armor',  slot:'OFF_HAND',  def:9,  value:260, icon:'🛡', color:'#3498db', rarity:'rare',   classRestriction:['paladin'], statBonuses:{CON:4}, passive:{iceResist:15}, desc:'Imbued with the resilience of the tide.' },
  mermaids_charm: { name:"Mermaid's Charm",type:'armor',  slot:'AMULET',    def:0,  value:300, icon:'📿', color:'#3498db', rarity:'rare',   allStatsBonus:3, passive:{iceResist:10}, desc:'A charm that whispers of the deep.' },
  // ── The Abyss: Void Emporium shop ─────────────────────────────────────────
  void_blade:     { name:'Void Blade',     type:'weapon', slot:'MAIN_HAND', atk:15, value:500, icon:'⚔', color:'#9b59b6', rarity:'epic', classRestriction:['paladin'], whileEquipped:{darkDamage:10}, passive:{lifesteal:10}, desc:'A blade forged in the void.' },
  abyssal_armor:  { name:'Abyssal Armor',  type:'armor',  slot:'CHEST',     def:12, value:480, icon:'🛡', color:'#9b59b6', rarity:'epic', statBonuses:{CON:5}, passive:{regen:10}, desc:'Armor imbued with abyssal energy.' },
  wraithcloak:    { name:'Wraithcloak',    type:'armor',  slot:'CHEST',     def:8,  value:420, icon:'🛡', color:'#9b59b6', rarity:'epic', classRestriction:['ranger','rogue'], statBonuses:{DEX:3}, passive:{dodge:10}, desc:'A cloak that shifts between realms.' },
  // ── Proc / On-Attack / On-Hit Items ──────────────────────────────────────
  fire_sword:       { name:'Fire Sword',       type:'weapon', slot:'MAIN_HAND', atk:12, value:1000, icon:'🔥', color:'#9b59b6', rarity:'epic',   classRestriction:['paladin'], whileEquipped:{fireDamage:5}, onAttack:{chance:0.10, effect:'fireball'}, desc:'A blade wreathed in eternal flame.' },
  venom_fang_rare:  { name:'Venom Fang',        type:'weapon', slot:'MAIN_HAND', atk:9,  value:600,  icon:'⚔', color:'#3498db', rarity:'rare',   classRestriction:['ranger','mage','rogue'], passive:{poison:8}, onHit:{chance:0.15, effect:'poison'}, desc:'Dripping with deadly venom.' },
  life_drain_blade: { name:'Life Drain Blade',  type:'weapon', slot:'MAIN_HAND', atk:10, value:900,  icon:'⚔', color:'#9b59b6', rarity:'epic',   classRestriction:['paladin'], passive:{lifesteal:8}, onHit:{chance:0.20, heal:5}, desc:'Steals life from enemies.' },
  thunder_gauntlets:{ name:'Thunder Gauntlets', type:'armor',  slot:'HANDS',     def:3,  value:700,  icon:'🧤', color:'#3498db', rarity:'rare',   atk:4, onHit:{chance:0.12, effect:'stun'}, desc:'Lightning crackles with each blow.' },
  guardian_amulet:  { name:'Guardian Amulet',   type:'armor',  slot:'AMULET',    def:0,  value:800,  icon:'📿', color:'#3498db', rarity:'rare',   allStatsBonus:4, onHit:{chance:0.15, shield:8}, desc:'Creates a magical barrier when struck.' },
  archmage_staff:   { name:'Archmage Staff',    type:'weapon', slot:'MAIN_HAND', atk:8,  value:1100, icon:'⚔', color:'#9b59b6', rarity:'epic',   classRestriction:['ranger','mage','paladin'], intBonus:6, magicDamage:10, onAttack:{chance:0.08, effect:'fireball'}, desc:'Channel raw arcane energy.' },
  berserker_axe:    { name:'Berserker Axe',     type:'weapon', slot:'MAIN_HAND', atk:14, value:750,  icon:'⚔', color:'#3498db', rarity:'rare',   classRestriction:['paladin'], def:-2, onHit:{chance:0.25, heal:8}, desc:'The more you bleed, the harder you hit.' },
  // ── Type Synergy Sets ─────────────────────────────────────────────────────
  // FIRE SET
  flame_gauntlets: { name:'Flame Gauntlets', type:'armor',  slot:'HANDS',     atk:3, def:2,  value:120, icon:'🧤', rarity:'rare', damageType:'fire',      whileEquipped:{fireDamage:3} },
  inferno_blade:   { name:'Inferno Blade',   type:'weapon', slot:'MAIN_HAND', atk:11,        value:280, icon:'🔥', rarity:'epic', damageType:'fire',      classRestriction:['paladin'], whileEquipped:{fireDamage:6}, onAttack:{chance:0.08, effect:'fireball'} },
  phoenix_cloak:   { name:'Phoenix Cloak',   type:'armor',  slot:'CHEST',            def:7,  value:240, icon:'🛡', rarity:'epic', damageType:'fire',      whileEquipped:{fireDamage:4}, statBonuses:{STR:3} },
  // ICE SET
  frost_gauntlets: { name:'Frost Gauntlets', type:'armor',  slot:'HANDS',     atk:3, def:2,  value:120, icon:'🧤', rarity:'rare', damageType:'ice',       whileEquipped:{iceDamage:3} },
  blizzard_staff:  { name:'Blizzard Staff',  type:'weapon', slot:'MAIN_HAND', atk:9,         value:280, icon:'⚔', rarity:'epic', damageType:'ice',       classRestriction:['ranger','mage','paladin'], whileEquipped:{iceDamage:6}, statBonuses:{INT:5}, onAttack:{chance:0.06, effect:'freeze'} },
  frozen_plate:    { name:'Frozen Plate',    type:'armor',  slot:'CHEST',            def:8,  value:250, icon:'🛡', rarity:'epic', damageType:'ice',       classRestriction:['paladin'], whileEquipped:{iceDamage:4}, statBonuses:{CON:3} },
  // LIGHTNING SET
  storm_gauntlets: { name:'Storm Gauntlets', type:'armor',  slot:'HANDS',     atk:3, def:2,  value:120, icon:'🧤', rarity:'rare', damageType:'lightning',  whileEquipped:{lightningDamage:3}, statBonuses:{DEX:2} },
  thunder_strike:  { name:'Thunder Strike',  type:'weapon', slot:'MAIN_HAND', atk:12,        value:290, icon:'⚡', rarity:'epic', damageType:'lightning',  classRestriction:['paladin'], whileEquipped:{lightningDamage:5}, onHit:{chance:0.08, effect:'stun'} },
  tempest_robes:   { name:'Tempest Robes',   type:'armor',  slot:'CHEST',            def:6,  value:230, icon:'🛡', rarity:'epic', damageType:'lightning',  classRestriction:['mage','ranger'], whileEquipped:{lightningDamage:4}, statBonuses:{INT:4} },
  // POISON SET
  venom_gloves:    { name:'Venom Gloves',    type:'armor',  slot:'HANDS',     atk:2, def:2,  value:110, icon:'🧤', rarity:'rare', damageType:'poison',    passive:{poison:4}, statBonuses:{DEX:2} },
  serpent_fang:    { name:'Serpent Fang',    type:'weapon', slot:'MAIN_HAND', atk:10,        value:270, icon:'⚔', rarity:'epic', damageType:'poison',    classRestriction:['ranger','mage','rogue'], passive:{poison:8}, onHit:{chance:0.12, effect:'poison'} },
  plague_armor:    { name:'Plague Armor',    type:'armor',  slot:'CHEST',            def:7,  value:240, icon:'🛡', rarity:'epic', damageType:'poison',    classRestriction:['paladin'], passive:{poison:5}, statBonuses:{CON:2} },
  // HOLY SET
  holy_gauntlets:  { name:'Holy Gauntlets',  type:'armor',  slot:'HANDS',     atk:2,         value:130, icon:'🧤', rarity:'rare', damageType:'holy',      whileEquipped:{holyDamage:2}, statBonuses:{WIS:3} },
  divine_blade:    { name:'Divine Blade',    type:'weapon', slot:'MAIN_HAND', atk:11,        value:300, icon:'⚔', rarity:'epic', damageType:'holy',      classRestriction:['paladin'], whileEquipped:{holyDamage:5}, statBonuses:{INT:4, WIS:4} },
  sacred_plate:    { name:'Sacred Plate',    type:'armor',  slot:'CHEST',            def:9,  value:260, icon:'🛡', rarity:'epic', damageType:'holy',      classRestriction:['paladin'], whileEquipped:{holyDamage:4}, statBonuses:{CON:3}, passive:{regen:3} },
  // DARK SET
  shadow_gauntlets:{ name:'Shadow Gauntlets',type:'armor',  slot:'HANDS',     atk:3,         value:120, icon:'🧤', rarity:'rare', damageType:'dark',      whileEquipped:{darkDamage:2}, passive:{lifesteal:3}, statBonuses:{DEX:2} },
  void_reaper:     { name:'Void Reaper',     type:'weapon', slot:'MAIN_HAND', atk:13,        value:300, icon:'⚔', rarity:'epic', damageType:'dark',      classRestriction:['paladin'], whileEquipped:{darkDamage:5}, passive:{lifesteal:5} },
  nightmare_cloak: { name:'Nightmare Cloak', type:'armor',  slot:'CHEST',            def:6,  value:250, icon:'🛡', rarity:'epic', damageType:'dark',      classRestriction:['ranger','rogue'], whileEquipped:{darkDamage:4}, passive:{lifesteal:4}, statBonuses:{INT:4} },
};
// Town shop — common & uncommon
const shopItems = ['rusty_dagger','torn_cloth','iron_sword','leather_armor','steel_sword','chain_mail','hp_potion','big_hp_potion','serpent_ring','gloves_of_swiftness','fire_resist_amulet','ice_ward','lightning_rod'];
// Elven Market — rare, epic & legendary
const elvenShopItems    = ['elven_bow','elven_cloak','elven_blade','void_staff','crystal_shield','blade_of_the_ancient_dragon','crown_of_ages','amulet_of_sentinel','boots_of_the_wind','heart_of_the_mountain','ring_of_the_dragon','moonlight_robe','moonlight_ring','moonlight_amulet'];
// Silverforge Blacksmith — uncommon & rare
const silverforgeItems  = ['hunter_bow','elven_sword','silver_dagger','moonbow','elven_chain','silver_shield','runic_blade','scale_mail','thornmail','ember_cloak','silverforge_plate','silverforge_gauntlets','silverforge_blade'];
const lorekeeperItems   = ['tome_of_wisdom','scroll_of_protection','ancient_map'];
const herbalistItems    = ['herb_potion','big_herb_potion','elixir_of_life','antidote'];
const bowyerItems       = ['silver_arrowBundle','poison_arrowBundle','archery_training','mana_potion'];
// Dragon's Gate: Ironhelm's Armory — heavy armor and shields
const armoryItems    = ['iron_shield','tower_shield','heavy_plate','chain_mail','plate_armor'];
// Dragon's Gate: Siegemaster's War Goods — weapons and ammunition
const warGoodsItems  = ['warhammer','crossbow','ballista_bolt_bundle','steel_sword','flame_sword'];
// Rogue's Cove: Salty Steve's Bar — alcoholic drinks
const steveBarItems  = ['ale','whiskey','firebrandy'];
// Volcanic Wastes: Fire Shop — fire-themed items
const fireShopItems  = ['fire_staff','lava_blade','ember_cloak','flame_gauntlets','inferno_blade','phoenix_cloak','hp_potion','big_hp_potion'];
// Frozen Peaks: Ice Shop — ice-themed items
const iceShopItems   = ['frost_dagger','glacier_shield','winter_cloak','frost_gauntlets','blizzard_staff','frozen_plate','hp_potion','big_hp_potion'];
// Shadow Forest: Shadow Market — poison/dark items
const shadowShopItems = ['venom_fang','shadow_cloak','dark_tome','venom_gloves','serpent_fang','plague_armor','shadow_gauntlets','void_reaper','nightmare_cloak','antidote','hp_potion'];
// Dwarf Fortress: Thrain's Forge — heavy weapons and armor
const dwarfShopItems = ['dwarven_plate','battle_axe','mithril_helm','iron_shield','tower_shield','warhammer','storm_gauntlets','thunder_strike','tempest_robes'];
// Ruins of Aethoria: Temple of the Ancients — holy/ancient items
const holyShopItems  = ['holy_avenger','divine_shield','sunblade','holy_gauntlets','divine_blade','sacred_plate','big_hp_potion','mana_potion'];
// The Abyss: Void Emporium — void/dark-themed items
const voidEmporiumItems = ['void_blade','abyssal_armor','wraithcloak','shadow_gauntlets','void_reaper','nightmare_cloak','big_hp_potion','hp_potion'];
// Sunken Temple: Sunken Reliquary — water/ice-themed items
const sunkenShopItems = ['coral_blade','tidal_shield','mermaids_charm','frost_dagger','glacier_shield','frost_gauntlets','blizzard_staff','hp_potion','big_hp_potion'];
// The Underworld: Brimstone Bazaar — hellfire-themed items
const brimstoneItems = ['demon_slayer_blade','hellfire_plate','infernal_ring','hp_potion','big_hp_potion'];

// ─── SKILLS ──────────────────────────────────────────────────────────────────
const skillDefs = {
  heal:         { name:'Heal',         desc:'Restore 30% of max HP.',                    req:{ WIS:12 }, cost:6, icon:'💚', classRestriction: null,                           cooldown: 0,  manaCost: 20 },
  power_strike: { name:'Power Strike', desc:'Deal 2× damage. Take 1.5× from next hit.',  req:{ STR:12 }, cost:6, icon:'⚡', classRestriction: ['warrior','paladin','rogue'],   cooldown: 2,  manaCost: 10 },
  shield_bash:  { name:'Shield Bash',  desc:'Deal damage and stun enemy (skip turn).',   req:{ CON:12 }, cost:9, icon:'🛡', classRestriction: ['warrior','paladin'],           cooldown: 3,  manaCost: 8  },
  fireball:     { name:'Fireball',     desc:'Deal INT×3 magic damage.',                  req:{ INT:14 }, cost:9, icon:'🔥', classRestriction: ['mage'],                       cooldown: 3,  manaCost: 15 },
  quick_step:   { name:'Quick Step',   desc:'Guaranteed dodge next enemy attack.',       req:{ DEX:12 }, cost:6, icon:'💨', classRestriction: ['ranger','rogue'],             cooldown: 2,  manaCost: 6  },
  cheat_god_mode: { name:'CHEAT: GOD MODE', desc:'Deal 99999 true damage. Ignores defense. 0 MP.', req:{}, cost:0, icon:'☠️', cooldown: 0, manaCost: 0 },

  // ── WARRIOR ────────────────────────────────────────────────────────────────
  bash:           { name:'Bash',           desc:'1.2× damage, stun enemy 1 turn.',                            req:{STR:11}, cost:2, icon:'💥', classRestriction:['warrior','paladin'], cooldown:4,  manaCost:5,  effect:{type:'damage', mult:1.2, stun:1} },
  dual_wield:     { name:'Dual Wield',     desc:'Passive: enables secondary weapon slot; attack twice per round.', req:{DEX:11}, cost:3, icon:'⚔️', classRestriction:['warrior','rogue'],   cooldown:0,  manaCost:0,  passive:true, effect:{type:'buff', passive:true, atkBonus:15} },
  double_strike:  { name:'Double Strike',  desc:'Passively attack twice each round at 0.8× damage each.',     req:{STR:12}, cost:3, icon:'🗡️', classRestriction:['warrior','paladin'], passive:true,             effect:{type:'damage', hits:2, mult:0.8} },
  whirlwind:      { name:'Whirlwind',      desc:'Hit ALL enemies for 0.5× damage.',                           req:{STR:13}, cost:4, icon:'🌀', classRestriction:['warrior','paladin'], cooldown:4,  manaCost:15, effect:{type:'damage', aoe:true, mult:0.5} },
  shield_block:   { name:'Shield Block',   desc:'Reduce next incoming damage by 50%.',                        req:{CON:11}, cost:2, icon:'🛡️', classRestriction:['warrior','paladin'], cooldown:3,  manaCost:8,  effect:{type:'buff', blockNext:0.5} },
  parry:          { name:'Parry',          desc:'Passive: 15% chance each turn to reflect melee attacks.',    req:{DEX:11}, cost:2, icon:'🔄', classRestriction:['warrior','paladin'], cooldown:0,  manaCost:0,  passive:true, passiveChance:0.15, passiveReflect:true },
  berserk:        { name:'Berserk',        desc:'Passive: +25% ATK when HP below 50%.',                      req:{STR:13}, cost:3, icon:'😡', classRestriction:['warrior','paladin'], cooldown:0,  manaCost:0,  passive:true, passiveAtkBonus:25, passiveHpThreshold:0.5 },
  disarm:         { name:'Disarm',         desc:'Enemy loses their turn.',                                    req:{STR:12}, cost:3, icon:'🚫', classRestriction:['warrior','paladin'], cooldown:4,  manaCost:10, effect:{type:'debuff', skipTurn:true} },
  kick:           { name:'Kick',           desc:'Passive: 30% chance each turn to deal 1.3× damage.',        req:{DEX:10}, cost:1, icon:'👢', classRestriction:['warrior','paladin'], cooldown:0,  manaCost:0,  passive:true, passiveChance:0.30, passiveDamageMult:1.3 },
  headbutt:       { name:'Headbutt',       desc:'Passive: 25% chance each turn to stun enemy for 1 turn.',   req:{CON:11}, cost:2, icon:'💢', classRestriction:['warrior','paladin'], cooldown:0,  manaCost:0,  passive:true, passiveChance:0.25, passiveStun:1 },
  elbow:          { name:'Elbow',          desc:'Passive: 35% chance each turn for undodgeable 1.2× damage.',req:{STR:10}, cost:1, icon:'👊', classRestriction:['warrior','paladin'], cooldown:0,  manaCost:0,  passive:true, passiveChance:0.35, passiveDamageMult:1.2, passiveUndodgeable:true },
  trip:           { name:'Trip',           desc:'Enemy falls — they skip their next turn.',                   req:{DEX:11}, cost:2, icon:'🦵', classRestriction:['warrior','paladin'], cooldown:3,  manaCost:6,  effect:{type:'debuff', skipTurn:true} },

  // ── ROGUE / RANGER ─────────────────────────────────────────────────────────
  backstab:       { name:'Backstab',       desc:'2.5× damage (bonus from stealth/surprise).',        req:{DEX:13}, cost:2, icon:'🗡️', classRestriction:['rogue','ranger'],   cooldown:2,  manaCost:8,  effect:{type:'damage', mult:2.5, requiresStealth:true} },
  dodge:          { name:'Dodge',          desc:'Passive: 25% chance each turn to automatically evade the enemy\'s attack.', req:{DEX:12}, cost:1, icon:'💨', classRestriction:['rogue','ranger'],   cooldown:0,  manaCost:0,  passive:true, passiveChance:0.25 },
  hide:           { name:'Hide',           desc:'Passive: after attacking, become invisible — enemy skips next attack.', req:{DEX:12}, cost:2, icon:'👻', classRestriction:['rogue','ranger'],   cooldown:0, manaCost:0, passive:true, passiveStealth:true },
  sneak:          { name:'Sneak',          desc:'Passive: next attack from stealth deals 2× damage.',req:{DEX:12}, cost:2, icon:'🤫', classRestriction:['rogue','ranger'],   cooldown:0,  manaCost:0,  passive:true, passiveNextDamageMult:2.0 },
  steal:          { name:'Steal',          desc:'Steal a random item from the enemy.',               req:{DEX:14}, cost:3, icon:'💰', classRestriction:['rogue','ranger'],   cooldown:6,  manaCost:12, effect:{type:'special', stealItem:true} },
  pick_lock:      { name:'Pick Lock',      desc:'Instantly open locked doors and chests.',           req:{DEX:11}, cost:1, icon:'🔓', classRestriction:['rogue','ranger'],   cooldown:0,  manaCost:5,  effect:{type:'special', openLocked:true} },
  assassinate:    { name:'Assassinate',    desc:'Instant kill if enemy HP is below 20%.',            req:{DEX:15}, cost:5, icon:'☠️', classRestriction:['rogue','ranger'],   cooldown:8,  manaCost:20, effect:{type:'special', instantKill:true, hpThreshold:0.2} },
  vanish:         { name:'Vanish',         desc:'Flee combat instantly — no XP loss.',               req:{DEX:13}, cost:3, icon:'🌫️', classRestriction:['rogue','ranger'],   cooldown:5,  manaCost:10, effect:{type:'special', flee:true, noXpLoss:true} },
  camouflage:     { name:'Camouflage',     desc:'Passive: +30% dodge chance while in combat.',       req:{DEX:12}, cost:2, icon:'🌿', classRestriction:['rogue','ranger'],   cooldown:0,  manaCost:0,  passive:true, passiveDodgeBonus:30 },
  peek:           { name:'Peek',           desc:'Reveal hidden traps and secrets in the area.',      req:{WIS:10}, cost:1, icon:'👁️', classRestriction:['rogue','ranger'],   cooldown:0,  manaCost:0,  effect:{type:'special', revealHidden:true} },
  track:          { name:'Track',          desc:'Highlight all enemies on the current map.',         req:{WIS:10}, cost:1, icon:'🐾', classRestriction:['rogue','ranger'],   cooldown:0,  manaCost:3,  effect:{type:'special', revealEnemies:true} },

  // ── MAGE ───────────────────────────────────────────────────────────────────
  lightning_bolt: { name:'Lightning Bolt', desc:'1.8× INT magic damage, 15% chance to stun.',       req:{INT:14}, cost:3, icon:'⚡', classRestriction:['mage'],            cooldown:3,  manaCost:12, effect:{type:'damage', mult:1.8, statScaling:'INT', stunChance:0.15} },
  harm:           { name:'Harm',           desc:'Deal damage equal to half enemy current HP (cap 200).', req:{INT:15}, cost:4, icon:'💀', classRestriction:['mage'],        cooldown:5,  manaCost:25, effect:{type:'special', damageHalfHp:true, cap:200} },
  dispel_magic:   { name:'Dispel Magic',   desc:'Remove all active buffs from the enemy.',          req:{INT:13}, cost:3, icon:'✨', classRestriction:['mage'],            cooldown:4,  manaCost:15, effect:{type:'debuff', removeEnemyBuffs:true} },
  teleport:       { name:'Teleport',       desc:'Flee combat instantly with no penalty.',            req:{INT:12}, cost:2, icon:'🔮', classRestriction:['mage'],            cooldown:5,  manaCost:15, effect:{type:'special', flee:true, noXpLoss:true} },
  summon:         { name:'Summon',         desc:'Summon a creature that attacks for 2 rounds (50 INT dmg/round).', req:{INT:15}, cost:5, icon:'👾', classRestriction:['mage'], cooldown:10, manaCost:40, effect:{type:'special', summon:true, dmgPerRound:50, rounds:2} },
  meteor_swarm:   { name:'Meteor Swarm',   desc:'3× INT damage to ALL enemies.',                    req:{INT:16}, cost:6, icon:'☄️', classRestriction:['mage'],            cooldown:8,  manaCost:50, effect:{type:'damage', aoe:true, mult:3.0, statScaling:'INT'} },
  contingency:    { name:'Contingency',    desc:'Passive: auto-cast Heal once per combat when HP falls below 20%.', req:{INT:14}, cost:4, icon:'🔔', classRestriction:['mage'],        cooldown:0,  manaCost:0,  passive:true },
  polymorph:      { name:'Polymorph',      desc:'Turn enemy into a weak slime for 2 turns.',        req:{INT:14}, cost:4, icon:'🐸', classRestriction:['mage'],            cooldown:6,  manaCost:30, effect:{type:'debuff', polymorph:true, duration:2} },
  charm_person:   { name:'Charm Person',   desc:'Enemy fights for you for 1 round.',                req:{CHA:13}, cost:3, icon:'💕', classRestriction:['mage'],            cooldown:5,  manaCost:20, effect:{type:'special', charm:true, duration:1} },
  time_stop:      { name:'Time Stop',      desc:'Take 2 extra turns this combat.',                  req:{INT:17}, cost:7, icon:'⏱️', classRestriction:['mage'],            cooldown:15, manaCost:35, effect:{type:'special', extraTurns:2} },
  mind_thrust:    { name:'Mind Thrust',    desc:'1.5× INT damage, ignores enemy DEF.',              req:{INT:13}, cost:2, icon:'🧠', classRestriction:['mage'],            cooldown:3,  manaCost:10, effect:{type:'damage', mult:1.5, statScaling:'INT', ignoresDef:true} },
  ego_whip:       { name:'Ego Whip',       desc:'1.3× damage, enemy -20% ATK for 2 turns.',        req:{INT:12}, cost:2, icon:'💫', classRestriction:['mage'],            cooldown:4,  manaCost:12, effect:{type:'damage', mult:1.3, debuff:{atkReduction:20, duration:2}} },
  cell_adjustment:{ name:'Cell Adjustment',desc:'Restore 50% of max HP.',                          req:{CON:12}, cost:3, icon:'🌱', classRestriction:['mage'],            cooldown:6,  manaCost:20, effect:{type:'heal', amount:0.5} },
  detonate:       { name:'Detonate',       desc:'Deal your current HP / 2 as damage (you also take that much).', req:{INT:14}, cost:4, icon:'💣', classRestriction:['mage'], cooldown:6,  manaCost:30, effect:{type:'special', detonateHp:true, selfDamage:true} },
  farsight:       { name:'Farsight',       desc:'Reveal the entire map for 30 seconds.',            req:{INT:11}, cost:1, icon:'🔭', classRestriction:['mage'],            cooldown:0,  manaCost:5,  effect:{type:'special', revealMap:true, duration:30} },

  // ── PALADIN / HOLY ─────────────────────────────────────────────────────────
  cure_critical:  { name:'Cure Critical',  desc:'Restore 80% of max HP.',                          req:{WIS:14}, cost:4, icon:'💗', classRestriction:['paladin','warrior'], cooldown:6,  manaCost:35, effect:{type:'heal', amount:0.8} },
  bless:          { name:'Bless',          desc:'+20% ATK and DEF for 3 turns (all allies).',      req:{WIS:13}, cost:2, icon:'✨', classRestriction:['paladin','warrior'], cooldown:5,  manaCost:20, effect:{type:'buff', atkBonus:20, defBonus:20, duration:3} },
  sanctuary:      { name:'Sanctuary',      desc:'Enemies cannot attack you for 1 turn.',           req:{WIS:13}, cost:3, icon:'🕊️', classRestriction:['paladin','warrior'], cooldown:6,  manaCost:25, effect:{type:'buff', untargetable:true, duration:1} },
  regenerate:     { name:'Regenerate',     desc:'Regen 10 HP per turn for 3 turns.',               req:{WIS:12}, cost:3, icon:'🌿', classRestriction:['paladin','warrior'], cooldown:5,  manaCost:15, effect:{type:'heal', hpPerTurn:10, duration:3} },
  word_of_recall: { name:'Word of Recall', desc:'Return to the nearest town instantly.',           req:{WIS:12}, cost:3, icon:'🏠', classRestriction:['paladin','warrior'], cooldown:0,  manaCost:10, effect:{type:'special', recallToTown:true} },
  divine_shield:  { name:'Divine Shield',  desc:'Immune to all damage for 1 turn.',                req:{WIS:15}, cost:4, icon:'🌟', classRestriction:['paladin','warrior'], cooldown:8,  manaCost:20, effect:{type:'buff', damageImmune:true, duration:1} },
  cure_poison:    { name:'Cure Poison',    desc:'Remove poison status effect.',                    req:{WIS:11}, cost:1, icon:'🧪', classRestriction:['paladin','warrior'], cooldown:3,  manaCost:8,  effect:{type:'special', curePoison:true} },

  // ── RANGER / NATURE ────────────────────────────────────────────────────────
  call_lightning: { name:'Call Lightning', desc:'2× DEX damage, hits all enemies.',               req:{DEX:13}, cost:3, icon:'⛈️', classRestriction:['ranger'],           cooldown:4,  manaCost:18, effect:{type:'damage', aoe:true, mult:2.0, statScaling:'DEX'} },
  animal_companion:{ name:'Animal Companion', desc:'Summon a wolf companion for 3 rounds.',       req:{WIS:13}, cost:4, icon:'🐺', classRestriction:['ranger'],           cooldown:10, manaCost:20, effect:{type:'special', summon:true, companion:'wolf', rounds:3} },
  forage:         { name:'Forage',         desc:'Find a random herb or consumable item.',          req:{WIS:10}, cost:1, icon:'🌾', classRestriction:['ranger'],           cooldown:0,  manaCost:0,  effect:{type:'special', findItem:'herb'} },
  pass_without_trace:{ name:'Pass Without Trace', desc:'+50% dodge for 3 turns.',                 req:{DEX:12}, cost:2, icon:'🍃', classRestriction:['ranger'],           cooldown:5,  manaCost:10, effect:{type:'buff', dodgeBonus:50, duration:3} },

  // ── WIZARD / UTILITY (Mage + Rogue) ────────────────────────────────────────
  invisibility:   { name:'Invisibility',   desc:'Invisible for 2 turns — enemies skip you.',      req:{INT:12}, cost:3, icon:'🫥', classRestriction:['mage','rogue'],     cooldown:5,  manaCost:25, effect:{type:'buff', invisible:true, duration:2} },
  haste:          { name:'Haste',          desc:'Take 2 actions per turn for 2 turns.',           req:{DEX:13}, cost:3, icon:'⚡', classRestriction:['mage','rogue'],     cooldown:6,  manaCost:20, effect:{type:'buff', extraAction:true, duration:2} },
  slow:           { name:'Slow',           desc:'Enemy takes only 1 action per turn for 2 turns.',req:{INT:12}, cost:2, icon:'🐌', classRestriction:['mage','rogue'],     cooldown:4,  manaCost:15, effect:{type:'debuff', slowEnemy:true, duration:2} },
  fly:            { name:'Fly',            desc:'Ignore terrain effects for 3 turns.',            req:{DEX:11}, cost:2, icon:'🦅', classRestriction:['mage','rogue'],     cooldown:5,  manaCost:8,  effect:{type:'buff', ignoreTerrain:true, duration:3} },
  refresh:        { name:'Refresh',        desc:'Restore 20% HP and remove fatigue.',             req:{WIS:10}, cost:1, icon:'💧', classRestriction:['mage','rogue'],     cooldown:0,  manaCost:5,  effect:{type:'heal', amount:0.2, removeFatigue:true} },
  aura_sight:     { name:'Aura Sight',     desc:"Reveal enemy HP and weaknesses for 30 seconds.", req:{INT:12}, cost:2, icon:'👁️', classRestriction:['mage','rogue'],     cooldown:5,  manaCost:8,  effect:{type:'special', revealEnemyInfo:true, duration:30} },

  // ── SPECIAL / ADVANCED (all classes) ───────────────────────────────────────
  quivering_palm: { name:'Quivering Palm', desc:'Deal damage 3 turns in a row to kill enemy instantly.', req:{STR:15}, cost:5, icon:'🖐️', classRestriction:null,         cooldown:10, manaCost:30, effect:{type:'special', quiveringPalm:true, turns:3} },
  shadow_walk:    { name:'Shadow Walk',    desc:'Teleport to any previously explored area.',      req:{DEX:14}, cost:4, icon:'🌑', classRestriction:null,                 cooldown:6,  manaCost:15, effect:{type:'special', teleportExplored:true} },
  death_touch:    { name:'Death Touch',    desc:'Instant kill if HP<30%; otherwise deal 100 damage.', req:{STR:16}, cost:6, icon:'💀', classRestriction:null,            cooldown:12, manaCost:30, effect:{type:'special', instantKill:true, hpThreshold:0.3, fallbackDmg:100} },
  possession:     { name:'Possession',     desc:'Control enemy for 2 rounds.',                   req:{INT:16}, cost:6, icon:'👁️', classRestriction:null,                 cooldown:15, manaCost:35, effect:{type:'special', control:true, duration:2} },
  reincarnate:    { name:'Reincarnate',    desc:'On death, auto-revive with 30% HP (one-time, resets on level up).', req:{WIS:15}, cost:5, icon:'🔄', classRestriction:null, cooldown:0, manaCost:0,  passive:true, effect:{type:'special', reviveOnDeath:true, reviveHp:0.3} },
};
// ─── SKILL RANK SYSTEM ───────────────────────────────────────────────────────
const SKILL_RANKS = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'];
// Cumulative uses required to reach each rank
const SKILL_RANK_XP = [0, 10, 30, 70, 150];

function getSkillRank(skillId) {
  let xp = (game.player.skillXP || {})[skillId] || 0;
  for (let i = SKILL_RANK_XP.length - 1; i >= 0; i--) {
    if (xp >= SKILL_RANK_XP[i]) return i;
  }
  return 0;
}

// Returns 1.2^rank multiplier (Novice: 1.0, Apprentice: 1.2, ..., Master: ~2.07)
function getSkillRankMult(skillId) {
  return Math.pow(1.2, getSkillRank(skillId));
}

// Returns star display: rank 0 = ★☆☆☆☆, rank 4 = ★★★★★
function getSkillStars(skillId) {
  let r = getSkillRank(skillId);
  return '★'.repeat(r + 1) + '☆'.repeat(4 - r);
}

// ─── LIBRARY BOOKS ───────────────────────────────────────────────────────────
const LIBRARY_BOOKS = [
  {
    id: 'combat_guide',
    title: 'Guide to Combat',
    color: '#e74c3c',
    text: 'Combat is turn-based. You have 4 actions: ATTACK uses your weapon damage. SKILL uses a learned ability (with cooldowns). ITEM uses a consumable. FLEE attempts to escape — but you lose XP! Use the terrain and your equipment to your advantage.',
  },
  {
    id: 'understanding_stats',
    title: 'Understanding Stats',
    color: '#3498db',
    text: 'STR increases damage. DEX boosts dodge and crit chance. CON adds max HP. INT gives bonus XP. WIS improves healing. CHA lowers shop prices. Allocate wisely at the Trainer!',
  },
  {
    id: 'art_of_skills',
    title: 'The Art of Skills',
    color: '#2ecc71',
    text: 'Skills are learned from the Trainer using Skill Points earned on level-up. Each skill has a cooldown (shown in turns). Using a skill repeatedly increases its RANK — from Novice to Master — making it more powerful!',
  },
  {
    id: 'equipment_guide',
    title: 'Equipment Guide',
    color: '#f39c12',
    text: 'Equip weapons and armor in the Equipment screen (SHIFT+S). Each piece has stats and slot requirements. Some items have SET bonuses when worn together. Watch for item RARITY colors: Gray, Green, Blue, Purple, Gold.',
  },
  {
    id: 'death_and_recovery',
    title: 'Death and Recovery',
    color: '#95a5a6',
    text: 'When you die, ALL your items (equipment and inventory) are dropped at your corpse. You respawn with nothing. If you die again before recovering, the previous corpse is lost. Return to your corpse to collect everything. You lose 10% of your gold on death.',
  },
];

const trainingDrops = ['hp_potion','torn_cloth','rusty_dagger'];
const floorDrops = {
  1:['hp_potion','hp_potion','hp_potion'],
  2:['hp_potion','big_hp_potion','steel_sword','chain_mail'],
  3:['big_hp_potion','flame_sword','plate_armor']
};
const worldMapDrops = ['hp_potion','hp_potion','big_hp_potion','antidote','iron_sword','leather_armor','rusty_dagger'];
