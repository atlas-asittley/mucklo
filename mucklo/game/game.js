// ═══════════════════════════════════════════════════
//  MUCKLO RPG — The Psych-Rock Quest
//  Pure JS/Canvas — No frameworks
// ═══════════════════════════════════════════════════

const C = {
  BLACK:  '#050507', DEEP:   '#0a0a12', DARK:   '#0e0d18',
  PURPLE: '#1a5c2e', VIOLET: '#2ca55e', NEO:    '#39ff14',
  NEO2:   '#ff3cac', CYAN:   '#00e5ff', GOLD:   '#f7c948',
  TEXT:   '#ccc8dd', MUTED:  '#7b7a8e', RED:    '#ff4455',
  WHITE:  '#f0ecff',
};

// ── CHARACTERS ──────────────────────────────────────
const CHARACTERS = [
  {
    id: 'michael',
    name: 'Michael Hall',
    role: 'Vocals / Guitar / Keys',
    type: 'Balanced',
    typeColor: C.CYAN,
    color: C.CYAN,
    desc: 'Frontman and sonic architect. Channels raw emotion into riffs that bend reality. Balanced fighter with powerful finisher moves.',
    hp: 90, maxHp: 90, mp: 60, maxMp: 60,
    stats: { str: 7, def: 6, spd: 6, mag: 8 },
    skills: [
      { name: 'Power Chord',   cost: 0,  type: 'atk', power: 18, desc: 'A crushing open chord. Hits hard, costs nothing.' },
      { name: 'Psych Wave',    cost: 12, type: 'atk', power: 32, desc: 'A psychedelic sonic wave that confuses the enemy.' },
      { name: 'Feedback Loop', cost: 20, type: 'atk', power: 48, desc: 'Escalating amp feedback — devastating burst.' },
      { name: 'Battle Hymn',   cost: 25, type: 'buff', power: 0, desc: 'Rallying cry. Boosts whole party ATK for 3 turns.' },
    ]
  },
  {
    id: 'drew',
    name: 'Drew Sittley',
    role: 'Guitar / Keys',
    type: 'Speed',
    typeColor: C.NEO,
    color: C.NEO,
    desc: 'Lightning-fast fretwork and melodic intuition. Strikes twice before most react. Glass cannon — hits fast, plays risky.',
    hp: 70, maxHp: 70, mp: 70, maxMp: 70,
    stats: { str: 9, def: 4, spd: 10, mag: 7 },
    skills: [
      { name: 'Shred',          cost: 0,  type: 'atk', power: 15, desc: 'Rapid-fire picking. Fast and reliable.' },
      { name: 'Double Pick',    cost: 8,  type: 'atk', power: 26, desc: 'Hits twice in one turn.' },
      { name: 'Tremolo Burst',  cost: 18, type: 'atk', power: 40, desc: 'Frantic tremolo — high damage, lower accuracy.' },
      { name: 'Key Change',     cost: 22, type: 'debuff', power: 0, desc: 'Disorienting modulation. Drops enemy defense.' },
    ]
  },
  {
    id: 'bill',
    name: 'Bill Gant',
    role: 'Bass',
    type: 'Tank',
    typeColor: C.GOLD,
    color: C.GOLD,
    desc: 'The low-end backbone. Immovable and crushing. Absorbs punishment and dishes it right back with that bass-drop finisher.',
    hp: 130, maxHp: 130, mp: 40, maxMp: 40,
    stats: { str: 10, def: 10, spd: 4, mag: 4 },
    skills: [
      { name: 'Bass Thump',     cost: 0,  type: 'atk', power: 20, desc: 'Heavy low-end punch. Always connects.' },
      { name: 'Groove Lock',    cost: 10, type: 'atk', power: 30, desc: 'Locks into a groove — stuns the enemy.' },
      { name: 'Sub Drop',       cost: 20, type: 'atk', power: 55, desc: 'Earth-shaking sub-bass drop. Maximum impact.' },
      { name: 'Wall of Sound',  cost: 18, type: 'buff', power: 0, desc: 'Erects a sonic wall. Boosts own DEF for 3 turns.' },
    ]
  },
  {
    id: 'tj',
    name: 'TJ Randolph',
    role: 'Drums',
    type: 'Support',
    typeColor: C.NEO2,
    color: C.NEO2,
    desc: 'The rhythmic engine that holds it all together. Heals the band, energizes allies, and lays down the groove that wins battles.',
    hp: 80, maxHp: 80, mp: 90, maxMp: 90,
    stats: { str: 6, def: 7, spd: 8, mag: 9 },
    skills: [
      { name: 'Drum Roll',      cost: 0,  type: 'atk', power: 14, desc: 'Relentless drum assault. Basic but solid.' },
      { name: 'Kick Heal',      cost: 15, type: 'heal', power: 30, desc: 'The beat revitalizes — restores HP.' },
      { name: 'Tempo Boost',    cost: 20, type: 'buff', power: 0,  desc: 'Cranks up the BPM. Boosts SPD for 3 turns.' },
      { name: 'Fill of Fury',   cost: 25, type: 'atk', power: 45, desc: 'A furious drum fill that overwhelms the senses.' },
    ]
  },
];

// ── ENEMIES ─────────────────────────────────────────
const ENEMY_POOL = [
  {
    name: 'Anxious Promoter',
    color: '#8866ff',
    hp: 45, maxHp: 45,
    atk: 12, def: 4, spd: 7,
    xp: 20, gold: 15,
    desc: 'Promises everything, delivers nothing.',
    skills: ['Spam Email', 'Reschedule', 'Ghost Them'],
    sprite: 'promoter'
  },
  {
    name: 'Bad Venue',
    color: '#cc4444',
    hp: 70, maxHp: 70,
    atk: 10, def: 12, spd: 3,
    xp: 30, gold: 20,
    desc: 'Sticky floors, broken PA, $50 bar tab minimum.',
    skills: ['No PA System', 'Sticky Floor', 'Early Curfew'],
    sprite: 'venue'
  },
  {
    name: 'Writer\'s Block',
    color: '#666688',
    hp: 55, maxHp: 55,
    atk: 8, def: 6, spd: 5,
    xp: 25, gold: 12,
    desc: 'The blank page stares back.',
    skills: ['Blank Stare', 'Existential Dread', 'Delete All'],
    sprite: 'block'
  },
  {
    name: 'Gear Failure',
    color: '#bb6600',
    hp: 40, maxHp: 40,
    atk: 14, def: 3, spd: 9,
    xp: 22, gold: 18,
    desc: 'A blown amp at the worst possible moment.',
    skills: ['Feedback Screech', 'Blown Fuse', 'Ground Loop'],
    sprite: 'gear'
  },
  {
    name: 'Music Critic',
    color: '#994488',
    hp: 35, maxHp: 35,
    atk: 18, def: 2, spd: 8,
    xp: 28, gold: 25,
    desc: '"Derivative and uninspired." — Local Weekly',
    skills: ['Scathing Review', 'Name Drop', 'Genre Gatekeep'],
    sprite: 'critic'
  },
  {
    name: 'Sound Guy Greg',
    color: '#447799',
    hp: 60, maxHp: 60,
    atk: 9, def: 8, spd: 6,
    xp: 32, gold: 22,
    desc: 'Only interested in his own band.',
    skills: ['Mute Monitors', 'Wrong EQ', 'Long Soundcheck'],
    sprite: 'soundguy'
  },
  {
    name: 'Van Breakdown',
    color: '#886633',
    hp: 80, maxHp: 80,
    atk: 12, def: 10, spd: 2,
    xp: 40, gold: 30,
    desc: 'Middle of I-70. Engine light on.',
    skills: ['Flat Tire', 'Overheating', 'Dead Battery'],
    sprite: 'van'
  },
  {
    name: 'Contract Lawyer',
    color: '#559944',
    hp: 90, maxHp: 90,
    atk: 16, def: 8, spd: 7,
    xp: 50, gold: 40,
    desc: 'Fine print and bad faith.',
    skills: ['Clause 14B', '360 Deal', 'Legal Hold'],
    sprite: 'lawyer'
  },
];

// Boss
const FINAL_BOSS = {
  name: 'THE ALGORITHM',
  color: '#ff3cac',
  hp: 200, maxHp: 200,
  atk: 22, def: 12, spd: 10,
  xp: 500, gold: 200,
  desc: 'A faceless digital tyranny that decides who gets heard.',
  skills: ['Demonetize', 'Shadow Ban', 'Viral Void', 'Content Farm'],
  sprite: 'boss',
  isBoss: true
};

// ── WORLD MAP DATA ──────────────────────────────────
// 25x18 tile map (each tile = 32px → 800x576)
// 0=grass, 1=road, 2=water, 3=tree, 4=building, 5=venue, 6=town
const TILE_SIZE = 32;
const MAP_W = 25, MAP_H = 18;

const MAP = [
  [3,3,3,3,3,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,3,3,3],
  [3,3,3,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,3,3],
  [3,0,0,0,6,6,6,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,3],
  [3,0,0,6,6,6,6,6,0,0,0,3,0,0,0,0,0,0,0,5,5,0,0,0,3],
  [0,0,0,6,6,4,6,6,0,1,0,3,3,0,0,0,0,0,5,5,5,5,0,0,0],
  [0,0,0,6,6,6,6,6,0,1,0,0,3,3,0,0,0,0,5,5,5,5,0,0,0],
  [0,0,0,0,6,6,6,0,0,1,0,0,0,3,0,0,0,0,0,5,5,0,0,0,0],
  [3,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,3],
  [3,3,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,3,3],
  [3,3,3,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,3,3,3],
  [3,3,0,0,2,2,2,2,0,0,0,3,3,0,0,0,0,0,0,1,0,0,0,3,3],
  [3,0,0,0,0,2,2,0,0,0,3,3,3,3,0,0,0,0,0,1,0,0,0,0,3],
  [0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,4,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,4,0,1,0,0,0,0,0],
  [0,0,4,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,3],
  [3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
];

// Points of interest on map
const POI = [
  { x: 5, y: 4, type: 'town', name: 'Champaign-Urbana', msg: 'Home turf. The crowd knows every word. +10 HP restored.', heal: 10 },
  { x: 19, y: 4, type: 'venue', name: 'The Psych Barn', msg: 'A legendary venue. Strange energy. Battle awaits inside.', battle: true },
  { x: 9, y: 7, type: 'road', name: 'I-74 West', msg: 'The highway stretches west. Tour life.' },
  { x: 17, y: 12, type: 'building', name: 'Abandoned Studio', msg: 'Dusty boards, broken dreams. Enemies lurk here.', battle: true },
  { x: 2, y: 14, type: 'building', name: 'Practice Space', msg: 'A cramped room full of gear. Restores MP.', healMp: 20 },
  { x: 19, y: 14, type: 'road', name: 'Final Stretch', msg: 'The road leads to the Algorithm\'s data center. Are you ready?', bossHint: true },
];

// Boss location
const BOSS_POS = { x: 21, y: 16 };

// ═══════════════════════════════════════════════════
//  SPRITE DRAWING FUNCTIONS
// ═══════════════════════════════════════════════════
const Sprites = {
  // Draw character sprite (48x48)
  character(ctx, char, x, y, size = 48, frame = 0) {
    const s = size / 48;
    ctx.save();
    ctx.translate(x, y);
    const c = char.color;

    // Body
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(14*s, 20*s, 20*s, 22*s);

    // Head
    ctx.fillStyle = '#f5d5b0';
    ctx.fillRect(16*s, 8*s, 16*s, 14*s);

    // Hair
    ctx.fillStyle = c;
    ctx.fillRect(16*s, 8*s, 16*s, 5*s);
    ctx.fillRect(14*s, 10*s, 4*s, 8*s);

    // Eyes
    ctx.fillStyle = C.BLACK;
    ctx.fillRect(19*s, 14*s, 3*s, 3*s);
    ctx.fillRect(26*s, 14*s, 3*s, 3*s);

    // Arms
    ctx.fillStyle = c;
    ctx.fillRect(8*s, 20*s, 8*s, 16*s);
    ctx.fillRect(32*s, 20*s, 8*s, 16*s);

    // Legs
    ctx.fillStyle = '#222235';
    ctx.fillRect(14*s, 40*s, 8*s, 8*s);
    ctx.fillRect(26*s, 40*s, 8*s, 8*s);

    // Instrument indicator
    if (char.id === 'michael') {
      // Guitar body
      ctx.fillStyle = C.GOLD;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(34*s, 22*s, 6*s, 14*s);
      ctx.fillRect(36*s, 20*s, 2*s, 4*s);
    } else if (char.id === 'drew') {
      // Guitar (different)
      ctx.fillStyle = C.NEO;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(34*s, 20*s, 7*s, 16*s);
      ctx.fillRect(37*s, 18*s, 2*s, 4*s);
    } else if (char.id === 'bill') {
      // Bass (thicker)
      ctx.fillStyle = C.GOLD;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(34*s, 20*s, 8*s, 18*s);
      ctx.fillRect(37*s, 18*s, 2*s, 4*s);
    } else if (char.id === 'tj') {
      // Drumsticks
      ctx.fillStyle = '#ccaa77';
      ctx.globalAlpha = 0.9;
      ctx.fillRect(6*s, 18*s, 3*s, 20*s);
      ctx.fillRect(38*s, 18*s, 3*s, 20*s);
    }

    // Neon glow dot
    ctx.globalAlpha = 0.6 + Math.sin(frame * 0.1) * 0.3;
    ctx.fillStyle = c;
    ctx.shadowColor = c;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(24*s, 6*s, 3*s, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 1;
    ctx.restore();
  },

  // Enemy sprites
  enemy(ctx, enemy, x, y, frame = 0) {
    ctx.save();
    ctx.translate(x, y);
    const c = enemy.color;
    const pulse = Math.sin(frame * 0.08) * 0.15;

    ctx.globalAlpha = 0.9 + pulse;
    ctx.shadowColor = c;
    ctx.shadowBlur = 12 + pulse * 20;

    switch(enemy.sprite) {
      case 'promoter':
        // Suit silhouette
        ctx.fillStyle = c;
        ctx.fillRect(20, 10, 24, 30); // body
        ctx.fillStyle = '#f5d5b0';
        ctx.fillRect(24, 0, 16, 14); // head
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(28, 12, 8, 10); // shirt/tie
        ctx.fillStyle = c;
        ctx.fillRect(30, 12, 4, 10); // tie
        ctx.fillRect(20, 38, 8, 8);
        ctx.fillRect(36, 38, 8, 8);
        break;
      case 'venue':
        // Building shape
        ctx.fillStyle = c;
        ctx.fillRect(10, 15, 44, 32);
        ctx.fillStyle = '#222';
        ctx.fillRect(22, 25, 12, 22); // door
        ctx.fillStyle = c;
        ctx.fillRect(10, 8, 44, 10); // sign
        ctx.fillStyle = C.BLACK;
        ctx.font = '7px Courier New';
        ctx.fillText('BAD VENUE', 13, 16);
        break;
      case 'block':
        // Blank page / ghost
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.3 + pulse * 2;
        ctx.fillRect(12, 5, 40, 50);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(18, 15, 28, 4);
        ctx.fillRect(18, 23, 20, 4);
        ctx.fillRect(18, 31, 24, 4);
        ctx.fillStyle = '#ff4455';
        ctx.fillRect(22, 40, 20, 8);
        break;
      case 'gear':
        // Exploding amp
        ctx.fillStyle = c;
        ctx.fillRect(8, 12, 48, 36);
        ctx.fillStyle = '#000';
        ctx.fillRect(16, 18, 20, 20);
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(26, 28, 8, 0, Math.PI*2);
        ctx.fill();
        // sparks
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5 + pulse;
        for (let i = 0; i < 6; i++) {
          const a = (i/6)*Math.PI*2 + frame*0.2;
          ctx.beginPath();
          ctx.moveTo(26+Math.cos(a)*10, 28+Math.sin(a)*10);
          ctx.lineTo(26+Math.cos(a)*18, 28+Math.sin(a)*18);
          ctx.stroke();
        }
        break;
      case 'critic':
        // Snooty figure with notepad
        ctx.fillStyle = '#f5d5b0';
        ctx.fillRect(22, 2, 16, 14);
        ctx.fillStyle = c;
        ctx.fillRect(18, 16, 24, 28);
        ctx.fillStyle = '#fff';
        ctx.fillRect(36, 20, 10, 14); // notepad
        ctx.fillStyle = c;
        ctx.fillRect(20, 44, 8, 8);
        ctx.fillRect(36, 44, 8, 8);
        // glasses
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(23, 9, 6, 5);
        ctx.strokeRect(31, 9, 6, 5);
        ctx.beginPath();
        ctx.moveTo(29, 11); ctx.lineTo(31, 11);
        ctx.stroke();
        break;
      case 'soundguy':
        // Guy at console
        ctx.fillStyle = '#f5d5b0';
        ctx.fillRect(22, 4, 16, 14);
        ctx.fillStyle = c;
        ctx.fillRect(18, 18, 24, 26);
        ctx.fillRect(18, 44, 8, 8);
        ctx.fillRect(34, 44, 8, 8);
        // headphones
        ctx.strokeStyle = c;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(30, 10, 10, Math.PI, 0);
        ctx.stroke();
        ctx.fillStyle = c;
        ctx.fillRect(18, 10, 5, 8);
        ctx.fillRect(37, 10, 5, 8);
        break;
      case 'van':
        // Broken van
        ctx.fillStyle = c;
        ctx.fillRect(4, 20, 56, 28);
        ctx.fillRect(4, 12, 30, 12);
        ctx.fillStyle = '#4488cc';
        ctx.fillRect(8, 14, 10, 8);
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(14, 48, 8, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(46, 48, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ff4455';
        ctx.fillRect(4, 25, 6, 4); // lights
        break;
      case 'lawyer':
        // Fancy suit
        ctx.fillStyle = '#f5d5b0';
        ctx.fillRect(22, 2, 16, 14);
        ctx.fillStyle = '#222244';
        ctx.fillRect(16, 16, 28, 32);
        ctx.fillStyle = '#fff';
        ctx.fillRect(26, 16, 8, 14);
        ctx.fillStyle = c;
        ctx.fillRect(29, 16, 2, 14);
        ctx.fillRect(16, 48, 10, 8);
        ctx.fillRect(34, 48, 10, 8);
        // briefcase
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(46, 24, 14, 12);
        ctx.strokeStyle = '#ccaa55';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, 20, 6, 4);
        break;
      case 'boss':
        // The Algorithm — glitchy digital entity
        ctx.globalAlpha = 0.6 + Math.abs(Math.sin(frame * 0.15)) * 0.4;
        const colors2 = [c, '#00ffff', '#ffffff', '#ff0088'];
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = colors2[i % colors2.length];
          const glitchX = Math.random() < 0.1 ? 10 : 0;
          ctx.fillRect(8 + glitchX, 4 + i*7, 48, 6);
        }
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = C.BLACK;
        ctx.fillRect(20, 18, 24, 20);
        ctx.fillStyle = c;
        ctx.font = 'bold 8px Courier New';
        ctx.fillText('01010', 22, 28);
        ctx.fillText('11001', 22, 36);
        // eyes
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fillRect(24, 20, 6, 6);
        ctx.fillRect(34, 20, 6, 6);
        break;
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  },

  // Overworld player dot
  player(ctx, x, y, color, frame) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 8 + Math.sin(frame * 0.1) * 4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 8, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  },
};

// ═══════════════════════════════════════════════════
//  TITLE SCREEN ANIMATIONS
// ═══════════════════════════════════════════════════
function drawTitleArt(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Band silhouette
  const chars = [
    { x: 30, color: C.CYAN, h: 90 },
    { x: 90, color: C.NEO, h: 95 },
    { x: 150, color: C.GOLD, h: 85 },
    { x: 210, color: C.NEO2, h: 90 },
  ];

  chars.forEach((c, i) => {
    const pulse = Math.sin(Date.now() * 0.002 + i * 1.5) * 5;
    ctx.save();
    ctx.translate(c.x, 110 - c.h + pulse);
    ctx.shadowColor = c.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = c.color;
    ctx.globalAlpha = 0.7;
    // simple silhouette
    ctx.fillRect(10, 0, 14, 40); // body
    ctx.beginPath(); ctx.arc(17, -8, 10, 0, Math.PI*2); ctx.fill(); // head
    ctx.fillRect(2, 8, 8, 24); // arm left
    ctx.fillRect(24, 8, 8, 24); // arm right
    ctx.fillRect(11, 38, 6, 18); // leg left
    ctx.fillRect(19, 38, 6, 18); // leg right
    ctx.shadowBlur = 0;
    ctx.restore();
  });

  // Sound wave under them
  ctx.strokeStyle = C.NEO;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  for (let x = 0; x < 280; x++) {
    const y = 112 + Math.sin((x * 0.05) + Date.now() * 0.003) * 6
                   + Math.sin((x * 0.12) + Date.now() * 0.005) * 3;
    x === 0 ? ctx.moveTo(x+10, y) : ctx.lineTo(x+10, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ═══════════════════════════════════════════════════
//  MAIN GAME STATE & ENGINE
// ═══════════════════════════════════════════════════
const Game = (() => {
  let state = 'title';
  let selectedChar = null;
  let player = null;
  let frame = 0;
  let titleAnim = null;
  let worldState = null;
  let battleState = null;
  let dialogQueue = [];
  let dialogActive = false;
  let dialogCallback = null;

  // ── SCREENS ──
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id + '-screen').classList.add('active');
  }

  // ── TITLE ──
  function initTitle() {
    state = 'title';
    showScreen('title');
    const artCanvas = document.getElementById('title-art-canvas');
    if (titleAnim) clearInterval(titleAnim);
    titleAnim = setInterval(() => drawTitleArt(artCanvas), 50);
  }

  function startCharSelect() {
    if (titleAnim) clearInterval(titleAnim);
    showScreen('char');
    buildCharGrid();
  }

  // ── CHARACTER SELECT ──
  function buildCharGrid() {
    const grid = document.getElementById('char-grid');
    grid.innerHTML = '';
    CHARACTERS.forEach((char) => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.dataset.id = char.id;

      // Sprite canvas
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 48; spriteCanvas.height = 48;
      spriteCanvas.style.flexShrink = '0';
      Sprites.character(spriteCanvas.getContext('2d'), char, 0, 0, 48, 0);
      card.appendChild(spriteCanvas);

      const nameEl = document.createElement('div');
      nameEl.className = 'char-name';
      nameEl.textContent = char.name;
      card.appendChild(nameEl);

      const roleEl = document.createElement('div');
      roleEl.className = 'char-role';
      roleEl.textContent = char.role;
      card.appendChild(roleEl);

      const typeEl = document.createElement('div');
      typeEl.className = 'char-type';
      typeEl.style.color = char.typeColor;
      typeEl.textContent = char.type;
      card.appendChild(typeEl);

      const statsEl = document.createElement('div');
      statsEl.className = 'char-stats';
      statsEl.innerHTML =
        renderStatBar('STR', char.stats.str, char.color) +
        renderStatBar('DEF', char.stats.def, char.color) +
        renderStatBar('SPD', char.stats.spd, char.color) +
        renderStatBar('MAG', char.stats.mag, char.color);
      card.appendChild(statsEl);

      card.addEventListener('mouseenter', () => {
        document.getElementById('char-desc').textContent = char.desc;
      });
      card.addEventListener('click', () => selectChar(char.id));
      grid.appendChild(card);
    });
  }

  function renderStatBar(label, val, color) {
    const pct = Math.round((val / 10) * 100);
    return `<div class="stat-bar-row">
      <span>${label}</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
  }

  function selectChar(id) {
    document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`[data-id="${id}"]`)?.classList.add('selected');
    selectedChar = CHARACTERS.find(c => c.id === id);
    document.getElementById('start-quest-btn').disabled = false;
    document.getElementById('char-desc').textContent = selectedChar.desc;
  }

  // ── WORLD ──
  function startWorld() {
    if (!selectedChar) return;

    player = JSON.parse(JSON.stringify(selectedChar)); // deep copy
    worldState = {
      px: 9, py: 8,      // player tile position
      encounterSteps: 0,
      enemiesDefeated: 0,
      bossDefeated: false,
      bossUnlocked: false,
      visitedPOI: new Set(),
    };

    showScreen('world');
    state = 'world';
    startWorldLoop();

    // Opening dialog
    setTimeout(() => {
      showDialog('NARRATOR',
        `The Midwest stretches endlessly under a neon sky. ${player.name} sets out to find the Algorithm — ` +
        `the faceless system that silences independent music. Explore the map, survive random encounters, and reach the data center.`,
        () => showDialog('NARRATOR', 'Use ARROW KEYS to move. Avoid enemies — or fight them. Find venues and towns for help. Good luck.', null)
      );
    }, 500);
  }

  // ── WORLD LOOP ──
  let worldLoopId = null;
  function startWorldLoop() {
    if (worldLoopId) cancelAnimationFrame(worldLoopId);
    function loop() {
      if (state === 'world') {
        frame++;
        drawWorld();
        worldLoopId = requestAnimationFrame(loop);
      }
    }
    loop();
  }

  const TILE_COLORS = {
    0: '#1a2a12', // grass
    1: '#3a3222', // road
    2: '#0a2040', // water
    3: '#0e1a0a', // tree
    4: '#1a1a2a', // building
    5: '#1a2a3a', // venue
    6: '#121e0e', // town
  };

  function drawWorld() {
    const canvas = document.getElementById('world-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 800, 600);

    // Background
    ctx.fillStyle = C.BLACK;
    ctx.fillRect(0, 0, 800, 600);

    // Tiles
    for (let ty = 0; ty < MAP_H; ty++) {
      for (let tx = 0; tx < MAP_W; tx++) {
        const tile = MAP[ty][tx];
        const px = tx * TILE_SIZE;
        const py = ty * TILE_SIZE + 12; // offset for HUD

        ctx.fillStyle = TILE_COLORS[tile] || '#111';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Tile details
        if (tile === 3) {
          // Trees
          ctx.fillStyle = '#0d2208';
          ctx.fillRect(px+8, py+4, TILE_SIZE-16, TILE_SIZE-8);
          ctx.fillStyle = '#1a4010';
          ctx.beginPath();
          ctx.moveTo(px+TILE_SIZE/2, py+2);
          ctx.lineTo(px+6, py+TILE_SIZE-4);
          ctx.lineTo(px+TILE_SIZE-6, py+TILE_SIZE-4);
          ctx.closePath();
          ctx.fill();
        } else if (tile === 1) {
          // Road markings
          ctx.fillStyle = 'rgba(255,220,50,0.15)';
          if (tx % 3 === 0) ctx.fillRect(px+14, py+14, 4, 4);
        } else if (tile === 2) {
          // Water shimmer
          ctx.fillStyle = `rgba(0,100,200,${0.2 + Math.sin(frame*0.05+tx+ty)*0.1})`;
          ctx.fillRect(px+2, py+2, TILE_SIZE-4, TILE_SIZE-4);
        } else if (tile === 5) {
          // Venue — glowing
          ctx.fillStyle = `rgba(57,255,20,${0.05 + Math.sin(frame*0.08+tx)*0.05})`;
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = C.NEO;
          ctx.globalAlpha = 0.4 + Math.sin(frame*0.1)*0.2;
          ctx.fillRect(px+8, py+4, TILE_SIZE-16, 6);
          ctx.globalAlpha = 1;
        } else if (tile === 6) {
          // Town
          ctx.fillStyle = 'rgba(0,229,255,0.05)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        } else if (tile === 4) {
          // Building
          ctx.strokeStyle = 'rgba(150,150,180,0.2)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px+2, py+2, TILE_SIZE-4, TILE_SIZE-4);
        }

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }

    // Boss location marker
    if (!worldState.bossDefeated) {
      const bx = BOSS_POS.x * TILE_SIZE;
      const by = BOSS_POS.y * TILE_SIZE + 12;
      ctx.fillStyle = `rgba(255,60,172,${0.15 + Math.sin(frame*0.1)*0.1})`;
      ctx.fillRect(bx, by, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = C.NEO2;
      ctx.globalAlpha = 0.6 + Math.sin(frame*0.12)*0.3;
      ctx.font = 'bold 18px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('⚠', bx + TILE_SIZE/2, by + TILE_SIZE/2 + 7);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';

      if (worldState.bossUnlocked) {
        ctx.fillStyle = C.NEO2;
        ctx.globalAlpha = 0.5 + Math.sin(frame*0.15)*0.4;
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('ALGORITHM', bx + TILE_SIZE/2, by - 4);
        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
      }
    }

    // POI markers
    POI.forEach(poi => {
      const px = poi.x * TILE_SIZE;
      const py = poi.y * TILE_SIZE + 12;
      if (!worldState.visitedPOI.has(poi.name) || poi.battle) {
        const colors = { town: C.CYAN, venue: C.NEO, road: C.GOLD, building: C.MUTED };
        const col = colors[poi.type] || C.TEXT;
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.4 + Math.sin(frame*0.08 + poi.x)*0.2;
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE/2, py + TILE_SIZE/2, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

    // Player
    const playerScreenX = worldState.px * TILE_SIZE;
    const playerScreenY = worldState.py * TILE_SIZE + 12;
    Sprites.player(ctx, playerScreenX, playerScreenY, player.color, frame);

    // HUD
    drawWorldHUD(ctx);
  }

  function drawWorldHUD(ctx) {
    // Top bar
    ctx.fillStyle = 'rgba(5,5,7,0.9)';
    ctx.fillRect(0, 0, 800, 13);
    ctx.strokeStyle = 'rgba(57,255,20,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(800, 12); ctx.stroke();

    ctx.font = '8px Courier New';
    ctx.fillStyle = C.NEO;
    ctx.fillText(`${player.name.toUpperCase()}`, 8, 9);

    // HP
    const hpPct = player.hp / player.maxHp;
    ctx.fillStyle = C.MUTED;
    ctx.fillText(`HP`, 160, 9);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(176, 2, 80, 8);
    ctx.fillStyle = hpPct > 0.5 ? C.NEO : hpPct > 0.25 ? C.GOLD : C.RED;
    ctx.fillRect(176, 2, 80 * hpPct, 8);
    ctx.fillStyle = C.TEXT;
    ctx.fillText(`${player.hp}/${player.maxHp}`, 260, 9);

    // MP
    ctx.fillStyle = C.MUTED;
    ctx.fillText(`MP`, 330, 9);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(346, 2, 60, 8);
    ctx.fillStyle = C.CYAN;
    ctx.fillRect(346, 2, 60 * (player.mp / player.maxMp), 8);
    ctx.fillStyle = C.TEXT;
    ctx.fillText(`${player.mp}/${player.maxMp}`, 410, 9);

    // Enemies defeated
    ctx.fillStyle = C.GOLD;
    ctx.fillText(`BATTLES: ${worldState.enemiesDefeated}`, 550, 9);

    // Controls hint
    ctx.fillStyle = C.MUTED;
    ctx.fillText(`ARROWS=MOVE  ENTER=INTERACT`, 620, 9);
  }

  // ── DIALOG SYSTEM ──
  function showDialog(speaker, text, callback) {
    const box = document.getElementById('dialog-box');
    document.getElementById('dialog-speaker').textContent = speaker;
    document.getElementById('dialog-text').textContent = text;
    box.classList.add('active');
    dialogActive = true;
    dialogCallback = callback;
    state = 'dialog';
  }

  function closeDialog() {
    if (!dialogActive) return;
    document.getElementById('dialog-box').classList.remove('active');
    dialogActive = false;
    const cb = dialogCallback;
    dialogCallback = null;
    if (cb) {
      cb();
    } else {
      state = 'world';
      startWorldLoop();
    }
  }

  // ── INPUT ──
  document.addEventListener('keydown', (e) => {
    if (state === 'title') {
      if (e.key === 'Enter' || e.key === ' ') startCharSelect();
      return;
    }
    if (state === 'dialog') {
      if (e.key === 'Enter' || e.key === ' ') closeDialog();
      return;
    }
    if (state === 'world') {
      handleWorldInput(e.key);
      return;
    }
    if (state === 'battle') {
      Battle.handleInput(e.key);
      return;
    }
  });

  function handleWorldInput(key) {
    let nx = worldState.px, ny = worldState.py;
    if (key === 'ArrowUp') ny--;
    else if (key === 'ArrowDown') ny++;
    else if (key === 'ArrowLeft') nx--;
    else if (key === 'ArrowRight') nx++;
    else if (key === 'Enter' || key === ' ') {
      checkInteract();
      return;
    } else return;

    // Bounds
    if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return;

    // Collision
    const tile = MAP[ny][nx];
    if (tile === 3 || tile === 2) return; // trees and water block

    worldState.px = nx;
    worldState.py = ny;

    // Check boss
    if (nx === BOSS_POS.x && ny === BOSS_POS.y) {
      if (!worldState.bossDefeated) {
        startBattle(JSON.parse(JSON.stringify(FINAL_BOSS)), true);
        return;
      }
    }

    // Check POI
    const poi = POI.find(p => p.x === nx && p.y === ny);
    if (poi) {
      handlePOI(poi);
      return;
    }

    // Random encounter
    worldState.encounterSteps++;
    const encounterChance = tile === 1 ? 0.08 : 0.12;
    if (worldState.encounterSteps > 3 && Math.random() < encounterChance) {
      worldState.encounterSteps = 0;
      const enemy = JSON.parse(JSON.stringify(
        ENEMY_POOL[Math.floor(Math.random() * ENEMY_POOL.length)]
      ));
      startBattle(enemy, false);
    }

    // Unlock boss after enough battles
    if (worldState.enemiesDefeated >= 5 && !worldState.bossUnlocked) {
      worldState.bossUnlocked = true;
      showDialog('SYSTEM', 'You\'ve proven yourself in battle. The Algorithm\'s signal grows stronger. Head to the northeast — the data center awaits.', null);
    }
  }

  function handlePOI(poi) {
    state = 'dialog';
    let msg = poi.msg;

    if (poi.heal && !worldState.visitedPOI.has(poi.name)) {
      const amount = poi.heal;
      player.hp = Math.min(player.maxHp, player.hp + amount);
      msg += ` [+${amount} HP]`;
      worldState.visitedPOI.add(poi.name);
    }
    if (poi.healMp && !worldState.visitedPOI.has(poi.name)) {
      const amount = poi.healMp;
      player.mp = Math.min(player.maxMp, player.mp + amount);
      msg += ` [+${amount} MP]`;
      worldState.visitedPOI.add(poi.name);
    }

    showDialog(poi.name.toUpperCase(), msg, () => {
      if (poi.battle) {
        const enemy = JSON.parse(JSON.stringify(
          ENEMY_POOL[Math.floor(Math.random() * (ENEMY_POOL.length - 2)) + 2]
        ));
        startBattle(enemy, false);
      } else {
        state = 'world';
        startWorldLoop();
      }
    });
  }

  function checkInteract() {
    if (!worldState) return;
    const poi = POI.find(p => {
      return Math.abs(p.x - worldState.px) <= 1 && Math.abs(p.y - worldState.py) <= 1;
    });
    if (poi) handlePOI(poi);
  }

  // ── BATTLE ──
  function startBattle(enemy, isBoss) {
    if (worldLoopId) cancelAnimationFrame(worldLoopId);
    state = 'battle';
    showScreen('battle');
    Battle.init(player, enemy, isBoss, worldState);
  }

  function onBattleEnd(won, isBoss) {
    if (won) {
      worldState.enemiesDefeated++;
      if (isBoss) {
        worldState.bossDefeated = true;
        showEndScreen(true);
        return;
      }
      // Restore some HP/MP after winning
      player.hp = Math.min(player.maxHp, player.hp + 8);
      player.mp = Math.min(player.maxMp, player.mp + 6);
    } else {
      showEndScreen(false);
      return;
    }
    showScreen('world');
    state = 'world';
    startWorldLoop();
  }

  function showEndScreen(won) {
    showScreen('end');
    state = 'end';
    const title = document.getElementById('end-title');
    const msg = document.getElementById('end-msg');
    const stats = document.getElementById('end-stats');

    if (won) {
      title.textContent = 'YOU WIN';
      title.className = 'end-title win';
      msg.textContent = 'The Algorithm crashes. Its servers go dark. For one beautiful moment, the feed is silent — and real music floods back in. MUCKLO plays on.';
      stats.textContent = `Battles fought: ${worldState.enemiesDefeated} · Character: ${player.name} · HP remaining: ${player.hp}/${player.maxHp}`;
    } else {
      title.textContent = 'GAME OVER';
      title.className = 'end-title lose';
      msg.textContent = 'The tour collapses. The van breaks down on I-70. The venue goes dark. But the music never dies — hit retry.';
      stats.textContent = `Battles fought: ${worldState.enemiesDefeated} · Character: ${player.name}`;
    }
  }

  function restart() {
    selectedChar = null;
    player = null;
    worldState = null;
    frame = 0;
    initTitle();
  }

  function handleAction() {
    if (state === 'dialog') closeDialog();
    else if (state === 'world') checkInteract();
  }

  return { startCharSelect, startWorld, restart, onBattleEnd, initTitle, handleWorldInput, closeDialog, checkInteract, handleAction };
})();

// ═══════════════════════════════════════════════════
//  BATTLE ENGINE
// ═══════════════════════════════════════════════════
const Battle = (() => {
  let player, enemy, isBoss, worldRef;
  let phase = 'select'; // select | anim | enemy | result
  let selectedSkill = 0;
  let log = [];
  let frame = 0;
  let animData = null;
  let loopId = null;
  let turnEffects = { playerAtkBuff: 0, playerDefBuff: 0, playerSpdBuff: 0, enemyDefDebuff: 0 };

  function init(p, e, boss, ws) {
    player = p;
    enemy = e;
    isBoss = boss;
    worldRef = ws;
    phase = 'select';
    selectedSkill = 0;
    frame = 0;
    log = [`A wild ${enemy.name} appears!`];
    animData = null;
    turnEffects = { playerAtkBuff: 0, playerDefBuff: 0, playerSpdBuff: 0, enemyDefDebuff: 0 };

    startLoop();

    // Canvas tap for skill selection (also provides desktop click support)
    const bCanvas = document.getElementById('battle-canvas');
    bCanvas.onclick = handleBattleCanvasTap;
    bCanvas.ontouchstart = handleBattleCanvasTap;

    // Populate HTML battle skill buttons (shown on mobile)
    const typeColors = { atk: C.NEO2, heal: C.NEO, buff: C.GOLD, debuff: C.CYAN };
    player.skills.forEach((skill, i) => {
      const btn = document.getElementById(`bskill-${i}`);
      if (!btn) return;
      btn.innerHTML =
        `<span class="bskill-name">${skill.name}</span>` +
        `<span class="bskill-meta"><span style="color:${skill.cost === 0 ? C.MUTED : C.CYAN}">${skill.cost === 0 ? 'FREE' : `MP: ${skill.cost}`}</span>` +
        ` <span style="color:${typeColors[skill.type] || C.TEXT}">[${skill.type.toUpperCase()}]</span></span>` +
        `<span class="bskill-desc">${skill.desc}</span>`;
      btn.onclick = () => {
        if (phase !== 'select') return;
        selectedSkill = i;
        useSkill(i);
      };
    });
  }

  function startLoop() {
    if (loopId) cancelAnimationFrame(loopId);
    function loop() {
      frame++;
      draw();
      loopId = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopLoop() {
    if (loopId) { cancelAnimationFrame(loopId); loopId = null; }
  }

  // ── DRAW BATTLE ──
  function draw() {
    const canvas = document.getElementById('battle-canvas');
    const ctx = canvas.getContext('2d');
    const W = 800, H = 600;

    // BG
    ctx.fillStyle = C.BLACK;
    ctx.fillRect(0, 0, W, H);

    // Scan lines
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);

    // BG gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, isBoss ? 'rgba(40,0,20,0.9)' : 'rgba(5,15,10,0.9)');
    grad.addColorStop(1, C.BLACK);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Grid floor
    ctx.strokeStyle = isBoss ? 'rgba(255,60,172,0.05)' : 'rgba(57,255,20,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 300; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Stage
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(0, 290, W, 3);

    // Enemy
    const enemyX = 460, enemyY = 140;
    Sprites.enemy(ctx, enemy, enemyX, enemyY, frame);

    // Enemy name + HP
    drawHPBar(ctx, enemyX + 5, enemyY - 30, enemy.name, enemy.hp, enemy.maxHp, enemy.color, false);

    // Player sprite
    const playerX = 140, playerY = 200;
    const bobY = Math.sin(frame * 0.05) * 3;
    Sprites.character(ctx, player, playerX, playerY + bobY, 64, frame);

    // Player stats panel
    drawPlayerPanel(ctx);

    // Skill menu
    drawSkillMenu(ctx);

    // Battle log
    drawLog(ctx);

    // Buffs display
    drawBuffs(ctx);

    // Flash on hit
    if (animData && animData.type === 'hit' && animData.timer > 0) {
      const alpha = animData.timer / 20 * 0.4;
      ctx.fillStyle = animData.target === 'enemy'
        ? `rgba(57,255,20,${alpha})`
        : `rgba(255,60,172,${alpha})`;
      ctx.fillRect(0, 0, W, H);
      animData.timer--;

      // Damage number
      ctx.font = 'bold 28px Courier New';
      ctx.fillStyle = animData.target === 'enemy' ? C.NEO : C.NEO2;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 15;
      const dmgX = animData.target === 'enemy' ? 490 : 170;
      const dmgY = 180 - (20 - animData.timer) * 2;
      ctx.textAlign = 'center';
      ctx.fillText(`-${animData.damage}`, dmgX, dmgY);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';

      if (animData.timer <= 0) {
        const savedPhase = phase;
        animData = null;
        if (savedPhase === 'enemy') { phase = 'enemy'; setTimeout(() => doEnemyTurn(), 300); }
        else if (savedPhase === 'result') endBattle();
        else if (savedPhase === 'result-lose') endBattle();
      }
    }

    // Heal number
    if (animData && animData.type === 'heal' && animData.timer > 0) {
      ctx.font = 'bold 24px Courier New';
      ctx.fillStyle = C.NEO;
      ctx.textAlign = 'center';
      ctx.fillText(`+${animData.amount}`, 180, 190 - (20 - animData.timer) * 1.5);
      ctx.textAlign = 'left';
      animData.timer--;
      if (animData.timer <= 0) {
        animData = null;
        phase = 'enemy';
        setTimeout(() => doEnemyTurn(), 300);
      }
    }

    // Buff anim
    if (animData && animData.type === 'buff' && animData.timer > 0) {
      ctx.font = '16px Courier New';
      ctx.fillStyle = C.GOLD;
      ctx.textAlign = 'center';
      ctx.fillText(animData.text, 200, 190 - (20 - animData.timer) * 1.5);
      ctx.textAlign = 'left';
      animData.timer--;
      if (animData.timer <= 0) {
        animData = null;
        phase = 'enemy';
        setTimeout(() => doEnemyTurn(), 400);
      }
    }

    // Sync HTML battle button states
    if (player) {
      player.skills.forEach((skill, i) => {
        const btn = document.getElementById(`bskill-${i}`);
        if (btn) btn.disabled = phase !== 'select' || player.mp < skill.cost;
      });
    }
  }

  function drawHPBar(ctx, x, y, name, hp, maxHp, color, isPlayer) {
    const barW = 160;
    ctx.font = '9px Courier New';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillText(name.toUpperCase(), x, y);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, y + 4, barW, 6);
    const pct = Math.max(0, hp / maxHp);
    ctx.fillStyle = pct > 0.5 ? C.NEO : pct > 0.25 ? C.GOLD : C.RED;
    ctx.fillRect(x, y + 4, barW * pct, 6);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(x, y + 4, barW, 6);

    ctx.font = '8px Courier New';
    ctx.fillStyle = C.TEXT;
    ctx.fillText(`${hp}/${maxHp}`, x + barW + 6, y + 10);
  }

  function drawPlayerPanel(ctx) {
    ctx.fillStyle = 'rgba(5,5,7,0.85)';
    ctx.fillRect(10, 350, 220, 100);
    ctx.strokeStyle = `rgba(${hexToRgb(player.color)},0.4)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 350, 220, 100);

    drawHPBar(ctx, 20, 370, player.name, player.hp, player.maxHp, player.color, true);

    ctx.font = '8px Courier New';
    ctx.fillStyle = C.MUTED;
    ctx.fillText('MP', 20, 398);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(36, 390, 120, 5);
    ctx.fillStyle = C.CYAN;
    ctx.fillRect(36, 390, 120 * (player.mp / player.maxMp), 5);
    ctx.fillStyle = C.TEXT;
    ctx.fillText(`${player.mp}/${player.maxMp}`, 160, 396);

    ctx.fillStyle = C.MUTED;
    ctx.font = '7px Courier New';
    ctx.fillText(`TYPE: ${player.type}`, 20, 420);
    ctx.fillText(`SPD: ${player.stats.spd}`, 120, 420);
    ctx.fillText(`DEF: ${player.stats.def}`, 170, 420);
    ctx.fillText(`STR: ${player.stats.str}`, 20, 432);
    ctx.fillText(`MAG: ${player.stats.mag}`, 120, 432);
  }

  function drawSkillMenu(ctx) {
    ctx.fillStyle = 'rgba(5,5,7,0.88)';
    ctx.fillRect(10, 460, 780, 130);
    ctx.strokeStyle = `rgba(${hexToRgb(player.color)},0.3)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 460, 780, 130);

    ctx.font = '7px Courier New';
    ctx.fillStyle = C.MUTED;
    if (phase === 'select') {
      ctx.fillText('[ ← → SELECT SKILL   ENTER = USE ]', 14, 473);
    } else {
      ctx.fillStyle = C.MUTED;
      ctx.fillText(phase === 'enemy' ? '[ Enemy turn... ]' : '[ Processing... ]', 14, 473);
    }

    const skills = player.skills;
    skills.forEach((skill, i) => {
      const col = i % 2 === 0 ? 14 : 402;
      const row = Math.floor(i / 2);
      const sy = 484 + row * 44;
      const isSelected = i === selectedSkill && phase === 'select';
      const canAfford = player.mp >= skill.cost;

      ctx.fillStyle = isSelected
        ? `rgba(${hexToRgb(player.color)},0.1)`
        : 'rgba(255,255,255,0.02)';
      ctx.fillRect(col, sy, 378, 38);

      if (isSelected) {
        ctx.strokeStyle = player.color;
        ctx.shadowColor = player.color;
        ctx.shadowBlur = 8;
        ctx.strokeRect(col, sy, 378, 38);
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.strokeRect(col, sy, 378, 38);
      }

      ctx.font = 'bold 9px Courier New';
      ctx.fillStyle = canAfford ? (isSelected ? player.color : C.TEXT) : C.MUTED;
      ctx.fillText(`${i === selectedSkill && phase === 'select' ? '▶ ' : '  '}${skill.name}`, col + 6, sy + 14);

      ctx.font = '7px Courier New';
      ctx.fillStyle = skill.cost === 0 ? C.MUTED : (canAfford ? C.CYAN : C.RED);
      ctx.fillText(skill.cost === 0 ? 'FREE' : `MP: ${skill.cost}`, col + 240, sy + 14);

      const typeColors = { atk: C.NEO2, heal: C.NEO, buff: C.GOLD, debuff: C.CYAN };
      ctx.fillStyle = typeColors[skill.type] || C.TEXT;
      ctx.fillText(`[${skill.type.toUpperCase()}]`, col + 290, sy + 14);

      ctx.fillStyle = C.MUTED;
      ctx.fillText(skill.desc, col + 6, sy + 28);
    });
  }

  function drawLog(ctx) {
    // Side log panel
    ctx.fillStyle = 'rgba(5,5,7,0.7)';
    ctx.fillRect(360, 140, 420, 200);
    ctx.strokeStyle = 'rgba(57,255,20,0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(360, 140, 420, 200);

    ctx.font = '8px Courier New';
    ctx.fillStyle = C.MUTED;
    ctx.fillText('BATTLE LOG', 368, 155);

    const displayLog = log.slice(-9);
    displayLog.forEach((entry, i) => {
      const alpha = 0.3 + (i / displayLog.length) * 0.7;
      ctx.fillStyle = `rgba(204,200,221,${alpha})`;
      ctx.font = '8px Courier New';
      ctx.fillText(`> ${entry}`, 368, 172 + i * 14);
    });
  }

  function drawBuffs(ctx) {
    const buffs = [];
    if (turnEffects.playerAtkBuff > 0) buffs.push({ text: `ATK+↑ (${turnEffects.playerAtkBuff})`, color: C.GOLD });
    if (turnEffects.playerDefBuff > 0) buffs.push({ text: `DEF+↑ (${turnEffects.playerDefBuff})`, color: C.CYAN });
    if (turnEffects.playerSpdBuff > 0) buffs.push({ text: `SPD+↑ (${turnEffects.playerSpdBuff})`, color: C.NEO });
    if (turnEffects.enemyDefDebuff > 0) buffs.push({ text: `FOE DEF-↓ (${turnEffects.enemyDefDebuff})`, color: C.NEO2 });

    buffs.forEach((b, i) => {
      ctx.font = '7px Courier New';
      ctx.fillStyle = b.color;
      ctx.fillText(b.text, 20, 342 - i * 12);
    });
  }

  function handleBattleCanvasTap(e) {
    e.preventDefault();
    if (phase !== 'select') return;
    const canvas = document.getElementById('battle-canvas');
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.changedTouches[0] : e;
    const x = (src.clientX - rect.left) * (800 / rect.width);
    const y = (src.clientY - rect.top) * (600 / rect.height);
    // Skill menu occupies y 460-598, arranged in 2 cols × 2 rows
    if (y >= 460 && y <= 598) {
      const col = x < 402 ? 0 : 1;
      const row = y < 528 ? 0 : 1;
      const idx = row * 2 + col;
      if (idx >= 0 && idx < player.skills.length) {
        selectedSkill = idx;
        useSkill(idx);
      }
    }
  }

  // ── INPUT ──
  function handleInput(key) {
    if (phase !== 'select') return;
    const skillCount = player.skills.length;
    if (key === 'ArrowLeft') selectedSkill = (selectedSkill - 1 + skillCount) % skillCount;
    else if (key === 'ArrowRight') selectedSkill = (selectedSkill + 1) % skillCount;
    else if (key === 'ArrowUp') selectedSkill = (selectedSkill - 2 + skillCount) % skillCount;
    else if (key === 'ArrowDown') selectedSkill = (selectedSkill + 2) % skillCount;
    else if (key === 'Enter' || key === ' ') useSkill(selectedSkill);
  }

  function useSkill(i) {
    const skill = player.skills[i];
    if (player.mp < skill.cost) {
      log.push(`Not enough MP for ${skill.name}!`);
      return;
    }
    player.mp -= skill.cost;
    phase = 'animating';

    if (skill.type === 'atk') {
      let dmg = calcDamage(
        player.stats.str + player.stats.mag + turnEffects.playerAtkBuff,
        enemy.def - turnEffects.enemyDefDebuff,
        skill.power
      );
      if (skill.name === 'Double Pick') dmg = Math.round(dmg * 1.8); // hits twice
      if (skill.name === 'Tremolo Burst' && Math.random() < 0.3) { // miss chance
        log.push(`${skill.name} — MISSED!`);
        phase = 'enemy';
        setTimeout(doEnemyTurn, 600);
        return;
      }
      enemy.hp = Math.max(0, enemy.hp - dmg);
      log.push(`${player.name}: ${skill.name} → ${enemy.name} [-${dmg} HP]`);
      animData = { type: 'hit', target: 'enemy', damage: dmg, timer: 20 };

      if (enemy.hp <= 0) {
        phase = 'result';
        log.push(`${enemy.name} is defeated!`);
        animData.timer = 20;
      } else {
        phase = 'enemy';
      }
    } else if (skill.type === 'heal') {
      const amount = Math.round(skill.power + player.stats.mag * 2);
      player.hp = Math.min(player.maxHp, player.hp + amount);
      log.push(`${player.name}: ${skill.name} → Restored ${amount} HP`);
      animData = { type: 'heal', amount, timer: 20 };
      phase = 'enemy'; // heal anim end → doEnemyTurn
    } else if (skill.type === 'buff') {
      if (skill.name === 'Battle Hymn') { turnEffects.playerAtkBuff = Math.min(turnEffects.playerAtkBuff + 4, 12); log.push('ATK boosted!'); }
      if (skill.name === 'Wall of Sound') { turnEffects.playerDefBuff = Math.min(turnEffects.playerDefBuff + 5, 15); log.push('DEF fortified!'); }
      if (skill.name === 'Tempo Boost') { turnEffects.playerSpdBuff = Math.min(turnEffects.playerSpdBuff + 4, 12); log.push('SPD ramped up!'); }
      animData = { type: 'buff', text: '★ BUFF APPLIED', timer: 20 };
      phase = 'enemy'; // buff anim end → doEnemyTurn
    } else if (skill.type === 'debuff') {
      if (skill.name === 'Key Change') { turnEffects.enemyDefDebuff = Math.min(turnEffects.enemyDefDebuff + 5, 15); log.push(`${enemy.name}'s defense drops!`); }
      animData = { type: 'buff', text: '▼ ENEMY WEAKENED', timer: 20 };
      phase = 'enemy'; // debuff anim end → doEnemyTurn
    }
  }

  function calcDamage(atk, def, power) {
    const base = Math.max(1, atk - Math.max(0, def));
    const roll = 0.85 + Math.random() * 0.3;
    return Math.round((base * 1.5 + power * 0.4) * roll);
  }

  // ── ENEMY TURN ──
  function doEnemyTurn() {
    if (phase !== 'enemy' && phase !== 'enemy-acting') return;
    phase = 'enemy-acting';

    const skillName = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
    let dmg = calcDamage(
      enemy.atk,
      player.stats.def + turnEffects.playerDefBuff,
      Math.floor(enemy.atk * 0.8)
    );

    // Boss hits harder
    if (isBoss) dmg = Math.round(dmg * 1.3);

    player.hp = Math.max(0, player.hp - dmg);
    log.push(`${enemy.name}: ${skillName} → ${player.name} [-${dmg} HP]`);
    animData = { type: 'hit', target: 'player', damage: dmg, timer: 20 };

    if (player.hp <= 0) {
      phase = 'result-lose';
      log.push(`${player.name} is down!`);
    } else {
      phase = 'select';
    }

    // Decay buffs slightly
    if (turnEffects.playerAtkBuff > 0) turnEffects.playerAtkBuff = Math.max(0, turnEffects.playerAtkBuff - 1);
    if (turnEffects.playerDefBuff > 0) turnEffects.playerDefBuff = Math.max(0, turnEffects.playerDefBuff - 1);
    if (turnEffects.playerSpdBuff > 0) turnEffects.playerSpdBuff = Math.max(0, turnEffects.playerSpdBuff - 1);
    if (turnEffects.enemyDefDebuff > 0) turnEffects.enemyDefDebuff = Math.max(0, turnEffects.enemyDefDebuff - 1);
  }

  function endBattle() {
    const won = player.hp > 0;
    stopLoop();
    setTimeout(() => {
      Game.onBattleEnd(won, isBoss);
    }, 400);
  }

  return { init, handleInput };
})();

// ── UTIL ────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── BOOT ────────────────────────────────────────────
Game.initTitle();

// ── MOBILE / RESIZE SUPPORT ─────────────────────────
function resizeGame() {
  const container = document.getElementById('game-container');
  const scale = Math.min(window.innerWidth / 800, window.innerHeight / 600);
  if (scale < 1) {
    const sw = Math.round(800 * scale);
    const sh = Math.round(600 * scale);
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top left';
    container.style.position = 'absolute';
    container.style.left = `${Math.round((window.innerWidth - sw) / 2)}px`;
    container.style.top = `${Math.round((window.innerHeight - sh) / 2)}px`;
    document.body.style.alignItems = 'flex-start';
    document.body.style.justifyContent = 'flex-start';
  } else {
    container.style.transform = '';
    container.style.transformOrigin = '';
    container.style.position = 'relative';
    container.style.left = '';
    container.style.top = '';
    document.body.style.alignItems = '';
    document.body.style.justifyContent = '';
  }
}

window.addEventListener('resize', resizeGame);
resizeGame();

// ── D-PAD & TOUCH SETUP ──────────────────────────────
(function() {
  let moveInterval = null;

  function startMove(key) {
    Game.handleWorldInput(key);
    clearInterval(moveInterval);
    moveInterval = setInterval(() => Game.handleWorldInput(key), 180);
  }

  function stopMove() {
    clearInterval(moveInterval);
    moveInterval = null;
  }

  document.querySelectorAll('.dpad-btn').forEach(btn => {
    const key = btn.dataset.key;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); startMove(key); }, { passive: false });
    btn.addEventListener('touchend', stopMove, { passive: true });
    btn.addEventListener('touchcancel', stopMove, { passive: true });
    btn.addEventListener('mousedown', (e) => { e.preventDefault(); startMove(key); });
    btn.addEventListener('mouseup', stopMove);
    btn.addEventListener('mouseleave', stopMove);
  });

  const actionBtn = document.getElementById('btn-action');
  if (actionBtn) {
    const doAction = () => Game.handleAction();
    actionBtn.addEventListener('touchstart', (e) => { e.preventDefault(); doAction(); }, { passive: false });
    actionBtn.addEventListener('click', doAction);
  }

  const dialogBox = document.getElementById('dialog-box');
  if (dialogBox) {
    dialogBox.addEventListener('click', () => Game.closeDialog());
    dialogBox.addEventListener('touchstart', (e) => { e.preventDefault(); Game.closeDialog(); }, { passive: false });
  }
})();
