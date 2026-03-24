// ui_inventory.js — Unified inventory screen: tab switching, rarity filter, item list,
// item use (consumables, permanents, specials, drunk drinks), sell/lock, and combat item select.
// Equipment screen, paper doll, equip/unequip, and set bonuses are in ui_equipment.js.
// Depends on: constants.js, state.js, data.js, combat_mechanics.js (recalcMaxHp),
//             ui_hud.js (saveGame, toast), ui_panels.js (rarityInfo, raritySubline, itemStatText),
//             ui_equipment.js (renderEquippedTab, equipFromInventory, unequipSlot, EQUIP_SLOT_LABELS).

// ─── CLASS RESTRICTION ────────────────────────────────────────────────────────
// Returns true if the player's class can equip this item.
// Warriors bypass all restrictions. classRestriction:[] means warrior only.
function canEquipItem(itemId) {
  let item = itemDefs[itemId];
  if (!item) return false;
  let playerClass = game.player.class || 'warrior';
  if (playerClass === 'warrior') return true;
  let restriction = item.classRestriction;
  if (restriction === undefined || restriction === null) return true;
  return restriction.includes(playerClass);
}

// ─── PASSIVE HELPERS ──────────────────────────────────────────────────────────
const PASSIVE_LABELS = {
  poison:          (v) => `Poison ${v}/turn`,
  burn:            (v) => `Burn ${v}/turn`,
  thorns:          (v) => `Thorns ${v} dmg`,
  reflect:         (v) => `Reflect ${v} dmg`,
  regen:           (v) => `Regen +${v} HP/turn`,
  lifesteal:       (v) => `Lifesteal ${v}%`,
  dodge:           (v) => `+${v}% Dodge`,
  crit:            (v) => `+${v}% Crit`,
  freeze:          (v) => `Freeze ${v}%`,
  xpBonus:         (v) => `+${v}% XP`,
  postcombat_heal: (v) => `Heal +${v} after battle`,
};

function passiveText(passive) {
  if (!passive) return '';
  return Object.entries(passive).map(([k, v]) => PASSIVE_LABELS[k] ? PASSIVE_LABELS[k](v) : `${k}: ${v}`).join(' · ');
}

// ─── INVENTORY FILTER ─────────────────────────────────────────────────────────
let invRarityFilter = null;

function setInvFilter(rarity) {
  invRarityFilter = invRarityFilter === rarity ? null : rarity;
  renderAllTab();
}

function renderInvFilter() {
  let bar = document.getElementById('inv-rarity-filter');
  if (!bar) return;
  bar.innerHTML = Object.entries(RARITY).map(([key, info]) => {
    let active = invRarityFilter === key;
    let style = `color:${info.color};border-color:${active ? info.color : '#1e2a4a'};background:${active ? 'rgba(0,0,0,0.5)' : ''}`;
    return `<button class="inv-filter-btn" style="${style}" onclick="setInvFilter('${key}')">${info.badge || '○'} ${info.label}</button>`;
  }).join('');
}

// ─── UNIFIED INVENTORY ────────────────────────────────────────────────────────
let inventoryTab = 'equipped';

function openInventory() {
  document.getElementById('inventory-screen').style.display = 'flex';
  // In combat item select mode, jump straight to items tab
  if (combatItemSelectMode) {
    inventoryTab = 'items';
  }
  renderInventoryScreen();
}

function closeInventory() {
  combatItemSelectMode = false;
  document.getElementById('inventory-screen').style.display = 'none';
}

function switchInventoryTab(tab) {
  inventoryTab = tab;
  renderInventoryScreen();
}

function renderInventoryScreen() {
  // Update tab buttons
  for (let t of ['equipped', 'items', 'all']) {
    let btn = document.getElementById('inv-tab-btn-' + t);
    let panel = document.getElementById('inv-panel-' + t);
    if (btn) btn.classList.toggle('inv-tab-active', t === inventoryTab);
    if (panel) panel.style.display = t === inventoryTab ? '' : 'none';
  }
  if (inventoryTab === 'equipped') renderEquippedTab();
  else if (inventoryTab === 'items') renderItemsTab();
  else renderAllTab();
}

// renderEquippedTab — see ui_equipment.js

function renderItemsTab() {
  let grid = document.getElementById('inv-grid-items');
  if (!grid) return;
  grid.innerHTML = '';
  let hasItems = false;
  for (let i = 0; i < game.inventory.length; i++) {
    let itemId = game.inventory[i];
    let item = itemDefs[itemId];
    if (!item || item.slot) continue; // skip equipment
    hasItems = true;
    let info = rarityInfo(itemId);
    let div = document.createElement('div');
    div.className = 'inv-item';
    if (combatItemSelectMode) {
      if (item.type !== 'consumable') {
        // In combat mode, show non-consumables as display only
        div.style.opacity = '0.4';
        div.innerHTML = `<div class="item-icon-wrap">${item.icon}</div><div class="item-name" style="color:${info.color}">${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}</div>${raritySubline(itemId)}<div class="item-stats ${item.type}">${itemStatText(item)}</div>`;
        attachTooltip(div, itemId);
        grid.appendChild(div);
        continue;
      }
      div.innerHTML = `<div class="item-icon-wrap">${item.icon}</div><div class="item-name" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}</div>${raritySubline(itemId)}<div class="item-stats ${item.type}">${itemStatText(item)}</div>`;
      div.onclick = () => useCombatItem(i);
    } else if (item.type === 'material') {
      div.innerHTML = `<div class="item-icon-wrap">${item.icon}</div><div class="item-name" style="color:${info.color}">${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}</div>${raritySubline(itemId)}<div class="item-stats material" style="color:#666">${item.desc || 'Material'}</div>`;
      div.style.cursor = 'default';
    } else {
      let sellPrice = Math.floor((item.value || 0) / 2);
      div.innerHTML = `<div class="item-icon-wrap">${item.icon}</div><div class="item-name" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}</div>${raritySubline(itemId)}<div class="item-stats ${item.type}">${itemStatText(item)}</div><div class="item-sell-price">${sellPrice}g</div><button class="sell-btn" onclick="event.stopPropagation();sellConfirm(${i})">SELL</button>`;
      div.onclick = () => useItem(i);
    }
    attachTooltip(div, itemId);
    grid.appendChild(div);
  }
  if (!hasItems) {
    grid.innerHTML = `<div style="color:#333;padding:20px;font-size:8px;text-align:center">${combatItemSelectMode ? 'NO USABLE ITEMS' : 'NO ITEMS'}</div>`;
  }
}

function renderAllTab() {
  let p = game.player;
  document.getElementById('inv-atk').textContent = p.atk;
  document.getElementById('inv-def').textContent = p.def;
  document.getElementById('inv-weapon').textContent = game.equipped.MAIN_HAND ? itemDefs[game.equipped.MAIN_HAND].name : 'None';
  document.getElementById('inv-armor').textContent = game.equipped.CHEST ? itemDefs[game.equipped.CHEST].name : 'None';
  renderInvFilter();
  let grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  let hasVisible = false;
  // Show equipped items (grayed out with EQUIPPED badge)
  let equippedSlots = Object.entries(game.equipped).filter(([, id]) => id);
  for (let [slotName, itemId] of equippedSlots) {
    let item = itemDefs[itemId];
    if (!item) continue;
    if (invRarityFilter && item.rarity !== invRarityFilter) continue;
    hasVisible = true;
    let info = rarityInfo(itemId);
    let sellPrice = Math.floor((item.value || 0) / 2);
    let div = document.createElement('div');
    div.className = 'inv-item';
    div.style.opacity = '0.5';
    div.style.filter = 'grayscale(40%)';
    div.innerHTML = `<div class="item-icon-wrap">${item.icon}</div><div class="item-name" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}</div>${raritySubline(itemId)}<div class="item-stats ${item.type}">${itemStatText(item)}</div><div class="item-sell-price" style="color:#555">${sellPrice}g</div><div style="color:#4a4;font-size:7px;font-weight:bold;margin-top:2px">✓ EQUIPPED</div>`;
    div.onclick = () => { msg(`${item.name} is already equipped.`); };
    attachTooltip(div, itemId);
    grid.appendChild(div);
  }
  for (let i = 0; i < game.inventory.length; i++) {
    let itemId = game.inventory[i];
    let item = itemDefs[itemId];
    if (invRarityFilter && item.rarity !== invRarityFilter) continue;
    hasVisible = true;
    let info = rarityInfo(itemId);
    let instanceId = (game.inventoryIds || [])[i] || itemId + '_' + i;
    let isLocked = (game.lockedItems || []).includes(instanceId);
    let div = document.createElement('div');
    div.className = 'inv-item';
    if (isLocked) { div.style.opacity = '0.6'; }
    let sellPrice = Math.floor((item.value || 0) / 2);
    let lockBtn = `<button class="lock-btn" onclick="event.stopPropagation();toggleItemLock('${instanceId}')" title="${isLocked ? 'Unlock' : 'Lock'}">${isLocked ? '🔒' : '🔓'}</button>`;
    let sellBtn = isLocked ? `<div class="item-locked-label">LOCKED</div>` : `<button class="sell-btn" onclick="event.stopPropagation();sellConfirm(${i})">SELL</button>`;
    div.innerHTML = `<div class="item-icon-wrap">${item.icon}</div><div class="item-name" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${item.damageType ? damageTypeIcon(item.damageType) : ''}${item.name}</div>${raritySubline(itemId)}<div class="item-stats ${item.type}">${itemStatText(item)}</div><div class="item-sell-price">${sellPrice}g</div>${lockBtn}${sellBtn}`;
    div.onclick = () => { if (!(game.lockedItems || []).includes(instanceId)) useItem(i); };
    attachTooltip(div, itemId);
    grid.appendChild(div);
  }
  if (!hasVisible) grid.innerHTML = `<div style="color:#333;padding:20px;font-size:8px;text-align:center">${invRarityFilter ? 'NO ' + RARITY[invRarityFilter].label.toUpperCase() + ' ITEMS' : 'EMPTY'}</div>`;
  // Sell All button
  let sellAllWrap = document.getElementById('inv-sell-all-wrap');
  if (sellAllWrap) {
    let sellableCount = game.inventory.filter((id, i) => {
      let it = itemDefs[id];
      let instId = (game.inventoryIds || [])[i] || id + '_' + i;
      return it && it.value > 0 && !(game.lockedItems || []).includes(instId);
    }).length;
    sellAllWrap.innerHTML = sellableCount > 0
      ? `<button class="sell-all-btn" onclick="sellAllConfirm()">💰 Sell All (except locked)</button>`
      : `<button class="sell-all-btn sell-all-btn-disabled" disabled>💰 Sell All (except locked)</button>`;
  }
}

function useItem(index) {
  let itemId = game.inventory[index];
  let item = itemDefs[itemId];
  if (item.type === 'weapon' || item.type === 'armor') {
    let slotName = item.slot || (item.type === 'weapon' ? 'MAIN_HAND' : 'CHEST');
    equipFromInventory(index, slotName);
    openInventory();
    return;
  }
  if (item.type === 'consumable') {
    if (item.effect === 'drunk') {
      let drunkAdd = item.drunkValue || 10;
      game.player.drunkLevel = (game.player.drunkLevel || 0) + drunkAdd;
      game.player.drunkStepCounter = game.player.drunkStepCounter || 0;
      removeInventoryItem(index);
      toast(`🍺 Drunk +${drunkAdd}! The world spins...`, 'red');
      msg(`You drink the ${item.name}. Everything starts to wobble. 🍺 Drunk level: ${game.player.drunkLevel}`);
    } else if (item.atkBoost) {
      game.player.atk += item.atkBoost;
      removeInventoryItem(index);
      toast(`ATK +${item.atkBoost}!`, 'green');
      msg(`Used ${item.name}! Attack power +${item.atkBoost}.`);
    } else {
      let healAmt = (item.heal || 0) + (game.player.WIS || 10);
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + healAmt);
      removeInventoryItem(index);
      toast(`+${healAmt} HP`, 'green');
      msg(`Used ${item.name}! +${healAmt} HP`);
    }
  } else if (item.type === 'permanent') {
    let p = game.player;
    if (item.allStats) {
      let stats = ['STR','DEX','CON','INT','WIS','CHA'];
      for (let s of stats) p[s] = (p[s] || 10) + item.allStats;
      recalcMaxHp();
      removeInventoryItem(index);
      toast(`All stats +${item.allStats}!`, 'green');
      msg(`Used ${item.name}! All stats permanently increased by ${item.allStats}.`);
    } else if (item.stat === 'DEF') {
      p.def += item.statBonus;
      removeInventoryItem(index);
      toast(`DEF +${item.statBonus}!`, 'green');
      msg(`Used ${item.name}! DEF permanently increased by ${item.statBonus}.`);
    } else {
      p[item.stat] = (p[item.stat] || 10) + item.statBonus;
      if (item.stat === 'CON') recalcMaxHp();
      removeInventoryItem(index);
      toast(`${item.stat} +${item.statBonus}!`, 'green');
      msg(`Used ${item.name}! ${item.stat} permanently increased by ${item.statBonus}.`);
    }
  } else if (item.type === 'special') {
    if (item.goldBonus) {
      game.player.gold += item.goldBonus;
      toast(`+${item.goldBonus} gold!`, 'green');
      msg(`The Ancient Map reveals hidden treasure! Found ${item.goldBonus} gold.`);
    }
    removeInventoryItem(index);
  }
  openInventory();
  saveGame();
}

// ─── LOCK ─────────────────────────────────────────────────────────────────────
function toggleItemLock(itemId) {
  if (!game.lockedItems) game.lockedItems = [];
  let idx = game.lockedItems.indexOf(itemId);
  if (idx === -1) game.lockedItems.push(itemId);
  else game.lockedItems.splice(idx, 1);
  renderAllTab();
  saveGame();
}

// ─── SELL ─────────────────────────────────────────────────────────────────────
let _sellConfirmIndex = null;

function sellConfirm(index) {
  let item = itemDefs[game.inventory[index]];
  let sellPrice = Math.floor((item.value || 0) / 2);
  _sellConfirmIndex = index;
  document.getElementById('sell-confirm-text').textContent = `Sell ${item.name} for ${sellPrice}g?`;
  document.getElementById('sell-confirm-overlay').classList.add('active');
}

function closeSellConfirm() {
  document.getElementById('sell-confirm-overlay').classList.remove('active');
  _sellConfirmIndex = null;
}

function confirmSell() { sellItem(_sellConfirmIndex); }

function sellItem(index) {
  let itemId = game.inventory[index];
  let item = itemDefs[itemId];
  let sellPrice = Math.floor((item.value || 0) / 2);
  removeInventoryItem(index);
  game.player.gold += sellPrice;
  closeSellConfirm();
  toast(`Sold ${item.name} for ${sellPrice}g`, 'green');
  openInventory();
  saveGame();
}

// ─── SELL ALL ─────────────────────────────────────────────────────────────────
function sellAllConfirm() {
  if (!game.lockedItems) game.lockedItems = [];
  let count = 0, totalGold = 0;
  for (let i = 0; i < game.inventory.length; i++) {
    let itemId = game.inventory[i];
    let item = itemDefs[itemId];
    if (!item || !item.value || item.value === 0) continue;
    let instId = (game.inventoryIds || [])[i] || itemId + '_' + i;
    if (game.lockedItems.includes(instId)) continue;
    count++;
    totalGold += Math.floor(item.value / 2);
  }
  if (count === 0) { toast('Nothing to sell!', ''); return; }
  document.getElementById('sell-all-confirm-text').textContent = `Sell ${count} item${count !== 1 ? 's' : ''} for ${totalGold}g?`;
  document.getElementById('sell-all-confirm-overlay').classList.add('active');
}

function closeSellAllConfirm() {
  document.getElementById('sell-all-confirm-overlay').classList.remove('active');
}

function confirmSellAll() {
  if (!game.lockedItems) game.lockedItems = [];
  let totalGold = 0;
  for (let i = game.inventory.length - 1; i >= 0; i--) {
    let itemId = game.inventory[i];
    let item = itemDefs[itemId];
    if (!item || !item.value || item.value === 0) continue;
    let instId = (game.inventoryIds || [])[i] || itemId + '_' + i;
    if (game.lockedItems.includes(instId)) continue;
    totalGold += Math.floor(item.value / 2);
    removeInventoryItem(i);
  }
  game.player.gold += totalGold;
  closeSellAllConfirm();
  toast(`Sold all for ${totalGold}g!`, 'green');
  openInventory();
  saveGame();
}

// ─── SET BONUSES / EQUIPMENT SCREEN / EQUIP-UNEQUIP ──────────────────────────
// All functions moved to ui_equipment.js (loaded before this file).
