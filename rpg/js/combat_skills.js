// ═══════════════════════════════════════════════════════════════
// FILE: combat_skills.js
// PURPOSE: Active skill dispatch — mana/cooldown gate, skill XP
//          tracking (incrementSkillXP), and one switch case per
//          learnable active skill (damage, buffs, escapes, utilities)
// KEY STATE: none owned; all effects write to combat.js and
//            combat_buffs.js state
// CALLED BY: combat_buffs.js (renderCombatSkills button onclick
//            calls combatUseSkill(skillId))
// CALLS: combat.js (resolvePlayerHit, addCombatLog, setCombatMsg,
//                   updateCombatUI, showBattleEndScreen),
//        combat_buffs.js (applyPlayerBuff, applyEnemyDebuff and
//                         all flat buff vars),
//        combat_enemy.js (doEnemyTurn via setTimeout),
//        combat_mechanics.js (calcPlayerAttack, getEnemyDmgMultiplier)
// ═══════════════════════════════════════════════════════════════

// Increments skill use count and fires rank-up notification if a new rank is reached.
function incrementSkillXP(skillId) {
  let p = game.player;
  if (!p.skillXP) p.skillXP = {};
  let oldRank = getSkillRank(skillId);
  p.skillXP[skillId] = (p.skillXP[skillId] || 0) + 1;
  let newRank = getSkillRank(skillId);
  if (newRank > oldRank) {
    let rankName = SKILL_RANKS[newRank];
    let skillName = skillDefs[skillId].name;
    toast(`Skill Rank Up! ${skillName} is now ${rankName}!`, 'gold');
    msg(`Skill Rank Up! ${skillName} is now ${rankName}!`);
  }
}

function combatUseSkill(skillId) {
  if (combatLocked) return;
  if ((game.player.skillCooldowns || {})[skillId] > 0) return;
  let p = game.player;
  // Check mana cost before locking
  let skillDef = skillDefs[skillId];
  let manaCost = skillDef ? (skillDef.manaCost || 0) : 0;
  if (manaCost > 0 && (p.mana || 0) < manaCost) {
    toast(`Not enough mana! (need ${manaCost})`, 'red');
    setCombatMsg(`Not enough mana! (need ${manaCost} MP)`);
    return;
  }
  combatLocked = true;
  // Deduct mana
  if (manaCost > 0) p.mana = Math.max(0, (p.mana || 0) - manaCost);
  // Set cooldown for the skill before executing
  if (skillDef && skillDef.cooldown > 0) {
    if (!p.skillCooldowns) p.skillCooldowns = {};
    p.skillCooldowns[skillId] = skillDef.cooldown;
  }
  switch (skillId) {
    case 'heal': {
      incrementSkillXP('heal');
      let healMult = getSkillRankMult('heal');
      let healAmt = Math.floor(p.maxHp * 0.3 * healMult);
      p.hp = Math.min(p.maxHp, p.hp + healAmt);
      addCombatLog(`You used Heal! Restored <b class="clog-heal">+${healAmt} HP</b>.`, 'player');
      setCombatMsg(`Heal! Restored ${healAmt} HP.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Healed ${healAmt} HP.`), 500);
      break;
    }
    case 'power_strike': {
      incrementSkillXP('power_strike');
      let psMult = getSkillRankMult('power_strike');
      let pDmg = Math.floor(calcPlayerAttack().dmg * 2 * psMult);
      combatPlayerPowerStrike = true;
      addCombatLog(`⚔️ Power Strike! You struck <b>${combatEnemy.name}</b> for <b class="clog-num">${pDmg}</b>!`, 'player');
      resolvePlayerHit(pDmg, `Power Strike! ${pDmg} damage! (Next enemy hit +50%)`, `Power Strike! ${pDmg} dmg!`);
      break;
    }
    case 'shield_bash': {
      incrementSkillXP('shield_bash');
      let stunTurns = 1 + getSkillRank('shield_bash');
      applyEnemyDebuff('stun', { turns: stunTurns });
      let sbDmg = calcPlayerAttack().dmg;
      let stunText = stunTurns > 1 ? `Enemy stunned for ${stunTurns} turns!` : 'Enemy stunned!';
      addCombatLog(`🛡 Shield Bash! You struck <b>${combatEnemy.name}</b> for <b class="clog-num">${sbDmg}</b>! ${stunText}`, 'player');
      resolvePlayerHit(sbDmg, `Shield Bash! ${sbDmg} damage! ${stunText}`, `Shield Bash! ${sbDmg} dmg!`);
      break;
    }
    case 'fireball': {
      incrementSkillXP('fireball');
      let fbMult = getSkillRankMult('fireball');
      let fbFireMult = getEnemyDmgMultiplier(combatEnemy, 'fire');
      let fbDmg = Math.floor((p.INT || 10) * 3 * fbMult * fbFireMult);
      let fbSuffix = fbFireMult > 1 ? ' Super effective!' : fbFireMult < 1 ? ' Resisted!' : '';
      addCombatLog(`🔥 Fireball! You dealt <b class="clog-num">${fbDmg}</b> fire damage to <b>${combatEnemy.name}</b>!${fbSuffix}`, 'player');
      resolvePlayerHit(fbDmg, `Fireball! ${fbDmg} fire damage!${fbSuffix}`, `Fireball! ${fbDmg} dmg!`);
      break;
    }
    case 'quick_step': {
      incrementSkillXP('quick_step');
      combatPlayerQuickStep = true;
      let qsRank = getSkillRank('quick_step');
      let qsBonus = qsRank > 0 ? ` (+${qsRank * 5}% dodge aura)` : '';
      addCombatLog('Quick Step! You will dodge the next attack!', 'player');
      setCombatMsg(`Quick Step! You will dodge the next attack!${qsBonus}`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Quick Step!`), 500);
      break;
    }
    case 'cheat_god_mode': {
      resolvePlayerHit(99999, `☠️ GOD MODE! 99999 true damage!`, `☠️ GOD MODE! 99999 dmg!`);
      break;
    }
    // ── Warrior actives ───────────────────────────────────────────────────────
    case 'bash': {
      incrementSkillXP('bash');
      let bashMult = getSkillRankMult('bash');
      let bashDmg = Math.floor(calcPlayerAttack().dmg * 1.2 * bashMult);
      applyEnemyDebuff('stun', { turns: skillDefs.bash.effect.stun || 1 });
      addCombatLog(`💥 Bash! You struck <b>${combatEnemy.name}</b> for <b class="clog-num">${bashDmg}</b>! Enemy stunned!`, 'player');
      resolvePlayerHit(bashDmg, `Bash! ${bashDmg} dmg! Enemy stunned!`, `Bash! ${bashDmg} dmg!`);
      break;
    }
    case 'whirlwind': {
      incrementSkillXP('whirlwind');
      let wwMult = getSkillRankMult('whirlwind');
      let wwDmgPer = Math.floor(calcPlayerAttack().dmg * 0.35 * wwMult);
      let wwTotal = 4;
      function doWWHit(n) {
        addCombatLog(`🌀 Whirlwind hit ${n}/${wwTotal}! <b class="clog-num">${wwDmgPer}</b> dmg!`, 'player');
        let cb = n < wwTotal ? () => doWWHit(n + 1) : null;
        resolvePlayerHit(wwDmgPer, `Whirlwind hit ${n}/${wwTotal}! ${wwDmgPer} dmg!`, `Whirlwind!`, cb);
      }
      doWWHit(1);
      break;
    }
    case 'shield_block': {
      incrementSkillXP('shield_block');
      pProtect.blockNext = skillDefs.shield_block.effect.blockNext || 0.5;
      addCombatLog(`🛡️ Shield Block! Braced — next hit deals 50% less damage!`, 'player');
      setCombatMsg(`Shield Block! Braced for the next attack.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Shield Block active.`), 500);
      break;
    }
    case 'disarm': {
      incrementSkillXP('disarm');
      applyEnemyDebuff('stun', { turns: 1 });
      addCombatLog(`🚫 Disarm! <b>${combatEnemy.name}</b> is disarmed and loses their turn!`, 'player');
      setCombatMsg(`Disarm! ${combatEnemy.name} loses their turn!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Disarmed ${combatEnemy.name}!`), 500);
      break;
    }
    case 'trip': {
      incrementSkillXP('trip');
      applyEnemyDebuff('stun', { turns: 1 });
      addCombatLog(`🦵 Trip! <b>${combatEnemy.name}</b> falls and skips their next turn!`, 'player');
      setCombatMsg(`Trip! ${combatEnemy.name} skips their next turn!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Tripped ${combatEnemy.name}!`), 500);
      break;
    }
    // ── Rogue actives ─────────────────────────────────────────────────────────
    case 'backstab': {
      incrementSkillXP('backstab');
      let bsMult = getSkillRankMult('backstab');
      let bsDmg = Math.floor(calcPlayerAttack().dmg * 2.5 * bsMult);
      addCombatLog(`🗡️ Backstab! You strike <b>${combatEnemy.name}</b> for <b class="clog-num">${bsDmg}</b> damage!`, 'player');
      resolvePlayerHit(bsDmg, `Backstab! ${bsDmg} dmg!`, `Backstab! ${bsDmg} dmg!`);
      break;
    }
    case 'assassinate': {
      incrementSkillXP('assassinate');
      let assThreshold = skillDefs.assassinate.effect.hpThreshold || 0.2;
      if (combatEnemy.hp / combatEnemy.maxHp < assThreshold) {
        addCombatLog(`☠️ Assassinate! <b>${combatEnemy.name}</b> is executed!`, 'player');
        resolvePlayerHit(combatEnemy.hp + 9999, `Assassinate! Instant kill!`, `Assassinate!`);
      } else {
        // Refund cooldown and mana — condition not met
        if (!p.skillCooldowns) p.skillCooldowns = {};
        p.skillCooldowns['assassinate'] = 0;
        p.mana = Math.min(p.maxMana || 0, (p.mana || 0) + (skillDefs.assassinate.manaCost || 0));
        toast(`Assassinate failed! Enemy HP must be below 20%.`, 'red');
        setCombatMsg(`Assassinate failed! Enemy HP too high (need < 20%).`);
        updateCombatUI();
        combatLocked = false;
      }
      break;
    }
    case 'vanish': {
      incrementSkillXP('vanish');
      if (isWorldMapEncounter) {
        isWorldMapEncounter = false;
        if (combatEnemyIndex >= 0) { enemies.splice(combatEnemyIndex, 1); combatEnemyIndex = -1; }
      }
      addCombatLog(`🌫️ Vanish! You disappear into the shadows — fled with no XP loss!`, 'player');
      toast('Vanished! Escaped with no penalty.', 'green');
      msg('You vanished from combat — no XP lost!');
      showBattleEndScreen();
      break;
    }
    case 'steal': {
      incrementSkillXP('steal');
      let stealDrops = combatEnemy.drops || [];
      if (stealDrops.length > 0) {
        let stolenId = stealDrops[Math.floor(Math.random() * stealDrops.length)];
        let stolenDef = itemDefs[stolenId];
        let stolenName = stolenDef ? stolenDef.name : stolenId;
        game.inventory.push(stolenId);
        addCombatLog(`💰 Steal! You swiped <b>${stolenName}</b> from <b>${combatEnemy.name}</b>!`, 'player');
        setCombatMsg(`Steal! You got: ${stolenName}!`);
        toast(`Stole ${stolenName}!`, 'gold');
      } else {
        // Refund cooldown and mana — nothing to steal
        if (!p.skillCooldowns) p.skillCooldowns = {};
        p.skillCooldowns['steal'] = 0;
        p.mana = Math.min(p.maxMana || 0, (p.mana || 0) + (skillDefs.steal.manaCost || 0));
        addCombatLog(`💰 Steal! <b>${combatEnemy.name}</b> has nothing to steal.`, 'system');
        setCombatMsg(`Steal! ${combatEnemy.name} has nothing to steal.`);
      }
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Steal attempt!`), 500);
      break;
    }
    case 'pick_lock': {
      incrementSkillXP('pick_lock');
      addCombatLog(`🔓 Pick Lock has no effect in combat — use it on locked doors and chests!`, 'system');
      setCombatMsg(`Pick Lock is used outside of combat.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Pick Lock...`), 500);
      break;
    }
    case 'peek': {
      incrementSkillXP('peek');
      addCombatLog(`👁️ Peek has no effect in combat — use it to reveal hidden traps and secrets!`, 'system');
      setCombatMsg(`Peek is used outside of combat.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Peek...`), 500);
      break;
    }
    case 'track': {
      incrementSkillXP('track');
      addCombatLog(`🐾 Track has no effect in combat — use it to highlight enemies on the map!`, 'system');
      setCombatMsg(`Track is used outside of combat.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Track...`), 500);
      break;
    }
    // ── Paladin actives ───────────────────────────────────────────────────────
    case 'cure_critical': {
      incrementSkillXP('cure_critical');
      let ccMult = getSkillRankMult('cure_critical');
      let ccAmt = Math.floor(p.maxHp * 0.8 * ccMult);
      p.hp = Math.min(p.maxHp, p.hp + ccAmt);
      addCombatLog(`💗 Cure Critical! Restored <b class="clog-heal">+${ccAmt} HP</b>.`, 'player');
      setCombatMsg(`Cure Critical! Restored ${ccAmt} HP.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Cure Critical! +${ccAmt} HP.`), 500);
      break;
    }
    case 'bless': {
      incrementSkillXP('bless');
      applyPlayerBuff('bless', { turns: 3, atkBonus: 20, defBonus: 20 });
      addCombatLog(`✨ Bless! ATK and DEF +20% for 3 turns!`, 'player');
      setCombatMsg(`Bless! ATK/DEF +20% for 3 turns!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Bless active!`), 500);
      break;
    }
    case 'sanctuary': {
      incrementSkillXP('sanctuary');
      pProtect.sanctuary = true;
      addCombatLog(`🕊️ Sanctuary! Enemies cannot attack you this turn!`, 'player');
      setCombatMsg(`Sanctuary! Enemies cannot attack you!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Sanctuary!`), 500);
      break;
    }
    case 'regenerate': {
      incrementSkillXP('regenerate');
      applyPlayerBuff('regen', { turns: 3 });
      addCombatLog(`🌿 Regenerate! You will heal 10 HP per turn for 3 turns!`, 'player');
      setCombatMsg(`Regenerate! +10 HP/turn for 3 turns.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Regenerate!`), 500);
      break;
    }
    case 'word_of_recall': {
      incrementSkillXP('word_of_recall');
      if (isWorldMapEncounter) {
        isWorldMapEncounter = false;
        if (combatEnemyIndex >= 0) { enemies.splice(combatEnemyIndex, 1); combatEnemyIndex = -1; }
      }
      addCombatLog(`🏠 Word of Recall! Teleporting to town!`, 'player');
      toast('Word of Recall! Returning to town...', 'green');
      msg('You recall to town!');
      game.player.x = 28; game.player.y = 14;
      game.currentMap = 'town';
      showBattleEndScreen();
      break;
    }
    case 'divine_shield': {
      incrementSkillXP('divine_shield');
      pProtect.divineShield = true;
      addCombatLog(`🌟 Divine Shield! You are immune to damage for 1 turn!`, 'player');
      setCombatMsg(`Divine Shield! Immune to damage for 1 turn!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Divine Shield!`), 500);
      break;
    }
    case 'cure_poison': {
      incrementSkillXP('cure_poison');
      combatProcPoison = 0;
      addCombatLog(`🧪 Cure Poison! Poison status removed!`, 'player');
      setCombatMsg(`Cure Poison! You are cleansed.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Cure Poison!`), 500);
      break;
    }
    // ── Ranger actives ────────────────────────────────────────────────────────
    case 'call_lightning': {
      incrementSkillXP('call_lightning');
      let clMult = getSkillRankMult('call_lightning');
      let clDmgPer = Math.floor((p.DEX || 10) * 2 * 0.65 * clMult);
      let clTotal = 3;
      function doCLHit(n) {
        addCombatLog(`⛈️ Call Lightning hit ${n}/${clTotal}! <b class="clog-num">${clDmgPer}</b> lightning dmg!`, 'player');
        let cb = n < clTotal ? () => doCLHit(n + 1) : null;
        resolvePlayerHit(clDmgPer, `Call Lightning hit ${n}/${clTotal}! ${clDmgPer} dmg!`, `Call Lightning!`, cb);
      }
      doCLHit(1);
      break;
    }
    case 'animal_companion': {
      incrementSkillXP('animal_companion');
      combatAnimalCompanionRounds = 3;
      let wolfDmg = Math.max(1, Math.floor((p.DEX || 10) * 0.5));
      addCombatLog(`🐺 Animal Companion! A wolf joins the fight for 3 rounds! (~${wolfDmg} dmg/round)`, 'player');
      setCombatMsg(`Animal Companion! Wolf attacks for 3 rounds!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Wolf companion summoned!`), 500);
      break;
    }
    case 'forage': {
      incrementSkillXP('forage');
      let foragePool = ['herb_potion', 'big_herb_potion', 'antidote'];
      let foragedId = foragePool[Math.floor(Math.random() * foragePool.length)];
      game.inventory.push(foragedId);
      let foragedName = (itemDefs[foragedId] || {}).name || foragedId;
      addCombatLog(`🌾 Forage! You found a <b>${foragedName}</b>!`, 'player');
      setCombatMsg(`Forage! Found: ${foragedName}!`);
      toast(`Forage: Found ${foragedName}!`, 'green');
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Foraged ${foragedName}!`), 500);
      break;
    }
    case 'pass_without_trace': {
      incrementSkillXP('pass_without_trace');
      applyPlayerBuff('dodgeBonus', { turns: 3 });
      addCombatLog(`🍃 Pass Without Trace! +50% dodge for 3 turns!`, 'player');
      setCombatMsg(`Pass Without Trace! Dodge +50% for 3 turns!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Pass Without Trace!`), 500);
      break;
    }
    // ── Mage actives ──────────────────────────────────────────────────────────
    case 'lightning_bolt': {
      incrementSkillXP('lightning_bolt');
      let lbMult = getSkillRankMult('lightning_bolt');
      let lbDmg = Math.floor((p.INT || 10) * 1.8 * lbMult);
      let lbStun = Math.random() < 0.15;
      if (lbStun) applyEnemyDebuff('stun', { turns: 1 });
      let lbStunText = lbStun ? ' Enemy stunned!' : '';
      addCombatLog(`⚡ Lightning Bolt! You deal <b class="clog-num">${lbDmg}</b> magic damage to <b>${combatEnemy.name}</b>!${lbStunText}`, 'player');
      resolvePlayerHit(lbDmg, `Lightning Bolt! ${lbDmg} damage!${lbStunText}`, `Lightning Bolt! ${lbDmg} dmg!`);
      break;
    }
    case 'harm': {
      incrementSkillXP('harm');
      let harmDmg = Math.min(200, Math.floor(combatEnemy.hp / 2));
      addCombatLog(`💀 Harm! Dealt <b class="clog-num">${harmDmg}</b> damage (half of <b>${combatEnemy.name}</b>'s current HP)!`, 'player');
      resolvePlayerHit(harmDmg, `Harm! ${harmDmg} damage!`, `Harm! ${harmDmg} dmg!`);
      break;
    }
    case 'dispel_magic': {
      incrementSkillXP('dispel_magic');
      applyEnemyDebuff('atkDebuff', { turns: 4 });
      addCombatLog(`✨ Dispel Magic! <b>${combatEnemy.name}</b>'s magical defenses stripped! (ATK -10% for 4 turns)`, 'player');
      setCombatMsg(`Dispel Magic! Enemy weakened for 4 turns!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Dispel Magic!`), 500);
      break;
    }
    case 'teleport': {
      incrementSkillXP('teleport');
      addCombatLog(`🔮 <b class="clog-system">Teleported!</b> You vanish from combat instantly!`, 'system');
      toast('Teleported away!', 'green');
      msg('You teleported away from combat!');
      showBattleEndScreen();
      break;
    }
    case 'summon': {
      incrementSkillXP('summon');
      combatSummonRoundsLeft = 2;
      combatSummonDmg = Math.floor((p.INT || 10) * 5);
      addCombatLog(`👾 Summon! A creature appears and will fight for 2 rounds (${combatSummonDmg} dmg/round)!`, 'player');
      setCombatMsg(`Summon! Creature will attack for 2 rounds!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Summoned a creature!`), 500);
      break;
    }
    case 'meteor_swarm': {
      incrementSkillXP('meteor_swarm');
      let msMult = getSkillRankMult('meteor_swarm');
      let msDmgPer = Math.floor((p.INT || 10) * 3 * 2.0 * msMult);
      let msTotal = 2;
      function doMSHit(n) {
        addCombatLog(`☄️ Meteor Swarm hit ${n}/${msTotal}! <b class="clog-num">${msDmgPer}</b> magic dmg!`, 'player');
        let cb = n < msTotal ? () => doMSHit(n + 1) : null;
        resolvePlayerHit(msDmgPer, `Meteor Swarm hit ${n}/${msTotal}! ${msDmgPer} dmg!`, `Meteor Swarm!`, cb);
      }
      doMSHit(1);
      break;
    }
    case 'time_stop': {
      incrementSkillXP('time_stop');
      combatExtraActions = 2;
      addCombatLog(`⏱️ Time Stop! Time freezes — you gain 2 extra turns!`, 'player');
      setCombatMsg(`Time Stop! 2 extra turns!`);
      updateCombatUI();
      combatLocked = false;
      break;
    }
    case 'mind_thrust': {
      incrementSkillXP('mind_thrust');
      let mtMult = getSkillRankMult('mind_thrust');
      let mtDmg = Math.floor((p.INT || 10) * 1.5 * mtMult);
      addCombatLog(`🧠 Mind Thrust! You deal <b class="clog-num">${mtDmg}</b> psychic damage (ignores DEF) to <b>${combatEnemy.name}</b>!`, 'player');
      resolvePlayerHit(mtDmg, `Mind Thrust! ${mtDmg} psychic damage!`, `Mind Thrust! ${mtDmg} dmg!`);
      break;
    }
    case 'ego_whip': {
      incrementSkillXP('ego_whip');
      let ewMult = getSkillRankMult('ego_whip');
      let ewDmg = Math.floor(calcPlayerAttack().dmg * 1.3 * ewMult);
      applyEnemyDebuff('slow', { turns: 2 });
      addCombatLog(`💫 Ego Whip! <b class="clog-num">${ewDmg}</b> damage! <b>${combatEnemy.name}</b> ATK -20% for 2 turns!`, 'player');
      resolvePlayerHit(ewDmg, `Ego Whip! ${ewDmg} damage! Enemy ATK -20%!`, `Ego Whip! ${ewDmg} dmg!`);
      break;
    }
    case 'cell_adjustment': {
      incrementSkillXP('cell_adjustment');
      let caMult = getSkillRankMult('cell_adjustment');
      let caHeal = Math.floor(p.maxHp * 0.5 * caMult);
      p.hp = Math.min(p.maxHp, p.hp + caHeal);
      addCombatLog(`🌱 Cell Adjustment! Restored <b class="clog-heal">+${caHeal} HP</b>!`, 'player');
      setCombatMsg(`Cell Adjustment! Restored ${caHeal} HP.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Cell Adjustment! +${caHeal} HP.`), 500);
      break;
    }
    case 'detonate': {
      incrementSkillXP('detonate');
      let detDmg = Math.floor(p.hp / 2);
      p.hp = Math.max(1, p.hp - detDmg);
      addCombatLog(`💣 Detonate! You deal <b class="clog-num">${detDmg}</b> damage and take <b class="clog-dmg">${detDmg}</b> self-damage!`, 'player');
      updateCombatUI();
      resolvePlayerHit(detDmg, `Detonate! ${detDmg} damage!`, `Detonate! ${detDmg} dmg!`);
      break;
    }
    case 'farsight': {
      // Farsight is out-of-combat only — refund mana and release lock
      p.mana = Math.min(p.maxMana || 0, (p.mana || 0) + manaCost);
      combatLocked = false;
      toast('Farsight can only be used outside of combat!', 'red');
      setCombatMsg('Farsight: out-of-combat only!');
      break;
    }
    // ── Utility skills ────────────────────────────────────────────────────────
    case 'invisibility': {
      incrementSkillXP('invisibility');
      applyPlayerBuff('invisibility', { turns: 2 });
      addCombatLog(`🫥 Invisibility! You vanish — enemies cannot see you for 2 turns!`, 'player');
      setCombatMsg(`Invisible for 2 turns — enemies will skip their attack!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Invisibility active.`), 500);
      break;
    }
    case 'haste': {
      incrementSkillXP('haste');
      applyPlayerBuff('haste', { turns: 2 });
      addCombatLog(`⚡ Haste! You will take 2 actions per turn for 2 turns!`, 'player');
      setCombatMsg(`Haste! Extra actions for 2 turns!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Haste active.`), 500);
      break;
    }
    case 'slow': {
      incrementSkillXP('slow');
      applyEnemyDebuff('slow', { turns: 2 });
      addCombatLog(`🐌 Slow! <b>${combatEnemy.name}</b> is slowed — ATK -20% for 2 turns!`, 'player');
      setCombatMsg(`Slow! ${combatEnemy.name} ATK -20% for 2 turns!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Slowed ${combatEnemy.name}!`), 500);
      break;
    }
    case 'fly': {
      incrementSkillXP('fly');
      addCombatLog(`🦅 Fly has no direct combat effect — use it to ignore terrain while moving!`, 'system');
      setCombatMsg(`Fly is used outside of combat for terrain traversal.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Fly...`), 500);
      break;
    }
    case 'refresh': {
      incrementSkillXP('refresh');
      let refreshAmt = Math.floor(p.maxHp * 0.2);
      p.hp = Math.min(p.maxHp, p.hp + refreshAmt);
      addCombatLog(`💧 Refresh! Restored <b class="clog-heal">+${refreshAmt} HP</b> and removed fatigue!`, 'player');
      setCombatMsg(`Refresh! +${refreshAmt} HP restored.`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Refreshed ${refreshAmt} HP.`), 500);
      break;
    }
    case 'aura_sight': {
      incrementSkillXP('aura_sight');
      let asHp   = `HP ${combatEnemy.hp}/${combatEnemy.maxHp}`;
      let asAtk  = `ATK ${combatEnemy.atk}`;
      let asDef  = `DEF ${combatEnemy.def}`;
      let asWeak = combatEnemy.weakTo   ? ` | Weak: ${combatEnemy.weakTo.join(', ')}`    : '';
      let asRes  = combatEnemy.resistTo ? ` | Resists: ${combatEnemy.resistTo.join(', ')}` : '';
      addCombatLog(`👁️ Aura Sight: <b>${combatEnemy.name}</b> — ${asHp}, ${asAtk}, ${asDef}${asWeak}${asRes}`, 'system');
      setCombatMsg(`Aura Sight: revealed ${combatEnemy.name}'s stats!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Aura Sight!`), 500);
      break;
    }
    // ── Special / Advanced skills ─────────────────────────────────────────────
    case 'quivering_palm': {
      incrementSkillXP('quivering_palm');
      quiveringPalmActive = true;
      quiveringPalmHits = 0;
      addCombatLog(`🖐️ Quivering Palm! Deal damage 3 turns in a row to kill <b>${combatEnemy.name}</b> instantly!`, 'player');
      setCombatMsg(`Quivering Palm active! Hit 3 times in a row to kill instantly!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Quivering Palm set.`), 500);
      break;
    }
    case 'shadow_walk': {
      incrementSkillXP('shadow_walk');
      if (isWorldMapEncounter) {
        isWorldMapEncounter = false;
        if (combatEnemyIndex >= 0) { enemies.splice(combatEnemyIndex, 1); combatEnemyIndex = -1; }
      }
      addCombatLog(`🌑 Shadow Walk! You step through the shadows — teleported away!`, 'player');
      toast('Shadow Walk! Escaped with no penalty.', 'green');
      msg('You shadow walked away from combat — no XP lost!');
      showBattleEndScreen();
      break;
    }
    case 'death_touch': {
      incrementSkillXP('death_touch');
      let dtThreshold = skillDefs.death_touch.effect.hpThreshold || 0.3;
      let dtFallback  = skillDefs.death_touch.effect.fallbackDmg || 100;
      if (combatEnemy.hp / combatEnemy.maxHp < dtThreshold) {
        addCombatLog(`💀 Death Touch! <b>${combatEnemy.name}</b> is slain instantly!`, 'player');
        resolvePlayerHit(combatEnemy.hp + 9999, `Death Touch! Instant kill!`, `Death Touch!`);
      } else {
        addCombatLog(`💀 Death Touch! <b>${combatEnemy.name}</b> resists death but takes <b class="clog-num">${dtFallback}</b> damage!`, 'player');
        resolvePlayerHit(dtFallback, `Death Touch! ${dtFallback} damage!`, `Death Touch! ${dtFallback} dmg!`);
      }
      break;
    }
    case 'possession': {
      incrementSkillXP('possession');
      applyEnemyDebuff('possessed', { turns: 2 });
      addCombatLog(`👁️ Possession! <b>${combatEnemy.name}</b> falls under your control for 2 turns!`, 'player');
      setCombatMsg(`Possessed! ${combatEnemy.name} will attack itself for 2 turns!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Possessed ${combatEnemy.name}!`), 500);
      break;
    }
    case 'polymorph': {
      incrementSkillXP('polymorph');
      applyEnemyDebuff('polymorph', { turns: 2, savedAtk: combatEnemy.atk, savedDef: combatEnemy.def });
      combatEnemy.atk = 5;
      combatEnemy.def = 0;
      addCombatLog(`🐸 Polymorph! <b>${combatEnemy.name}</b> turns into a slime for 2 turns! (ATK 5, DEF 0)`, 'player');
      setCombatMsg(`Polymorph! ${combatEnemy.name} is now a slime!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Polymorph!`), 500);
      break;
    }
    case 'charm_person': {
      incrementSkillXP('charm_person');
      applyEnemyDebuff('possessed', { turns: 1 });
      addCombatLog(`💕 Charm Person! Enemy is charmed! Attacking itself!`, 'player');
      setCombatMsg(`Charmed! ${combatEnemy.name} will attack itself!`);
      updateCombatUI();
      setTimeout(() => doEnemyTurn(`Charmed ${combatEnemy.name}!`), 500);
      break;
    }
  }
}

