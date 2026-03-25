// data_skills.js — Skill definitions, skill rank system, and rank helper functions.
// Depends on: state.js (game).
// Provides: skillDefs, SKILL_RANKS, SKILL_RANK_XP, getSkillRank, getSkillRankMult, getSkillStars.

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

