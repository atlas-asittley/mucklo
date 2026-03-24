// ui_panels.js — All screen open/close functions: shop variants (9 vendors), stats screen,
// trainer (stat upgrades + skill learning), sparring selection, and class select.
// Also contains shared item/rarity helpers, item tooltip system (buildTooltipHTML,
// showTooltip, attachTooltip, setTooltipHandlers), and the passiveText formatter.
// Depends on: constants.js, state.js, data.js, combat_mechanics.js (recalcMaxHp), ui_hud.js (saveGame, toast).

// ─── DAMAGE TYPE ICONS ────────────────────────────────────────────────────────
const DAMAGE_TYPE_ICON_MAP = {
  fire:      { symbol: '▲', color: '#ff4500' },
  ice:       { symbol: '◆', color: '#88ccff' },
  lightning: { symbol: '↯', color: '#ffee00' },
  poison:    { symbol: '◉', color: '#44bb44' },
  holy:      { symbol: '✚', color: '#ffdd66' },
  dark:      { symbol: '◈', color: '#aa44dd' },
};

function damageTypeIcon(damageType) {
  let info = DAMAGE_TYPE_ICON_MAP[damageType];
  if (!info) return '';
  return `<span class="type-icon" style="color:${info.color};font-size:7px;margin-right:2px" title="${damageType}">${info.symbol}</span>`;
}

// ─── RARITY HELPERS ───────────────────────────────────────────────────────────
function rarityInfo(itemId) {
  let r = (itemDefs[itemId] || {}).rarity || 'common';
  return RARITY[r] || RARITY.common;
}

function rarityNameSpan(itemId) {
  let info = rarityInfo(itemId);
  let badge = info.badge ? info.badge + ' ' : '';
  return `<span style="color:${info.color}">${badge}${itemDefs[itemId].name}</span>`;
}

function raritySubline(itemId) {
  let info = rarityInfo(itemId);
  return `<div class="item-rarity" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${info.label}</div>`;
}

// ─── ITEM STAT TEXT ───────────────────────────────────────────────────────────
// Returns a stat summary string for an item (e.g. "ATK +7", "DEF +5", "+25 HP").
function itemStatText(item) {
  if (item.type === 'weapon') { let s = `ATK +${item.atk + (item.magicDamage || 0)}`; if (item.intBonus) s += ` INT +${item.intBonus}`; return s; }
  if (item.type === 'armor') {
    let parts = [];
    if (item.atk) parts.push(`ATK +${item.atk}`);
    if (item.def) parts.push(`DEF +${item.def}`);
    if (item.statBonuses) for (let [s, v] of Object.entries(item.statBonuses)) parts.push(`${s} ${v > 0 ? '+' : ''}${v}`);
    if (item.allStatsBonus) parts.push(`+${item.allStatsBonus} ALL`);
    return parts.join(' ') || '';
  }
  if (item.allStats)             return `+${item.allStats} ALL STATS`;
  if (item.type === 'permanent') return `+${item.statBonus} ${item.stat} (perm)`;
  if (item.type === 'special')   return `+${item.goldBonus}g reward`;
  if (item.type === 'training')  return `+${item.statBonus} ${item.stat}`;
  if (item.effect === 'drunk')   return `🍺 Drunk +${item.drunkValue}`;
  if (item.atkBoost)             return `ATK +${item.atkBoost}`;
  return `+${item.heal} HP`;
}

// ─── SHOP ─────────────────────────────────────────────────────────────────────
function getDiscountedPrice(basePrice) {
  let discount = (game.player.CHA || 10) * 0.005;
  return Math.max(1, Math.floor(basePrice * (1 - discount)));
}

// Populates and shows the shop screen. buyFn(itemId) is called when the player buys.
function renderShopItems(items, buyFn) {
  document.getElementById('shop-screen').style.display = 'flex';
  document.getElementById('shop-gold-val').textContent = game.player.gold;
  let container = document.getElementById('shop-items');
  container.innerHTML = '';
  let playerClass = game.player.class || 'warrior';
  for (let itemId of items) {
    let item = itemDefs[itemId];
    let info = rarityInfo(itemId);
    let price = getDiscountedPrice(item.value);
    let canAfford = game.player.gold >= price;
    // Check class restriction: warrior always bypasses; otherwise player must be in the allowed list
    let restricted = item.classRestriction && item.classRestriction.length > 0
      && playerClass !== 'warrior'
      && !item.classRestriction.includes(playerClass);
    let div = document.createElement('div');
    div.className = 'shop-item' + (restricted ? ' shop-item-restricted' : '');
    let discountNote = price < item.value ? `<span class="shop-discount">${item.value}g</span> ` : '';
    let badge = info.badge ? `<span class="shop-rarity-badge" style="color:${info.color}">${info.badge}</span> ` : '';
    let nameColor = restricted ? '#555' : info.color;
    let restrictionLabel = '';
    if (restricted) {
      let classNames = item.classRestriction.map(c => CLASS_DEFS[c] ? CLASS_DEFS[c].name : c).join('/');
      restrictionLabel = ` <span class="shop-class-restriction">${classNames} Only</span>`;
    }
    let typeIco = item.damageType ? damageTypeIcon(item.damageType) : '';
    div.innerHTML = `<div class="shop-item-info"><div class="shop-item-name" style="color:${nameColor}">${item.icon} ${badge}${typeIco}${item.name}${restrictionLabel}</div><div class="shop-item-stat">${itemStatText(item)} <span class="shop-rarity-label" style="color:${nameColor}">[${info.label}]</span></div></div><div class="shop-item-price ${canAfford?'':'cant-afford'}">${discountNote}${price}g</div>`;
    div.onclick = () => buyFn(itemId);
    attachTooltip(div, itemId);
    container.appendChild(div);
  }
}

function openShop()        { renderShopItems(shopItems,       buyItem);        }
function openElvenShop()   { renderShopItems(elvenShopItems,   buyElvenItem);   }
function openSilverforge() { renderShopItems(silverforgeItems, buySilverforge); }
function openLorekeeper()  { renderShopItems(lorekeeperItems,  buyLorekeeper);  }
function openHerbalist()   { renderShopItems(herbalistItems,   buyHerbalist);   }
function openBowyer()      { renderShopItems(bowyerItems,      buyBowyer);      }
function openArmory()      { renderShopItems(armoryItems,      buyArmory);      }
function openWarGoods()    { renderShopItems(warGoodsItems,    buyWarGoods);    }
function openSteveBar()    { renderShopItems(steveBarItems,    buySteveBar);    }
function openFireShop()    { renderShopItems(fireShopItems,    buyFireShop);    }
function openIceShop()     { renderShopItems(iceShopItems,     buyIceShop);     }
function openShadowShop()  { renderShopItems(shadowShopItems,  buyShadowShop);  }
function openDwarfShop()   { renderShopItems(dwarfShopItems,   buyDwarfShop);   }
function openHolyShop()    { renderShopItems(holyShopItems,    buyHolyShop);    }
function openVoidShop()       { renderShopItems(voidEmporiumItems, buyVoidShop);       }
function openSunkenShop()     { renderShopItems(sunkenShopItems,  buySunkenShop);     }
function openBrimstoneShop()  { renderShopItems(brimstoneItems,   buyBrimstoneShop);  }
function closeShop() { document.getElementById('shop-screen').style.display = 'none'; }

// Shared purchase logic: deducts gold, adds item, then reopens the appropriate shop.
function buyFrom(itemId, reopenFn) {
  let item = itemDefs[itemId];
  let price = getDiscountedPrice(item.value);
  if (game.player.gold < price) { toast('Not enough gold!', 'red'); return; }
  game.player.gold -= price;
  addInventoryItem(itemId);
  toast(`Bought ${item.name}`, 'green');
  msg(`Bought ${item.name} for ${price}g`);
  reopenFn();
  saveGame();
}

function buyItem(itemId)       { buyFrom(itemId, openShop);        }
function buyElvenItem(itemId)  { buyFrom(itemId, openElvenShop);   }
function buySilverforge(itemId){ buyFrom(itemId, openSilverforge); }
function buyLorekeeper(itemId) { buyFrom(itemId, openLorekeeper);  }
function buyHerbalist(itemId)  { buyFrom(itemId, openHerbalist);   }
function buyBowyer(itemId) {
  // Archery training goes straight to stat boost, not inventory
  if (itemId === 'archery_training') {
    let item = itemDefs[itemId];
    let price = getDiscountedPrice(item.value);
    if (game.player.gold < price) { toast('Not enough gold!', 'red'); return; }
    game.player.gold -= price;
    game.player[item.stat] = (game.player[item.stat] || 10) + item.statBonus;
    toast(`DEX +${item.statBonus}! You feel sharper.`, 'green');
    msg(`You practice archery under Fenrath's watchful eye. DEX increased to ${game.player.DEX}!`);
    closeShop();
    saveGame();
  } else {
    buyFrom(itemId, openBowyer);
  }
}
function buyArmory(itemId)   { buyFrom(itemId, openArmory);   }
function buyWarGoods(itemId) { buyFrom(itemId, openWarGoods); }
function buySteveBar(itemId) { buyFrom(itemId, openSteveBar); }
function buyFireShop(itemId)   { buyFrom(itemId, openFireShop);   }
function buyIceShop(itemId)    { buyFrom(itemId, openIceShop);    }
function buyShadowShop(itemId) { buyFrom(itemId, openShadowShop); }
function buyDwarfShop(itemId)  { buyFrom(itemId, openDwarfShop);  }
function buyHolyShop(itemId)   { buyFrom(itemId, openHolyShop);   }
function buyVoidShop(itemId)      { buyFrom(itemId, openVoidShop);      }
function buySunkenShop(itemId)    { buyFrom(itemId, openSunkenShop);    }
function buyBrimstoneShop(itemId) { buyFrom(itemId, openBrimstoneShop); }

// ─── STATS SCREEN ─────────────────────────────────────────────────────────────
function openStats() {
  document.getElementById('stats-screen').style.display = 'flex';
  let p = game.player;
  let strBonus = Math.floor((p.STR || 10) / 2);
  let baseDmg = p.atk + strBonus;
  let dodgePct = ((p.DEX || 10) * 0.5).toFixed(1);
  let critPct = ((p.DEX || 10) * 0.3).toFixed(1);
  let xpMult = (1 + (p.INT || 10) * 0.02).toFixed(2);
  let chaDisc = ((p.CHA || 10) * 0.5).toFixed(1);
  let wisBonus = (p.WIS || 10);
  let allSlots = ['MAIN_HAND','OFF_HAND','HEAD','CHEST','HANDS','FEET','RING','AMULET'];
  let equippedRows = allSlots.map(slot => {
    let id = game.equipped[slot];
    if (!id || !itemDefs[id]) return '';
    let it = itemDefs[id];
    let note = it.atk ? `ATK +${it.atk}` : it.def ? `DEF +${it.def}` : '';
    return `<div class="derived-row"><span class="derived-label">${slot.replace('_',' ')}</span><span class="derived-val">${it.name}${note ? ` <span class="derived-note">(${note})</span>` : ''}</span></div>`;
  }).filter(Boolean).join('');
  if (!equippedRows) equippedRows = '<div class="derived-row"><span class="derived-label" style="color:#333">NONE</span><span class="derived-val" style="color:#222">Nothing equipped</span></div>';
  let xpPct = Math.floor(p.xp / p.xpNext * 100);
  let clsDef = p.class ? CLASS_DEFS[p.class] : null;
  let clsLine = clsDef ? `<div class="derived-row"><span class="derived-label">CLASS</span><span class="derived-val">${clsDef.icon} ${clsDef.name}</span></div>` : '';
  document.getElementById('stats-content').innerHTML = `
    <div class="stats-section">
      <div class="stats-section-title">CHARACTER</div>
      <div class="stats-derived">
        ${clsLine}
        <div class="derived-row"><span class="derived-label">LEVEL</span><span class="derived-val">${p.lvl}</span></div>
        <div class="derived-row"><span class="derived-label">XP</span><span class="derived-val">${p.xp} / ${p.xpNext} (${xpPct}%)</span></div>
        <div class="derived-row"><span class="derived-label">KILLS</span><span class="derived-val">${game.kills}</span></div>
        <div class="derived-row"><span class="derived-label">SKILL PTS</span><span class="derived-val${(p.skillPoints||0)>0?' skill-pts-available':''}">${p.skillPoints||0}</span></div>
      </div>
    </div>
    <div class="stats-section">
      <div class="stats-section-title">BASE STATS <span class="stats-hint">tap to expand</span></div>
      <div class="stats-grid">
        <div class="stat-row stat-clickable" onclick="toggleStatDesc('str')"><span class="stat-label stat-str">STR</span><span class="stat-num">${p.STR}</span><span class="stat-desc">Physical Power</span><span class="stat-row-caret">▾</span></div>
        <div class="stat-detail" id="stat-detail-str"><div class="stat-detail-text">Increases physical damage. Each point adds 0.5 to your base attack power.</div><div class="stat-detail-derived">Current: +${Math.floor((p.STR||10)/2)} ATK from STR</div></div>
        <div class="stat-row stat-clickable" onclick="toggleStatDesc('dex')"><span class="stat-label stat-dex">DEX</span><span class="stat-num">${p.DEX}</span><span class="stat-desc">Agility</span><span class="stat-row-caret">▾</span></div>
        <div class="stat-detail" id="stat-detail-dex"><div class="stat-detail-text">Increases dodge chance (0.5% per point) and critical hit chance (0.3% per point).</div><div class="stat-detail-derived">Current: ${dodgePct}% dodge / ${critPct}% crit</div></div>
        <div class="stat-row stat-clickable" onclick="toggleStatDesc('con')"><span class="stat-label stat-con">CON</span><span class="stat-num">${p.CON}</span><span class="stat-desc">Vitality</span><span class="stat-row-caret">▾</span></div>
        <div class="stat-detail" id="stat-detail-con"><div class="stat-detail-text">Increases max HP. Each point adds 5 to your maximum health.</div><div class="stat-detail-derived">Current: +${(p.CON||10)*5} max HP from CON</div></div>
        <div class="stat-row stat-clickable" onclick="toggleStatDesc('int')"><span class="stat-label stat-int">INT</span><span class="stat-num">${p.INT}</span><span class="stat-desc">Intellect</span><span class="stat-row-caret">▾</span></div>
        <div class="stat-detail" id="stat-detail-int"><div class="stat-detail-text">Increases XP gain. Each point gives 2% bonus experience from enemies.</div><div class="stat-detail-derived">Current: ×${xpMult} XP multiplier</div></div>
        <div class="stat-row stat-clickable" onclick="toggleStatDesc('wis')"><span class="stat-label stat-wis">WIS</span><span class="stat-num">${p.WIS}</span><span class="stat-desc">Wisdom</span><span class="stat-row-caret">▾</span></div>
        <div class="stat-detail" id="stat-detail-wis"><div class="stat-detail-text">Increases healing effectiveness. Each point adds 1 extra HP when using potions.</div><div class="stat-detail-derived">Current: +${p.WIS||10} HP per potion</div></div>
        <div class="stat-row stat-clickable" onclick="toggleStatDesc('cha')"><span class="stat-label stat-cha">CHA</span><span class="stat-num">${p.CHA}</span><span class="stat-desc">Charisma</span><span class="stat-row-caret">▾</span></div>
        <div class="stat-detail" id="stat-detail-cha"><div class="stat-detail-text">Decreases shop prices. Each point gives 0.5% discount at the shop.</div><div class="stat-detail-derived">Current: ${chaDisc}% shop discount</div></div>
      </div>
    </div>
    <div class="stats-section">
      <div class="stats-section-title">DERIVED STATS</div>
      <div class="stats-derived">
        <div class="derived-row"><span class="derived-label">ATK POWER</span><span class="derived-val">${baseDmg} <span class="derived-note">(ATK ${p.atk} + STR/2 ${strBonus})</span></span></div>
        <div class="derived-row"><span class="derived-label">MAX HP</span><span class="derived-val">${p.maxHp} <span class="derived-note">(100 + CON×5)</span></span></div>
        <div class="derived-row"><span class="derived-label">DODGE</span><span class="derived-val">${dodgePct}%</span></div>
        <div class="derived-row"><span class="derived-label">CRIT CHANCE</span><span class="derived-val">${critPct}%</span></div>
        <div class="derived-row"><span class="derived-label">XP BONUS</span><span class="derived-val">×${xpMult}</span></div>
        <div class="derived-row"><span class="derived-label">HEAL BONUS</span><span class="derived-val">+${wisBonus} HP</span></div>
        <div class="derived-row"><span class="derived-label">SHOP DISCOUNT</span><span class="derived-val">${chaDisc}%</span></div>
      </div>
    </div>
    <div class="stats-section">
      <div class="stats-section-title">EQUIPMENT</div>
      <div class="stats-derived">
        ${equippedRows}
        <div class="derived-row" style="margin-top:4px;border-top:1px solid #111128;padding-top:4px"><span class="derived-label">TOTAL ATK</span><span class="derived-val">${p.atk}</span></div>
        <div class="derived-row"><span class="derived-label">TOTAL DEF</span><span class="derived-val">${p.def}</span></div>
      </div>
    </div>`;
}

function closeStats() { document.getElementById('stats-screen').style.display = 'none'; }

function toggleStatDesc(stat) {
  let target = document.getElementById('stat-detail-' + stat);
  let wasOpen = target.classList.contains('open');
  document.querySelectorAll('.stat-detail').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.stat-clickable').forEach(r => r.classList.remove('expanded'));
  if (!wasOpen) {
    target.classList.add('open');
    target.previousElementSibling.classList.add('expanded');
  }
}

// ─── TRAINER ──────────────────────────────────────────────────────────────────
let trainerTab = 'stats';

function openTrainer() {
  trainerTab = 'stats';
  document.getElementById('trainer-screen').style.display = 'flex';
  renderTrainerTabs();
}

function renderTrainerTabs() {
  document.getElementById('trainer-tab-stats').classList.toggle('trainer-tab-active', trainerTab === 'stats');
  document.getElementById('trainer-tab-skills').classList.toggle('trainer-tab-active', trainerTab === 'skills');
  document.getElementById('trainer-stats-panel').style.display = trainerTab === 'stats' ? 'block' : 'none';
  document.getElementById('trainer-skills-panel').style.display = trainerTab === 'skills' ? 'block' : 'none';
  document.getElementById('trainer-points-val').textContent = game.player.skillPoints || 0;
  if (trainerTab === 'stats') renderTrainer();
  else renderLearnSkills();
}

function switchTrainerTab(tab) {
  trainerTab = tab;
  renderTrainerTabs();
}

function renderTrainer() {
  let p = game.player;
  let stats = ['STR','DEX','CON','INT','WIS','CHA'];
  let descs = { STR:'Power (+ATK)', DEX:'Agility (+Dodge/Crit)', CON:'Vitality (+5 MaxHP)', INT:'Intellect (+XP gain)', WIS:'Wisdom (+Heal bonus)', CHA:'Charisma (+Shop disc)' };
  let container = document.getElementById('trainer-stats');
  container.innerHTML = '';
  for (let stat of stats) {
    let canBuy = (p.skillPoints || 0) > 0;
    let div = document.createElement('div');
    div.className = 'trainer-stat-row';
    div.innerHTML = `<span class="stat-label stat-${stat.toLowerCase()}">${stat}</span><span class="trainer-stat-val">${p[stat]}</span><span class="trainer-stat-desc">${descs[stat]}</span><button class="trainer-btn${canBuy?'':' trainer-btn-disabled'}" onclick="trainStat('${stat}')"${canBuy?'':' disabled'}>+ 1</button>`;
    container.appendChild(div);
  }
}

function renderLearnSkills() {
  let p = game.player;
  let learned = p.learnedSkills || [];
  let container = document.getElementById('trainer-skills');
  container.innerHTML = '';
  for (let [skillId, skill] of Object.entries(skillDefs)) {
    if (skillId === 'cheat_god_mode') continue;
    if (skill.classRestriction && !skill.classRestriction.includes(p.class || 'warrior')) continue;
    let isLearned = learned.includes(skillId);
    let reqEntries = Object.entries(skill.req);
    let [reqStat, reqVal] = reqEntries.length > 0 ? reqEntries[0] : [null, 0];
    let meetsReq = !reqStat || (p[reqStat] || 0) >= reqVal;
    let canAfford = (p.skillPoints || 0) >= skill.cost;
    let div = document.createElement('div');
    div.className = 'skill-learn-row' + (isLearned ? ' skill-learned' : '');
    let passiveTag = skill.passive ? `<span class="skill-passive-badge">PASSIVE</span>` : '';
    let statusBtn = isLearned
      ? `<span class="skill-learned-badge">LEARNED</span>`
      : `<button class="trainer-btn${(meetsReq && canAfford) ? '' : ' trainer-btn-disabled'}" onclick="learnSkill('${skillId}')"${(meetsReq && canAfford) ? '' : ' disabled'}>${skill.cost} SP</button>`;
    let reqColor = meetsReq ? '#70a0e0' : '#664444';
    let reqLine = reqStat ? `Req: ${reqStat} ${reqVal} (yours: ${p[reqStat]||10})` : 'No requirements';
    div.innerHTML = `<span class="skill-icon">${skill.icon}</span><div class="skill-learn-info"><div class="skill-learn-name">${skill.name}${passiveTag}</div><div class="skill-learn-desc">${skill.desc}</div><div class="skill-learn-req" style="color:${reqColor}">${reqLine}</div></div>${statusBtn}`;
    container.appendChild(div);
  }
}

function closeTrainer() { document.getElementById('trainer-screen').style.display = 'none'; }

function trainStat(stat) {
  if ((game.player.skillPoints || 0) <= 0) return;
  game.player.skillPoints--;
  game.player[stat]++;
  if (stat === 'CON') recalcMaxHp();
  if (stat === 'INT') recalcMaxMana();
  toast(`${stat} increased to ${game.player[stat]}!`, 'green');
  msg(`Trained ${stat}! Now ${stat} ${game.player[stat]}.`);
  renderTrainerTabs();
  saveGame();
}

function learnSkill(skillId) {
  let p = game.player;
  let skill = skillDefs[skillId];
  if (!skill) return;
  if ((p.learnedSkills || []).includes(skillId)) return;
  let reqEntries = Object.entries(skill.req);
  if (reqEntries.length > 0) {
    let [reqStat, reqVal] = reqEntries[0];
    if ((p[reqStat] || 0) < reqVal) { toast(`Need ${reqStat} ${reqVal} to learn ${skill.name}!`, 'red'); return; }
  }
  if ((p.skillPoints || 0) < skill.cost) { toast('Not enough skill points!', 'red'); return; }
  p.skillPoints -= skill.cost;
  if (!p.learnedSkills) p.learnedSkills = [];
  p.learnedSkills.push(skillId);
  toast(`Learned ${skill.name}!`, 'green');
  msg(`You learned ${skill.name}!`);
  renderTrainerTabs();
  saveGame();
}

// ─── SPARRING ─────────────────────────────────────────────────────────────────
function openSparring() {
  document.getElementById('sparring-screen').style.display = 'flex';
  let container = document.getElementById('sparring-opponents');
  container.innerHTML = '';
  for (let opp of sparringOpponents) {
    let div = document.createElement('div');
    div.className = 'sparring-opp';
    div.innerHTML = `<div class="sparring-opp-header"><span class="sparring-opp-name">${opp.name}</span><span class="sparring-badge sparring-badge-${opp.label.toLowerCase()}">${opp.label}</span></div><div class="sparring-opp-stats">HP ${opp.hp} &nbsp;·&nbsp; ATK ${opp.atk} &nbsp;·&nbsp; DEF ${opp.def}</div><div class="sparring-opp-reward">XP awarded &nbsp;·&nbsp; No death penalty</div>`;
    div.onclick = () => { closeSparring(); startSparring(opp); };
    container.appendChild(div);
  }
}

function closeSparring() { document.getElementById('sparring-screen').style.display = 'none'; }

// ─── CLASS SELECT ─────────────────────────────────────────────────────────────
function openClassSelect() {
  document.getElementById('class-select-screen').style.display = 'flex';
  let container = document.getElementById('class-select-grid');
  container.innerHTML = '';
  for (let [classId, cls] of Object.entries(CLASS_DEFS)) {
    let div = document.createElement('div');
    div.className = 'class-card';
    let statMods = Object.entries(cls.statMods).map(([s, v]) =>
      `<span class="${v > 0 ? 'class-stat-pos' : 'class-stat-neg'}">${s} ${v > 0 ? '+' : ''}${v}</span>`
    ).join('');
    div.innerHTML = `
      <div class="class-card-icon">${cls.icon}</div>
      <div class="class-card-name">${cls.name}</div>
      <div class="class-card-desc">${cls.desc}</div>
      <div class="class-card-stats">${statMods}</div>
      <div class="class-card-equip">${cls.armorTypes} &middot; ${cls.weaponTypes}</div>
    `;
    div.onclick = () => selectClass(classId);
    container.appendChild(div);
  }
}

// ─── ITEM TOOLTIPS ────────────────────────────────────────────────────────────
function buildTooltipHTML(itemId) {
  let item = itemDefs[itemId];
  let info = rarityInfo(itemId);
  let html = `<div class="rarity" style="color:${info.color}">${info.badge ? info.badge + ' ' : ''}${item.name}</div>`;

  // Type and slot
  let typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  if (item.slot) typeLabel += ` \u2014 ${EQUIP_SLOT_LABELS[item.slot] || item.slot}`;
  html += `<div class="tt-type">${typeLabel}</div>`;

  // Stats
  let stats = itemStatText(item);
  if (stats) html += `<div class="stats">${stats}</div>`;

  // Passives
  if (item.passive) {
    let pt = passiveText(item.passive);
    if (pt) html += `<div class="stats">${pt}</div>`;
  }

  // Proc effects
  let procLines = [];
  if (item.whileEquipped && item.whileEquipped.fireDamage) {
    procLines.push(`🔥 +${item.whileEquipped.fireDamage} fire dmg per attack`);
  }
  if (item.onAttack) {
    let effLabel = item.onAttack.effect === 'fireball' ? '🔥 Fireball' : item.onAttack.effect;
    procLines.push(`On Attack (${Math.round(item.onAttack.chance * 100)}%): ${effLabel}`);
  }
  if (item.onHit) {
    let effLabel = item.onHit.heal ? `+${item.onHit.heal} HP` :
                   item.onHit.shield ? `+${item.onHit.shield} Shield` :
                   item.onHit.effect === 'stun' ? '⚡ Stun' :
                   item.onHit.effect === 'poison' ? '☠ Poison' : item.onHit.effect;
    procLines.push(`On Hit (${Math.round(item.onHit.chance * 100)}%): ${effLabel}`);
  }
  if (procLines.length > 0) html += `<div class="stats" style="color:#f0c070">${procLines.join(' · ')}</div>`;

  // Set bonus
  if (item.set && SET_DEFS[item.set]) {
    html += `<div style="color:#f39c12;margin-top:2px">Set: ${SET_DEFS[item.set].name}</div>`;
  }

  // Class restriction
  if (item.classRestriction !== undefined && item.classRestriction !== null) {
    let classLabel = item.classRestriction.length === 0
      ? 'Warriors Only'
      : item.classRestriction.map(c => CLASS_DEFS[c] ? CLASS_DEFS[c].name + 's' : c).join('/') + ' Only';
    html += `<div style="color:#e74c3c;margin-top:2px">${classLabel}</div>`;
  }

  // Description
  if (item.desc) html += `<div class="desc">${item.desc}</div>`;

  // Value / sell price
  let valLine = item.value > 0
    ? `Value: ${item.value}g \u00b7 Sell: ${Math.floor(item.value / 2)}g`
    : 'Unique \u2014 no sell value';
  html += `<div class="tt-value">${valLine}</div>`;
  return html;
}

function showTooltip(itemId, x, y) {
  let item = itemDefs[itemId];
  if (!item) return;
  let tip = document.getElementById('item-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'item-tooltip';
    tip.className = 'tooltip';
    document.body.appendChild(tip);
  }
  tip.innerHTML = buildTooltipHTML(itemId);
  let tx = x + 14, ty = y + 14;
  if (tx + 220 > window.innerWidth)  tx = x - 220 - 4;
  if (ty + 240 > window.innerHeight) ty = y - 240 - 4;
  tip.style.left = Math.max(4, tx) + 'px';
  tip.style.top  = Math.max(4, ty) + 'px';
  tip.style.display = 'block';
}

function hideTooltip() {
  let tip = document.getElementById('item-tooltip');
  if (tip) tip.style.display = 'none';
}

// For fresh (newly created) item divs — uses addEventListener (safe, no accumulation).
// Press-and-hold (300ms) shows tooltip; release hides it. Short tap executes item action normally.
function attachTooltip(el, itemId) {
  let holdTimer = null;
  let tooltipActive = false;

  function startHold(x, y) {
    holdTimer = setTimeout(() => {
      showTooltip(itemId, x, y);
      tooltipActive = true;
      holdTimer = null;
    }, 300);
  }

  function cancelHold() {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
  }

  el.addEventListener('mousedown', e => { e.stopPropagation(); startHold(e.clientX, e.clientY); });
  el.addEventListener('mouseup', e => {
    if (tooltipActive) { hideTooltip(); tooltipActive = false; e.preventDefault(); }
    else cancelHold();
  });
  el.addEventListener('mouseout', () => { cancelHold(); if (tooltipActive) { hideTooltip(); tooltipActive = false; } });
  el.addEventListener('touchstart', e => { e.stopPropagation(); startHold(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  el.addEventListener('touchend', e => {
    if (tooltipActive) { hideTooltip(); tooltipActive = false; e.preventDefault(); }
    else cancelHold();
  });
  el.addEventListener('touchcancel', () => { cancelHold(); hideTooltip(); tooltipActive = false; });
}

// For persistent DOM elements that are re-rendered (e.g. equip slots) — overwrites handlers.
// Press-and-hold (300ms) shows tooltip; release hides it. Short tap executes item action normally.
function setTooltipHandlers(el, itemId) {
  let holdTimer = null;
  let tooltipActive = false;

  el.onmousedown = e => {
    e.stopPropagation();
    holdTimer = setTimeout(() => {
      showTooltip(itemId, e.clientX, e.clientY);
      tooltipActive = true;
      holdTimer = null;
    }, 300);
  };
  el.onmouseup = e => {
    if (tooltipActive) { hideTooltip(); tooltipActive = false; e.preventDefault(); }
    else if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
  };
  el.onmouseout = () => {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (tooltipActive) { hideTooltip(); tooltipActive = false; }
  };
  el.ontouchstart = e => {
    e.stopPropagation();
    let x = e.touches[0].clientX, y = e.touches[0].clientY;
    holdTimer = setTimeout(() => {
      showTooltip(itemId, x, y);
      tooltipActive = true;
      holdTimer = null;
    }, 300);
  };
  el.ontouchend = e => {
    if (tooltipActive) { hideTooltip(); tooltipActive = false; e.preventDefault(); }
    else if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
  };
}

function clearTooltipHandlers(el) {
  el.onmousedown = null; el.onmouseup = null; el.onmouseout = null;
  el.ontouchstart = null; el.ontouchend = null; el.ontouchcancel = null;
}

function selectClass(classId) {
  let cls = CLASS_DEFS[classId];
  if (!cls) return;
  let p = game.player;
  p.class = classId;
  // Apply stat modifiers (base 10 + delta)
  let allStats = ['STR','DEX','CON','INT','WIS','CHA'];
  for (let stat of allStats) {
    p[stat] = 10 + (cls.statMods[stat] || 0);
  }
  // Store class HP anchor for recalcMaxHp
  p.classBaseHp  = cls.startHp;
  p.classBaseCon = 10 + (cls.statMods.CON || 0);
  // Set starting combat stats
  p.atk = cls.startAtk;
  p.def = cls.startDef;
  p.maxHp = cls.startHp;
  p.hp    = cls.startHp;
  // Set starting mana
  p.maxMana = cls.baseMana + (p.INT || 10) * cls.manaPerInt;
  p.mana    = p.maxMana;
  // Starting skills
  p.learnedSkills = [...cls.startSkills];
  // If dual_wield is no longer available after class reset, unequip SECONDARY_HAND
  if (!p.learnedSkills.includes('dual_wield') && game.equipped.SECONDARY_HAND) {
    unequipSlot('SECONDARY_HAND');
  }
  document.getElementById('class-select-screen').style.display = 'none';
  saveGame();
  toast(`${cls.icon} ${cls.name} chosen!`, 'green');
  msg(`You are a ${cls.name}! ${cls.desc}`);
}
