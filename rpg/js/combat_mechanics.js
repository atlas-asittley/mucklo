// ═══════════════════════════════════════════════════════════════
// FILE: combat_mechanics.js
// PURPOSE: Pure combat math — damage type constants, synergy counts,
//          equipped passives aggregation, damage formula, crit rolls,
//          and player/enemy stat recalculation (maxHp, maxMana)
// KEY STATE: DAMAGE_TYPE_INFO, DAMAGE_TYPE_AFFINITIES (read-only
//            constants); no mutable combat state declared here
// CALLED BY: all other combat files (universal math dependency)
// CALLS: constants.js, state.js, data.js only — no combat file deps
//        (exception: calcPlayerAttack reads combatEnemy from combat.js)
// ═══════════════════════════════════════════════════════════════

// ─── DAMAGE TYPE SYSTEM ───────────────────────────────────────────────────────

const DAMAGE_TYPE_INFO = {
  fire:      { icon: '🔥', label: 'Fire',      color: '#ff4500', resistKey: 'fireResist' },
  ice:       { icon: '❄️',  label: 'Ice',       color: '#a8d8ea', resistKey: 'iceResist' },
  lightning: { icon: '⚡', label: 'Lightning', color: '#ffe066', resistKey: 'lightningResist' },
  poison:    { icon: '☠️',  label: 'Poison',    color: '#7ac94b', resistKey: 'poisonResist' },
  holy:      { icon: '✝️',  label: 'Holy',      color: '#f5e6c8', resistKey: 'holyResist' },
  dark:      { icon: '💀', label: 'Dark',      color: '#9b59b6', resistKey: 'darkResist' },
  physical:  { icon: '⚔️',  label: 'Physical', color: '#aaaaaa', resistKey: null },
};

// Each damage-typed enemy is weak to one type and resists its own type.
const DAMAGE_TYPE_AFFINITIES = {
  fire:      { weak: 'ice',  resist: 'fire' },
  ice:       { weak: 'fire', resist: 'ice' },
  lightning: { weak: 'ice',  resist: 'lightning' },
  poison:    { weak: 'holy', resist: 'poison' },
  holy:      { weak: 'dark', resist: 'holy' },
  dark:      { weak: 'holy', resist: 'dark' },
  physical:  { weak: null,   resist: null },
};

function getDamageType(enemy) {
  return enemy.damageType || 'physical';
}

function getPlayerDamageType() {
  let weaponId = game.equipped && game.equipped.MAIN_HAND;
  if (weaponId && itemDefs[weaponId] && itemDefs[weaponId].damageType) {
    return itemDefs[weaponId].damageType;
  }
  return 'physical';
}

// Returns damage multiplier when player (using playerDmgType) attacks this enemy.
function getEnemyDmgMultiplier(enemy, playerDmgType) {
  let enemyDmgType = getDamageType(enemy);
  let affinity = DAMAGE_TYPE_AFFINITIES[enemyDmgType] || {};
  if (playerDmgType !== 'physical' && affinity.weak === playerDmgType) return 1.5;
  if (playerDmgType !== 'physical' && affinity.resist === playerDmgType) return 0.5;
  return 1.0;
}

// ─────────────────────────────────────────────────────────────────────────────

function rollGoldDrop(enemy) {
  return enemy.gold[0] + Math.floor(Math.random() * (enemy.gold[1] - enemy.gold[0]));
}

// ─── SYNERGY SYSTEM ──────────────────────────────────────────────────────────

// Count equipped items by damageType for synergy calculation.
function calculateSynergyCounts() {
  let counts = { fire: 0, ice: 0, lightning: 0, poison: 0, holy: 0, dark: 0 };
  for (let itemId of Object.values(game.equipped)) {
    if (!itemId || !itemDefs[itemId] || !itemDefs[itemId].damageType) continue;
    let dt = itemDefs[itemId].damageType;
    if (counts[dt] !== undefined) counts[dt]++;
  }
  return counts;
}

// Human-readable synergy tier label for combat log and UI.
function getSynergyLabel(dtype, count) {
  const LABELS = {
    fire:      { 1: '+2 fire dmg/item', 2: '+5% fire dmg', 3: '+10% fire dmg + Burn Aura' },
    ice:       { 1: '+2 ice dmg/item',  2: '+5% ice dmg',  3: '+10% ice dmg + Slow' },
    lightning: { 1: '+2 lt dmg/item',   2: '+5% lt dmg',   3: '+10% lt dmg + Chain' },
    poison:    { 1: '+1 poison/item',   2: '+50% poison',  3: '+50% poison + Spread' },
    holy:      { 1: '+3 regen/item',    2: '+10% healing', 3: '+20% healing + Cleanse' },
    dark:      { 1: '+2% lifesteal/item', 2: '+5% lifesteal', 3: '+10% lifesteal + ATK Debuff' },
  };
  let tier = count >= 3 ? 3 : count >= 2 ? 2 : 1;
  return (LABELS[dtype] || {})[tier] || '';
}

// ─────────────────────────────────────────────────────────────────────────────

// Returns a merged map of all passive effects from every equipped item, active set
// bonuses, and active synergy bonuses.
function getEquippedPassives() {
  let passives = {};
  for (let itemId of Object.values(game.equipped)) {
    if (!itemId || !itemDefs[itemId] || !itemDefs[itemId].passive) continue;
    for (let [key, val] of Object.entries(itemDefs[itemId].passive)) {
      passives[key] = (passives[key] || 0) + val;
    }
  }
  if (game.setBonus) {
    for (let [key, val] of Object.entries(game.setBonus)) {
      if (key === '_appliedStats') continue;
      passives[key] = (passives[key] || 0) + val;
    }
  }
  // Synergy passives
  let syn = calculateSynergyCounts();
  // Fire 3pc: burn aura (2 burn per round)
  if (syn.fire >= 3) passives.burn = (passives.burn || 0) + 2;
  // Poison: +1 per item; 2pc+: x1.5 total poison
  if (syn.poison >= 1) {
    passives.poison = (passives.poison || 0) + syn.poison;
    if (syn.poison >= 2) passives.poison = Math.floor(passives.poison * 1.5);
  }
  // Holy: +3 regen per item; 2pc: +10% heal bonus; 3pc: +20% heal bonus
  if (syn.holy >= 1) passives.regen = (passives.regen || 0) + syn.holy * 3;
  if (syn.holy >= 3) passives.healBonus = Math.max(passives.healBonus || 0, 20);
  else if (syn.holy >= 2) passives.healBonus = Math.max(passives.healBonus || 0, 10);
  // Dark: lifesteal tiers (+2% per item, min 5% at 2pc, min 10% at 3pc)
  if (syn.dark >= 1) {
    let darkLifesteal = syn.dark * 2;
    if (syn.dark >= 2) darkLifesteal = Math.max(darkLifesteal, 5);
    if (syn.dark >= 3) darkLifesteal = Math.max(darkLifesteal, 10);
    passives.lifesteal = (passives.lifesteal || 0) + darkLifesteal;
  }
  return passives;
}

// ─── STAT CALCULATIONS ────────────────────────────────────────────────────────

function calcDamage(atk, def) {
  return Math.max(1, atk - def + Math.floor(Math.random() * 3) - 1);
}

function recalcMaxHp() {
  let maxHpBonus = ((game.setBonus || {})._appliedStats || {}).maxHp || 0;
  if (game.player.classBaseHp !== undefined) {
    // Class-based formula: startHp grows by 5 per CON above the class's starting CON
    let baseCon = game.player.classBaseCon !== undefined ? game.player.classBaseCon : 10;
    game.player.maxHp = game.player.classBaseHp + (game.player.CON - baseCon) * 5 + maxHpBonus;
  } else {
    // Legacy formula for pre-class saves
    game.player.maxHp = 100 + game.player.CON * 5 + maxHpBonus;
  }
}

function recalcMaxMana() {
  let cls = CLASS_DEFS[game.player.class || 'warrior'];
  let baseMana = cls ? cls.baseMana : 20;
  let manaPerInt = cls ? cls.manaPerInt : 2;
  game.player.maxMana = baseMana + (game.player.INT || 10) * manaPerInt;
  if (game.player.mana === undefined) game.player.mana = game.player.maxMana;
}

// Returns { dmg, crit } for a player attack roll against the current combatEnemy.
function calcPlayerAttack() {
  let strBonus = Math.floor((game.player.STR || 10) / 2);
  let raw = Math.max(1, game.player.atk + strBonus - combatEnemy.def + Math.floor(Math.random() * 3) - 1);
  // Berserk passive: +25% ATK when HP below 50%
  if ((game.player.learnedSkills || []).includes('berserk') &&
      game.player.hp < game.player.maxHp * skillDefs.berserk.passiveHpThreshold) {
    raw = Math.ceil(raw * (1 + skillDefs.berserk.passiveAtkBonus / 100));
  }
  let critChance = (game.player.DEX || 10) * 0.003;
  let passives = getEquippedPassives();
  if (passives.crit) critChance += passives.crit / 100;
  if (Math.random() < critChance) return { dmg: raw * 2, crit: true };
  return { dmg: raw, crit: false };
}
