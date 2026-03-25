// data_world.js — Class definitions, rarity tiers, set definitions, NPC definitions,
// sparring opponents, library books, and loot drop tables.
// Provides: CLASS_DEFS, RARITY, SET_DEFS, npcs, sparringOpponents,
//           LIBRARY_BOOKS, trainingDrops, floorDrops, worldMapDrops.

// data.js — Static game data: class definitions (5 classes), rarity tiers, set definitions,
// enemy types (dungeon floors + training grounds tiered by player level + world map tiers + bosses),
// boss loot tables, NPC definitions (town/training grounds/Dragon's Gate/Elven Town/Rogue's Cove),
// item definitions (weapons, armor, consumables, alcoholic drinks, quest items, boss drops),
// shop item lists per vendor (9 vendors), skill definitions with cooldowns/class restrictions,
// skill rank system, library books, and per-floor loot tables.
// Also holds mutable enemies[] and chestsOpened.
// Depends on: constants.js (MAP_W, MAP_H, T), map.js (getMap).

// ─── CLASS DEFINITIONS ────────────────────────────────────────────────────────
// statMods: delta from base 10. startHp/Atk/Def: initial combat stats.
// startSkills: pre-learned skill IDs. classRestriction on items lists which
// non-warrior classes may equip the item (warrior always bypasses restrictions).
const CLASS_DEFS = {
  warrior: {
    name: 'Warrior', icon: '⚔️',
    statMods: { STR: 3, CON: 2, INT: -2, WIS: -1 },
    startHp: 120, startAtk: 12, startDef: 8,
    startSkills: [],
    armorTypes: 'All armor', weaponTypes: 'All weapons',
    desc: 'Unstoppable frontliner. High HP and raw power.',
    baseMana: 20, manaPerInt: 2,
  },
  ranger: {
    name: 'Ranger', icon: '🏹',
    statMods: { DEX: 3, WIS: 2, CON: -2, STR: -1 },
    startHp: 85, startAtk: 10, startDef: 4,
    startSkills: [],
    armorTypes: 'Light armor', weaponTypes: 'Bows, daggers, staffs',
    desc: 'Agile archer with evasion and healing.',
    baseMana: 40, manaPerInt: 3,
  },
  mage: {
    name: 'Mage', icon: '🔮',
    statMods: { INT: 4, WIS: 2, CON: -3, STR: -2 },
    startHp: 65, startAtk: 6, startDef: 2,
    startSkills: [],
    armorTypes: 'Robes only', weaponTypes: 'Staffs, daggers, orbs',
    desc: 'Devastating spellcaster with powerful magic.',
    baseMana: 100, manaPerInt: 10,
  },
  paladin: {
    name: 'Paladin', icon: '🛡️',
    statMods: { STR: 2, CON: 2, WIS: 2, DEX: -1, INT: -1 },
    startHp: 110, startAtk: 10, startDef: 7,
    startSkills: [],
    armorTypes: 'Medium/heavy armor', weaponTypes: 'Swords, shields, staves',
    desc: 'Holy warrior blending combat and healing.',
    baseMana: 50, manaPerInt: 5,
  },
  rogue: {
    name: 'Rogue', icon: '🗡️',
    statMods: { DEX: 3, STR: 2, CON: -2, WIS: -1 },
    startHp: 80, startAtk: 11, startDef: 3,
    startSkills: [],
    armorTypes: 'Light armor', weaponTypes: 'Daggers, bows',
    desc: 'Fast and lethal, built for critical strikes.',
    baseMana: 30, manaPerInt: 3,
  },
};

const RARITY = {
  common:    { label:'Common',    color:'#9d9d9d', badge:''  },
  uncommon:  { label:'Uncommon',  color:'#2ecc71', badge:'◆' },
  rare:      { label:'Rare',      color:'#3498db', badge:'★' },
  epic:      { label:'Epic',      color:'#9b59b6', badge:'✦' },
  legendary: { label:'Legendary', color:'#f39c12', badge:'★' },
};

// ─── SET DEFINITIONS ─────────────────────────────────────────────────────────
// bonuses: { <pieces>: { stats: {atk,def,maxHp,STR,...}, passives: {dodge,crit,...} } }
const SET_DEFS = {
  moonlight: {
    name: 'Moonlight Set',
    bonuses: {
      2: { passives: { dodge: 5 } },
      3: { passives: { dodge: 10 }, stats: { INT: 5 } },
    },
  },
  silverforge: {
    name: 'Silverforge Set',
    bonuses: {
      2: { stats: { def: 3, atk: 2 } },
      3: { stats: { def: 6, atk: 4 }, passives: { thorns: 3 } },
    },
  },
  shadow: {
    name: 'Shadow Set',
    bonuses: {
      2: { passives: { crit: 8 } },
      3: { passives: { crit: 15, lifesteal: 5 } },
    },
  },
  dragon_scale: {
    name: 'Dragon Scale Set',
    bonuses: {
      2: { stats: { maxHp: 100, def: 5 } },
      3: { stats: { maxHp: 200, def: 10 }, passives: { burn: 5 } },
      4: { stats: { maxHp: 300, def: 15 }, passives: { burn: 10, reflect: 10 } },
    },
  },
  warriors_pride: {
    name: "Warrior's Pride Set",
    bonuses: {
      2: { stats: { atk: 5, STR: 2 } },
    },
  },
};

const npcs = {
  training_grounds: [
    { x:17, y:6, name:'Old Guard', drawKey:'guard', dialog:"Welcome to the Training Grounds! These peaceful gardens are home to rabbits, squirrels, birds, and mice. Train here before venturing into the wider world!" },
    { x:24, y:6, name:'Old Farmer', drawKey:'elder', questRatTailsNPC:true, dialog:"Those blasted mice in here... I've been trying to get rid of them for years. If you bring me 10 rat tails, I'll make it worth your while. Deal?" }
  ],
  town: [
    { x:12, y:14, name:'Shopkeeper', drawKey:'shopkeeper', dialog:'Welcome! Browse my wares.', shop:true },
    { x:28, y:14, name:'Healer',     drawKey:'healer',     dialog:'Let me restore your health...', heal:true },
    { x:12, y:26, name:'Old Man',    drawKey:'elder',      dialog:'The world beyond the roads is dangerous. Train in the grounds to the east before venturing out. And watch your step — the wilderness holds creatures that will swallow you whole.' },
    { x:28, y:26, name:'Guard',      drawKey:'guard',      dialog:'Be careful out there, adventurer.' },
    { x:20, y:19, name:'Villager',   drawKey:'villager',   dialog:"I heard there's a dragon on the 3rd floor!" },
    { x:34, y:14, name:'Master',     drawKey:'elder',      dialog:'Spend your skill points to grow stronger. Visit me after leveling up!', trainer:true },
    { x:34, y:26, name:'Sparring Master', drawKey:'guard', dialog:'Step into the ring and test your skills! No death here — only glory.', sparring:true },
    { x:7,  y:14, name:'Librarian',      drawKey:'elder', dialog:'Browse our collection, adventurer.', library:true },
  ],
  dragons_gate: [
    { x:20, y:4,  name:"Commander Rael",  drawKey:'guard',      dialog:"Dragon's Gate stands between civilization and the abyss. We hold the line here. Move along, soldier." },
    { x:7,  y:12, name:'Ironhelm',        drawKey:'shopkeeper', dialog:'Finest heavy armor in the realm. My steel has kept more soldiers alive than prayers ever have.', armoryShop:true },
    { x:32, y:12, name:'Siegemaster',     drawKey:'elder',      dialog:'War is a craft. Browse my stock and arm yourself properly before you march into that dungeon.', warGoodsShop:true },
    { x:32, y:25, name:'Guild Recruiter', drawKey:'villager',   dialog:"The dungeon below Dragon's Gate? Three floors of death. Monsters, traps, a dragon on the last floor. You'll need to be level 5 just to get past the gate guard." },
    { x:20, y:33, name:'City Guard',      drawKey:'guard',      dialog:'Halt! The dungeon passage is sealed to the weak. Prove yourself — reach level 5 and I will let you through.', dungeonGuard:true, minLevel:5 },
  ],
  rogue_cove: [
    { x:22, y:9,  name:'Captain Blackheart', drawKey:'guard',      dialog:"Welcome to Rogue's Cove, landlubber. Watch yer coin purse — this city has more nimble fingers than a ship's rigging." },
    { x:17, y:9,  name:'Guard',              drawKey:'guard',      dialog:'Move along. No bloodshed in the Cove streets — take disputes to the docks if you must.' },
    { x:6,  y:4,  name:'Madam Scarlet',      drawKey:'healer',     dialog:'Looking for rest and fine company? The Scarlet Lady offers the finest beds in the Cove.', inn:true },
    { x:6,  y:16, name:'Lucky Luca',         drawKey:'shopkeeper', dialog:"Care to test your luck, traveler? I have three games. The house always wins... eventually.", gambling:true },
    { x:26, y:16, name:'Salty Steve',        drawKey:'villager',   dialog:"Best rum in all the Cove, and that's a guarantee signed in salt. Pull up a stool, friend.", steveBar:true },
  ],
  volcanic_wastes: [
    { x:8,  y:18, name:'Pyromancer Zara', drawKey:'elder', dialog:'The heat here is my home, traveler. Browse my wares — forged in fire and fury.', fireShop:true },
    { x:25, y:15, name:'Fire Warden',     drawKey:'guard', dialog:'Watch your step — the lava flows shift without warning. Stay on the path.' },
  ],
  frozen_peaks: [
    { x:30, y:16, name:'Ice Merchant Kold', drawKey:'elder', dialog:'Brr! Welcome to the Frozen Emporium, the coldest shop in the world. Browse quickly before you freeze!', iceShop:true },
    { x:10, y:20, name:'Mountain Scout',    drawKey:'guard', dialog:'The peaks grow more treacherous further in. The frost giants have been restless lately.' },
  ],
  shadow_forest: [
    { x:7,  y:17, name:'Witch of the Woods', drawKey:'elder', dialog:'Ah, a visitor ventures into my forest. I have goods that might aid your survival here...', shadowShop:true },
    { x:25, y:10, name:'Lost Wanderer',      drawKey:'villager', dialog:"Don't go too deep into the forest. The ancient treant... it moves. It watches." },
  ],
  dwarf_fortress: [
    { x:9,  y:11, name:'Master Smith Thrain', drawKey:'shopkeeper', dialog:"Finest dwarven steel in all the realm. My forge burns day and night — nothing leaves here untempered.", dwarfShop:true },
    { x:30, y:11, name:'Quartermaster',       drawKey:'guard',      dialog:'This fortress has stood for three hundred years. The enemy will not breach these walls on my watch.' },
    { x:9,  y:29, name:'Drill Sergeant',      drawKey:'guard',      dialog:"You there! You've got soft hands. Train harder before you face the deeper threats of this realm." },
  ],
  ruins_aethoria: [
    { x:29, y:6,  name:'Elder Seraphina', drawKey:'elder', dialog:'These ruins hold the memory of an ancient civilization. Their power lingers still — as do their guardians.', holyShop:true },
    { x:20, y:13, name:'Tomb Scholar',    drawKey:'villager', dialog:'The inscriptions warn of an Ancient Guardian — the last sentinel of Aethoria. It will not yield willingly.' },
  ],
  the_abyss: [
    { x:8, y:9, name:'The Oracle', drawKey:'elder', dialog:'You dare enter the Abyss? Turn back, mortal. Only the void awaits you here.', voidShop:true },
  ],
  the_underworld: [
    { x:8, y:18, name:'Fallen Angel', drawKey:'fallen_angel', dialog:'I was cast down for questioning the order of heaven. Now I guard this gate against the unworthy.', brimstoneShop:true },
    { x:25, y:10, name:'Chained Shade', drawKey:'elder', dialog:'Chains of hellfire bind us here forever. But you... you still have a chance to leave.' },
  ],
  sunken_temple: [
    { x:8,  y:13, name:'Old Diver', drawKey:'old_diver', dialog:'These ruins have been flooded for centuries. The treasures within... some say they\'re cursed.', sunkenShop:true },
    { x:25, y:8,  name:'Temple Shade', drawKey:'elder', dialog:'"Here lies the king who dared defy the tide. His kingdom drowned. His treasure remains." — Inscription above the gate.' },
  ],
  elven_town: [
    { x:13, y:15, name:'Elven Merchant',    drawKey:'elven_merchant',   dialog:'Welcome to the Elven Market! Our goods are crafted with ancient magic.', elvenShop:true },
    { x:27, y:15, name:'Elven Town Master', drawKey:'elven_elder',       dialog:'You have found the hidden Elven Town. May the forest guide your path, adventurer.' },
    // Shop NPCs
    { x:5,  y:17, name:'Ironsmith Galadrel', drawKey:'elven_blacksmith', dialog:'My forge burns with moonfire. Every blade I craft sings with elven steel.', silverforgeShop:true },
    { x:36, y:11, name:'Innkeeper Miravel',  drawKey:'elven_innkeeper',  dialog:'Rest your weary bones, traveler. The Moonpetal Inn welcomes you.', inn:true },
    { x:28, y:5,  name:'Lorekeeper Thaeris', drawKey:'elven_lorekeeper', dialog:'Knowledge older than the stars awaits within these shelves. Browse, if you dare.', lorekeeperShop:true },
    { x:5,  y:30, name:'Herbalist Sylune',   drawKey:'elven_herbalist',  dialog:"The forest provides all remedies. Come, choose from nature's bounty.", herbalistShop:true },
    { x:36, y:30, name:'Bowyer Fenrath',     drawKey:'elven_bowyer',     dialog:'A true archer is patient, precise, and never wastes an arrow. Let me show you.', bowyerShop:true },
    // Non-shop NPCs
    { x:19, y:22, name:'Elder Sylvaril',  drawKey:'elven_elder',    dialog:'Long have the elves walked these lands. We were here before your kingdoms rose, and shall remain when they are dust.' },
    { x:22, y:3,  name:'Guard Captain',   drawKey:'guard',           dialog:'This road leads deeper into elven territory. Beyond this village, the ancient forest grows treacherous.' },
    { x:17, y:20, name:'Young Elf',       drawKey:'elven_villager',  dialog:'Psst! The lorekeeper keeps a secret passage in his archive... or so the other children say!' }
  ]
};

// ─── SPARRING ─────────────────────────────────────────────────────────────────
const sparringOpponents = [
  { name:'Training Dummy', hp:1000000, atk:2, def:0, xp:5, drawKey:'skeleton', label:'BEGINNER' },
];

// ─── ITEMS ───────────────────────────────────────────────────────────────────
const LIBRARY_BOOKS = [
  {
    id: 'combat_guide',
    title: 'Guide to Combat',
    color: '#e74c3c',
    text: 'Combat is turn-based. You have 4 actions: ATTACK uses your weapon damage. SKILL uses a learned ability (with cooldowns). ITEM uses a consumable. FLEE attempts to escape — but you lose XP! Use the terrain and your equipment to your advantage.',
  },
  {
    id: 'understanding_stats',
    title: 'Understanding Stats',
    color: '#3498db',
    text: 'STR increases damage. DEX boosts dodge and crit chance. CON adds max HP. INT gives bonus XP. WIS improves healing. CHA lowers shop prices. Allocate wisely at the Trainer!',
  },
  {
    id: 'art_of_skills',
    title: 'The Art of Skills',
    color: '#2ecc71',
    text: 'Skills are learned from the Trainer using Skill Points earned on level-up. Each skill has a cooldown (shown in turns). Using a skill repeatedly increases its RANK — from Novice to Master — making it more powerful!',
  },
  {
    id: 'equipment_guide',
    title: 'Equipment Guide',
    color: '#f39c12',
    text: 'Equip weapons and armor in the Equipment screen (SHIFT+S). Each piece has stats and slot requirements. Some items have SET bonuses when worn together. Watch for item RARITY colors: Gray, Green, Blue, Purple, Gold.',
  },
  {
    id: 'death_and_recovery',
    title: 'Death and Recovery',
    color: '#95a5a6',
    text: 'When you die, ALL your items (equipment and inventory) are dropped at your corpse. You respawn with nothing. If you die again before recovering, the previous corpse is lost. Return to your corpse to collect everything. You lose 10% of your gold on death.',
  },
];

const trainingDrops = ['hp_potion','torn_cloth','rusty_dagger'];
const floorDrops = {
  1:['hp_potion','hp_potion','hp_potion'],
  2:['hp_potion','big_hp_potion','steel_sword','chain_mail'],
  3:['big_hp_potion','flame_sword','plate_armor']
};
const worldMapDrops = ['hp_potion','hp_potion','big_hp_potion','antidote','iron_sword','leather_armor','rusty_dagger'];
