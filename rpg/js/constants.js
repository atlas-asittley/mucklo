// constants.js — Global constants shared across all modules: canvas contexts,
// tile size (TILE=48), map dimensions (MAP_W/MAP_H=40), and the tile type enum (T).
// Loaded first; no dependencies.

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
const TILE = 48;
const MAP_W = 40, MAP_H = 40;

// Tile type enum
const T = { GRASS:0, WALL:1, FLOOR:2, DOOR:3, WATER:4, PATH:5, CHEST:6, STAIRS_DOWN:7, STAIRS_UP:8, SIGN:9, RING:10,
            GATE:11, WORLD_TOWN:12, WORLD_DUNGEON:13, FOREST:14, MOUNTAIN:15, WORLD_ELVEN_TOWN:16,
            ELVEN_WALL:17, ELVEN_FLOOR:18, ELVEN_PATH:19, MOONWELL:20, TREE_OF_LIFE:21,
            WORLD_DRAGONS_GATE:22, DG_WALL:23, DG_FLOOR:24,
            WORLD_BOSS_DRAGON:25, WORLD_BOSS_GOLEM:26, WORLD_BOSS_HYDRA:27,
            WOOD_WALL:28, PLANK_FLOOR:29, SAND:30, DOCK:31, TAVERN_SIGN:32, WORLD_ROGUES_COVE:33,
            FLOWER:34, DUMMY:35,
            // ── New area tiles ─────────────────────────────────────────────────
            LAVA:36, VOLCANIC_WALL:37, VOLCANIC_FLOOR:38,       // Volcanic Wastes
            SNOW:39, ICE_WALL:40,                               // Frozen Peaks
            SHADOW_FLOOR:41,                                    // Shadow Forest
            FORGE_GLOW:42,                                      // Dwarf Fortress
            SACRED_GROUND:43, BROKEN_PILLAR:44,                 // Ruins of Aethoria
            // ── New world map markers ───────────────────────────────────────────
            WORLD_VOLCANIC_WASTES:45, WORLD_FROZEN_PEAKS:46,
            WORLD_SHADOW_FOREST:47, WORLD_DWARF_FORTRESS:48, WORLD_AETHORIA:49,
            // ── The Abyss ──────────────────────────────────────────────────────
            ABYSS_FLOOR:50, ABYSS_WALL:51, VOID_RIFT:52, WORLD_ABYSS:53,
            // ── Sunken Temple ──────────────────────────────────────────────────
            SUNKEN_FLOOR:54, SUNKEN_WALL:55, WORLD_SUNKEN_TEMPLE:56,
            // ── The Underworld ─────────────────────────────────────────────────
            HELL_FLOOR:57, HELL_WALL:58, WORLD_UNDERWORLD:59,
            // ── Training Grounds grass/flower variants ──────────────────────────
            GRASS_DARK:60, GRASS_LIGHT:61, FLOWER_RED:62, FLOWER_WHITE:63, FLOWER_YELLOW:64 };
