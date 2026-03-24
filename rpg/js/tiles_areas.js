// tiles_areas.js — Tile rendering for the 5 new explorable world areas:
// Volcanic Wastes (LAVA, VOLCANIC_WALL, VOLCANIC_FLOOR), Frozen Peaks (SNOW, ICE_WALL),
// Shadow Forest (SHADOW_FLOOR), Dwarf Fortress (FORGE_GLOW), Ruins of Aethoria (SACRED_GROUND,
// BROKEN_PILLAR), and their corresponding world map markers (WORLD_VOLCANIC_WASTES through
// WORLD_AETHORIA).
// Called by drawTile() in tiles.js for tile types T.LAVA (36) through T.WORLD_AETHORIA (49).
// Depends on: constants.js (TILE, T), state.js (tick).

// Returns true if tileType was handled (so tiles.js knows whether to fall through).
function drawAreaTile(c, sx, sy, tileType, x, y, s, h) {
  if (tileType === T.LAVA) {
    // Animated lava — dark red-orange with glowing cracks
    let flow = Math.sin(tick * 0.04 + x * 0.5 + y * 0.3) * 0.15 + 0.85;
    c.fillStyle = '#1a0500';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = `rgba(140,30,0,${0.8 * flow})`;
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Glowing lava veins
    c.fillStyle = `rgba(255,100,0,${0.7 * flow})`;
    if (h===0){c.fillRect(sx+4,sy+8,s-8,4); c.fillRect(sx+10,sy+6,4,s-12);}
    if (h===1){c.fillRect(sx+6,sy+s-12,s-12,4); c.fillRect(sx+4,sy+4,4,s-16);}
    if (h===2){c.fillRect(sx+8,sy+4,s-16,4); c.fillRect(sx+s-12,sy+8,4,s-16);}
    if (h===3){c.fillRect(sx+4,sy+s/2-2,s-8,4); c.fillRect(sx+s/2-2,sy+4,4,s-8);}
    // Bright orange core
    c.fillStyle = `rgba(255,200,50,${0.5 * flow})`;
    c.fillRect(sx+s/2-3, sy+s/2-3, 6, 6);
    // Smoke tint
    c.fillStyle = 'rgba(0,0,0,0.2)';
    c.fillRect(sx, sy, s, 4);
  } else if (tileType === T.VOLCANIC_WALL) {
    // Dark volcanic rock — black with deep red veins
    c.fillStyle = h<2 ? '#1a0a0a' : '#150808';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = h<2 ? '#2a1010' : '#251212';
    c.fillRect(sx+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+s/2+1, sy+s/2+1, s/2-2, s/2-2);
    c.fillStyle = '#320c0c';
    c.fillRect(sx+s/2+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+1, sy+s/2+1, s/2-2, s/2-2);
    // Red lava veins in cracks
    c.fillStyle = 'rgba(200,40,0,0.4)';
    c.fillRect(sx+0, sy+s/2, s, 1);
    c.fillRect(sx+s/2, sy, 1, s);
    c.fillStyle = 'rgba(255,80,0,0.2)';
    if (h<2) c.fillRect(sx+Math.floor(s/3), sy+1, 1, s/2-2);
    else c.fillRect(sx+Math.floor(2*s/3), sy+s/2+1, 1, s/2-2);
  } else if (tileType === T.VOLCANIC_FLOOR) {
    // Dark reddish volcanic stone ground
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#2a0a0a' : '#260808');
    g.addColorStop(1, h<2 ? '#3a1010' : '#341212');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Faint lava glow from below
    c.fillStyle = 'rgba(180,30,0,0.08)';
    c.fillRect(sx, sy, s, s);
    // Ash/crack texture
    c.fillStyle = 'rgba(0,0,0,0.2)';
    if (h===1){c.fillRect(sx,sy+s/2,s,1);}
    if (h===2){c.fillRect(sx+s/2,sy,1,s);}
    // Ember specks
    let lx2 = (x*13+y*9)%(s-6), ly2 = (x*7+y*15)%(s-6);
    c.fillStyle = `rgba(255,80,0,0.3)`;
    c.fillRect(sx+lx2+3, sy+ly2+3, 2, 2);
  } else if (tileType === T.SNOW) {
    // Snow-covered ground with subtle sparkle
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#e8f4f8' : '#e0eef4');
    g.addColorStop(1, h<2 ? '#d8eaf0' : '#d0e4ec');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Shadow dips
    c.fillStyle = 'rgba(100,160,200,0.12)';
    if (h===0){c.fillRect(sx+4,sy+s-10,s-8,6);}
    if (h===1){c.fillRect(sx+s-10,sy+4,6,s-8);}
    // Snow sparkle glints
    c.fillStyle = 'rgba(255,255,255,0.7)';
    let sx2 = (x*11+y*7)%(s-6), sy2 = (x*5+y*13)%(s-6);
    c.fillRect(sx+sx2+2, sy+sy2+2, 2, 2);
    // Blue-white grout lines
    c.fillStyle = 'rgba(150,200,230,0.2)';
    c.fillRect(sx, sy, s, 1);
    c.fillRect(sx, sy, 1, s);
  } else if (tileType === T.ICE_WALL) {
    // Glacial ice wall — blue-white with crystal facets
    let g = c.createLinearGradient(sx, sy, sx+s, sy);
    g.addColorStop(0, h<2 ? '#8ac8e0' : '#7abcd8');
    g.addColorStop(1, h<2 ? '#5a9ab8' : '#4a8aaa');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Crystal facet panels
    c.fillStyle = 'rgba(200,240,255,0.25)';
    c.fillRect(sx+2, sy+2, s/2-4, s/2-4);
    c.fillRect(sx+s/2+2, sy+s/2+2, s/2-4, s/2-4);
    c.fillStyle = 'rgba(10,50,80,0.15)';
    c.fillRect(sx+s/2+2, sy+2, s/2-4, s/2-4);
    c.fillRect(sx+2, sy+s/2+2, s/2-4, s/2-4);
    // Ice-blue dividers
    c.fillStyle = '#1a5c7a';
    c.fillRect(sx, sy+s/2, s, 1);
    c.fillRect(sx+s/2, sy, 1, s);
    // White highlight
    c.fillStyle = 'rgba(255,255,255,0.3)';
    c.fillRect(sx+2, sy+2, s-4, 2);
    c.fillRect(sx+2, sy+4, 2, s-6);
  } else if (tileType === T.SHADOW_FLOOR) {
    // Dark shadowy forest floor — near-black with mist
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#1a1a0a' : '#16160a');
    g.addColorStop(1, h<2 ? '#0e1208' : '#0a0e06');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Dark vine/root textures
    c.fillStyle = 'rgba(40,60,20,0.4)';
    if (h===0){c.fillRect(sx+3,sy+s/2,s/2,1);c.fillRect(sx+3,sy+s/2+1,2,6);}
    if (h===1){c.fillRect(sx+s-8,sy+4,1,s/2);c.fillRect(sx+s-9,sy+s/2,6,1);}
    if (h===2){c.fillRect(sx+s/2,sy+3,1,s/2-2);c.fillRect(sx+s/2-3,sy+s/2,6,1);}
    // Purple mist wisps
    c.fillStyle = 'rgba(80,30,80,0.1)';
    c.fillRect(sx, sy, s, s);
    // Faint toxic green speck
    let gx = (x*9+y*7)%(s-8), gy = (x*7+y*11)%(s-8);
    c.fillStyle = 'rgba(40,120,20,0.25)';
    c.fillRect(sx+gx+3, sy+gy+3, 2, 2);
  } else if (tileType === T.FORGE_GLOW) {
    // Forge — glowing orange-red heat source
    let flicker = Math.sin(tick * 0.15 + x + y) * 0.2 + 0.8;
    c.fillStyle = '#1a0800';
    c.fillRect(sx, sy, s, s);
    // Forge body
    c.fillStyle = '#2a1200';
    c.fillRect(sx+4, sy+8, s-8, s-14);
    // Glowing coals
    c.fillStyle = `rgba(255,120,0,${0.9 * flicker})`;
    c.fillRect(sx+6, sy+s-12, s-12, 6);
    // Fire flames
    c.fillStyle = `rgba(255,200,0,${0.8 * flicker})`;
    c.fillRect(sx+8, sy+s-18, 6, 8);
    c.fillRect(sx+s-16, sy+s-16, 5, 6);
    c.fillRect(sx+s/2-3, sy+s-20, 6, 10);
    // Orange glow overlay
    c.fillStyle = `rgba(255,80,0,${0.15 * flicker})`;
    c.fillRect(sx, sy, s, s);
    // Stone rim
    c.fillStyle = '#3a3a3a';
    c.fillRect(sx+4, sy+8, s-8, 4);
    c.fillRect(sx+4, sy+8, 4, s-14);
    c.fillRect(sx+s-8, sy+8, 4, s-14);
  } else if (tileType === T.SACRED_GROUND) {
    // Ancient holy ground — warm golden stone with divine light beams
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#d4a017' : '#c89010');
    g.addColorStop(1, h<2 ? '#b88a10' : '#a87a08');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Golden light beam (vertical shimmer on some tiles)
    if ((x*3+y*7)%5===0) {
      let beam = Math.sin(tick*0.03+x*0.7+y*0.5)*0.1+0.15;
      c.fillStyle = `rgba(255,220,80,${beam})`;
      c.fillRect(sx+s/2-3, sy, 6, s);
    }
    // Ancient carved rune
    if (h===0) {
      c.fillStyle = 'rgba(80,50,0,0.3)';
      c.fillRect(sx+s/2-1, sy+6, 2, s-12);
      c.fillRect(sx+6, sy+s/2-1, s-12, 2);
    }
    // Stone grout
    c.fillStyle = 'rgba(0,0,0,0.18)';
    c.fillRect(sx, sy, s, 1);
    c.fillRect(sx, sy, 1, s);
    // Gold shimmer highlight
    c.fillStyle = 'rgba(255,230,100,0.1)';
    c.fillRect(sx+1, sy+1, s-2, 2);
  } else if (tileType === T.BROKEN_PILLAR) {
    // Crumbled ancient pillar — impassable rubble
    c.fillStyle = '#3a2e1a';
    c.fillRect(sx, sy, s, s);
    // Pillar base
    c.fillStyle = '#5a4a28';
    c.fillRect(sx+6, sy+s-18, s-12, 14);
    // Broken shaft
    c.fillStyle = '#6a5a30';
    c.fillRect(sx+10, sy+10, s-20, s-24);
    // Rubble chunks
    c.fillStyle = '#7a6a38';
    c.fillRect(sx+4, sy+6, 10, 8);
    c.fillRect(sx+s-14, sy+10, 10, 6);
    c.fillRect(sx+8, sy+s-24, 8, 8);
    // Gold inlay remnants
    c.fillStyle = 'rgba(180,140,20,0.5)';
    c.fillRect(sx+10, sy+12, s-20, 2);
    c.fillRect(sx+10, sy+s-26, s-20, 2);
    // Crack shadow
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.fillRect(sx+s/2-1, sy+8, 2, s-22);
  } else if (tileType === T.WORLD_VOLCANIC_WASTES) {
    // Volcanic wastes world marker — dark red with flame icon
    let flicker = Math.sin(tick * 0.08 + x + y) * 0.15 + 0.85;
    c.fillStyle = '#1a0500';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#2a0800';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Flame
    c.fillStyle = `rgba(255,80,0,${0.85 * flicker})`;
    c.fillRect(sx+s/2-4, sy+8, 8, 16);
    c.fillRect(sx+s/2-6, sy+14, 12, 12);
    c.fillStyle = `rgba(255,200,0,${0.7 * flicker})`;
    c.fillRect(sx+s/2-3, sy+10, 6, 10);
    c.fillStyle = `rgba(255,255,200,${0.5 * flicker})`;
    c.fillRect(sx+s/2-1, sy+12, 2, 5);
    // Ember border
    c.fillStyle = `rgba(200,40,0,${0.6 * flicker})`;
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else if (tileType === T.WORLD_FROZEN_PEAKS) {
    // Frozen peaks world marker — ice-blue with snowflake
    c.fillStyle = '#0d2030';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#1a3a50';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Snowflake/ice crystal
    c.fillStyle = '#a8d8ea';
    c.fillRect(sx+s/2-1, sy+6, 2, s-12); // vertical arm
    c.fillRect(sx+6, sy+s/2-1, s-12, 2); // horizontal arm
    c.fillRect(sx+s/2-8, sy+s/2-8, 4, 4); // NW
    c.fillRect(sx+s/2+4, sy+s/2-8, 4, 4); // NE
    c.fillRect(sx+s/2-8, sy+s/2+4, 4, 4); // SW
    c.fillRect(sx+s/2+4, sy+s/2+4, 4, 4); // SE
    // Sparkle center
    c.fillStyle = '#e8f4f8';
    c.fillRect(sx+s/2-2, sy+s/2-2, 4, 4);
    // Ice border
    c.fillStyle = '#1a5c7a';
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else if (tileType === T.WORLD_SHADOW_FOREST) {
    // Shadow forest world marker — near-black with toxic green
    c.fillStyle = '#050808';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#0a1008';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Dead tree silhouette
    c.fillStyle = '#1a2a0a';
    c.fillRect(sx+s/2-2, sy+6, 4, s-14); // trunk
    c.fillRect(sx+s/2-10, sy+10, 8, 3);  // left branch
    c.fillRect(sx+s/2+2, sy+14, 8, 3);   // right branch
    c.fillRect(sx+s/2-6, sy+20, 4, 3);   // lower left
    // Toxic mist glow
    c.fillStyle = 'rgba(20,120,10,0.25)';
    c.fillRect(sx+2, sy+s-10, s-4, 8);
    // Dark green border
    c.fillStyle = 'rgba(10,60,5,0.8)';
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else if (tileType === T.WORLD_DWARF_FORTRESS) {
    // Dwarf fortress world marker — stone grey with anvil
    c.fillStyle = '#1a1a1a';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#282828';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Fortress tower outline
    c.fillStyle = '#5a5a5a';
    c.fillRect(sx+8, sy+10, 10, s-18);  // left tower
    c.fillRect(sx+s-18, sy+10, 10, s-18); // right tower
    c.fillRect(sx+10, sy+s-14, s-20, 10); // base wall
    // Tower battlements
    c.fillRect(sx+8, sy+8, 3, 4); c.fillRect(sx+13, sy+8, 3, 4);
    c.fillRect(sx+s-18, sy+8, 3, 4); c.fillRect(sx+s-13, sy+8, 3, 4);
    // Gate opening
    c.fillStyle = '#0d0d0d';
    c.fillRect(sx+s/2-3, sy+s-14, 6, 8);
    // Gold accent
    c.fillStyle = '#cd9b1d';
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else if (tileType === T.WORLD_AETHORIA) {
    // Ruins of Aethoria world marker — golden ancient temple
    let glow = Math.sin(tick * 0.03 + x*0.5 + y*0.3) * 0.1 + 0.9;
    c.fillStyle = '#1a1408';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#28200e';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Temple pillars
    c.fillStyle = '#8b6914';
    c.fillRect(sx+6, sy+8, 5, s-18);
    c.fillRect(sx+s-11, sy+8, 5, s-18);
    c.fillRect(sx+s/2-3, sy+8, 5, s-18);
    // Temple roof
    c.fillRect(sx+4, sy+8, s-8, 4);
    // Base platform
    c.fillRect(sx+4, sy+s-12, s-8, 4);
    // Divine light
    c.fillStyle = `rgba(220,180,30,${0.2 * glow})`;
    c.fillRect(sx+6, sy+12, s-12, s-22);
    // Golden border
    c.fillStyle = `rgba(200,160,20,${0.7 * glow})`;
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else if (tileType === T.ABYSS_FLOOR) {
    // Void floor with purple shimmer
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#1e1a34' : '#1a1630');
    g.addColorStop(1, h<2 ? '#26223e' : '#22203a');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Void-purple cracks
    c.fillStyle = 'rgba(110,0,180,0.35)';
    if (h===0){c.fillRect(sx+4,sy+s/2,s/2,1);c.fillRect(sx+4,sy+s/2+1,2,5);}
    if (h===1){c.fillRect(sx+s-8,sy+6,1,s/2);c.fillRect(sx+s-9,sy+s/2,5,1);}
    if (h===2){c.fillRect(sx+s/2,sy+4,1,s/2-2);c.fillRect(sx+s/2-3,sy+s/2,5,1);}
    // Void shimmer speck
    let ax = (x*11+y*7)%(s-8), ay = (x*7+y*13)%(s-8);
    c.fillStyle = `rgba(130,0,210,${0.25 + 0.12*Math.sin(tick*0.04+x+y)})`;
    c.fillRect(sx+ax+3, sy+ay+3, 2, 2);
    // Grout lines
    c.fillStyle = 'rgba(0,0,0,0.3)';
    c.fillRect(sx, sy, s, 1);
    c.fillRect(sx, sy, 1, s);
  } else if (tileType === T.ABYSS_WALL) {
    // Void stone wall — deep purple-black with vivid veins
    c.fillStyle = h<2 ? '#0e0e1e' : '#0c0c1a';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = h<2 ? '#1a1636' : '#161230';
    c.fillRect(sx+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+s/2+1, sy+s/2+1, s/2-2, s/2-2);
    c.fillStyle = '#1e103c';
    c.fillRect(sx+s/2+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+1, sy+s/2+1, s/2-2, s/2-2);
    // Purple void veins
    c.fillStyle = 'rgba(130,0,220,0.5)';
    c.fillRect(sx, sy+s/2, s, 1);
    c.fillRect(sx+s/2, sy, 1, s);
    c.fillStyle = 'rgba(160,0,255,0.28)';
    if (h<2) c.fillRect(sx+Math.floor(s/3), sy+1, 1, s/2-2);
    else c.fillRect(sx+Math.floor(2*s/3), sy+s/2+1, 1, s/2-2);
  } else if (tileType === T.VOID_RIFT) {
    // Void rift portal — swirling tear in reality
    let swirl = Math.sin(tick * 0.06 + x*0.8 + y*0.6);
    c.fillStyle = '#020208';
    c.fillRect(sx, sy, s, s);
    // Rift tear body
    c.fillStyle = `rgba(60,0,100,${0.7+swirl*0.2})`;
    c.fillRect(sx+6, sy+4, s-12, s-8);
    // Inner void
    c.fillStyle = `rgba(20,0,40,${0.9+swirl*0.1})`;
    c.fillRect(sx+8, sy+6, s-16, s-12);
    // Purple glow ring
    c.fillStyle = `rgba(160,0,255,${0.5+swirl*0.3})`;
    c.fillRect(sx+4, sy+2, s-8, 3);
    c.fillRect(sx+4, sy+s-5, s-8, 3);
    c.fillRect(sx+2, sy+4, 3, s-8);
    c.fillRect(sx+s-5, sy+4, 3, s-8);
    // Star-like core flicker
    c.fillStyle = `rgba(220,180,255,${0.3+swirl*0.4})`;
    c.fillRect(sx+s/2-2, sy+s/2-2, 4, 4);
    c.fillRect(sx+s/2-1, sy+s/2-4, 2, 8);
    c.fillRect(sx+s/2-4, sy+s/2-1, 8, 2);
  } else if (tileType === T.WORLD_ABYSS) {
    // The Abyss world marker — pitch black with void rift tear
    let pulse = Math.sin(tick * 0.05 + x + y) * 0.2 + 0.8;
    c.fillStyle = '#010104';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#030310';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Rift tear shape
    c.fillStyle = `rgba(80,0,140,${0.8*pulse})`;
    c.fillRect(sx+s/2-4, sy+6, 8, s-12);
    c.fillRect(sx+s/2-7, sy+12, 14, s-24);
    // Void glow core
    c.fillStyle = `rgba(160,0,255,${0.6*pulse})`;
    c.fillRect(sx+s/2-2, sy+s/2-6, 4, 12);
    c.fillStyle = `rgba(220,180,255,${0.4*pulse})`;
    c.fillRect(sx+s/2-1, sy+s/2-2, 2, 4);
    // Dark purple border
    c.fillStyle = `rgba(80,0,120,${0.7*pulse})`;
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else if (tileType === T.SUNKEN_FLOOR) {
    // Flooded ancient stone — deep teal water over submerged tiles
    let shimmer = Math.sin(tick * 0.035 + x * 0.4 + y * 0.3) * 0.12 + 0.88;
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#0a2a3a' : '#091e2e');
    g.addColorStop(1, h<2 ? '#103040' : '#0c2838');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Water shimmer overlay
    c.fillStyle = `rgba(20,90,120,${0.35 * shimmer})`;
    c.fillRect(sx, sy, s, s);
    // Caustic light ripples
    c.fillStyle = `rgba(40,160,180,${0.15 * shimmer})`;
    if (h===0){c.fillRect(sx+3,sy+8,s-6,3); c.fillRect(sx+9,sy+3,3,s-6);}
    if (h===1){c.fillRect(sx+6,sy+s-12,s-12,3); c.fillRect(sx+s-12,sy+6,3,s-12);}
    if (h===2){c.fillRect(sx+s/2-8,sy+s/2-1,16,2); c.fillRect(sx+s/2-1,sy+s/2-8,2,16);}
    // Bioluminescent moss speck
    let bmx = (x*11+y*9)%(s-8), bmy = (x*7+y*13)%(s-8);
    c.fillStyle = `rgba(0,200,160,${0.25 * shimmer})`;
    c.fillRect(sx+bmx+3, sy+bmy+3, 2, 2);
    // Stone grout lines (faint under water)
    c.fillStyle = 'rgba(0,0,0,0.25)';
    c.fillRect(sx, sy, s, 1);
    c.fillRect(sx, sy, 1, s);
  } else if (tileType === T.SUNKEN_WALL) {
    // Ancient submerged stone wall — dark teal-grey with water-worn texture
    c.fillStyle = h<2 ? '#091820' : '#07141c';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = h<2 ? '#112030' : '#0e1a28';
    c.fillRect(sx+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+s/2+1, sy+s/2+1, s/2-2, s/2-2);
    c.fillStyle = '#0c1e2c';
    c.fillRect(sx+s/2+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+1, sy+s/2+1, s/2-2, s/2-2);
    // Teal water seam
    c.fillStyle = 'rgba(20,90,120,0.5)';
    c.fillRect(sx, sy+s/2, s, 1);
    c.fillRect(sx+s/2, sy, 1, s);
    // Bioluminescent moss streak
    c.fillStyle = 'rgba(0,160,130,0.22)';
    if (h<2) c.fillRect(sx+Math.floor(s/3), sy+1, 1, s/2-2);
    else c.fillRect(sx+Math.floor(2*s/3), sy+s/2+1, 1, s/2-2);
  } else if (tileType === T.WORLD_SUNKEN_TEMPLE) {
    // Sunken Temple world marker — deep blue with submerged ruin silhouette
    let ripple = Math.sin(tick * 0.04 + x * 0.6 + y * 0.4) * 0.12 + 0.88;
    c.fillStyle = '#030c12';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#071626';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Water fill
    c.fillStyle = '#091e30';
    c.fillRect(sx+3, sy+3, s-6, s-6);
    // Sunken pillars
    c.fillStyle = '#1a4a5a';
    c.fillRect(sx+6, sy+10, 5, s-18);
    c.fillRect(sx+s-11, sy+10, 5, s-18);
    c.fillRect(sx+s/2-3, sy+12, 5, s-22);
    // Ruined roof
    c.fillRect(sx+4, sy+10, s-8, 4);
    // Shimmer water overlay
    c.fillStyle = `rgba(20,90,140,${0.4 * ripple})`;
    c.fillRect(sx+3, sy+3, s-6, s-6);
    // Caustic highlights
    c.fillStyle = `rgba(40,160,200,${0.15 * ripple})`;
    c.fillRect(sx+5, sy+14, s-10, 2);
    c.fillRect(sx+7, sy+22, s-14, 1);
    // Teal border
    c.fillStyle = `rgba(20,90,140,0.7)`;
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else if (tileType === T.HELL_FLOOR) {
    // Hellfire floor — red stone with glowing cracks
    let glow = Math.sin(tick * 0.05 + x * 0.5 + y * 0.4) * 0.15 + 0.85;
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, '#320e0e');
    g.addColorStop(1, '#3e1414');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Glowing brimstone cracks
    c.fillStyle = `rgba(210,50,0,${0.6 * glow})`;
    let cx1 = (x*7+y*3) % (s-8) + 4, cy1 = (x*3+y*11) % (s-8) + 4;
    c.fillRect(sx+cx1, sy+cy1, 2, 1);
    c.fillRect(sx+cx1+1, sy+cy1+1, 1, 2);
    c.fillStyle = `rgba(255,100,0,${0.45 * glow})`;
    let cx2 = (x*11+y*5) % (s-10) + 5, cy2 = (x*5+y*7) % (s-10) + 5;
    c.fillRect(sx+cx2, sy+cy2, 3, 1);
    // Stone tile grout lines
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.fillRect(sx, sy, s, 1);
    c.fillRect(sx, sy, 1, s);
  } else if (tileType === T.HELL_WALL) {
    // Hellfire wall — dark volcanic stone with embedded embers
    c.fillStyle = '#1c0606';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#2a0e0e';
    c.fillRect(sx+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+s/2+1, sy+s/2+1, s/2-2, s/2-2);
    c.fillStyle = '#220a0a';
    c.fillRect(sx+s/2+1, sy+1, s/2-2, s/2-2);
    c.fillRect(sx+1, sy+s/2+1, s/2-2, s/2-2);
    // Mortar lines
    c.fillStyle = '#120404';
    c.fillRect(sx+s/2, sy, 1, s);
    c.fillRect(sx, sy+s/2, s, 1);
    // Ember dots
    let pulse = Math.sin(tick * 0.06 + x * 0.9 + y * 1.1) * 0.3 + 0.7;
    c.fillStyle = `rgba(230,70,0,${0.75 * pulse})`;
    let ex = (x*13+y*7) % (s-6) + 3, ey = (x*7+y*13) % (s-6) + 3;
    c.fillRect(sx+ex, sy+ey, 2, 2);
  } else if (tileType === T.WORLD_UNDERWORLD) {
    // Underworld world marker — hellfire iron gate icon
    let flicker = Math.sin(tick * 0.07 + x * 0.5 + y * 0.5) * 0.2 + 0.8;
    // Background
    c.fillStyle = '#0a0000';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#150303';
    c.fillRect(sx+2, sy+2, s-4, s-4);
    // Gate posts
    c.fillStyle = '#3a1010';
    c.fillRect(sx+5, sy+8, 6, s-14);
    c.fillRect(sx+s-11, sy+8, 6, s-14);
    // Gate crossbar
    c.fillRect(sx+5, sy+12, s-10, 4);
    // Hellfire glow from gate
    c.fillStyle = `rgba(200,40,0,${0.5 * flicker})`;
    c.fillRect(sx+11, sy+16, s-22, s-24);
    // Spikes on top
    c.fillStyle = '#4a1a1a';
    c.fillRect(sx+7,  sy+6, 3, 4);
    c.fillRect(sx+s-10, sy+6, 3, 4);
    c.fillRect(sx+s/2-2, sy+5, 3, 5);
    // Red border
    c.fillStyle = `rgba(160,20,0,${0.8 * flicker})`;
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx+s-2, sy, 2, s);
  } else {
    return false;
  }
  return true;
}
