// state.js — Mutable runtime state: player object (stats, inventory, equipped slots, corpse),
// camera/player visual position, animation flash timers, world encounter cooldowns, and debug flag.
// Depends on: constants.js (TILE).

let game = {
  player: { x: 20, y: 25, hp: 150, maxHp: 150, mana: 0, maxMana: 0, atk: 5, def: 3, gold: 0, lvl: 1, xp: 0, xpNext: 20,
            STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10, skillPoints: 0, learnedSkills: [],
            worldMapSteps: 0, deaths: 0, skillXP: {}, drunkLevel: 0, drunkStepCounter: 0 },
  inventory: [],
  inventoryIds: [],
  _nextItemId: 0,
  lockedItems: [],
  equipped: { HEAD: null, CHEST: null, HANDS: null, FEET: null, MAIN_HAND: null, OFF_HAND: null, SECONDARY_HAND: null, RING: null, AMULET: null },
  currentMap: 'town',
  flags: {},
  kills: 0,
  corpse: null  // { x, y, map, items: {slot: itemId}, inventoryItems: [itemId,...], goldLost }
};

// Adds an item to inventory with a unique instance ID.
function addInventoryItem(typeId) {
  game.inventory.push(typeId);
  game.inventoryIds.push(typeId + '_' + (++game._nextItemId));
}

// Removes an item from inventory by index, keeping inventoryIds in sync.
function removeInventoryItem(index) {
  game.inventory.splice(index, 1);
  game.inventoryIds.splice(index, 1);
}

// Tracks world map encounter cooldowns: { enemyTypeKey: stepsRemaining }
let worldEncounterCooldowns = {};

// Smooth camera
let camX = 0, camY = 0, targetCamX = 0, targetCamY = 0;
// Player visual position (for smooth movement)
let playerVisX = 20 * TILE, playerVisY = 25 * TILE;
let playerTargetX = 20 * TILE, playerTargetY = 25 * TILE;
// Combat flash
let enemyFlashTimer = 0, playerFlashTimer = 0;
// Animation tick
let tick = 0;
// Debug/cheat mode
let debugMode = false;
