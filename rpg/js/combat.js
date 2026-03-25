// ═══════════════════════════════════════════════════════════════
// FILE: combat.js
// PURPOSE: Orchestrates combat: screen init/teardown, hit resolution,
//          win/death/respawn, level-up, and the combat log renderer
// KEY STATE: combatEnemy, combatEnemyIndex, combatLocked, combatLog,
//            combatTotalDmg, combatPlayerShield, combatProcPoison,
//            combatPlayerPowerStrike, combatPlayerQuickStep,
//            isSparring, isWorldMapEncounter, combatItemSelectMode
// CALLED BY: gameplay.js (startCombat/startSparring),
//            HTML buttons (leaveCombatScreen, respawn)
// CALLS: combat_buffs.js (buff/debuff resets in initCombatScreen),
//        combat_enemy.js (doEnemyTurn via resolvePlayerHit),
//        combat_mechanics.js (getEquippedPassives, getSynergyLabel, etc.),
//        combat_procs.js (fireOnAttackProcs)
// ═══════════════════════════════════════════════════════════════

// ─── COMBAT STATE ─────────────────────────────────────────────────────────────

let combatEnemy = null;
let combatEnemyIndex = -1;
let combatLocked = false;
let combatPlayerPowerStrike = false;
let combatPlayerQuickStep = false;
let isSparring = false;
let isWorldMapEncounter = false;
let combatItemSelectMode = false;
let combatLog = [];
let combatTotalDmg = 0;
let combatPlayerShield = 0;        // temporary shield HP absorbed before player HP
let combatProcPoison = 0;          // accumulated proc-poison ticks per round
// Buff/passive state variables are declared in combat_buffs.js.

// ─── COMBAT LOG ───────────────────────────────────────────────────────────────

function addCombatLog(message, type) {
  combatLog.unshift({ message, type });
  if (combatLog.length > 20) combatLog.length = 20;
  renderCombatLog();
}

function renderCombatLog() {
  let el = document.getElementById('combat-log');
  if (!el) return;
  el.innerHTML = combatLog.map(entry => {
    let cls = entry.type === 'player' ? 'clog-player' : entry.type === 'enemy' ? 'clog-enemy' : 'clog-system';
    return `<div class="clog-entry ${cls}">${entry.message}</div>`;
  }).join('');
}

// ─── COMBAT INIT ──────────────────────────────────────────────────────────────

function startCombat(index) {
  combatEnemy = { ...enemies[index] };
  combatEnemyIndex = index;
  isSparring = false;
  // isWorldMapEncounter is set by checkWorldMapEncounter() before calling here;
  // reset it for normal (non-world-map) combat so the flag doesn't linger.
  if (!combatEnemy.worldMapKey) isWorldMapEncounter = false;
  initCombatScreen();
}

function startSparring(opponent) {
  combatEnemy = { ...opponent, maxHp: opponent.hp, hp: opponent.hp, gold: [0, 0], isBoss: false };
  combatEnemyIndex = -1;
  isSparring = true;
  initCombatScreen();
}

// Shared UI setup called by both startCombat and startSparring.
function initCombatScreen() {
  stopHeartbeat();
  combatLocked = false;
  game.battleEnded = false;
  combatPlayerPowerStrike = false;
  combatPlayerQuickStep = false;
  combatLog = [];
  renderCombatLog();
  combatTotalDmg = 0;
  combatPlayerShield = 0;
  combatProcPoison = 0;
  game.player.skillCooldowns = {};
  // Unified buff/debuff/protection reset
  pBuffs = {};
  eDebuffs = {};
  pProtect = {};
  game.playerBuffAtk = 0;
  game.playerBuffDef = 0;
  // Flat state vars reset
  combatPlayerStealth = false;
  combatSneakJustFired = false;
  combatExtraActions = 0;
  combatSummonRoundsLeft = 0;
  combatSummonDmg = 0;
  combatAnimalCompanionRounds = 0;
  quiveringPalmActive = false;
  quiveringPalmHits = 0;
  combatContingencyUsed = false;
  document.getElementById('combat-screen').style.display = 'flex';
  document.getElementById('enemy-name-display').textContent = combatEnemy.name.toUpperCase();
  document.getElementById('combat-msg').textContent = '';
  let sub = document.getElementById('enemy-combat-sub');
  if (sub) sub.textContent = combatEnemy.name.toUpperCase();
  let dmgTypeEl = document.getElementById('enemy-dmg-type-icon');
  if (dmgTypeEl) {
    let eDmgType = getDamageType(combatEnemy);
    if (eDmgType !== 'physical') {
      let info = DAMAGE_TYPE_INFO[eDmgType];
      dmgTypeEl.textContent = `${info.icon} ${info.label}`;
      dmgTypeEl.style.color = info.color;
      dmgTypeEl.style.display = 'block';
    } else {
      dmgTypeEl.style.display = 'none';
    }
  }
  // Log active synergies at combat start
  let synAtStart = calculateSynergyCounts();
  const SYN_ICONS = { fire: '🔥', ice: '❄️', lightning: '⚡', poison: '☠️', holy: '✝️', dark: '💀' };
  for (let [dtype, count] of Object.entries(synAtStart)) {
    if (count < 1) continue;
    let icon = SYN_ICONS[dtype] || '';
    let label = dtype.charAt(0).toUpperCase() + dtype.slice(1);
    let tier = count >= 3 ? 3 : count >= 2 ? 2 : 1;
    let desc = getSynergyLabel(dtype, count);
    addCombatLog(`${icon} ${label} Synergy (${tier}pc): ${desc}`, 'system');
  }
  updateCombatUI();
  drawEnemyCombat(combatEnemy.drawKey);
  drawPlayerCombat();
}

// ─── UI UPDATES ───────────────────────────────────────────────────────────────

function updateCombatUI() {
  let p = game.player;
  document.getElementById('enemy-hp-fill').style.width = (Math.max(0, combatEnemy.hp) / combatEnemy.maxHp * 100) + '%';
  document.getElementById('enemy-hp-text').textContent = `${Math.max(0, combatEnemy.hp)} / ${combatEnemy.maxHp}`;
  document.getElementById('combat-player-hp').style.width = (p.hp / p.maxHp * 100) + '%';
  document.getElementById('combat-player-hp-text').textContent = `${p.hp} / ${p.maxHp}`;
  let mpFill = document.getElementById('combat-player-mp');
  let mpText = document.getElementById('combat-player-mp-text');
  if (mpFill && p.maxMana > 0) {
    mpFill.style.width = (Math.max(0, p.mana) / p.maxMana * 100) + '%';
    mpText.textContent = `${Math.max(0, p.mana)} / ${p.maxMana}`;
  }
  drawEnemyCombat(combatEnemy.drawKey);
  drawPlayerCombat();
  renderCombatBuffs();
}

function setCombatMsg(text) {
  let el = document.getElementById('combat-msg');
  el.style.animation = 'none';
  el.offsetHeight; // reflow to restart animation
  el.style.animation = 'combatMsgPulse 0.3s ease';
  el.textContent = text;
}

function tickSkillCooldowns() {
  if (!game.player.skillCooldowns) return;
  for (let sid in game.player.skillCooldowns) {
    game.player.skillCooldowns[sid]--;
    if (game.player.skillCooldowns[sid] <= 0) delete game.player.skillCooldowns[sid];
  }
  let skillsMenu = document.getElementById('combat-skills-menu');
  if (skillsMenu && skillsMenu.style.display === 'flex') renderCombatSkills();
}

// ─── HIT RESOLUTION ───────────────────────────────────────────────────────────

function shakeEnemy() {
  document.getElementById('enemy-canvas-wrap').classList.add('shake');
  setTimeout(() => document.getElementById('enemy-canvas-wrap').classList.remove('shake'), 350);
}

// Deals dmg to the enemy, triggers visual effects, then queues the next action.
// afterHitCallback: if provided, called instead of doEnemyTurn (used for dual-wield second swing).
// procSlot: if provided, only fire onAttack procs from that equipment slot.
function resolvePlayerHit(dmg, mainMsg, prependMsg, afterHitCallback, procSlot) {
  combatEnemy.hp -= dmg;
  combatTotalDmg += dmg;
  enemyFlashTimer = 8;
  shakeEnemy();

  let passives = getEquippedPassives();
  // Lifesteal: heal player for % of damage dealt
  if (passives.lifesteal && dmg > 0) {
    let healAmt = Math.max(1, Math.floor(dmg * passives.lifesteal / 100));
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + healAmt);
    toast(`Lifesteal +${healAmt} HP`, 'green');
  }
  // Freeze passive: chance to stun enemy
  if (passives.freeze && Math.random() < passives.freeze / 100) {
    applyEnemyDebuff('stun', { turns: 1 });
    toast(`Frozen! ${combatEnemy.name} skips next turn`, '');
  }

  // Ice 3pc: slow enemy ATK for 2 turns
  let synOnHit = calculateSynergyCounts();
  if (synOnHit.ice >= 3) {
    applyEnemyDebuff('slow', { turns: 2 });
    addCombatLog(`❄️ Ice Synergy (3pc): ${combatEnemy.name} slowed! (ATK -20% for 2 turns)`, 'system');
  }
  // Dark 3pc: ATK debuff for 2 turns
  if (synOnHit.dark >= 3) {
    applyEnemyDebuff('atkDebuff', { turns: 2 });
    addCombatLog(`💀 Dark Synergy (3pc): ${combatEnemy.name} weakened! (ATK -10% for 2 turns)`, 'system');
  }

  // onAttack procs: optionally filtered to one slot for dual wield
  fireOnAttackProcs(procSlot);

  // Hide passive: after attacking, become invisible — enemy skips next attack.
  // Guard: if sneak just consumed stealth this hit, do NOT re-stealth (would cause infinite stun loop).
  let learnedForHide = game.player.learnedSkills || [];
  if (learnedForHide.includes('hide') && !combatPlayerStealth && !combatSneakJustFired && combatEnemy.hp > 0) {
    combatPlayerStealth = true;
    applyEnemyDebuff('stun', { turns: 1 });
    addCombatLog(`👻 Passive: Hide! You vanish — <b>${combatEnemy.name}</b> skips next attack!`, 'player');
  }
  combatSneakJustFired = false;

  // Quivering Palm: 3 consecutive hits triggers instant kill
  if (quiveringPalmActive && combatEnemy.hp > 0) {
    quiveringPalmHits++;
    let hitsLeft = 3 - quiveringPalmHits;
    if (quiveringPalmHits >= 3) {
      quiveringPalmActive = false;
      quiveringPalmHits = 0;
      combatEnemy.hp = 0;
      addCombatLog(`🖐️ Quivering Palm triggers! <b>${combatEnemy.name}</b> collapses — instant kill!`, 'player');
    } else {
      addCombatLog(`🖐️ Quivering Palm: hit ${quiveringPalmHits}/3 — ${hitsLeft} more to kill!`, 'player');
    }
  }

  setCombatMsg(mainMsg);
  updateCombatUI();
  if (combatEnemy.hp <= 0) { combatWin(); return; }
  if (afterHitCallback) {
    setTimeout(afterHitCallback, 300);
  } else {
    setTimeout(() => doEnemyTurn(prependMsg), 500);
  }
}

// ─── LEVEL UP ─────────────────────────────────────────────────────────────────

// Applies one level-up worth of stat gains to the player. Shared with debug.js cheat.
function applyLevelUp() {
  let p = game.player;
  p.lvl++;
  p.bonusHpFromLevels = (p.bonusHpFromLevels || 0) + p.CON;
  recalcMaxHp();
  recalcMaxMana();
  p.hp = p.maxHp;
  p.atk += 2;
  p.def += 1;
  p.skillPoints = (p.skillPoints || 0) + 3;
  p.xpNext = Math.floor(p.xpNext * 1.5);
  p.reincarnateUsed = false; // reincarnate resets on level-up
}

// ─── BATTLE END SCREEN ────────────────────────────────────────────────────────

function showBattleEndScreen() {
  combatLocked = true;
  document.getElementById('combat-actions').style.display = 'none';
  let skillsMenu = document.getElementById('combat-skills-menu');
  if (skillsMenu) skillsMenu.style.display = 'none';
  let logEl = document.getElementById('combat-log');
  if (logEl) logEl.classList.add('combat-ended');
  game.battleEnded = true;
}

function leaveCombatScreen() {
  game.battleEnded = false;
  document.getElementById('combat-screen').style.display = 'none';
  startHeartbeat();
  let logEl = document.getElementById('combat-log');
  if (logEl) logEl.classList.remove('combat-ended');
  document.getElementById('combat-actions').style.display = 'flex';
  combatLocked = false;
}

// ─── COMBAT WIN ───────────────────────────────────────────────────────────────

function combatWin() {
  // Immediately remove the defeated enemy from the map so it doesn't reappear
  if (combatEnemyIndex >= 0) {
    enemies.splice(combatEnemyIndex, 1);
    combatEnemyIndex = -1;
  }
  // Death animation, then process win after delay
  let ecWrap = document.getElementById('enemy-canvas-wrap');
  if (ecWrap) ecWrap.classList.add('combat-enemy-death');
  setTimeout(() => {
    if (ecWrap) ecWrap.classList.remove('combat-enemy-death');
    let intMult = 1 + (game.player.INT || 10) * 0.02;
    let xpBonusMult = 1 + ((getEquippedPassives().xpBonus || 0) / 100);
    let xpGained = Math.floor(combatEnemy.xp * intMult * xpBonusMult);
    let winMsg;

    if (isSparring) {
      isSparring = false;
      game.player.xp += xpGained;
      addCombatLog(`<b class="clog-player">Sparring Complete!</b>`, 'player');
      addCombatLog(`Total damage dealt: <b class="clog-num">${combatTotalDmg}</b>`, 'system');
      addCombatLog(`XP gained: <b class="clog-heal">+${xpGained} XP</b>`, 'system');
      toast(`Sparring complete! +${xpGained}XP`, 'green');
      msg(`Sparring complete! +${xpGained}XP`);
    } else if (isWorldMapEncounter) {
      game.player.xp += xpGained;
      isWorldMapEncounter = false;
      let goldDrop = rollGoldDrop(combatEnemy);
      game.player.gold += goldDrop;
      game.kills++;
      // Put this enemy type on a 10-step cooldown
      if (combatEnemy.worldMapKey) worldEncounterCooldowns[combatEnemy.worldMapKey] = 10;
      winMsg = `Victory! +${xpGained}XP +${goldDrop}g`;
      addCombatLog(`<b class="clog-player">Victory!</b>`, 'player');
      addCombatLog(`Total damage dealt: <b class="clog-num">${combatTotalDmg}</b>`, 'system');
      addCombatLog(`XP gained: <b class="clog-heal">+${xpGained} XP</b>`, 'system');
      addCombatLog(`Gold earned: <b class="clog-heal">+${goldDrop}g</b>`, 'system');
      if (Math.random() < 0.25) {
        let itemId = worldMapDrops[Math.floor(Math.random() * worldMapDrops.length)];
        addInventoryItem(itemId);
        winMsg += ` +${itemDefs[itemId].name}`;
        addCombatLog(`Dropped: <b class="clog-heal">${itemDefs[itemId].name}</b>!`, 'system');
        toast(`Dropped: ${itemDefs[itemId].name}!`, 'green');
      }
      toast(winMsg, 'green');
      msg(winMsg);
    } else {
      game.player.xp += xpGained;
      let goldDrop = rollGoldDrop(combatEnemy);
      game.player.gold += goldDrop;
      game.kills++;
      winMsg = `Victory! +${xpGained}XP +${goldDrop}g`;
      addCombatLog(`<b class="clog-player">Victory!</b>`, 'player');
      addCombatLog(`Total damage dealt: <b class="clog-num">${combatTotalDmg}</b>`, 'system');
      addCombatLog(`XP gained: <b class="clog-heal">+${xpGained} XP</b>`, 'system');
      addCombatLog(`Gold earned: <b class="clog-heal">+${goldDrop}g</b>`, 'system');
      let dropped = false;
      if (combatEnemy.drops && combatEnemy.drops.length > 0) {
        const forceRatTail = combatEnemy.typeKey === 'rat' && game.currentMap === 'training_grounds';
        if (forceRatTail || Math.random() < (combatEnemy.dropChance || 0)) {
          let itemId = combatEnemy.drops[Math.floor(Math.random() * combatEnemy.drops.length)];
          addInventoryItem(itemId);
          winMsg += ` +${itemDefs[itemId].name}`;
          addCombatLog(`Dropped: <b class="clog-heal">${itemDefs[itemId].name}</b>!`, 'system');
          toast(`Dropped: ${itemDefs[itemId].name}!`, 'green');
          dropped = true;
          // Track rat_tail drops for the quest
          if (itemId === 'rat_tail' && game.flags.questRatTails && game.flags.questRatTails.started && !game.flags.questRatTails.complete) {
            game.flags.questRatTails.count = game.inventory.filter(id => id === 'rat_tail').length;
          }
        }
      }
      if (!dropped) {
        let dropTable = game.currentMap === 'training_grounds' ? trainingDrops
                      : currentFloor > 0 ? (floorDrops[currentFloor] || floorDrops[1]) : null;
        if (Math.random() < 0.25 && dropTable) {
          let itemId = dropTable[Math.floor(Math.random() * dropTable.length)];
          addInventoryItem(itemId);
          winMsg += ` +${itemDefs[itemId].name}`;
          addCombatLog(`Dropped: <b class="clog-heal">${itemDefs[itemId].name}</b>!`, 'system');
          toast(`Dropped: ${itemDefs[itemId].name}!`, 'green');
        }
      }
      toast(winMsg, 'green');
      msg(winMsg);
    }

    // Boss loot drop check
    let bossKey = combatEnemy.typeKey || combatEnemy.worldMapKey;
    let loot = bossLoot[bossKey];
    if (loot && Math.random() < loot.chance) {
      addInventoryItem(loot.item);
      let lootItem = itemDefs[loot.item];
      let rar = RARITY[lootItem.rarity] || {};
      winMsg += ` | BOSS DROP: ${lootItem.name}!`;
      addCombatLog(`Boss dropped: <b style="color:${rar.color || '#f39c12'}">${lootItem.name}</b>!`, 'system');
      toast(`BOSS DROP: ${lootItem.name}!`, 'green');
      showBossDropEffect(lootItem.name, rar.label || lootItem.rarity, rar.color || '#f39c12');
    }

    // Clear world boss marker tile after kill
    if (combatEnemy.bossX !== undefined && combatEnemy.bossY !== undefined && typeof maps !== 'undefined' && maps.world) {
      maps.world[combatEnemy.bossY][combatEnemy.bossX] = T.GRASS;
      game.flags[`boss_${bossKey}_dead`] = true;
    }
    // Track dungeon boss kills so they don't respawn on floor re-entry
    if (combatEnemy.isBoss && bossKey && combatEnemy.bossX === undefined) {
      game.flags[`boss_${bossKey}_dead`] = true;
    }

    // Level up check
    while (game.player.xp >= game.player.xpNext) {
      game.player.xp -= game.player.xpNext;
      applyLevelUp();
      spawnParticles(playerVisX - camX + TILE / 2, playerVisY - camY + TILE / 2, 'levelup');
      addCombatLog(`Level up! You are now level <b class="clog-heal">${game.player.lvl}</b>!`, 'system');
      toast(`LEVEL UP! Now level ${game.player.lvl}! +3 Skill Pts!`, 'green');
      msg(`Level Up! You are now level ${game.player.lvl}!`);
    }

    // Post-combat passive heal
    let postPassives = getEquippedPassives();
    if (postPassives.postcombat_heal) {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + postPassives.postcombat_heal);
      toast(`Post-combat heal +${postPassives.postcombat_heal} HP`, 'green');
    }

    saveGame();
    showBattleEndScreen();
  }, 640);
}

// ─── PLAYER DEATH ─────────────────────────────────────────────────────────────

function playerDeath() {
  if (isSparring) {
    isSparring = false;
    document.getElementById('combat-screen').style.display = 'none';
    game.player.hp = 1;
    combatLocked = false;
    toast('Knocked out in sparring!', 'red');
    msg('You were knocked out! Rest up and try again.');
    return;
  }

  // Reincarnate passive: auto-revive once with 30% HP (handled in combat_buffs.js)
  if (checkReincarnate()) return;

  let deathX = game.player.x, deathY = game.player.y;
  let deathMap = game.currentMap;

  // If the killing enemy occupies the death tile, find a nearby walkable tile for the corpse
  let corpseX = deathX, corpseY = deathY;
  let killingEnemy = combatEnemyIndex >= 0 ? enemies[combatEnemyIndex] : null;
  if (killingEnemy && killingEnemy.x === deathX && killingEnemy.y === deathY) {
    let mapData = typeof maps !== 'undefined' && maps[deathMap] ? maps[deathMap] : null;
    found: for (let radius = 1; radius <= 2; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue; // perimeter only
          let nx = deathX + dx, ny = deathY + dy;
          if (!mapData || ny < 0 || ny >= mapData.length || nx < 0 || nx >= mapData[ny].length) continue;
          if (!isWalkableTile(mapData[ny][nx])) continue;
          if (enemies.some(e => e.x === nx && e.y === ny)) continue;
          corpseX = nx; corpseY = ny;
          break found;
        }
      }
    }
  }

  // Collect equipped items into corpse before unequipping
  let corpseItems = {};
  for (let slot of Object.keys(game.equipped)) {
    if (game.equipped[slot]) corpseItems[slot] = game.equipped[slot];
  }

  // Collect ALL inventory items into corpse
  let corpseInventory = game.inventory.slice();
  game.inventory = [];
  game.inventoryIds = [];

  // Unequip all items and revert their stat contributions
  for (let slot of Object.keys(game.equipped)) {
    if (game.equipped[slot]) {
      let item = itemDefs[game.equipped[slot]];
      if (item) applyItemStats(item, -1);
      game.equipped[slot] = null;
    }
  }
  recalcSetBonuses();

  // Lose 10% of gold
  let goldLost = Math.floor(game.player.gold * 0.1);
  game.player.gold = Math.max(0, game.player.gold - goldLost);

  game.player.deaths = (game.player.deaths || 0) + 1;

  // Store corpse (new death replaces old one)
  game.corpse = { x: corpseX, y: corpseY, map: deathMap, items: corpseItems, inventoryItems: corpseInventory, goldLost };

  let goldEl = document.getElementById('death-gold-lost');
  if (goldEl) goldEl.textContent = goldLost;
  let deathNumEl = document.getElementById('death-count');
  if (deathNumEl) deathNumEl.textContent = game.player.deaths;

  document.getElementById('combat-screen').style.display = 'none';
  document.getElementById('death-screen').style.display = 'flex';
  combatLocked = false;
}

// ─── RESPAWN ──────────────────────────────────────────────────────────────────

function respawn() {
  document.getElementById('death-screen').style.display = 'none';
  game.player.hp = game.player.maxHp;
  game.player.x = 28; game.player.y = 14; // Healer in town
  game.currentMap = 'town';
  enemies = []; currentFloor = 0;
  let goldLost = (game.corpse || {}).goldLost || 0;
  toast(`You lost ${goldLost} gold. Your items are at your corpse.`, 'red');
  msg(`You respawn at the healer. You lost ${goldLost} gold. Return to recover your items!`);
  saveGame();
}
