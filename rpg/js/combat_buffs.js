// ═══════════════════════════════════════════════════════════════
// FILE: combat_buffs.js
// PURPOSE: Declares all buff/debuff/protection state; ticks per-round
//          effects (regen, haste, passives, DoT, summon, possession);
//          reincarnate death-check; combat skills menu UI
// KEY STATE: pBuffs, eDebuffs, pProtect (unified buff objects),
//            combatPlayerStealth, combatSneakJustFired,
//            combatExtraActions, combatSummonRoundsLeft, combatSummonDmg,
//            combatAnimalCompanionRounds, quiveringPalmActive,
//            quiveringPalmHits, combatContingencyUsed
// CALLED BY: combat.js (initCombatScreen resets all state to empty),
//            combat_enemy.js (tickBuffs at top of every enemy turn),
//            combat_skills.js (applyPlayerBuff, applyEnemyDebuff,
//                              toggleCombatSkills, renderCombatSkills)
// CALLS: combat.js (combatWin, playerDeath, addCombatLog, etc.),
//        combat_mechanics.js (getEquippedPassives, calcPlayerAttack)
// ═══════════════════════════════════════════════════════════════

// ─── UNIFIED BUFF / DEBUFF STRUCTURES ─────────────────────────────────────────

// Player duration buffs (keyed by buff ID, each has .turns and optional bonus fields)
// e.g. { regen: {turns:3}, bless: {turns:3, atkBonus:20, defBonus:20}, haste: {turns:2} }
let pBuffs = {};

// Enemy duration debuffs (keyed by debuff ID, each has .turns and optional data fields)
// e.g. { slow: {turns:2}, stun: {turns:1}, atkDebuff: {turns:4},
//         polymorph: {turns:2, savedAtk:50, savedDef:10} }
let eDebuffs = {};

// Player one-shot protections (consumed on trigger)
// e.g. { sanctuary: true, divineShield: true, blockNext: 0.5 }
let pProtect = {};

// ─── FLAT STATE VARS (kept as-is, not in unified structures) ──────────────────

let combatPlayerStealth = false;         // hide passive: player is invisible after attacking
let combatSneakJustFired = false;        // sneak consumed stealth this hit — suppress hide re-activation
let combatExtraActions = 0;              // time_stop: remaining extra player turns before enemy acts
let combatSummonRoundsLeft = 0;          // summon: rounds the summoned creature still attacks
let combatSummonDmg = 0;                 // summon: damage the summoned creature deals per round
let combatAnimalCompanionRounds = 0;     // animal_companion: rounds wolf attacks remaining
let quiveringPalmActive = false;         // quivering_palm: 3 consecutive hits = instant kill
let quiveringPalmHits = 0;              // quivering_palm: consecutive hit counter
let combatContingencyUsed = false;       // contingency: auto-heal used this combat (passive, once per combat)

// ─── BUFF / DEBUFF HELPERS ────────────────────────────────────────────────────

// Apply or refresh a player buff. Takes the max of existing and new turn counts.
function applyPlayerBuff(id, data) {
  let existing = pBuffs[id] || {};
  pBuffs[id] = { ...existing, ...data, turns: Math.max(existing.turns || 0, data.turns || 0) };
  // Keep game.playerBuff* in sync for bless (read by combat_player.js and combat_enemy.js)
  if (id === 'bless') {
    game.playerBuffAtk = pBuffs.bless.atkBonus || 0;
    game.playerBuffDef = pBuffs.bless.defBonus || 0;
  }
}

// Apply or refresh an enemy debuff. Takes the max of existing and new turn counts.
function applyEnemyDebuff(id, data) {
  let existing = eDebuffs[id] || {};
  eDebuffs[id] = { ...existing, ...data, turns: Math.max(existing.turns || 0, data.turns || 0) };
}

// Called when a player buff expires naturally (turns reach 0).
// Used by map_heartbeat.js when buffs tick down out of combat.
function onPlayerBuffExpire(id) {
  switch (id) {
    case 'regen':        toast('Regeneration has worn off', '');       break;
    case 'bless':        toast('Bless has worn off', '');              break;
    case 'haste':        toast('Haste has worn off', '');              break;
    case 'invisibility': toast('Invisibility has worn off', '');       break;
    case 'dodgeBonus':   toast('Pass Without Trace has worn off', ''); break;
  }
}

// Called when an enemy debuff expires naturally (turns reach 0 via tickEnemyDebuffs).
function onEnemyDebuffExpire(id, data) {
  if (id === 'polymorph') {
    combatEnemy.atk = data.savedAtk;
    combatEnemy.def = data.savedDef;
    addCombatLog(`🐸 Polymorph wears off — <b>${combatEnemy.name}</b> returns to normal!`, 'system');
  }
}

// Tick all player duration buffs that decay at the start of each enemy turn.
// Handles regen (apply HP then tick), bless (tick with expire message), dodgeBonus (tick with expire message).
function tickPlayerBuffs() {
  // Regenerate skill: 10 HP/turn for N turns (apply effect then tick)
  if (pBuffs.regen) {
    let skillRegenAmt = 10;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + skillRegenAmt);
    pBuffs.regen.turns--;
    let regenLeft = pBuffs.regen.turns > 0 ? ` (${pBuffs.regen.turns} turns left)` : '';
    addCombatLog(`🌿 Regenerate: <b class="clog-heal">+${skillRegenAmt} HP</b> restored!${regenLeft}`, 'system');
    if (pBuffs.regen.turns <= 0) delete pBuffs.regen;
  }

  // Bless buff: tick duration, clear ATK/DEF on expire
  if (pBuffs.bless) {
    pBuffs.bless.turns--;
    if (pBuffs.bless.turns <= 0) {
      game.playerBuffAtk = 0;
      game.playerBuffDef = 0;
      addCombatLog(`✨ Bless fades — ATK/DEF returned to normal.`, 'system');
      delete pBuffs.bless;
    }
  }

  // Pass Without Trace: tick dodge bonus duration
  if (pBuffs.dodgeBonus) {
    pBuffs.dodgeBonus.turns--;
    if (pBuffs.dodgeBonus.turns <= 0) {
      addCombatLog(`🍃 Pass Without Trace fades — dodge returned to normal.`, 'system');
      delete pBuffs.dodgeBonus;
    }
  }
}

// Tick enemy debuffs that decay every enemy turn regardless of stun/dodge (polymorph).
// Slow, atkDebuff, stun, and possessed are ticked inline where they are checked/applied.
function tickEnemyDebuffs() {
  // Polymorph: tick duration, restore enemy stats when it expires
  if (eDebuffs.polymorph) {
    eDebuffs.polymorph.turns--;
    if (eDebuffs.polymorph.turns <= 0) {
      onEnemyDebuffExpire('polymorph', eDebuffs.polymorph);
      delete eDebuffs.polymorph;
    }
  }
}

// ─── PASSIVE SKILL TRIGGERS ───────────────────────────────────────────────────

// Processes passive skill procs (kick, headbutt, elbow) that fire each combat round.
// Returns true if combat ended (enemy died from a passive hit).
function processPassiveSkills() {
  let learned = game.player.learnedSkills || [];
  for (let skillId of learned) {
    let skill = skillDefs[skillId];
    if (!skill || !skill.passive) continue;
    if (combatEnemy.hp <= 0) return true;

    if (skillId === 'kick' && Math.random() < skill.passiveChance) {
      let dmg = Math.max(1, Math.floor(calcPlayerAttack().dmg * skill.passiveDamageMult));
      combatEnemy.hp -= dmg;
      combatTotalDmg += dmg;
      incrementSkillXP('kick');
      addCombatLog(`👢 Passive: Kick! You deal <b class="clog-num">${dmg}</b> bonus damage!`, 'player');
      if (combatEnemy.hp <= 0) { updateCombatUI(); combatWin(); return true; }
    }

    if (skillId === 'headbutt' && Math.random() < skill.passiveChance) {
      applyEnemyDebuff('stun', { turns: skill.passiveStun || 1 });
      incrementSkillXP('headbutt');
      addCombatLog(`💢 Passive: Headbutt! <b>${combatEnemy.name}</b> is stunned for ${skill.passiveStun || 1} turn!`, 'player');
    }

    if (skillId === 'elbow' && Math.random() < skill.passiveChance) {
      let dmg = Math.max(1, Math.floor(calcPlayerAttack().dmg * skill.passiveDamageMult));
      combatEnemy.hp -= dmg;
      combatTotalDmg += dmg;
      incrementSkillXP('elbow');
      addCombatLog(`👊 Passive: Elbow! <b class="clog-num">${dmg}</b> damage (undodgeable)!`, 'player');
      if (combatEnemy.hp <= 0) { updateCombatUI(); combatWin(); return true; }
    }

    if (skillId === 'dodge' && Math.random() < skill.passiveChance) {
      incrementSkillXP('dodge');
      addCombatLog(`💨 Passive: Dodge! Evaded!`, 'player');
      setCombatMsg(`Dodge! Evaded the attack!`);
      updateCombatUI();
      tickSkillCooldowns();
      combatLocked = false;
      return true;
    }
  }
  return false;
}

// ─── PER-ROUND BUFF TICK ─────────────────────────────────────────────────────

// Runs all per-round buff/passive effects at the start of each enemy turn.
// Returns true if the turn was consumed (early return from doEnemyTurn), false otherwise.
function tickBuffs() {
  // Time Stop: skip enemy turn and give player an extra action
  if (combatExtraActions > 0) {
    combatExtraActions--;
    let left = combatExtraActions > 0 ? ` (${combatExtraActions} extra turn${combatExtraActions > 1 ? 's' : ''} left)` : '';
    addCombatLog(`⏱️ Time Stop! Enemy is frozen — your turn again!${left}`, 'system');
    setCombatMsg(`Time Stop! Extra action!${left}`);
    updateCombatUI();
    tickSkillCooldowns();
    combatLocked = false;
    return true;
  }

  // Haste: player gets an extra action before enemy acts (check then tick)
  if (pBuffs.haste) {
    pBuffs.haste.turns--;
    let hasteLeft = pBuffs.haste.turns > 0 ? ` (${pBuffs.haste.turns} turn${pBuffs.haste.turns > 1 ? 's' : ''} left)` : '';
    addCombatLog(`⚡ Haste! You move at lightning speed — extra action!${hasteLeft}`, 'player');
    setCombatMsg(`Haste! Extra action available!${hasteLeft}`);
    updateCombatUI();
    tickSkillCooldowns();
    if (pBuffs.haste.turns <= 0) delete pBuffs.haste;
    combatLocked = false;
    return true;
  }

  let passives = getEquippedPassives();

  // Process passive skill procs (kick, headbutt, elbow) before enemy acts
  if (processPassiveSkills()) return true;

  // Regen passive from items: restore HP at start of each enemy turn (= each round)
  if (passives.regen) {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + passives.regen);
    toast(`Regen +${passives.regen} HP`, 'green');
    addCombatLog(`Regen: <b class="clog-heal">+${passives.regen} HP</b> restored!`, 'system');
  }

  // Tick player duration buffs (regen skill, bless, dodgeBonus)
  tickPlayerBuffs();

  // Animal Companion: wolf attacks enemy each round
  if (combatAnimalCompanionRounds > 0) {
    let wolfDmg = Math.max(1, Math.floor((game.player.DEX || 10) * 0.5));
    combatEnemy.hp -= wolfDmg;
    combatTotalDmg += wolfDmg;
    combatAnimalCompanionRounds--;
    let wolfLeft = combatAnimalCompanionRounds > 0 ? ` (${combatAnimalCompanionRounds} rounds left)` : ' (wolf departs)';
    addCombatLog(`🐺 Wolf Companion attacks <b>${combatEnemy.name}</b> for <b class="clog-num">${wolfDmg}</b>!${wolfLeft}`, 'player');
    if (combatEnemy.hp <= 0) { updateCombatUI(); combatWin(); return true; }
  }

  // Mana regen: 5 per round (10 for mage)
  if (game.player.maxMana > 0) {
    let manaRegen = game.player.class === 'mage' ? 10 : 5;
    game.player.mana = Math.min(game.player.maxMana, (game.player.mana || 0) + manaRegen);
  }

  // Passive DoT: tick poison/burn/venom damage to enemy each round
  if (passives.poison && combatEnemy.hp > 0) {
    combatEnemy.hp -= passives.poison;
    toast(`Poison! ${combatEnemy.name} takes ${passives.poison} dmg`, '');
    addCombatLog(`☠️ Poison: <b>${combatEnemy.name}</b> takes <b class="clog-dmg">-${passives.poison}</b> dmg!`, 'player');
    if (combatEnemy.hp <= 0) { updateCombatUI(); combatWin(); return true; }
  }
  if (passives.burn && combatEnemy.hp > 0) {
    combatEnemy.hp -= passives.burn;
    toast(`Burn! ${combatEnemy.name} takes ${passives.burn} fire dmg`, '');
    addCombatLog(`🔥 Burn: <b>${combatEnemy.name}</b> takes <b class="clog-dmg">-${passives.burn}</b> fire dmg!`, 'player');
    if (combatEnemy.hp <= 0) { updateCombatUI(); combatWin(); return true; }
  }
  if (combatProcPoison > 0 && combatEnemy.hp > 0) {
    combatEnemy.hp -= combatProcPoison;
    toast(`Venom! ${combatEnemy.name} takes ${combatProcPoison} poison dmg`, '');
    addCombatLog(`☠️ Venom: <b>${combatEnemy.name}</b> takes <b class="clog-dmg">-${combatProcPoison}</b> poison dmg!`, 'player');
    if (combatEnemy.hp <= 0) { updateCombatUI(); combatWin(); return true; }
  }

  // Summon: summoned creature attacks enemy each round
  if (combatSummonRoundsLeft > 0 && combatEnemy.hp > 0) {
    combatEnemy.hp -= combatSummonDmg;
    combatTotalDmg += combatSummonDmg;
    combatSummonRoundsLeft--;
    let summonLeft = combatSummonRoundsLeft > 0 ? ` (${combatSummonRoundsLeft} round${combatSummonRoundsLeft > 1 ? 's' : ''} left)` : '';
    addCombatLog(`👾 Summoned creature attacks <b>${combatEnemy.name}</b> for <b class="clog-num">${combatSummonDmg}</b>!${summonLeft}`, 'player');
    if (combatSummonRoundsLeft === 0) addCombatLog(`👾 Summoned creature fades away.`, 'system');
    if (combatEnemy.hp <= 0) { updateCombatUI(); combatWin(); return true; }
  }

  // Tick enemy debuffs that decay every turn (polymorph)
  tickEnemyDebuffs();

  // Possession: enemy attacks itself for N turns (turn-consuming)
  if (eDebuffs.possessed) {
    let selfDmg = Math.max(1, Math.floor(combatEnemy.atk * 0.8));
    combatEnemy.hp -= selfDmg;
    combatTotalDmg += selfDmg;
    eDebuffs.possessed.turns--;
    let possLeft = eDebuffs.possessed.turns > 0 ? ` (${eDebuffs.possessed.turns} turn${eDebuffs.possessed.turns > 1 ? 's' : ''} left)` : ' (possession ends)';
    addCombatLog(`👁️ Possessed! <b>${combatEnemy.name}</b> attacks itself for <b class="clog-dmg">${selfDmg}</b>!${possLeft}`, 'player');
    updateCombatUI();
    tickSkillCooldowns();
    combatLocked = false;
    if (eDebuffs.possessed.turns <= 0) delete eDebuffs.possessed;
    if (combatEnemy.hp <= 0) { combatWin(); return true; }
    return true;
  }

  return false;
}

// ─── BUFF DISPLAY ─────────────────────────────────────────────────────────────

// Renders active buffs/debuffs/protections in the #combat-buffs overlay.
function renderCombatBuffs() {
  let el = document.getElementById('combat-buffs');
  if (!el) return;
  let lines = [];
  // Player buffs
  if (pBuffs.regen)      lines.push(`🌿 Regen (${pBuffs.regen.turns}t)`);
  if (pBuffs.bless)      lines.push(`✨ Bless (${pBuffs.bless.turns}t)`);
  if (pBuffs.dodgeBonus) lines.push(`🍃 Dodge+ (${pBuffs.dodgeBonus.turns}t)`);
  if (pBuffs.haste)      lines.push(`⚡ Haste (${pBuffs.haste.turns}t)`);
  if (pBuffs.invisibility) lines.push(`🫥 Invis (${pBuffs.invisibility.turns}t)`);
  // Player protections
  if (pProtect.sanctuary)   lines.push(`🕊️ Sanctuary`);
  if (pProtect.divineShield) lines.push(`🌟 DivShield`);
  if (pProtect.blockNext)   lines.push(`🛡️ Block`);
  // Enemy debuffs
  if (eDebuffs.slow)      lines.push(`❄️ Slow (${eDebuffs.slow.turns}t)`);
  if (eDebuffs.atkDebuff) lines.push(`💀 Weaken (${eDebuffs.atkDebuff.turns}t)`);
  if (eDebuffs.stun)      lines.push(`💥 Stun (${eDebuffs.stun.turns}t)`);
  if (eDebuffs.possessed) lines.push(`👁️ Possess (${eDebuffs.possessed.turns}t)`);
  if (eDebuffs.polymorph) lines.push(`🐸 Polymorph (${eDebuffs.polymorph.turns}t)`);
  el.innerHTML = lines.join('<br>');
}

// ─── REINCARNATE DEATH-CHECK ──────────────────────────────────────────────────

// Checks if the player should be revived by the Reincarnate passive on death.
// Returns true if the player was revived (caller should abort death sequence).
function checkReincarnate() {
  if ((game.player.learnedSkills || []).includes('reincarnate') && !game.player.reincarnateUsed) {
    game.player.reincarnateUsed = true;
    game.player.hp = Math.max(1, Math.floor(game.player.maxHp * 0.3));
    addCombatLog(`🔄 Reincarnate! You defy death and rise with <b class="clog-heal">${game.player.hp} HP</b>!`, 'player');
    toast('Reincarnate! You revive with 30% HP!', 'gold');
    msg('Reincarnate! You defied death!');
    setCombatMsg('Reincarnate! You rise again — fight on!');
    updateCombatUI();
    combatLocked = false;
    return true;
  }
  return false;
}

// ─── COMBAT SKILLS MENU ───────────────────────────────────────────────────────

function toggleCombatSkills() {
  let menu = document.getElementById('combat-skills-menu');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    renderCombatSkills();
    menu.style.display = 'flex';
  }
}

function hideCombatSkills() {
  let menu = document.getElementById('combat-skills-menu');
  if (menu) menu.style.display = 'none';
}

function renderCombatSkills() {
  let menu = document.getElementById('combat-skills-menu');
  menu.innerHTML = '';
  let learned = game.player.learnedSkills || [];
  if (learned.length === 0) {
    menu.innerHTML = '<div class="combat-skills-empty">No skills learned. Visit the Trainer!</div>';
    return;
  }
  let cooldowns = game.player.skillCooldowns || {};
  let currentMana = game.player.mana || 0;
  let hasActive = false;
  let passiveItems = [];

  for (let skillId of learned) {
    let skill = skillDefs[skillId];
    // Passive skills: collect for display but don't show as buttons
    if (skill.passive) {
      passiveItems.push(skill);
      continue;
    }
    hasActive = true;
    let cd = cooldowns[skillId] || 0;
    let stars = getSkillStars(skillId);
    let rankName = SKILL_RANKS[getSkillRank(skillId)];
    let manaCost = skill.manaCost || 0;
    let noMana = manaCost > 0 && currentMana < manaCost;
    let mpLabel = manaCost > 0 ? ` <span class="skill-mp-cost">${manaCost}MP</span>` : '';
    let btn = document.createElement('button');
    btn.className = 'btn btn-skill' + (cd > 0 ? ' btn-skill-cooldown' : '') + (noMana ? ' btn-skill-no-mana' : '');
    if (cd > 0) {
      btn.innerHTML = `${skill.icon} ${skill.name}${mpLabel} <span class="skill-cd">(${cd}t)</span><div class="skill-rank-stars" title="${rankName}">${stars}</div>`;
      btn.disabled = true;
    } else {
      btn.innerHTML = `${skill.icon} ${skill.name}${mpLabel}<div class="skill-rank-stars" title="${rankName}">${stars}</div>`;
      btn.onclick = () => { hideCombatSkills(); combatUseSkill(skillId); };
    }
    menu.appendChild(btn);
  }

  // Show passive skills as an info section below active skills
  if (passiveItems.length > 0) {
    let divider = document.createElement('div');
    divider.className = 'combat-skills-passive-header';
    divider.textContent = 'PASSIVE (auto)';
    menu.appendChild(divider);
    for (let skill of passiveItems) {
      let row = document.createElement('div');
      row.className = 'combat-skills-passive-row';
      row.innerHTML = `${skill.icon} <span class="passive-name">${skill.name}</span> <span class="passive-desc">${skill.desc}</span>`;
      menu.appendChild(row);
    }
  }
}
