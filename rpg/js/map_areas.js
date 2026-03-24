// map_areas.js — Map generators for the 5 new explorable world areas:
// Volcanic Wastes, Frozen Peaks, Shadow Forest, Dwarf Fortress, Ruins of Aethoria.
// Depends on: constants.js (T, MAP_W, MAP_H), map.js (fillRect).

function generateVolcanicWastes() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.VOLCANIC_FLOOR));
  // Border volcanic walls
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.VOLCANIC_WALL; m[MAP_H-1][x] = T.VOLCANIC_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.VOLCANIC_WALL; m[y][MAP_W-1] = T.VOLCANIC_WALL; }
  // Gate in north wall — leads back to world map
  m[0][20] = T.GATE;
  // Main path north-south
  for (let y = 1; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  // Lava rivers (impassable)
  for (let x = 5; x <= 15; x++) { m[10][x] = T.LAVA; m[11][x] = T.LAVA; }
  for (let x = 24; x <= 34; x++) { m[10][x] = T.LAVA; m[11][x] = T.LAVA; }
  for (let y = 18; y <= 26; y++) { m[y][5]  = T.LAVA; m[y][6]  = T.LAVA; }
  for (let y = 18; y <= 26; y++) { m[y][33] = T.LAVA; m[y][34] = T.LAVA; }
  // Lava pool — south center
  for (let dy = -3; dy <= 3; dy++) for (let dx = -5; dx <= 5; dx++) {
    if (dx*dx/25 + dy*dy/9 > 1) continue;
    let nx = 20+dx, ny = 30+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] !== T.GATE) m[ny][nx] = T.LAVA;
  }
  // Pyromancer's shop — NW building
  fillRect(m, 3, 15, 12, 22, T.VOLCANIC_WALL);
  fillRect(m, 4, 16, 11, 21, T.VOLCANIC_FLOOR);
  m[22][8] = T.DOOR;
  for (let x = 9; x <= 18; x++) m[23][x] = T.PATH;
  // Scattered volcanic wall rocks
  const rocks = [[8,5],[12,7],[27,5],[32,7],[7,28],[14,32],[26,28],[33,32]];
  for (let [rx, ry] of rocks) {
    if (m[ry][rx] === T.VOLCANIC_FLOOR) { m[ry][rx] = T.VOLCANIC_WALL; m[ry][rx+1] = T.VOLCANIC_WALL; }
  }
  return m;
}

function generateFrozenPeaks() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.SNOW));
  // Border ice walls
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.ICE_WALL; m[MAP_H-1][x] = T.ICE_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.ICE_WALL; m[y][MAP_W-1] = T.ICE_WALL; }
  // Gate in north wall
  m[0][20] = T.GATE;
  // Main path north-south
  for (let y = 1; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  // Ice cliff ridges
  for (let x = 3; x <= 14; x++) { m[8][x] = T.ICE_WALL; m[9][x] = T.ICE_WALL; }
  for (let x = 25; x <= 36; x++) { m[8][x] = T.ICE_WALL; m[9][x] = T.ICE_WALL; }
  for (let x = 3; x <= 9; x++)  { m[20][x] = T.ICE_WALL; m[21][x] = T.ICE_WALL; }
  for (let x = 30; x <= 36; x++) { m[20][x] = T.ICE_WALL; m[21][x] = T.ICE_WALL; }
  // Frozen lake — center south
  for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 6; dx++) {
    if (dx*dx/36 + dy*dy/16 > 1) continue;
    let nx = 20+dx, ny = 30+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1) m[ny][nx] = T.WATER;
  }
  // Ice Merchant's shop — NE
  fillRect(m, 25, 12, 35, 19, T.ICE_WALL);
  fillRect(m, 26, 13, 34, 18, T.SNOW);
  m[19][30] = T.DOOR;
  for (let x = 21; x <= 30; x++) m[20][x] = T.PATH;
  return m;
}

function generateShadowForest() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.SHADOW_FLOOR));
  // Border wall of dead trees (use WALL)
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.WALL; m[MAP_H-1][x] = T.WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.WALL; m[y][MAP_W-1] = T.WALL; }
  // Gate in north wall
  m[0][20] = T.GATE;
  // Winding dark path
  for (let y = 1; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  for (let x = 10; x <= 19; x++) { m[18][x] = T.PATH; }
  for (let x = 20; x <= 30; x++) { m[22][x] = T.PATH; }
  // Dense forest patches (impassable)
  const fpatches = [[5,12],[8,20],[14,28],[25,15],[30,25],[35,10],[33,30]];
  for (let [fx, fy] of fpatches) {
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      let nx = fx+dx, ny = fy+dy;
      if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] === T.SHADOW_FLOOR) m[ny][nx] = T.FOREST;
    }
  }
  // Witch's hut — west side
  fillRect(m, 3, 14, 11, 21, T.WALL);
  fillRect(m, 4, 15, 10, 20, T.SHADOW_FLOOR);
  m[21][7] = T.DOOR;
  for (let x = 8; x <= 18; x++) m[22][x] = T.PATH;
  // Poison swamp — SE
  for (let dy = -3; dy <= 3; dy++) for (let dx = -5; dx <= 5; dx++) {
    if (dx*dx/25 + dy*dy/9 > 1) continue;
    let nx = 30+dx, ny = 32+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1) m[ny][nx] = T.WATER;
  }
  return m;
}

function generateDwarfFortress() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.FLOOR));
  // Border stone walls (reuse DG_WALL for same look)
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.DG_WALL; m[MAP_H-1][x] = T.DG_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.DG_WALL; m[y][MAP_W-1] = T.DG_WALL; }
  // Gate in north wall
  m[0][20] = T.GATE;
  // Main cobblestone path (north-south spine)
  for (let y = 1; y <= 37; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  // East-west road
  for (let x = 1; x <= 38; x++) { m[20][x] = T.PATH; m[21][x] = T.PATH; }
  // Forge — west (with FORGE_GLOW)
  fillRect(m, 3, 5, 14, 16, T.DG_WALL);
  fillRect(m, 4, 6, 13, 15, T.FLOOR);
  m[13][11] = T.DOOR;
  fillRect(m, 9, 8, 11, 10, T.FORGE_GLOW); // forge glow
  for (let x = 12; x <= 18; x++) m[13][x] = T.PATH;
  // Armory — east
  fillRect(m, 25, 5, 36, 16, T.DG_WALL);
  fillRect(m, 26, 6, 35, 15, T.FLOOR);
  m[13][25] = T.DOOR;
  for (let x = 21; x <= 24; x++) m[13][x] = T.PATH;
  // Barracks — SW
  fillRect(m, 3, 24, 14, 35, T.DG_WALL);
  fillRect(m, 4, 25, 13, 34, T.FLOOR);
  m[24][9] = T.DOOR;
  for (let x = 9; x <= 18; x++) m[24][x] = T.PATH;
  // Training hall — SE
  fillRect(m, 25, 24, 36, 35, T.DG_WALL);
  fillRect(m, 26, 25, 35, 34, T.FLOOR);
  m[24][25] = T.DOOR;
  for (let x = 21; x <= 24; x++) m[24][x] = T.PATH;
  return m;
}

function generateTheAbyss() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.ABYSS_FLOOR));
  // Border void walls
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.ABYSS_WALL; m[MAP_H-1][x] = T.ABYSS_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.ABYSS_WALL; m[y][MAP_W-1] = T.ABYSS_WALL; }
  // Gate in north wall — leads back to world map
  m[0][20] = T.GATE;
  // Main path north-south (void stone)
  for (let y = 1; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  // East-west crossing at y=18 (deeper into the abyss)
  for (let x = 5; x <= 34; x++) m[18][x] = T.PATH;
  // Lore sign near entrance
  m[3][22] = T.SIGN;
  m[3][17] = T.SIGN;
  // Void Emporium — shop building (NW area)
  fillRect(m, 3, 5, 13, 14, T.ABYSS_WALL);
  fillRect(m, 4, 6, 12, 13, T.ABYSS_FLOOR);
  m[14][8] = T.DOOR;
  for (let x = 9; x <= 18; x++) m[15][x] = T.PATH;
  // Void rift portals scattered (impassable decorative tears in reality)
  const rifts = [[5,22],[8,30],[15,25],[25,10],[30,22],[33,30],[12,35],[28,35]];
  for (let [rx, ry] of rifts) {
    if (rx > 0 && rx < MAP_W-1 && ry > 0 && ry < MAP_H-1 && m[ry][rx] === T.ABYSS_FLOOR) {
      m[ry][rx] = T.VOID_RIFT;
      if (rx+1 < MAP_W-1) m[ry][rx+1] = T.VOID_RIFT;
    }
  }
  // Void pools (impassable dark voids)
  for (let dy = -2; dy <= 2; dy++) for (let dx = -3; dx <= 3; dx++) {
    if (dx*dx/9 + dy*dy/4 > 1) continue;
    let nx = 20+dx, ny = 30+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] !== T.PATH) m[ny][nx] = T.WATER;
  }
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    if (dx*dx + dy*dy > 4) continue;
    let nx = 8+dx, ny = 8+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] === T.ABYSS_FLOOR) m[ny][nx] = T.WATER;
  }
  return m;
}

function generateRuinsAethoria() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.SACRED_GROUND));
  // Border crumbling walls
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.WALL; m[MAP_H-1][x] = T.WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.WALL; m[y][MAP_W-1] = T.WALL; }
  // Gate in north wall
  m[0][20] = T.GATE;
  // Main path
  for (let y = 1; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  for (let x = 5; x <= 34; x++) { m[20][x] = T.PATH; }
  // Broken pillars scattered (impassable)
  const pillars = [[5,8],[10,8],[15,8],[25,8],[30,8],[35,8],[5,14],[35,14],[5,26],[35,26],[5,32],[10,32],[15,32],[25,32],[30,32],[35,32]];
  for (let [px, py] of pillars) {
    if (px > 0 && px < MAP_W-1 && py > 0 && py < MAP_H-1) m[py][px] = T.BROKEN_PILLAR;
  }
  // Central temple — grand hall
  fillRect(m, 10, 10, 29, 18, T.WALL);
  fillRect(m, 11, 11, 28, 17, T.SACRED_GROUND);
  m[18][15] = T.DOOR; m[18][24] = T.DOOR;
  // Temple interior paths
  for (let x = 11; x <= 28; x++) m[14][x] = T.PATH;
  // Elder's sanctum — north
  fillRect(m, 25, 3, 34, 9, T.WALL);
  fillRect(m, 26, 4, 33, 8, T.SACRED_GROUND);
  m[9][29] = T.DOOR;
  for (let y = 10; y <= 18; y++) m[y][29] = T.PATH;
  // Water — sacred pool south
  for (let dy = -2; dy <= 2; dy++) for (let dx = -3; dx <= 3; dx++) {
    let nx = 20+dx, ny = 30+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1) m[ny][nx] = T.WATER;
  }
  return m;
}

function generateSunkenTemple() {
  // Deep-flooded ancient temple — teal SUNKEN_FLOOR base, SUNKEN_WALL borders
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.SUNKEN_FLOOR));
  // Border sunken walls
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.SUNKEN_WALL; m[MAP_H-1][x] = T.SUNKEN_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.SUNKEN_WALL; m[y][MAP_W-1] = T.SUNKEN_WALL; }
  // Gate in north wall — leads back to world map (flooded gate)
  m[0][20] = T.GATE;
  // Main flooded corridor (north-south spine)
  for (let y = 1; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  // East-west grand hall at y=18
  for (let x = 5; x <= 34; x++) m[18][x] = T.PATH;
  // Entrance inscription sign
  m[3][22] = T.SIGN;
  m[3][17] = T.SIGN;
  // Broken columns flanking the main corridor (impassable rubble — use SUNKEN_WALL)
  const columns = [[6,8],[13,8],[26,8],[33,8],[6,14],[33,14],[6,22],[33,22],[6,28],[33,28],[6,32],[13,32],[26,32],[33,32]];
  for (let [cx, cy] of columns) {
    if (cx > 0 && cx < MAP_W-1 && cy > 0 && cy < MAP_H-1) {
      m[cy][cx] = T.SUNKEN_WALL;
      if (cx+1 < MAP_W-1) m[cy][cx+1] = T.SUNKEN_WALL;
    }
  }
  // The Sunken Reliquary — shop (NW room)
  fillRect(m, 3, 8, 12, 16, T.SUNKEN_WALL);
  fillRect(m, 4, 9, 11, 15, T.SUNKEN_FLOOR);
  m[16][8] = T.DOOR;
  for (let x = 9; x <= 18; x++) m[17][x] = T.PATH;
  // Throne room — Boss chamber (south)
  fillRect(m, 10, 28, 29, 36, T.SUNKEN_WALL);
  fillRect(m, 11, 29, 28, 35, T.SUNKEN_FLOOR);
  m[28][19] = T.DOOR; m[28][20] = T.DOOR;
  // Deep water pools (flooded side chambers — impassable)
  for (let dy = -2; dy <= 2; dy++) for (let dx = -3; dx <= 3; dx++) {
    if (dx*dx/9 + dy*dy/4 > 1) continue;
    let nx = 30+dx, ny = 10+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] === T.SUNKEN_FLOOR) m[ny][nx] = T.WATER;
  }
  for (let dy = -3; dy <= 3; dy++) for (let dx = -4; dx <= 4; dx++) {
    if (dx*dx/16 + dy*dy/9 > 1) continue;
    let nx = 10+dx, ny = 10+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] === T.SUNKEN_FLOOR) m[ny][nx] = T.WATER;
  }
  // Treasure chest in the throne room
  m[32][19] = T.CHEST;
  return m;
}

function generateTheUnderworld() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.HELL_FLOOR));
  // Border walls
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.HELL_WALL; m[MAP_H-1][x] = T.HELL_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.HELL_WALL; m[y][MAP_W-1] = T.HELL_WALL; }
  // Gate in north wall — leads back to world map
  m[0][20] = T.GATE;
  // Main brimstone path (north-south)
  for (let y = 1; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  // Lava rivers (impassable)
  for (let x = 3; x <= 12; x++) { m[12][x] = T.LAVA; m[13][x] = T.LAVA; }
  for (let x = 27; x <= 36; x++) { m[12][x] = T.LAVA; m[13][x] = T.LAVA; }
  for (let y = 20; y <= 28; y++) { m[y][5]  = T.LAVA; m[y][6]  = T.LAVA; }
  for (let y = 20; y <= 28; y++) { m[y][33] = T.LAVA; m[y][34] = T.LAVA; }
  // Lava pool — south center
  for (let dy = -3; dy <= 3; dy++) for (let dx = -5; dx <= 5; dx++) {
    if (dx*dx/25 + dy*dy/9 > 1) continue;
    let nx = 20+dx, ny = 32+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] !== T.PATH) m[ny][nx] = T.LAVA;
  }
  // Inscription sign near entrance ("Abandon hope, all ye who enter here.")
  m[3][17] = T.SIGN;
  m[3][22] = T.SIGN;
  // Brimstone Bazaar — NW area (Fallen Angel's shop)
  fillRect(m, 3, 15, 12, 22, T.HELL_WALL);
  fillRect(m, 4, 16, 11, 21, T.HELL_FLOOR);
  m[22][8] = T.DOOR;
  for (let x = 9; x <= 18; x++) m[23][x] = T.PATH;
  // Iron pillars (decorative impassable obstacles)
  const ipillars = [[8,7],[14,9],[25,7],[31,9],[7,30],[15,33],[25,30],[32,33]];
  for (let [rx, ry] of ipillars) {
    if (m[ry][rx] === T.HELL_FLOOR) { m[ry][rx] = T.HELL_WALL; if (rx+1 < MAP_W-1) m[ry][rx+1] = T.HELL_WALL; }
  }
  return m;
}
