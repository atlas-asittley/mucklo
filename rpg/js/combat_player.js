// ═══════════════════════════════════════════════════════════════
// FILE: combat_player.js
// PURPOSE: Player-initiated combat actions: attack (with dual-wield
//          chain and double-strike passive), item use, and flee
// KEY STATE: none owned; reads/writes combat.js and combat_buffs.js state
// CALLED BY: HTML buttons (combatAttack, combatRun, combatUseItem,
//            useCombatItem called from ui_inventory.js)
// CALLS: combat.js (resolvePlayerHit, addCombatLog, setCombatMsg,
//                   updateCombatUI, showBattleEndScreen),
//        combat_enemy.js (doEnemyTurn),
//        combat_mechanics.js (calcPlayerAttack, getPlayerDamageType,
//                             getEnemyDmgMultiplier, calculateSynergyCounts,
//                             getEquippedPassives, DAMAGE_TYPE_INFO)
// ═══════════════════════════════════════════════════════════════

function combatAttack() {
  if (combatLocked) return;
  hideCombatSkills();
  combatLocked = true;
  let pcEl = document.getElementById('player-combat-canvas');
  if (pcEl) { pcEl.classList.add('combat-lunge'); setTimeout(() => pcEl.classList.remove('combat-lunge'), 400); }

  let attack = calcPlayerAttack();
  let critText = attack.crit ? ' CRIT!' : '';

  // Damage type modifier against this enemy
  let pDmgType = getPlayerDamageType();
  let mult = getEnemyDmgMultiplier(combatEnemy, pDmgType);
  let finalDmg = Math.max(1, Math.floor(attack.dmg * mult));
  let typeInfo = DAMAGE_TYPE_INFO[pDmgType] || DAMAGE_TYPE_INFO.physical;
  let typePrefix = pDmgType !== 'physical' ? `${typeInfo.icon} ${typeInfo.label} damage! ` : '';
  let multSuffix = mult > 1 ? ' Super effective!' : mult < 1 ? ' Resisted!' : '';

  // Elemental bonus damage from whileEquipped stats + synergy bonuses
  const ELEM_WE_KEYS = { fire: 'fireDamage', ice: 'iceDamage', lightning: 'lightningDamage', holy: 'holyDamage', dark: 'darkDamage' };
  const ELEM_ICONS   = { fire: '🔥', ice: '❄️', lightning: '⚡', holy: '✝️', dark: '💀' };
  let syn = calculateSynergyCounts();
  let elemDmgMap = {};

  for (let [dtype, weKey] of Object.entries(ELEM_WE_KEYS)) {
    let flat = 0;
    for (let itemId of Object.values(game.equipped)) {
      if (itemId && itemDefs[itemId] && itemDefs[itemId].whileEquipped) {
        flat += itemDefs[itemId].whileEquipped[weKey] || 0;
      }
    }
    let synCount = syn[dtype] || 0;
    if (synCount >= 1) flat += synCount * 2; // 1pc: +2 flat per item
    if (flat <= 0) continue;
    let pctMult = synCount >= 3 ? 1.10 : synCount >= 2 ? 1.05 : 1.0;
    let enemyMult = getEnemyDmgMultiplier(combatEnemy, dtype);
    let elemDmg = Math.max(1, Math.floor(flat * pctMult * enemyMult));
    elemDmgMap[dtype] = elemDmg;
    finalDmg += elemDmg;
    let icon = ELEM_ICONS[dtype] || '';
    let suffix = enemyMult > 1 ? ' SE!' : enemyMult < 1 ? ' Resisted!' : '';
    if (synCount >= 2) addCombatLog(`${icon} ${dtype.charAt(0).toUpperCase() + dtype.slice(1)} Synergy (${synCount}pc): +${Math.round((pctMult - 1) * 100)}% bonus! ${elemDmg} elem dmg.${suffix}`, 'player');
  }

  // Lightning 3pc: 15% chance to chain (extra 50% lightning damage)
  if (syn.lightning >= 3 && elemDmgMap.lightning > 0 && Math.random() < 0.15) {
    let chainDmg = Math.max(1, Math.floor(elemDmgMap.lightning * 0.5));
    finalDmg += chainDmg;
    addCombatLog(`⚡ Lightning Synergy (3pc): Chain lightning! +${chainDmg} dmg!`, 'player');
  }

  // Holy 3pc: heal 5 HP on every attack (cleanse)
  if (syn.holy >= 3) {
    let cleanseHeal = 5;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + cleanseHeal);
    addCombatLog(`✝️ Holy Synergy (3pc): Cleanse — restored ${cleanseHeal} HP!`, 'player');
  }

  if (attack.crit) {
    addCombatLog(`${typePrefix}⚔️ CRIT! You struck <b>${combatEnemy.name}</b> for <b class="clog-num">${finalDmg}</b>!${multSuffix}`, 'player');
  } else {
    addCombatLog(`${typePrefix}⚔️ You strike <b>${combatEnemy.name}</b> for <b class="clog-num">${finalDmg}</b>!${multSuffix}`, 'player');
  }

  // Bless buff: +% ATK for N turns
  if ((game.playerBuffAtk || 0) > 0) {
    finalDmg = Math.floor(finalDmg * (1 + game.playerBuffAtk / 100));
  }

  // Sneak passive: if stealthed from hide, next attack deals 2x damage.
  // Set combatSneakJustFired so resolvePlayerHit does not immediately re-stealth via hide.
  if ((game.player.learnedSkills || []).includes('sneak') && combatPlayerStealth) {
    finalDmg = Math.ceil(finalDmg * skillDefs.sneak.passiveNextDamageMult);
    combatPlayerStealth = false;
    combatSneakJustFired = true;
    addCombatLog(`🤫 Passive: Sneak attack! Damage doubled!`, 'player');
  }

  let hasDualWield = (game.player.learnedSkills || []).includes('dual_wield');
  let hasSecondary = hasDualWield && !!game.equipped.SECONDARY_HAND;
  let hasDoubleStrike = (game.player.learnedSkills || []).includes('double_strike') && skillDefs.double_strike && skillDefs.double_strike.passive;

  // Build callback chain: main → [secondary →] [double_strike]
  let afterCallback = null;
  if (hasDoubleStrike) afterCallback = doDoubleStrikeHit;
  if (hasSecondary) { let dsCallback = afterCallback; afterCallback = () => doSecondaryAttack(dsCallback); }

  resolvePlayerHit(
    finalDmg,
    `You deal ${finalDmg} damage!${critText}${multSuffix}`,
    `You deal ${finalDmg} dmg!${critText}`,
    afterCallback,
    hasSecondary ? 'MAIN_HAND' : null
  );
}

// Second swing for dual wield — fires after the main-hand hit resolves.
// afterCallback: optional function to call after this hit (e.g. doDoubleStrikeHit).
function doSecondaryAttack(afterCallback) {
  if (combatEnemy.hp <= 0) return;
  let pcEl = document.getElementById('player-combat-canvas');
  if (pcEl) { pcEl.classList.add('combat-lunge'); setTimeout(() => pcEl.classList.remove('combat-lunge'), 400); }

  let secondaryId = game.equipped.SECONDARY_HAND;
  let attack = calcPlayerAttack();
  let critText = attack.crit ? ' CRIT!' : '';
  let baseDmg = Math.max(1, Math.floor(attack.dmg * 0.7));

  // Use the secondary weapon's damage type
  let sDmgType = (secondaryId && itemDefs[secondaryId] && itemDefs[secondaryId].damageType)
    ? itemDefs[secondaryId].damageType : 'physical';
  let sMult = getEnemyDmgMultiplier(combatEnemy, sDmgType);
  let sFinalDmg = Math.max(1, Math.floor(baseDmg * sMult));
  let sTypeInfo = DAMAGE_TYPE_INFO[sDmgType] || DAMAGE_TYPE_INFO.physical;
  let sTypePrefix = sDmgType !== 'physical' ? `${sTypeInfo.icon} ${sTypeInfo.label} ` : '';
  let sMultSuffix = sMult > 1 ? ' Super effective!' : sMult < 1 ? ' Resisted!' : '';

  if (attack.crit) {
    addCombatLog(`${sTypePrefix}⚔️ Off-hand CRIT! <b class="clog-num">${sFinalDmg}</b> damage!${sMultSuffix}`, 'player');
  } else {
    addCombatLog(`${sTypePrefix}⚔️ Off-hand: <b class="clog-num">${sFinalDmg}</b> damage!${sMultSuffix}`, 'player');
  }

  resolvePlayerHit(
    sFinalDmg,
    `Off-hand deals ${sFinalDmg} dmg!${critText}`,
    `Off-hand: ${sFinalDmg} dmg!`,
    afterCallback || null,
    'SECONDARY_HAND'
  );
}

// Passive double_strike second hit — fires after main (or secondary) attack resolves.
function doDoubleStrikeHit() {
  if (combatEnemy.hp <= 0) return;
  let pcEl = document.getElementById('player-combat-canvas');
  if (pcEl) { pcEl.classList.add('combat-lunge'); setTimeout(() => pcEl.classList.remove('combat-lunge'), 400); }

  incrementSkillXP('double_strike');
  let attack = calcPlayerAttack();
  let critText = attack.crit ? ' CRIT!' : '';
  let mult = (skillDefs.double_strike.effect && skillDefs.double_strike.effect.mult) ? skillDefs.double_strike.effect.mult : 0.8;
  let baseDmg = Math.max(1, Math.floor(attack.dmg * mult));
  let pDmgType = getPlayerDamageType();
  let dmgMult = getEnemyDmgMultiplier(combatEnemy, pDmgType);
  let finalDmg = Math.max(1, Math.floor(baseDmg * dmgMult));
  let multSuffix = dmgMult > 1 ? ' Super effective!' : dmgMult < 1 ? ' Resisted!' : '';

  if (attack.crit) {
    addCombatLog(`⚔️ Double Strike CRIT! <b class="clog-num">${finalDmg}</b> damage!${multSuffix}`, 'player');
  } else {
    addCombatLog(`⚔️ Double Strike: <b class="clog-num">${finalDmg}</b> damage!${multSuffix}`, 'player');
  }

  resolvePlayerHit(finalDmg, `Double Strike: ${finalDmg} dmg!${critText}`, `Double Strike: ${finalDmg} dmg!`, null, null);
}

function combatUseItem() {
  if (combatLocked) return;
  let potions = game.inventory.filter(id => itemDefs[id] && itemDefs[id].type === 'consumable');
  if (potions.length === 0) { setCombatMsg('No items to use!'); return; }
  combatItemSelectMode = true;
  openInventory();
}

function useCombatItem(index) {
  combatItemSelectMode = false;
  closeInventory();
  let itemId = game.inventory[index];
  let item = itemDefs[itemId];
  if (!item) { toast('Item no longer available', ''); return; }
  if (item.atkBoost) {
    game.player.atk += item.atkBoost;
    removeInventoryItem(index);
    addCombatLog(`You used <b>${item.name}</b>! ATK <b class="clog-heal">+${item.atkBoost}</b>`, 'player');
    setCombatMsg(`Used ${item.name}! ATK +${item.atkBoost} — choose your action!`);
  } else {
    let healAmt = (item.heal || 0) + (game.player.WIS || 10);
    let healPassives = getEquippedPassives();
    if (healPassives.healBonus) healAmt = Math.floor(healAmt * (1 + healPassives.healBonus / 100));
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + healAmt);
    removeInventoryItem(index);
    addCombatLog(`You used <b>${item.name}</b>! Restored <b class="clog-heal">+${healAmt} HP</b>.`, 'player');
    setCombatMsg(`Used ${item.name}! +${healAmt} HP — choose your action!`);
  }
  updateCombatUI();
}

function combatRun() {
  if (combatLocked) return;
  hideCombatSkills();

  // Boss fight: 30% escape chance with XP penalty
  if (combatEnemy.isBoss) {
    combatLocked = true;
    if (Math.random() < 0.3) {
      let xpLoss = Math.floor(game.player.xp * 0.05);
      game.player.xp = Math.max(0, game.player.xp - xpLoss);
      addCombatLog(`<b class="clog-system">Escaped!</b>`, 'system');
      if (xpLoss > 0) addCombatLog(`Lost <b class="clog-dmg">${xpLoss} XP</b> fleeing!`, 'system');
      toast('Tried to flee... escaped!', '');
      if (xpLoss > 0) {
        toast(`You lost ${xpLoss} XP fleeing!`, 'red');
        msg(`Tried to flee... escaped! You lost ${xpLoss} XP.`);
      } else {
        msg('Tried to flee... escaped!');
      }
      showBattleEndScreen();
    } else {
      addCombatLog("Couldn't escape!", 'system');
      setCombatMsg("Couldn't escape!");
      setTimeout(() => doEnemyTurn("Couldn't escape!"), 500);
    }
    return;
  }

  // World map encounters: always escape, remove temp enemy, apply XP penalty
  if (isWorldMapEncounter) {
    isWorldMapEncounter = false;
    if (combatEnemyIndex >= 0) { enemies.splice(combatEnemyIndex, 1); combatEnemyIndex = -1; }
    let xpLoss = Math.floor(game.player.xp * 0.05);
    game.player.xp = Math.max(0, game.player.xp - xpLoss);
    addCombatLog(`<b class="clog-system">Escaped!</b>`, 'system');
    if (xpLoss > 0) addCombatLog(`Lost <b class="clog-dmg">${xpLoss} XP</b> fleeing!`, 'system');
    toast('You escaped!', '');
    if (xpLoss > 0) {
      toast(`You lost ${xpLoss} XP fleeing!`, 'red');
      msg(`You escaped back to the world map. You lost ${xpLoss} XP.`);
    } else {
      msg('You escaped back to the world map.');
    }
    showBattleEndScreen();
    return;
  }

  // Sparring: always allowed to leave
  if (isSparring) {
    isSparring = false;
    addCombatLog(`<b class="clog-system">Escaped!</b>`, 'system');
    toast('Sparring complete!', 'green');
    msg('Sparring complete!');
    showBattleEndScreen();
  } else if (Math.random() < 0.6) {
    // Normal combat: 60% escape chance, no XP loss on training grounds
    let xpLoss = game.currentMap === 'training_grounds' ? 0 : Math.floor(game.player.xp * 0.05);
    game.player.xp = Math.max(0, game.player.xp - xpLoss);
    addCombatLog(`<b class="clog-system">Escaped!</b>`, 'system');
    if (xpLoss > 0) addCombatLog(`Lost <b class="clog-dmg">${xpLoss} XP</b> fleeing!`, 'system');
    toast('You fled!', '');
    if (xpLoss > 0) {
      toast(`You lost ${xpLoss} XP fleeing!`, 'red');
      msg(`You fled! You lost ${xpLoss} XP.`);
    } else {
      msg('You fled!');
    }
    showBattleEndScreen();
  } else {
    combatLocked = true;
    addCombatLog('Flee failed!', 'system');
    setCombatMsg('Failed to escape!');
    setTimeout(() => doEnemyTurn('Failed to escape!'), 500);
  }
}
