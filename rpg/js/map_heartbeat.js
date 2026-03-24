// map_heartbeat.js — Out-of-combat passive ticking
// Fires every 5 seconds while player is on the map, not in combat.
// Handles mana regen and buff/debuff duration decay.
// Depends on: gameplay.js (isCombatOpen, toast), combat_buffs.js (pBuffs, eDebuffs, onPlayerBuffExpire, onEnemyDebuffExpire)

let _heartbeatInterval = null;

function startHeartbeat() {
  if (_heartbeatInterval) return;
  _heartbeatInterval = setInterval(_heartbeatTick, 5000);
}

function stopHeartbeat() {
  if (_heartbeatInterval) {
    clearInterval(_heartbeatInterval);
    _heartbeatInterval = null;
  }
}

function _heartbeatTick() {
  if (isCombatOpen()) return;
  _tickMapManaRegen();
  _tickMapBuffs();
}

function _tickMapManaRegen() {
  let p = game.player;
  if (!p.maxMana || p.mana >= p.maxMana) return;
  let rate = (p.class === 'mage') ? 0.05 : 0.02;
  let bonus = Math.max(1, Math.floor(p.maxMana * rate * (1 + (p.INT || 10) * 0.01)));
  let before = p.mana;
  p.mana = Math.min(p.maxMana, p.mana + bonus);
  let gained = p.mana - before;
  if (gained > 0) toast(`+${gained} MP`, 'blue');
}

function _tickMapBuffs() {
  let changed = false;

  // Tick player buffs
  for (let id of Object.keys(pBuffs)) {
    let buff = pBuffs[id];
    if (buff && typeof buff.turns === 'number') {
      buff.turns--;
      if (buff.turns <= 0) {
        onPlayerBuffExpire(id, buff);
        delete pBuffs[id];
        changed = true;
      }
    }
  }

  // Tick enemy debuffs (future-proof: eDebuffs reset each combat so usually empty on map)
  for (let id of Object.keys(eDebuffs)) {
    let debuff = eDebuffs[id];
    if (debuff && typeof debuff.turns === 'number') {
      debuff.turns--;
      if (debuff.turns <= 0) {
        onEnemyDebuffExpireMap(id, debuff);
        delete eDebuffs[id];
        changed = true;
      }
    }
  }
}

// Map-safe version of onEnemyDebuffExpire — shows toasts without touching combatEnemy.
function onEnemyDebuffExpireMap(id) {
  switch (id) {
    case 'slow':      toast('Enemy is no longer slowed', '');         break;
    case 'stun':      toast('Enemy has recovered from stun', '');     break;
    case 'atkDebuff': toast('Enemy ATK debuff has worn off', '');     break;
    case 'possessed': toast('Enemy is no longer possessed', '');      break;
    case 'polymorph': toast('Polymorph has worn off', '');            break;
  }
}

// Start heartbeat when the page finishes loading.
window.addEventListener('load', startHeartbeat);
// Stop heartbeat on page unload to prevent interval leaks.
window.addEventListener('beforeunload', stopHeartbeat);
