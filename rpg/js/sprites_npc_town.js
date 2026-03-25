// sprites_npc_town.js — Pixel-art sprites for town NPCs and Elven Town NPCs.
// Called by drawNpcSprite() in sprites_npc.js.
// Returns true if the key was handled, false otherwise.
// Depends on: constants.js (TILE), state.js (tick).

function drawNpcSpriteTown(c, key, f) {
  const S = 32; // sprite grid
  switch (key) {
    case 'shopkeeper': {
      // Apron/merchant
      c.fillStyle = '#d0a050'; // Skin
      c.fillRect(10, 10, 12, 8); // Head
      c.fillStyle = '#c07820'; // Hat
      c.fillRect(8, 5, 16, 3); c.fillRect(10, 2, 12, 5);
      c.fillStyle = '#fff8e0'; // Apron
      c.fillRect(7, 18, 18, 12);
      c.fillStyle = '#c8a030';
      c.fillRect(6, 16, 20, 4); // Collar
      c.fillStyle = '#d0a050';
      c.fillRect(5, 18, 5, 8); c.fillRect(S-10, 18, 5, 8); // Arms
      // Eyes
      c.fillStyle = '#333';
      c.fillRect(12, 13, 2, 2); c.fillRect(S-14, 13, 2, 2);
      // Smile
      c.fillStyle = '#8a5020';
      c.fillRect(12, 16, 8, 1);
      break;
    }
    case 'healer': {
      c.fillStyle = '#d0a080';
      c.fillRect(10, 10, 12, 8);
      c.fillStyle = '#f0f0f0';
      c.fillRect(7, 16, 18, 14);
      c.fillStyle = '#e04060';
      c.fillRect(12, 19, 8, 2); c.fillRect(15, 17, 2, 6); // Cross
      c.fillStyle = '#d0a080';
      c.fillRect(6, 16, 5, 8); c.fillRect(S-11, 16, 5, 8);
      c.fillStyle = '#e8e8e8';
      c.fillRect(9, 5, 14, 8); // Veil
      c.fillStyle = '#e04060';
      c.fillRect(9, 5, 14, 2);
      c.fillStyle = '#333';
      c.fillRect(12, 13, 2, 2); c.fillRect(S-14, 13, 2, 2);
      break;
    }
    case 'elder': {
      c.fillStyle = '#c8a880';
      c.fillRect(10, 10, 12, 8);
      c.fillStyle = '#8080a0';
      c.fillRect(7, 16, 18, 14);
      c.fillStyle = '#c8a880';
      c.fillRect(6, 16, 5, 8); c.fillRect(S-11, 16, 5, 8);
      c.fillStyle = '#f0f0f0'; // White hair
      c.fillRect(8, 8, 16, 5); c.fillRect(7, 13, 4, 5); c.fillRect(S-11, 13, 4, 5);
      c.fillStyle = '#f0e0d0'; // Beard
      c.fillRect(9, 16, 14, 8);
      c.fillStyle = '#888';
      c.fillRect(12, 13, 2, 2); c.fillRect(S-14, 13, 2, 2);
      // Staff
      c.fillStyle = '#7a5020';
      c.fillRect(S-8, 5, 3, 25);
      c.fillStyle = '#4080e0';
      c.fillRect(S-9, 3, 5, 5);
      break;
    }
    case 'guard': {
      c.fillStyle = '#d0a080';
      c.fillRect(10, 8, 12, 8);
      c.fillStyle = '#606080';
      c.fillRect(7, 16, 18, 14);
      c.fillStyle = '#808090';
      c.fillRect(6, 14, 5, 12); c.fillRect(S-11, 14, 5, 12);
      c.fillStyle = '#505060';
      c.fillRect(8, 3, 16, 8); // Helmet
      c.fillStyle = '#707080';
      c.fillRect(9, 4, 14, 6);
      c.fillStyle = '#333';
      c.fillRect(10, 8, 12, 3); // Visor gap
      c.fillStyle = '#909095'; // Spear
      c.fillRect(S-7, 0, 2, 30);
      c.fillStyle = '#c0c0d0';
      c.fillRect(S-8, 0, 4, 5);
      break;
    }
    case 'villager': {
      c.fillStyle = '#d0a870';
      c.fillRect(10, 10, 12, 8);
      c.fillStyle = '#40a070';
      c.fillRect(7, 16, 18, 14);
      c.fillStyle = '#d0a870';
      c.fillRect(6, 16, 5, 8); c.fillRect(S-11, 16, 5, 8);
      c.fillStyle = '#4a3010';
      c.fillRect(9, 5, 14, 8); // Hair
      c.fillStyle = '#333';
      c.fillRect(12, 13, 2, 2); c.fillRect(S-14, 13, 2, 2);
      break;
    }
    case 'elven_villager': {
      // Tall, graceful elf — silver hair, teal robe, pointed ears
      let bob = Math.sin(tick * 0.08) * 0.8;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.fillRect(9, S-4, S-18, 3);
      // Robe lower (flared hem)
      c.fillStyle = '#487878';
      c.fillRect(8, 20, S-16, 9);
      c.fillRect(6, 24, S-12, 5);
      // Robe body
      c.fillStyle = '#598888';
      c.fillRect(10, 13, S-20, 9);
      // Silver trim on collar and waist
      c.fillStyle = '#c0c8e0';
      c.fillRect(10, 13, S-20, 1);
      c.fillRect(8, 22, S-16, 1);
      // Arms (slender, ivory skin)
      c.fillStyle = '#d8c8a8';
      c.fillRect(6, 14, 4, 8); c.fillRect(S-10, 14, 4, 8);
      // Neck
      c.fillStyle = '#d8c8a8';
      c.fillRect(12, 10, 8, 4);
      // Head (slender)
      c.fillStyle = '#ead8b8';
      c.fillRect(11, 2, S-22, 10);
      // Pointed ears
      c.fillStyle = '#ead8b8';
      c.fillRect(9, 4, 3, 4); c.fillRect(S-12, 4, 3, 4);
      c.fillStyle = '#d0b898';
      c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2);
      // Silver hair
      c.fillStyle = '#d0d0e8';
      c.fillRect(11, 2, S-22, 3);
      c.fillRect(9, 5, 4, 5); c.fillRect(S-13, 5, 4, 5);
      // Eyes (almond, deep green shimmer)
      c.fillStyle = '#1a2a1a';
      c.fillRect(13, 7, 3, 2); c.fillRect(S-16, 7, 3, 2);
      c.fillStyle = 'rgba(80,200,160,0.85)';
      c.fillRect(14, 7, 1, 1); c.fillRect(S-15, 7, 1, 1);
      break;
    }
    case 'elven_merchant': {
      // Elven merchant — green robe with gold trim, golden circlet
      let bob = Math.sin(tick * 0.06) * 0.8;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.fillRect(9, S-4, S-18, 3);
      // Robe lower (rich green)
      c.fillStyle = '#2a6040';
      c.fillRect(7, 19, S-14, 10);
      c.fillRect(5, 24, S-10, 5);
      // Robe body
      c.fillStyle = '#336850';
      c.fillRect(10, 12, S-20, 9);
      // Gold trim borders
      c.fillStyle = '#d4af37';
      c.fillRect(10, 12, S-20, 1);
      c.fillRect(7, 21, S-14, 1);
      c.fillRect(10, 12, 1, 9); c.fillRect(S-11, 12, 1, 9);
      // Merchant sash
      c.fillStyle = '#8b6914';
      c.fillRect(7, 22, S-14, 2);
      // Arms
      c.fillStyle = '#d8c8a8';
      c.fillRect(6, 13, 4, 8); c.fillRect(S-10, 13, 4, 8);
      // Neck
      c.fillStyle = '#d8c8a8';
      c.fillRect(12, 9, 8, 4);
      // Head
      c.fillStyle = '#ead8b8';
      c.fillRect(11, 2, S-22, 9);
      // Pointed ears
      c.fillStyle = '#ead8b8';
      c.fillRect(9, 3, 3, 4); c.fillRect(S-12, 3, 3, 4);
      c.fillStyle = '#d0b898';
      c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2);
      // Golden circlet headband
      c.fillStyle = '#d4af37';
      c.fillRect(11, 2, S-22, 2);
      // Hair (silver, peeking from under circlet)
      c.fillStyle = '#c8c8e0';
      c.fillRect(9, 4, 4, 4); c.fillRect(S-13, 4, 4, 4);
      // Eyes
      c.fillStyle = '#1a2a1a';
      c.fillRect(13, 6, 3, 2); c.fillRect(S-16, 6, 3, 2);
      c.fillStyle = 'rgba(80,200,140,0.85)';
      c.fillRect(14, 6, 1, 1); c.fillRect(S-15, 6, 1, 1);
      break;
    }
    case 'elven_elder': {
      // Elven elder — silver-blue robes, silver crown, glowing crystal staff
      let bob     = Math.sin(tick * 0.05) * 0.6;
      let crystal = Math.sin(tick * 0.1) * 0.3 + 0.7;
      c.translate(0, bob);
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.fillRect(9, S-4, S-18, 3);
      // Robe lower (silver-blue)
      c.fillStyle = '#7888a8';
      c.fillRect(7, 19, S-14, 10);
      c.fillRect(5, 24, S-10, 5);
      // Robe body
      c.fillStyle = '#8898b8';
      c.fillRect(10, 12, S-20, 9);
      // White-silver trim
      c.fillStyle = '#c8d0e8';
      c.fillRect(10, 12, S-20, 1);
      c.fillRect(7, 21, S-14, 1);
      // Arms
      c.fillStyle = '#d8c8a8';
      c.fillRect(6, 13, 4, 8); c.fillRect(S-10, 13, 4, 8);
      // Neck
      c.fillStyle = '#d8c8a8';
      c.fillRect(12, 9, 8, 4);
      // Head (wise elder proportions)
      c.fillStyle = '#e0d0b0';
      c.fillRect(11, 2, S-22, 9);
      // Pointed ears
      c.fillStyle = '#e0d0b0';
      c.fillRect(9, 3, 3, 4); c.fillRect(S-12, 3, 3, 4);
      c.fillStyle = '#ccc0a0';
      c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2);
      // White hair (flowing)
      c.fillStyle = '#e8e8f0';
      c.fillRect(11, 2, S-22, 3);
      c.fillRect(9, 5, 4, 5); c.fillRect(S-13, 5, 4, 5);
      // Silver crown
      c.fillStyle = '#c0c8e0';
      c.fillRect(11, 2, S-22, 1);
      c.fillRect(12, 0, 2, 3); c.fillRect(S/2-1, 0, 2, 3); c.fillRect(S-14, 0, 2, 3);
      // Crown gemstones
      c.fillStyle = '#d4af37';
      c.fillRect(13, 1, 1, 1); c.fillRect(S/2, 1, 1, 1); c.fillRect(S-13, 1, 1, 1);
      // Eyes (wise, silver-blue shimmer)
      c.fillStyle = '#1a2818';
      c.fillRect(13, 6, 3, 2); c.fillRect(S-16, 6, 3, 2);
      c.fillStyle = 'rgba(120,200,220,0.9)';
      c.fillRect(14, 6, 1, 1); c.fillRect(S-15, 6, 1, 1);
      // Crystal staff (right side)
      c.fillStyle = '#a0b0c0';
      c.fillRect(S-7, 5, 2, 25);
      // Crystal orb top
      c.fillStyle = `rgba(100,180,255,${crystal})`;
      c.fillRect(S-10, 1, 8, 6);
      c.fillStyle = `rgba(200,230,255,${crystal*0.75})`;
      c.fillRect(S-9, 2, 6, 4);
      // Crystal glow
      c.fillStyle = `rgba(160,210,255,${0.25*crystal})`;
      c.fillRect(S-12, 0, 10, 8);
      break;
    }
    case 'elven_blacksmith': {
      // Dark leather apron, sturdy build, amber eyes, hammer
      let bob = Math.sin(tick * 0.07) * 0.8;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.22)'; c.fillRect(8, S-4, S-16, 3);
      c.fillStyle = '#3a2810'; c.fillRect(9, 22, 5, 7); c.fillRect(S-14, 22, 5, 7); // legs
      c.fillStyle = '#281808'; c.fillRect(8, S-7, 6, 5); c.fillRect(S-14, S-7, 6, 5); // boots
      c.fillStyle = '#4a3018'; c.fillRect(8, 13, S-16, 11); // dark tunic
      c.fillStyle = '#6a4020'; c.fillRect(10, 14, S-20, 10); // leather apron
      c.fillStyle = '#4a2810'; c.fillRect(10, 14, S-20, 1); c.fillRect(10, 14, 1, 10); c.fillRect(S-11, 14, 1, 10); // apron straps
      c.fillStyle = '#c0a880'; c.fillRect(4, 14, 5, 10); c.fillRect(S-9, 14, 5, 10); // arms (skin)
      c.fillStyle = '#4a3018'; c.fillRect(4, 14, 5, 4); c.fillRect(S-9, 14, 5, 4); // sleeve tops
      c.fillStyle = '#c0a880'; c.fillRect(12, 10, 8, 4); // neck
      c.fillStyle = '#c8b090'; c.fillRect(11, 2, S-22, 9); // head
      c.fillStyle = '#c8b090'; c.fillRect(9, 3, 3, 4); c.fillRect(S-12, 3, 3, 4); // ears
      c.fillStyle = '#b09878'; c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2); // ear tips
      c.fillStyle = '#2a1808'; c.fillRect(11, 2, S-22, 3); c.fillRect(9, 4, 3, 2); c.fillRect(S-12, 4, 3, 2); // dark hair
      c.fillStyle = '#1a1818'; c.fillRect(13, 6, 3, 2); c.fillRect(S-16, 6, 3, 2); // eyes
      c.fillStyle = 'rgba(200,120,40,0.9)'; c.fillRect(14, 6, 1, 1); c.fillRect(S-15, 6, 1, 1); // amber iris
      c.fillStyle = '#808090'; c.fillRect(S-7, 18, 3, 10); // hammer handle
      c.fillStyle = '#606070'; c.fillRect(S-9, 16, 7, 5); // hammer head
      break;
    }
    case 'elven_innkeeper': {
      // Warm burgundy robe, mug in hand, welcoming smile
      let bob = Math.sin(tick * 0.08) * 0.8;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(9, S-4, S-18, 3);
      c.fillStyle = '#6a2838'; c.fillRect(8, 19, S-16, 10); c.fillRect(6, 24, S-12, 5); // robe lower
      c.fillStyle = '#7a3040'; c.fillRect(10, 12, S-20, 9); // robe body
      c.fillStyle = '#e8dcc0'; c.fillRect(13, 12, 6, 9); // cream apron front
      c.fillStyle = '#c8901c'; c.fillRect(10, 12, S-20, 1); c.fillRect(8, 22, S-16, 1); // gold trim
      c.fillStyle = '#d8c8a8'; c.fillRect(6, 13, 4, 8); c.fillRect(S-10, 13, 4, 8); // arms
      c.fillStyle = '#c8a060'; c.fillRect(2, 17, 5, 5); // mug body
      c.fillStyle = 'rgba(100,140,255,0.5)'; c.fillRect(3, 17, 3, 2); // mug liquid
      c.fillStyle = '#d8c8a8'; c.fillRect(12, 9, 8, 4); // neck
      c.fillStyle = '#ead8b8'; c.fillRect(11, 2, S-22, 9); // head
      c.fillStyle = '#ead8b8'; c.fillRect(9, 3, 3, 4); c.fillRect(S-12, 3, 3, 4); // ears
      c.fillStyle = '#d0b898'; c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2); // ear tips
      c.fillStyle = '#7a3010'; c.fillRect(11, 2, S-22, 3); c.fillRect(9, 4, 3, 4); c.fillRect(S-12, 4, 3, 4); // auburn hair
      c.fillStyle = '#1a1818'; c.fillRect(13, 6, 3, 2); c.fillRect(S-16, 6, 3, 2); // eyes
      c.fillStyle = 'rgba(160,100,60,0.9)'; c.fillRect(14, 6, 1, 1); c.fillRect(S-15, 6, 1, 1); // warm iris
      c.fillStyle = '#a06040'; c.fillRect(13, 9, 6, 1); // smile
      break;
    }
    case 'elven_lorekeeper': {
      // Deep purple scholarly robes, white hair, spectacles, book in hand
      let bob = Math.sin(tick * 0.05) * 0.5;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(9, S-4, S-18, 3);
      c.fillStyle = '#3a1858'; c.fillRect(7, 19, S-14, 10); c.fillRect(5, 24, S-10, 5); // robe lower
      c.fillStyle = '#4a2068'; c.fillRect(10, 12, S-20, 9); // robe body
      c.fillStyle = '#b8c0d0'; c.fillRect(10, 12, S-20, 1); c.fillRect(7, 22, S-14, 1); // silver trim
      c.fillStyle = '#d8c8a8'; c.fillRect(6, 13, 4, 8); c.fillRect(S-10, 13, 4, 8); // arms
      c.fillStyle = '#8b2222'; c.fillRect(2, 16, 5, 7); // book cover
      c.fillStyle = '#e8d080'; c.fillRect(3, 17, 4, 5); // book pages
      c.fillStyle = '#604010'; c.fillRect(3, 17, 4, 1); c.fillRect(3, 20, 4, 1); // page lines
      c.fillStyle = '#d8c8a8'; c.fillRect(12, 9, 8, 4); // neck
      c.fillStyle = '#e0d0b0'; c.fillRect(11, 2, S-22, 9); // head
      c.fillStyle = '#e0d0b0'; c.fillRect(9, 3, 3, 4); c.fillRect(S-12, 3, 3, 4); // ears
      c.fillStyle = '#ccc0a0'; c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2); // ear tips
      c.fillStyle = '#e8e8f0'; c.fillRect(11, 2, S-22, 3); c.fillRect(9, 4, 3, 5); c.fillRect(S-12, 4, 3, 5); // white hair
      c.fillStyle = '#c0a030'; c.fillRect(12, 7, 3, 1); c.fillRect(S-15, 7, 3, 1); c.fillRect(15, 7, 2, 1); // spectacle frames
      c.fillStyle = '#1a1830'; c.fillRect(13, 6, 2, 2); c.fillRect(S-15, 6, 2, 2); // eyes
      c.fillStyle = 'rgba(140,100,220,0.9)'; c.fillRect(14, 6, 1, 1); c.fillRect(S-14, 6, 1, 1); // purple iris
      break;
    }
    case 'elven_herbalist': {
      // Forest green robe, flower wreath, herb bundle in hand
      let bob = Math.sin(tick * 0.09) * 0.8;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(9, S-4, S-18, 3);
      c.fillStyle = '#2a5830'; c.fillRect(8, 19, S-16, 10); c.fillRect(6, 24, S-12, 5); // robe lower
      c.fillStyle = '#3a6838'; c.fillRect(10, 12, S-20, 9); // robe body
      c.fillStyle = '#7a5030'; c.fillRect(12, 16, 8, 6); // herb pouch
      c.fillStyle = '#80d060'; c.fillRect(10, 12, S-20, 1); c.fillRect(8, 22, S-16, 1); // floral trim
      c.fillStyle = '#90e070'; c.fillRect(11, 14, 2, 2); c.fillRect(S-13, 14, 2, 2); // herb dots
      c.fillStyle = '#d8c8a8'; c.fillRect(6, 13, 4, 8); c.fillRect(S-10, 13, 4, 8); // arms
      c.fillStyle = '#50a030'; c.fillRect(S-8, 16, 3, 8); c.fillRect(S-10, 14, 5, 4); // herb bundle stem
      c.fillStyle = '#70c050'; c.fillRect(S-9, 13, 3, 3); // herb leaves
      c.fillStyle = '#d8c8a8'; c.fillRect(12, 9, 8, 4); // neck
      c.fillStyle = '#ead8b8'; c.fillRect(11, 2, S-22, 9); // head
      c.fillStyle = '#ead8b8'; c.fillRect(9, 3, 3, 4); c.fillRect(S-12, 3, 3, 4); // ears
      c.fillStyle = '#d0b898'; c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2); // ear tips
      c.fillStyle = '#c8a030'; c.fillRect(11, 2, S-22, 2); // wreath band
      c.fillStyle = '#e04060'; c.fillRect(12, 1, 2, 2); c.fillRect(17, 1, 2, 2); c.fillRect(S-14, 1, 2, 2); // wreath flowers
      c.fillStyle = '#6a3810'; c.fillRect(9, 4, 4, 5); c.fillRect(S-13, 4, 4, 5); // chestnut hair
      c.fillStyle = '#1a2010'; c.fillRect(13, 6, 3, 2); c.fillRect(S-16, 6, 3, 2); // eyes
      c.fillStyle = 'rgba(80,180,100,0.9)'; c.fillRect(14, 6, 1, 1); c.fillRect(S-15, 6, 1, 1); // green iris
      break;
    }
    case 'elven_bowyer': {
      // Forest green ranger outfit, quiver on back, brown hair
      let bob = Math.sin(tick * 0.08) * 0.8;
      c.translate(0, bob);
      c.fillStyle = 'rgba(0,0,0,0.20)'; c.fillRect(9, S-4, S-18, 3);
      c.fillStyle = '#1a3820'; c.fillRect(9, 22, 5, 7); c.fillRect(S-14, 22, 5, 7); // legs
      c.fillStyle = '#3a2010'; c.fillRect(8, S-7, 6, 5); c.fillRect(S-14, S-7, 6, 5); // boots
      c.fillStyle = '#2a5030'; c.fillRect(9, 13, S-18, 10); // tunic base
      c.fillStyle = '#3a6040'; c.fillRect(10, 12, S-20, 8); // tunic upper
      c.fillStyle = '#6a4020'; c.fillRect(4, 18, 5, 4); c.fillRect(S-9, 18, 5, 4); // leather bracers
      c.fillStyle = '#8a5020'; c.fillRect(S-6, 8, 4, 14); // quiver body
      c.fillStyle = '#c0a040'; c.fillRect(S-7, 8, 5, 1); // quiver top rim
      c.fillStyle = '#e04040'; c.fillRect(S-5, 6, 1, 4); c.fillRect(S-4, 7, 1, 3); // arrow fletchings
      c.fillStyle = '#d8c8a8'; c.fillRect(5, 13, 4, 9); c.fillRect(S-9, 13, 4, 9); // arms
      c.fillStyle = '#d8c8a8'; c.fillRect(12, 9, 8, 4); // neck
      c.fillStyle = '#ead8b8'; c.fillRect(11, 2, S-22, 9); // head
      c.fillStyle = '#ead8b8'; c.fillRect(9, 3, 3, 4); c.fillRect(S-12, 3, 3, 4); // ears
      c.fillStyle = '#d0b898'; c.fillRect(9, 3, 2, 2); c.fillRect(S-11, 3, 2, 2); // ear tips
      c.fillStyle = '#3a2010'; c.fillRect(11, 2, S-22, 4); c.fillRect(9, 5, 3, 3); c.fillRect(S-12, 5, 3, 3); // dark brown hair
      c.fillStyle = '#1a1810'; c.fillRect(13, 6, 3, 2); c.fillRect(S-16, 6, 3, 2); // eyes
      c.fillStyle = 'rgba(80,160,80,0.9)'; c.fillRect(14, 6, 1, 1); c.fillRect(S-15, 6, 1, 1); // green iris
      break;
    }
    default:
      return false;
  }
  return true;
}
