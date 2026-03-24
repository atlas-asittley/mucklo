// render.js — Main render loop: canvas resize, tile/entity/NPC/enemy/corpse drawing,
// smooth camera and player interpolation, vignette overlays, HUD stat updates,
// drunk tint and quest indicator updates, and location indicator.
// Depends on: all other modules. Drives the game loop via requestAnimationFrame.

// Cached vignette gradient — recreated only when canvas dimensions change.
let _vignetteGradient = null;
let _vignetteW = 0, _vignetteH = 0;

function getVignetteGradient() {
  if (!_vignetteGradient || _vignetteW !== canvas.width || _vignetteH !== canvas.height) {
    _vignetteW = canvas.width;
    _vignetteH = canvas.height;
    _vignetteGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
      canvas.width / 2, canvas.height / 2, canvas.height * 0.9
    );
    _vignetteGradient.addColorStop(0, 'rgba(0,0,0,0)');
    _vignetteGradient.addColorStop(1, 'rgba(0,0,0,0.55)');
  }
  return _vignetteGradient;
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 72;
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
  canvas.style.marginTop = '72px';
  _vignetteGradient = null; // invalidate cached gradient on resize
}
window.addEventListener('resize', resize);
resize();

function render() {
  tick++;
  // Smooth camera
  targetCamX = game.player.x * TILE - canvas.width/2 + TILE/2;
  targetCamY = game.player.y * TILE - canvas.height/2 + TILE/2;
  camX += (targetCamX - camX) * 0.12;
  camY += (targetCamY - camY) * 0.12;

  // Smooth player position
  playerTargetX = game.player.x * TILE;
  playerTargetY = game.player.y * TILE;
  playerVisX += (playerTargetX - playerVisX) * 0.25;
  playerVisY += (playerTargetY - playerVisY) * 0.25;

  const isDungeon        = isDungeonMap(game.currentMap);
  const isWorld          = game.currentMap === 'world';
  const isElvenTown      = game.currentMap === 'elven_town';
  const isDragonsGate    = game.currentMap === 'dragons_gate';
  const isRogueCove      = game.currentMap === 'rogue_cove';
  const isVolcanicWastes = game.currentMap === 'volcanic_wastes';
  const isFrozenPeaks    = game.currentMap === 'frozen_peaks';
  const isShadowForest   = game.currentMap === 'shadow_forest';
  const isDwarfFortress  = game.currentMap === 'dwarf_fortress';
  const isRuinsAethoria  = game.currentMap === 'ruins_aethoria';
  const isTheAbyss       = game.currentMap === 'the_abyss';
  const isSunkenTemple   = game.currentMap === 'sunken_temple';
  const isTheUnderworld  = game.currentMap === 'the_underworld';
  // Background
  ctx.fillStyle = isDungeon ? '#0e0e22'
    : isDragonsGate    ? '#0d0505'
    : isWorld          ? '#0d1a0a'
    : isElvenTown      ? '#0c1a10'
    : isRogueCove      ? '#1a0f0a'
    : isVolcanicWastes ? '#100200'
    : isFrozenPeaks    ? '#050d14'
    : isShadowForest   ? '#020403'
    : isDwarfFortress  ? '#080808'
    : isRuinsAethoria  ? '#100e04'
    : isTheAbyss       ? '#0c0c18'
    : isSunkenTemple   ? '#030e16'
    : isTheUnderworld  ? '#160404'
    : '#101a08';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let map = getMap();

  // Draw tiles
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      let sx = Math.floor(x * TILE - camX);
      let sy = Math.floor(y * TILE - camY);
      if (sx < -TILE || sx > canvas.width + TILE || sy < -TILE || sy > canvas.height + TILE) continue;
      drawTile(ctx, sx, sy, map[y][x], x, y, isDungeon);
    }
  }

  // World map location labels
  if (isWorld) {
    const worldLocations = [
      { x: 19, y: 13, name: 'ATLAS TOWN',      color: '#f1c40f' },
      { x: 19, y: 25, name: "DRAGON'S GATE",   color: '#f1c40f' },
      { x: 26, y: 8,  name: 'ELVEN TOWN',      color: '#f1c40f' },
      { x: 5,  y: 34, name: "ROGUE'S COVE",    color: '#d4a000' },
      { x: 4,  y: 29, name: 'VOLCANIC WASTES', color: '#ff4500' },
      { x: 5,  y: 1,  name: 'FROZEN PEAKS',    color: '#a8d8ea' },
      { x: 37, y: 19, name: 'SHADOW FOREST',   color: '#3d6020' },
      { x: 37, y: 9,  name: 'DWARF FORTRESS',  color: '#cd9b1d' },
      { x: 25, y: 19, name: 'RUINS AETHORIA',  color: '#d4a017' },
      { x: 19, y: 36, name: 'THE ABYSS',       color: '#8000cc' },
      { x: 15, y: 36, name: 'THE UNDERWORLD',  color: '#cc0000' },
      { x: 30, y: 31, name: 'SUNKEN TEMPLE',   color: '#1a7aaa' },
    ];
    // World boss markers (shown in red; grayed out if defeated)
    const worldBossLabels = [
      { x: 4,  y: 32, name: 'ELDER DRAGON',  flagKey: 'boss_elder_dragon_dead', tile: T.WORLD_BOSS_DRAGON },
      { x: 29, y: 4,  name: 'TITAN GOLEM',   flagKey: 'boss_titan_golem_dead',  tile: T.WORLD_BOSS_GOLEM  },
      { x: 5,  y: 26, name: 'VOID HYDRA',    flagKey: 'boss_void_hydra_dead',   tile: T.WORLD_BOSS_HYDRA  },
    ];
    ctx.font = "7px 'Press Start 2P', monospace";
    for (let loc of worldLocations) {
      let lsx = Math.floor(loc.x * TILE - camX);
      let lsy = Math.floor(loc.y * TILE - camY);
      let tw = loc.name.length * 6 + 10;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(lsx + TILE - tw/2, lsy - 14, tw, 12);
      ctx.fillStyle = loc.color;
      ctx.fillText(loc.name, lsx + TILE - tw/2 + 5, lsy - 5);
    }
    for (let boss of worldBossLabels) {
      let lsx = Math.floor(boss.x * TILE - camX);
      let lsy = Math.floor(boss.y * TILE - camY);
      let dead = game.flags[boss.flagKey];
      let label = dead ? boss.name + ' [SLAIN]' : '!! ' + boss.name + ' !!';
      let tw = label.length * 6 + 10;
      ctx.fillStyle = dead ? 'rgba(0,0,0,0.6)' : 'rgba(60,0,0,0.85)';
      ctx.fillRect(lsx + TILE - tw/2, lsy - 14, tw, 12);
      ctx.fillStyle = dead ? '#666' : '#e74c3c';
      ctx.fillText(label, lsx + TILE - tw/2 + 5, lsy - 5);
    }
  }

  // Dungeon / Dragon's Gate / The Abyss / The Underworld vignette overlay (dark corners)
  if (isDungeon || isDragonsGate || isTheAbyss || isTheUnderworld) {
    ctx.fillStyle = getVignetteGradient();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw NPCs
  let npcList = npcs[game.currentMap] || [];
  for (let npc of npcList) {
    let sx = Math.floor(npc.x * TILE - camX);
    let sy = Math.floor(npc.y * TILE - camY);
    if (sx < -TILE || sx > canvas.width+TILE || sy < -TILE || sy > canvas.height+TILE) continue;
    drawPixelSprite(ctx, sx, sy, npc.drawKey, 0);
    // Name tag on hover proximity
    let pdx = npc.x - game.player.x, pdy = npc.y - game.player.y;
    if (Math.abs(pdx) <= 2 && Math.abs(pdy) <= 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      let tw = npc.name.length * 6 + 8;
      ctx.fillRect(sx + TILE/2 - tw/2, sy - 14, tw, 12);
      ctx.fillStyle = '#f1c40f';
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText(npc.name, sx + TILE/2 - tw/2 + 4, sy - 5);
    }
  }

  // Draw enemies
  for (let e of enemies) {
    if (e.defeated) continue;
    let sx = Math.floor(e.x * TILE - camX);
    let sy = Math.floor(e.y * TILE - camY);
    if (sx < -TILE || sx > canvas.width+TILE || sy < -TILE || sy > canvas.height+TILE) continue;
    ctx.globalAlpha = e.opacity !== undefined ? e.opacity : 1;
    drawPixelSprite(ctx, sx, sy, e.drawKey, Math.floor(tick/10)%2);
    // Boss indicator
    if (e.isBoss) {
      ctx.fillStyle = '#e74c3c';
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText('BOSS', sx+2, sy-3);
    }
    ctx.globalAlpha = 1;
  }

  // Draw corpse marker
  if (game.corpse && game.corpse.map === game.currentMap) {
    let cx = Math.floor(game.corpse.x * TILE - camX);
    let cy = Math.floor(game.corpse.y * TILE - camY);
    if (cx >= -TILE && cx <= canvas.width + TILE && cy >= -TILE && cy <= canvas.height + TILE) {
      ctx.font = `${TILE - 4}px serif`;
      ctx.fillText('\u{1F480}', cx + 2, cy + TILE - 4);
      let pdx = Math.abs(game.corpse.x - game.player.x);
      let pdy = Math.abs(game.corpse.y - game.player.y);
      if (pdx <= 1 && pdy <= 1) {
        let label = 'RECOVER GEAR';
        let tw = label.length * 6 + 10;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(cx + TILE / 2 - tw / 2, cy - 17, tw, 13);
        ctx.fillStyle = '#f1c40f';
        ctx.font = "7px 'Press Start 2P', monospace";
        ctx.fillText(label, cx + TILE / 2 - tw / 2 + 5, cy - 7);
      }
    }
  }

  // Draw player (smooth position)
  let px = Math.floor(playerVisX - camX);
  let py = Math.floor(playerVisY - camY);
  if (playerFlashTimer > 0) {
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(playerFlashTimer);
    playerFlashTimer--;
  }
  const playerClass = (game.player && game.player.class) || 'warrior';
  drawPixelSprite(ctx, px, py, 'player_' + playerClass, Math.floor(tick/8)%2);
  ctx.globalAlpha = 1;

  // Update timers
  if (enemyFlashTimer > 0) enemyFlashTimer--;

  // Update & draw particles
  updateParticles();
  drawParticles();

  updateUI();
  updateDebugInfo();
  // Keep combat sprites animated every frame
  if (document.getElementById('combat-screen').style.display === 'flex' && combatEnemy) {
    drawEnemyCombat(combatEnemy.drawKey);
    drawPlayerCombat();
  }
  requestAnimationFrame(render);
}

function updateLocationIndicator() {
  let el = document.getElementById('location-indicator');
  if (!el) return;
  let name;
  switch (game.currentMap) {
    case 'town':             name = 'Town'; break;
    case 'world':            name = 'World Map'; break;
    case 'elven_town':       name = 'Elven Town'; break;
    case 'dragons_gate':     name = "Dragon's Gate"; break;
    case 'rogue_cove':       name = "Rogue's Cove"; break;
    case 'training_grounds':  name = 'Training Grounds'; break;
    case 'volcanic_wastes':   name = 'Volcanic Wastes';  break;
    case 'frozen_peaks':      name = 'Frozen Peaks';     break;
    case 'shadow_forest':     name = 'Shadow Forest';    break;
    case 'dwarf_fortress':    name = 'Dwarf Fortress';   break;
    case 'ruins_aethoria':    name = 'Ruins of Aethoria'; break;
    default:
      if (isDungeonMap(game.currentMap)) {
        name = `Dungeon Level ${currentFloor}/3`;
      } else {
        name = game.currentMap;
      }
  }
  el.textContent = '[ ' + name + ' ]';
}

function updateUI() {
  let p = game.player;
  document.getElementById('hp-val').textContent = `${p.hp}/${p.maxHp}`;
  document.getElementById('hp-bar-fill').style.width = (p.hp/p.maxHp*100) + '%';
  document.getElementById('lvl-val').textContent = p.lvl;
  document.getElementById('xp-val').textContent = `${p.xp}/${p.xpNext}`;
  document.getElementById('xp-bar-fill').style.width = (p.xp/p.xpNext*100) + '%';
  document.getElementById('gold-val').textContent = p.gold;
  // Drunk HUD indicator and screen tint
  let drunkEl = document.getElementById('drunk-indicator');
  let tintEl  = document.getElementById('drunk-tint');
  let drunk   = p.drunkLevel || 0;
  if (drunkEl) {
    drunkEl.style.display = drunk > 0 ? 'inline-block' : 'none';
    document.getElementById('drunk-val').textContent = drunk;
  }
  if (tintEl) tintEl.style.opacity = drunk > 0 ? Math.min(0.25, drunk * 0.004) : 0;
  // MP HUD indicator
  let mpEl = document.getElementById('mp-indicator');
  if (mpEl) {
    if (p.maxMana && p.maxMana > 0) {
      mpEl.style.display = 'flex';
      let mpVal = document.getElementById('mp-val');
      let mpFill = document.getElementById('mp-bar-fill');
      if (mpVal) mpVal.textContent = `${Math.floor(p.mana || 0)}/${p.maxMana}`;
      if (mpFill) mpFill.style.width = (Math.max(0, p.mana || 0) / p.maxMana * 100) + '%';
    } else {
      mpEl.style.display = 'none';
    }
  }
  updateLocationIndicator();
}
