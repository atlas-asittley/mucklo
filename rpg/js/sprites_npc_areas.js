// sprites_npc_areas.js — Pixel-art sprites for Training Grounds creatures and
// all world-area enemies (volcanic, frozen, shadow, abyss, underworld, sunken temple, etc.).
// Called by drawNpcSprite() in sprites_npc.js.
// Returns true if the key was handled, false otherwise.
// Depends on: constants.js (TILE), state.js (tick).

function drawNpcSpriteAreas(c, key, f) {
  const S = 32; // sprite grid
  switch (key) {
    case 'rabbit': {
      let earBob = Math.sin(tick * 0.06) * 1;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.2)';
      c.fillRect(7, S-5, 18, 3);
      // Ears
      c.fillStyle = '#cccccc';
      c.fillRect(9, 1+earBob, 4, 9);
      c.fillRect(19, 1+earBob, 4, 9);
      c.fillStyle = '#f0a0b0';
      c.fillRect(10, 2+earBob, 2, 7);
      c.fillRect(20, 2+earBob, 2, 7);
      // Head
      c.fillStyle = '#e0e0e0';
      c.fillRect(8, 9, 16, 10);
      c.fillRect(6, 11, 20, 7);
      // Eyes (red — rabbit eyes)
      c.fillStyle = '#cc2020';
      c.fillRect(9, 12, 2, 2);
      c.fillRect(21, 12, 2, 2);
      // Nose
      c.fillStyle = '#e09090';
      c.fillRect(14, 17, 4, 2);
      // Body
      c.fillStyle = '#d8d8d8';
      c.fillRect(7, 18, 18, 8);
      // Fluffy tail
      c.fillStyle = '#f0f0f0';
      c.fillRect(22, 18, 4, 4);
      // Paws
      c.fillStyle = '#c8c8c8';
      c.fillRect(8, 25, 6, 3);
      c.fillRect(18, 25, 6, 3);
      break;
    }
    case 'squirrel': {
      let tailWave = Math.sin(tick * 0.1) * 2;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.2)';
      c.fillRect(5, S-5, 20, 3);
      // Bushy tail (drawn behind body)
      c.fillStyle = '#7a3510';
      c.fillRect(20, 6+tailWave, 9, 14);
      c.fillStyle = '#9a5530';
      c.fillRect(21, 7+tailWave, 7, 11);
      c.fillStyle = '#e8c060';
      c.fillRect(22, 9+tailWave, 5, 5);
      // Body
      c.fillStyle = '#7a3a10';
      c.fillRect(6, 18, 16, 8);
      c.fillStyle = '#8a4a20';
      c.fillRect(6, 15, 15, 6);
      // Head
      c.fillStyle = '#7a3a10';
      c.fillRect(7, 7, 13, 9);
      c.fillStyle = '#8a4a20';
      c.fillRect(7, 5, 12, 6);
      // Pointed ears
      c.fillStyle = '#6a2a08';
      c.fillRect(8, 2, 3, 5);
      c.fillRect(17, 2, 3, 5);
      // Eye
      c.fillStyle = '#111';
      c.fillRect(9, 8, 2, 2);
      c.fillStyle = '#fff';
      c.fillRect(9, 8, 1, 1);
      // Nose
      c.fillStyle = '#cc4040';
      c.fillRect(9, 12, 2, 2);
      // Paws
      c.fillStyle = '#6a2a08';
      c.fillRect(5, 19, 3, 4);
      c.fillRect(18, 19, 3, 4);
      break;
    }
    case 'bird': {
      let wingFlap = Math.sin(tick * 0.2) * 3;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.2)';
      c.fillRect(7, S-5, 18, 3);
      // Wings (animated)
      c.fillStyle = '#2255aa';
      c.fillRect(2, 14-wingFlap, 7, 5+Math.floor(wingFlap/2));
      c.fillRect(S-9, 14-wingFlap, 7, 5+Math.floor(wingFlap/2));
      c.fillStyle = '#3366cc';
      c.fillRect(3, 16-wingFlap, 5, 3+Math.floor(wingFlap/2));
      c.fillRect(S-8, 16-wingFlap, 5, 3+Math.floor(wingFlap/2));
      // Body
      c.fillStyle = '#3377bb';
      c.fillRect(8, 16, 16, 10);
      // Head
      c.fillStyle = '#4488cc';
      c.fillRect(10, 6, 12, 11);
      // Beak
      c.fillStyle = '#dd8830';
      c.fillRect(7, 12, 4, 3);
      // Eye
      c.fillStyle = '#111';
      c.fillRect(12, 9, 2, 2);
      c.fillStyle = '#fff';
      c.fillRect(12, 9, 1, 1);
      // Tail feathers
      c.fillStyle = '#2255aa';
      c.fillRect(9, 25, 14, 3);
      c.fillRect(10, 27, 4, 3);
      c.fillRect(18, 27, 4, 3);
      // Legs
      c.fillStyle = '#cc8820';
      c.fillRect(12, 26, 2, 4);
      c.fillRect(18, 26, 2, 4);
      c.fillRect(10, 29, 5, 1);
      c.fillRect(16, 29, 5, 1);
      break;
    }
    case 'rat': {
      let ratRun = f * 2;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.2)';
      c.fillRect(3, S-4, 22, 3);
      // Long tail — curves up and back (rat hallmark)
      c.fillStyle = '#9a7a5a';
      c.fillRect(S-3, 12, 3, 2);   // base of tail
      c.fillRect(S-1, 10, 2, 4);
      c.fillRect(S,    7, 2, 4);
      c.fillRect(S+1,  4, 2, 4);
      c.fillRect(S+1,  3, 1, 2);   // tip
      // Body — elongated, hunched
      c.fillStyle = '#7a6a55';
      c.fillRect(5, 17, 20, 8);
      c.fillStyle = '#8a7a65';
      c.fillRect(5, 15, 18, 5);
      // Underbelly
      c.fillStyle = '#b0a090';
      c.fillRect(7, 20, 14, 4);
      // Head — slightly elongated snout (rat vs round mouse)
      c.fillStyle = '#7a6a55';
      c.fillRect(1, 13, 13, 8);
      c.fillStyle = '#8a7a65';
      c.fillRect(1, 11, 11, 6);
      // Pointed snout
      c.fillStyle = '#9a8a75';
      c.fillRect(0, 15, 5, 4);
      c.fillRect(0, 17, 3, 2);
      // Nose — dark tip
      c.fillStyle = '#3a2a1a';
      c.fillRect(0, 17, 2, 2);
      // Whiskers (horizontal lines either side of snout)
      c.fillStyle = '#d0c0a0';
      c.fillRect(3, 16, 4, 1);
      c.fillRect(3, 18, 4, 1);
      // Pointy ears — tall and narrow (not round)
      c.fillStyle = '#7a5a45';
      c.fillRect(5,  6, 4, 7);
      c.fillRect(11, 5, 4, 8);
      // Inner ear
      c.fillStyle = '#c08070';
      c.fillRect(6,  7, 2, 5);
      c.fillRect(12, 6, 2, 6);
      // Beady eye — small, dark, single pixel highlight
      c.fillStyle = '#111';
      c.fillRect(4, 14, 2, 2);
      c.fillStyle = '#fff';
      c.fillRect(5, 14, 1, 1);
      // Feet (animated)
      c.fillStyle = '#6a5a45';
      c.fillRect(7,    S-5+ratRun, 3, 3);
      c.fillRect(13,   S-6,        3, 3);
      c.fillRect(S-10, S-5+ratRun, 3, 3);
      break;
    }
    case 'giant_rat': {
      let gRun = f * 2;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.25)';
      c.fillRect(1, S-4, 26, 3);
      // Long thick tail
      c.fillStyle = '#7a5a3a';
      c.fillRect(S-4, 10, 4, 3);
      c.fillRect(S-2,  7, 3, 4);
      c.fillRect(S-1,  4, 3, 4);
      c.fillRect(S,    2, 2, 3);
      // Body — heavier, bulkier
      c.fillStyle = '#6a4a2a';
      c.fillRect(4, 16, 22, 9);
      c.fillStyle = '#7a5a3a';
      c.fillRect(4, 14, 20, 5);
      // Underbelly
      c.fillStyle = '#aa8a6a';
      c.fillRect(7, 20, 14, 4);
      // Head
      c.fillStyle = '#6a4a2a';
      c.fillRect(0, 12, 14, 9);
      c.fillStyle = '#7a5a3a';
      c.fillRect(0, 10, 12, 6);
      // Broad snout
      c.fillStyle = '#8a6a4a';
      c.fillRect(0, 14, 5, 5);
      c.fillRect(0, 17, 3, 2);
      // Nose
      c.fillStyle = '#2a1a0a';
      c.fillRect(0, 17, 2, 2);
      // Whiskers
      c.fillStyle = '#c0a880';
      c.fillRect(3, 15, 5, 1);
      c.fillRect(3, 18, 5, 1);
      // Pointy ears
      c.fillStyle = '#5a3a1a';
      c.fillRect(4,  5, 5, 8);
      c.fillRect(11, 4, 5, 9);
      c.fillStyle = '#b07050';
      c.fillRect(5,  6, 3, 6);
      c.fillRect(12, 5, 3, 7);
      // Beady eyes — red-tinted for giant rat
      c.fillStyle = '#220000';
      c.fillRect(3, 13, 3, 3);
      c.fillStyle = '#cc2222';
      c.fillRect(4, 13, 1, 1);
      // Feet (animated)
      c.fillStyle = '#5a3a1a';
      c.fillRect(6,    S-5+gRun, 4, 3);
      c.fillRect(13,   S-6,      4, 3);
      c.fillRect(S-11, S-5+gRun, 4, 3);
      break;
    }
    // ── Volcanic Wastes ──────────────────────────────────────────────────────
    case 'ember_sprite': {
      let flicker = Math.sin(tick * 0.18) * 2;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(10, S-5, 12, 3);
      c.fillStyle = '#cc2200'; c.fillRect(9, 22, 14, 6); c.fillRect(7, 18, 18, 6);
      c.fillStyle = '#ff5500'; c.fillRect(9, 14, 14, 7); c.fillRect(11, 11, 10, 5);
      c.fillStyle = '#ffcc00'; c.fillRect(12, 8-flicker, 8, 5+flicker); c.fillRect(14, 4-flicker, 4, 6+flicker);
      c.fillStyle = '#fff8e0'; c.fillRect(11, 17, 3, 3); c.fillRect(18, 17, 3, 3);
      c.fillStyle = '#330000'; c.fillRect(12, 18, 2, 2); c.fillRect(19, 18, 2, 2);
      break;
    }
    case 'lava_crab': {
      let clawSnap = Math.sin(tick * 0.12) * 1;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(2, S-4, S-4, 3);
      c.fillStyle = '#7a1800'; c.fillRect(0, 12, 7, 5); c.fillRect(S-7, 12, 7, 5);
      c.fillStyle = '#9a2800'; c.fillRect(0, 10+clawSnap, 5, 4); c.fillRect(S-5, 10+clawSnap, 5, 4);
      c.fillStyle = '#8b2500'; c.fillRect(6, 16, S-12, 8); c.fillStyle = '#a83000'; c.fillRect(7, 14, S-14, 7);
      c.fillStyle = '#c84000'; c.fillRect(9, 12, S-18, 6);
      c.fillStyle = 'rgba(255,100,0,0.5)'; c.fillRect(11, 13, S-22, 4);
      c.fillStyle = '#8b2500'; c.fillRect(10, 9, 2, 5); c.fillRect(S-12, 9, 2, 5);
      c.fillStyle = '#ffcc00'; c.fillRect(9, 7, 4, 4); c.fillRect(S-13, 7, 4, 4);
      c.fillStyle = '#000'; c.fillRect(10, 8, 2, 2); c.fillRect(S-12, 8, 2, 2);
      c.fillStyle = '#7a1800';
      c.fillRect(3, 20, 4, 2); c.fillRect(4, 22, 3, 2); c.fillRect(2, 18, 4, 2);
      c.fillRect(S-7, 20, 4, 2); c.fillRect(S-7, 22, 3, 2); c.fillRect(S-6, 18, 4, 2);
      break;
    }
    case 'fire_elemental': {
      let wave = Math.sin(tick * 0.1) * 2;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(8, S-5, S-16, 3);
      c.fillStyle = '#cc3300'; c.fillRect(8, 22, 6, 7); c.fillRect(S-14, 22, 6, 7);
      c.fillStyle = '#ff5500'; c.fillRect(9, 20, 5, 5); c.fillRect(S-14, 20, 5, 5);
      c.fillStyle = '#ff4400'; c.fillRect(7, 12, S-14, 11); c.fillStyle = '#ff6600'; c.fillRect(9, 11, S-18, 9);
      c.fillStyle = '#ff5500'; c.fillRect(1, 13+wave, 7, 5); c.fillRect(S-8, 13+wave, 7, 5);
      c.fillStyle = '#ff7700'; c.fillRect(0, 12+wave, 4, 4); c.fillRect(S-4, 12+wave, 4, 4);
      c.fillStyle = '#ff6600'; c.fillRect(11, 8, 10, 5);
      c.fillStyle = '#ff7700'; c.fillRect(9, 4, S-18, 7); c.fillStyle = '#ffaa00'; c.fillRect(11, 3, S-22, 5);
      c.fillStyle = '#ffdd00'; c.fillRect(12, 1-wave, 8, 4+wave); c.fillRect(14, -1-wave, 4, 3+wave);
      c.fillStyle = '#fff'; c.fillRect(11, 6, 3, 3); c.fillRect(S-14, 6, 3, 3);
      c.fillStyle = '#ff0000'; c.fillRect(12, 7, 2, 2); c.fillRect(S-13, 7, 2, 2);
      break;
    }
    case 'molten_golem': {
      let pulse = Math.sin(tick * 0.07) * 1;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(3, S-4, S-6, 4);
      c.fillStyle = '#3a1a0a'; c.fillRect(7, 22, 6, 8); c.fillRect(S-13, 22, 6, 8);
      c.fillStyle = '#4a2010'; c.fillRect(4, 10, S-8, 14); c.fillStyle = '#5a2a18'; c.fillRect(5, 9, S-10, 12);
      c.fillStyle = `rgba(255,${100+pulse*50},0,0.85)`;
      c.fillRect(7, 12, 2, 6); c.fillRect(11, 11, 2, 8); c.fillRect(15, 13, 2, 5); c.fillRect(S-9, 12, 2, 6); c.fillRect(S-13, 11, 2, 7);
      c.fillStyle = '#4a2010'; c.fillRect(0, 11, 6, 10); c.fillRect(S-6, 11, 6, 10);
      c.fillStyle = `rgba(255,80,0,0.6)`; c.fillRect(1, 14, 2, 4); c.fillRect(S-3, 14, 2, 4);
      c.fillStyle = '#3a1a0a'; c.fillRect(6, 2, S-12, 9); c.fillStyle = '#4a2010'; c.fillRect(7, 1, S-14, 8);
      c.fillStyle = `rgba(255,${120+pulse*60},0,0.9)`;
      c.fillRect(9, 3, 5, 4); c.fillRect(S-14, 3, 5, 4);
      c.fillStyle = '#fff8a0'; c.fillRect(10, 4, 3, 2); c.fillRect(S-13, 4, 3, 2);
      c.fillStyle = `rgba(255,80,0,0.8)`; c.fillRect(9, 7, S-18, 2);
      break;
    }
    // ── Slime variants ────────────────────────────────────────────────────────
    case 'slime_king': {
      let squish = 0.1 * Math.sin(tick * 0.07);
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(5, S-6, S-10, 3);
      c.fillStyle = '#d4af37'; c.fillRect(7, 5, S-14, 4);
      c.fillRect(7, 2, 3, 5); c.fillRect(13, 2, 4, 5); c.fillRect(S-10, 2, 3, 5);
      c.fillStyle = '#ff3333'; c.fillRect(8, 2, 2, 2); c.fillRect(14, 1, 2, 2); c.fillRect(S-10, 2, 2, 2);
      c.fillStyle = '#1a7a1a'; c.fillRect(4, 16+squish*4, S-8, 12-squish*2); c.fillRect(5, 12, S-10, 16);
      c.fillStyle = '#28a028'; c.fillRect(5, 9, S-10, 10); c.fillRect(8, 7, S-16, 7);
      c.fillStyle = '#fff'; c.fillRect(9, 13, 6, 6); c.fillRect(S-15, 13, 6, 6);
      c.fillStyle = '#111'; c.fillRect(10, 14, 4, 4); c.fillRect(S-14, 14, 4, 4);
      c.fillStyle = '#e00'; c.fillRect(11, 15, 2, 2); c.fillRect(S-13, 15, 2, 2);
      c.fillStyle = 'rgba(150,255,150,0.3)'; c.fillRect(9, 8, 5, 4);
      break;
    }
    case 'frost_sprite': {
      let shimmer = Math.sin(tick * 0.12) * 1;
      c.fillStyle = 'rgba(0,0,0,0.15)'; c.fillRect(10, S-5, 12, 3);
      c.fillStyle = '#4ab8d4'; c.fillRect(9, 16, 14, 10); c.fillRect(7, 12, 18, 8);
      c.fillStyle = '#6ad0e8'; c.fillRect(9, 10, 14, 8); c.fillRect(11, 8, 10, 5);
      c.fillStyle = '#a0e8f8'; c.fillRect(10, 4+shimmer, 3, 6); c.fillRect(15, 2+shimmer, 3, 7); c.fillRect(20, 4+shimmer, 3, 6);
      c.fillStyle = '#d0f4ff'; c.fillRect(11, 3+shimmer, 1, 4); c.fillRect(16, 1+shimmer, 1, 5); c.fillRect(21, 3+shimmer, 1, 4);
      c.fillStyle = '#001830'; c.fillRect(10, 14, 4, 4); c.fillRect(S-14, 14, 4, 4);
      c.fillStyle = '#80d0ff'; c.fillRect(11, 15, 2, 2); c.fillRect(S-13, 15, 2, 2);
      c.fillStyle = 'rgba(200,240,255,0.4)'; c.fillRect(11, 10, 4, 3);
      break;
    }
    // ── Canines ───────────────────────────────────────────────────────────────
    case 'wolf': {
      let trot = Math.sin(tick * 0.14) * 1.5;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(3, S-4, S-6, 3);
      c.fillStyle = '#5a5050'; c.fillRect(S-7, 8, 4, 10); c.fillRect(S-6, 6, 3, 4);
      c.fillStyle = '#5a5050'; c.fillRect(5, 14, S-11, 9); c.fillStyle = '#6a6060'; c.fillRect(5, 12, S-13, 7);
      c.fillStyle = '#5a5050'; c.fillRect(4, 10, 9, 7);
      c.fillStyle = '#6a6060'; c.fillRect(1, 8, 13, 8); c.fillStyle = '#5a5050'; c.fillRect(1, 7, 11, 5);
      c.fillStyle = '#707070'; c.fillRect(0, 12, 7, 4); c.fillStyle = '#cc2020'; c.fillRect(1, 13, 2, 2);
      c.fillStyle = '#3a3030'; c.fillRect(9, 4, 3, 6); c.fillRect(14, 4, 3, 6);
      c.fillStyle = '#c08080'; c.fillRect(10, 5, 1, 4); c.fillRect(15, 5, 1, 4);
      c.fillStyle = '#e0c000'; c.fillRect(6, 9, 3, 3); c.fillStyle = '#222'; c.fillRect(7, 10, 2, 2);
      c.fillStyle = '#4a4040';
      c.fillRect(7, 23, 4, 4+trot); c.fillRect(13, 23, 4, 4); c.fillRect(S-13, 23, 4, 4); c.fillRect(S-8, 23, 4, 4+trot);
      c.fillStyle = '#2a2020';
      c.fillRect(7, 26+trot, 4, 2); c.fillRect(13, 26, 4, 2); c.fillRect(S-13, 26, 4, 2); c.fillRect(S-8, 26+trot, 4, 2);
      break;
    }
    case 'snow_wolf': {
      let trot = Math.sin(tick * 0.14) * 1.5;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(3, S-4, S-6, 3);
      c.fillStyle = '#d0e4f0'; c.fillRect(S-7, 8, 4, 10); c.fillRect(S-6, 6, 3, 4);
      c.fillStyle = '#c8dce8'; c.fillRect(5, 14, S-11, 9); c.fillRect(5, 12, S-13, 7);
      c.fillStyle = '#e0eff8'; c.fillRect(7, 13, S-15, 5);
      c.fillStyle = '#c8dce8'; c.fillRect(4, 10, 9, 7); c.fillRect(1, 8, 13, 8);
      c.fillStyle = '#b8ccd8'; c.fillRect(1, 7, 11, 5);
      c.fillStyle = '#d0e8f8'; c.fillRect(0, 12, 7, 4); c.fillStyle = '#cc4040'; c.fillRect(1, 13, 2, 2);
      c.fillStyle = '#a0b8c8'; c.fillRect(9, 4, 3, 6); c.fillRect(14, 4, 3, 6);
      c.fillStyle = '#e0b0b0'; c.fillRect(10, 5, 1, 4); c.fillRect(15, 5, 1, 4);
      c.fillStyle = '#80ccff'; c.fillRect(6, 9, 3, 3); c.fillStyle = '#222'; c.fillRect(7, 10, 2, 2);
      c.fillStyle = '#a8bcc8';
      c.fillRect(7, 23, 4, 4+trot); c.fillRect(13, 23, 4, 4); c.fillRect(S-13, 23, 4, 4); c.fillRect(S-8, 23, 4, 4+trot);
      c.fillStyle = '#88a0b0';
      c.fillRect(7, 26+trot, 4, 2); c.fillRect(13, 26, 4, 2); c.fillRect(S-13, 26, 4, 2); c.fillRect(S-8, 26+trot, 4, 2);
      break;
    }
    case 'venom_wolf': {
      let trot = Math.sin(tick * 0.14) * 1.5;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(3, S-4, S-6, 3);
      c.fillStyle = '#2a4a18'; c.fillRect(S-7, 8, 4, 10); c.fillRect(S-6, 6, 3, 4);
      c.fillStyle = '#2a4a18'; c.fillRect(5, 14, S-11, 9); c.fillRect(5, 12, S-13, 7);
      c.fillStyle = '#3a5a20'; c.fillRect(7, 13, S-15, 5);
      c.fillStyle = 'rgba(100,220,50,0.7)'; c.fillRect(10, 12, 2, 4); c.fillRect(16, 12, 2, 3); c.fillRect(S-12, 12, 2, 4);
      c.fillStyle = '#2a4a18'; c.fillRect(4, 10, 9, 7); c.fillRect(1, 8, 13, 8);
      c.fillStyle = '#1a3a10'; c.fillRect(1, 7, 11, 5);
      c.fillStyle = '#3a5a20'; c.fillRect(0, 12, 7, 4); c.fillStyle = '#aa2020'; c.fillRect(1, 13, 2, 2);
      c.fillStyle = '#1a3010'; c.fillRect(9, 4, 3, 6); c.fillRect(14, 4, 3, 6);
      c.fillStyle = '#c08080'; c.fillRect(10, 5, 1, 4); c.fillRect(15, 5, 1, 4);
      c.fillStyle = '#80ee00'; c.fillRect(6, 9, 3, 3); c.fillStyle = '#111'; c.fillRect(7, 10, 2, 2);
      c.fillStyle = '#1a3a10';
      c.fillRect(7, 23, 4, 4+trot); c.fillRect(13, 23, 4, 4); c.fillRect(S-13, 23, 4, 4); c.fillRect(S-8, 23, 4, 4+trot);
      c.fillStyle = '#0a2008';
      c.fillRect(7, 26+trot, 4, 2); c.fillRect(13, 26, 4, 2); c.fillRect(S-13, 26, 4, 2); c.fillRect(S-8, 26+trot, 4, 2);
      break;
    }
    // ── Small critters ────────────────────────────────────────────────────────
    case 'goblin': {
      let bob = Math.sin(tick * 0.1) * 1;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(8, S-5, S-16, 3);
      c.fillStyle = '#2a3a10'; c.fillRect(9, S-7, 5, 5); c.fillRect(S-14, S-7, 5, 5);
      c.fillStyle = '#3a5010'; c.fillRect(10, 20, 5, 7); c.fillRect(S-15, 20, 5, 7);
      c.fillStyle = '#4a6a18'; c.fillRect(8, 14, S-16, 9); c.fillStyle = '#5a7a20'; c.fillRect(9, 13, S-18, 7);
      c.fillStyle = '#4a6a18'; c.fillRect(3, 15, 6, 9); c.fillRect(S-9, 15, 6, 9);
      c.fillStyle = '#3a5010'; c.fillRect(2, 22, 5, 4); c.fillRect(S-7, 22, 5, 4);
      c.fillStyle = '#5a7020'; c.fillRect(12, 10, 8, 5);
      c.fillStyle = '#5a7a20'; c.fillRect(8, 4, S-16, 9); c.fillStyle = '#6a8a28'; c.fillRect(9, 3, S-18, 7);
      c.fillStyle = '#4a6018'; c.fillRect(5, 5, 5, 7); c.fillRect(S-10, 5, 5, 7);
      c.fillStyle = '#d08080'; c.fillRect(6, 6, 2, 5); c.fillRect(S-8, 6, 2, 5);
      c.fillStyle = '#ffee00'; c.fillRect(10, 7, 4, 3); c.fillRect(S-14, 7, 4, 3);
      c.fillStyle = '#111'; c.fillRect(11, 8, 2, 2); c.fillRect(S-13, 8, 2, 2);
      c.fillStyle = '#3a5010'; c.fillRect(13, 9, 6, 3);
      c.fillStyle = '#e8e0b0'; c.fillRect(12, 11, 2, 2); c.fillRect(S-14, 11, 2, 2);
      break;
    }
    case 'frog': {
      let bob = Math.sin(tick * 0.1) * 1;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(6, S-4, S-12, 3);
      // Back legs (long, folded)
      c.fillStyle = '#2a7a20'; c.fillRect(2, 19, 5, 5); c.fillRect(S-7, 19, 5, 5);
      c.fillStyle = '#3a8a28'; c.fillRect(0, 22, 6, 3); c.fillRect(S-6, 22, 6, 3);
      // Body (round, wide)
      c.fillStyle = '#3a9028'; c.fillRect(5, 16, S-10, 9);
      c.fillStyle = '#4aaa30'; c.fillRect(6, 14, S-12, 8);
      c.fillStyle = '#5ab840'; c.fillRect(8, 13, S-16, 6);
      // Belly (pale)
      c.fillStyle = '#a0d880'; c.fillRect(9, 18, S-18, 6);
      // Front legs (short)
      c.fillStyle = '#2a7a20'; c.fillRect(5, 20, 4, 4); c.fillRect(S-9, 20, 4, 4);
      // Head (wide, flat)
      c.fillStyle = '#4aaa30'; c.fillRect(7, 8, S-14, 8);
      c.fillStyle = '#5ab840'; c.fillRect(8, 7, S-16, 6);
      // Bulging eyes (on top of head)
      c.fillStyle = '#5ab840'; c.fillRect(8, 4, 6, 6); c.fillRect(S-14, 4, 6, 6);
      c.fillStyle = '#f0f000'; c.fillRect(9, 5, 4, 4); c.fillRect(S-13, 5, 4, 4);
      c.fillStyle = '#111'; c.fillRect(10, 6, 2, 2); c.fillRect(S-12, 6, 2, 2);
      // Wide mouth
      c.fillStyle = '#1a5010'; c.fillRect(9, 13, S-18, 2);
      break;
    }
    case 'snake': {
      let slither = Math.sin(tick * 0.1) * 2;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(5, S-4, S-10, 3);
      c.fillStyle = '#5a8020'; c.fillRect(S-7, 22+slither, 4, 3);
      c.fillStyle = '#6a9028'; c.fillRect(S-10, 14+slither, 8, 9+slither);
      c.fillStyle = '#7aa030'; c.fillRect(6, 12, 16, 8); c.fillRect(3, 14+slither, 12, 7);
      c.fillStyle = '#4a7018'; c.fillRect(7, 13, 14, 2); c.fillRect(4, 15+slither, 10, 2);
      c.fillStyle = '#a8c870'; c.fillRect(7, 14, 3, 6); c.fillRect(4, 16+slither, 3, 5);
      c.fillStyle = '#6a9028'; c.fillRect(0, 9, 12, 7); c.fillStyle = '#7aa030'; c.fillRect(1, 8, 10, 6);
      c.fillStyle = '#ffee00'; c.fillRect(2, 10, 3, 3); c.fillStyle = '#111'; c.fillRect(3, 11, 1, 2);
      c.fillStyle = '#ee2020'; c.fillRect(0, 13, 3, 1); c.fillRect(-1, 12, 2, 1); c.fillRect(-1, 14, 2, 1);
      break;
    }
    case 'mole': {
      let dig = Math.sin(tick * 0.13) * 1;
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(6, S-5, S-12, 3);
      c.fillStyle = '#3a2810'; c.fillRect(2, 17, 7, 6); c.fillRect(S-9, 17, 7, 6);
      c.fillStyle = '#2a1808'; c.fillRect(2, 22, 7, 2+dig); c.fillRect(S-9, 22, 7, 2+dig);
      c.fillStyle = '#1a1008'; c.fillRect(3, 23, 1, 2); c.fillRect(5, 23, 1, 2); c.fillRect(7, 23, 1, 2);
      c.fillRect(S-8, 23, 1, 2); c.fillRect(S-6, 23, 1, 2); c.fillRect(S-4, 23, 1, 2);
      c.fillStyle = '#5a3a20'; c.fillRect(7, 15, S-14, 12); c.fillStyle = '#6a4a28'; c.fillRect(7, 13, S-14, 9);
      c.fillStyle = '#5a3a20'; c.fillRect(8, 7, S-16, 10); c.fillStyle = '#6a4a28'; c.fillRect(8, 5, S-16, 8);
      c.fillStyle = '#d08080'; c.fillRect(9, 11, S-18, 4); c.fillStyle = '#b05050'; c.fillRect(13, 12, 6, 2);
      c.fillStyle = '#1a0808'; c.fillRect(10, 8, 3, 2); c.fillRect(S-13, 8, 3, 2);
      c.fillStyle = '#444'; c.fillRect(11, 8, 1, 1); c.fillRect(S-12, 8, 1, 1);
      c.fillStyle = '#4a3018'; c.fillRect(8, 6, 1, 4); c.fillRect(S-9, 6, 1, 4);
      break;
    }
    case 'badger': {
      let bob = Math.sin(tick * 0.09) * 1;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(4, S-4, S-8, 3);
      c.fillStyle = '#303030'; c.fillRect(5, 14, S-10, 12); c.fillStyle = '#484848'; c.fillRect(5, 13, S-12, 8);
      c.fillStyle = '#e0e0e0'; c.fillRect(10, 16, S-20, 8);
      c.fillStyle = '#202020'; c.fillRect(7, 24, 5, 4); c.fillRect(14, 24, 4, 4); c.fillRect(S-13, 24, 4, 4); c.fillRect(S-10, 24, 5, 4);
      c.fillStyle = '#404040'; c.fillRect(6, 7+bob, S-12, 9);
      c.fillStyle = '#f0f0f0'; c.fillRect(8, 5+bob, S-16, 6);
      c.fillStyle = '#101010'; c.fillRect(7, 5+bob, 5, 8); c.fillRect(S-12, 5+bob, 5, 8);
      c.fillStyle = '#f0f0f0'; c.fillRect(10, 4+bob, 3, 5); c.fillRect(S-13, 4+bob, 3, 5);
      c.fillStyle = '#888'; c.fillRect(10, 11+bob, 12, 4); c.fillStyle = '#222'; c.fillRect(14, 12+bob, 4, 2);
      c.fillStyle = '#111'; c.fillRect(9, 8+bob, 3, 2); c.fillRect(S-12, 8+bob, 3, 2);
      c.fillStyle = '#c0c0c0'; c.fillRect(9, 8+bob, 1, 1); c.fillRect(S-12, 8+bob, 1, 1);
      break;
    }
    case 'hawk': {
      let wingFlap = Math.sin(tick * 0.18) * 4;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(7, S-5, 18, 3);
      c.fillStyle = '#5a3810'; c.fillRect(1, 12-wingFlap, 8, 6+wingFlap); c.fillRect(S-9, 12-wingFlap, 8, 6+wingFlap);
      c.fillStyle = '#7a5020'; c.fillRect(2, 14-wingFlap, 6, 4+wingFlap); c.fillRect(S-8, 14-wingFlap, 6, 4+wingFlap);
      c.fillStyle = '#3a2008'; c.fillRect(2, 14, 6, 1); c.fillRect(S-8, 14, 6, 1);
      c.fillStyle = '#6a4818'; c.fillRect(8, 16, 16, 10); c.fillStyle = '#7a5820'; c.fillRect(9, 14, 14, 7);
      c.fillStyle = '#e8d8a0'; c.fillRect(11, 18, 10, 6);
      c.fillStyle = '#5a3810'; c.fillRect(12, 19, 2, 2); c.fillRect(16, 20, 2, 2); c.fillRect(14, 21, 2, 2);
      c.fillStyle = '#5a3810'; c.fillRect(9, 5, 14, 11);
      c.fillStyle = '#dd8800'; c.fillRect(10, 7, 5, 5); c.fillStyle = '#111'; c.fillRect(11, 8, 3, 3);
      c.fillStyle = '#fff'; c.fillRect(11, 8, 1, 1);
      c.fillStyle = '#dd8800'; c.fillRect(6, 11, 5, 3); c.fillStyle = '#bb6600'; c.fillRect(5, 13, 4, 2);
      c.fillStyle = '#5a3810'; c.fillRect(9, 25, 14, 4); c.fillRect(11, 28, 4, 3); c.fillRect(17, 28, 4, 3);
      c.fillStyle = '#333';
      c.fillRect(11, 29, 2, 3); c.fillRect(13, 30, 2, 2); c.fillRect(9, 30, 2, 2);
      c.fillRect(19, 29, 2, 3); c.fillRect(21, 30, 2, 2); c.fillRect(17, 30, 2, 2);
      break;
    }
    // ── Humanoids ─────────────────────────────────────────────────────────────
    case 'bandit': {
      let bob = Math.sin(tick * 0.1) * 1;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(7, S-5, S-14, 3);
      c.fillStyle = '#2a1a08'; c.fillRect(9, S-8, 5, 5); c.fillRect(S-14, S-8, 5, 5);
      c.fillStyle = '#3a2a18'; c.fillRect(9, S-14, 5, 6); c.fillRect(S-14, S-14, 5, 6);
      c.fillStyle = '#2a2218'; c.fillRect(8, 14, S-16, 8); c.fillStyle = '#3a3020'; c.fillRect(9, 13, S-18, 7);
      c.fillStyle = '#5a3a10'; c.fillRect(8, 21, S-16, 2); c.fillStyle = '#4a3010'; c.fillRect(13, 21, 5, 4);
      c.fillStyle = '#2a2218'; c.fillRect(4, 14, 5, 8); c.fillRect(S-9, 14, 5, 8);
      c.fillStyle = '#c09060'; c.fillRect(12, 11, 8, 4);
      c.fillStyle = '#1a1810'; c.fillRect(8, 4, S-16, 10); c.fillRect(6, 6, 3, 7); c.fillRect(S-9, 6, 3, 7);
      c.fillStyle = '#8a1010'; c.fillRect(9, 10, S-18, 4); c.fillStyle = '#aa2020'; c.fillRect(10, 10, S-20, 2);
      c.fillStyle = '#c09060'; c.fillRect(10, 7, 4, 3); c.fillRect(S-14, 7, 4, 3);
      c.fillStyle = '#111'; c.fillRect(11, 8, 2, 2); c.fillRect(S-13, 8, 2, 2);
      c.fillStyle = '#c0c8d0'; c.fillRect(S-7, 16, 2, 8); c.fillStyle = '#6a4010'; c.fillRect(S-8, 15, 4, 2);
      break;
    }
    case 'skeleton_king': {
      let bob = Math.sin(tick * 0.06) * 2;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(4, S-5, S-8, 4);
      c.fillStyle = '#d4af37'; c.fillRect(6, 1+bob, S-12, 4);
      c.fillRect(6, -2+bob, 3, 5); c.fillRect(13, -3+bob, 4, 6); c.fillRect(S-9, -2+bob, 3, 5);
      c.fillStyle = '#cc3333'; c.fillRect(7, -1+bob, 2, 2); c.fillRect(14, -2+bob, 2, 2); c.fillRect(S-9, -1+bob, 2, 2);
      c.fillStyle = '#d0c8b0'; c.fillRect(7, S-7, 6, 6); c.fillRect(S-13, S-7, 6, 6);
      c.fillStyle = '#c8c0a8'; c.fillRect(9, 18, 4, 7); c.fillRect(S-13, 18, 4, 7);
      c.fillStyle = '#b8b0a0'; c.fillRect(6, 17, S-12, 4);
      c.fillStyle = '#d0c8b0'; c.fillRect(S/2-2, 7+bob, 4, 11);
      c.fillStyle = '#b0a898'; c.fillRect(5, 9+bob, S-10, 9);
      c.fillStyle = '#100e18'; c.fillRect(8, 11+bob, 1, 5); c.fillRect(11, 10+bob, 1, 7); c.fillRect(14, 11+bob, 1, 5);
      c.fillRect(S-9, 11+bob, 1, 5); c.fillRect(S-12, 10+bob, 1, 7); c.fillRect(S-15, 11+bob, 1, 5);
      c.fillStyle = '#c8c0a8'; c.fillRect(1, 9+bob, 5, 10); c.fillRect(S-6, 9+bob, 5, 10);
      c.fillStyle = '#e0d8c8'; c.fillRect(6, 1+bob, S-12, 9); c.fillStyle = '#d0c8b8'; c.fillRect(7, 8+bob, S-14, 3);
      c.fillStyle = '#080614'; c.fillRect(8, 3+bob, 6, 4); c.fillRect(S-14, 3+bob, 6, 4);
      c.fillStyle = 'rgba(255,30,30,0.9)'; c.fillRect(9, 4+bob, 4, 2); c.fillRect(S-13, 4+bob, 4, 2);
      c.fillStyle = '#e0d8c8'; c.fillRect(9, 9+bob, 2, 2); c.fillRect(12, 9+bob, 2, 2); c.fillRect(15, 9+bob, 2, 2); c.fillRect(S-11, 9+bob, 2, 2); c.fillRect(S-14, 9+bob, 2, 2);
      c.fillStyle = '#9090c8'; c.fillRect(S-5, 5+bob, 3, 18); c.fillStyle = '#6060a0'; c.fillRect(S-8, 13+bob, 9, 2);
      break;
    }
    case 'dwarf_militia': {
      let bob = Math.sin(tick * 0.09) * 1;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(7, S-4, S-14, 3);
      c.fillStyle = '#2a1a08'; c.fillRect(9, S-7, 5, 5); c.fillRect(S-14, S-7, 5, 5);
      c.fillStyle = '#505870'; c.fillRect(9, 22, 5, 5); c.fillRect(S-14, 22, 5, 5);
      c.fillStyle = '#606878'; c.fillRect(7, 15, S-14, 9); c.fillStyle = '#707888'; c.fillRect(8, 14, S-16, 8);
      c.fillStyle = '#505868'; c.fillRect(8, 16, S-16, 1); c.fillRect(8, 19, S-16, 1);
      c.fillStyle = '#686878'; c.fillRect(4, 13, 6, 5); c.fillRect(S-10, 13, 6, 5);
      c.fillStyle = '#585868'; c.fillRect(3, 18, 5, 6); c.fillRect(S-8, 18, 5, 6);
      c.fillStyle = '#c09060'; c.fillRect(12, 11, 8, 5);
      c.fillStyle = '#606878'; c.fillRect(8, 4, S-16, 9); c.fillStyle = '#707888'; c.fillRect(9, 3, S-18, 8);
      c.fillStyle = '#101820'; c.fillRect(10, 7, S-20, 3);
      c.fillStyle = 'rgba(255,140,50,0.3)'; c.fillRect(11, 7, S-22, 2);
      c.fillStyle = '#808898'; c.fillRect(S-6, 8, 3, 16); c.fillStyle = '#707888'; c.fillRect(S-8, 8, 7, 6);
      c.fillStyle = '#505868'; c.fillRect(S-7, 9, 5, 4);
      break;
    }
    case 'siege_dwarf': {
      let bob = Math.sin(tick * 0.09) * 1;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(5, S-4, S-10, 3);
      c.fillStyle = '#2a1a08'; c.fillRect(9, S-7, 5, 5); c.fillRect(S-14, S-7, 5, 5);
      c.fillStyle = '#4a4020'; c.fillRect(9, 22, 5, 5); c.fillRect(S-14, 22, 5, 5);
      c.fillStyle = '#5a5028'; c.fillRect(7, 15, S-14, 9); c.fillStyle = '#7a6830'; c.fillRect(8, 14, S-16, 8);
      c.fillStyle = '#8a5820'; c.fillRect(9, 14, 1, 9); c.fillRect(15, 13, 1, 10);
      c.fillStyle = '#6a6030'; c.fillRect(3, 14, 5, 9); c.fillRect(S-8, 14, 5, 9);
      c.fillStyle = '#c09060'; c.fillRect(12, 11, 8, 5);
      c.fillStyle = '#7a6830'; c.fillRect(8, 5, S-16, 8); c.fillStyle = '#8a7838'; c.fillRect(9, 4, S-18, 7);
      c.fillStyle = '#5a5028'; c.fillRect(6, 4, S-12, 3);
      c.fillStyle = '#c08820'; c.fillRect(10, 7, 5, 3); c.fillRect(S-15, 7, 5, 3);
      c.fillStyle = '#402808'; c.fillRect(11, 7, 3, 2); c.fillRect(S-14, 7, 3, 2);
      c.fillStyle = '#5a3810'; c.fillRect(0, 19, S, 3);
      c.fillStyle = '#808898'; c.fillRect(0, 17, 6, 3); c.fillRect(S-6, 17, 6, 3);
      c.fillStyle = '#c0c0c8'; c.fillRect(-1, 20, 3, 1);
      break;
    }
    case 'skeleton_archer': {
      let bob = Math.sin(tick * 0.07) * 2;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(6, S-6, S-12, 3);
      c.fillStyle = '#d0c8b8'; c.fillRect(8, S-8, 5, 5); c.fillRect(S-13, S-8, 5, 5);
      c.fillStyle = '#c8c0a8'; c.fillRect(9, 18, 4, 8); c.fillRect(S-13, 18, 4, 8);
      c.fillStyle = '#b8b0a0'; c.fillRect(7, 17, S-14, 4);
      c.fillStyle = '#d0c8b0'; c.fillRect(S/2-2, 8+bob, 4, 10);
      c.fillStyle = '#b8b0a0'; c.fillRect(6, 10+bob, S-12, 8);
      c.fillStyle = '#100e18'; c.fillRect(9, 12+bob, 1, 5); c.fillRect(12, 11+bob, 1, 6); c.fillRect(15, 12+bob, 1, 5);
      c.fillRect(S-10, 12+bob, 1, 5); c.fillRect(S-13, 11+bob, 1, 6); c.fillRect(S-16, 12+bob, 1, 5);
      c.fillStyle = '#c8c0a8'; c.fillRect(3, 10+bob, 4, 10); c.fillRect(S-7, 10+bob, 4, 10);
      c.fillStyle = '#e0d8c8'; c.fillRect(8, 2+bob, S-16, 10); c.fillStyle = '#d0c8b8'; c.fillRect(9, 10+bob, S-18, 3);
      c.fillStyle = '#0a0818'; c.fillRect(10, 4+bob, 5, 4); c.fillRect(S-15, 4+bob, 5, 4);
      c.fillStyle = 'rgba(180,0,0,0.7)'; c.fillRect(11, 5+bob, 3, 2); c.fillRect(S-14, 5+bob, 3, 2);
      c.fillStyle = '#e0d8c8'; c.fillRect(11, 11+bob, 2, 2); c.fillRect(14, 11+bob, 2, 2); c.fillRect(S-13, 11+bob, 2, 2);
      c.fillStyle = '#7a5020'; c.fillRect(S-5, 4+bob, 2, 20);
      c.fillStyle = '#c0a060'; c.fillRect(S-7, 5+bob, 3, 2); c.fillRect(S-7, 21+bob, 3, 2);
      c.fillStyle = '#e0d0b0'; c.fillRect(S-4, 5+bob, 1, 18);
      c.fillStyle = '#9a7020'; c.fillRect(1, 9+bob, 1, 8); c.fillStyle = '#cc4444'; c.fillRect(1, 8+bob, 1, 2);
      break;
    }
    case 'ice_revenant': {
      let bob = Math.sin(tick * 0.07) * 2;
      c.fillStyle = 'rgba(0,0,0,0.15)'; c.fillRect(6, S-5, S-12, 3);
      c.fillStyle = '#80b8d0'; c.fillRect(8, S-8, 5, 5); c.fillRect(S-13, S-8, 5, 5);
      c.fillStyle = '#70a8c0'; c.fillRect(9+bob*0.3, 18, 4, 8); c.fillRect(S-13-bob*0.3, 18, 4, 8);
      c.fillStyle = '#68a0b8'; c.fillRect(7, 17, S-14, 4);
      c.fillStyle = '#80b8d0'; c.fillRect(S/2-2, 8+bob, 4, 10);
      c.fillStyle = '#5898b0'; c.fillRect(6, 10+bob, S-12, 8);
      c.fillStyle = '#103040'; c.fillRect(9, 12+bob, 1, 5); c.fillRect(12, 11+bob, 1, 6); c.fillRect(15, 12+bob, 1, 5);
      c.fillRect(S-10, 12+bob, 1, 5); c.fillRect(S-13, 11+bob, 1, 6); c.fillRect(S-16, 12+bob, 1, 5);
      c.fillStyle = '#78b0c8'; c.fillRect(3, 10+bob, 4, 10); c.fillRect(S-7, 10+bob, 4, 10);
      c.fillStyle = '#a0d8f0'; c.fillRect(1, 9+bob, 3, 4); c.fillRect(S-4, 9+bob, 3, 4);
      c.fillStyle = '#90c8e0'; c.fillRect(8, 2+bob, S-16, 10); c.fillStyle = '#78b0c8'; c.fillRect(9, 10+bob, S-18, 3);
      c.fillStyle = '#08182a'; c.fillRect(10, 4+bob, 5, 4); c.fillRect(S-15, 4+bob, 5, 4);
      c.fillStyle = 'rgba(80,200,255,0.9)'; c.fillRect(11, 5+bob, 3, 2); c.fillRect(S-14, 5+bob, 3, 2);
      c.fillStyle = '#b0e0f0'; c.fillRect(11, 11+bob, 2, 2); c.fillRect(14, 11+bob, 2, 2); c.fillRect(S-13, 11+bob, 2, 2);
      break;
    }
    case 'corrupted_priest': {
      let bob = Math.sin(tick * 0.08) * 1;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(7, S-5, S-14, 3);
      c.fillStyle = '#1a0a2a'; c.fillRect(6, 20, S-12, 9);
      c.fillStyle = '#2a1040'; c.fillRect(8, 13, S-16, 9); c.fillStyle = '#3a1850'; c.fillRect(9, 12, S-18, 8);
      c.fillStyle = 'rgba(100,0,150,0.6)'; c.fillRect(10, 14, 3, 4); c.fillRect(17, 15, 3, 3); c.fillRect(S-11, 14, 3, 4);
      c.fillStyle = '#2a1040'; c.fillRect(4, 14, 5, 8); c.fillRect(S-9, 14, 5, 8);
      c.fillStyle = '#660088'; c.fillRect(13, 16, 6, 2); c.fillRect(15, 14, 2, 6);
      c.fillStyle = '#c0a080'; c.fillRect(12, 10, 8, 4);
      c.fillStyle = '#1a0a2a'; c.fillRect(8, 2, S-16, 7); c.fillRect(6, 4, 3, 7); c.fillRect(S-9, 4, 3, 7);
      c.fillStyle = '#c0a080'; c.fillRect(10, 8, 4, 3); c.fillRect(S-14, 8, 4, 3);
      c.fillStyle = 'rgba(180,0,255,0.9)'; c.fillRect(11, 9, 3, 2); c.fillRect(S-13, 9, 3, 2);
      c.fillStyle = '#5a3a18'; c.fillRect(3, 3, 2, 22);
      c.fillStyle = '#440066'; c.fillRect(1, 1, 6, 5); c.fillStyle = 'rgba(160,0,220,0.8)'; c.fillRect(2, 2, 4, 3);
      break;
    }
    case 'forest_wraith': {
      let float = Math.sin(tick * 0.09) * 2;
      c.fillStyle = 'rgba(0,0,0,0.1)'; c.fillRect(8, S-4, S-16, 3);
      c.fillStyle = 'rgba(20,30,10,0.6)'; c.fillRect(8, 22+float, 4, 6); c.fillRect(14, 23+float, 3, 5); c.fillRect(20, 22+float, 4, 6);
      c.fillRect(6, 24+float, 3, 4); c.fillRect(11, 25+float, 2, 3); c.fillRect(17, 24+float, 2, 4);
      c.fillStyle = 'rgba(20,35,15,0.8)'; c.fillRect(7, 12+float, S-14, 12);
      c.fillStyle = 'rgba(30,50,20,0.7)'; c.fillRect(9, 10+float, S-18, 10);
      c.fillStyle = 'rgba(20,35,15,0.6)'; c.fillRect(2, 13+float, 7, 4); c.fillRect(S-9, 13+float, 7, 4);
      c.fillRect(0, 11+float, 4, 3); c.fillRect(S-4, 11+float, 4, 3);
      c.fillStyle = 'rgba(25,40,18,0.9)'; c.fillRect(9, 3+float, S-18, 10);
      c.fillStyle = 'rgba(35,55,25,0.8)'; c.fillRect(10, 2+float, S-20, 8);
      c.fillStyle = '#060c04'; c.fillRect(11, 5+float, 4, 4); c.fillRect(S-15, 5+float, 4, 4);
      c.fillStyle = 'rgba(60,200,30,0.9)'; c.fillRect(12, 6+float, 2, 2); c.fillRect(S-14, 6+float, 2, 2);
      c.fillStyle = 'rgba(50,180,20,0.2)'; c.fillRect(5, 8+float, 4, 6); c.fillRect(S-9, 8+float, 4, 6);
      break;
    }
    case 'shadow_spider': {
      let legWave = Math.sin(tick * 0.14) * 1;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(3, S-4, S-6, 3);
      c.fillStyle = '#1a1a10';
      c.fillRect(0, 12+legWave, 8, 2); c.fillRect(0, 15, 8, 2); c.fillRect(0, 18-legWave, 8, 2); c.fillRect(2, 10+legWave, 6, 2);
      c.fillRect(S-8, 12+legWave, 8, 2); c.fillRect(S-8, 15, 8, 2); c.fillRect(S-8, 18-legWave, 8, 2); c.fillRect(S-8, 10+legWave, 6, 2);
      c.fillStyle = '#222218'; c.fillRect(9, 17, S-18, 10); c.fillStyle = '#1a1a14'; c.fillRect(10, 18, S-20, 8);
      c.fillStyle = '#cc0000'; c.fillRect(13, 19, 6, 6); c.fillRect(15, 18, 2, 8);
      c.fillStyle = '#2a2a20'; c.fillRect(10, 11, S-20, 7);
      c.fillStyle = '#222218'; c.fillRect(11, 7, S-22, 6);
      c.fillStyle = '#cc2020';
      c.fillRect(11, 8, 2, 2); c.fillRect(14, 8, 2, 2); c.fillRect(17, 8, 2, 2); c.fillRect(20, 8, 2, 2);
      c.fillStyle = '#888'; c.fillRect(13, 12, 2, 3); c.fillRect(S-15, 12, 2, 3);
      break;
    }
    // ── Golems & giants ───────────────────────────────────────────────────────
    case 'rock_golem': {
      let stomp = Math.sin(tick * 0.07) * 1;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(3, S-4, S-6, 4);
      c.fillStyle = '#4a4038'; c.fillRect(6, 22, 7, 8); c.fillRect(S-13, 22, 7, 8);
      c.fillStyle = '#3a3028'; c.fillRect(5, 24+stomp, 8, 4); c.fillRect(S-13, 24-stomp, 8, 4);
      c.fillStyle = '#5a5040'; c.fillRect(4, 10, S-8, 14); c.fillStyle = '#6a6050'; c.fillRect(5, 8, S-10, 12);
      c.fillStyle = '#3a3028'; c.fillRect(7, 11, 2, 6); c.fillRect(12, 10, 1, 8); c.fillRect(17, 12, 2, 5); c.fillRect(S-10, 11, 2, 6);
      c.fillStyle = '#5a5040'; c.fillRect(0, 11, 5, 10); c.fillRect(S-5, 11, 5, 10);
      c.fillStyle = '#4a4038'; c.fillRect(0, 14, 4, 5); c.fillRect(S-4, 14, 4, 5);
      c.fillStyle = '#5a5040'; c.fillRect(6, 2, S-12, 9); c.fillStyle = '#6a6050'; c.fillRect(7, 1, S-14, 8);
      c.fillStyle = '#ff6600'; c.fillRect(9, 3, 5, 3); c.fillRect(S-14, 3, 5, 3);
      c.fillStyle = '#ffaa40'; c.fillRect(10, 4, 3, 1); c.fillRect(S-13, 4, 3, 1);
      c.fillStyle = '#2a2020'; c.fillRect(9, 5, S-18, 1);
      break;
    }
    case 'forge_guardian': {
      let pulse = Math.sin(tick * 0.08) * 1;
      c.fillStyle = 'rgba(0,0,0,0.45)'; c.fillRect(3, S-4, S-6, 4);
      c.fillStyle = '#2a1a08'; c.fillRect(7, 22, 6, 7); c.fillRect(S-13, 22, 6, 7);
      c.fillStyle = '#3a2010'; c.fillRect(6, 20, 8, 5); c.fillRect(S-14, 20, 8, 5);
      c.fillStyle = '#3a2808'; c.fillRect(5, 10, S-10, 12); c.fillStyle = '#4a3810'; c.fillRect(6, 8, S-12, 11);
      c.fillStyle = `rgba(255,${80+pulse*60},0,0.7)`; c.fillRect(10, 11, S-20, 7);
      c.fillStyle = `rgba(255,200,50,${0.3+pulse*0.2})`; c.fillRect(12, 12, S-24, 5);
      c.fillStyle = '#3a2808'; c.fillRect(1, 9, 7, 7); c.fillRect(S-8, 9, 7, 7);
      c.fillStyle = `rgba(255,100,0,0.4)`; c.fillRect(2, 10, 5, 4); c.fillRect(S-7, 10, 5, 4);
      c.fillStyle = '#3a2808'; c.fillRect(0, 16, 6, 8); c.fillRect(S-6, 16, 6, 8);
      c.fillStyle = '#2a1808'; c.fillRect(7, 2, S-14, 9); c.fillStyle = '#3a2810'; c.fillRect(8, 1, S-16, 8);
      c.fillStyle = '#0a0402'; c.fillRect(9, 3, S-18, 5);
      c.fillStyle = `rgba(255,${80+pulse*80},0,0.85)`; c.fillRect(10, 4, S-20, 3);
      c.fillStyle = '#505060'; c.fillRect(S-7, 10, 3, 18);
      c.fillStyle = '#404050'; c.fillRect(S-10, 8, 9, 7);
      c.fillStyle = `rgba(255,100,0,0.5)`; c.fillRect(S-9, 9, 7, 5);
      break;
    }
    case 'cave_troll': {
      let stomp = Math.sin(tick * 0.08) * 1;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(2, S-4, S-4, 4);
      c.fillStyle = '#3a4a2a'; c.fillRect(5, S-7, 8, 5); c.fillRect(S-13, S-7, 8, 5);
      c.fillStyle = '#4a5a38'; c.fillRect(6, 20, 7, 8+stomp); c.fillRect(S-13, 20, 7, 8-stomp);
      c.fillStyle = '#4a5a38'; c.fillRect(3, 12, S-6, 12); c.fillStyle = '#5a6a48'; c.fillRect(4, 10, S-8, 10);
      c.fillStyle = '#3a4a28'; c.fillRect(7, 12, 3, 2); c.fillRect(14, 11, 2, 2); c.fillRect(20, 13, 3, 2); c.fillRect(S-9, 12, 3, 2);
      c.fillStyle = '#4a5a38'; c.fillRect(0, 13, 5, 12); c.fillRect(S-5, 13, 5, 12);
      c.fillStyle = '#3a4a28'; c.fillRect(0, 20, 5, 4); c.fillRect(S-5, 20, 5, 4);
      c.fillStyle = '#2a3820'; c.fillRect(0, S-7, 5, 3); c.fillRect(S-5, S-7, 5, 3);
      c.fillStyle = '#4a5a38'; c.fillRect(7, 4, S-14, 10); c.fillStyle = '#5a6a48'; c.fillRect(8, 3, S-16, 8);
      c.fillStyle = '#3a4a28'; c.fillRect(7, 4, S-14, 4);
      c.fillStyle = '#3a4a28'; c.fillRect(11, 9, 10, 5); c.fillStyle = '#2a3820'; c.fillRect(12, 10, 3, 3); c.fillRect(S-15, 10, 3, 3);
      c.fillStyle = '#cc8800'; c.fillRect(10, 6, 3, 3); c.fillRect(S-13, 6, 3, 3);
      c.fillStyle = '#222'; c.fillRect(11, 7, 2, 2); c.fillRect(S-12, 7, 2, 2);
      c.fillStyle = '#e8e0b0'; c.fillRect(11, 12, 2, 4); c.fillRect(S-13, 12, 2, 4);
      break;
    }
    case 'dark_knight': {
      let bob = Math.sin(tick * 0.06) * 1;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(4, S-5, S-8, 4);
      c.fillStyle = '#060608'; c.fillRect(7, S-8, 6, 6); c.fillRect(S-13, S-8, 6, 6);
      c.fillStyle = '#0a0a14'; c.fillRect(8, S-14, 5, 7); c.fillRect(S-13, S-14, 5, 7);
      c.fillStyle = '#08081a'; c.fillRect(6, S-16, 6, 4); c.fillRect(S-12, S-16, 6, 4);
      c.fillStyle = '#05050f'; c.fillRect(6, 13+bob, S-12, 9); c.fillStyle = '#0a0a1c'; c.fillRect(7, 12+bob, S-14, 8);
      c.fillStyle = '#040410'; c.fillRect(3, 12+bob, 6, 6); c.fillRect(S-9, 12+bob, 6, 6);
      c.fillStyle = '#05050f'; c.fillRect(2, 18+bob, 5, 6); c.fillRect(S-7, 18+bob, 5, 6);
      c.fillStyle = '#880000'; c.fillRect(7, 12+bob, S-14, 1); c.fillRect(6, 13+bob, 1, 9); c.fillRect(S-7, 13+bob, 1, 9);
      c.fillStyle = '#05050f'; c.fillRect(8, 2+bob, S-16, 12); c.fillStyle = '#0a0a1c'; c.fillRect(9, 3+bob, S-18, 10);
      c.fillStyle = '#020204'; c.fillRect(10, 5+bob, S-20, 5);
      c.fillStyle = 'rgba(200,0,0,0.95)'; c.fillRect(11, 6+bob, S-22, 2);
      c.fillStyle = '#2a2a40'; c.fillRect(S-6, 8+bob, 3, 16);
      c.fillStyle = '#440000'; c.fillRect(S-9, 15+bob, 9, 2);
      c.fillStyle = 'rgba(180,0,0,0.6)'; c.fillRect(S-5, 4+bob, 1, 5);
      break;
    }
    case 'undead_knight': {
      let bob = Math.sin(tick * 0.06) * 1;
      c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(4, S-5, S-8, 4);
      c.fillStyle = '#2a2818'; c.fillRect(7, S-8, 6, 6); c.fillRect(S-13, S-8, 6, 6);
      c.fillStyle = '#3a3820'; c.fillRect(8, S-14, 5, 7); c.fillRect(S-13, S-14, 5, 7);
      c.fillStyle = '#383618'; c.fillRect(6, 13+bob, S-12, 9); c.fillStyle = '#4a4828'; c.fillRect(7, 12+bob, S-14, 8);
      c.fillStyle = '#282610'; c.fillRect(3, 12+bob, 6, 6); c.fillRect(S-9, 12+bob, 6, 6);
      c.fillStyle = '#8b4513'; c.fillRect(9, 14+bob, 2, 3); c.fillRect(15, 13+bob, 2, 4); c.fillRect(S-11, 15+bob, 2, 3);
      c.fillStyle = '#3a3820'; c.fillRect(8, 2+bob, S-16, 12); c.fillStyle = '#4a4828'; c.fillRect(9, 3+bob, S-18, 10);
      c.fillStyle = '#181808'; c.fillRect(10, 5+bob, S-20, 5);
      c.fillStyle = '#d8d0b8'; c.fillRect(11, 5+bob, 4, 4); c.fillRect(S-15, 5+bob, 4, 4);
      c.fillStyle = '#0a0818'; c.fillRect(12, 6+bob, 2, 2); c.fillRect(S-14, 6+bob, 2, 2);
      c.fillStyle = 'rgba(150,0,0,0.7)'; c.fillRect(12, 6+bob, 2, 1); c.fillRect(S-14, 6+bob, 2, 1);
      c.fillStyle = '#808090'; c.fillRect(S-6, 8+bob, 3, 16);
      c.fillStyle = '#6a6070'; c.fillRect(S-9, 15+bob, 9, 2);
      break;
    }
    case 'ancient_treant': {
      let sway = Math.sin(tick * 0.05) * 2;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(4, S-4, S-8, 4);
      c.fillStyle = '#3a2808'; c.fillRect(6, 24, 4, 6); c.fillRect(10, 25, 3, 5); c.fillRect(S-13, 24, 4, 6); c.fillRect(S-13, 25, 3, 5);
      c.fillStyle = '#4a3510'; c.fillRect(7, 18, 6, 8); c.fillRect(S-13, 18, 6, 8);
      c.fillStyle = '#4a3510'; c.fillRect(5, 10, S-10, 10); c.fillStyle = '#5a4518'; c.fillRect(6, 8, S-12, 9);
      c.fillStyle = '#3a2808'; c.fillRect(8, 10, 2, 7); c.fillRect(13, 9, 2, 8); c.fillRect(18, 11, 2, 6); c.fillRect(S-10, 10, 2, 7);
      c.fillStyle = '#4a3510'; c.fillRect(0, 9+sway, 7, 4); c.fillRect(S-7, 9-sway, 7, 4);
      c.fillStyle = '#3a2808'; c.fillRect(0, 8+sway, 4, 2); c.fillRect(S-4, 8-sway, 4, 2);
      c.fillStyle = '#2a1a08'; c.fillRect(-1, 7+sway, 2, 2); c.fillRect(2, 5+sway, 2, 4); c.fillRect(S-3, 7-sway, 2, 2); c.fillRect(S-4, 5-sway, 2, 4);
      c.fillStyle = '#1a5010'; c.fillRect(0, 5+sway, 6, 4); c.fillRect(S-6, 5-sway, 6, 4);
      c.fillStyle = '#2a7020'; c.fillRect(1, 4+sway, 4, 3); c.fillRect(S-5, 4-sway, 4, 3);
      c.fillStyle = '#4a3510'; c.fillRect(7, 1+sway, S-14, 9); c.fillStyle = '#5a4518'; c.fillRect(8, 0+sway, S-16, 8);
      c.fillStyle = '#1a0c04'; c.fillRect(10, 3+sway, 5, 4); c.fillRect(S-15, 3+sway, 5, 4);
      c.fillStyle = '#80c020'; c.fillRect(11, 4+sway, 3, 2); c.fillRect(S-14, 4+sway, 3, 2);
      c.fillStyle = '#2a1808'; c.fillRect(10, 7+sway, S-20, 1);
      break;
    }
    case 'ancient_frost_giant': {
      let bob = Math.sin(tick * 0.05) * 1;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(2, S-4, S-4, 4);
      c.fillStyle = '#3050a0'; c.fillRect(5, S-7, 8, 5); c.fillRect(S-13, S-7, 8, 5);
      c.fillStyle = '#4060b0'; c.fillRect(6, 19, 7, 9); c.fillRect(S-13, 19, 7, 9);
      c.fillStyle = '#5070c0'; c.fillRect(7, 18, 6, 7); c.fillRect(S-13, 18, 6, 7);
      c.fillStyle = '#3858a8'; c.fillRect(3, 10, S-6, 11); c.fillStyle = '#4868b8'; c.fillRect(4, 8, S-8, 10);
      c.fillStyle = '#80c8f0'; c.fillRect(8, 11, 4, 6); c.fillRect(14, 10, 4, 7); c.fillRect(20, 11, 4, 6);
      c.fillStyle = '#a0e0ff'; c.fillRect(9, 12, 2, 4); c.fillRect(15, 11, 2, 5); c.fillRect(21, 12, 2, 4);
      c.fillStyle = '#3858a8'; c.fillRect(0, 10, 5, 12); c.fillRect(S-5, 10, 5, 12);
      c.fillStyle = '#4060b0'; c.fillRect(0, 14, 4, 6); c.fillRect(S-4, 14, 4, 6);
      c.fillStyle = '#5878c0'; c.fillRect(10, 6, 12, 5);
      c.fillStyle = '#3858a8'; c.fillRect(6, 0, S-12, 8); c.fillStyle = '#4868b8'; c.fillRect(7, -1, S-14, 8);
      c.fillStyle = '#80c8f0'; c.fillRect(6, 4, 4, 5); c.fillRect(S-10, 4, 4, 5); c.fillRect(9, 7, S-18, 3);
      c.fillStyle = '#101828'; c.fillRect(9, 2, 5, 4); c.fillRect(S-14, 2, 5, 4);
      c.fillStyle = '#a0d8ff'; c.fillRect(10, 3, 3, 2); c.fillRect(S-13, 3, 3, 2);
      c.fillStyle = '#c0e8ff'; c.fillRect(8, -3, 2, 4); c.fillRect(13, -4, 3, 5); c.fillRect(S-10, -3, 2, 4);
      break;
    }
    case 'titan_golem': {
      let stomp = Math.sin(tick * 0.05) * 1;
      c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(1, S-4, S-2, 4);
      c.fillStyle = '#404850'; c.fillRect(3, S-6, 9, 4); c.fillRect(S-12, S-6, 9, 4);
      c.fillStyle = '#505860'; c.fillRect(4, 19, 8, 9+stomp); c.fillRect(S-12, 19, 8, 9-stomp);
      c.fillStyle = '#484850'; c.fillRect(3, 8, S-6, 13); c.fillStyle = '#5a5a60'; c.fillRect(4, 6, S-8, 12);
      c.fillStyle = '#303038'; c.fillRect(6, 10, 1, 8); c.fillRect(S/2-1, 8, 1, 11); c.fillRect(S-7, 10, 1, 8); c.fillRect(6, 14, S-12, 1);
      c.fillStyle = '#8060ff'; c.fillRect(11, 11, 10, 8); c.fillStyle = '#a080ff'; c.fillRect(12, 12, 8, 6);
      c.fillStyle = 'rgba(200,180,255,0.5)'; c.fillRect(13, 13, 6, 4);
      c.fillStyle = '#404850'; c.fillRect(0, 8, 5, 14); c.fillRect(S-5, 8, 5, 14);
      c.fillStyle = '#303038'; c.fillRect(0, 14, 4, 4); c.fillRect(S-4, 14, 4, 4);
      c.fillStyle = '#484850'; c.fillRect(5, 0, S-10, 9); c.fillStyle = '#5a5a60'; c.fillRect(6, -1, S-12, 8);
      c.fillStyle = '#5040c0'; c.fillRect(7, 1, 7, 5); c.fillRect(S-14, 1, 7, 5);
      c.fillStyle = '#c0a0ff'; c.fillRect(8, 2, 5, 3); c.fillRect(S-13, 2, 5, 3);
      c.fillStyle = 'rgba(200,180,255,0.7)'; c.fillRect(9, 3, 3, 1); c.fillRect(S-12, 3, 3, 1);
      break;
    }
    // ── Dragons & serpents ────────────────────────────────────────────────────
    case 'wyvern': {
      let wingFlap = Math.sin(tick * 0.12) * 4;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(3, S-4, S-6, 4);
      c.fillStyle = '#6a0808'; c.fillRect(S-7, 20, 5, 4); c.fillRect(S-4, 23, 4, 3); c.fillRect(S-2, 25, 3, 2);
      c.fillStyle = '#7a1010'; c.fillRect(8, 22, 5, 7); c.fillRect(S-13, 22, 5, 7);
      c.fillStyle = '#6a0808'; c.fillRect(7, 26, 6, 3); c.fillRect(S-13, 26, 6, 3);
      c.fillStyle = '#8a1818'; c.fillRect(7, 14, S-14, 10); c.fillStyle = '#9a2020'; c.fillRect(8, 12, S-16, 9);
      c.fillStyle = '#7a1010'; c.fillRect(0, 8-wingFlap, 8, 12+wingFlap); c.fillRect(S-8, 8-wingFlap, 8, 12+wingFlap);
      c.fillStyle = '#6a0808'; c.fillRect(1, 10-wingFlap, 6, 8+wingFlap); c.fillRect(S-7, 10-wingFlap, 6, 8+wingFlap);
      c.fillStyle = '#5a0606'; c.fillRect(2, 12, 4, 2); c.fillRect(S-6, 12, 4, 2);
      c.fillStyle = '#8a1818'; c.fillRect(10, 6, 8, 9);
      c.fillStyle = '#9a2020'; c.fillRect(7, 2, S-14, 7);
      c.fillStyle = '#4a0808'; c.fillRect(10, -1, 2, 4); c.fillRect(14, -2, 2, 5); c.fillRect(S-12, -1, 2, 4);
      c.fillStyle = '#ffee00'; c.fillRect(9, 3, 4, 3); c.fillRect(S-13, 3, 4, 3);
      c.fillStyle = '#000'; c.fillRect(10, 3, 2, 3); c.fillRect(S-12, 3, 2, 3);
      break;
    }
    case 'elder_dragon': {
      let flame = Math.sin(tick * 0.12);
      c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(1, S-4, S-2, 4);
      c.fillStyle = '#6a0800'; c.fillRect(S-8, 22, 7, 6); c.fillRect(S-5, 26, 5, 3); c.fillRect(S-2, 28, 3, 2);
      c.fillStyle = '#c0c0c0'; c.fillRect(S-3, 28, 2, 2);
      c.fillStyle = '#7a0808'; c.fillRect(-1, 4, 9, 18); c.fillRect(S-8, 4, 9, 18);
      c.fillStyle = '#5a0606'; c.fillRect(0, 6, 7, 14); c.fillRect(S-7, 6, 7, 14);
      c.fillStyle = '#a0a0b0'; c.fillRect(0, 6, 1, 14); c.fillRect(S-1, 6, 1, 14);
      c.fillStyle = '#8a0808'; c.fillRect(5, 12, S-10, 14); c.fillStyle = '#a01010'; c.fillRect(6, 10, S-12, 13);
      c.fillStyle = '#909090'; c.fillRect(10, 10, 2, 6); c.fillRect(15, 9, 2, 7); c.fillRect(20, 10, 2, 6);
      c.fillStyle = '#b0b0b8'; c.fillRect(9, 14, S-18, 10);
      c.fillStyle = '#8a0808'; c.fillRect(9, 3, 14, 10);
      c.fillStyle = '#a01010'; c.fillRect(5, 0, S-10, 7);
      c.fillStyle = '#3a0808'; c.fillRect(6, -4, 3, 6); c.fillRect(11, -5, 3, 7); c.fillRect(S-9, -5, 3, 7); c.fillRect(S-9, -4, 3, 6);
      c.fillStyle = '#ffe030'; c.fillRect(8, 1, 5, 4); c.fillRect(S-13, 1, 5, 4);
      c.fillStyle = '#000'; c.fillRect(9, 1, 3, 4); c.fillRect(S-12, 1, 3, 4);
      c.fillStyle = '#c0c0c8'; c.fillRect(8, 6, 3, 4); c.fillRect(S-11, 6, 3, 4);
      c.fillStyle = `rgba(255,${100+Math.floor(flame*80)},0,0.8)`; c.fillRect(4, 5, 7, 3);
      c.fillStyle = `rgba(255,220,0,${0.6+flame*0.3})`; c.fillRect(3, 5, 5, 1);
      break;
    }
    case 'void_hydra': {
      let h1 = Math.sin(tick * 0.1) * 2;
      let h2 = Math.sin(tick * 0.1 + 1) * 2;
      let h3 = Math.sin(tick * 0.1 + 2) * 2;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(4, S-4, S-8, 4);
      c.fillStyle = '#2a0848'; c.fillRect(6, 18, S-12, 10); c.fillStyle = '#360a5a'; c.fillRect(7, 16, S-14, 9);
      c.fillStyle = '#2a0848'; c.fillRect(9, 14, S-18, 7);
      c.fillStyle = '#1a0530'; c.fillRect(10, 17, 3, 2); c.fillRect(15, 16, 3, 2); c.fillRect(20, 17, 3, 2);
      c.fillStyle = '#2a0848'; c.fillRect(5, 9, 5, 7); c.fillRect(S/2-2, 7, 5, 9); c.fillRect(S-10, 9, 5, 7);
      c.fillStyle = '#360a5a'; c.fillRect(2, 4+h1, 10, 7); c.fillStyle = '#1a0530'; c.fillRect(2, 9+h1, 10, 2);
      c.fillStyle = '#8800cc'; c.fillRect(3, 5+h1, 3, 3); c.fillRect(7, 5+h1, 3, 3);
      c.fillStyle = '#ff00ff'; c.fillRect(4, 6+h1, 1, 1); c.fillRect(8, 6+h1, 1, 1);
      c.fillStyle = '#360a5a'; c.fillRect(S/2-5, 2+h2, 10, 7); c.fillStyle = '#1a0530'; c.fillRect(S/2-5, 7+h2, 10, 2);
      c.fillStyle = '#8800cc'; c.fillRect(S/2-4, 3+h2, 3, 3); c.fillRect(S/2+1, 3+h2, 3, 3);
      c.fillStyle = '#ff00ff'; c.fillRect(S/2-3, 4+h2, 1, 1); c.fillRect(S/2+2, 4+h2, 1, 1);
      c.fillStyle = '#360a5a'; c.fillRect(S-12, 4+h3, 10, 7); c.fillStyle = '#1a0530'; c.fillRect(S-12, 9+h3, 10, 2);
      c.fillStyle = '#8800cc'; c.fillRect(S-11, 5+h3, 3, 3); c.fillRect(S-7, 5+h3, 3, 3);
      c.fillStyle = '#ff00ff'; c.fillRect(S-10, 6+h3, 1, 1); c.fillRect(S-6, 6+h3, 1, 1);
      break;
    }
    case 'ancient_guardian': {
      let glow = Math.sin(tick * 0.08) * 0.3 + 0.7;
      c.fillStyle = 'rgba(0,0,0,0.45)'; c.fillRect(3, S-4, S-6, 4);
      c.fillStyle = '#4a4030'; c.fillRect(6, 24, 7, 6); c.fillRect(S-13, 24, 7, 6);
      c.fillStyle = '#5a5040'; c.fillRect(7, 16, 6, 10); c.fillRect(S-13, 16, 6, 10);
      c.fillStyle = '#5a5040'; c.fillRect(5, 8, S-10, 10); c.fillStyle = '#6a6050'; c.fillRect(6, 6, S-12, 10);
      c.fillStyle = `rgba(255,200,50,${glow})`;
      c.fillRect(9, 10, 2, 4); c.fillRect(13, 9, 2, 5); c.fillRect(17, 10, 2, 4); c.fillRect(S-11, 10, 2, 4);
      c.fillStyle = '#6a6050'; c.fillRect(0, 7, 6, 10); c.fillRect(S-6, 7, 6, 10);
      c.fillStyle = `rgba(255,200,50,${glow*0.3})`; c.fillRect(1, 9, 4, 7); c.fillRect(S-5, 9, 4, 7);
      c.fillStyle = '#5a5040'; c.fillRect(0, 11, 6, 8); c.fillRect(S-6, 11, 6, 8);
      c.fillStyle = '#6a6050'; c.fillRect(11, 4, 10, 5);
      c.fillStyle = '#5a5040'; c.fillRect(8, 0, S-16, 7); c.fillStyle = '#6a6050'; c.fillRect(9, -1, S-18, 7);
      c.fillStyle = '#4a4030'; c.fillRect(9, -4, S-18, 5);
      c.fillStyle = `rgba(255,200,50,${glow})`; c.fillRect(10, -4, S-20, 1); c.fillRect(S/2-1, -6, 2, 3);
      c.fillStyle = `rgba(255,200,50,${glow})`; c.fillRect(10, 1, 4, 3); c.fillRect(S-14, 1, 4, 3);
      c.fillStyle = `rgba(255,240,180,${glow})`; c.fillRect(11, 2, 2, 1); c.fillRect(S-13, 2, 2, 1);
      break;
    }
    // ── The Abyss ──────────────────────────────────────────────────────────
    case 'abyssal_crawler': {
      // Multi-limbed void creature — dark purple/black, six clawed legs, glowing eyes
      let scuttle = Math.sin(tick * 0.14) * 2;
      c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(3, S-4, S-6, 4);
      // Legs (3 per side, alternating)
      c.fillStyle = '#1a0030';
      c.fillRect(2, 14+scuttle, 4, 2); c.fillRect(2, 18, 4, 2); c.fillRect(2, 22-scuttle, 4, 2);
      c.fillRect(S-6, 14-scuttle, 4, 2); c.fillRect(S-6, 18, 4, 2); c.fillRect(S-6, 22+scuttle, 4, 2);
      // Claws
      c.fillStyle = '#2a0050';
      c.fillRect(0, 13+scuttle, 3, 2); c.fillRect(0, 17, 3, 2); c.fillRect(0, 21-scuttle, 3, 2);
      c.fillRect(S-3, 13-scuttle, 3, 2); c.fillRect(S-3, 17, 3, 2); c.fillRect(S-3, 21+scuttle, 3, 2);
      // Carapace body
      c.fillStyle = '#0d0020'; c.fillRect(6, 14, S-12, 12);
      c.fillStyle = '#180038'; c.fillRect(7, 12, S-14, 10);
      c.fillStyle = '#100028'; c.fillRect(8, 11, S-16, 4);
      // Void shimmer carapace segments
      c.fillStyle = 'rgba(80,0,140,0.3)';
      c.fillRect(8, 14, S-16, 2); c.fillRect(8, 18, S-16, 2);
      // Head (front/top)
      c.fillStyle = '#14002c'; c.fillRect(9, 6, S-18, 8);
      c.fillStyle = '#1e0040'; c.fillRect(10, 4, S-20, 6);
      // Glowing eyes (4 eyes in a row)
      c.fillStyle = '#cc00ff'; c.fillRect(10, 6, 3, 3); c.fillRect(14, 5, 3, 3); c.fillRect(S-17, 5, 3, 3); c.fillRect(S-13, 6, 3, 3);
      c.fillStyle = '#ff80ff'; c.fillRect(11, 7, 1, 1); c.fillRect(15, 6, 1, 1); c.fillRect(S-16, 6, 1, 1); c.fillRect(S-12, 7, 1, 1);
      // Mandibles
      c.fillStyle = '#2a0050'; c.fillRect(8, 10, 3, 2); c.fillRect(S-11, 10, 3, 2);
      break;
    }
    case 'void_wraith': {
      // Spectral void entity — wispy dark form, glowing hollow eyes, tendrils
      let drift = Math.sin(tick * 0.07) * 3;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(8, S-3, S-16, 3);
      // Tendrils trailing below
      c.fillStyle = 'rgba(40,0,80,0.6)';
      c.fillRect(10, S-8, 3, 5+drift); c.fillRect(15, S-6, 2, 4); c.fillRect(S-13, S-8, 3, 5-drift); c.fillRect(S-17, S-6, 2, 4);
      // Cloak/body (wispy void)
      c.fillStyle = '#08001a'; c.fillRect(7, 14+drift, S-14, 12);
      c.fillStyle = '#110030'; c.fillRect(8, 11+drift, S-16, 10);
      c.fillStyle = 'rgba(60,0,100,0.5)'; c.fillRect(6, 18+drift, S-12, 6);
      // Arms — reaching outward
      c.fillStyle = '#0e0025'; c.fillRect(2, 14+drift, 7, 4); c.fillRect(S-9, 14+drift, 7, 4);
      // Claw tips
      c.fillStyle = '#2a0060'; c.fillRect(1, 12+drift, 3, 3); c.fillRect(S-4, 12+drift, 3, 3);
      // Head / hood
      c.fillStyle = '#0a001e'; c.fillRect(9, 3+drift, S-18, 10);
      c.fillStyle = '#130030'; c.fillRect(10, 2+drift, S-20, 8);
      // Hollow void eyes — glowing white-purple
      c.fillStyle = '#000005'; c.fillRect(10, 5+drift, 5, 4); c.fillRect(S-15, 5+drift, 5, 4);
      c.fillStyle = '#9900ff'; c.fillRect(11, 6+drift, 3, 2); c.fillRect(S-14, 6+drift, 3, 2);
      c.fillStyle = 'rgba(180,100,255,0.7)'; c.fillRect(12, 6+drift, 1, 1); c.fillRect(S-13, 6+drift, 1, 1);
      break;
    }
    case 'reality_ripper': {
      // Aberrant horror — humanoid with rift tears across its body, double claws
      let tear = Math.sin(tick * 0.09) * 2;
      c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(4, S-4, S-8, 4);
      // Feet
      c.fillStyle = '#0a0520'; c.fillRect(7, S-7, 6, 5); c.fillRect(S-13, S-7, 6, 5);
      // Legs
      c.fillStyle = '#120a30'; c.fillRect(8, S-14, 5, 8); c.fillRect(S-13, S-14, 5, 8);
      // Body — dark with void rifts slashed through it
      c.fillStyle = '#0e0825'; c.fillRect(6, 13, S-12, 10);
      c.fillStyle = '#18103a'; c.fillRect(7, 11, S-14, 9);
      // Void rift tears on body (glowing gaps)
      c.fillStyle = `rgba(140,0,255,${0.5+tear*0.15})`;
      c.fillRect(9, 14, 5, 2); c.fillRect(S-14, 16, 5, 2); c.fillRect(11, 19, 10, 1);
      // Arms — double-jointed elongated
      c.fillStyle = '#0e0825'; c.fillRect(1, 12, 7, 4); c.fillRect(S-8, 12, 7, 4);
      // Double claws
      c.fillStyle = '#2a1060'; c.fillRect(0, 10, 3, 3); c.fillRect(0, 14, 3, 3); c.fillRect(S-3, 10, 3, 3); c.fillRect(S-3, 14, 3, 3);
      // Head — elongated, wrong proportions
      c.fillStyle = '#0a0420'; c.fillRect(8, 2, S-16, 12);
      c.fillStyle = '#130830'; c.fillRect(9, 1, S-18, 10);
      // Eyes — two pairs, misaligned
      c.fillStyle = '#cc00ee'; c.fillRect(10, 4, 3, 3); c.fillRect(14, 7, 3, 2);
      c.fillRect(S-13, 4, 3, 3); c.fillRect(S-17, 7, 3, 2);
      c.fillStyle = '#ff40ff'; c.fillRect(11, 5, 1, 1); c.fillRect(15, 7, 1, 1); c.fillRect(S-12, 5, 1, 1); c.fillRect(S-16, 7, 1, 1);
      break;
    }
    case 'elder_thing': {
      // Ancient eldritch entity — massive tentacle crown, blank eyes, roiling mass
      let writhe = Math.sin(tick * 0.05) * 2;
      c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(2, S-3, S-4, 4);
      // Tentacle mass base
      c.fillStyle = '#0a0318'; c.fillRect(5, 20, S-10, 10);
      c.fillStyle = '#100525'; c.fillRect(3, 16, S-6, 8);
      // Writhing tentacle tips
      c.fillStyle = '#150835';
      c.fillRect(2, 12+writhe, 4, 6); c.fillRect(S-6, 12-writhe, 4, 6);
      c.fillRect(4, 8+writhe, 3, 6); c.fillRect(S-7, 8-writhe, 3, 6);
      // Tentacle suckers
      c.fillStyle = 'rgba(80,0,120,0.4)';
      c.fillRect(3, 14+writhe, 2, 2); c.fillRect(S-5, 14-writhe, 2, 2);
      // Central body mass
      c.fillStyle = '#08021a'; c.fillRect(7, 8, S-14, 14);
      c.fillStyle = '#12053a'; c.fillRect(8, 6, S-16, 12);
      // Beak/mouth cavity
      c.fillStyle = '#000010'; c.fillRect(11, 16, S-22, 4);
      c.fillStyle = 'rgba(80,0,120,0.6)'; c.fillRect(12, 17, S-24, 2);
      // Crown of tentacles
      c.fillStyle = '#0e0430';
      c.fillRect(6, 2+writhe, 3, 7); c.fillRect(10, -1+writhe, 3, 8); c.fillRect(14, 1+writhe, 3, 7);
      c.fillRect(S-9, 2-writhe, 3, 7); c.fillRect(S-13, -1-writhe, 3, 8); c.fillRect(S-17, 1-writhe, 3, 7);
      // Eyes (blank, staring, three of them)
      c.fillStyle = '#220066'; c.fillRect(9, 9, 4, 4); c.fillRect(S/2-2, 8, 4, 4); c.fillRect(S-13, 9, 4, 4);
      c.fillStyle = '#8800cc'; c.fillRect(10, 10, 2, 2); c.fillRect(S/2-1, 9, 2, 2); c.fillRect(S-12, 10, 2, 2);
      c.fillStyle = 'rgba(180,100,255,0.5)'; c.fillRect(10, 10, 1, 1); c.fillRect(S/2-1, 9, 1, 1); c.fillRect(S-12, 10, 1, 1);
      break;
    }
    case 'the_unnamed_one': {
      // The Unnamed One (BOSS) — colossal void entity, reality-warping presence
      let warp = Math.sin(tick * 0.04) * 3;
      let glow = Math.sin(tick * 0.06) * 0.3 + 0.7;
      c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(1, S-3, S-2, 4);
      // Mass of void tendrils (background)
      c.fillStyle = '#05010f';
      c.fillRect(0, 10+warp, 5, 18); c.fillRect(S-5, 10-warp, 5, 18);
      c.fillRect(1, 6+warp, 4, 6); c.fillRect(S-5, 6-warp, 4, 6);
      // Void tentacle tips — purple tinge
      c.fillStyle = `rgba(60,0,100,${glow*0.4})`;
      c.fillRect(0, 8+warp, 3, 4); c.fillRect(S-3, 8-warp, 3, 4);
      c.fillRect(1, 4+warp, 2, 4); c.fillRect(S-3, 4-warp, 2, 4);
      // Core body — the Unnamed One's mass
      c.fillStyle = '#04000c'; c.fillRect(5, 12, S-10, 16);
      c.fillStyle = '#08011a'; c.fillRect(6, 9, S-12, 15);
      c.fillStyle = '#0c0228'; c.fillRect(7, 7, S-14, 14);
      // Void fractures across body
      c.fillStyle = `rgba(120,0,220,${glow*0.3})`;
      c.fillRect(8, 12, S-16, 1); c.fillRect(9, 16, S-18, 1); c.fillRect(7, 20, S-14, 1);
      // Crown — reality tears above the form
      c.fillStyle = '#060014';
      c.fillRect(8, 2+warp, 4, 7); c.fillRect(13, -1+warp, 3, 8); c.fillRect(S/2-2, 0+warp, 4, 7);
      c.fillRect(S-12, 2-warp, 4, 7); c.fillRect(S-16, -1-warp, 3, 8);
      // Crown glow
      c.fillStyle = `rgba(160,0,255,${glow*0.5})`;
      c.fillRect(9, 2+warp, 2, 5); c.fillRect(S-11, 2-warp, 2, 5);
      // Face — four void eye voids
      c.fillStyle = '#000008'; c.fillRect(8, 8, 5, 5); c.fillRect(S-13, 8, 5, 5);
      c.fillStyle = '#000008'; c.fillRect(10, 14, 4, 4); c.fillRect(S-14, 14, 4, 4);
      // Eye glow
      c.fillStyle = `rgba(180,0,255,${glow})`;
      c.fillRect(9, 9, 3, 3); c.fillRect(S-12, 9, 3, 3);
      c.fillRect(11, 15, 2, 2); c.fillRect(S-13, 15, 2, 2);
      c.fillStyle = `rgba(255,200,255,${glow*0.8})`;
      c.fillRect(10, 10, 1, 1); c.fillRect(S-11, 10, 1, 1); c.fillRect(11, 15, 1, 1); c.fillRect(S-12, 15, 1, 1);
      // Boss: void halo ring
      c.fillStyle = `rgba(100,0,180,${glow*0.25})`;
      c.fillRect(0, 5, S, 2); c.fillRect(0, S-7, S, 2);
      break;
    }
    case 'old_diver': {
      // Weathered explorer — worn leather gear, diving goggles pushed up, coil of rope
      let bob = Math.sin(tick * 0.07) * 1;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(7, S-4, S-14, 3);
      // Legs — dark waterproof trousers
      c.fillStyle = '#1a2a3a'; c.fillRect(9, 22, 5, 7); c.fillRect(S-14, 22, 5, 7);
      // Boots — heavy rubber
      c.fillStyle = '#0e1a22'; c.fillRect(8, S-7, 6, 5); c.fillRect(S-14, S-7, 6, 5);
      // Body — worn leather vest
      c.fillStyle = '#5a3a18'; c.fillRect(7, 13, S-14, 11);
      // Vest buckle straps
      c.fillStyle = '#7a5a28'; c.fillRect(7, 13, S-14, 1); c.fillRect(12, 13, 2, 11); c.fillRect(S-14, 13, 1, 11);
      // Weathered belt
      c.fillStyle = '#3a2510'; c.fillRect(7, 22, S-14, 2);
      c.fillStyle = '#b08020'; c.fillRect(14, 22, 4, 2); // belt buckle
      // Arms — tanned, leathery skin
      c.fillStyle = '#b07848'; c.fillRect(4, 14, 5, 10); c.fillRect(S-9, 14, 5, 10);
      // Rope coil (left hand)
      c.fillStyle = '#8a6030'; c.fillRect(1, 18, 4, 6);
      c.fillStyle = '#7a5020'; c.fillRect(2, 19, 2, 1); c.fillRect(2, 21, 2, 1); c.fillRect(2, 23, 2, 1);
      // Neck
      c.fillStyle = '#b07848'; c.fillRect(12, 10, 8, 4);
      // Head — weathered, lined face
      c.fillStyle = '#b07848'; c.fillRect(10, 2, S-20, 10);
      // Scraggly grey beard
      c.fillStyle = '#a0a0a0'; c.fillRect(10, 9, S-20, 5);
      c.fillStyle = '#888'; c.fillRect(11, 11, 3, 3); c.fillRect(S-14, 11, 3, 3);
      // Worn cap / hat
      c.fillStyle = '#2a3a2a'; c.fillRect(9, 2, S-18, 4);
      c.fillStyle = '#1a2a1a'; c.fillRect(8, 5, S-16, 2);
      // Diving goggles pushed up on hat (teal lenses)
      c.fillStyle = '#3a5060'; c.fillRect(10, 3, 5, 3); c.fillRect(S-15, 3, 5, 3);
      c.fillStyle = 'rgba(20,120,160,0.7)'; c.fillRect(11, 3, 3, 2); c.fillRect(S-14, 3, 3, 2);
      c.fillStyle = '#5a3010'; c.fillRect(15, 4, 2, 2); // goggles bridge
      // Eyes — deep-set, grey-blue
      c.fillStyle = '#2a2820'; c.fillRect(12, 7, 3, 2); c.fillRect(S-15, 7, 3, 2);
      c.fillStyle = 'rgba(80,140,180,0.85)'; c.fillRect(13, 7, 1, 1); c.fillRect(S-14, 7, 1, 1);
      break;
    }
    // ── The Underworld ─────────────────────────────────────────────────────────
    case 'imp': {
      // Small red-skinned demon with bat wings, horns, and a barbed tail
      let flit = Math.sin(tick * 0.18) * 2;
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(6, S-3, S-12, 3);
      // Bat wings
      c.fillStyle = '#5a0808';
      c.fillRect(1, 14+flit, 6, 6); c.fillRect(2, 12+flit, 4, 3);
      c.fillRect(S-7, 14+flit, 6, 6); c.fillRect(S-6, 12+flit, 4, 3);
      c.fillStyle = '#3a0505';
      c.fillRect(2, 15+flit, 4, 1); c.fillRect(S-6, 15+flit, 4, 1);
      // Body
      c.fillStyle = '#8b1010'; c.fillRect(9, 16, S-18, 10);
      c.fillStyle = '#a02020'; c.fillRect(11, 18, S-22, 6);
      // Arms
      c.fillStyle = '#8b1010'; c.fillRect(5, 17, 5, 7); c.fillRect(S-10, 17, 5, 7);
      c.fillStyle = '#3a0000'; c.fillRect(4, 23, 2, 2); c.fillRect(6, 24, 2, 1); c.fillRect(S-6, 23, 2, 2); c.fillRect(S-8, 24, 2, 1);
      // Legs
      c.fillStyle = '#6a0a0a'; c.fillRect(10, 26, 4, 5); c.fillRect(S-14, 26, 4, 5);
      c.fillStyle = '#3a0000'; c.fillRect(9, 30, 3, 2); c.fillRect(S-12, 30, 3, 2);
      // Tail
      c.fillStyle = '#6a0a0a'; c.fillRect(13, 26, 2, 3); c.fillRect(12, 28, 2, 2); c.fillRect(11, 29, 2, 2); c.fillRect(10, 30, 2, 3);
      c.fillStyle = '#3a0000'; c.fillRect(9, 32, 2, 2);
      // Head
      c.fillStyle = '#8b1010'; c.fillRect(10, 8, S-20, 9);
      c.fillStyle = '#3a0000'; c.fillRect(11, 4, 2, 6); c.fillRect(10, 5, 2, 2); c.fillRect(S-13, 4, 2, 6); c.fillRect(S-12, 5, 2, 2);
      c.fillStyle = '#ff6600'; c.fillRect(12, 11, 3, 2); c.fillRect(S-15, 11, 3, 2);
      c.fillStyle = '#ffcc00'; c.fillRect(13, 11, 1, 1); c.fillRect(S-14, 11, 1, 1);
      c.fillStyle = '#fff'; c.fillRect(13, 15, 1, 2); c.fillRect(S-14, 15, 1, 2);
      break;
    }
    case 'hell_hound': {
      // Large black dog with burning orange eyes and fire dripping from mouth
      let prowl = Math.sin(tick * 0.08) * 1;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(4, S-3, S-8, 3);
      c.fillStyle = '#1a0505'; c.fillRect(5, 15+prowl, S-10, 12);
      c.fillStyle = '#260808'; c.fillRect(6, 16+prowl, 3, 5); c.fillRect(S-14, 17+prowl, 3, 4); c.fillRect(14, 15+prowl, 4, 2);
      c.fillStyle = '#1a0505'; c.fillRect(7, 26+prowl, 4, 6); c.fillRect(S-11, 26+prowl, 4, 6); c.fillRect(10, 27+prowl, 3, 5); c.fillRect(S-13, 27+prowl, 3, 5);
      c.fillStyle = '#0a0202'; c.fillRect(6, 31+prowl, 6, 2); c.fillRect(S-12, 31+prowl, 6, 2);
      c.fillStyle = '#3a0000'; c.fillRect(6, 32+prowl, 1, 2); c.fillRect(8, 32+prowl, 1, 2); c.fillRect(10, 32+prowl, 1, 2); c.fillRect(S-11, 32+prowl, 1, 2); c.fillRect(S-9, 32+prowl, 1, 2); c.fillRect(S-7, 32+prowl, 1, 2);
      c.fillStyle = '#260808'; c.fillRect(S-8, 13+prowl, 4, 4); c.fillRect(S-5, 11+prowl, 3, 4); c.fillRect(S-4, 9+prowl, 2, 3);
      // Head
      c.fillStyle = '#1a0505'; c.fillRect(2, 11+prowl, 14, 10);
      c.fillStyle = '#260808'; c.fillRect(1, 16+prowl, 8, 6);
      c.fillStyle = '#ff4400'; c.fillRect(4, 13+prowl, 4, 3); c.fillRect(10, 13+prowl, 4, 3);
      c.fillStyle = '#ffaa00'; c.fillRect(5, 13+prowl, 2, 2); c.fillRect(11, 13+prowl, 2, 2);
      c.fillStyle = '#fff'; c.fillRect(3, 20+prowl, 2, 3); c.fillRect(6, 20+prowl, 2, 3); c.fillRect(S-9, 20+prowl, 2, 3);
      let ffk = Math.sin(tick * 0.2) * 2;
      c.fillStyle = `rgba(255,80,0,${0.7 + ffk * 0.05})`; c.fillRect(1, 20+prowl, 4, 2+ffk);
      c.fillStyle = 'rgba(255,180,0,0.6)'; c.fillRect(2, 21+prowl, 2, 1+ffk);
      c.fillStyle = '#0a0202'; c.fillRect(6, 8+prowl, 4, 4); c.fillRect(11, 8+prowl, 4, 4);
      break;
    }
    case 'demon_soldier': {
      // Armoured demon warrior with horned helm and hellfire sword
      let bob = Math.sin(tick * 0.06) * 1;
      let rg = Math.sin(tick * 0.08) * 0.3 + 0.7;
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(5, S-3, S-10, 3);
      c.fillStyle = '#2a0808'; c.fillRect(9, 24+bob, 5, 7); c.fillRect(S-14, 24+bob, 5, 7);
      c.fillStyle = '#1a0404'; c.fillRect(9, 25+bob, 5, 1); c.fillRect(S-14, 25+bob, 5, 1);
      c.fillStyle = '#150303'; c.fillRect(8, 30+bob, 7, 3); c.fillRect(S-15, 30+bob, 7, 3);
      c.fillStyle = '#3a0a0a'; c.fillRect(7, 14+bob, S-14, 11);
      c.fillStyle = '#4a1010'; c.fillRect(10, 15+bob, S-20, 4);
      c.fillStyle = '#2a0606'; c.fillRect(S/2-1, 14+bob, 2, 11);
      c.fillStyle = '#2a0808'; c.fillRect(4, 13+bob, 7, 5); c.fillRect(S-11, 13+bob, 7, 5);
      c.fillStyle = `rgba(200,30,0,${0.8*rg})`; c.fillRect(12, 17+bob, 8, 4);
      c.fillStyle = `rgba(255,100,0,${0.6*rg})`; c.fillRect(14, 18+bob, 4, 2);
      c.fillStyle = '#3a0a0a'; c.fillRect(3, 14+bob, 5, 10); c.fillRect(S-8, 14+bob, 5, 10);
      c.fillStyle = '#1a0404'; c.fillRect(2, 22+bob, 6, 4); c.fillRect(S-8, 22+bob, 6, 4);
      // Sword
      c.fillStyle = '#5a5a5a'; c.fillRect(S-6, 10+bob, 2, 16);
      c.fillStyle = '#3a3a3a'; c.fillRect(S-8, 18+bob, 6, 2);
      c.fillStyle = `rgba(255,80,0,${0.8*rg})`; c.fillRect(S-6, 8+bob, 2, 10);
      c.fillStyle = `rgba(255,200,0,${0.5*rg})`; c.fillRect(S-5, 8+bob, 1, 6);
      // Shield
      c.fillStyle = '#2a0606'; c.fillRect(1, 14+bob, 6, 10);
      c.fillStyle = '#4a1010'; c.fillRect(2, 15+bob, 4, 8);
      c.fillStyle = '#6a1a1a'; c.fillRect(3, 18+bob, 2, 3);
      // Helm
      c.fillStyle = '#2a0808'; c.fillRect(9, 7+bob, S-18, 8);
      c.fillStyle = '#1a0404'; c.fillRect(10, 2+bob, 3, 7); c.fillRect(9, 4+bob, 2, 3); c.fillRect(S-13, 2+bob, 3, 7); c.fillRect(S-11, 4+bob, 2, 3);
      c.fillStyle = '#0a0202'; c.fillRect(11, 11+bob, S-22, 2);
      c.fillStyle = `rgba(255,50,0,${rg})`; c.fillRect(12, 11+bob, 4, 2); c.fillRect(S-16, 11+bob, 4, 2);
      break;
    }
    case 'tormented_soul': {
      // Ghostly tortured spirit — translucent blue-grey, chains, screaming face
      let wail = Math.sin(tick * 0.1) * 3;
      let fk = Math.sin(tick * 0.15) * 0.2 + 0.8;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(8, S-3, S-16, 3);
      c.fillStyle = `rgba(50,40,80,${0.4*fk})`; c.fillRect(10, 28+wail, S-20, 5);
      c.fillStyle = `rgba(40,30,70,${0.25*fk})`; c.fillRect(12, 32+wail, S-24, 4);
      c.fillStyle = `rgba(80,70,120,${0.85*fk})`; c.fillRect(8, 14+wail, S-16, 16);
      c.fillStyle = `rgba(70,60,110,${0.7*fk})`; c.fillRect(3, 15+wail, 6, 10); c.fillRect(S-9, 15+wail, 6, 10);
      c.fillStyle = `rgba(100,80,60,${0.9*fk})`;
      c.fillRect(4, 17+wail, 2, 2); c.fillRect(3, 19+wail, 2, 2); c.fillRect(4, 21+wail, 2, 2);
      c.fillRect(S-6, 17+wail, 2, 2); c.fillRect(S-5, 19+wail, 2, 2); c.fillRect(S-6, 21+wail, 2, 2);
      c.fillRect(10, 26+wail, 2, 3); c.fillRect(S-12, 26+wail, 2, 3);
      c.fillStyle = `rgba(80,70,120,${0.85*fk})`; c.fillRect(12, 10+wail, 8, 5);
      c.fillStyle = `rgba(90,80,130,${0.9*fk})`; c.fillRect(9, 2+wail, S-18, 12);
      c.fillStyle = `rgba(20,10,40,0.95)`; c.fillRect(11, 6+wail, 5, 4); c.fillRect(S-16, 6+wail, 5, 4);
      c.fillStyle = `rgba(140,100,200,${fk})`; c.fillRect(12, 7+wail, 3, 2); c.fillRect(S-15, 7+wail, 3, 2);
      c.fillStyle = `rgba(10,0,20,0.95)`; c.fillRect(11, 11+wail, S-22, 3);
      c.fillStyle = `rgba(100,60,160,${0.5*fk})`; c.fillRect(12, 11+wail, S-24, 1);
      break;
    }
    case 'pit_fiend': {
      // Massive demon overlord — hulking red-black plate, giant wings, twin fire axes
      let huff = Math.sin(tick * 0.05) * 1;
      let inf = Math.sin(tick * 0.09) * 0.25 + 0.75;
      c.fillStyle = 'rgba(80,0,0,0.5)'; c.fillRect(2, S-3, S-4, 3);
      // Wings
      c.fillStyle = '#3a0505'; c.fillRect(-2, 6+huff, 10, 18); c.fillRect(S-8, 6+huff, 10, 18); c.fillRect(-1, 4+huff, 8, 5); c.fillRect(S-7, 4+huff, 8, 5);
      c.fillStyle = '#260303'; c.fillRect(0, 9+huff, 6, 2); c.fillRect(0, 13+huff, 6, 2); c.fillRect(0, 17+huff, 6, 2); c.fillRect(S-6, 9+huff, 6, 2); c.fillRect(S-6, 13+huff, 6, 2); c.fillRect(S-6, 17+huff, 6, 2);
      // Legs & hooves
      c.fillStyle = '#3a0808'; c.fillRect(8, 26+huff, 7, 7); c.fillRect(S-15, 26+huff, 7, 7);
      c.fillStyle = '#1a0202'; c.fillRect(7, 32+huff, 9, 3); c.fillRect(S-16, 32+huff, 9, 3);
      // Tail
      c.fillStyle = '#3a0808'; c.fillRect(S-9, 22+huff, 4, 5); c.fillRect(S-6, 26+huff, 3, 4); c.fillRect(S-5, 29+huff, 3, 4);
      c.fillStyle = '#1a0202'; c.fillRect(S-4, 32+huff, 3, 3);
      // Body & runes
      c.fillStyle = '#4a0a0a'; c.fillRect(5, 13+huff, S-10, 14);
      c.fillStyle = `rgba(220,40,0,${0.8*inf})`; c.fillRect(9, 16+huff, S-18, 8);
      c.fillStyle = `rgba(255,120,0,${0.6*inf})`; c.fillRect(11, 18+huff, S-22, 4);
      c.fillStyle = `rgba(255,200,50,${0.5*inf})`; c.fillRect(S/2-3, 18+huff, 6, 4);
      c.fillStyle = '#2a0505'; c.fillRect(2, 12+huff, 8, 5); c.fillRect(S-10, 12+huff, 8, 5);
      c.fillStyle = '#4a0a0a'; c.fillRect(2, 17+huff, 6, 10); c.fillRect(S-8, 17+huff, 6, 10);
      // Left axe
      c.fillStyle = '#5a5a5a'; c.fillRect(0, 12+huff, 3, 16);
      c.fillStyle = '#3a0000'; c.fillRect(-2, 11+huff, 6, 6);
      c.fillStyle = `rgba(255,60,0,${inf})`; c.fillRect(-1, 10+huff, 5, 8);
      c.fillStyle = `rgba(255,200,0,${0.6*inf})`; c.fillRect(0, 10+huff, 3, 5);
      // Right axe
      c.fillStyle = '#5a5a5a'; c.fillRect(S-3, 12+huff, 3, 16);
      c.fillStyle = '#3a0000'; c.fillRect(S-4, 11+huff, 6, 6);
      c.fillStyle = `rgba(255,60,0,${inf})`; c.fillRect(S-4, 10+huff, 5, 8);
      c.fillStyle = `rgba(255,200,0,${0.6*inf})`; c.fillRect(S-3, 10+huff, 3, 5);
      // Head & horns
      c.fillStyle = '#3a0808'; c.fillRect(8, 5+huff, S-16, 10);
      c.fillStyle = '#1a0303'; c.fillRect(9, 0+huff, 4, 7); c.fillRect(8, 2+huff, 3, 3); c.fillRect(S/2-2, -1+huff, 4, 8); c.fillRect(S/2-3, 1+huff, 2, 3); c.fillRect(S-13, 0+huff, 4, 7); c.fillRect(S-11, 2+huff, 3, 3);
      c.fillStyle = '#0a0000'; c.fillRect(10, 10+huff, S-20, 3);
      c.fillStyle = `rgba(255,60,0,${inf})`; c.fillRect(11, 10+huff, 5, 3); c.fillRect(S-16, 10+huff, 5, 3);
      c.fillStyle = `rgba(255,220,0,${0.8*inf})`; c.fillRect(12, 11+huff, 3, 1); c.fillRect(S-15, 11+huff, 3, 1);
      c.fillStyle = '#fff'; c.fillRect(12, 14+huff, 2, 3); c.fillRect(S-14, 14+huff, 2, 3); c.fillRect(14, 14+huff, 2, 2); c.fillRect(S-16, 14+huff, 2, 2);
      break;
    }
    case 'fallen_angel': {
      // Fallen angel NPC — cracked halo, torn grey wings, dark robes, tearful expression
      let bth = Math.sin(tick * 0.04) * 1;
      c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(6, S-3, S-12, 3);
      // Torn wings
      c.fillStyle = '#c0b8b0'; c.fillRect(1, 10+bth, 8, 14); c.fillRect(S-9, 10+bth, 8, 14);
      c.fillStyle = '#3a2a2a'; c.fillRect(2, 14+bth, 3, 2); c.fillRect(S-5, 16+bth, 3, 3); c.fillRect(3, 20+bth, 4, 2); c.fillRect(S-7, 12+bth, 3, 2);
      c.fillStyle = '#a09898'; c.fillRect(2, 12+bth, 6, 1); c.fillRect(2, 16+bth, 6, 1); c.fillRect(2, 20+bth, 6, 1); c.fillRect(S-8, 12+bth, 6, 1); c.fillRect(S-8, 16+bth, 6, 1); c.fillRect(S-8, 20+bth, 6, 1);
      // Dark robes
      c.fillStyle = '#2a2030'; c.fillRect(7, 16+bth, S-14, 16);
      c.fillStyle = '#1a1020'; c.fillRect(8, 20+bth, 4, 10); c.fillRect(S-12, 20+bth, 4, 10);
      c.fillStyle = '#6a5a20'; c.fillRect(7, 16+bth, S-14, 1); c.fillRect(7, 31+bth, S-14, 1);
      c.fillStyle = '#1a1020'; c.fillRect(8, 32+bth, 3, 2); c.fillRect(13, 32+bth, 3, 3); c.fillRect(S-11, 32+bth, 3, 2); c.fillRect(S-16, 32+bth, 3, 3);
      c.fillStyle = '#c0a898'; c.fillRect(4, 17+bth, 5, 9); c.fillRect(S-9, 17+bth, 5, 9);
      c.fillStyle = '#b09888'; c.fillRect(5, 25+bth, 4, 3); c.fillRect(S-9, 25+bth, 4, 3);
      c.fillStyle = '#c0a898'; c.fillRect(12, 11+bth, 8, 6);
      // Head & face
      c.fillStyle = '#d0b8a0'; c.fillRect(9, 3+bth, S-18, 11);
      // Cracked halo
      c.fillStyle = '#6a5a20'; c.fillRect(9, 1+bth, S-18, 2);
      c.fillStyle = '#3a2a10'; c.fillRect(13, 1+bth, 3, 2); c.fillRect(S-16, 1+bth, 3, 2);
      c.fillStyle = 'rgba(180,140,0,0.3)'; c.fillRect(9, 0+bth, S-18, 3);
      // Eyes and tears
      c.fillStyle = '#2a2030'; c.fillRect(11, 7+bth, 4, 3); c.fillRect(S-15, 7+bth, 4, 3);
      c.fillStyle = '#6060a0'; c.fillRect(12, 8+bth, 2, 1); c.fillRect(S-14, 8+bth, 2, 1);
      c.fillStyle = 'rgba(100,120,200,0.7)'; c.fillRect(12, 10+bth, 1, 2); c.fillRect(S-13, 10+bth, 1, 2);
      c.fillStyle = '#8a6858'; c.fillRect(12, 12+bth, 8, 1);
      c.fillStyle = '#4a3a30'; c.fillRect(13, 13+bth, 6, 1);
      // Silver hair
      c.fillStyle = '#d8d0c8'; c.fillRect(9, 3+bth, S-18, 3);
      c.fillStyle = '#c0b8b0'; c.fillRect(8, 4+bth, 3, 6); c.fillRect(S-11, 4+bth, 3, 6);
      break;
    }
    // ── Sunken Temple ──────────────────────────────────────────────────────────
    case 'drowned_spirit': {
      // Ghostly blue-white humanoid, ethereal, translucent, drifting
      let drift = Math.sin(tick * 0.07) * 2;
      let fk = Math.sin(tick * 0.09) * 0.15 + 0.85;
      c.fillStyle = 'rgba(0,80,140,0.2)'; c.fillRect(9, S-3, S-18, 3);
      // Wispy tail — fades out at bottom
      c.fillStyle = `rgba(140,200,240,${0.2*fk})`; c.fillRect(12, 26+drift, S-24, 5);
      c.fillStyle = `rgba(160,220,255,${0.3*fk})`; c.fillRect(10, 22+drift, S-20, 6);
      // Body — translucent blue-white
      c.fillStyle = `rgba(180,230,255,${0.7*fk})`; c.fillRect(9, 13+drift, S-18, 11);
      // Wispy arms
      c.fillStyle = `rgba(160,210,240,${0.5*fk})`; c.fillRect(4, 14+drift, 6, 8); c.fillRect(S-10, 14+drift, 6, 8);
      c.fillStyle = `rgba(180,230,255,${0.25*fk})`; c.fillRect(2, 15+drift, 4, 6); c.fillRect(S-6, 15+drift, 4, 6);
      // Neck
      c.fillStyle = `rgba(190,235,255,${0.8*fk})`; c.fillRect(12, 10+drift, 8, 5);
      // Head
      c.fillStyle = `rgba(200,240,255,${0.9*fk})`; c.fillRect(9, 2+drift, S-18, 12);
      // Dark hollow eye sockets
      c.fillStyle = 'rgba(0,10,30,0.95)'; c.fillRect(11, 6+drift, 5, 4); c.fillRect(S-16, 6+drift, 5, 4);
      // Blue ghost glow in eyes
      c.fillStyle = `rgba(100,200,255,${fk})`; c.fillRect(12, 7+drift, 3, 2); c.fillRect(S-15, 7+drift, 3, 2);
      // Open screaming mouth
      c.fillStyle = 'rgba(0,20,60,0.85)'; c.fillRect(12, 11+drift, S-24, 2);
      break;
    }
    case 'water_elemental': {
      // Swirling water vortex figure, deep blue tones, foam highlights
      let swirl = Math.sin(tick * 0.1) * 2;
      let wv = Math.sin(tick * 0.08) * 0.2 + 0.8;
      c.fillStyle = 'rgba(0,60,120,0.35)'; c.fillRect(5, S-3, S-10, 3);
      // Lower vortex base
      c.fillStyle = '#0a3a6a'; c.fillRect(8, 24+swirl, S-16, 6);
      c.fillStyle = '#0a4a8a'; c.fillRect(7, 20, S-14, 8);
      c.fillStyle = '#1a5a9a'; c.fillRect(6, 16, S-12, 8);
      // Body
      c.fillStyle = '#1a6aaa'; c.fillRect(8, 10, S-16, 12);
      c.fillStyle = '#2a7aba'; c.fillRect(10, 8, S-20, 8);
      // Swirling tendril arms
      c.fillStyle = '#1a5a9a'; c.fillRect(3, 12+swirl, 6, 10); c.fillRect(S-9, 12-swirl, 6, 10);
      c.fillStyle = '#2a7aba'; c.fillRect(2, 14+swirl, 4, 6); c.fillRect(S-6, 14-swirl, 4, 6);
      // Foam tips on arms
      c.fillStyle = `rgba(200,240,255,${0.6*wv})`; c.fillRect(3, 12+swirl, 4, 2); c.fillRect(S-7, 12-swirl, 4, 2);
      // Head/crest
      c.fillStyle = '#2a8aca'; c.fillRect(8, 2, S-16, 12);
      c.fillStyle = '#3a9ada'; c.fillRect(10, 4, S-20, 6);
      // Deep water eyes
      c.fillStyle = '#051520'; c.fillRect(11, 6, 5, 4); c.fillRect(S-16, 6, 5, 4);
      c.fillStyle = `rgba(220,245,255,${wv})`; c.fillRect(12, 7, 3, 2); c.fillRect(S-15, 7, 3, 2);
      // Foam spray crest
      c.fillStyle = `rgba(220,240,255,${0.5*wv})`; c.fillRect(9, 1, 4, 2); c.fillRect(S-13, 1, 4, 2); c.fillRect(13, 0, 6, 2);
      // Wave line patterns on body
      c.fillStyle = 'rgba(80,160,220,0.4)'; c.fillRect(10, 14, S-20, 2); c.fillRect(11, 18, S-22, 2);
      break;
    }
    case 'temple_guardian': {
      // Ancient stone armored warrior, moss-covered, glowing visor
      let bob = Math.sin(tick * 0.05) * 1;
      c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(4, S-4, S-8, 4);
      // Stone boots
      c.fillStyle = '#3a3a30'; c.fillRect(7, S-8, 7, 6); c.fillRect(S-14, S-8, 7, 6);
      // Stone greaves
      c.fillStyle = '#4a4a3a'; c.fillRect(8, S-15, 6, 8); c.fillRect(S-14, S-15, 6, 8);
      // Moss on greaves
      c.fillStyle = '#3a5a2a'; c.fillRect(9, S-14, 3, 3); c.fillRect(S-12, S-13, 2, 2);
      // Tassets
      c.fillStyle = '#404038'; c.fillRect(6, S-17, 7, 4); c.fillRect(S-13, S-17, 7, 4);
      // Broad stone body armor
      c.fillStyle = '#3a3a30'; c.fillRect(5, 13+bob, S-10, 10);
      c.fillStyle = '#505048'; c.fillRect(7, 12+bob, S-14, 9);
      // Ancient carved rune on chest
      c.fillStyle = '#2a2a20'; c.fillRect(S/2-1, 14+bob, 2, 6); c.fillRect(11, 17+bob, 10, 2);
      // Moss patches on chest
      c.fillStyle = '#3a5a2a'; c.fillRect(8, 15+bob, 3, 2); c.fillRect(S-11, 20+bob, 2, 2);
      // Large stone pauldrons
      c.fillStyle = '#3a3a30'; c.fillRect(2, 11+bob, 8, 7); c.fillRect(S-10, 11+bob, 8, 7);
      c.fillStyle = '#505048'; c.fillRect(3, 12+bob, 6, 5); c.fillRect(S-9, 12+bob, 6, 5);
      // Stone gauntlets
      c.fillStyle = '#3a3a30'; c.fillRect(1, 19+bob, 6, 7); c.fillRect(S-7, 19+bob, 6, 7);
      c.fillStyle = '#4a4a38'; c.fillRect(2, 20+bob, 4, 5); c.fillRect(S-6, 20+bob, 4, 5);
      // Neck
      c.fillStyle = '#404038'; c.fillRect(11, 10+bob, 10, 4);
      // Angular ancient helmet
      c.fillStyle = '#353528'; c.fillRect(7, 2+bob, S-14, 12);
      c.fillStyle = '#454538'; c.fillRect(8, 3+bob, S-16, 10);
      // Helmet fin crest
      c.fillStyle = '#2a2a20'; c.fillRect(13, 0+bob, 6, 3);
      c.fillStyle = '#3a3a2a'; c.fillRect(14, -1+bob, 4, 3);
      // Visor — narrow slit
      c.fillStyle = '#101008'; c.fillRect(9, 8+bob, S-18, 3);
      // Ancient green glow from visor
      c.fillStyle = 'rgba(60,140,60,0.7)'; c.fillRect(10, 9+bob, S-20, 1);
      // Moss on helmet
      c.fillStyle = '#3a5a2a'; c.fillRect(8, 3+bob, 3, 2); c.fillRect(S-11, 5+bob, 2, 2);
      // Stone mace (right side)
      c.fillStyle = '#555545'; c.fillRect(S-6, 12+bob, 3, 14);
      c.fillStyle = '#353525'; c.fillRect(S-9, 17+bob, 9, 6);
      c.fillStyle = '#404030'; c.fillRect(S-8, 18+bob, 7, 4);
      break;
    }
    case 'siren': {
      // Beautiful but eerie — teal/green skin, flowing hair, glowing eyes
      let sway = Math.sin(tick * 0.07) * 1.5;
      c.fillStyle = 'rgba(0,60,80,0.3)'; c.fillRect(7, S-3, S-14, 3);
      // Flowing teal-green hair — falls wide to sides
      c.fillStyle = '#0a5a4a'; c.fillRect(5, 6+sway, 5, 20); c.fillRect(S-10, 6+sway, 5, 20);
      c.fillStyle = '#0a6a5a'; c.fillRect(4, 8+sway, 4, 16); c.fillRect(S-8, 8+sway, 4, 16);
      c.fillStyle = '#0a7a6a'; c.fillRect(5, 10+sway, 3, 12); c.fillRect(S-8, 10+sway, 3, 12);
      // Flowing dress/tail
      c.fillStyle = '#0a4a5a'; c.fillRect(7, 22+sway, S-14, 10);
      c.fillStyle = '#0a5a6a'; c.fillRect(9, 20+sway, S-18, 10);
      c.fillStyle = '#0a6a7a'; c.fillRect(11, 19+sway, S-22, 6);
      // Body
      c.fillStyle = '#2a8a6a'; c.fillRect(9, 14+sway, S-18, 10);
      c.fillStyle = '#3a9a7a'; c.fillRect(11, 15+sway, S-22, 7);
      // Slender arms — teal-green skin
      c.fillStyle = '#2a8060'; c.fillRect(5, 14+sway, 5, 10); c.fillRect(S-10, 14+sway, 5, 10);
      c.fillStyle = '#1a6a50'; c.fillRect(4, 20+sway, 4, 5); c.fillRect(S-8, 20+sway, 4, 5);
      // Neck
      c.fillStyle = '#2a9070'; c.fillRect(12, 11+sway, 8, 5);
      // Head
      c.fillStyle = '#2a9070'; c.fillRect(9, 3+sway, S-18, 11);
      c.fillStyle = '#3aaa80'; c.fillRect(10, 4+sway, S-20, 9);
      // Hair on head top
      c.fillStyle = '#0a5a4a'; c.fillRect(9, 3+sway, S-18, 4);
      c.fillStyle = '#0a6a5a'; c.fillRect(8, 4+sway, 3, 8); c.fillRect(S-11, 4+sway, 3, 8);
      // Eerie pale glowing eyes
      c.fillStyle = '#d0f0e0'; c.fillRect(11, 8+sway, 4, 3); c.fillRect(S-15, 8+sway, 4, 3);
      c.fillStyle = '#00c8b0'; c.fillRect(12, 8+sway, 2, 2); c.fillRect(S-14, 8+sway, 2, 2);
      // Dark lips
      c.fillStyle = '#1a6050'; c.fillRect(12, 12+sway, S-24, 2);
      break;
    }
    case 'drowned_king': {
      // Armored skeleton king with crown, dripping wet, trident
      let bob = Math.sin(tick * 0.06) * 1.5;
      let drip = Math.sin(tick * 0.12) * 0.3 + 0.7;
      c.fillStyle = 'rgba(0,40,80,0.4)'; c.fillRect(4, S-4, S-8, 4);
      // Water drips off armor
      c.fillStyle = `rgba(20,80,140,${0.6*drip})`; c.fillRect(10, 22+bob, 2, 5); c.fillRect(S-12, 24+bob, 2, 4); c.fillRect(14, 20+bob, 2, 6);
      // Foot bones
      c.fillStyle = '#2a3a4a'; c.fillRect(8, S-7, 6, 5); c.fillRect(S-14, S-7, 6, 5);
      // Armored legs — dark wet metal
      c.fillStyle = '#1a2a3a'; c.fillRect(9, 18+bob, 5, 8); c.fillRect(S-14, 18+bob, 5, 8);
      c.fillStyle = '#2a3a4a'; c.fillRect(10, 19+bob, 3, 7); c.fillRect(S-13, 19+bob, 3, 7);
      // Pelvis armor
      c.fillStyle = '#1a2a3a'; c.fillRect(7, 17+bob, S-14, 3);
      c.fillStyle = '#2a3a4a'; c.fillRect(8, 17+bob, S-16, 2);
      // Spine visible through armor gaps
      c.fillStyle = '#8a9aa8'; c.fillRect(S/2-1, 8+bob, 3, 10);
      // Ribcage through dark corroded armor
      c.fillStyle = '#1a2a3a'; c.fillRect(6, 10+bob, S-12, 8);
      c.fillStyle = '#2a3a4a'; c.fillRect(7, 11+bob, S-14, 6);
      // Exposed rib bones
      c.fillStyle = '#7a8a98'; c.fillRect(9, 12+bob, 2, 4); c.fillRect(12, 11+bob, 2, 5); c.fillRect(15, 12+bob, 2, 4);
      c.fillStyle = '#7a8a98'; c.fillRect(S-11, 12+bob, 2, 4); c.fillRect(S-14, 11+bob, 2, 5); c.fillRect(S-17, 12+bob, 2, 4);
      // Dark seaweed scraps clinging to armor
      c.fillStyle = '#0a2010'; c.fillRect(5, 12+bob, 3, 10); c.fillRect(S-8, 14+bob, 3, 8);
      // Corroded pauldrons
      c.fillStyle = '#1a2a3a'; c.fillRect(3, 10+bob, 7, 5); c.fillRect(S-10, 10+bob, 7, 5);
      c.fillStyle = '#0a1a2a'; c.fillRect(2, 11+bob, 5, 4); c.fillRect(S-7, 11+bob, 5, 4);
      // Gauntlet arms — bone visible
      c.fillStyle = '#8a9aa8'; c.fillRect(2, 15+bob, 4, 8); c.fillRect(S-6, 15+bob, 4, 8);
      c.fillStyle = '#1a2a3a'; c.fillRect(1, 16+bob, 4, 6); c.fillRect(S-5, 16+bob, 4, 6);
      // Skull
      c.fillStyle = '#9aa8b8'; c.fillRect(8, 2+bob, S-16, 10);
      c.fillStyle = '#aab8c8'; c.fillRect(9, 3+bob, S-18, 8);
      // Crown — corroded dark gold with teal gems
      c.fillStyle = '#6a5010'; c.fillRect(8, 0+bob, S-16, 3);
      c.fillStyle = '#8a6a10'; c.fillRect(9, -1+bob, 3, 3); c.fillRect(14, -2+bob, 4, 4); c.fillRect(S-12, -1+bob, 3, 3);
      c.fillStyle = '#00a0c0'; c.fillRect(15, -1+bob, 2, 2);
      // Deep dark eye sockets
      c.fillStyle = '#050810'; c.fillRect(10, 4+bob, 5, 4); c.fillRect(S-15, 4+bob, 5, 4);
      // Glowing teal eyes
      c.fillStyle = `rgba(0,160,200,${drip})`; c.fillRect(11, 5+bob, 3, 2); c.fillRect(S-14, 5+bob, 3, 2);
      // Jaw and teeth
      c.fillStyle = '#9aa8b8'; c.fillRect(9, 9+bob, S-18, 3);
      c.fillStyle = '#aab8c8'; c.fillRect(11, 10+bob, 2, 2); c.fillRect(14, 10+bob, 2, 2); c.fillRect(S-13, 10+bob, 2, 2); c.fillRect(S-16, 10+bob, 2, 2);
      // Trident (left side) — dark teal metal
      c.fillStyle = '#2a6080'; c.fillRect(4, 5+bob, 2, 20);
      c.fillStyle = '#1a4060'; c.fillRect(2, 3+bob, 2, 5); c.fillRect(5, 2+bob, 2, 5); c.fillRect(8, 3+bob, 2, 5);
      c.fillStyle = '#3a8aaa'; c.fillRect(3, 2+bob, 1, 3); c.fillRect(6, 1+bob, 1, 3); c.fillRect(9, 2+bob, 1, 3);
      break;
    }
    default:
      return false;
  }
  return true;
}
