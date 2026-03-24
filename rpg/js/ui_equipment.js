// ui_equipment.js — Equipment screen, paper doll, equip/unequip logic, and set bonuses.
// Extracted from ui_inventory.js to keep it under 600 lines.
// Depends on: constants.js (CLASS_DEFS, SET_DEFS, RARITY), state.js (game),
//   data.js (itemDefs), gameplay.js (toast, msg),
//   ui_hud.js (saveGame), ui_inventory.js (canEquipItem, passiveText,
//   addInventoryItem, removeInventoryItem, openInventory, closeInventory,
//   renderInventoryScreen), ui_panels.js (rarityInfo, itemStatText,
//   attachTooltip, setTooltipHandlers, clearTooltipHandlers),
//   combat.js (recalcMaxHp).
// Load BEFORE ui_inventory.js.

// ─── EQUIP SLOT CONSTANTS ─────────────────────────────────────────────────────
const EQUIP_SLOT_ICONS  = { HEAD:'⛑', CHEST:'🥋', HANDS:'🧤', FEET:'👢', MAIN_HAND:'⚔', OFF_HAND:'🛡', SECONDARY_HAND:'⚔', RING:'💍', AMULET:'📿' };
const EQUIP_SLOT_LABELS = { HEAD:'HEAD', CHEST:'CHEST', HANDS:'HANDS', FEET:'FEET', MAIN_HAND:'MAIN HAND', OFF_HAND:'OFF HAND', SECONDARY_HAND:'SECONDARY', RING:'RING', AMULET:'AMULET' };

// ─── EQUIPPED TAB ─────────────────────────────────────────────────────────────
function renderEquippedTab() {
  // Render paper doll
  renderEquipScreen();
  // Render equipment list below the paper doll
  let container = document.getElementById('inv-equip-list');
  if (!container) return;
  container.innerHTML = '';

  // Collect equipped items
  let equippedItems = [];
  for (let [slotName, itemId] of Object.entries(game.equipped)) {
    if (itemId && itemDefs[itemId]) equippedItems.push({ itemId, slotName, equipped: true });
  }
  // Collect unequipped equipment items from inventory
  let invEquipItems = [];
  for (let i = 0; i < game.inventory.length; i++) {
    let itemId = game.inventory[i];
    let item = itemDefs[itemId];
    if (item && item.slot) invEquipItems.push({ itemId, invIndex: i, slotName: item.slot, equipped: false });
  }

  let all = [...equippedItems, ...invEquipItems];
  if (all.length === 0) {
    container.innerHTML = '<div style="color:#333;padding:16px;font-size:8px;text-align:center">NO EQUIPMENT</div>';
    return;
  }

  for (let entry of all) {
    let { itemId, slotName, equipped, invIndex } = entry;
    let item = itemDefs[itemId];
    let info = rarityInfo(itemId);
    let div = document.createElement('div');
    div.className = 'equip-list-item' + (equipped ? ' is-equipped' : '');
    let badge = equipped
      ? `<span class="equip-list-badge equipped">EQUIPPED</span>`
      : `<span class="equip-list-badge equip-btn">EQUIP</span>`;
    div.innerHTML = `
      <div class="equip-list-icon">${item.icon}</div>
      <div class="equip-list-info">
        <div class="equip-list-name" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}</div>
        <div class="equip-list-stat">${itemStatText(item)}${item.passive ? ' · ' + passiveText(item.passive) : ''}</div>
        <div class="equip-list-slot">${EQUIP_SLOT_LABELS[slotName] || slotName}</div>
      </div>
      ${badge}`;
    if (equipped) {
      div.onclick = () => { unequipSlot(slotName); renderEquippedTab(); };
    } else {
      div.onclick = () => {
        if (!canEquipItem(itemId)) {
          let cls = CLASS_DEFS[game.player.class || 'warrior'];
          toast(`${cls ? cls.name + 's' : 'Your class'} cannot equip ${item.name}!`, 'red');
          return;
        }
        equipFromInventory(invIndex, slotName);
        renderEquippedTab();
      };
    }
    attachTooltip(div, itemId);
    container.appendChild(div);
  }
}

// ─── SET BONUSES ──────────────────────────────────────────────────────────────
function getEquippedSetCounts() {
  let counts = {};
  for (let itemId of Object.values(game.equipped)) {
    if (!itemId || !itemDefs[itemId] || !itemDefs[itemId].set) continue;
    let s = itemDefs[itemId].set;
    counts[s] = (counts[s] || 0) + 1;
  }
  return counts;
}

// Returns the highest active tier bonus object for a set given piece count, or null.
function getActiveSetBonus(setId, count) {
  let def = SET_DEFS[setId];
  if (!def) return null;
  let maxTier = 0;
  for (let tier of Object.keys(def.bonuses).map(Number)) {
    if (count >= tier) maxTier = tier;
  }
  return maxTier ? def.bonuses[maxTier] : null;
}

function recalcSetBonuses() {
  // Remove previously applied stat bonuses
  let old = (game.setBonus || {})._appliedStats || {};
  game.player.atk = Math.max(0, game.player.atk - (old.atk || 0));
  game.player.def = Math.max(0, game.player.def - (old.def || 0));
  for (let stat of ['STR','DEX','CON','INT','WIS','CHA']) {
    if (old[stat]) game.player[stat] = Math.max(1, (game.player[stat] || 10) - old[stat]);
  }

  // Reset
  game.setBonus = {};
  let appliedStats = {};

  // Calculate active bonuses
  let counts = getEquippedSetCounts();
  for (let [setId, count] of Object.entries(counts)) {
    let bonus = getActiveSetBonus(setId, count);
    if (!bonus) continue;
    if (bonus.passives) {
      for (let [k, v] of Object.entries(bonus.passives)) {
        game.setBonus[k] = (game.setBonus[k] || 0) + v;
      }
    }
    if (bonus.stats) {
      for (let [k, v] of Object.entries(bonus.stats)) {
        appliedStats[k] = (appliedStats[k] || 0) + v;
      }
    }
  }

  // Apply stat bonuses to player
  game.setBonus._appliedStats = appliedStats;
  game.player.atk += appliedStats.atk || 0;
  game.player.def += appliedStats.def || 0;
  for (let stat of ['STR','DEX','INT','WIS','CHA']) {
    if (appliedStats[stat]) game.player[stat] = (game.player[stat] || 10) + appliedStats[stat];
  }
  if (appliedStats.CON) {
    game.player.CON = (game.player.CON || 10) + appliedStats.CON;
  }
  // maxHp bonus is handled by recalcMaxHp()
  recalcMaxHp();
}

function formatSetBonusDesc(bonus) {
  let parts = [];
  if (bonus.stats) {
    for (let [k, v] of Object.entries(bonus.stats)) {
      if (k === 'maxHp') parts.push(`+${v} Max HP`);
      else if (k === 'atk') parts.push(`+${v} ATK`);
      else if (k === 'def') parts.push(`+${v} DEF`);
      else parts.push(`+${v} ${k}`);
    }
  }
  if (bonus.passives) {
    for (let [k, v] of Object.entries(bonus.passives)) {
      if (k === 'dodge')     parts.push(`+${v}% Dodge`);
      else if (k === 'crit') parts.push(`+${v}% Crit`);
      else if (k === 'thorns')    parts.push(`Thorns ${v}`);
      else if (k === 'lifesteal') parts.push(`Lifesteal ${v}%`);
      else if (k === 'burn')      parts.push(`Burn ${v}`);
      else if (k === 'reflect')   parts.push(`Reflect ${v}`);
      else parts.push(`${k} +${v}`);
    }
  }
  return parts.join(', ');
}

// ─── EQUIPMENT SCREEN ─────────────────────────────────────────────────────────
function openEquipScreen() {
  inventoryTab = 'equipped';
  openInventory();
}

function closeEquipScreen() {
  closeInventory();
}

function renderEquipScreen() {
  let eq = game.equipped;
  for (let slotName of Object.keys(EQUIP_SLOT_LABELS)) {
    let el = document.getElementById('eslot-' + slotName);
    if (!el) continue;
    let itemId = eq[slotName];
    if (itemId && itemDefs[itemId]) {
      let item = itemDefs[itemId];
      let info = rarityInfo(itemId);
      let stat = itemStatText(item);
      let ptext = passiveText(item.passive);
      let setTag = item.set && SET_DEFS[item.set] ? `<div class="equip-slot-set">${SET_DEFS[item.set].name}</div>` : '';
      el.className = 'equip-slot occupied';
      el.innerHTML = `<div class="equip-slot-icon">${item.icon}</div><div class="equip-slot-name" style="color:${info.color}">${item.name}</div>${setTag}${stat ? `<div class="equip-slot-stat">${stat}</div>` : ''}${ptext ? `<div class="equip-slot-passive">${ptext}</div>` : ''}<div class="equip-slot-label" style="color:${info.color}">${info.label}</div>`;
      setTooltipHandlers(el, itemId);
    } else {
      el.className = 'equip-slot';
      el.innerHTML = `<div class="equip-slot-icon equip-slot-empty">${EQUIP_SLOT_ICONS[slotName]}</div><div class="equip-slot-label">${EQUIP_SLOT_LABELS[slotName]}</div>`;
      clearTooltipHandlers(el);
    }
  }
  // Show SECONDARY_HAND slot only when dual_wield skill is learned
  let secondarySlotEl = document.getElementById('eslot-SECONDARY_HAND');
  if (secondarySlotEl) {
    let hasDualWield = (game.player.learnedSkills || []).includes('dual_wield');
    secondarySlotEl.style.display = hasDualWield ? '' : 'none';
  }

  let totalAtk = 0, totalDef = 0;
  for (let sl of Object.keys(EQUIP_SLOT_LABELS)) {
    let id = eq[sl];
    if (id && itemDefs[id]) { totalAtk += itemDefs[id].atk || 0; totalDef += itemDefs[id].def || 0; }
  }
  document.getElementById('equip-bonuses').innerHTML =
    `<div class="equip-bonus-chip">ATK <span>${game.player.atk}</span></div>` +
    `<div class="equip-bonus-chip">DEF <span>${game.player.def}</span></div>` +
    `<div class="equip-bonus-chip">GEAR ATK <span>+${totalAtk}</span></div>` +
    `<div class="equip-bonus-chip">GEAR DEF <span>+${totalDef}</span></div>`;

  // Set bonuses section
  let counts = getEquippedSetCounts();
  let setBonusEl = document.getElementById('equip-set-bonuses');
  if (Object.keys(counts).length === 0) {
    setBonusEl.style.display = 'none';
  } else {
    let html = '<div class="set-bonuses-title">SET BONUSES</div>';
    for (let [setId, count] of Object.entries(counts)) {
      let def = SET_DEFS[setId];
      if (!def) continue;
      let tiers = Object.keys(def.bonuses).map(Number).sort((a, b) => a - b);
      html += `<div class="set-bonus-group">`;
      html += `<div class="set-bonus-name">${def.name} <span class="set-piece-count">(${count} pc)</span></div>`;
      for (let tier of tiers) {
        let active = count >= tier;
        let desc = formatSetBonusDesc(def.bonuses[tier]);
        html += `<div class="set-bonus-tier ${active ? 'set-bonus-active' : 'set-bonus-inactive'}">`;
        html += `<span class="set-tier-badge">${tier}pc</span> ${desc}`;
        html += `</div>`;
      }
      html += `</div>`;
    }
    setBonusEl.innerHTML = html;
    setBonusEl.style.display = 'block';
  }

  // Synergy bonuses section
  const SYN_DEFS = {
    fire:      { icon:'🔥', label:'Fire',      tiers:{ 1:'+2 fire dmg/item', 2:'+5% fire dmg', 3:'+10% fire dmg + Burn Aura' } },
    ice:       { icon:'❄️',  label:'Ice',       tiers:{ 1:'+2 ice dmg/item',  2:'+5% ice dmg',  3:'+10% ice dmg + Slow (ATK -20%)' } },
    lightning: { icon:'⚡', label:'Lightning', tiers:{ 1:'+2 lt dmg/item',   2:'+5% lt dmg',   3:'+10% lt dmg + Chain (15%)' } },
    poison:    { icon:'☠️',  label:'Poison',    tiers:{ 1:'+1 poison/item',   2:'+50% poison',  3:'+50% poison + Spread' } },
    holy:      { icon:'✝️',  label:'Holy',      tiers:{ 1:'+3 regen/item',    2:'+10% healing', 3:'+20% healing + Cleanse' } },
    dark:      { icon:'💀', label:'Dark',      tiers:{ 1:'+2% lifesteal/item', 2:'+5% lifesteal', 3:'+10% lifesteal + ATK Debuff' } },
  };
  let synCounts = calculateSynergyCounts();
  let synEl = document.getElementById('equip-synergy-bonuses');
  let hasAnySyn = Object.values(synCounts).some(c => c > 0);
  if (!hasAnySyn) {
    synEl.style.display = 'none';
  } else {
    let synHtml = '<div class="set-bonuses-title">TYPE SYNERGIES</div>';
    for (let [dtype, count] of Object.entries(synCounts)) {
      if (count < 1) continue;
      let def = SYN_DEFS[dtype];
      if (!def) continue;
      synHtml += `<div class="set-bonus-group">`;
      synHtml += `<div class="set-bonus-name">${def.icon} ${def.label} <span class="set-piece-count">(${count}/3)</span></div>`;
      for (let tier of [1, 2, 3]) {
        let active = count >= tier;
        synHtml += `<div class="set-bonus-tier ${active ? 'set-bonus-active' : 'set-bonus-inactive'}">`;
        synHtml += `<span class="set-tier-badge">${tier}pc</span> ${def.tiers[tier]}`;
        synHtml += `</div>`;
      }
      synHtml += `</div>`;
    }
    synEl.innerHTML = synHtml;
    synEl.style.display = 'block';
  }
}

function clickEquipSlot(slotName) {
  if (slotName === 'SECONDARY_HAND' && !(game.player.learnedSkills || []).includes('dual_wield')) {
    toast('Learn Dual Wield to use this slot!', 'red');
    return;
  }
  if (game.equipped[slotName]) {
    unequipSlot(slotName);
  } else {
    showEquipPicker(slotName);
  }
}

function showEquipPicker(slotName) {
  // SECONDARY_HAND accepts the same weapons as MAIN_HAND
  let filterSlot = slotName === 'SECONDARY_HAND' ? 'MAIN_HAND' : slotName;
  let hasItems = game.inventory.some(id => itemDefs[id] && itemDefs[id].slot === filterSlot);
  if (!hasItems) { toast(`No items for ${EQUIP_SLOT_LABELS[slotName]}`, ''); return; }
  document.getElementById('equip-picker-title').textContent = `EQUIP ${EQUIP_SLOT_LABELS[slotName]}`;
  let container = document.getElementById('equip-picker-items');
  container.innerHTML = '';
  game.inventory.forEach((itemId, idx) => {
    let item = itemDefs[itemId];
    if (!item || item.slot !== filterSlot) return;
    let canEquip = canEquipItem(itemId);
    let div = document.createElement('div');
    div.className = 'equip-picker-item' + (canEquip ? '' : ' equip-picker-locked');
    let info = rarityInfo(itemId);
    let lockBadge = canEquip ? '' : ' 🔒';
    div.innerHTML = `<div class="equip-picker-item-icon">${item.icon}</div><div class="equip-picker-item-name" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}${lockBadge}</div><div class="equip-picker-item-stat">${itemStatText(item)}</div>`;
    if (canEquip) {
      div.onclick = () => { equipFromInventory(idx, slotName); closeEquipPicker(); renderEquipScreen(); };
    }
    attachTooltip(div, itemId);
    container.appendChild(div);
  });
  document.getElementById('equip-picker').style.display = 'block';
}

function closeEquipPicker() {
  let el = document.getElementById('equip-picker');
  if (el) el.style.display = 'none';
}

function applyItemStats(item, sign) {
  game.player.atk += (item.atk || 0) * sign;
  game.player.def += (item.def || 0) * sign;
  if (item.intBonus) game.player.INT = Math.max(10, (game.player.INT || 10) + item.intBonus * sign);
  if (item.magicDamage) game.player.atk += item.magicDamage * sign;
  if (item.statBonuses) {
    for (let [stat, val] of Object.entries(item.statBonuses)) {
      game.player[stat] = (game.player[stat] || 10) + val * sign;
      if (stat === 'CON') recalcMaxHp();
    }
  }
  if (item.allStatsBonus) {
    for (let stat of ['STR','DEX','CON','INT','WIS','CHA']) game.player[stat] = (game.player[stat] || 10) + item.allStatsBonus * sign;
    recalcMaxHp();
  }
}

function equipFromInventory(invIndex, slotName) {
  let itemId = game.inventory[invIndex];
  if (!itemId || !itemDefs[itemId]) return;
  let item = itemDefs[itemId];
  if (!canEquipItem(itemId)) {
    let cls = CLASS_DEFS[game.player.class || 'warrior'];
    let clsName = cls ? cls.name + 's' : 'Your class';
    toast(`${clsName} cannot equip ${item.name}!`, 'red');
    return;
  }
  let eq = game.equipped;
  if (eq[slotName]) {
    let old = itemDefs[eq[slotName]];
    if (old) applyItemStats(old, -1);
    addInventoryItem(eq[slotName]);
  }
  removeInventoryItem(invIndex);
  eq[slotName] = itemId;
  applyItemStats(item, 1);
  recalcSetBonuses();
  toast(`Equipped ${item.name}`, 'green');
  msg(`Equipped ${item.name}.`);
  saveGame();
}

function unequipSlot(slotName) {
  let eq = game.equipped;
  if (!eq[slotName]) return;
  let itemId = eq[slotName];
  let item = itemDefs[itemId];
  if (item) applyItemStats(item, -1);
  addInventoryItem(itemId);
  eq[slotName] = null;
  recalcSetBonuses();
  toast(`Unequipped ${item ? item.name : itemId}`, '');
  msg(`Unequipped ${item ? item.name : itemId}.`);
  saveGame();
  if (document.getElementById('inventory-screen').style.display === 'flex') {
    renderInventoryScreen();
  }
}
