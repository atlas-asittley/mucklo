// ═══════════════════════════════════════════════════════════════
// FILE: combat_enemy.js
// PURPOSE: Enemy turn: stun/quickstep/invincibility/dodge checks,
//          damage calc, elemental resist, shield absorb, parry,
//          thorns/reflect, onHit procs, and win/death dispatch
// KEY STATE: none owned; reads/writes combat.js and combat_buffs.js state
// CALLED BY: combat.js (resolvePlayerHit queues via setTimeout),
//            combat_skills.js (skill cases queue via setTimeout)
// CALLS: combat_buffs.js (tickBuffs called first every turn),
//        combat.js (combatWin, playerDeath, addCombatLog, etc.),
//        combat_mechanics.js (getEquippedPassives, calcDamage,
//                             getDamageType, DAMAGE_TYPE_INFO),
//        combat_procs.js (fireOnHitProcs)
// ═══════════════════════════════════════════════════════════════

// Shared early-return path for stun/dodge cases: sets message, updates UI, unlocks.
function _endEnemyTurnEarly(combatMsg, logMsg) {
  setCombatMsg(combatMsg);
  addCombatLog(logMsg, 'system');
  updateCombatUI();
  tickSkillCooldowns();
  combatLocked = false;
}

// Handles the enemy's counterattack turn, respecting stun/quickstep/debuff states.
function doEnemyTurn(prependMsg) {
  // Run all per-round buff/passive ticks (haste, regen, passives, DoT, summon, etc.)
  if (tickBuffs()) return;

  let passives = getEquippedPassives();

  // Stun check: enemy skips its turn (tick inline since this path early-returns)
  if (eDebuffs.stun) {
    eDebuffs.stun.turns--;
    let stunLeft = eDebuffs.stun.turns > 0 ? ` (${eDebuffs.stun.turns} turns left)` : '';
    if (eDebuffs.stun.turns <= 0) delete eDebuffs.stun;
    _endEnemyTurnEarly(
      prependMsg + ` Enemy is stunned and skips their turn!${stunLeft}`,
      `<b>${combatEnemy.name}</b> is stunned — skips their turn!${stunLeft}`
    );
    return;
  }

  // QuickStep: guaranteed dodge this turn
  if (combatPlayerQuickStep) {
    combatPlayerQuickStep = false;
    _endEnemyTurnEarly(prependMsg + ' You dodge the attack!', `Dodged the attack from <b>${combatEnemy.name}</b>!`);
    return;
  }

  // Sanctuary: enemies cannot attack for 1 turn (one-shot protection, consumed on trigger)
  if (pProtect.sanctuary) {
    delete pProtect.sanctuary;
    _endEnemyTurnEarly(prependMsg + ' Sanctuary! Enemy cannot attack!', `🕊️ Sanctuary! <b>${combatEnemy.name}</b> cannot attack you!`);
    return;
  }

  // Invisibility: enemy cannot see you, skips attack for N turns (tick inline since this path early-returns)
  if (pBuffs.invisibility) {
    pBuffs.invisibility.turns--;
    let invLeft = pBuffs.invisibility.turns > 0 ? ` (${pBuffs.invisibility.turns} turn${pBuffs.invisibility.turns > 1 ? 's' : ''} left)` : ' (invisibility fades)';
    if (pBuffs.invisibility.turns <= 0) delete pBuffs.invisibility;
    _endEnemyTurnEarly(
      prependMsg + ` You are invisible — ${combatEnemy.name} cannot find you!${invLeft}`,
      `🫥 Invisible! <b>${combatEnemy.name}</b> cannot find you!${invLeft}`
    );
    return;
  }

  // Passive dodge chance from DEX + dodge passives + camouflage passive skill
  let dodgeChance = (game.player.DEX || 10) * 0.005 + (passives.dodge || 0) / 100;
  if ((game.player.learnedSkills || []).includes('camouflage')) {
    dodgeChance += (skillDefs.camouflage.passiveDodgeBonus || 0) / 100;
  }
  // Pass Without Trace: +50% dodge bonus for N turns (duration ticked in tickPlayerBuffs)
  if (pBuffs.dodgeBonus) dodgeChance += 0.50;
  if (Math.random() < dodgeChance) {
    _endEnemyTurnEarly(prependMsg + ' You dodge the attack!', `Dodged the attack from <b>${combatEnemy.name}</b>!`);
    return;
  }

  let eDmg = calcDamage(combatEnemy.atk, game.player.def);

  // Bless buff: +% DEF reduces incoming damage
  if ((game.playerBuffDef || 0) > 0) {
    let blessDefReduction = Math.floor(eDmg * game.playerBuffDef / 100);
    eDmg = Math.max(1, eDmg - blessDefReduction);
  }

  // Power Strike drawback: enemy's next hit deals +50%
  if (combatPlayerPowerStrike) {
    eDmg = Math.ceil(eDmg * 1.5);
    combatPlayerPowerStrike = false;
  }

  // Ice 3pc slow and dark 3pc ATK debuff: reduce enemy damage (ticked inline — only tick when enemy attacks)
  if (eDebuffs.slow) {
    eDmg = Math.floor(eDmg * 0.8);
    eDebuffs.slow.turns--;
    addCombatLog(`❄️ Slow: ${combatEnemy.name} is slowed! (ATK -20%)`, 'system');
    if (eDebuffs.slow.turns <= 0) delete eDebuffs.slow;
  }
  if (eDebuffs.atkDebuff) {
    eDmg = Math.floor(eDmg * 0.9);
    eDebuffs.atkDebuff.turns--;
    addCombatLog(`💀 Weakened: ${combatEnemy.name} ATK -10%!`, 'system');
    if (eDebuffs.atkDebuff.turns <= 0) delete eDebuffs.atkDebuff;
  }

  // Elemental resistance: reduce incoming damage by player's resistance stat
  let eDmgType = getDamageType(combatEnemy);
  let eDmgTypeInfo = DAMAGE_TYPE_INFO[eDmgType] || DAMAGE_TYPE_INFO.physical;
  let eResistKey = eDmgTypeInfo.resistKey;
  let eResistMult = 1.0;
  if (eResistKey && passives[eResistKey]) {
    eResistMult = 1 - Math.min(0.75, passives[eResistKey] / 100);
  }
  eDmg = Math.max(1, Math.floor(eDmg * eResistMult));

  // Shield absorption: proc shield absorbs damage before HP
  let shieldWasActive = combatPlayerShield > 0;
  if (combatPlayerShield > 0) {
    let absorbed = Math.min(combatPlayerShield, eDmg);
    combatPlayerShield -= absorbed;
    eDmg -= absorbed;
    if (absorbed > 0) addCombatLog(`🛡 Shield absorbed <b class="clog-num">${absorbed}</b> damage!`, 'system');
  }

  // Shield Block active: reduce next incoming damage by the blocked fraction (consumed on trigger)
  if (pProtect.blockNext) {
    let reduction = Math.floor(eDmg * pProtect.blockNext);
    eDmg = Math.max(1, eDmg - reduction);
    delete pProtect.blockNext;
    addCombatLog(`🛡️ Shield Block! Reduced incoming damage by <b class="clog-heal">${reduction}</b>!`, 'system');
  }

  // Divine Shield: immune to all damage for 1 turn (consumed on trigger)
  if (pProtect.divineShield) {
    delete pProtect.divineShield;
    addCombatLog(`🌟 Divine Shield! <b>${combatEnemy.name}</b>'s attack is completely blocked!`, 'system');
    setCombatMsg(prependMsg + ` Divine Shield blocked the attack!`);
    updateCombatUI();
    tickSkillCooldowns();
    combatLocked = false;
    return;
  }

  // Parry passive: 15% chance to reflect melee attack — player takes no damage
  // Only triggers if shield was already down (shield absorbs first, parry should not also fire)
  if (!shieldWasActive && (game.player.learnedSkills || []).includes('parry') && Math.random() < skillDefs.parry.passiveChance) {
    combatEnemy.hp -= eDmg;
    combatTotalDmg += eDmg;
    incrementSkillXP('parry');
    addCombatLog(`🔄 Passive: Parry! Reflected <b class="clog-dmg">${eDmg}</b> dmg back at <b>${combatEnemy.name}</b>!`, 'player');
    setCombatMsg(prependMsg + ` Parry! Reflected ${eDmg} dmg!`);
    updateCombatUI();
    tickSkillCooldowns();
    combatLocked = false;
    if (combatEnemy.hp <= 0) { combatWin(); return; }
    return;
  }

  game.player.hp -= eDmg;
  if (eDmg > 0) {
    playerFlashTimer = 8;
    document.getElementById('combat-arena').classList.add('flash-red');
    setTimeout(() => document.getElementById('combat-arena').classList.remove('flash-red'), 350);
  }

  // Contingency passive: auto-heal once per combat when HP falls below 20%
  if (!combatContingencyUsed && (game.player.learnedSkills || []).includes('contingency') &&
      game.player.hp > 0 && game.player.hp / game.player.maxHp < 0.2) {
    combatContingencyUsed = true;
    let contHeal = Math.floor(game.player.maxHp * 0.3);
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + contHeal);
    addCombatLog(`🔔 Passive: Contingency! Auto-heal triggered! <b class="clog-heal">+${contHeal} HP</b>!`, 'player');
    toast('Contingency! Auto-heal!', 'gold');
  }

  // Thorns / reflect: deal damage back to the attacker
  if (passives.thorns) {
    combatEnemy.hp -= passives.thorns;
    toast(`Thorns! ${combatEnemy.name} takes ${passives.thorns} dmg`, '');
    addCombatLog(`🌿 Thorns! <b>${combatEnemy.name}</b> takes <b class="clog-dmg">-${passives.thorns}</b> dmg back!`, 'player');
  }
  if (passives.reflect) {
    combatEnemy.hp -= passives.reflect;
    toast(`Reflect! ${combatEnemy.name} takes ${passives.reflect} dmg`, '');
    addCombatLog(`🪞 Reflect! <b class="clog-dmg">-${passives.reflect}</b> returned to <b>${combatEnemy.name}</b>!`, 'player');
  }

  // onHit procs: fire when enemy hits player
  fireOnHitProcs();

  let eTypePrefix = eDmgType !== 'physical' ? `${eDmgTypeInfo.icon} ` : '';
  let eResistSuffix = eResistMult < 1 ? ' <i>(Resisted)</i>' : '';
  addCombatLog(`${eTypePrefix}<b>${combatEnemy.name}</b> attacks you for <b class="clog-dmg">-${eDmg}</b>!${eResistSuffix}`, 'enemy');
  setCombatMsg(prependMsg + ` ${combatEnemy.name} deals ${eDmg} dmg!`);
  updateCombatUI();
  tickSkillCooldowns();
  combatLocked = false;

  // Check outcomes after all damage is applied
  if (combatEnemy.hp <= 0 && game.player.hp > 0) { combatWin(); return; }
  if (game.player.hp <= 0) playerDeath();
}
