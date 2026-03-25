// data_items.js — Item definitions (weapons, armor, consumables, quest items, boss drops)
// and shop item lists for all vendors.
// Provides: itemDefs, shopItems, elvenShopItems, silverforgeItems, lorekeeperItems,
//           herbalistItems, bowyerItems, armoryItems, warGoodsItems, steveBarItems,
//           fireShopItems, iceShopItems, shadowShopItems, dwarfShopItems, holyShopItems,
//           voidEmporiumItems, sunkenShopItems, brimstoneItems.

const itemDefs = {
  // ── Alcoholic Drinks (Salty Steve's Bar, Rogue's Cove) ───────────────────
  ale:        { name:'Ale',          type:'consumable', effect:'drunk', drunkValue:10, value:8,  icon:'🍺', color:'#9d9d9d', rarity:'common',   desc:"A pint of ale. Drink responsibly." },
  whiskey:    { name:'Whiskey',      type:'consumable', effect:'drunk', drunkValue:25, value:20, icon:'🥃', color:'#2ecc71', rarity:'uncommon', desc:'Strong spirits. Handle with care.' },
  firebrandy: { name:'Fire Brendy',  type:'consumable', effect:'drunk', drunkValue:50, value:45, icon:'🔥', color:'#3498db', rarity:'rare',     desc:'Burning hot dragon brandy. Not for the faint of heart.' },
  // ── Training Grounds Drops ────────────────────────────────────────────────
  ratcatchers_amulet: { name:"Ratcatcher's Amulet", type:'armor', slot:'AMULET', def:0, value:200, icon:'📿', color:'#3498db', rarity:'rare', allStatsBonus:3, desc:'Awarded for ridding the Training Grounds of mice.' },
  rabbit_fur_jacket: { name:'Rabbit Fur Jacket', type:'armor', slot:'CHEST', def:2, value:50, icon:'🛡', color:'#2ecc71', rarity:'uncommon', statBonuses:{DEX:1}, desc:'Made from the finest rabbit furs. Soft and surprisingly protective.' },
  acorn:             { name:'Acorn',              type:'consumable', heal:5,  value:10, icon:'🌰', color:'#9d9d9d', rarity:'common',   desc:'A healthy snack. Restores 5 HP.' },
  feather:           { name:'Feather',            type:'material',           value:4,  icon:'🪶', color:'#9d9d9d', rarity:'common',   desc:'A fine bird feather. Used for arrows.' },
  rat_tail:          { name:'Rat Tail',           type:'material',           value:2,  icon:'🐭', color:'#9d9d9d', rarity:'common',   desc:'Not very useful, but someone might want it.' },
  // ── Common ────────────────────────────────────────────────────────────────
  wooden_sword:  { name:'Wooden Sword',    type:'weapon', slot:'MAIN_HAND', atk:3,  value:0,    icon:'⚔', color:'#9d9d9d', rarity:'common',    classRestriction:['paladin'] },
  cloth_armor:   { name:'Cloth Armor',     type:'armor',  slot:'CHEST',     def:2,  value:0,    icon:'🛡', color:'#9d9d9d', rarity:'common'    },
  hp_potion:     { name:'Health Potion',   type:'consumable', heal:25, value:40,   icon:'⬡', color:'#9d9d9d', rarity:'common'    },
  antidote:      { name:'Antidote',        type:'consumable', heal:10, value:80,   icon:'💧', color:'#9d9d9d', rarity:'common'    },
  torn_cloth:    { name:'Torn Cloth',      type:'armor',  slot:'CHEST',     def:1,  value:20,   icon:'🛡', color:'#9d9d9d', rarity:'common'    },
  rusty_dagger:  { name:'Rusty Dagger',    type:'weapon', slot:'MAIN_HAND', atk:2,  value:32,   icon:'⚔', color:'#9d9d9d', rarity:'common',    classRestriction:['ranger','mage','rogue'] },
  // ── Uncommon ──────────────────────────────────────────────────────────────
  iron_sword:    { name:'Iron Sword',      type:'weapon', slot:'MAIN_HAND', atk:7,  value:120,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  leather_armor: { name:'Leather Armor',   type:'armor',  slot:'CHEST',     def:5,  value:100,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','rogue'] },
  steel_sword:   { name:'Steel Sword',     type:'weapon', slot:'MAIN_HAND', atk:12, value:320,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  chain_mail:    { name:'Chain Mail',      type:'armor',  slot:'CHEST',     def:9,  value:280,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  big_hp_potion: { name:'Big Health Pot',  type:'consumable', heal:60, value:120,  icon:'⬡', color:'#2ecc71', rarity:'uncommon'  },
  mana_potion:   { name:'Mana Potion',     type:'consumable', heal:40, value:80,   icon:'💧', color:'#2ecc71', rarity:'uncommon'  },
  elven_sword:   { name:'Elven Sword',     type:'weapon', slot:'MAIN_HAND', atk:8,  value:480,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  silver_dagger: { name:'Silver Dagger',   type:'weapon', slot:'MAIN_HAND', atk:5,  value:280,  icon:'⚔', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','mage','rogue'] },
  elven_chain:   { name:'Elven Chain',     type:'armor',  slot:'CHEST',     def:6,  value:400,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','rogue'] },
  silver_shield: { name:'Silver Shield',   type:'armor',  slot:'OFF_HAND',  def:4,  value:320,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  scroll_of_protection: { name:'Scroll of Protection', type:'permanent', stat:'DEF', statBonus:2, value:200, icon:'📜', color:'#2ecc71', rarity:'uncommon' },
  herb_potion:   { name:'Herb Potion',     type:'consumable', heal:30, value:60,   icon:'⬡', color:'#2ecc71', rarity:'uncommon'  },
  silver_arrowBundle: { name:'Silver Arrows x20', type:'consumable', atkBoost:5, value:120, icon:'🏹', color:'#2ecc71', rarity:'uncommon' },
  archery_training:   { name:'Archery Lesson (DEX +1)', type:'training', stat:'DEX', statBonus:1, value:80, icon:'🎯', color:'#2ecc71', rarity:'uncommon' },
  hunter_bow:    { name:'Hunter Bow',      type:'weapon', slot:'MAIN_HAND', atk:6,  value:220,  icon:'🏹', color:'#2ecc71', rarity:'uncommon',  classRestriction:['ranger','rogue'] },
  serpent_ring:  { name:'Serpent Ring',    type:'armor',  slot:'RING',      def:3,  value:320,  icon:'💍', color:'#2ecc71', rarity:'uncommon', passive:{poison:3} },
  gloves_of_swiftness: { name:'Gloves of Swiftness', type:'armor', slot:'HANDS', def:0, value:380, icon:'🧤', color:'#2ecc71', rarity:'uncommon', passive:{dodge:5}, statBonuses:{DEX:2} },
  // ── Rare ──────────────────────────────────────────────────────────────────
  flame_sword:   { name:'Flame Sword',     type:'weapon', slot:'MAIN_HAND', atk:18, value:600,  icon:'🔥', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  plate_armor:   { name:'Plate Armor',     type:'armor',  slot:'CHEST',     def:14, value:520,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  elven_bow:     { name:'Elven Bow',       type:'weapon', slot:'MAIN_HAND', atk:15, value:480,  icon:'🏹', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'] },
  elven_cloak:   { name:'Elven Cloak',     type:'armor',  slot:'CHEST',     def:11, value:400,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'] },
  moonbow:       { name:'Moonbow',         type:'weapon', slot:'MAIN_HAND', atk:10, value:600,  icon:'🏹', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'] },
  ancient_map:   { name:'Ancient Map',     type:'special', goldBonus:50,            value:320,  icon:'🗺', color:'#3498db', rarity:'rare'      },
  big_herb_potion: { name:'Big Herb Potion', type:'consumable', heal:80, value:160, icon:'⬡', color:'#3498db', rarity:'rare'      },
  poison_arrowBundle: { name:'Poison Arrows x10', type:'consumable', heal:20,    value:180,  icon:'🏹', color:'#3498db', rarity:'rare'     },
  runic_blade:   { name:'Runic Blade',     type:'weapon', slot:'MAIN_HAND', atk:9,  value:440,  icon:'⚔', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  scale_mail:    { name:'Scale Mail',      type:'armor',  slot:'CHEST',     def:8,  value:380,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'] },
  thornmail:     { name:'Thornmail',       type:'armor',  slot:'CHEST',     def:7,  value:560,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'], passive:{thorns:8}, statBonuses:{DEX:-1} },
  ember_cloak:   { name:'Ember Cloak',     type:'armor',  slot:'CHEST',     def:5,  value:500,  icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'], passive:{burn:5} },
  // ── Epic ──────────────────────────────────────────────────────────────────
  elven_blade:   { name:'Elven Blade',     type:'weapon', slot:'MAIN_HAND', atk:20, value:800,  icon:'⚔', color:'#9b59b6', rarity:'epic',      classRestriction:['paladin'] },
  tome_of_wisdom:{ name:'Tome of Wisdom',  type:'permanent', stat:'INT', statBonus:2, value:800,  icon:'📖', color:'#9b59b6', rarity:'epic'   },
  elixir_of_life:{ name:'Elixir of Life',  type:'permanent', stat:'CON', statBonus:1, value:1200, icon:'⬡', color:'#9b59b6', rarity:'epic'   },
  void_staff:    { name:'Void Staff',      type:'weapon', slot:'MAIN_HAND', atk:12, value:800,  icon:'⚔', color:'#9b59b6', rarity:'epic',      classRestriction:['ranger','mage','paladin'], intBonus:4 },
  crystal_shield:{ name:'Crystal Shield',  type:'armor',  slot:'OFF_HAND',  def:10, value:720,  icon:'🛡', color:'#9b59b6', rarity:'epic',      classRestriction:['paladin'] },
  amulet_of_sentinel: { name:'Amulet of the Sentinel', type:'armor', slot:'AMULET', def:4, value:1000, icon:'📿', color:'#9b59b6', rarity:'epic', passive:{reflect:15} },
  boots_of_the_wind:  { name:'Boots of the Wind',      type:'armor', slot:'FEET',   def:0, value:880,  icon:'👢', color:'#9b59b6', rarity:'epic', passive:{dodge:12}, statBonuses:{DEX:6} },
  // ── Set Items: Moonlight (Rare) ───────────────────────────────────────────
  moonlight_robe:       { name:'Moonlight Robe',        type:'armor',  slot:'CHEST',     def:8,  value:720,  icon:'🛡', color:'#3498db', rarity:'rare', set:'moonlight',   classRestriction:['mage'], statBonuses:{INT:3} },
  moonlight_ring:       { name:'Moonlight Ring',         type:'armor',  slot:'RING',      def:0,  value:480,  icon:'💍', color:'#3498db', rarity:'rare', set:'moonlight',   statBonuses:{INT:3,WIS:2} },
  moonlight_amulet:     { name:'Moonlight Amulet',       type:'armor',  slot:'AMULET',    def:0,  value:600,  icon:'📿', color:'#3498db', rarity:'rare', set:'moonlight',   statBonuses:{INT:4,CON:2} },
  // ── Set Items: Silverforge (Epic) ─────────────────────────────────────────
  silverforge_plate:    { name:'Silverforge Plate',      type:'armor',  slot:'CHEST',     def:12, value:1120, icon:'🛡', color:'#9b59b6', rarity:'epic', set:'silverforge', classRestriction:['paladin'], statBonuses:{STR:4} },
  silverforge_gauntlets:{ name:'Silverforge Gauntlets',  type:'armor',  slot:'HANDS',     def:3,  value:800,  icon:'🧤', color:'#9b59b6', rarity:'epic', set:'silverforge', classRestriction:['paladin'], atk:6 },
  silverforge_blade:    { name:'Silverforge Blade',      type:'weapon', slot:'MAIN_HAND', atk:14, value:1280, icon:'⚔', color:'#9b59b6', rarity:'epic', set:'silverforge', classRestriction:['paladin'], def:3 },
  // ── Dragon's Gate: Armory (Uncommon/Rare/Epic) ────────────────────────────
  iron_shield:     { name:'Iron Shield',      type:'armor',  slot:'OFF_HAND',  def:8,  value:480,  icon:'🛡', color:'#2ecc71', rarity:'uncommon',  classRestriction:['paladin'] },
  tower_shield:    { name:'Tower Shield',     type:'armor',  slot:'OFF_HAND',  def:12, value:1000, icon:'🛡', color:'#3498db', rarity:'rare',      classRestriction:['paladin'], statBonuses:{CON:5} },
  heavy_plate:     { name:'Heavy Plate',      type:'armor',  slot:'CHEST',     def:15, value:1200, icon:'🛡', color:'#9b59b6', rarity:'epic',      classRestriction:['paladin'], statBonuses:{DEX:-2} },
  // ── Dragon's Gate: War Goods (Uncommon/Rare) ──────────────────────────────
  warhammer:       { name:'Warhammer',        type:'weapon', slot:'MAIN_HAND', atk:12, value:880,  icon:'⚔', color:'#3498db', rarity:'rare',      classRestriction:[], def:3 },
  crossbow:        { name:'Crossbow',         type:'weapon', slot:'MAIN_HAND', atk:10, value:720,  icon:'🏹', color:'#3498db', rarity:'rare',      classRestriction:['ranger','rogue'], statBonuses:{DEX:2} },
  ballista_bolt_bundle: { name:'Ballista Bolts ×50', type:'consumable', atkBoost:8, value:320, icon:'🏹', color:'#2ecc71', rarity:'uncommon' },
  // ── Boss Drop: Dungeon ─────────────────────────────────────────────────────
  slime_core_ring:   { name:'Core of the Slime King',      type:'armor',  slot:'RING',      def:0,  value:0, icon:'💍', color:'#2ecc71', rarity:'uncommon', allStatsBonus:3 },
  bone_crown:        { name:'Crown of the Skeleton King',  type:'armor',  slot:'HEAD',      def:0,  value:0, icon:'👑', color:'#3498db', rarity:'rare',   statBonuses:{INT:5, WIS:5}, passive:{xpBonus:10} },
  dark_knight_cuirass:{ name:"Dark Knight's Armor",        type:'armor',  slot:'CHEST',     def:12, value:0, icon:'🛡', color:'#3498db', rarity:'rare',   statBonuses:{STR:3} },
  troll_hide_boots:  { name:'Boots of the Troll',          type:'armor',  slot:'FEET',      def:8,  value:0, icon:'👢', color:'#3498db', rarity:'rare',   statBonuses:{CON:4} },
  // ── Boss Drop: World Map ───────────────────────────────────────────────────
  dragon_slayer_sword: { name:'Blade of the Dragon Slayer', type:'weapon', slot:'MAIN_HAND', atk:20, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', set:'dragon_scale', passive:{burn:15, lifesteal:10} },
  dragon_heart_amulet: { name:'Heart of the Elder Dragon',  type:'armor',  slot:'AMULET',   def:0,  value:0, icon:'📿', color:'#f39c12', rarity:'legendary', allStatsBonus:8,  passive:{regen:15, reflect:20} },
  titan_greaves:       { name:'Greaves of the Titan',       type:'armor',  slot:'FEET',      def:10, value:0, icon:'👢', color:'#9b59b6', rarity:'epic',      statBonuses:{CON:5}, passive:{thorns:10} },
  hydra_venom_blade:   { name:"Void Hydra's Fang",          type:'weapon', slot:'MAIN_HAND', atk:15, value:0, icon:'⚔', color:'#9b59b6', rarity:'epic',      passive:{poison:20} },
  // ── Volcanic Wastes: Fire Shop ────────────────────────────────────────────
  fire_staff:    { name:'Fire Staff',    type:'weapon', slot:'MAIN_HAND', atk:8,  value:180, icon:'⚔', color:'#ff4500', rarity:'rare',   classRestriction:['mage','ranger','paladin'], intBonus:4, passive:{burn:3}, damageType:'fire' },
  lava_blade:    { name:'Lava Blade',    type:'weapon', slot:'MAIN_HAND', atk:10, value:220, icon:'⚔', color:'#8b2500', rarity:'rare',   classRestriction:['paladin'], passive:{burn:5}, damageType:'fire' },
  // ember_cloak already exists in the codebase — reused in the fire shop list
  // ── Frozen Peaks: Ice Shop ────────────────────────────────────────────────
  frost_dagger:    { name:'Frost Dagger',    type:'weapon', slot:'MAIN_HAND', atk:9,  value:200, icon:'⚔', color:'#a8d8ea', rarity:'rare',   classRestriction:['ranger','mage','rogue'], damageType:'ice', statBonuses:{DEX:2} },
  glacier_shield:  { name:'Glacier Shield',  type:'armor',  slot:'OFF_HAND',  def:8,  value:170, icon:'🛡', color:'#1a5c7a', rarity:'rare',   classRestriction:['paladin'], statBonuses:{CON:3} },
  winter_cloak:    { name:'Winter Cloak',    type:'armor',  slot:'CHEST',     def:4,  value:150, icon:'🛡', color:'#e8f4f8', rarity:'uncommon', classRestriction:['ranger','rogue'], statBonuses:{INT:3} },
  // ── Shadow Forest: Shadow Shop ────────────────────────────────────────────
  venom_fang:    { name:'Venom Fang',    type:'weapon', slot:'MAIN_HAND', atk:7,  value:150, icon:'⚔', color:'#2d3a1a', rarity:'uncommon', classRestriction:['ranger','mage','rogue'], passive:{poison:8}, damageType:'poison' },
  shadow_cloak:  { name:'Shadow Cloak',  type:'armor',  slot:'CHEST',     def:5,  value:130, icon:'🛡', color:'#1a1a0a', rarity:'uncommon', classRestriction:['ranger','rogue'], statBonuses:{DEX:3} },
  dark_tome:     { name:'Dark Tome',     type:'permanent', stat:'INT', statBonus:4, value:200, icon:'📖', color:'#3d2b1f', rarity:'rare' },
  // ── Dwarf Fortress: Thrain's Forge ───────────────────────────────────────
  dwarven_plate: { name:'Dwarven Plate', type:'armor',  slot:'CHEST',     def:15, value:350, icon:'🛡', color:'#5a5a5a', rarity:'epic',   classRestriction:['paladin'], statBonuses:{CON:2} },
  battle_axe:    { name:'Battle Axe',    type:'weapon', slot:'MAIN_HAND', atk:14, value:300, icon:'⚔', color:'#8b6914', rarity:'epic',   classRestriction:['paladin'], def:3 },
  mithril_helm:  { name:'Mithril Helm',  type:'armor',  slot:'HEAD',      def:6,  value:220, icon:'👑', color:'#cd9b1d', rarity:'rare',   statBonuses:{INT:2} },
  // ── Ruins of Aethoria: Temple of the Ancients ─────────────────────────────
  holy_avenger:  { name:'Holy Avenger',  type:'weapon', slot:'MAIN_HAND', atk:12, value:400, icon:'⚔', color:'#d4a017', rarity:'epic',   classRestriction:['paladin'], intBonus:5, statBonuses:{WIS:5}, damageType:'holy' },
  divine_shield: { name:'Divine Shield', type:'armor',  slot:'OFF_HAND',  def:10, value:350, icon:'🛡', color:'#f5e6c8', rarity:'epic',   classRestriction:['paladin'], passive:{reflect:10} },
  sunblade:      { name:'Sunblade',      type:'weapon', slot:'MAIN_HAND', atk:11, value:380, icon:'⚔', color:'#d4a017', rarity:'epic',   classRestriction:['paladin'], statBonuses:{STR:3}, damageType:'holy' },
  // ── Resist Items ──────────────────────────────────────────────────────────
  fire_resist_amulet: { name:'Fire Resist Amulet', type:'armor', slot:'AMULET', def:0, value:150, icon:'📿', color:'#ff4500', rarity:'uncommon', passive:{fireResist:5},      desc:'Reduces fire damage taken by 5%.' },
  ice_ward:           { name:'Ice Ward',           type:'armor', slot:'AMULET', def:0, value:150, icon:'📿', color:'#a8d8ea', rarity:'uncommon', passive:{iceResist:5},       desc:'Reduces ice damage taken by 5%.' },
  lightning_rod:      { name:'Lightning Rod',      type:'armor', slot:'AMULET', def:0, value:150, icon:'📿', color:'#ffe066', rarity:'uncommon', passive:{lightningResist:5}, desc:'Reduces lightning damage taken by 5%.' },
  // ── Legendary ─────────────────────────────────────────────────────────────
  dragonslayer:  { name:'Dragon Slayer',   type:'weapon', slot:'MAIN_HAND', atk:25, value:0,    icon:'⚡', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'] },
  crown_of_ages: { name:'Crown of Ages',   type:'permanent', allStats:5,            value:2000, icon:'👑', color:'#f39c12', rarity:'legendary' },
  blade_of_the_ancient_dragon: { name:'Blade of the Ancient Dragon', type:'weapon', slot:'MAIN_HAND', atk:20, value:1600, icon:'⚔', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'] },
  heart_of_the_mountain: { name:'Heart of the Mountain', type:'armor', slot:'AMULET', def:0, value:1800, icon:'📿', color:'#f39c12', rarity:'legendary', passive:{regen:10}, statBonuses:{CON:5}, allStatsBonus:3 },
  ring_of_the_dragon:    { name:'Ring of the Dragon',    type:'armor', slot:'RING',   atk:8, value:2000, icon:'💍', color:'#f39c12', rarity:'legendary', passive:{lifesteal:15, burn:8} },
  // ── The Abyss: Boss Drop ──────────────────────────────────────────────────
  void_reaver: { name:'Void Reaver', type:'weapon', slot:'MAIN_HAND', atk:25, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', passive:{lifesteal:20, darkDamage:15}, desc:'Forged from the essence of the void itself.' },
  // ── Sunken Temple: Boss Drop ───────────────────────────────────────────────
  trident_of_the_deep: { name:'Trident of the Deep', type:'weapon', slot:'MAIN_HAND', atk:18, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'], whileEquipped:{iceDamage:12}, passive:{poison:5}, desc:'Once wielded by the Drowned King himself.' },
  // ── The Underworld: Boss Drop ─────────────────────────────────────────────
  infernal_cleaver:   { name:'Infernal Cleaver',   type:'weapon', slot:'MAIN_HAND', atk:22, value:0, icon:'⚔', color:'#f39c12', rarity:'legendary', classRestriction:['paladin'], whileEquipped:{fireDamage:15}, onHit:{chance:0.10, effect:'burn'}, desc:'Forged in the fires of the eternal pit.' },
  // ── The Underworld: Brimstone Bazaar shop ─────────────────────────────────
  demon_slayer_blade: { name:'Demon Slayer Blade', type:'weapon', slot:'MAIN_HAND', atk:14, value:400, icon:'⚔', color:'#3498db', rarity:'rare', classRestriction:['paladin'], statBonuses:{STR:5}, whileEquipped:{fireDamage:8}, desc:'+20% damage vs demons.' },
  hellfire_plate:     { name:'Hellfire Plate',     type:'armor',  slot:'CHEST',     def:11, value:380, icon:'🛡', color:'#3498db', rarity:'rare', classRestriction:['paladin'], statBonuses:{CON:4}, passive:{fireResist:20}, desc:'Forged from hellfire-tempered iron.' },
  infernal_ring:      { name:'Infernal Ring',      type:'armor',  slot:'RING',      def:0,  value:350, icon:'💍', color:'#3498db', rarity:'rare', allStatsBonus:4, whileEquipped:{fireDamage:5}, passive:{lifesteal:8}, desc:'A ring pulsing with infernal energy.' },
  // ── Sunken Temple: Sunken Reliquary shop ──────────────────────────────────
  coral_blade:    { name:'Coral Blade',    type:'weapon', slot:'MAIN_HAND', atk:10, value:280, icon:'⚔', color:'#3498db', rarity:'rare',   classRestriction:['paladin'], whileEquipped:{waterDamage:6}, passive:{poison:3}, desc:'A blade grown from living coral.' },
  tidal_shield:   { name:'Tidal Shield',   type:'armor',  slot:'OFF_HAND',  def:9,  value:260, icon:'🛡', color:'#3498db', rarity:'rare',   classRestriction:['paladin'], statBonuses:{CON:4}, passive:{iceResist:15}, desc:'Imbued with the resilience of the tide.' },
  mermaids_charm: { name:"Mermaid's Charm",type:'armor',  slot:'AMULET',    def:0,  value:300, icon:'📿', color:'#3498db', rarity:'rare',   allStatsBonus:3, passive:{iceResist:10}, desc:'A charm that whispers of the deep.' },
  // ── The Abyss: Void Emporium shop ─────────────────────────────────────────
  void_blade:     { name:'Void Blade',     type:'weapon', slot:'MAIN_HAND', atk:15, value:500, icon:'⚔', color:'#9b59b6', rarity:'epic', classRestriction:['paladin'], whileEquipped:{darkDamage:10}, passive:{lifesteal:10}, desc:'A blade forged in the void.' },
  abyssal_armor:  { name:'Abyssal Armor',  type:'armor',  slot:'CHEST',     def:12, value:480, icon:'🛡', color:'#9b59b6', rarity:'epic', statBonuses:{CON:5}, passive:{regen:10}, desc:'Armor imbued with abyssal energy.' },
  wraithcloak:    { name:'Wraithcloak',    type:'armor',  slot:'CHEST',     def:8,  value:420, icon:'🛡', color:'#9b59b6', rarity:'epic', classRestriction:['ranger','rogue'], statBonuses:{DEX:3}, passive:{dodge:10}, desc:'A cloak that shifts between realms.' },
  // ── Proc / On-Attack / On-Hit Items ──────────────────────────────────────
  fire_sword:       { name:'Fire Sword',       type:'weapon', slot:'MAIN_HAND', atk:12, value:1000, icon:'🔥', color:'#9b59b6', rarity:'epic',   classRestriction:['paladin'], whileEquipped:{fireDamage:5}, onAttack:{chance:0.10, effect:'fireball'}, desc:'A blade wreathed in eternal flame.' },
  venom_fang_rare:  { name:'Venom Fang',        type:'weapon', slot:'MAIN_HAND', atk:9,  value:600,  icon:'⚔', color:'#3498db', rarity:'rare',   classRestriction:['ranger','mage','rogue'], passive:{poison:8}, onHit:{chance:0.15, effect:'poison'}, desc:'Dripping with deadly venom.' },
  life_drain_blade: { name:'Life Drain Blade',  type:'weapon', slot:'MAIN_HAND', atk:10, value:900,  icon:'⚔', color:'#9b59b6', rarity:'epic',   classRestriction:['paladin'], passive:{lifesteal:8}, onHit:{chance:0.20, heal:5}, desc:'Steals life from enemies.' },
  thunder_gauntlets:{ name:'Thunder Gauntlets', type:'armor',  slot:'HANDS',     def:3,  value:700,  icon:'🧤', color:'#3498db', rarity:'rare',   atk:4, onHit:{chance:0.12, effect:'stun'}, desc:'Lightning crackles with each blow.' },
  guardian_amulet:  { name:'Guardian Amulet',   type:'armor',  slot:'AMULET',    def:0,  value:800,  icon:'📿', color:'#3498db', rarity:'rare',   allStatsBonus:4, onHit:{chance:0.15, shield:8}, desc:'Creates a magical barrier when struck.' },
  archmage_staff:   { name:'Archmage Staff',    type:'weapon', slot:'MAIN_HAND', atk:8,  value:1100, icon:'⚔', color:'#9b59b6', rarity:'epic',   classRestriction:['ranger','mage','paladin'], intBonus:6, magicDamage:10, onAttack:{chance:0.08, effect:'fireball'}, desc:'Channel raw arcane energy.' },
  berserker_axe:    { name:'Berserker Axe',     type:'weapon', slot:'MAIN_HAND', atk:14, value:750,  icon:'⚔', color:'#3498db', rarity:'rare',   classRestriction:['paladin'], def:-2, onHit:{chance:0.25, heal:8}, desc:'The more you bleed, the harder you hit.' },
  // ── Type Synergy Sets ─────────────────────────────────────────────────────
  // FIRE SET
  flame_gauntlets: { name:'Flame Gauntlets', type:'armor',  slot:'HANDS',     atk:3, def:2,  value:120, icon:'🧤', rarity:'rare', damageType:'fire',      whileEquipped:{fireDamage:3} },
  inferno_blade:   { name:'Inferno Blade',   type:'weapon', slot:'MAIN_HAND', atk:11,        value:280, icon:'🔥', rarity:'epic', damageType:'fire',      classRestriction:['paladin'], whileEquipped:{fireDamage:6}, onAttack:{chance:0.08, effect:'fireball'} },
  phoenix_cloak:   { name:'Phoenix Cloak',   type:'armor',  slot:'CHEST',            def:7,  value:240, icon:'🛡', rarity:'epic', damageType:'fire',      whileEquipped:{fireDamage:4}, statBonuses:{STR:3} },
  // ICE SET
  frost_gauntlets: { name:'Frost Gauntlets', type:'armor',  slot:'HANDS',     atk:3, def:2,  value:120, icon:'🧤', rarity:'rare', damageType:'ice',       whileEquipped:{iceDamage:3} },
  blizzard_staff:  { name:'Blizzard Staff',  type:'weapon', slot:'MAIN_HAND', atk:9,         value:280, icon:'⚔', rarity:'epic', damageType:'ice',       classRestriction:['ranger','mage','paladin'], whileEquipped:{iceDamage:6}, statBonuses:{INT:5}, onAttack:{chance:0.06, effect:'freeze'} },
  frozen_plate:    { name:'Frozen Plate',    type:'armor',  slot:'CHEST',            def:8,  value:250, icon:'🛡', rarity:'epic', damageType:'ice',       classRestriction:['paladin'], whileEquipped:{iceDamage:4}, statBonuses:{CON:3} },
  // LIGHTNING SET
  storm_gauntlets: { name:'Storm Gauntlets', type:'armor',  slot:'HANDS',     atk:3, def:2,  value:120, icon:'🧤', rarity:'rare', damageType:'lightning',  whileEquipped:{lightningDamage:3}, statBonuses:{DEX:2} },
  thunder_strike:  { name:'Thunder Strike',  type:'weapon', slot:'MAIN_HAND', atk:12,        value:290, icon:'⚡', rarity:'epic', damageType:'lightning',  classRestriction:['paladin'], whileEquipped:{lightningDamage:5}, onHit:{chance:0.08, effect:'stun'} },
  tempest_robes:   { name:'Tempest Robes',   type:'armor',  slot:'CHEST',            def:6,  value:230, icon:'🛡', rarity:'epic', damageType:'lightning',  classRestriction:['mage','ranger'], whileEquipped:{lightningDamage:4}, statBonuses:{INT:4} },
  // POISON SET
  venom_gloves:    { name:'Venom Gloves',    type:'armor',  slot:'HANDS',     atk:2, def:2,  value:110, icon:'🧤', rarity:'rare', damageType:'poison',    passive:{poison:4}, statBonuses:{DEX:2} },
  serpent_fang:    { name:'Serpent Fang',    type:'weapon', slot:'MAIN_HAND', atk:10,        value:270, icon:'⚔', rarity:'epic', damageType:'poison',    classRestriction:['ranger','mage','rogue'], passive:{poison:8}, onHit:{chance:0.12, effect:'poison'} },
  plague_armor:    { name:'Plague Armor',    type:'armor',  slot:'CHEST',            def:7,  value:240, icon:'🛡', rarity:'epic', damageType:'poison',    classRestriction:['paladin'], passive:{poison:5}, statBonuses:{CON:2} },
  // HOLY SET
  holy_gauntlets:  { name:'Holy Gauntlets',  type:'armor',  slot:'HANDS',     atk:2,         value:130, icon:'🧤', rarity:'rare', damageType:'holy',      whileEquipped:{holyDamage:2}, statBonuses:{WIS:3} },
  divine_blade:    { name:'Divine Blade',    type:'weapon', slot:'MAIN_HAND', atk:11,        value:300, icon:'⚔', rarity:'epic', damageType:'holy',      classRestriction:['paladin'], whileEquipped:{holyDamage:5}, statBonuses:{INT:4, WIS:4} },
  sacred_plate:    { name:'Sacred Plate',    type:'armor',  slot:'CHEST',            def:9,  value:260, icon:'🛡', rarity:'epic', damageType:'holy',      classRestriction:['paladin'], whileEquipped:{holyDamage:4}, statBonuses:{CON:3}, passive:{regen:3} },
  // DARK SET
  shadow_gauntlets:{ name:'Shadow Gauntlets',type:'armor',  slot:'HANDS',     atk:3,         value:120, icon:'🧤', rarity:'rare', damageType:'dark',      whileEquipped:{darkDamage:2}, passive:{lifesteal:3}, statBonuses:{DEX:2} },
  void_reaper:     { name:'Void Reaper',     type:'weapon', slot:'MAIN_HAND', atk:13,        value:300, icon:'⚔', rarity:'epic', damageType:'dark',      classRestriction:['paladin'], whileEquipped:{darkDamage:5}, passive:{lifesteal:5} },
  nightmare_cloak: { name:'Nightmare Cloak', type:'armor',  slot:'CHEST',            def:6,  value:250, icon:'🛡', rarity:'epic', damageType:'dark',      classRestriction:['ranger','rogue'], whileEquipped:{darkDamage:4}, passive:{lifesteal:4}, statBonuses:{INT:4} },
};
// Town shop — common & uncommon
const shopItems = ['rusty_dagger','torn_cloth','iron_sword','leather_armor','steel_sword','chain_mail','hp_potion','big_hp_potion','serpent_ring','gloves_of_swiftness','fire_resist_amulet','ice_ward','lightning_rod'];
// Elven Market — rare, epic & legendary
const elvenShopItems    = ['elven_bow','elven_cloak','elven_blade','void_staff','crystal_shield','blade_of_the_ancient_dragon','crown_of_ages','amulet_of_sentinel','boots_of_the_wind','heart_of_the_mountain','ring_of_the_dragon','moonlight_robe','moonlight_ring','moonlight_amulet'];
// Silverforge Blacksmith — uncommon & rare
const silverforgeItems  = ['hunter_bow','elven_sword','silver_dagger','moonbow','elven_chain','silver_shield','runic_blade','scale_mail','thornmail','ember_cloak','silverforge_plate','silverforge_gauntlets','silverforge_blade'];
const lorekeeperItems   = ['tome_of_wisdom','scroll_of_protection','ancient_map'];
const herbalistItems    = ['herb_potion','big_herb_potion','elixir_of_life','antidote'];
const bowyerItems       = ['silver_arrowBundle','poison_arrowBundle','archery_training','mana_potion'];
// Dragon's Gate: Ironhelm's Armory — heavy armor and shields
const armoryItems    = ['iron_shield','tower_shield','heavy_plate','chain_mail','plate_armor'];
// Dragon's Gate: Siegemaster's War Goods — weapons and ammunition
const warGoodsItems  = ['warhammer','crossbow','ballista_bolt_bundle','steel_sword','flame_sword'];
// Rogue's Cove: Salty Steve's Bar — alcoholic drinks
const steveBarItems  = ['ale','whiskey','firebrandy'];
// Volcanic Wastes: Fire Shop — fire-themed items
const fireShopItems  = ['fire_staff','lava_blade','ember_cloak','flame_gauntlets','inferno_blade','phoenix_cloak','hp_potion','big_hp_potion'];
// Frozen Peaks: Ice Shop — ice-themed items
const iceShopItems   = ['frost_dagger','glacier_shield','winter_cloak','frost_gauntlets','blizzard_staff','frozen_plate','hp_potion','big_hp_potion'];
// Shadow Forest: Shadow Market — poison/dark items
const shadowShopItems = ['venom_fang','shadow_cloak','dark_tome','venom_gloves','serpent_fang','plague_armor','shadow_gauntlets','void_reaper','nightmare_cloak','antidote','hp_potion'];
// Dwarf Fortress: Thrain's Forge — heavy weapons and armor
const dwarfShopItems = ['dwarven_plate','battle_axe','mithril_helm','iron_shield','tower_shield','warhammer','storm_gauntlets','thunder_strike','tempest_robes'];
// Ruins of Aethoria: Temple of the Ancients — holy/ancient items
const holyShopItems  = ['holy_avenger','divine_shield','sunblade','holy_gauntlets','divine_blade','sacred_plate','big_hp_potion','mana_potion'];
// The Abyss: Void Emporium — void/dark-themed items
const voidEmporiumItems = ['void_blade','abyssal_armor','wraithcloak','shadow_gauntlets','void_reaper','nightmare_cloak','big_hp_potion','hp_potion'];
// Sunken Temple: Sunken Reliquary — water/ice-themed items
const sunkenShopItems = ['coral_blade','tidal_shield','mermaids_charm','frost_dagger','glacier_shield','frost_gauntlets','blizzard_staff','hp_potion','big_hp_potion'];
// The Underworld: Brimstone Bazaar — hellfire-themed items
const brimstoneItems = ['demon_slayer_blade','hellfire_plate','infernal_ring','hp_potion','big_hp_potion'];

