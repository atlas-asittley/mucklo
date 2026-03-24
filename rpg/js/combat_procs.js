// ═══════════════════════════════════════════════════════════════
// FILE: combat_procs.js
// PURPOSE: Item proc effects — fireOnAttackProcs (fireball/poison/freeze
//          after player hits) and fireOnHitProcs (heal/shield/stun/poison
//          after enemy hits); slot-filtered for dual-wield correctness
// KEY STATE: none owned; mutates combatProcPoison, combatPlayerShield,
//            and combatEnemy.hp from combat.js
// CALLED BY: combat.js (resolvePlayerHit → fireOnAttackProcs),
//            combat_enemy.js (doEnemyTurn → fireOnHitProcs)
// CALLS: combat.js (addCombatLog, combatEnemy, combatProcPoison,
//                   combatPlayerShield),
//        combat_buffs.js (applyEnemyDebuff),
//        combat_mechanics.js (getEnemyDmgMultiplier)
// ═══════════════════════════════════════════════════════════════

// Fires onAttack procs from equipped items after the player lands a hit.
// slotFilter: if provided, only fire the proc for that slot (for dual-wield per-weapon procs).
function fireOnAttackProcs(slotFilter) {
  for (let [slot, itemId] of Object.entries(game.equipped)) {
    if (slotFilter && slot !== slotFilter) continue;
    if (!itemId || !itemDefs[itemId] || !itemDefs[itemId].onAttack) continue;
    let proc = itemDefs[itemId].onAttack;
    if (Math.random() >= proc.chance) continue;
    let item = itemDefs[itemId];
    if (proc.effect === 'fireball') {
      let fireMult = getEnemyDmgMultiplier(combatEnemy, 'fire');
      let fbDmg = Math.max(1, Math.floor(15 * fireMult));
      combatEnemy.hp -= fbDmg;
      toast(`${item.name} activated! Fireball!`, '');
      addCombatLog(`🔥 <b>${item.name}</b> activated! Fireball hits <b>${combatEnemy.name}</b> for <b class="clog-num">${fbDmg}</b>!`, 'player');
    } else if (proc.effect === 'poison') {
      combatProcPoison += 5;
      toast(`${item.name} activated! Poison!`, '');
      addCombatLog(`☠️ <b>${item.name}</b> activated! <b>${combatEnemy.name}</b> poisoned! (+5 dmg/round)`, 'player');
    } else if (proc.effect === 'freeze') {
      applyEnemyDebuff('stun', { turns: 1 });
      toast(`${item.name} activated! Frozen!`, '');
      addCombatLog(`❄️ <b>${item.name}</b> activated! <b>${combatEnemy.name}</b> frozen! (skips next turn)`, 'player');
    }
  }
}

// Fires onHit procs from all equipped items after the enemy hits the player.
function fireOnHitProcs() {
  for (let itemId of Object.values(game.equipped)) {
    if (!itemId || !itemDefs[itemId] || !itemDefs[itemId].onHit) continue;
    let proc = itemDefs[itemId].onHit;
    if (Math.random() >= proc.chance) continue;
    let item = itemDefs[itemId];
    if (proc.heal) {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + proc.heal);
      toast(`${item.name} activated! Life drain restores ${proc.heal} HP!`, 'green');
      addCombatLog(`💚 <b>${item.name}</b> activated! Life drain restores <b class="clog-heal">+${proc.heal} HP</b>!`, 'player');
    } else if (proc.shield) {
      combatPlayerShield += proc.shield;
      toast(`${item.name} activated! +${proc.shield} Shield!`, 'green');
      addCombatLog(`🛡 <b>${item.name}</b> activated! Shield <b class="clog-num">+${proc.shield}</b>!`, 'system');
    } else if (proc.effect === 'stun') {
      applyEnemyDebuff('stun', { turns: 1 });
      toast(`${item.name} activated! Stun applied!`, '');
      addCombatLog(`⚡ <b>${item.name}</b> activated! <b>${combatEnemy.name}</b> stunned!`, 'player');
    } else if (proc.effect === 'poison') {
      combatProcPoison += 5;
      toast(`${item.name} activated! Poison!`, '');
      addCombatLog(`☠️ <b>${item.name}</b> activated! <b>${combatEnemy.name}</b> poisoned! (+5 dmg/round)`, 'player');
    }
  }
}
