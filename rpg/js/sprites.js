// sprites.js — Pixel-art sprite rendering for player classes and enemy sprites.
// Covers: player (all 5 classes), slime, rat, skeleton, bat, knight, dragon, wild_boar,
//         and combat canvas rendering with flash overlay compositing.
// Town NPCs, Elven Town NPCs, and Training Grounds creatures are in sprites_npc.js.
// Depends on: constants.js (TILE), state.js (tick, enemyFlashTimer, playerFlashTimer),
//             sprites_npc.js (drawNpcSprite).

function drawPixelSprite(c, sx, sy, key, frame) {
  // frame = animation frame (0 or 1)
  const f = frame || 0;
  const S = 32; // sprite pixel-art grid always 32px internally
  c.save();
  c.translate(sx, sy);
  c.scale(TILE / 32, TILE / 32); // scale up to current tile size

  switch (key) {
    case 'player': {
      let bob = Math.sin(tick * 0.1) * 1;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(6, S-6, S-12, 3);
      // Boots
      c.fillStyle = '#4a3020';
      c.fillRect(8, S-9, 5, 5); c.fillRect(S-13, S-9, 5, 5);
      // Legs
      c.fillStyle = '#3060a0';
      c.fillRect(9, S-14, 5, 5); c.fillRect(S-14, S-14, 5, 5);
      // Body / armor
      c.fillStyle = '#7090d0';
      c.fillRect(7, 14, S-14, 8);
      // Pauldrons
      c.fillStyle = '#8aacf0';
      c.fillRect(5, 14, 5, 4); c.fillRect(S-10, 14, 5, 4);
      // Belt
      c.fillStyle = '#5a4010';
      c.fillRect(7, 21, S-14, 2);
      // Neck
      c.fillStyle = '#d0a080';
      c.fillRect(11, 11, 10, 4);
      // Head
      c.fillStyle = '#7090d0';
      c.fillRect(8, 3, S-16, 10);
      // Visor
      c.fillStyle = '#1a2a4a';
      c.fillRect(9, 5, S-18, 5);
      c.fillStyle = 'rgba(100,160,255,0.5)';
      c.fillRect(10, 6, S-20, 3);
      // Helmet top
      c.fillStyle = '#8aacf0';
      c.fillRect(8, 3, S-16, 3);
      // Sword
      c.fillStyle = '#c0c8d8';
      c.fillRect(S-8, 12, 2, 12);
      c.fillStyle = '#d4a020';
      c.fillRect(S-10, 16, 6, 2);
      c.fillStyle = '#a0a8b8';
      c.fillRect(S-8, 8, 2, 5);
      break;
    }
    case 'slime': {
      let squish = 0.1 * Math.sin(tick * 0.08);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.25)';
      c.fillRect(7, S-7, S-14, 3);
      // Body
      c.fillStyle = '#2a8a2a';
      c.fillRect(6, 14+squish*4, S-12, 12-squish*2);
      c.fillRect(8, 12, S-16, 14);
      c.fillStyle = '#3aaa3a';
      c.fillRect(8, 10, S-16, 10);
      c.fillRect(10, 8, S-20, 6);
      // Eyes
      c.fillStyle = '#eee';
      c.fillRect(10, 12, 5, 5); c.fillRect(S-15, 12, 5, 5);
      c.fillStyle = '#111';
      c.fillRect(11, 13, 3, 3); c.fillRect(S-14, 13, 3, 3);
      // Sheen
      c.fillStyle = 'rgba(200,255,200,0.3)';
      c.fillRect(11, 9, 4, 3);
      break;
    }
    case 'rat': {
      let run = f * 3;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.25)';
      c.fillRect(4, S-6, S-8, 3);
      // Tail
      c.fillStyle = '#7a5030';
      c.fillRect(S-6, 16, 4, 2); c.fillRect(S-4, 18, 3, 2); c.fillRect(S-3, 20, 2, 2);
      // Body
      c.fillStyle = '#7a5a30';
      c.fillRect(5, 14, S-12, 10);
      c.fillStyle = '#8a6a3a';
      c.fillRect(6, 12, S-14, 8);
      // Head
      c.fillStyle = '#7a5a30';
      c.fillRect(3, 13, 10, 8);
      c.fillStyle = '#8a6a3a';
      c.fillRect(3, 12, 9, 6);
      // Snout
      c.fillStyle = '#9a7040';
      c.fillRect(1, 15, 5, 4);
      c.fillStyle = '#e06060';
      c.fillRect(2, 16, 2, 2);
      // Eye
      c.fillStyle = '#e04040';
      c.fillRect(6, 13, 3, 3);
      // Ear
      c.fillStyle = '#e06060';
      c.fillRect(8, 10, 3, 4);
      // Feet
      c.fillStyle = '#6a4a20';
      c.fillRect(7, S-9+run, 4, 4); c.fillRect(14, S-10, 4, 4); c.fillRect(S-13, S-9+run, 4, 4);
      break;
    }
    case 'skeleton': {
      let bob = Math.sin(tick * 0.07) * 2;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.2)';
      c.fillRect(6, S-6, S-12, 3);
      // Feet
      c.fillStyle = '#d8d0c0';
      c.fillRect(8, S-8, 5, 5); c.fillRect(S-13, S-8, 5, 5);
      // Leg bones
      c.fillStyle = '#d0c8b8';
      c.fillRect(9+bob*0.5, 18, 4, 8); c.fillRect(S-13-bob*0.5, 18, 4, 8);
      // Pelvis
      c.fillStyle = '#c8c0b0';
      c.fillRect(7, 17, S-14, 4);
      // Spine
      c.fillStyle = '#d8d0c0';
      c.fillRect(S/2-2, 8+bob, 4, 10);
      // Rib cage
      c.fillStyle = '#c0b8a8';
      c.fillRect(6, 10+bob, S-12, 8);
      c.fillStyle = '#1a1828';
      c.fillRect(9, 12+bob, 1, 5); c.fillRect(12, 11+bob, 1, 6); c.fillRect(15, 12+bob, 1, 5);
      c.fillRect(S-10, 12+bob, 1, 5); c.fillRect(S-13, 11+bob, 1, 6); c.fillRect(S-16, 12+bob, 1, 5);
      // Arms
      c.fillStyle = '#d0c8b8';
      c.fillRect(3, 10+bob, 4, 10); c.fillRect(S-7, 10+bob, 4, 10);
      // Skull
      c.fillStyle = '#e8e0d0';
      c.fillRect(8, 2+bob, S-16, 10);
      // Jaw
      c.fillStyle = '#d8d0c0';
      c.fillRect(9, 10+bob, S-18, 3);
      // Eye sockets
      c.fillStyle = '#0a0818';
      c.fillRect(10, 4+bob, 5, 4); c.fillRect(S-15, 4+bob, 5, 4);
      // Red eye glow
      c.fillStyle = 'rgba(200,0,0,0.7)';
      c.fillRect(11, 5+bob, 3, 2); c.fillRect(S-14, 5+bob, 3, 2);
      // Teeth
      c.fillStyle = '#e8e0d0';
      c.fillRect(11, 11+bob, 2, 2); c.fillRect(14, 11+bob, 2, 2); c.fillRect(S-13, 11+bob, 2, 2); c.fillRect(S-16, 11+bob, 2, 2);
      break;
    }
    case 'bat': {
      let wing = Math.sin(tick * 0.2) * 6;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.2)';
      c.fillRect(5, S-6, S-10, 3);
      // Wings
      c.fillStyle = '#4a2860';
      c.fillRect(0, 12-wing, 9, 8+wing/2);
      c.fillRect(S-9, 12-wing, 9, 8+wing/2);
      c.fillStyle = '#3a1a50';
      c.fillRect(1, 14-wing, 7, 5+wing/2);
      c.fillRect(S-8, 14-wing, 7, 5+wing/2);
      // Body
      c.fillStyle = '#3a2048';
      c.fillRect(8, 14, S-16, 10);
      // Head
      c.fillStyle = '#4a2858';
      c.fillRect(10, 9, S-20, 8);
      // Ears
      c.fillStyle = '#5a3068';
      c.fillRect(10, 5, 4, 6); c.fillRect(S-14, 5, 4, 6);
      // Eyes
      c.fillStyle = '#e03030';
      c.fillRect(12, 11, 3, 3); c.fillRect(S-15, 11, 3, 3);
      // Fangs
      c.fillStyle = '#eee';
      c.fillRect(12, 16, 2, 3); c.fillRect(S-14, 16, 2, 3);
      break;
    }
    case 'knight': {
      let bob = Math.sin(tick * 0.06) * 1;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(4, S-5, S-8, 4);
      // Boots
      c.fillStyle = '#0a0a18';
      c.fillRect(7, S-8, 6, 6); c.fillRect(S-13, S-8, 6, 6);
      // Greaves
      c.fillStyle = '#181830';
      c.fillRect(8, S-14, 5, 7); c.fillRect(S-13, S-14, 5, 7);
      // Tassets
      c.fillStyle = '#1a1a38';
      c.fillRect(6, S-16, 6, 4); c.fillRect(S-12, S-16, 6, 4);
      // Torso
      c.fillStyle = '#0f0f28';
      c.fillRect(6, 13+bob, S-12, 9);
      c.fillStyle = '#1a1a3a';
      c.fillRect(7, 12+bob, S-14, 8);
      // Pauldrons
      c.fillStyle = '#0a0a20';
      c.fillRect(3, 12+bob, 6, 6); c.fillRect(S-9, 12+bob, 6, 6);
      // Gauntlets
      c.fillStyle = '#0f0f28';
      c.fillRect(2, 18+bob, 5, 6); c.fillRect(S-7, 18+bob, 5, 6);
      // Purple trim
      c.fillStyle = '#5020a0';
      c.fillRect(7, 12+bob, S-14, 1); c.fillRect(6, 13+bob, 1, 9); c.fillRect(S-7, 13+bob, 1, 9);
      // Head
      c.fillStyle = '#0f0f28';
      c.fillRect(8, 2+bob, S-16, 12);
      c.fillStyle = '#1a1a3a';
      c.fillRect(9, 3+bob, S-18, 10);
      // Dark visor
      c.fillStyle = '#060610';
      c.fillRect(10, 5+bob, S-20, 5);
      // Purple eye slit
      c.fillStyle = 'rgba(120,0,255,0.8)';
      c.fillRect(11, 6+bob, S-22, 2);
      // Sword
      c.fillStyle = '#7070c0';
      c.fillRect(S-6, 8+bob, 3, 16);
      c.fillStyle = '#5050a0';
      c.fillRect(S-9, 15+bob, 9, 2);
      c.fillStyle = 'rgba(120,0,255,0.5)';
      c.fillRect(S-5, 4+bob, 1, 5);
      break;
    }
    case 'dragon': {
      let flame = Math.sin(tick * 0.15);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.4)';
      c.fillRect(2, S-4, S-4, 4);
      // Tail
      c.fillStyle = '#7a0000';
      c.fillRect(S-8, 20, 8, 5); c.fillRect(S-5, 24, 6, 3); c.fillRect(S-3, 26, 4, 2);
      // Wings
      c.fillStyle = '#8a1010';
      c.fillRect(0, 6, 8, 16); c.fillRect(S-8, 6, 8, 16);
      c.fillStyle = '#6a0808';
      c.fillRect(1, 8, 6, 12); c.fillRect(S-7, 8, 6, 12);
      // Body
      c.fillStyle = '#9a1010';
      c.fillRect(6, 12, S-12, 14);
      c.fillStyle = '#b01818';
      c.fillRect(7, 10, S-14, 12);
      // Belly scales
      c.fillStyle = '#c03030';
      c.fillRect(10, 14, S-20, 10);
      c.fillStyle = '#a02020';
      c.fillRect(11, 15, 3, 2); c.fillRect(15, 16, 3, 2); c.fillRect(S-14, 15, 3, 2);
      // Neck
      c.fillStyle = '#9a1010';
      c.fillRect(10, 4, 12, 10);
      // Head
      c.fillStyle = '#b01818';
      c.fillRect(6, 0, S-12, 8);
      // Horns
      c.fillStyle = '#501010';
      c.fillRect(8, -3, 3, 5); c.fillRect(S-11, -3, 3, 5);
      // Eyes
      c.fillStyle = '#ffe030';
      c.fillRect(9, 2, 4, 3); c.fillRect(S-13, 2, 4, 3);
      c.fillStyle = '#000';
      c.fillRect(10, 2, 2, 3); c.fillRect(S-12, 2, 2, 3);
      // Snout
      c.fillStyle = '#a01010';
      c.fillRect(7, 5, S-14, 4);
      // Nostrils
      c.fillStyle = '#600';
      c.fillRect(9, 6, 2, 2); c.fillRect(S-11, 6, 2, 2);
      // Flame
      c.fillStyle = `rgba(255,${100+Math.floor(flame*80)},0,${0.7+flame*0.2})`;
      c.fillRect(5, 7, 6, 2);
      c.fillStyle = `rgba(255,200,0,${0.5+flame*0.3})`;
      c.fillRect(4, 7, 4, 1);
      break;
    }
    // ─── NPC AND CREATURE SPRITES ─────────────────────────────────────────────
    // Town NPCs, Elven Town NPCs, and Training Grounds creatures are in sprites_npc.js.
    // ─── CLASS-SPECIFIC PLAYER SPRITES ───────────────────────────────────────
    case 'player_warrior': {
      // Silver plate armor, broad shoulders, open-face barbute helmet, greatsword
      let bob = Math.sin(tick * 0.1) * 1;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(5, S-6, S-10, 3);
      // Boots (dark metal)
      c.fillStyle = '#404850';
      c.fillRect(7, S-8, 6, 5); c.fillRect(S-13, S-8, 6, 5);
      // Legs (silver greaves)
      c.fillStyle = '#707880';
      c.fillRect(8, S-14, 6, 6); c.fillRect(S-14, S-14, 6, 6);
      // Greave shine
      c.fillStyle = '#a0b0b8';
      c.fillRect(9, S-14, 2, 5); c.fillRect(S-13, S-14, 2, 5);
      // Body / chest armor (silver)
      c.fillStyle = '#80909a';
      c.fillRect(6, 14, S-12, 8);
      // Breastplate highlight
      c.fillStyle = '#b8c8d0';
      c.fillRect(8, 15, S-16, 4);
      // Broad pauldrons
      c.fillStyle = '#909aa0';
      c.fillRect(3, 13, 6, 5); c.fillRect(S-9, 13, 6, 5);
      // Pauldron shine
      c.fillStyle = '#c0d0d8';
      c.fillRect(4, 13, 2, 3); c.fillRect(S-8, 13, 2, 3);
      // Gauntlets
      c.fillStyle = '#707880';
      c.fillRect(3, 18, 4, 5); c.fillRect(S-7, 18, 4, 5);
      // Belt
      c.fillStyle = '#5a3010';
      c.fillRect(6, 21, S-12, 2);
      // Neck
      c.fillStyle = '#d0a080';
      c.fillRect(12, 11, 8, 4);
      // Barbute helmet sides (open-face style — cheek guards, no visor)
      c.fillStyle = '#808890';
      c.fillRect(8, 3, 4, 10); c.fillRect(S-12, 3, 4, 10);
      // Helmet top plate
      c.fillStyle = '#8890a0';
      c.fillRect(8, 3, S-16, 5);
      // Helmet top shine
      c.fillStyle = '#c0ccd8';
      c.fillRect(9, 3, S-18, 2);
      // Face (visible in open helm)
      c.fillStyle = '#d0a080';
      c.fillRect(12, 7, S-24, 7);
      // Eyes (determined, dark brown)
      c.fillStyle = '#3a2800';
      c.fillRect(12, 8, 3, 2); c.fillRect(S-15, 8, 3, 2);
      // Eye glint
      c.fillStyle = '#806040';
      c.fillRect(13, 8, 1, 1); c.fillRect(S-14, 8, 1, 1);
      // Nose
      c.fillStyle = '#c09060';
      c.fillRect(15, 10, 2, 2);
      // Jaw / mouth (set grimly)
      c.fillStyle = '#9a6040';
      c.fillRect(13, 12, 6, 1);
      // Sword blade (right)
      c.fillStyle = '#c0c8d8';
      c.fillRect(S-7, 11, 2, 14);
      c.fillStyle = '#d4a020';
      c.fillRect(S-10, 15, 7, 2);
      c.fillStyle = '#a0a8b8';
      c.fillRect(S-7, 7, 2, 5);
      break;
    }
    case 'player_ranger': {
      // Green/brown leather, lean build, hood, bow on back
      let bob = Math.sin(tick * 0.1) * 1;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.25)';
      c.fillRect(7, S-6, S-14, 3);
      // Boots
      c.fillStyle = '#3a2510';
      c.fillRect(9, S-8, 5, 5); c.fillRect(S-14, S-8, 5, 5);
      // Legs (leggings, lean)
      c.fillStyle = '#4a3a1a';
      c.fillRect(9, S-14, 5, 6); c.fillRect(S-14, S-14, 5, 6);
      // Tunic (lean body)
      c.fillStyle = '#2d5a1b';
      c.fillRect(8, 14, S-16, 8);
      // Thin shoulders
      c.fillStyle = '#3a6a20';
      c.fillRect(6, 14, 4, 3); c.fillRect(S-10, 14, 4, 3);
      // Belt / quiver strap
      c.fillStyle = '#5a3a1a';
      c.fillRect(8, 21, S-16, 2);
      // Neck
      c.fillStyle = '#d0a070';
      c.fillRect(12, 11, 8, 4);
      // Hood
      c.fillStyle = '#3a2a10';
      c.fillRect(8, 4, S-16, 10);
      c.fillRect(7, 6, 2, 6); c.fillRect(S-9, 6, 2, 6);
      // Hood shadow / dark brow
      c.fillStyle = '#1a1410';
      c.fillRect(9, 5, S-18, 3);
      // Face under hood (continuous — avoids mask-eye-hole appearance)
      c.fillStyle = '#d0a070';
      c.fillRect(10, 9, S-20, 3);
      // Eyes on the face
      c.fillStyle = '#3a2400';
      c.fillRect(11, 10, 2, 2); c.fillRect(S-13, 10, 2, 2);
      c.fillStyle = '#60a030';
      c.fillRect(11, 10, 2, 1); c.fillRect(S-13, 10, 2, 1);
      // Nose hint
      c.fillStyle = '#c09060';
      c.fillRect(15, 11, 2, 1);
      // Bow (right side, tall)
      c.fillStyle = '#7a5020';
      c.fillRect(S-7, 8, 2, 18);
      // Bow string
      c.fillStyle = '#e8d0a0';
      c.fillRect(S-6, 8, 1, 18);
      // Bow tips
      c.fillStyle = '#9a6030';
      c.fillRect(S-8, 8, 3, 2); c.fillRect(S-8, S-8, 3, 2);
      break;
    }
    case 'player_mage': {
      // Blue/purple robe, pointed hat, staff, glowing eyes
      let bob = Math.sin(tick * 0.08) * 1.5;
      c.translate(0, bob);
      // Shadow (robe is wide)
      c.fillStyle = 'rgba(0,0,0,0.25)';
      c.fillRect(5, S-6, S-10, 3);
      // Robe bottom (wide, flowing)
      c.fillStyle = '#2a1a5a';
      c.fillRect(5, 20, S-10, 7);
      // Robe body
      c.fillStyle = '#3a2870';
      c.fillRect(7, 14, S-14, 8);
      // Robe trim
      c.fillStyle = '#6a40a0';
      c.fillRect(7, 14, 2, 8); c.fillRect(S-9, 14, 2, 8);
      c.fillRect(5, 20, 2, 7); c.fillRect(S-7, 20, 2, 7);
      // Sash / belt
      c.fillStyle = '#9060c0';
      c.fillRect(7, 21, S-14, 2);
      // Rune on chest
      c.fillStyle = '#80c0ff';
      c.fillRect(13, 16, 2, 2); c.fillRect(17, 16, 2, 2);
      c.fillRect(15, 15, 2, 5);
      // Neck / face
      c.fillStyle = '#d0a080';
      c.fillRect(12, 11, 8, 4);
      c.fillRect(9, 6, S-18, 7);
      // Pointed hat
      c.fillStyle = '#1a0a3a';
      c.fillRect(10, 3, S-20, 5);
      c.fillRect(12, 1, S-24, 4);
      c.fillRect(14, -1, S-28, 3);
      // Hat highlight streak
      c.fillStyle = '#4a2080';
      c.fillRect(14, 0, 2, 4);
      // Glowing eyes
      c.fillStyle = '#80c0ff';
      c.fillRect(10, 8, 3, 2); c.fillRect(S-13, 8, 3, 2);
      // Staff (left side)
      c.fillStyle = '#5a3a10';
      c.fillRect(4, 4, 2, 22);
      // Staff gem
      c.fillStyle = '#9060ff';
      c.fillRect(3, 2, 4, 4);
      c.fillStyle = '#c090ff';
      c.fillRect(4, 2, 2, 2);
      break;
    }
    case 'player_paladin': {
      // Silver/white plate, holy cross, shield, halo, open-faced crusader helm
      let bob = Math.sin(tick * 0.1) * 1;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(5, S-6, S-10, 3);
      // Boots
      c.fillStyle = '#505060';
      c.fillRect(8, S-8, 5, 5); c.fillRect(S-13, S-8, 5, 5);
      // Legs (plate greaves)
      c.fillStyle = '#8090a0';
      c.fillRect(8, S-14, 5, 6); c.fillRect(S-13, S-14, 5, 6);
      // Greave highlights
      c.fillStyle = '#b0c0d0';
      c.fillRect(9, S-14, 2, 5); c.fillRect(S-12, S-14, 2, 5);
      // Body plate
      c.fillStyle = '#8090a0';
      c.fillRect(7, 14, S-14, 8);
      // Breastplate highlight
      c.fillStyle = '#c0d0e0';
      c.fillRect(9, 15, S-18, 5);
      // Holy cross on breastplate
      c.fillStyle = '#f0e060';
      c.fillRect(14, 15, 2, 5);
      c.fillRect(12, 17, 6, 2);
      // Broad pauldrons
      c.fillStyle = '#a0b0c0';
      c.fillRect(4, 13, 6, 5); c.fillRect(S-10, 13, 6, 5);
      // Pauldron shine
      c.fillStyle = '#d0e0f0';
      c.fillRect(5, 13, 2, 3); c.fillRect(S-9, 13, 2, 3);
      // Gauntlets
      c.fillStyle = '#7080a0';
      c.fillRect(3, 18, 5, 5); c.fillRect(S-8, 18, 5, 5);
      // Belt
      c.fillStyle = '#4a4050';
      c.fillRect(7, 21, S-14, 2);
      // Neck
      c.fillStyle = '#d0a080';
      c.fillRect(12, 11, 8, 4);
      // Halo (golden arc above head)
      c.fillStyle = '#f0d040';
      c.fillRect(9, 1, S-18, 2);
      c.fillRect(9, 1, 2, 3); c.fillRect(S-11, 1, 2, 3);
      c.fillStyle = '#fff8a0';
      c.fillRect(11, 0, S-22, 1);
      // Crusader helmet cheek guards (open face — no visor)
      c.fillStyle = '#8090a0';
      c.fillRect(8, 3, 4, 10); c.fillRect(S-12, 3, 4, 10);
      // Helmet top plate
      c.fillStyle = '#8090a0';
      c.fillRect(8, 3, S-16, 5);
      // Helmet top highlight
      c.fillStyle = '#c0d0e0';
      c.fillRect(9, 3, S-18, 2);
      // Nose guard (vertical silver bar)
      c.fillStyle = '#8090a0';
      c.fillRect(15, 6, 2, 7);
      // Face (visible either side of nose guard)
      c.fillStyle = '#d0a080';
      c.fillRect(10, 7, 5, 6); c.fillRect(S-15, 7, 5, 6);
      // Eyes (noble blue)
      c.fillStyle = '#4060a0';
      c.fillRect(11, 8, 3, 2); c.fillRect(S-14, 8, 3, 2);
      // Eye shine
      c.fillStyle = '#90b0e0';
      c.fillRect(12, 8, 1, 1); c.fillRect(S-13, 8, 1, 1);
      // Mouth (resolute)
      c.fillStyle = '#9a6040';
      c.fillRect(13, 12, 6, 1);
      // Plume (white/silver)
      c.fillStyle = '#e0e0ff';
      c.fillRect(15, 1, 2, 3);
      c.fillStyle = '#b0b0e0';
      c.fillRect(14, 2, 4, 2);
      // Shield (left arm)
      c.fillStyle = '#607090';
      c.fillRect(2, 12, 6, 10);
      c.fillStyle = '#4a5070';
      c.fillRect(2, 12, 6, 2);
      // Shield cross
      c.fillStyle = '#f0e060';
      c.fillRect(4, 15, 2, 5);
      c.fillRect(3, 17, 4, 2);
      // Sword (right side)
      c.fillStyle = '#c0d0e0';
      c.fillRect(S-7, 11, 2, 13);
      c.fillStyle = '#d4a020';
      c.fillRect(S-10, 15, 7, 2);
      c.fillStyle = '#b0c0d0';
      c.fillRect(S-7, 8, 2, 4);
      break;
    }
    case 'player_rogue': {
      // Dark hooded cloak, visible face, dual daggers
      let bob = Math.sin(tick * 0.12) * 1;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(7, S-6, S-14, 3);
      // Boots
      c.fillStyle = '#1a1a20';
      c.fillRect(9, S-8, 5, 5); c.fillRect(S-14, S-8, 5, 5);
      // Legs
      c.fillStyle = '#1e1e28';
      c.fillRect(9, S-14, 5, 6); c.fillRect(S-14, S-14, 5, 6);
      // Cloak / body
      c.fillStyle = '#1a1a2a';
      c.fillRect(7, 14, S-14, 9);
      // Cloak trim
      c.fillStyle = '#2a2a3a';
      c.fillRect(7, 14, 2, 9); c.fillRect(S-9, 14, 2, 9);
      // Belt
      c.fillStyle = '#2a2010';
      c.fillRect(7, 21, S-14, 2);
      // Belt buckle
      c.fillStyle = '#888060';
      c.fillRect(14, 21, 4, 2);
      // Neck
      c.fillStyle = '#c0906a';
      c.fillRect(12, 11, 8, 4);
      // Hood outer
      c.fillStyle = '#151520';
      c.fillRect(8, 3, S-16, 10);
      c.fillRect(6, 5, 3, 7);
      c.fillRect(S-9, 5, 3, 7);
      // Hood cast shadow (top of face only — not a mask)
      c.fillStyle = '#0e0e18';
      c.fillRect(9, 4, S-18, 3);
      // Face (visible beneath hood shadow)
      c.fillStyle = '#c0906a';
      c.fillRect(10, 7, S-20, 7);
      // Eyes (sharp, dark — alert, not glowing)
      c.fillStyle = '#1a1218';
      c.fillRect(11, 8, 3, 2); c.fillRect(S-14, 8, 3, 2);
      // Eye glint (human)
      c.fillStyle = '#607060';
      c.fillRect(12, 8, 1, 1); c.fillRect(S-13, 8, 1, 1);
      // Nose
      c.fillStyle = '#a87050';
      c.fillRect(15, 10, 2, 2);
      // Mouth (thin, neutral)
      c.fillStyle = '#8a5030';
      c.fillRect(13, 12, 5, 1);
      // Left dagger
      c.fillStyle = '#a0a8b8';
      c.fillRect(5, 16, 2, 8);
      c.fillStyle = '#5a4010';
      c.fillRect(4, 15, 4, 2);
      // Right dagger
      c.fillStyle = '#a0a8b8';
      c.fillRect(S-7, 16, 2, 8);
      c.fillStyle = '#5a4010';
      c.fillRect(S-8, 15, 4, 2);
      break;
    }
    case 'wild_boar': {
      let trot = Math.sin(tick * 0.15) * 1.5;
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(3, S-4, S-6, 3);
      // Tail (small curl on right side)
      c.fillStyle = '#4a2d10';
      c.fillRect(S-8, 13, 4, 2);
      c.fillRect(S-7, 11, 3, 3);
      // Body (large, stocky)
      c.fillStyle = '#5a3820';
      c.fillRect(5, 14, S-10, 10);
      c.fillStyle = '#7a5030';
      c.fillRect(6, 13, S-12, 6);
      // Belly (lighter)
      c.fillStyle = '#8a6040';
      c.fillRect(7, 20, S-15, 3);
      // Head (left-facing, prominent)
      c.fillStyle = '#5a3820';
      c.fillRect(0, 12, 12, 9);
      c.fillStyle = '#6a4828';
      c.fillRect(0, 12, 11, 5);
      // Snout (wide, flat)
      c.fillStyle = '#8a5835';
      c.fillRect(0, 17, 7, 4);
      // Nostrils
      c.fillStyle = '#2a1508';
      c.fillRect(1, 18, 2, 2);
      c.fillRect(4, 18, 2, 2);
      // Tusks (ivory, curving upward)
      c.fillStyle = '#f0e8c0';
      c.fillRect(1, 21, 6, 2);
      c.fillRect(2, 19, 2, 3);
      c.fillRect(5, 19, 2, 3);
      // Ears (small, pointy)
      c.fillStyle = '#4a2d10';
      c.fillRect(7, 7, 4, 6);
      c.fillRect(12, 7, 4, 6);
      c.fillStyle = '#c08080';
      c.fillRect(8, 8, 2, 4);
      c.fillRect(13, 8, 2, 4);
      // Eye
      c.fillStyle = '#111';
      c.fillRect(4, 14, 3, 3);
      c.fillStyle = 'rgba(255,255,255,0.7)';
      c.fillRect(4, 14, 1, 1);
      // Front legs
      c.fillStyle = '#4a2d10';
      c.fillRect(8, 23, 4, 5+trot);
      c.fillRect(14, 23, 4, 5);
      // Back legs
      c.fillRect(S-14, 23, 4, 5);
      c.fillRect(S-9, 23, 4, 5+trot);
      // Hooves
      c.fillStyle = '#1a0d08';
      c.fillRect(8, 27+trot, 4, 2);
      c.fillRect(14, 27, 4, 2);
      c.fillRect(S-14, 27, 4, 2);
      c.fillRect(S-9, 27+trot, 4, 2);
      break;
    }
    default:
      // NPC and creature sprites are in sprites_npc.js
      if (!drawNpcSprite(c, key, f)) {
        c.fillStyle = '#e0c080';
        c.fillRect(8, 4, 16, 24);
      }
  }
  c.restore();
}

// Renders a sprite to a combat canvas with an optional flash colour overlay.
// flashColor is a CSS RGB triplet string e.g. '255,255,255'.
function drawCombatCanvas(canvasId, spriteKey, flashTimer, flashColor, flashOpacityDivisor) {
  let el = document.getElementById(canvasId);
  if (!el) return;
  let c = el.getContext('2d');
  let scale = 3;
  el.width = TILE * scale; el.height = TILE * scale;
  c.clearRect(0, 0, el.width, el.height);
  c.save();
  c.scale(scale, scale);
  drawPixelSprite(c, 0, 0, spriteKey, Math.floor(tick / 8) % 2);
  if (flashTimer > 0) {
    c.globalCompositeOperation = 'source-atop';
    c.fillStyle = `rgba(${flashColor},${flashTimer / flashOpacityDivisor})`;
    c.fillRect(0, 0, TILE, TILE);
    c.globalCompositeOperation = 'source-over';
  }
  c.restore();
}

function drawEnemyCombat(key) {
  drawCombatCanvas('enemy-canvas', key, enemyFlashTimer, '255,255,255', 10);
}

function drawPlayerCombat() {
  const cls = (game && game.player && game.player.class) || 'warrior';
  drawCombatCanvas('player-combat-canvas', 'player_' + cls, playerFlashTimer, '255,60,60', 12);
}
