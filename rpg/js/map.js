// map.js — Map generation and spatial utilities.
// Generates: town, world map (with Dragon's Gate + Elven Town markers), Elven Town,
//            Dragon's Gate fortress city, and procedural dungeons with rooms/corridors.
// Exports: getMap, maps, dungeonData, currentFloor, fillRect, findNearestFloor.
// Depends on: constants.js (TILE, MAP_W, MAP_H, T).

function generateTown() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.GRASS));
  for (let x = 15; x <= 25; x++) { m[20][x] = T.PATH; m[21][x] = T.PATH; }
  // North path extended to gate at y=0
  for (let y = 1; y <= 30; y++) { m[y][20] = T.PATH; m[y][21] = T.PATH; }
  fillRect(m, 10, 12, 14, 16, T.WALL); fillRect(m, 11, 13, 13, 15, T.FLOOR); m[16][12] = T.DOOR;
  fillRect(m, 26, 12, 30, 16, T.WALL); fillRect(m, 27, 13, 29, 15, T.FLOOR); m[16][28] = T.DOOR;
  fillRect(m, 10, 24, 14, 28, T.WALL); fillRect(m, 11, 25, 13, 27, T.FLOOR); m[24][12] = T.DOOR;
  fillRect(m, 26, 24, 30, 28, T.WALL); fillRect(m, 27, 25, 29, 27, T.FLOOR); m[24][28] = T.DOOR;
  fillRect(m, 32, 12, 37, 17, T.WALL); fillRect(m, 33, 13, 36, 16, T.FLOOR); m[17][34] = T.DOOR;
  fillRect(m, 32, 22, 37, 30, T.WALL); fillRect(m, 33, 23, 36, 29, T.FLOOR); m[22][34] = T.DOOR;
  fillRect(m, 5, 5, 9, 8, T.WATER);
  // Library building (west side of town)
  fillRect(m, 5, 12, 9, 16, T.WALL); fillRect(m, 6, 13, 8, 15, T.FLOOR); m[16][7] = T.DOOR;
  m[17][7] = T.SIGN; // Library sign
  m[35][20] = T.STAIRS_DOWN;

  m[19][18] = T.SIGN; m[19][22] = T.SIGN;
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.WALL; m[MAP_H-1][x] = T.WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.WALL; m[y][MAP_W-1] = T.WALL; }
  // Gate in the north wall — leads to world map
  m[0][20] = T.GATE;
  return m;
}

function generateWorldMap() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.GRASS));

  // Border impassable mountains
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.MOUNTAIN; m[MAP_H-1][x] = T.MOUNTAIN; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.MOUNTAIN; m[y][MAP_W-1] = T.MOUNTAIN; }

  // Northern mountain range (y=1..6, density decreases southward)
  for (let y = 1; y <= 6; y++) {
    for (let x = 1; x < MAP_W-1; x++) {
      if ((x * 3 + y * 7) % 5 < 6 - y) m[y][x] = T.MOUNTAIN;
    }
  }

  // Eastern ocean (x=31+)
  for (let y = 1; y < MAP_H-1; y++) {
    for (let x = 31; x < MAP_W-1; x++) {
      if (x > 33 || (x === 31 && y % 3 === 0) || (x === 32 && y % 2 === 1) || x === 33) m[y][x] = T.WATER;
    }
  }

  // Forest patches (deterministic circles)
  const fpatches = [[6,14],[5,21],[11,9],[27,14],[29,21],[7,30],[22,34]];
  for (let [fx, fy] of fpatches) {
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      if (dx*dx + dy*dy > 9) continue;
      let nx = fx+dx, ny = fy+dy;
      if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] === T.GRASS) m[ny][nx] = T.FOREST;
    }
  }

  // Small lake (southwest)
  for (let dy = -2; dy <= 2; dy++) for (let dx = -4; dx <= 4; dx++) {
    if (dx*dx/16 + dy*dy/4 > 1) continue;
    let nx = 10+dx, ny = 28+dy;
    if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1) m[ny][nx] = T.WATER;
  }

  // Road connecting town (19-20, 14-15) to Dragon's Gate (19-20, 26-27)
  for (let y = 16; y <= 25; y++) {
    if (m[y][19] !== T.MOUNTAIN && m[y][19] !== T.WATER) m[y][19] = T.PATH;
    if (m[y][20] !== T.MOUNTAIN && m[y][20] !== T.WATER) m[y][20] = T.PATH;
  }

  // Town marker (single tile — road axis x=20, nearest row y=15)
  m[15][20] = T.WORLD_TOWN;

  // Road to Elven Town: branch east from town at y=13, then north along x=26
  for (let x = 20; x <= 26; x++) {
    if (m[13][x] !== T.MOUNTAIN && m[13][x] !== T.WATER) m[13][x] = T.PATH;
  }
  for (let y = 11; y <= 13; y++) {
    if (m[y][26] !== T.MOUNTAIN && m[y][26] !== T.WATER) m[y][26] = T.PATH;
  }

  // Elven Town marker (single tile — road at x=26, row y=10)
  m[10][26] = T.WORLD_ELVEN_TOWN;

  // ── World Boss Markers ────────────────────────────────────────────────────
  // Placed last to override terrain. Each is a single walkable tile that triggers boss combat.
  m[33][4]  = T.WORLD_BOSS_DRAGON; // Elder Dragon — deep south wilderness
  m[5][29]  = T.WORLD_BOSS_GOLEM;  // Titan Golem — northern mountains area
  m[27][5]  = T.WORLD_BOSS_HYDRA;  // Void Hydra — far west (swamp/forest)

  // ── Road to Rogue's Cove (southwestern coast) ─────────────────────────────
  // South branch from main road (x=18) down to y=34
  for (let y = 26; y <= 34; y++) {
    if (m[y][18] !== T.MOUNTAIN && m[y][18] !== T.WATER) m[y][18] = T.PATH;
  }
  // West branch at y=34 from x=6 to x=18
  for (let x = 6; x <= 18; x++) {
    if (m[34][x] !== T.MOUNTAIN && m[34][x] !== T.WATER) m[34][x] = T.PATH;
  }

  // Rogue's Cove city marker (single tile — road at x=6, row y=35)
  m[35][6] = T.WORLD_ROGUES_COVE;

  // ── Road to Volcanic Wastes (southwest — y:30, x:5) ───────────────────────
  // Branch west from Rogue's Cove road at y=30
  for (let x = 5; x <= 18; x++) {
    if (m[30][x] !== T.MOUNTAIN && m[30][x] !== T.WATER) m[30][x] = T.PATH;
  }
  m[30][19] = T.PATH; // connect to main road
  // Volcanic Wastes marker (single tile — road end x=5, row y=30)
  m[30][5] = T.WORLD_VOLCANIC_WASTES;

  // ── Road to Frozen Peaks (northwest — y:2, x:5) ───────────────────────────
  // Branch west from northern mountain area at y=7, then north
  for (let x = 5; x <= 10; x++) {
    if (m[7][x] !== T.MOUNTAIN) m[7][x] = T.PATH;
  }
  for (let y = 3; y <= 7; y++) {
    if (m[y][5] !== T.MOUNTAIN) m[y][5] = T.PATH;
  }
  // Frozen Peaks marker (single tile — road at x=5, row y=3)
  m[3][5] = T.WORLD_FROZEN_PEAKS;

  // ── Road to Shadow Forest (east — y:20, x:38) ─────────────────────────────
  // Branch east from town road at y=20, through x=21 to x=37
  for (let x = 21; x <= 37; x++) {
    if (m[20][x] !== T.MOUNTAIN && m[20][x] !== T.WATER) m[20][x] = T.PATH;
  }
  // Shadow Forest marker (single tile — road end x=37, row y=20)
  m[20][37] = T.WORLD_SHADOW_FOREST;

  // ── Road to Dwarf Fortress (northeast — y:10, x:38) ───────────────────────
  // Branch east from Elven Town road at y=10, from x=27 to x=37
  for (let x = 27; x <= 37; x++) {
    if (m[10][x] !== T.MOUNTAIN && m[10][x] !== T.WATER) m[10][x] = T.PATH;
  }
  // Dwarf Fortress marker (single tile — road end x=37, row y=10)
  m[10][37] = T.WORLD_DWARF_FORTRESS;

  // ── Road to Ruins of Aethoria (center-east — y:20, x:25) ─────────────────
  // Branch from world road at y=17, east to x=25, then south to y=21
  for (let x = 20; x <= 25; x++) {
    if (m[17][x] !== T.MOUNTAIN && m[17][x] !== T.WATER) m[17][x] = T.PATH;
  }
  for (let y = 18; y <= 21; y++) {
    if (m[y][25] !== T.MOUNTAIN && m[y][25] !== T.WATER) m[y][25] = T.PATH;
  }
  // Aethoria marker (single tile — road at x=25, row y=20)
  m[20][25] = T.WORLD_AETHORIA;

  // ── Road to The Abyss (far south — y:37, x:20) ────────────────────────────
  // Extend the main road south from Dragon's Gate down to y=36
  for (let y = 26; y <= 36; y++) {
    if (m[y][19] !== T.MOUNTAIN && m[y][19] !== T.WATER) m[y][19] = T.PATH;
    if (m[y][20] !== T.MOUNTAIN && m[y][20] !== T.WATER) m[y][20] = T.PATH;
  }
  // The Abyss rift marker (single tile — road at x=20, row y=37)
  m[37][20] = T.WORLD_ABYSS;

  // Dragon's Gate city marker (single tile — placed after road generation so it isn't overwritten)
  m[26][20] = T.WORLD_DRAGONS_GATE;

  // ── Road to Sunken Temple (southeast — y:32, x:30) ────────────────────────
  // Branch east from the Rogue's Cove road at y=32, from x=18 to x=29
  for (let x = 18; x <= 29; x++) {
    if (m[32][x] !== T.MOUNTAIN && m[32][x] !== T.WATER) m[32][x] = T.PATH;
  }
  // Sunken Temple marker (single tile — road end x=30, row y=32)
  m[32][30] = T.WORLD_SUNKEN_TEMPLE;

  // ── Road to The Underworld (below Volcanic Wastes — y:36, x:15) ───────────
  // Branch west from the south main road at y=36
  for (let x = 16; x <= 18; x++) {
    if (m[36][x] !== T.MOUNTAIN && m[36][x] !== T.WATER) m[36][x] = T.PATH;
  }
  // The Underworld hellgate marker (single tile — road end x=15, row y=36)
  m[36][15] = T.WORLD_UNDERWORLD;

  // Override road tiles back to grass for specified coordinates
  for (let y = 16; y <= 29; y++) m[y][19] = T.GRASS;
  m[31][19] = T.GRASS; m[33][19] = T.GRASS; m[35][19] = T.GRASS;
  for (let y = 26; y <= 29; y++) m[y][18] = T.GRASS;
  m[31][18] = T.GRASS; m[33][18] = T.GRASS;

  return m;
}

function generateElvenTown() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.GRASS));

  // ── Main north-south avenue from gate to central plaza ──
  for (let y = 1; y <= 17; y++) { m[y][20] = T.ELVEN_PATH; m[y][21] = T.ELVEN_PATH; }

  // ── Central plaza — grand ELVEN_FLOOR square ──
  fillRect(m, 16, 17, 24, 24, T.ELVEN_FLOOR);

  // ── Tree of Life monument — 2×2, SW quadrant of plaza (off the main path) ──
  m[22][17] = T.TREE_OF_LIFE; m[22][18] = T.TREE_OF_LIFE;
  m[23][17] = T.TREE_OF_LIFE; m[23][18] = T.TREE_OF_LIFE;

  // ── West arm — plaza to Elven Market ──
  for (let x = 12; x <= 15; x++) { m[20][x] = T.ELVEN_PATH; m[21][x] = T.ELVEN_PATH; }

  // ── East arm — plaza to Elder's Hall ──
  for (let x = 25; x <= 30; x++) { m[20][x] = T.ELVEN_PATH; m[21][x] = T.ELVEN_PATH; }

  // ── Elven Market (NW) — silver ELVEN_WALL shell, ELVEN_FLOOR interior ──
  fillRect(m, 10, 12, 16, 18, T.ELVEN_WALL);
  fillRect(m, 11, 13, 15, 17, T.ELVEN_FLOOR);
  m[18][13] = T.DOOR;
  m[19][13] = T.ELVEN_PATH; // connector: door to west arm

  // ── Elder's Hall (NE) — silver ELVEN_WALL shell, ELVEN_FLOOR interior ──
  fillRect(m, 24, 12, 30, 18, T.ELVEN_WALL);
  fillRect(m, 25, 13, 29, 17, T.ELVEN_FLOOR);
  m[18][27] = T.DOOR;
  m[19][27] = T.ELVEN_PATH; // connector: door to east arm

  // ── South avenue from plaza ──
  for (let y = 25; y <= 35; y++) { m[y][20] = T.ELVEN_PATH; m[y][21] = T.ELVEN_PATH; }

  // ── Moonwell Courtyard (SW) — ELVEN_FLOOR surround ──
  fillRect(m, 9, 26, 17, 33, T.ELVEN_FLOOR);
  // Moonwell pool — 2×2 crystal basin
  m[29][12] = T.MOONWELL; m[29][13] = T.MOONWELL;
  m[30][12] = T.MOONWELL; m[30][13] = T.MOONWELL;
  // Path along courtyard at y=28 connecting to south avenue
  for (let x = 9; x <= 19; x++) m[28][x] = T.ELVEN_PATH;

  // ── Archery Range (SE) — open ELVEN_FLOOR courtyard ──
  fillRect(m, 24, 26, 33, 33, T.ELVEN_FLOOR);
  // Path at y=28 connecting south avenue to archery range
  m[28][22] = T.ELVEN_PATH; m[28][23] = T.ELVEN_PATH;

  // ── Silverforge Blacksmith (W side, between Elven Market and south) ──
  fillRect(m, 2, 14, 8, 20, T.ELVEN_WALL);
  fillRect(m, 3, 15, 7, 19, T.ELVEN_FLOOR);
  m[20][5] = T.DOOR;
  // Path connecting door south to the west arm at y:21
  for (let x = 5; x <= 11; x++) m[21][x] = T.ELVEN_PATH;

  // ── Moonpetal Inn (NE, north of Elder's Hall) ──
  fillRect(m, 33, 8, 38, 14, T.ELVEN_WALL);
  fillRect(m, 34, 9, 37, 13, T.ELVEN_FLOOR);
  m[14][36] = T.DOOR;
  // North branch from extended east arm up to inn door
  for (let y = 15; y <= 19; y++) m[y][36] = T.ELVEN_PATH;
  // Extend east arm east to reach x:36
  for (let x = 31; x <= 36; x++) { m[20][x] = T.ELVEN_PATH; m[21][x] = T.ELVEN_PATH; }

  // ── Lorekeeper's Archive (N, east of main path) ──
  fillRect(m, 25, 2, 31, 8, T.ELVEN_WALL);
  fillRect(m, 26, 3, 30, 7, T.ELVEN_FLOOR);
  m[8][28] = T.DOOR;
  // Horizontal branch east from main path at y:9 to reach archive door
  for (let x = 22; x <= 28; x++) m[9][x] = T.ELVEN_PATH;

  // ── Herbalist's Garden (SW, west of moonwell courtyard) ──
  fillRect(m, 2, 27, 8, 33, T.ELVEN_WALL);
  fillRect(m, 3, 28, 7, 32, T.ELVEN_FLOOR);
  m[30][8] = T.DOOR;   // opens east into moonwell courtyard (x:9 is ELVEN_FLOOR)

  // ── Bowyer's Range (SE, east of archery range) ──
  fillRect(m, 34, 27, 38, 33, T.ELVEN_WALL);
  fillRect(m, 35, 28, 37, 32, T.ELVEN_FLOOR);
  m[30][34] = T.DOOR;  // opens west into archery range courtyard (x:33 is ELVEN_FLOOR)

  // ── Decorative small water feature (NW near forest) ──
  fillRect(m, 5, 5, 8, 8, T.WATER);

  // ── Forest clusters in four corners (4×4 each) ──
  for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) {
    m[2+dy][2+dx]   = T.FOREST; m[2+dy][35+dx]  = T.FOREST;
    m[34+dy][2+dx]  = T.FOREST; m[34+dy][35+dx] = T.FOREST;
  }

  // ── Border walls ──
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.WALL; m[MAP_H-1][x] = T.WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.WALL; m[y][MAP_W-1] = T.WALL; }

  // ── Gate in north wall — leads back to world map ──
  m[0][20] = T.GATE;
  return m;
}

function generateDragonsGate() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.DG_FLOOR));

  // ── Border fortress walls ──
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.DG_WALL; m[MAP_H-1][x] = T.DG_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.DG_WALL; m[y][MAP_W-1] = T.DG_WALL; }

  // ── Gate in the north wall ──
  m[0][20] = T.GATE;

  // ── Main cobblestone path (north-south spine) ──
  for (let y = 1; y <= 37; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }

  // ── Guard towers flanking the entrance (NW and NE) ──
  fillRect(m, 1, 1, 5, 6, T.DG_WALL);   fillRect(m, 2, 2, 4, 5, T.DG_FLOOR);
  fillRect(m, 34, 1, 38, 6, T.DG_WALL); fillRect(m, 35, 2, 37, 5, T.DG_FLOOR);

  // ── Ironhelm's Armory (NW, x=3-11, y=9-16) ──
  fillRect(m, 3, 9, 11, 16, T.DG_WALL);
  fillRect(m, 4, 10, 10, 15, T.DG_FLOOR);
  m[13][11] = T.DOOR;
  // Path connector: armory door east to main path
  for (let x = 12; x <= 18; x++) m[13][x] = T.PATH;

  // ── Siegemaster's War Goods (NE, x=28-36, y=9-16) ──
  fillRect(m, 28, 9, 36, 16, T.DG_WALL);
  fillRect(m, 29, 10, 35, 15, T.DG_FLOOR);
  m[13][28] = T.DOOR;
  // Path connector: war goods door west to main path
  for (let x = 21; x <= 27; x++) m[13][x] = T.PATH;

  // ── Arena (SW, x=3-11, y=22-29) — sparring ring ──
  fillRect(m, 3, 22, 11, 29, T.DG_WALL);
  fillRect(m, 4, 23, 10, 28, T.RING);
  m[25][11] = T.DOOR;
  for (let x = 12; x <= 18; x++) m[25][x] = T.PATH;

  // ── Guild Hall (SE, x=28-36, y=22-29) ──
  fillRect(m, 28, 22, 36, 29, T.DG_WALL);
  fillRect(m, 29, 23, 35, 28, T.DG_FLOOR);
  m[25][28] = T.DOOR;
  for (let x = 21; x <= 27; x++) m[25][x] = T.PATH;

  // ── Inner fortress gate wall (y=32) — passage at x=17-22 ──
  for (let x = 1; x <= 38; x++) {
    if (x < 17 || x > 22) m[32][x] = T.DG_WALL;
  }
  // Side walls enclosing the dungeon courtyard (y=32-38, x=13-14 and x=25-26)
  for (let y = 32; y <= 38; y++) {
    m[y][13] = T.DG_WALL; m[y][14] = T.DG_WALL;
    m[y][25] = T.DG_WALL; m[y][26] = T.DG_WALL;
  }

  // ── Dungeon entrance stairs (south end of courtyard) ──
  m[37][20] = T.STAIRS_DOWN;

  return m;
}

function generateRogueCove() {
  // Background: sandy coastal ground
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.SAND));

  // ── Border wooden walls ──
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.WOOD_WALL; m[MAP_H-1][x] = T.WOOD_WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.WOOD_WALL; m[y][MAP_W-1] = T.WOOD_WALL; }

  // ── Gate in north wall — leads to world map ──
  m[0][20] = T.GATE;

  // ── Main spine road (north-south) ──
  for (let y = 1; y <= 32; y++) { m[y][19] = T.PLANK_FLOOR; m[y][20] = T.PLANK_FLOOR; }

  // ── East-west road 1 (near north buildings) ──
  for (let x = 1; x <= 38; x++) { m[8][x] = T.PLANK_FLOOR; m[9][x] = T.PLANK_FLOOR; }

  // ── East-west road 2 (mid city) ──
  for (let x = 1; x <= 38; x++) { m[22][x] = T.PLANK_FLOOR; m[23][x] = T.PLANK_FLOOR; }

  // ── South approach to docks ──
  for (let x = 1; x <= 38; x++) { m[30][x] = T.PLANK_FLOOR; m[31][x] = T.PLANK_FLOOR; }

  // ── Docks (south) ──
  fillRect(m, 1, 32, 38, 38, T.DOCK);
  // Harbor water gaps between dock sections
  fillRect(m, 4, 35, 8, 38, T.WATER);
  fillRect(m, 17, 35, 22, 38, T.WATER);
  fillRect(m, 30, 35, 34, 38, T.WATER);

  // ── SCARLET LADY INN (northwest) ──
  fillRect(m, 2, 1, 10, 7, T.WOOD_WALL);
  fillRect(m, 3, 2, 9, 6, T.PLANK_FLOOR);
  m[7][6] = T.DOOR;

  // ── GENERAL SHOP (north, left of center) ──
  fillRect(m, 13, 1, 18, 7, T.WOOD_WALL);
  fillRect(m, 14, 2, 17, 6, T.PLANK_FLOOR);
  m[7][16] = T.DOOR;

  // ── CROW'S NEST TAVERN (northeast) ──
  fillRect(m, 21, 1, 30, 7, T.WOOD_WALL);
  fillRect(m, 22, 2, 29, 6, T.PLANK_FLOOR);
  m[7][26] = T.DOOR;
  m[8][26] = T.TAVERN_SIGN;

  // ── LUCKY'S DEN — gambling (west mid) ──
  fillRect(m, 2, 11, 10, 21, T.WOOD_WALL);
  fillRect(m, 3, 12, 9, 20, T.PLANK_FLOOR);
  m[21][6] = T.DOOR;

  // ── SALTY ANCHOR TAVERN — Salty Steve (center-east mid) ──
  fillRect(m, 21, 11, 30, 21, T.WOOD_WALL);
  fillRect(m, 22, 12, 29, 20, T.PLANK_FLOOR);
  m[21][26] = T.DOOR;
  m[22][26] = T.TAVERN_SIGN;

  // ── BARNACLE TAVERN (far east mid) ──
  fillRect(m, 32, 11, 38, 21, T.WOOD_WALL);
  fillRect(m, 33, 12, 37, 20, T.PLANK_FLOOR);
  m[21][35] = T.DOOR;
  m[22][35] = T.TAVERN_SIGN;

  // ── RED DICE — gambling (west south) ──
  fillRect(m, 2, 24, 10, 30, T.WOOD_WALL);
  fillRect(m, 3, 25, 9, 29, T.PLANK_FLOOR);
  m[24][6] = T.DOOR;

  // ── SIREN'S LEDGE TAVERN (east south) ──
  fillRect(m, 21, 24, 30, 30, T.WOOD_WALL);
  fillRect(m, 22, 25, 29, 29, T.PLANK_FLOOR);
  m[24][26] = T.DOOR;
  m[23][26] = T.TAVERN_SIGN;

  return m;
}

function generateTrainingGrounds() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.GRASS));
  // Border walls
  for (let x = 0; x < MAP_W; x++) { m[0][x] = T.WALL; m[MAP_H-1][x] = T.WALL; }
  for (let y = 0; y < MAP_H; y++) { m[y][0] = T.WALL; m[y][MAP_W-1] = T.WALL; }
  // Gate (north exit back to town) and signs
  m[4][19] = T.GATE; m[4][20] = T.GATE;
  m[5][18] = T.SIGN; m[5][21] = T.SIGN;
  // Central dirt path (north-south through entire open field)
  for (let y = 5; y <= 35; y++) { m[y][19] = T.PATH; m[y][20] = T.PATH; }
  // Ponds — one in the north area, one in the south
  fillRect(m, 24, 13, 27, 15, T.WATER);
  fillRect(m, 5, 27, 9, 30, T.WATER);
  // Training dummies spread around the field
  m[7][12] = T.DUMMY;
  m[7][26] = T.DUMMY;
  m[15][12] = T.DUMMY;
  m[28][26] = T.DUMMY;
  // Dark grass patches (shadier, lusher spots)
  const darkPatches = [[5,8],[30,10],[12,20],[35,25],[8,33],[25,30],[33,15],[16,35]];
  for (let [px, py] of darkPatches) {
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      let nx = px+dx, ny = py+dy;
      if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] === T.GRASS) m[ny][nx] = T.GRASS_DARK;
    }
  }
  // Light grass patches (brighter, sun-kissed spots)
  const lightPatches = [[15,10],[30,22],[8,24],[35,8],[22,35],[10,16],[28,6]];
  for (let [px, py] of lightPatches) {
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      let nx = px+dx, ny = py+dy;
      if (nx > 0 && nx < MAP_W-1 && ny > 0 && ny < MAP_H-1 && m[ny][nx] === T.GRASS) m[ny][nx] = T.GRASS_LIGHT;
    }
  }
  // Flowers — north area (original courtyard zone)
  m[6][13] = T.FLOWER_YELLOW; m[6][15] = T.FLOWER_RED;   m[6][23] = T.FLOWER_WHITE; m[6][25] = T.FLOWER_YELLOW;
  m[7][16] = T.FLOWER;        m[7][23] = T.FLOWER_RED;
  m[8][13] = T.FLOWER_WHITE;  m[8][26] = T.FLOWER;
  m[9][15] = T.FLOWER_RED;    m[9][24] = T.FLOWER_YELLOW;
  m[10][12] = T.FLOWER;       m[10][14] = T.FLOWER_WHITE; m[10][25] = T.FLOWER_YELLOW; m[10][27] = T.FLOWER_RED;
  m[11][17] = T.FLOWER_RED;   m[11][21] = T.FLOWER_WHITE;
  m[12][12] = T.FLOWER_YELLOW; m[12][26] = T.FLOWER;
  m[13][14] = T.FLOWER;        m[13][17] = T.FLOWER_RED; m[13][22] = T.FLOWER_WHITE; m[13][25] = T.FLOWER_YELLOW;
  m[14][12] = T.FLOWER_RED;    m[14][23] = T.FLOWER;
  m[15][15] = T.FLOWER_WHITE;  m[15][22] = T.FLOWER_RED; m[15][27] = T.FLOWER_YELLOW;
  // Flowers — west and east outer strips
  m[5][5]  = T.FLOWER_RED;    m[5][8]  = T.FLOWER_YELLOW;
  m[8][3]  = T.FLOWER_WHITE;  m[8][7]  = T.FLOWER;
  m[12][5] = T.FLOWER_RED;    m[14][8] = T.FLOWER_YELLOW;
  m[5][32] = T.FLOWER_WHITE;  m[5][35] = T.FLOWER_RED;
  m[8][31] = T.FLOWER_YELLOW; m[10][34] = T.FLOWER;
  m[14][32] = T.FLOWER_RED;   m[16][35] = T.FLOWER_WHITE;
  // Flowers — south half of field
  m[18][5]  = T.FLOWER_RED;    m[18][12] = T.FLOWER_YELLOW; m[18][28] = T.FLOWER_WHITE; m[18][35] = T.FLOWER;
  m[20][8]  = T.FLOWER;        m[20][15] = T.FLOWER_RED;    m[20][25] = T.FLOWER_WHITE; m[20][32] = T.FLOWER_YELLOW;
  m[23][5]  = T.FLOWER_WHITE;  m[23][22] = T.FLOWER_RED;    m[23][35] = T.FLOWER_YELLOW;
  m[25][10] = T.FLOWER_RED;    m[25][15] = T.FLOWER;        m[25][25] = T.FLOWER_WHITE; m[25][30] = T.FLOWER_YELLOW;
  m[28][5]  = T.FLOWER;        m[28][12] = T.FLOWER_WHITE;  m[28][28] = T.FLOWER_RED;   m[28][35] = T.FLOWER_YELLOW;
  m[30][8]  = T.FLOWER_YELLOW; m[30][22] = T.FLOWER_RED;    m[30][32] = T.FLOWER_WHITE;
  m[33][5]  = T.FLOWER_RED;    m[33][15] = T.FLOWER;        m[33][25] = T.FLOWER_YELLOW; m[33][35] = T.FLOWER_WHITE;
  m[35][8]  = T.FLOWER_WHITE;  m[35][25] = T.FLOWER_RED;    m[35][32] = T.FLOWER_YELLOW;
  return m;
}

// Fixed stair positions per floor so navigation is deterministic.
// UP stairs lead back to the previous floor (or exit to Dragon's Gate); DOWN stairs lead deeper.
// Each floor's DOWN stairs share the same position as the next floor's UP stairs, so the
// player spawns exactly where they descended — no teleporting across the map.
//   F1 DOWN (25,25) == F2 UP (25,25)
//   F2 DOWN  (5, 5) == F3 UP  (5, 5)
// Entering from above → player spawns near STAIRS_UP on the destination floor.
// Going up (returning) → player spawns near STAIRS_DOWN on the destination floor.
const DUNGEON_STAIRS = {
  1: { up: {x:5, y:5},   down: {x:25, y:25} },  // up → exit to Dragon's Gate; down → floor 2
  2: { up: {x:25, y:25}, down: {x:5, y:5}   },  // up → floor 1; down → floor 3
  3: { up: {x:5, y:5},   down: {x:25, y:25} },  // up → floor 2; down present for connectivity (deepest floor — can't descend further)
};

// ─── Static hand-crafted dungeon floors ───────────────────────────────────────
// Three fixed layouts for the Dragon's Dungeon. Each run always produces the
// same map so players can learn routes and loot positions.
//
// Coordinate convention: m[y][x], origin top-left.
// Floor 1: UP at (5,5)   top-left     DOWN at (25,25) centre-right
// Floor 2: UP at (25,25) centre       DOWN at (5,5)   top-left
// Floor 3: UP at (5,5)   top-left     DOWN at (25,25) centre (deepest — no descent)

function generateDungeonFloor1() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.WALL));

  // ── Rooms ──────────────────────────────────────────────────────────────────
  fillRect(m,  2,  2, 12, 11, T.FLOOR);  // R1 Entrance Hall   (STAIRS_UP at 5,5)
  fillRect(m, 15,  2, 23,  9, T.FLOOR);  // R2 Guard Barracks
  fillRect(m, 27,  3, 36,  9, T.FLOOR);  // R3 East Alcove      dead end
  fillRect(m,  2, 15, 10, 23, T.FLOOR);  // R4 West Garrison
  fillRect(m, 13, 14, 24, 22, T.FLOOR);  // R5 Central Hall
  fillRect(m, 27, 13, 36, 21, T.FLOOR);  // R6 East Wing
  fillRect(m, 18, 24, 33, 33, T.FLOOR);  // R7 Exit Chamber    (STAIRS_DOWN at 25,25)
  fillRect(m,  2, 27, 10, 35, T.FLOOR);  // R8 Southwest Vault  dead end

  // ── Corridors ──────────────────────────────────────────────────────────────
  fillRect(m, 12,  5, 15,  8, T.FLOOR);  // R1 → R2  east
  fillRect(m, 23,  4, 27,  8, T.FLOOR);  // R2 → R3  east
  fillRect(m,  4, 11,  8, 15, T.FLOOR);  // R1 → R4  south
  fillRect(m, 17,  9, 20, 14, T.FLOOR);  // R2 → R5  south
  fillRect(m, 10, 17, 13, 20, T.FLOOR);  // R4 → R5  east
  fillRect(m, 24, 15, 27, 19, T.FLOOR);  // R5 → R6  east
  fillRect(m, 20, 22, 23, 26, T.FLOOR);  // R5 → R7  south
  fillRect(m, 29, 21, 32, 26, T.FLOOR);  // R6 → R7  south
  fillRect(m,  4, 23,  7, 27, T.FLOOR);  // R4 → R8  south

  // ── Chests ─────────────────────────────────────────────────────────────────
  m[ 5][20] = T.CHEST;  // R2
  m[ 6][32] = T.CHEST;  // R3
  m[19][ 7] = T.CHEST;  // R4
  m[18][19] = T.CHEST;  // R5
  m[17][31] = T.CHEST;  // R6
  m[29][28] = T.CHEST;  // R7
  m[31][ 6] = T.CHEST;  // R8

  // ── Stairs ─────────────────────────────────────────────────────────────────
  m[ 5][ 5] = T.STAIRS_UP;    // entrance from Dragon's Gate
  m[25][25] = T.STAIRS_DOWN;  // descent to floor 2

  return { map: m, rooms: [] };
}

function generateDungeonFloor2() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.WALL));

  // ── Rooms ──────────────────────────────────────────────────────────────────
  // Main path: R1 → R2 → R3 → R4 → R5 (shared edges, no extra corridors needed)
  fillRect(m, 20, 20, 31, 30, T.FLOOR);  // R1 Entry Chamber   (STAIRS_UP at 25,25)
  fillRect(m, 10, 21, 20, 29, T.FLOOR);  // R2 West Passage     shares x=20 with R1
  fillRect(m,  2, 18, 10, 28, T.FLOOR);  // R3 NW Hold          shares x=10 with R2
  fillRect(m,  2, 11, 11, 18, T.FLOOR);  // R4 North Alcove     shares y=18 with R3
  fillRect(m,  2,  2, 11, 11, T.FLOOR);  // R5 Descent Chamber (STAIRS_DOWN at 5,5) shares y=11 with R4
  fillRect(m, 13,  9, 24, 17, T.FLOOR);  // R6 Central North
  fillRect(m, 27,  2, 37, 12, T.FLOOR);  // R7 NE Wing          dead end
  fillRect(m, 32, 19, 38, 29, T.FLOOR);  // R8 East Alcove      dead end
  fillRect(m, 27, 32, 37, 38, T.FLOOR);  // R9 SE Dead End
  fillRect(m, 15, 31, 26, 38, T.FLOOR);  // R10 South Branch
  fillRect(m,  2, 30, 10, 37, T.FLOOR);  // R11 SW Corner

  // ── Corridors ──────────────────────────────────────────────────────────────
  fillRect(m, 11, 13, 13, 17, T.FLOOR);  // R4 → R6  east bridge
  fillRect(m, 24, 10, 27, 14, T.FLOOR);  // R6 → R7  east
  fillRect(m, 31, 22, 33, 27, T.FLOOR);  // R1 → R8  east
  fillRect(m, 25, 30, 29, 33, T.FLOOR);  // R1 → R9  south
  fillRect(m, 20, 30, 24, 32, T.FLOOR);  // R1 → R10 south
  fillRect(m,  3, 28,  7, 30, T.FLOOR);  // R3 → R11 south
  fillRect(m, 10, 33, 15, 36, T.FLOOR);  // R11 → R10 east

  // ── Chests ─────────────────────────────────────────────────────────────────
  m[25][15] = T.CHEST;  // R2
  m[23][ 6] = T.CHEST;  // R3
  m[15][ 7] = T.CHEST;  // R4
  m[13][19] = T.CHEST;  // R6
  m[ 7][32] = T.CHEST;  // R7
  m[24][35] = T.CHEST;  // R8
  m[35][32] = T.CHEST;  // R9
  m[35][20] = T.CHEST;  // R10
  m[34][ 6] = T.CHEST;  // R11

  // ── Stairs ─────────────────────────────────────────────────────────────────
  m[25][25] = T.STAIRS_UP;   // entrance from floor 1
  m[ 5][ 5] = T.STAIRS_DOWN; // descent to floor 3

  return { map: m, rooms: [] };
}

function generateDungeonFloor3() {
  let m = Array(MAP_H).fill(null).map(() => Array(MAP_W).fill(T.WALL));

  // ── Rooms ──────────────────────────────────────────────────────────────────
  fillRect(m,  2,  2, 11, 11, T.FLOOR);  // R1  Entry              (STAIRS_UP at 5,5)
  fillRect(m, 14,  2, 23,  9, T.FLOOR);  // R2  North Corridor Room
  fillRect(m, 27,  2, 37,  9, T.FLOOR);  // R3  Far NE              dead end
  fillRect(m, 22, 11, 28, 18, T.FLOOR);  // R4  East Entry Hall
  fillRect(m, 12, 12, 21, 19, T.FLOOR);  // R5  Boss Antechamber
  fillRect(m,  8, 20, 33, 34, T.FLOOR);  // R6  Boss Throne         large; STAIRS_DOWN at 25,25
  fillRect(m,  2, 22,  9, 33, T.FLOOR);  // R7  South Wing          adjacent to R6 at x=8/9
  fillRect(m,  3, 35, 12, 38, T.FLOOR);  // R8  Far South           dead end
  fillRect(m, 35, 20, 38, 30, T.FLOOR);  // R9  SE Vault            dead end
  fillRect(m, 34, 32, 38, 38, T.FLOOR);  // R10 SE Corner           dead end
  fillRect(m, 30, 11, 37, 18, T.FLOOR);  // R11 NE Stronghold       dead end
  fillRect(m,  2, 13, 10, 21, T.FLOOR);  // R12 West Room           adjacent to R7 at y=21/22

  // ── Corridors ──────────────────────────────────────────────────────────────
  fillRect(m, 11,  4, 14,  8, T.FLOOR);  // R1  → R2  east
  fillRect(m, 23,  4, 27,  8, T.FLOOR);  // R2  → R3  east
  fillRect(m,  4, 11,  8, 13, T.FLOOR);  // R1  → R12 south
  fillRect(m, 10, 14, 12, 18, T.FLOOR);  // R12 → R5  east
  fillRect(m, 17,  9, 20, 12, T.FLOOR);  // R2  → R5  south
  fillRect(m, 21, 13, 23, 17, T.FLOOR);  // R4  ↔ R5  bridge
  fillRect(m, 28, 13, 30, 17, T.FLOOR);  // R4  → R11 east bridge
  fillRect(m, 13, 19, 19, 21, T.FLOOR);  // R5  → R6  south (throne entrance)
  fillRect(m, 24, 18, 28, 21, T.FLOOR);  // R4  → R6  south
  fillRect(m, 30, 18, 33, 21, T.FLOOR);  // R11 → R6  south
  fillRect(m, 33, 22, 36, 27, T.FLOOR);  // R6  → R9  east
  fillRect(m, 35, 30, 37, 33, T.FLOOR);  // R9  → R10 south
  fillRect(m, 30,  9, 35, 11, T.FLOOR);  // R3  → R11 south
  fillRect(m,  4, 33,  8, 36, T.FLOOR);  // R7  → R8  south

  // ── Chests ─────────────────────────────────────────────────────────────────
  m[ 5][19] = T.CHEST;  // R2
  m[ 5][33] = T.CHEST;  // R3
  m[14][25] = T.CHEST;  // R4
  m[16][17] = T.CHEST;  // R5
  m[28][14] = T.CHEST;  // R6 west
  m[30][29] = T.CHEST;  // R6 east
  m[27][ 6] = T.CHEST;  // R7
  m[37][ 7] = T.CHEST;  // R8
  m[25][37] = T.CHEST;  // R9
  m[35][36] = T.CHEST;  // R10
  m[14][33] = T.CHEST;  // R11
  m[17][ 6] = T.CHEST;  // R12

  // ── Stairs ─────────────────────────────────────────────────────────────────
  m[ 5][ 5] = T.STAIRS_UP;    // entrance from floor 2
  m[25][25] = T.STAIRS_DOWN;  // deepest floor — cannot descend further

  return { map: m, rooms: [] };
}

function generateDungeon(floor) {
  if (floor === 1) return generateDungeonFloor1();
  if (floor === 2) return generateDungeonFloor2();
  if (floor === 3) return generateDungeonFloor3();
  return generateDungeonFloor1();
}

function carveCorridor(m, x1, y1, x2, y2) {
  let x = x1, y = y1;
  while (x !== x2) {
    if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) m[y][x] = T.FLOOR;
    x += x < x2 ? 1 : -1;
  }
  while (y !== y2) {
    if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) m[y][x] = T.FLOOR;
    y += y < y2 ? 1 : -1;
  }
}

function fillRect(m, x1, y1, x2, y2, t) {
  for (let y = y1; y <= y2; y++)
    for (let x = x1; x <= x2; x++)
      if (y >= 0 && y < MAP_H && x >= 0 && x < MAP_W) m[y][x] = t;
}

const FLOOR_LIKE = new Set([T.FLOOR, T.VOLCANIC_FLOOR, T.SNOW, T.SHADOW_FLOOR, T.SACRED_GROUND, T.DG_FLOOR, T.ELVEN_FLOOR, T.SAND, T.PLANK_FLOOR, T.DOCK, T.ABYSS_FLOOR, T.SUNKEN_FLOOR, T.HELL_FLOOR]);
function isFloorLike(t) { return FLOOR_LIKE.has(t); }

function findNearestFloor(map, x, y) {
  if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H && isFloorLike(map[y][x])) return { x, y };
  for (let r = 1; r < Math.max(MAP_W, MAP_H); r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H && isFloorLike(map[ny][nx])) return { x: nx, y: ny };
      }
    }
  }
  return { x, y };
}

// Area map generators for explorable areas are in map_areas.js.

let maps = {
  town:             generateTown(),
  world:            generateWorldMap(),
  elven_town:       generateElvenTown(),
  dragons_gate:     generateDragonsGate(),
  rogue_cove:       generateRogueCove(),
  training_grounds: generateTrainingGrounds(),
  volcanic_wastes:  generateVolcanicWastes(),
  frozen_peaks:     generateFrozenPeaks(),
  shadow_forest:    generateShadowForest(),
  dwarf_fortress:   generateDwarfFortress(),
  ruins_aethoria:   generateRuinsAethoria(),
  the_abyss:        generateTheAbyss(),
  sunken_temple:    generateSunkenTemple(),
  the_underworld:   generateTheUnderworld(),
};
let dungeonData = {};
let currentFloor = 0;

// Tracks statically-generated dungeon maps so the same layout is reused each session.
// Populated on first entry to each floor; persisted via save/load.
let generatedMaps = {
  dragons_dungeon_floor_1: null,
  dragons_dungeon_floor_2: null,
  dragons_dungeon_floor_3: null,
};

function getMap() {
  return maps[game.currentMap] || dungeonData[game.currentMap]?.map || maps.town;
}
