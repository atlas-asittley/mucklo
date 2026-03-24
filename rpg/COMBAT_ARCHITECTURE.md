# Combat Architecture

This document describes the full architecture of the RPG combat system as of March 2026. It is intended to guide a refactor — assume the reader has never seen this code.

---

## 1. File Responsibilities

### `combat.js`
The orchestrator and source of truth for all flat combat state. It declares every top-level `let` variable that tracks the current fight (enemy reference, lock state, shield HP, poison ticks, etc.), owns the combat log array and its renderer, and contains the two entry points (`startCombat`, `startSparring`) that both funnel into `initCombatScreen()`. It also contains the most consequential shared functions: `resolvePlayerHit()` (the single path through which all player damage flows), `combatWin()` (XP, gold, drops, level-up, post-combat heal, save), `playerDeath()` (corpse placement, inventory strip, gold loss), and `respawn()`. Level-up math (`applyLevelUp`) lives here too. The file comment lists every external dependency; it is the most depended-upon file in the system.

### `combat_skills.js`
Owns active skill execution. `combatUseSkill(skillId)` is a single large `switch` statement — one `case` per learnable skill. It handles mana deduction, cooldown assignment, skill XP tracking (`incrementSkillXP`), and the actual effect (damage, buff application, state changes). Skills that deal damage call `resolvePlayerHit()`; skills that only apply a buff call `doEnemyTurn()` directly via `setTimeout`. Multi-hit skills (`whirlwind`, `call_lightning`, `meteor_swarm`) define inner recursive callback functions inside their `case` block and chain them through `resolvePlayerHit`'s `afterHitCallback` parameter.

### `combat_buffs.js`
Has two distinct responsibilities that happen to cohabit the same file. First, it **declares** all buff and passive state variables (the 20+ `let` vars for stealth, polymorph, possession, haste, regen turns, etc.). Second, it contains the per-round processing functions: `tickBuffs()` (runs at the top of every enemy turn, handles time stop, haste, passive skill procs, regen, DoT ticks, summon, polymorph expiry, possession self-damage) and `processPassiveSkills()` (fires passive-tagged skills: kick, headbutt, elbow, dodge). It also owns `checkReincarnate()` (death intercept) and the entire combat skills menu UI (`toggleCombatSkills`, `renderCombatSkills`, `hideCombatSkills`). The menu UI being here rather than in a UI file is incidental.

### `combat_player.js`
Owns all player-initiated combat actions except skill use. Contains `combatAttack()` (full damage calculation including elemental bonuses, synergy, sneak/hide multipliers, dual-wield callback chain), `doSecondaryAttack()` (off-hand swing, 70% damage, calls `resolvePlayerHit` with `SECONDARY_HAND` slot filter), `doDoubleStrikeHit()` (passive second hit at 80% damage), `combatUseItem()` / `useCombatItem()` (potion/ATK-boost item consumption), and `combatRun()` (flee logic with separate rules for boss, world map, sparring, and normal combat).

### `combat_enemy.js`
Owns the enemy's entire turn. `doEnemyTurn(prependMsg)` first calls `tickBuffs()` and early-returns if it consumed the turn. Then it runs a gauntlet: stun check, quickstep dodge, sanctuary, invisibility, passive dodge roll, damage calculation, bless DEF reduction, power strike penalty, slow/ATK debuff ticks, elemental resistance, shield absorption, shield block, divine shield, parry passive, damage application, contingency auto-heal, thorns/reflect, `fireOnHitProcs()`, and finally win/death checks. `_endEnemyTurnEarly()` is a shared helper for stun/dodge paths that sets the message, updates UI, ticks cooldowns, and releases the lock.

### `combat_mechanics.js`
Pure combat math with no side effects. Defines the damage type constants (`DAMAGE_TYPE_INFO`, `DAMAGE_TYPE_AFFINITIES`), synergy counting (`calculateSynergyCounts`), synergy label generation (`getSynergyLabel`), passive aggregation (`getEquippedPassives` — merges item passives, set bonuses, and synergy bonuses into one flat object), the base damage formula (`calcDamage`), player attack rolls with crit (`calcPlayerAttack`), HP/mana recalculation (`recalcMaxHp`, `recalcMaxMana`), damage type helpers (`getDamageType`, `getPlayerDamageType`, `getEnemyDmgMultiplier`), and gold drop rolls (`rollGoldDrop`). It is the only file with no dependency on any other combat file (it only needs `constants.js`, `state.js`, `data.js`).

### `combat_procs.js`
Owns item proc (on-proc effect) systems. `fireOnAttackProcs(slotFilter)` iterates equipped items after the player lands a hit and fires any `onAttack` proc definitions (fireball, poison, freeze). `fireOnHitProcs()` does the same when the enemy hits the player (heal, shield, stun, poison). The `slotFilter` parameter exists to support dual-wield: when the main-hand hits, only its slot fires; when the off-hand hits, only its slot fires. This file is small and focused.

---

## 2. State Ownership

### Flat `let` variables in `combat.js`

| Variable | Type | Purpose |
|---|---|---|
| `combatEnemy` | object / null | Shallow copy of the active enemy from `enemies[]` |
| `combatEnemyIndex` | number | Index into global `enemies[]`; -1 during sparring |
| `combatLocked` | boolean | True while awaiting a setTimeout; blocks player input |
| `combatPlayerPowerStrike` | boolean | Power Strike active; enemy's next hit deals +50% |
| `combatPlayerQuickStep` | boolean | Quick Step active; player dodges the next attack |
| `isSparring` | boolean | Flags sparring mode; changes win/death/flee behavior |
| `isWorldMapEncounter` | boolean | Flags world-map random encounter; changes loot/flee |
| `combatItemSelectMode` | boolean | True while inventory is open for item selection |
| `combatLog` | array | Ring buffer of up to 20 log entries `{ message, type }` |
| `combatTotalDmg` | number | Cumulative damage dealt; shown in win screen |
| `combatPlayerShield` | number | Temporary shield HP absorbed before player HP |
| `combatProcPoison` | number | Accumulated proc-poison ticks dealt per round |

### Unified buff objects in `combat_buffs.js` (Step 3 refactor)

All per-round duration effects now live in three plain objects instead of individual flat variables. Each key is a buff/debuff ID; values hold `turns` and any extra data fields.

| Object | Who owns it | What goes in it |
|---|---|---|
| `pBuffs` | combat_buffs.js | Player duration buffs: `regen`, `bless` (+ atkBonus/defBonus), `haste`, `dodgeBonus`, `invisibility` |
| `eDebuffs` | combat_buffs.js | Enemy duration debuffs: `stun`, `slow`, `atkDebuff`, `possessed`, `polymorph` (+ savedAtk/savedDef) |
| `pProtect` | combat_buffs.js | Player one-shot protections consumed on trigger: `sanctuary`, `divineShield`, `blockNext` (fraction) |

Helper functions `applyPlayerBuff(id, data)` and `applyEnemyDebuff(id, data)` refresh or create entries, taking the max of existing vs. new turn counts.

### Flat `let` variables in `combat_buffs.js`

These could not be folded into the unified objects (booleans, counters with no turn decay, or mid-combat bookkeeping):

| Variable | Type | Purpose |
|---|---|---|
| `combatPlayerStealth` | boolean | Hide passive: player is invisible after attacking |
| `combatSneakJustFired` | boolean | Sneak consumed stealth this hit; suppresses re-stealth |
| `combatAnimalCompanionRounds` | number | Animal Companion: rounds wolf attacks remaining |
| `combatExtraActions` | number | Time Stop: extra player turns before enemy acts |
| `combatSummonRoundsLeft` | number | Summon: rounds the summoned creature still attacks |
| `combatSummonDmg` | number | Summon: damage per round (INT * 5) |
| `quiveringPalmActive` | boolean | Quivering Palm mode active |
| `quiveringPalmHits` | number | Consecutive hit counter toward Quivering Palm kill |
| `combatContingencyUsed` | boolean | Contingency: auto-heal already fired this combat |

### Properties on `game` object (persist across combats)

| Property | Set/reset where | Purpose |
|---|---|---|
| `game.playerBuffAtk` | `initCombatScreen`, `applyPlayerBuff('bless')` | ATK buff % from Bless; kept in sync with `pBuffs.bless.atkBonus` |
| `game.playerBuffDef` | `initCombatScreen`, `applyPlayerBuff('bless')` | DEF buff % from Bless; kept in sync with `pBuffs.bless.defBonus` |
| `game.battleEnded` | `showBattleEndScreen`, `leaveCombatScreen` | True while on win/flee screen |
| `game.player.skillCooldowns` | `initCombatScreen`, `tickSkillCooldowns` | Map of skillId → remaining cooldown turns |
| `game.player.skillXP` | `incrementSkillXP` | Map of skillId → use count (drives rank-up) |

### Global `enemyFlashTimer` / `playerFlashTimer`
Set in `resolvePlayerHit` and `doEnemyTurn` respectively. Owned by `state.js` or the render loop; not declared in any combat file.

---

## 3. Call Flow

### Combat Start

```
Player walks into enemy / world encounter / NPC sparring
        |
        v
startCombat(index)          -- sets combatEnemy (shallow copy), combatEnemyIndex
startSparring(opponent)     -- sets combatEnemy, isSparring = true
        |
        v
initCombatScreen()
  - Resets all combat state variables to 0 / false / null / {}
  - Resets pBuffs/eDebuffs/pProtect to {}, skillCooldowns to {}
  - Resets game.playerBuffAtk/Def to 0
  - Shows #combat-screen, sets enemy name, damage type icon
  - Logs active synergies to combat log
  - updateCombatUI() + drawEnemyCombat() + drawPlayerCombat()
  -- Player sees combat screen; buttons are enabled
```

### Player Action Phase

```
[Attack button]
  combatAttack()
    calcPlayerAttack()           -- base damage + STR bonus + crit roll
    getPlayerDamageType()        -- weapon damage type
    getEnemyDmgMultiplier()      -- weak/resist multiplier
    calculateSynergyCounts()     -- flat elemental bonuses per equipped item
    [apply bless ATK buff]
    [apply sneak attack mult if stealthed]
    [build afterHitCallback chain: dual_wield -> secondary -> double_strike]
    resolvePlayerHit(finalDmg, ..., afterHitCallback, slotFilter)

[Skill button]
  toggleCombatSkills() / renderCombatSkills()
  -- user picks skill --
  combatUseSkill(skillId)
    [check combatLocked, cooldown, mana]
    combatLocked = true
    [deduct mana, set cooldown]
    switch(skillId):
      damage skills   -> resolvePlayerHit(dmg, ...)
      buff/debuff     -> set state var, updateCombatUI(), setTimeout(doEnemyTurn, 500)
      escape skills   -> showBattleEndScreen()
      multi-hit       -> inner function chain via afterHitCallback

[Item button]
  combatUseItem()
    openInventory() [combatItemSelectMode = true]
  -- user picks item --
  useCombatItem(index)
    [apply heal or ATK boost]
    removeInventoryItem(index)
    updateCombatUI()
    [does NOT trigger enemy turn -- item use is a free action]

[Run button]
  combatRun()
    boss:       30% escape, 5% XP loss on success; enemy turn on fail
    world map:  always escape, 5% XP loss, remove temp enemy
    sparring:   always escape
    normal:     60% escape, 5% XP loss (0 on training_grounds); enemy turn on fail
```

### Hit Resolution (`resolvePlayerHit`)

```
resolvePlayerHit(dmg, mainMsg, prependMsg, afterHitCallback, procSlot)
  combatEnemy.hp -= dmg
  combatTotalDmg += dmg
  enemyFlashTimer = 8
  shakeEnemy()
  [lifesteal passive: heal player]
  [freeze passive: chance to stun enemy]
  [ice 3pc: set combatEnemySlowedTurns = 2]
  [dark 3pc: set combatEnemyAtkDebuffTurns = 2]
  fireOnAttackProcs(procSlot)
  [hide passive: re-stealth + stun enemy (if !combatSneakJustFired)]
  combatSneakJustFired = false
  [quivering palm: count hit; at 3 -> set enemy hp = 0]
  setCombatMsg(mainMsg)
  updateCombatUI()
  if enemy.hp <= 0: combatWin(); return
  if afterHitCallback: setTimeout(afterHitCallback, 300)
  else:               setTimeout(() => doEnemyTurn(prependMsg), 500)
```

### Enemy Turn (`doEnemyTurn`)

```
doEnemyTurn(prependMsg)
  if tickBuffs() return              -- consumed by time_stop / haste / passive / DoT / etc.
  getEquippedPassives()
  if combatEnemyStunned > 0: stun tick, _endEnemyTurnEarly(); return
  if combatPlayerQuickStep:  clear flag, _endEnemyTurnEarly(); return
  if combatPlayerInvincible: clear flag, _endEnemyTurnEarly(); return
  if playerInvisibleTurns > 0: tick, _endEnemyTurnEarly(); return
  [passive dodge roll: DEX + dodge passive + camouflage + pass_without_trace]
  if dodge: _endEnemyTurnEarly(); return
  eDmg = calcDamage(enemy.atk, player.def)
  [bless DEF reduction]
  [power strike +50% penalty, clear flag]
  [slow tick: eDmg *= 0.8, combatEnemySlowedTurns--]
  [atk debuff tick: eDmg *= 0.9, combatEnemyAtkDebuffTurns--]
  [elemental resistance from passives]
  [shield absorption: combatPlayerShield absorbs first]
  [shield block: reduce by combatPlayerBlockNext, clear]
  if combatPlayerDamageImmune: clear flag, unlock; return
  [parry passive 15% chance: reflect eDmg back, combatWin if enemy dies]
  player.hp -= eDmg
  playerFlashTimer = 8, flash-red CSS
  [contingency passive: auto-heal if HP < 20% and not used]
  [thorns passive: enemy.hp -= thorns]
  [reflect passive: enemy.hp -= reflect]
  fireOnHitProcs()
  addCombatLog, setCombatMsg, updateCombatUI, tickSkillCooldowns
  combatLocked = false
  if enemy.hp <= 0: combatWin()
  if player.hp <= 0: playerDeath()
```

### `tickBuffs()` (called at top of every enemy turn)

```
tickBuffs() -> boolean (true = enemy turn consumed, player acts again)
  if combatExtraActions > 0: tick, unlock; return true    [time stop]
  if playerHasteTurns > 0:   tick, unlock; return true    [haste]
  getEquippedPassives()
  processPassiveSkills()  -> may return true               [kick/headbutt/elbow/dodge]
  [regen passive: heal from item passive.regen]
  [regenerate skill: +10 HP if combatPlayerRegenTurns > 0, tick]
  [bless tick: decrement playerBuffTurns, clear at 0]
  [pass_without_trace tick: decrement dodgeBonusTurns]
  [animal companion: wolf deals DEX*0.5 dmg per round, tick rounds]
  [mana regen: +5/round (mage: +10)]
  [poison passive DoT: enemy.hp -= passives.poison]
  [burn passive DoT:   enemy.hp -= passives.burn]
  [proc poison DoT:    enemy.hp -= combatProcPoison]
  [summon DoT:         enemy.hp -= combatSummonDmg, tick rounds]
  [polymorph tick: decrement, restore saved ATK/DEF at 0]
  [possession: enemy self-damage, unlock; return true]
  return false
```

### Combat End

```
Victory path:
  combatWin()
    enemies.splice(combatEnemyIndex, 1)   -- remove from map immediately
    [640ms death animation delay]
    [calculate XP = enemy.xp * INT mult * xpBonus passive]
    branch on isSparring / isWorldMapEncounter / normal:
      give XP, gold, item drops, boss loot
      track rat_tail quest, clear boss tile, set boss dead flag
    [level-up loop: applyLevelUp() while xp >= xpNext]
    [post-combat passive heal]
    saveGame()
    showBattleEndScreen()

Death path:
  playerDeath()
    if isSparring: knock out, restore 1 HP, hide screen; return
    if checkReincarnate(): restore 30% HP, unlock; return
    [find corpse tile: adjacent walkable if enemy occupies death tile]
    [build corpseItems from equipped slots]
    [strip inventory into corpse]
    [unequip all items, applyItemStats * -1, recalcSetBonuses]
    [lose 10% gold]
    game.corpse = { x, y, map, items, inventoryItems, goldLost }
    hide combat screen, show death screen

Flee path:
  combatRun() -> showBattleEndScreen() [see Player Action section above]

After battle end screen:
  Player clicks continue -> leaveCombatScreen()
    game.battleEnded = false
    hide #combat-screen, show #combat-actions
    combatLocked = false
```

---

## 4. Variable Map

All variables that are read or written during combat. "Declared in" means where the `let` or `const` statement lives; they are all in global scope.

| Variable | Declared in | Type | What it does |
|---|---|---|---|
| `combatEnemy` | combat.js | object | Shallow copy of active enemy; mutated freely during combat |
| `combatEnemyIndex` | combat.js | number | Index in `enemies[]`; -1 for sparring; used to splice on win |
| `combatLocked` | combat.js | boolean | Blocks all player input while setTimeout is pending |
| `combatEnemyStunned` | combat.js | number | Remaining stun turns; decremented at top of doEnemyTurn |
| `combatPlayerPowerStrike` | combat.js | boolean | Increases next enemy hit by 50%; set by power_strike skill |
| `combatPlayerQuickStep` | combat.js | boolean | Guarantees dodge of next enemy attack |
| `isSparring` | combat.js | boolean | Alters win (no drops), death (no corpse), flee (always OK) |
| `isWorldMapEncounter` | combat.js | boolean | Alters drops (worldMapDrops), flee (always OK) |
| `combatItemSelectMode` | combat.js | boolean | Signals inventory UI that a click should call useCombatItem |
| `combatLog` | combat.js | array | Last 20 messages; newest first (unshift) |
| `combatTotalDmg` | combat.js | number | Accumulated damage shown on win screen |
| `combatPlayerShield` | combat.js | number | Temporary HP buffer; absorbs before player.hp |
| `combatProcPoison` | combat.js | number | Poison stacks from procs; ticked each round in tickBuffs |
| `combatEnemySlowedTurns` | combat_buffs.js | number | Enemy ATK -20% for N turns (slow, ice 3pc, ego_whip) |
| `combatEnemyAtkDebuffTurns` | combat_buffs.js | number | Enemy ATK -10% for N turns (dark 3pc, dispel_magic) |
| `combatPlayerStealth` | combat_buffs.js | boolean | Hide passive active; next attack gets sneak bonus |
| `combatSneakJustFired` | combat_buffs.js | boolean | Suppresses immediate re-stealth after sneak attack |
| `combatPlayerBlockNext` | combat_buffs.js | number | Fraction of next incoming damage blocked by Shield Block |
| `combatPlayerInvincible` | combat_buffs.js | boolean | Sanctuary: enemy skips attack |
| `combatPlayerDamageImmune` | combat_buffs.js | boolean | Divine Shield: immune to all damage for 1 turn |
| `combatPlayerRegenTurns` | combat_buffs.js | number | Turns of +10 HP/turn from Regenerate skill |
| `combatPlayerDodgeBonusTurns` | combat_buffs.js | number | Turns of +50% dodge from Pass Without Trace |
| `combatAnimalCompanionRounds` | combat_buffs.js | number | Rounds wolf companion continues attacking |
| `combatExtraActions` | combat_buffs.js | number | Extra player turns granted by Time Stop |
| `combatSummonRoundsLeft` | combat_buffs.js | number | Rounds summoned creature still attacks |
| `combatSummonDmg` | combat_buffs.js | number | Damage per round from summoned creature |
| `playerInvisibleTurns` | combat_buffs.js | number | Turns enemy cannot see player (Invisibility skill) |
| `playerHasteTurns` | combat_buffs.js | number | Turns player gets extra action before enemy (Haste skill) |
| `quiveringPalmActive` | combat_buffs.js | boolean | Quivering Palm countdown is running |
| `quiveringPalmHits` | combat_buffs.js | number | Consecutive hit counter; 3 triggers instant kill |
| `combatEnemyPossessedTurns` | combat_buffs.js | number | Turns enemy attacks itself (Possession / Charm Person) |
| `combatContingencyUsed` | combat_buffs.js | boolean | Prevents Contingency from firing twice per combat |
| `combatEnemyPolymorphed` | combat_buffs.js | number | Turns enemy is a slime |
| `combatEnemyPolymorphSavedAtk` | combat_buffs.js | number | Enemy's real ATK stored during polymorph |
| `combatEnemyPolymorphSavedDef` | combat_buffs.js | number | Enemy's real DEF stored during polymorph |
| `game.playerBuffAtk` | game object (reset in combat.js) | number | % ATK bonus from Bless |
| `game.playerBuffDef` | game object (reset in combat.js) | number | % DEF reduction from Bless |
| `game.playerBuffTurns` | game object (reset in combat.js) | number | Remaining Bless turns |
| `game.battleEnded` | game object | boolean | True on win/flee screen; blocks some game loop behaviors |
| `game.player.skillCooldowns` | game object | object | skillId -> remaining turns; reset each combat |
| `game.player.skillXP` | game object | object | skillId -> total uses; persisted for rank progression |
| `DAMAGE_TYPE_INFO` | combat_mechanics.js | const object | Icons, labels, colors, resistKey per damage type |
| `DAMAGE_TYPE_AFFINITIES` | combat_mechanics.js | const object | weak/resist pairs for each damage type |

---

## 5. Key Functions

| Function | File | Called by | What it does |
|---|---|---|---|
| `startCombat(index)` | combat.js | gameplay.js (on tile collision) | Entry point for normal combat |
| `startSparring(opponent)` | combat.js | NPC dialogue system | Entry point for sparring |
| `initCombatScreen()` | combat.js | `startCombat`, `startSparring` | Resets all state, builds UI, logs synergies |
| `resolvePlayerHit(dmg, mainMsg, prependMsg, afterCb, procSlot)` | combat.js | `combatAttack`, `combatUseSkill`, `doSecondaryAttack`, `doDoubleStrikeHit` | Applies player damage, triggers all on-hit effects, chains to next hit or enemy turn |
| `combatWin()` | combat.js | `resolvePlayerHit`, `tickBuffs`, `doEnemyTurn` | Full win sequence: XP, gold, drops, level-up, save |
| `playerDeath()` | combat.js | `doEnemyTurn` | Full death sequence: corpse, strip, gold loss |
| `respawn()` | combat.js | death screen button | Sends player to town healer |
| `applyLevelUp()` | combat.js | `combatWin`, debug.js | Increments level and stats |
| `showBattleEndScreen()` | combat.js | `combatWin`, `combatRun`, escape skills | Locks UI, shows end state |
| `leaveCombatScreen()` | combat.js | end screen button | Hides combat UI, restores game state |
| `addCombatLog(message, type)` | combat.js | everywhere | Prepends to log ring buffer, re-renders |
| `tickSkillCooldowns()` | combat.js | `doEnemyTurn`, `_endEnemyTurnEarly`, `tickBuffs` | Decrements all cooldowns, refreshes skill menu |
| `updateCombatUI()` | combat.js | everywhere | Syncs HP/mana bars and redraws combat sprites |
| `doEnemyTurn(prependMsg)` | combat_enemy.js | `resolvePlayerHit`, `combatUseSkill`, `combatRun`, `doSecondaryAttack`, `doDoubleStrikeHit` | Full enemy counterattack turn |
| `_endEnemyTurnEarly(combatMsg, logMsg)` | combat_enemy.js | `doEnemyTurn` | Shared early-return for stun/dodge; sets message, unlocks |
| `tickBuffs()` | combat_buffs.js | `doEnemyTurn` | Per-round buff ticks; returns true to skip enemy attack |
| `processPassiveSkills()` | combat_buffs.js | `tickBuffs` | Fires passive skill procs (kick, headbutt, elbow, dodge) |
| `checkReincarnate()` | combat_buffs.js | `playerDeath` | Auto-revive with 30% HP if skill learned and not used |
| `renderCombatSkills()` | combat_buffs.js | `toggleCombatSkills`, `tickSkillCooldowns` | Renders skill button list with cooldowns/mana costs |
| `combatAttack()` | combat_player.js | Attack button onclick | Full standard attack with elemental, synergy, dual-wield |
| `doSecondaryAttack(afterCb)` | combat_player.js | `combatAttack` callback chain | Off-hand swing at 70% damage |
| `doDoubleStrikeHit()` | combat_player.js | callback chain | Passive second hit at 80% damage |
| `combatUseItem()` / `useCombatItem(index)` | combat_player.js | Item button, inventory click | Opens inventory or applies selected consumable |
| `combatRun()` | combat_player.js | Run button onclick | Flee with context-dependent rules |
| `combatUseSkill(skillId)` | combat_skills.js | skill button onclick | Mana/cooldown gate then dispatches by skill ID |
| `incrementSkillXP(skillId)` | combat_skills.js | all skill cases, passive procs | Tracks skill use count, fires rank-up toast |
| `calcPlayerAttack()` | combat_mechanics.js | `combatAttack`, `combatUseSkill`, `doSecondaryAttack`, `doDoubleStrikeHit` | Returns `{ dmg, crit }` including STR bonus and berserk |
| `calcDamage(atk, def)` | combat_mechanics.js | `doEnemyTurn` | Returns max(1, atk - def + rand(0..2)) |
| `getEquippedPassives()` | combat_mechanics.js | `resolvePlayerHit`, `doEnemyTurn`, `tickBuffs`, `combatAttack`, `useCombatItem` | Merges item passives + set bonus + synergy bonuses |
| `calculateSynergyCounts()` | combat_mechanics.js | `getEquippedPassives`, `combatAttack`, `initCombatScreen` | Counts equipped items per damage type |
| `getEnemyDmgMultiplier(enemy, type)` | combat_mechanics.js | `combatAttack`, `doSecondaryAttack`, skill cases | 1.5x if weak, 0.5x if resist, 1.0x otherwise |
| `getDamageType(enemy)` | combat_mechanics.js | `doEnemyTurn`, `initCombatScreen` | Returns enemy.damageType or 'physical' |
| `getPlayerDamageType()` | combat_mechanics.js | `combatAttack`, `doSecondaryAttack`, `doDoubleStrikeHit` | Returns MAIN_HAND weapon damageType or 'physical' |
| `recalcMaxHp()` / `recalcMaxMana()` | combat_mechanics.js | `applyLevelUp`, character creation | Recomputes derived max stats from base stats |
| `fireOnAttackProcs(slotFilter)` | combat_procs.js | `resolvePlayerHit` | Fires item onAttack procs (fireball, poison, freeze) |
| `fireOnHitProcs()` | combat_procs.js | `doEnemyTurn` | Fires item onHit procs (heal, shield, stun, poison) |

---

## 6. Pain Points

These are the areas most likely to cause bugs or confusion during a refactor.

### 6.1 State split between `combat.js` and `combat_buffs.js` is arbitrary
There is no functional reason why some `let` vars live in `combat.js` and others in `combat_buffs.js`. Both files contribute to one flat global namespace. Adding a new buff variable requires deciding where to put it, and `initCombatScreen()` in `combat.js` must reset variables from both files. This is easy to forget and has caused bugs before (the polymorph/charm_person/contingency fix commits).

### 6.2 `initCombatScreen()` resets ~25 variables by hand
Every variable reset is a manual line. There is no loop, no object, no sentinel. Adding a new state variable anywhere requires updating `initCombatScreen()` separately. If you forget, the variable will have leftover state from the previous fight.

### 6.3 `resolvePlayerHit()` is doing too much
It is the most critical function in the system and it handles: damage application, visual effects (shake, flash timer), lifesteal, freeze, ice/dark synergy on-hit, proc firing, hide passive re-stealth, quivering palm counting, message display, UI update, win check, and callback chaining. Any new "on player hit" effect gets added here by default, growing the function further.

### 6.4 Multi-hit callback chaining is fragile
Dual wield + double strike creates a chain: main hit -> `doSecondaryAttack` -> `doDoubleStrikeHit`, each passed as an `afterHitCallback` to `resolvePlayerHit`. The chain is built in `combatAttack()` in reverse order. If any hit kills the enemy, `combatWin()` is called and the chain stops — which is correct, but it means any new link in the chain must also guard on `combatEnemy.hp <= 0`. Multi-hit skills (whirlwind, call_lightning, meteor_swarm) define inner recursive functions (`doWWHit`, `doCLHit`, `doMSHit`) inside switch-case blocks, which works but is defined fresh each skill use.

### 6.5 `tickBuffs()` boolean protocol is implicit
`tickBuffs()` returns `true` if it consumed the enemy's turn and `false` otherwise. `doEnemyTurn()` early-returns on `true`. Possession is the most surprising case: it does self-damage, then returns `true` even though the enemy "acted" (on itself). Any future buff that should consume the turn must remember to `return true`. There is no explicit concept of "turn tokens" or action economy — just this convention.

### 6.6 `doEnemyTurn()` is a 200-line gauntlet
The function applies eight different damage modifiers in sequence (bless DEF, power strike, slow, ATK debuff, elemental resist, shield absorption, shield block, divine shield) before applying damage, then handles parry, thorns, reflect, and procs after. The order matters and is not documented. Inserting a new modifier requires knowing exactly where in the chain it belongs.

### 6.7 `combatWin()` triplicates its log/toast/msg pattern
The function has three code branches (sparring, world map, normal) that each independently build log entries, toast messages, and msg calls for XP and gold. Boss loot and level-up happen after the branch, but item drop logic is duplicated inside the normal branch with its own `if/else` between enemy-specific drops and floor drops. Changes to win messaging must be applied in three places.

### 6.8 Elemental damage is calculated twice, differently
`combatAttack()` calculates flat elemental damage bonuses inline using `ELEM_WE_KEYS` — iterating equipped items and applying synergy percentage multipliers directly. `getEquippedPassives()` in `combat_mechanics.js` also calculates synergy-driven passives (burn, poison, regen, lifesteal). These are separate systems solving overlapping concerns. A "fire synergy" item contributes to both `getEquippedPassives().burn` (DoT) and the flat `fireDamage` whileEquipped bonus (instant per-hit damage), but the logic that computes the per-hit bonus is entirely in `combatAttack()`, not in `getEquippedPassives()`.

### 6.9 `game.playerBuffAtk/Def/Turns` live on `game`, everything else is flat `let`
The Bless buff uses properties on the persistent `game` object, while every other per-combat buff is a flat `let` variable. This inconsistency means bless must be explicitly zeroed in `initCombatScreen()` and is technically saved to `game` state between sessions (though it also gets reset on init so it doesn't matter in practice).

### 6.10 `steal` uses raw `game.inventory.push()` instead of `addInventoryItem()`
The steal skill bypasses the standard inventory management function, skipping any capacity limits or ID-assignment logic that `addInventoryItem` may enforce.

### 6.11 Out-of-combat skills still consume a turn in combat
`pick_lock`, `peek`, `track`, and `fly` have no combat effect but still trigger `doEnemyTurn()` after use. This means using them in combat wastes a turn and is presumably unintentional — they should either be hidden from the combat skill menu or refund the turn.

### 6.12 `combatLocked` is set and cleared across all six files
No single file owns the lock. It is set at the top of every player action, released at the bottom of `doEnemyTurn()` and `_endEnemyTurnEarly()`, and also released in special cases inside `tickBuffs()` (time_stop, haste, possession). A forgotten `combatLocked = false` in an error path silently freezes the combat UI permanently.

### 6.13 `combatEnemyIndex` can become stale
`combatEnemyIndex` is set to the enemy's index in `enemies[]` at combat start. If another part of the game modifies `enemies[]` (splice, push) while a fight is in progress, the index is wrong. Currently, the only splice during combat is in `combatWin()` itself, which clears the index to -1 immediately after.

---

## 7. Dependency Graph

Arrows mean "depends on / calls functions from".

```
constants.js, state.js, data.js, gameplay.js, sprites.js, particles.js
    |
    |  (foundation — no combat deps)
    v
combat_mechanics.js
    |
    +-----> combat_procs.js
    |           |
    +-----> combat_buffs.js
    |           |
    +-----> combat.js <-----------+
    |           |                 |
    |           v                 |
    +-----> combat_enemy.js ------+  (calls combatWin, playerDeath from combat.js)
    |           ^
    |           |
    +-----> combat_player.js -----+  (calls doEnemyTurn from combat_enemy.js)
    |           ^                 |
    +-----> combat_skills.js -----+  (calls doEnemyTurn, resolvePlayerHit)
```

### Explicit dependency table

| File | Depends on |
|---|---|
| `combat_mechanics.js` | `constants.js`, `state.js`, `data.js` |
| `combat_procs.js` | `combat_mechanics.js`, `combat.js`, `state.js`, `data.js`, `gameplay.js` |
| `combat_buffs.js` | `combat.js`, `combat_mechanics.js`, `data.js`, `gameplay.js` |
| `combat_enemy.js` | `combat.js`, `combat_buffs.js`, `combat_mechanics.js`, `combat_procs.js`, `state.js`, `data.js`, `gameplay.js` |
| `combat_player.js` | `combat.js`, `combat_mechanics.js`, `combat_enemy.js`, `combat_skills.js`, `state.js`, `data.js`, `gameplay.js`, `ui_inventory.js` |
| `combat_skills.js` | `combat.js`, `combat_buffs.js`, `combat_mechanics.js`, `combat_enemy.js`, `data.js`, `state.js`, `gameplay.js` |
| `combat.js` | `constants.js`, `state.js`, `data.js`, `particles.js`, `sprites.js`, `gameplay.js`, `ui_hud.js`, `ui_inventory.js`, `maps.js`, `combat_buffs.js` (reads its vars) |

Note: `combat.js` reads variables declared in `combat_buffs.js` (e.g., resets them in `initCombatScreen`) without a formal import — this is a hidden coupling between the two files enforced only by load order in the HTML.

### Load order requirement

The files must be loaded in this order in the HTML:
1. `combat_mechanics.js`
2. `combat_procs.js`
3. `combat_buffs.js`
4. `combat.js`
5. `combat_enemy.js`
6. `combat_player.js`
7. `combat_skills.js`
