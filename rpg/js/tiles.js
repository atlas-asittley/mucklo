// tiles.js — Tile rendering: draws all tile types onto the game canvas.
// Covers: grass, wall/floor (dungeon + town), path, water, door, chest, stairs, sign,
//         sparring ring, gate, world map markers (town/Dragon's Gate/Elven Town/Rogue's Cove),
//         world boss markers (WORLD_BOSS_DRAGON/GOLEM/HYDRA), forest, mountain,
//         elven tiles (wall/floor/path/moonwell/Tree of Life), Dragon's Gate fortress tiles
//         (DG_WALL/DG_FLOOR), and Rogue's Cove tiles (WOOD_WALL/PLANK_FLOOR/SAND/DOCK/TAVERN_SIGN).
// New area tiles (LAVA through WORLD_AETHORIA) are delegated to drawAreaTile() in tiles_areas.js.
// Depends on: constants.js (TILE, T), state.js (tick), tiles_areas.js (drawAreaTile).

function drawTile(c, sx, sy, tileType, x, y, isDungeon) {
  const s = TILE;
  // Checkerboard variation hash
  let h = (x * 7 + y * 13) % 4;

  if (tileType === T.GRASS) {
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#1e4a1c' : '#235120');
    g.addColorStop(0.5, h<2 ? '#245522' : '#296024');
    g.addColorStop(1, h<2 ? '#2a5e26' : '#31682c');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Darker micro-variation patch
    let hv = (x*13+y*7)%8;
    if (hv < 2) { c.fillStyle = 'rgba(0,20,0,0.08)'; c.fillRect(sx+8, sy+8, 16, 16); }
    // Pixel grass tufts — positions proportional to tile size
    let ts = Math.floor(s / 32); // scale factor relative to 32px base
    c.fillStyle = 'rgba(28,72,24,0.55)';
    let b1 = Math.floor(s*0.12), b2 = Math.floor(s*0.19), b3 = Math.floor(s*0.62), b4 = Math.floor(s*0.69);
    let b5 = Math.floor(s*0.38), b6 = Math.floor(s*0.5), b7 = Math.floor(s*0.75), b8 = Math.floor(s*0.81);
    if (h === 0) { c.fillRect(sx+b1, sy+b2, 2+ts, 4+ts); c.fillRect(sx+b2, sy+b1, 2+ts, 5+ts); c.fillRect(sx+b1+1,sy+b1,1,2+ts); }
    if (h === 1) { c.fillRect(sx+b3, sy+b2, 2+ts, 4+ts); c.fillRect(sx+b4, sy+b1, 2+ts, 6+ts); c.fillRect(sx+b3+1,sy+b1,1,2+ts); }
    if (h === 2) { c.fillRect(sx+b5, sy+b6, 2+ts, 4+ts); c.fillRect(sx+b6, sy+b5, 2+ts, 6+ts); c.fillRect(sx+b5+1,sy+b5,1,2+ts); }
    if (h === 3) { c.fillRect(sx+b7, sy+b8, 2+ts, 4+ts); c.fillRect(sx+b8, sy+b7, 2+ts, 4+ts); c.fillRect(sx+b7+1,sy+b7,1,2+ts); }
    // Secondary sparse blades in opposite corner
    c.fillStyle = 'rgba(34,85,28,0.35)';
    if (h === 0) { c.fillRect(sx+b7, sy+b8, 1+ts, 3+ts); }
    if (h === 1) { c.fillRect(sx+b1, sy+b8, 1+ts, 3+ts); }
    if (h === 2) { c.fillRect(sx+b7, sy+b1, 1+ts, 3+ts); }
    if (h === 3) { c.fillRect(sx+b1, sy+b1, 1+ts, 3+ts); }
    // Bright specks
    c.fillStyle = 'rgba(80,160,55,0.18)';
    let lx = (x*11+y*7)%(s-6), ly = (x*5+y*17)%(s-6);
    c.fillRect(sx+lx+3, sy+ly+3, 1, 1);
  } else if (tileType === T.WALL) {
    if (isDungeon) {
      // Dungeon stone block
      c.fillStyle = '#18183a';
      c.fillRect(sx, sy, s, s);
      let bh = Math.floor(s / 2);
      c.fillStyle = h < 2 ? '#24244e' : '#20204a';
      c.fillRect(sx+1, sy+1, s-2, bh-2);
      c.fillStyle = h < 2 ? '#20204a' : '#24244e';
      c.fillRect(sx+1, sy+bh+1, s-2, bh-2);
      // Mortar lines (no outer border to avoid grid look)
      c.fillStyle = '#10102a';
      c.fillRect(sx, sy + bh, s, 1);
      c.fillStyle = '#12122e';
      if (h < 2) c.fillRect(sx + Math.floor(s/3), sy+1, 1, bh-2);
      else c.fillRect(sx + Math.floor(2*s/3), sy+bh+1, 1, bh-2);
    } else {
      // Town stone block
      c.fillStyle = '#282828';
      c.fillRect(sx, sy, s, s);
      c.fillStyle = h<2 ? '#323232' : '#2e2e2e';
      c.fillRect(sx+1, sy+1, s/2-2, s/2-2);
      c.fillRect(sx+s/2+1, sy+s/2+1, s/2-2, s/2-2);
      c.fillStyle = '#3a3a3a';
      c.fillRect(sx+s/2+1, sy+1, s/2-2, s/2-2);
      c.fillRect(sx+1, sy+s/2+1, s/2-2, s/2-2);
      c.fillStyle = '#1a1a1a';
      c.fillRect(sx, sy+s/2, s, 1); c.fillRect(sx+s/2, sy, 1, s);
    }
  } else if (tileType === T.FLOOR) {
    if (isDungeon) {
      let g = c.createLinearGradient(sx,sy,sx,sy+s);
      g.addColorStop(0, h<2?'#302858':'#2c2450');
      g.addColorStop(1, h<2?'#28204c':'#241c44');
      c.fillStyle = g;
      c.fillRect(sx, sy, s, s);
      c.fillStyle = 'rgba(255,255,255,0.06)';
      if (h===0){c.fillRect(sx+2,sy+2,s/2-3,1);c.fillRect(sx+2,sy+2,1,s/2-3);}
      if (h===2){c.fillRect(sx+s/2+1,sy+s/2+2,s/2-3,1);}
    } else {
      let g = c.createLinearGradient(sx,sy,sx+s,sy+s);
      g.addColorStop(0, h<2?'#5a4228':'#524020');
      g.addColorStop(1, h<2?'#6a5030':'#604828');
      c.fillStyle = g;
      c.fillRect(sx, sy, s, s);
      c.fillStyle = 'rgba(0,0,0,0.15)';
      if (h===1){c.fillRect(sx,sy+s/2,s,1);}
      if (h===2){c.fillRect(sx+s/2,sy,1,s);}
    }
  } else if (tileType === T.PATH) {
    let g = c.createLinearGradient(sx,sy,sx,sy+s);
    g.addColorStop(0, '#7a6a44');
    g.addColorStop(1, '#6a5a38');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Stone slab crack lines — varied per hash so no uniform grid
    c.fillStyle = 'rgba(0,0,0,0.13)';
    if (h===0) { c.fillRect(sx, sy+Math.floor(s*0.4), Math.floor(s*0.6), 1); c.fillRect(sx+Math.floor(s*0.6), sy+Math.floor(s*0.7), Math.floor(s*0.4), 1); }
    if (h===1) { c.fillRect(sx+Math.floor(s*0.3), sy, 1, Math.floor(s*0.55)); c.fillRect(sx, sy+Math.floor(s*0.55), Math.floor(s*0.7), 1); }
    if (h===2) { c.fillRect(sx, sy+Math.floor(s*0.35), s, 1); c.fillRect(sx+Math.floor(s*0.5), sy+Math.floor(s*0.35), 1, Math.floor(s*0.4)); }
    if (h===3) { c.fillRect(sx+Math.floor(s*0.65), sy, 1, Math.floor(s*0.45)); c.fillRect(sx, sy+Math.floor(s*0.6), Math.floor(s*0.65), 1); }
    c.fillStyle = 'rgba(255,255,200,0.04)';
    c.fillRect(sx+1,sy+1,s-2,1);
  } else if (tileType === T.WATER) {
    let wave = Math.sin((tick*0.04) + x*0.5 + y*0.3) * 0.15 + 0.85;
    let shimmer = Math.sin((tick*0.08)+x*0.9+y*0.7);
    let g = c.createLinearGradient(sx,sy,sx,sy+s);
    g.addColorStop(0, `rgba(20,68,${Math.floor(138*wave)},1)`);
    g.addColorStop(0.5, `rgba(12,46,${Math.floor(105*wave)},1)`);
    g.addColorStop(1, `rgba(7,32,${Math.floor(80*wave)},1)`);
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Scrolling wave line
    let wa = Math.floor((tick*1.4 + x*14 + y*9) % s);
    c.fillStyle = `rgba(130,210,255,${0.1+shimmer*0.07})`;
    c.fillRect(sx+2, sy+wa, s-4, 1);
    // Static shimmer lines (proportional positions)
    c.fillStyle = `rgba(100,190,255,${0.07+shimmer*0.05})`;
    c.fillRect(sx+5, sy+Math.floor(s*0.18), s-12, 2);
    c.fillRect(sx+3, sy+Math.floor(s*0.5), s-8, 1);
    c.fillRect(sx+7, sy+Math.floor(s*0.75), s-14, 1);
    // Foam sparkle
    if (shimmer > 0.55) {
      c.fillStyle = `rgba(200,240,255,${(shimmer-0.55)*0.5})`;
      c.fillRect(sx+((x*7+y*5)%18)+3, sy+((x*3+y*11)%18)+3, 2, 2);
    }
  } else if (tileType === T.DOOR) {
    c.fillStyle = '#3a2010';
    c.fillRect(sx, sy, s, s);
    // Door frame
    c.fillStyle = '#1a1008';
    c.fillRect(sx, sy, 3, s); c.fillRect(sx+s-3, sy, 3, s);
    c.fillRect(sx, sy, s, 3);
    // Door panel
    c.fillStyle = '#5a3518';
    c.fillRect(sx+3, sy+3, s-6, s-3);
    c.fillStyle = '#7a4e28';
    c.fillRect(sx+5, sy+5, s-10, (s-8)/2);
    // Knob
    c.fillStyle = '#d4a020';
    c.fillRect(sx+s-8, sy+s/2-1, 3, 3);
  } else if (tileType === T.CHEST) {
    drawChestTile(c, sx, sy);
  } else if (tileType === T.STAIRS_DOWN) {
    c.fillStyle = '#1a1828';
    c.fillRect(sx, sy, s, s);
    // Spiral stair steps
    c.fillStyle = '#2a2840';
    for (let i = 0; i < 4; i++) {
      c.fillRect(sx+4+i*4, sy+6+i*5, s-8-i*4, 3);
    }
    c.fillStyle = '#4a4868';
    c.fillRect(sx+s/2-5, sy+s-8, 10, 3);
    // Down arrow
    c.fillStyle = 'rgba(160,140,220,0.7)';
    c.beginPath();
    c.moveTo(sx+s/2, sy+s-3); c.lineTo(sx+s/2-5, sy+s-10); c.lineTo(sx+s/2+5, sy+s-10);
    c.fill();
  } else if (tileType === T.STAIRS_UP) {
    c.fillStyle = '#1a1828';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#2a2840';
    for (let i = 3; i >= 0; i--) {
      c.fillRect(sx+4+(3-i)*4, sy+6+i*5, s-8-(3-i)*4, 3);
    }
    c.fillStyle = '#4a4868';
    c.fillRect(sx+s/2-5, sy+4, 10, 3);
    c.fillStyle = 'rgba(160,220,160,0.7)';
    c.beginPath();
    c.moveTo(sx+s/2, sy+4); c.lineTo(sx+s/2-5, sy+11); c.lineTo(sx+s/2+5, sy+11);
    c.fill();
  } else if (tileType === T.SIGN) {
    // Draw underlying grass first
    drawTile(c, sx, sy, T.GRASS, x, y, false);
    // Post
    c.fillStyle = '#5a3010';
    c.fillRect(sx+s/2-1, sy+s/2, 3, s/2);
    // Sign board
    c.fillStyle = '#7a5020';
    c.fillRect(sx+4, sy+8, s-8, 10);
    c.fillStyle = '#9a6830';
    c.fillRect(sx+5, sy+9, s-10, 8);
    // Text lines
    c.fillStyle = '#3a2010';
    c.fillRect(sx+7, sy+11, s-14, 1);
    c.fillRect(sx+7, sy+13, s-18, 1);
  } else if (tileType === T.RING) {
    // Sparring ring — sandy arena floor with rope border
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h < 2 ? '#c09848' : '#b88840');
    g.addColorStop(1, h < 2 ? '#a07830' : '#987028');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Sand texture specks
    c.fillStyle = 'rgba(200,160,70,0.2)';
    let lx2 = (x*11+y*7)%(s-8), ly2 = (x*5+y*17)%(s-8);
    c.fillRect(sx+lx2+4, sy+ly2+4, 4, 2);
    c.fillRect(sx+((x*3+y*9)%(s-8))+4, sy+((x*7+y*3)%(s-8))+4, 2, 3);
    // Rope border on all 4 sides (adjacent tiles merge into continuous ring boundary)
    c.fillStyle = '#5a2e08';
    c.fillRect(sx, sy, s, 3);
    c.fillRect(sx, sy+s-3, s, 3);
    c.fillRect(sx, sy, 3, s);
    c.fillRect(sx+s-3, sy, 3, s);
    // Rope highlight
    c.fillStyle = '#8a5020';
    c.fillRect(sx+1, sy+1, s-2, 1);
    c.fillRect(sx+1, sy+s-2, s-2, 1);
    c.fillRect(sx+1, sy+1, 1, s-2);
    c.fillRect(sx+s-2, sy+1, 1, s-2);
  } else if (tileType === T.GATE) {
    // Underlying path
    drawTile(c, sx, sy, T.PATH, x, y, false);
    // Stone pillars
    c.fillStyle = '#4a4a5a';
    c.fillRect(sx, sy, 6, s);
    c.fillRect(sx+s-6, sy, 6, s);
    c.fillStyle = '#6a6a7a';
    c.fillRect(sx+1, sy+2, 4, s-4);
    c.fillRect(sx+s-5, sy+2, 4, s-4);
    // Arch top bar
    c.fillStyle = '#3a3a4a';
    c.fillRect(sx+6, sy, s-12, 8);
    c.fillStyle = '#5a5a6a';
    c.fillRect(sx+7, sy+1, s-14, 6);
    // Golden gate text indicator
    c.fillStyle = 'rgba(255,220,60,0.7)';
    c.fillRect(sx+s/2-4, sy+2, 8, 4);
  } else if (tileType === T.WORLD_TOWN) {
    // Green base
    c.fillStyle = '#2a5a20';
    c.fillRect(sx, sy, s, s);
    // Building silhouette
    c.fillStyle = '#c09050';
    c.fillRect(sx+8, sy+14, s-16, s-18);
    // Roof
    c.fillStyle = '#8b3a3a';
    c.beginPath(); c.moveTo(sx+s/2, sy+6); c.lineTo(sx+6, sy+16); c.lineTo(sx+s-6, sy+16); c.fill();
    // Door
    c.fillStyle = '#3a2010';
    c.fillRect(sx+s/2-3, sy+s-12, 7, 10);
    // Windows
    c.fillStyle = '#f0d060';
    c.fillRect(sx+10, sy+18, 6, 5);
    c.fillRect(sx+s-16, sy+18, 6, 5);
    // Glow dot
    c.fillStyle = 'rgba(255,240,100,0.3)';
    c.fillRect(sx+4, sy+4, s-8, s-8);
  } else if (tileType === T.WORLD_DUNGEON) {
    // Dark stone base
    c.fillStyle = '#1a1420';
    c.fillRect(sx, sy, s, s);
    // Stone arch entrance
    c.fillStyle = '#2e2838';
    c.fillRect(sx+4, sy+10, s-8, s-10);
    c.fillStyle = '#3a3448';
    c.fillRect(sx+6, sy+12, s-12, s-12);
    // Dark mouth
    c.fillStyle = '#08060e';
    c.fillRect(sx+10, sy+18, s-20, s-20);
    // Arch keystone
    c.fillStyle = '#4a4460';
    c.fillRect(sx+s/2-2, sy+8, 5, 5);
    // Red glow from entrance
    c.fillStyle = 'rgba(180,20,20,0.25)';
    c.fillRect(sx+10, sy+18, s-20, s-20);
    // Skull decoration
    c.fillStyle = 'rgba(200,180,220,0.5)';
    c.fillRect(sx+s/2-3, sy+13, 6, 4);
    c.fillRect(sx+s/2-2, sy+17, 4, 2);
  } else if (tileType === T.FOREST) {
    // Darker grass base
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#143010' : '#182e0e');
    g.addColorStop(1, h<2 ? '#1a3a14' : '#1e3a12');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Tree canopy blobs
    let treeCol = h < 2 ? '#0f5020' : '#146020';
    c.fillStyle = treeCol;
    let tx = sx + ((x*7+y*3)%3)*4 + 4;
    let ty = sy + ((x*3+y*11)%3)*3 + 3;
    c.fillRect(tx, ty, 16, 14);
    c.fillRect(tx+4, ty-4, 9, 5);
    c.fillRect(tx-3, ty+4, 5, 8);
    c.fillRect(tx+14, ty+2, 5, 9);
    // Tree trunk
    c.fillStyle = '#5a3010';
    c.fillRect(tx+6, ty+13, 4, 8);
    // Second smaller tree
    let tx2 = sx + s - 14 - ((x*11+y*5)%6);
    let ty2 = sy + 6 + ((x*5+y*7)%8);
    c.fillStyle = h < 2 ? '#0d4a1c' : '#125818';
    c.fillRect(tx2, ty2, 11, 10);
    c.fillRect(tx2+2, ty2-3, 6, 4);
    c.fillStyle = '#5a3010';
    c.fillRect(tx2+4, ty2+9, 3, 6);
  } else if (tileType === T.WORLD_ELVEN_TOWN) {
    // Silver-green elven base
    c.fillStyle = '#1a3a20';
    c.fillRect(sx, sy, s, s);
    // Elven spire trunk
    c.fillStyle = '#b0c8a0';
    c.fillRect(sx+s/2-2, sy+s-16, 4, 14);
    // Spire tip
    c.fillStyle = '#d8f0c0';
    c.beginPath(); c.moveTo(sx+s/2, sy+4); c.lineTo(sx+s/2-8, sy+18); c.lineTo(sx+s/2+8, sy+18); c.fill();
    // Mid canopy ring
    c.fillStyle = '#60b050';
    c.beginPath(); c.moveTo(sx+s/2, sy+12); c.lineTo(sx+s/2-10, sy+24); c.lineTo(sx+s/2+10, sy+24); c.fill();
    // Lower canopy ring
    c.fillStyle = '#50a040';
    c.beginPath(); c.moveTo(sx+s/2, sy+20); c.lineTo(sx+s/2-13, sy+34); c.lineTo(sx+s/2+13, sy+34); c.fill();
    // Silver glow overlay
    c.fillStyle = 'rgba(200,255,180,0.18)';
    c.fillRect(sx+4, sy+4, s-8, s-8);
    // Star accents
    c.fillStyle = 'rgba(220,255,200,0.7)';
    c.fillRect(sx+8, sy+6, 2, 2);
    c.fillRect(sx+s-10, sy+8, 2, 2);
  } else if (tileType === T.MOUNTAIN) {
    // Rocky gray base
    c.fillStyle = h < 2 ? '#383838' : '#303030';
    c.fillRect(sx, sy, s, s);
    // Snow cap
    c.fillStyle = '#d0d8e0';
    c.beginPath();
    c.moveTo(sx+s/2, sy+2);
    c.lineTo(sx+s/2-10, sy+16);
    c.lineTo(sx+s/2+10, sy+16);
    c.fill();
    // Rock face shading
    c.fillStyle = '#202020';
    c.beginPath();
    c.moveTo(sx+s/2, sy+2);
    c.lineTo(sx+s/2-10, sy+16);
    c.lineTo(sx+s/2+4, sy+10);
    c.fill();
    // Second peak offset by hash
    if (h < 2) {
      c.fillStyle = '#484848';
      c.beginPath();
      c.moveTo(sx+s/2+10, sy+8);
      c.lineTo(sx+s/2+2, sy+22);
      c.lineTo(sx+s-4, sy+22);
      c.fill();
      c.fillStyle = 'rgba(208,216,224,0.6)';
      c.beginPath();
      c.moveTo(sx+s/2+10, sy+8);
      c.lineTo(sx+s/2+4, sy+16);
      c.lineTo(sx+s/2+16, sy+16);
      c.fill();
    }
    // Rock cracks
    c.fillStyle = '#181818';
    c.fillRect(sx+6, sy+s-10, 1, 8);
    c.fillRect(sx+s-10, sy+s-14, 1, 10);
  } else if (tileType === T.ELVEN_WALL) {
    // Silver-white elven wall with green trim and gold corner accents
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#d8dce8' : '#ccd0de');
    g.addColorStop(1, h<2 ? '#c8ccda' : '#bec2ce');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Green trim strips along all edges
    c.fillStyle = '#4a8850';
    c.fillRect(sx, sy, s, 2);
    c.fillRect(sx, sy+s-2, s, 2);
    c.fillRect(sx, sy+2, 2, s-4);
    c.fillRect(sx+s-2, sy+2, 2, s-4);
    // Subtle panel bevel shadow
    c.fillStyle = 'rgba(0,0,0,0.07)';
    c.fillRect(sx+2, sy+s-4, s-4, 2);
    c.fillRect(sx+s-4, sy+2, 2, s-4);
    // Gold corner accents
    c.fillStyle = '#d4af37';
    c.fillRect(sx, sy, 4, 4);
    c.fillRect(sx+s-4, sy, 4, 4);
    c.fillRect(sx, sy+s-4, 4, 4);
    c.fillRect(sx+s-4, sy+s-4, 4, 4);
    // Silver highlight top-left
    c.fillStyle = 'rgba(255,255,255,0.18)';
    c.fillRect(sx+2, sy+2, s-4, 2);
    c.fillRect(sx+2, sy+4, 2, s-6);
  } else if (tileType === T.ELVEN_FLOOR) {
    // Pale cream-silver floor with subtle rune pattern
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#e4e0d2' : '#dcd8c8');
    g.addColorStop(1, h<2 ? '#d8d4c2' : '#d0ccba');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Rune diamond pattern on alternating tiles
    if (h === 0) {
      c.fillStyle = 'rgba(190,165,80,0.22)';
      c.fillRect(sx+s/2-1, sy+5, 2, s-10); // vertical bar
      c.fillRect(sx+5, sy+s/2-1, s-10, 2); // horizontal bar
      c.fillStyle = 'rgba(190,165,80,0.13)';
      c.fillRect(sx+5, sy+5, s-10, 1);
      c.fillRect(sx+5, sy+s-6, s-10, 1);
    }
    // Silver grout lines between tiles
    c.fillStyle = 'rgba(170,175,195,0.28)';
    c.fillRect(sx, sy, s, 1);
    c.fillRect(sx, sy, 1, s);
  } else if (tileType === T.ELVEN_PATH) {
    // Silver-gray stone with moss patches
    let g = c.createLinearGradient(sx, sy, sx, sy+s);
    g.addColorStop(0, h<2 ? '#8a9098' : '#808890');
    g.addColorStop(1, h<2 ? '#787e86' : '#707880');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Moss patches (deterministic per tile)
    let mx = (x*9+y*5)%(s-10)+4, my = (x*5+y*11)%(s-10)+4;
    c.fillStyle = 'rgba(55,110,48,0.38)';
    c.fillRect(sx+mx, sy+my, 5, 3);
    if (h===0) c.fillRect(sx+3, sy+6, 4, 3);
    if (h===2) c.fillRect(sx+s-9, sy+s-10, 6, 4);
    if (h===3) c.fillRect(sx+4, sy+s-7, 5, 3);
    // Stone slab division lines
    c.fillStyle = 'rgba(40,50,60,0.2)';
    if (h===0||h===2) c.fillRect(sx, sy+Math.floor(s*0.5), s, 1);
    if (h===1||h===3) c.fillRect(sx+Math.floor(s*0.5), sy, 1, s);
    // Silver sheen highlight
    c.fillStyle = 'rgba(200,210,225,0.13)';
    c.fillRect(sx+1, sy+1, s-2, 2);
  } else if (tileType === T.MOONWELL) {
    // Magical crystal pool — animated silver-blue shimmer
    let shimmer = Math.sin(tick * 0.05 + x*0.7 + y*0.4);
    let ripple  = Math.sin(tick * 0.03 + x*0.3 + y*0.8);
    // Silver stone rim
    c.fillStyle = '#a0aab8';
    c.fillRect(sx, sy, s, s);
    c.fillStyle = '#8a9098';
    c.fillRect(sx+3, sy+3, s-6, s-6);
    // Crystal water
    let gw = c.createLinearGradient(sx, sy, sx, sy+s);
    gw.addColorStop(0, `rgba(148,188,228,${0.85+shimmer*0.1})`);
    gw.addColorStop(0.5, `rgba(108,158,210,${0.9+shimmer*0.08})`);
    gw.addColorStop(1, `rgba(80,128,188,${0.85+shimmer*0.1})`);
    c.fillStyle = gw;
    c.fillRect(sx+4, sy+4, s-8, s-8);
    // Animated ripple rings
    c.fillStyle = `rgba(220,240,255,${0.18+ripple*0.1})`;
    c.fillRect(sx+7, sy+7, s-14, 1);
    c.fillRect(sx+7, sy+s-8, s-14, 1);
    c.fillRect(sx+7, sy+7, 1, s-14);
    c.fillRect(sx+s-8, sy+7, 1, s-14);
    // Magical glow center
    c.fillStyle = `rgba(190,225,255,${0.32+shimmer*0.2})`;
    c.fillRect(sx+s/2-3, sy+s/2-3, 6, 6);
    // Silver sparkle
    c.fillStyle = `rgba(235,245,255,${0.65+shimmer*0.3})`;
    c.fillRect(sx+s/2-1, sy+s/2-1, 2, 2);
    // Gold star accent (moonwell magic)
    c.fillStyle = `rgba(212,175,55,${0.4+shimmer*0.25})`;
    c.fillRect(sx+s/2-1, sy+5, 2, 2);
    c.fillRect(sx+5, sy+s/2-1, 2, 2);
    c.fillRect(sx+s/2-1, sy+s-7, 2, 2);
    c.fillRect(sx+s-7, sy+s/2-1, 2, 2);
  } else if (tileType === T.TREE_OF_LIFE) {
    // Grand elven monument — golden canopy, silver trunk, glowing aura
    let glow    = Math.sin(tick * 0.04 + x*0.5 + y*0.3) * 0.12 + 0.88;
    let shimmer = Math.sin(tick * 0.07 + x*0.8 + y*0.6);
    // Dark mossy ground base
    c.fillStyle = '#1c3810';
    c.fillRect(sx, sy, s, s);
    // Gold-green glow halo on ground
    c.fillStyle = `rgba(170,220,70,${0.14*glow})`;
    c.fillRect(sx, sy, s, s);
    // Silver-bark trunk (center column)
    c.fillStyle = '#b8c4cc';
    c.fillRect(sx+s/2-4, sy+s/2, 8, s/2);
    c.fillStyle = '#9aaab4';
    c.fillRect(sx+s/2-3, sy+s/2+3, 6, s/2-5);
    // Bark texture line
    c.fillStyle = 'rgba(80,100,110,0.35)';
    c.fillRect(sx+s/2-1, sy+s/2, 1, s/2);
    // Canopy — layered golden-green
    let cr = Math.floor(55*glow), cg = Math.floor(165*glow), cb = Math.floor(55*glow);
    c.fillStyle = `rgba(${cr},${cg},${cb},0.96)`;
    c.fillRect(sx+3, sy+1, s-6, s/2+2);
    c.fillRect(sx+1, sy+6, s-2, s/2-2);
    // Gold leaf highlights scattered
    c.fillStyle = '#d4af37';
    c.fillRect(sx+5, sy+3, 10, 4);
    c.fillRect(sx+s-16, sy+5, 9, 4);
    c.fillRect(sx+s/2-5, sy+1, 10, 3);
    c.fillRect(sx+6, sy+s/2-4, 7, 3);
    c.fillRect(sx+s-13, sy+s/2-6, 7, 3);
    // Silver leaf shimmer
    c.fillStyle = `rgba(210,230,255,${0.18+shimmer*0.1})`;
    c.fillRect(sx+1, sy+1, s-2, s/2+3);
    // Floating magic motes
    c.fillStyle = `rgba(255,248,160,${0.55*glow})`;
    c.fillRect(sx+((x*7+y*3)%Math.floor(s*0.7))+3, sy+((x*3+y*11)%Math.floor(s*0.5))+2, 2, 2);
    c.fillRect(sx+((x*11+y*7)%Math.floor(s*0.6))+5, sy+((x*5+y*9)%Math.floor(s*0.6))+3, 1, 1);
  } else if (tileType === T.WORLD_DRAGONS_GATE) {
    // Dark fortress base
    c.fillStyle = '#110808';
    c.fillRect(sx, sy, s, s);
    // Outer fortress walls
    c.fillStyle = '#2a2020';
    c.fillRect(sx+3, sy+3, s-6, s-6);
    // Battlements (3 merlons across the top)
    c.fillStyle = '#333030';
    for (let i = 0; i < 3; i++) { c.fillRect(sx+5+i*11, sy+3, 7, 7); }
    // Gate arch (dark mouth)
    c.fillStyle = '#060404';
    c.fillRect(sx+s/2-5, sy+s-16, 11, 14);
    // Red glow from gate entrance
    c.fillStyle = 'rgba(139,0,0,0.55)';
    c.fillRect(sx+s/2-4, sy+s-15, 9, 12);
    // Red torch accents on wall face
    c.fillStyle = '#8b0000';
    c.fillRect(sx+7, sy+s-18, 2, 5);
    c.fillRect(sx+s-9, sy+s-18, 2, 5);
    // Flame tips
    c.fillStyle = 'rgba(255,100,0,0.7)';
    c.fillRect(sx+7, sy+s-20, 2, 3);
    c.fillRect(sx+s-9, sy+s-20, 2, 3);
    // Red glow overlay
    c.fillStyle = 'rgba(139,0,0,0.09)';
    c.fillRect(sx+3, sy+3, s-6, s-6);
  } else if (tileType === T.DG_WALL) {
    // Dragon's Gate fortress wall — dark charcoal stone with dark red mortar
    c.fillStyle = h < 2 ? '#1a1212' : '#161010';
    c.fillRect(sx, sy, s, s);
    let bh = Math.floor(s / 2);
    // Upper stone block
    c.fillStyle = h < 2 ? '#2c2020' : '#282020';
    c.fillRect(sx+1, sy+1, s-2, bh-2);
    // Lower stone block
    c.fillStyle = h < 2 ? '#282020' : '#241c1c';
    c.fillRect(sx+1, sy+bh+1, s-2, bh-2);
    // Dark red mortar lines
    c.fillStyle = '#3a0808';
    c.fillRect(sx, sy+bh, s, 1);
    if (h < 2) c.fillRect(sx+Math.floor(s/3), sy+1, 1, bh-2);
    else c.fillRect(sx+Math.floor(2*s/3), sy+bh+1, 1, bh-2);
    // Subtle red edge glow
    c.fillStyle = 'rgba(139,0,0,0.05)';
    c.fillRect(sx+1, sy+1, s-2, 1);
  } else if (tileType === T.DG_FLOOR) {
    // Dragon's Gate fortress floor — dark stone with warm red-brown tint
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#201616' : '#1c1414');
    g.addColorStop(1, h<2 ? '#181010' : '#160e0e');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Stone slab division lines
    c.fillStyle = 'rgba(80,0,0,0.1)';
    if (h===1) c.fillRect(sx, sy+Math.floor(s*0.5), s, 1);
    if (h===2) c.fillRect(sx+Math.floor(s*0.5), sy, 1, s);
    // Subtle highlight
    c.fillStyle = 'rgba(255,255,255,0.02)';
    c.fillRect(sx+1, sy+1, s-2, 1);
  } else if (tileType === T.WORLD_BOSS_DRAGON) {
    // Elder Dragon lair — deep crimson with fire glow, animated pulse
    let pulse = Math.sin(tick * 0.06 + x * 0.4 + y * 0.3) * 0.15 + 0.85;
    c.fillStyle = '#1a0505';
    c.fillRect(sx, sy, s, s);
    // Lava crack glow
    c.fillStyle = `rgba(180,30,10,${0.55 * pulse})`;
    c.fillRect(sx + 3, sy + 3, s - 6, s - 6);
    // Central sigil — dragon eye
    c.fillStyle = `rgba(255,80,0,${0.9 * pulse})`;
    c.fillRect(sx + s/2 - 6, sy + s/2 - 3, 12, 6);
    c.fillStyle = `rgba(255,200,0,${pulse})`;
    c.fillRect(sx + s/2 - 3, sy + s/2 - 2, 6, 4);
    // Fire border
    c.fillStyle = `rgba(220,60,0,${0.7 * pulse})`;
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy + s - 2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx + s - 2, sy, 2, s);
    // Skull warning
    c.fillStyle = `rgba(255,100,50,${0.5 * pulse})`;
    c.fillRect(sx + s/2 - 3, sy + 4, 6, 5);
    c.fillRect(sx + s/2 - 2, sy + 9, 4, 2);
  } else if (tileType === T.WORLD_BOSS_GOLEM) {
    // Titan Golem — dark granite with rune veins, heavy stone
    let shimmer = Math.sin(tick * 0.04 + x * 0.5 + y * 0.7) * 0.12 + 0.88;
    c.fillStyle = '#1c1c22';
    c.fillRect(sx, sy, s, s);
    // Stone slab face
    c.fillStyle = h < 2 ? '#3a3844' : '#343240';
    c.fillRect(sx + 2, sy + 2, s - 4, s - 4);
    // Blue-white rune veins
    c.fillStyle = `rgba(100,130,200,${0.65 * shimmer})`;
    c.fillRect(sx + s/2 - 1, sy + 4, 2, s - 8);
    c.fillRect(sx + 4, sy + s/2 - 1, s - 8, 2);
    c.fillRect(sx + 8, sy + 8, s - 16, 1);
    c.fillRect(sx + 8, sy + s - 9, s - 16, 1);
    // Central rune core
    c.fillStyle = `rgba(160,180,255,${shimmer})`;
    c.fillRect(sx + s/2 - 3, sy + s/2 - 3, 6, 6);
    // Rocky border
    c.fillStyle = '#484858';
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy + s - 2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx + s - 2, sy, 2, s);
  } else if (tileType === T.WORLD_BOSS_HYDRA) {
    // Void Hydra swamp — deep purple murk with toxic green
    let ripple = Math.sin(tick * 0.05 + x * 0.6 + y * 0.4) * 0.14 + 0.86;
    c.fillStyle = '#0d0815';
    c.fillRect(sx, sy, s, s);
    // Murky purple pool
    c.fillStyle = `rgba(60,10,90,${0.7 * ripple})`;
    c.fillRect(sx + 2, sy + 2, s - 4, s - 4);
    // Toxic green bubbles / veins
    c.fillStyle = `rgba(30,160,60,${0.55 * ripple})`;
    c.fillRect(sx + 5, sy + 5, 4, 4);
    c.fillRect(sx + s - 10, sy + s - 10, 5, 5);
    c.fillRect(sx + s/2 - 2, sy + 3, 4, 3);
    // Central void eye
    c.fillStyle = `rgba(140,0,200,${ripple})`;
    c.fillRect(sx + s/2 - 4, sy + s/2 - 4, 8, 8);
    c.fillStyle = `rgba(0,255,80,${0.8 * ripple})`;
    c.fillRect(sx + s/2 - 2, sy + s/2 - 2, 4, 4);
    // Purple border
    c.fillStyle = `rgba(100,20,140,${0.8 * ripple})`;
    c.fillRect(sx, sy, s, 2); c.fillRect(sx, sy + s - 2, s, 2);
    c.fillRect(sx, sy, 2, s); c.fillRect(sx + s - 2, sy, 2, s);
  } else if (tileType === T.WOOD_WALL) {
    // Dark wood plank wall — horizontal grain with knots
    c.fillStyle = h < 2 ? '#1e0a00' : '#180800';
    c.fillRect(sx, sy, s, s);
    // Plank grain lines
    let pw = Math.floor(s / 4);
    c.fillStyle = h < 2 ? '#2a1200' : '#240e00';
    c.fillRect(sx+1, sy+1, s-2, pw-2);
    c.fillRect(sx+1, sy+pw+1, s-2, pw-2);
    c.fillStyle = h < 2 ? '#261000' : '#200c00';
    c.fillRect(sx+1, sy+pw*2+1, s-2, pw-2);
    c.fillRect(sx+1, sy+pw*3+1, s-2, pw-2);
    // Plank dividers
    c.fillStyle = '#0d0500';
    for (let i = 1; i < 4; i++) c.fillRect(sx, sy+pw*i, s, 1);
    // Wood knot (deterministic)
    if (h === 0) {
      c.fillStyle = '#3a1800';
      c.fillRect(sx+Math.floor(s*0.6), sy+pw+2, 5, 4);
    }
    if (h === 2) {
      c.fillStyle = '#3a1800';
      c.fillRect(sx+Math.floor(s*0.25), sy+pw*2+2, 4, 4);
    }
    // Red lantern glow hint on wall
    c.fillStyle = 'rgba(180,40,0,0.06)';
    c.fillRect(sx, sy, s, s);
  } else if (tileType === T.PLANK_FLOOR) {
    // Horizontal wood planks — lighter than walls
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h < 2 ? '#3a1800' : '#341400');
    g.addColorStop(1, h < 2 ? '#4a2208' : '#42200a');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Plank grain — horizontal bands
    let ph = Math.floor(s / 3);
    c.fillStyle = 'rgba(0,0,0,0.12)';
    c.fillRect(sx, sy+ph, s, 1);
    c.fillRect(sx, sy+ph*2, s, 1);
    // Vertical plank joints (offset by hash)
    c.fillStyle = 'rgba(0,0,0,0.09)';
    let jx = h < 2 ? Math.floor(s*0.4) : Math.floor(s*0.6);
    c.fillRect(sx+jx, sy, 1, ph);
    c.fillRect(sx+s-jx, sy+ph, 1, ph);
    c.fillRect(sx+jx, sy+ph*2, 1, ph);
    // Wood grain highlight
    c.fillStyle = 'rgba(255,200,120,0.06)';
    c.fillRect(sx+2, sy+2, s-4, 1);
    c.fillRect(sx+2, sy+ph+2, s-4, 1);
  } else if (tileType === T.SAND) {
    // Sandy coastal ground
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h < 2 ? '#c4913a' : '#bc8930');
    g.addColorStop(1, h < 2 ? '#d4a050' : '#c89840');
    c.fillStyle = g;
    c.fillRect(sx, sy, s, s);
    // Sand texture specks
    let lx3 = (x*11+y*7)%(s-8)+4, ly3 = (x*5+y*17)%(s-8)+4;
    c.fillStyle = 'rgba(200,160,60,0.25)';
    c.fillRect(sx+lx3, sy+ly3, 3, 2);
    c.fillRect(sx+((x*7+y*11)%(s-8))+4, sy+((x*13+y*5)%(s-8))+4, 2, 2);
    // Subtle pebbles
    c.fillStyle = 'rgba(160,120,40,0.18)';
    if (h===0) c.fillRect(sx+8, sy+12, 4, 3);
    if (h===1) c.fillRect(sx+s-14, sy+8, 3, 4);
    if (h===2) c.fillRect(sx+12, sy+s-10, 5, 3);
    if (h===3) c.fillRect(sx+6, sy+s-14, 3, 3);
    // Bright sandy highlight
    c.fillStyle = 'rgba(255,230,140,0.08)';
    c.fillRect(sx+1, sy+1, s-2, 2);
  } else if (tileType === T.DOCK) {
    // Dark weathered dock planks over water
    c.fillStyle = '#0a0800';
    c.fillRect(sx, sy, s, s);
    // Wide plank bands
    let dh = Math.floor(s / 3);
    c.fillStyle = h < 2 ? '#1a0e04' : '#160c02';
    c.fillRect(sx+1, sy+1, s-2, dh-1);
    c.fillStyle = h < 2 ? '#180c02' : '#140a00';
    c.fillRect(sx+1, sy+dh+1, s-2, dh-1);
    c.fillStyle = h < 2 ? '#1c1004' : '#180e02';
    c.fillRect(sx+1, sy+dh*2+1, s-2, dh-1);
    // Plank dividers
    c.fillStyle = '#050300';
    c.fillRect(sx, sy+dh, s, 1);
    c.fillRect(sx, sy+dh*2, s, 1);
    // Nail/bolt spots
    c.fillStyle = '#3a2a10';
    c.fillRect(sx+4, sy+dh/2, 2, 2);
    c.fillRect(sx+s-6, sy+dh/2, 2, 2);
    c.fillRect(sx+4, sy+dh+dh/2, 2, 2);
    c.fillRect(sx+s-6, sy+dh+dh/2, 2, 2);
    // Water shimmer seeping through gaps
    let ws = Math.sin(tick*0.05+x*0.7+y*0.5) * 0.1 + 0.15;
    c.fillStyle = `rgba(20,60,100,${ws})`;
    c.fillRect(sx, sy+dh, s, 1);
    c.fillRect(sx, sy+dh*2, s, 1);
    // Wet sheen
    c.fillStyle = 'rgba(40,90,140,0.05)';
    c.fillRect(sx, sy, s, s);
  } else if (tileType === T.TAVERN_SIGN) {
    // Plank floor with a hanging tavern sign
    drawTile(c, sx, sy, T.PLANK_FLOOR, x, y, false);
    // Sign post
    c.fillStyle = '#2a1000';
    c.fillRect(sx+s/2-1, sy+4, 3, s/2+4);
    // Sign board
    c.fillStyle = '#5a2e08';
    c.fillRect(sx+6, sy+6, s-12, 12);
    c.fillStyle = '#7a4018';
    c.fillRect(sx+7, sy+7, s-14, 10);
    // Red lantern dot
    c.fillStyle = '#8b0000';
    c.fillRect(sx+s-12, sy+8, 4, 4);
    c.fillStyle = 'rgba(255,80,0,0.7)';
    c.fillRect(sx+s-11, sy+9, 2, 2);
    // Text lines on sign
    c.fillStyle = '#d4a000';
    c.fillRect(sx+10, sy+10, s-22, 1);
    c.fillRect(sx+10, sy+12, s-26, 1);
  } else if (tileType === T.WORLD_ROGUES_COVE) {
    // Harbor city — dark coastal background with ship anchor
    c.fillStyle = '#0e1018';
    c.fillRect(sx, sy, s, s);
    // Dark water/coastal base
    c.fillStyle = '#141820';
    c.fillRect(sx+3, sy+3, s-6, s-6);
    // Anchor symbol — ring top
    c.fillStyle = '#8b6020';
    c.fillRect(sx+s/2-4, sy+8, 8, 2); // top bar
    c.fillRect(sx+s/2-1, sy+8, 2, s-18); // shaft
    c.fillRect(sx+s/2-5, sy+s-12, 10, 2); // crossbar
    // Anchor arms curve (simplified as corner dots)
    c.fillRect(sx+s/2-6, sy+s-14, 3, 3);
    c.fillRect(sx+s/2+3, sy+s-14, 3, 3);
    // Red lantern accent
    c.fillStyle = '#8b0000';
    c.fillRect(sx+6, sy+8, 4, 5);
    c.fillStyle = 'rgba(255,80,0,0.65)';
    c.fillRect(sx+7, sy+9, 2, 3);
    // Gold trim glow
    c.fillStyle = 'rgba(180,120,0,0.2)';
    c.fillRect(sx+3, sy+3, s-6, s-6);
  } else if (tileType === T.FLOWER) {
    // Grass base with a small flower on top
    drawTile(c, sx, sy, T.GRASS, x, y, false);
    let fv = (x * 11 + y * 7) % 4;
    let petalColor = ['#ffdd00', '#ff88aa', '#cc88ff', '#ffffff'][fv];
    let fx = sx + 14 + (x * 5 + y * 3) % 12;
    let fy = sy + 10 + (y * 5 + x * 3) % 10;
    // Stem
    c.fillStyle = '#3a8a2a';
    c.fillRect(fx + 3, fy + 7, 2, 10);
    // Leaves
    c.fillStyle = '#2e7020';
    c.fillRect(fx, fy + 9, 4, 2);
    c.fillRect(fx + 5, fy + 11, 4, 2);
    // Petals (cross shape)
    c.fillStyle = petalColor;
    c.fillRect(fx, fy + 4, 3, 3);
    c.fillRect(fx + 6, fy + 4, 3, 3);
    c.fillRect(fx + 3, fy + 1, 3, 3);
    c.fillRect(fx + 3, fy + 7, 3, 3);
    // Center
    c.fillStyle = '#ffe060';
    c.fillRect(fx + 3, fy + 4, 3, 3);
  } else if (tileType === T.DUMMY) {
    // Training dummy on grass
    drawTile(c, sx, sy, T.GRASS, x, y, false);
    let hp = Math.floor(s * 0.45); // horizontal post y
    // Vertical post
    c.fillStyle = '#5a3010';
    c.fillRect(sx + Math.floor(s * 0.44), sy + Math.floor(s * 0.1), Math.floor(s * 0.14), Math.floor(s * 0.85));
    // Cross beam (arms)
    c.fillStyle = '#6a3818';
    c.fillRect(sx + Math.floor(s * 0.14), sy + hp, Math.floor(s * 0.72), Math.floor(s * 0.1));
    // Stuffed head (burlap)
    c.fillStyle = '#c8a060';
    c.fillRect(sx + Math.floor(s * 0.33), sy + Math.floor(s * 0.04), Math.floor(s * 0.34), Math.floor(s * 0.3));
    // Head X-eyes (stitched)
    c.fillStyle = '#4a2000';
    c.fillRect(sx + Math.floor(s * 0.37), sy + Math.floor(s * 0.1), Math.floor(s * 0.06), Math.floor(s * 0.06));
    c.fillRect(sx + Math.floor(s * 0.56), sy + Math.floor(s * 0.1), Math.floor(s * 0.06), Math.floor(s * 0.06));
    // Stitched mouth
    c.fillRect(sx + Math.floor(s * 0.39), sy + Math.floor(s * 0.2), Math.floor(s * 0.22), Math.floor(s * 0.02));
    // Body stuffing tied to beam
    c.fillStyle = '#b08040';
    c.fillRect(sx + Math.floor(s * 0.3), sy + Math.floor(s * 0.38), Math.floor(s * 0.4), Math.floor(s * 0.32));
    c.fillStyle = '#c89050';
    c.fillRect(sx + Math.floor(s * 0.33), sy + Math.floor(s * 0.39), Math.floor(s * 0.34), Math.floor(s * 0.28));
    // Rope wraps
    c.fillStyle = '#7a5020';
    c.fillRect(sx + Math.floor(s * 0.14), sy + Math.floor(s * 0.42), Math.floor(s * 0.72), Math.floor(s * 0.04));
    c.fillRect(sx + Math.floor(s * 0.14), sy + Math.floor(s * 0.58), Math.floor(s * 0.72), Math.floor(s * 0.04));
  } else if (tileType === T.GRASS_DARK) {
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#122e0f' : '#143311');
    g.addColorStop(0.5, h<2 ? '#163513' : '#1a3a16');
    g.addColorStop(1, h<2 ? '#1a3c16' : '#1e4119');
    c.fillStyle = g; c.fillRect(sx, sy, s, s);
    let hv2 = (x*13+y*7)%8;
    if (hv2 < 2) { c.fillStyle = 'rgba(0,10,0,0.12)'; c.fillRect(sx+8, sy+8, 16, 16); }
    let ts2 = Math.floor(s/32);
    c.fillStyle = 'rgba(16,40,13,0.6)';
    let b1d=Math.floor(s*0.12),b2d=Math.floor(s*0.19),b3d=Math.floor(s*0.62),b4d=Math.floor(s*0.69);
    let b5d=Math.floor(s*0.38),b6d=Math.floor(s*0.5),b7d=Math.floor(s*0.75),b8d=Math.floor(s*0.81);
    if (h===0) { c.fillRect(sx+b1d,sy+b2d,2+ts2,4+ts2); c.fillRect(sx+b2d,sy+b1d,2+ts2,5+ts2); }
    if (h===1) { c.fillRect(sx+b3d,sy+b2d,2+ts2,4+ts2); c.fillRect(sx+b4d,sy+b1d,2+ts2,6+ts2); }
    if (h===2) { c.fillRect(sx+b5d,sy+b6d,2+ts2,4+ts2); c.fillRect(sx+b6d,sy+b5d,2+ts2,6+ts2); }
    if (h===3) { c.fillRect(sx+b7d,sy+b8d,2+ts2,4+ts2); c.fillRect(sx+b8d,sy+b7d,2+ts2,4+ts2); }
  } else if (tileType === T.GRASS_LIGHT) {
    let g = c.createLinearGradient(sx, sy, sx+s, sy+s);
    g.addColorStop(0, h<2 ? '#2e6628' : '#32702b');
    g.addColorStop(0.5, h<2 ? '#377a30' : '#3d8535');
    g.addColorStop(1, h<2 ? '#3d8835' : '#459040');
    c.fillStyle = g; c.fillRect(sx, sy, s, s);
    let hvl = (x*13+y*7)%8;
    if (hvl < 2) { c.fillStyle = 'rgba(20,50,10,0.06)'; c.fillRect(sx+8, sy+8, 16, 16); }
    let tsl = Math.floor(s/32);
    c.fillStyle = 'rgba(40,90,30,0.5)';
    let b1l=Math.floor(s*0.12),b2l=Math.floor(s*0.19),b3l=Math.floor(s*0.62),b4l=Math.floor(s*0.69);
    let b5l=Math.floor(s*0.38),b6l=Math.floor(s*0.5),b7l=Math.floor(s*0.75),b8l=Math.floor(s*0.81);
    if (h===0) { c.fillRect(sx+b1l,sy+b2l,2+tsl,4+tsl); c.fillRect(sx+b2l,sy+b1l,2+tsl,5+tsl); }
    if (h===1) { c.fillRect(sx+b3l,sy+b2l,2+tsl,4+tsl); c.fillRect(sx+b4l,sy+b1l,2+tsl,6+tsl); }
    if (h===2) { c.fillRect(sx+b5l,sy+b6l,2+tsl,4+tsl); c.fillRect(sx+b6l,sy+b5l,2+tsl,6+tsl); }
    if (h===3) { c.fillRect(sx+b7l,sy+b8l,2+tsl,4+tsl); c.fillRect(sx+b8l,sy+b7l,2+tsl,4+tsl); }
    c.fillStyle = 'rgba(100,200,70,0.22)';
    let lxl=(x*11+y*7)%(s-6), lyl=(x*5+y*17)%(s-6);
    c.fillRect(sx+lxl+3, sy+lyl+3, 1, 1);
  } else if (tileType === T.FLOWER_RED || tileType === T.FLOWER_WHITE || tileType === T.FLOWER_YELLOW) {
    drawTile(c, sx, sy, T.GRASS, x, y, false);
    let petalColor = tileType === T.FLOWER_RED ? '#e01800' : tileType === T.FLOWER_WHITE ? '#f0f0f0' : '#ffdd00';
    let centerColor = tileType === T.FLOWER_WHITE ? '#ffcc00' : '#ffe060';
    let fx = sx + 14 + (x * 5 + y * 3) % 12;
    let fy = sy + 10 + (y * 5 + x * 3) % 10;
    c.fillStyle = '#3a8a2a'; c.fillRect(fx+3, fy+7, 2, 10);
    c.fillStyle = '#2e7020'; c.fillRect(fx, fy+9, 4, 2); c.fillRect(fx+5, fy+11, 4, 2);
    c.fillStyle = petalColor;
    c.fillRect(fx, fy+4, 3, 3); c.fillRect(fx+6, fy+4, 3, 3);
    c.fillRect(fx+3, fy+1, 3, 3); c.fillRect(fx+3, fy+7, 3, 3);
    c.fillStyle = centerColor; c.fillRect(fx+3, fy+4, 3, 3);
  } else if (!drawAreaTile(c, sx, sy, tileType, x, y, s, h)) {
    // Area tile renderers are in tiles_areas.js; unknown tile types fall through here.
    c.fillStyle = '#333';
    c.fillRect(sx, sy, s, s);
  }
}

function drawChestTile(c, sx, sy) {
  const s = TILE;
  c.fillStyle = '#3a2800';
  c.fillRect(sx, sy, s, s);
  // Chest body
  c.fillStyle = '#7a5000';
  c.fillRect(sx+3, sy+s/2, s-6, s/2-4);
  // Chest lid
  c.fillStyle = '#8a6010';
  c.fillRect(sx+3, sy+8, s-6, s/2-4);
  // Metal band
  c.fillStyle = '#c08820';
  c.fillRect(sx+3, sy+s/2-1, s-6, 2);
  // Lock
  c.fillStyle = '#e0b020';
  c.fillRect(sx+s/2-2, sy+s/2-3, 5, 5);
  // Highlight
  c.fillStyle = 'rgba(255,200,50,0.2)';
  c.fillRect(sx+4, sy+9, s-10, 2);
}
