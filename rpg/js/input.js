// input.js — Keyboard (WASD/arrows, I/E/S/Escape shortcuts, debug hotkeys),
// canvas click-to-move, and floating virtual joystick for touch/mobile.
// Depends on: gameplay.js (movePlayer, interactInDirection), ui.js, debug.js.

document.addEventListener('keydown', e => {
  if (e.key==='`'||e.key==='~') { toggleDebugMode(); return; }
  if (debugMode) {
    if (e.key==='1') { cheatSkillPoints(); return; }
    if (e.key==='2') { cheatGold(); return; }
    if (e.key==='3') { cheatLevelUp(); return; }
    if (e.key==='4') { cheatFullHeal(); return; }
    if (e.key==='5') { cheatItems(); return; }
    if (e.key==='6') { cheatGodMode(); return; }
    if (e.key==='7') { cheatInstantKill(); return; }
    if (e.key==='8') { teleportMenu(); return; }
    if (e.key==='9') { openDebugPanel(); return; }
  }
  if (e.key==='ArrowUp'||e.key==='w') { e.preventDefault(); movePlayer(0,-1); }
  if (e.key==='ArrowDown'||e.key==='s') { e.preventDefault(); movePlayer(0,1); }
  if (e.key==='ArrowLeft'||e.key==='a') { e.preventDefault(); movePlayer(-1,0); }
  if (e.key==='ArrowRight'||e.key==='d') { e.preventDefault(); movePlayer(1,0); }
  if (e.key==='i'||e.key==='I') {
    if (document.getElementById('inventory-screen').style.display==='flex') closeInventory();
    else openInventory();
  }
  if (e.key==='e'||e.key==='E') {
    let inv = document.getElementById('inventory-screen');
    if (inv.style.display==='flex' && inventoryTab==='equipped') closeInventory();
    else openEquipScreen();
  }
  if (e.key==='S') {
    if (document.getElementById('stats-screen').style.display==='flex') closeStats();
    else openStats();
  }
  if (e.key==='Escape') {
    closeInventory(); closeShop(); closeStats();
  }
});

let lastTouchEnd = 0;
canvas.addEventListener('click', e => {
  if (Date.now() - lastTouchEnd < 350) return; // suppress ghost click after touch
  let rect = canvas.getBoundingClientRect();
  let cx = e.clientX - rect.left, cy = e.clientY - rect.top;
  let px = canvas.width / 2, py = canvas.height / 2;
  let dx = cx - px, dy = cy - py;
  if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
  if (Math.abs(dx) > Math.abs(dy)) interactInDirection(dx > 0 ? 1 : -1, 0);
  else interactInDirection(0, dy > 0 ? 1 : -1);
});

document.getElementById('btn-inv').onclick = () => {
  if (document.getElementById('inventory-screen').style.display==='flex') closeInventory(); else openInventory();
  closeHudMenu();
};

document.getElementById('btn-stats').onclick = () => {
  if (document.getElementById('stats-screen').style.display==='flex') closeStats(); else openStats();
  closeHudMenu();
};

// ── FLOATING VIRTUAL JOYSTICK ─────────────────────────────────────────────────
(function() {
  const base = document.getElementById('joystick-base');
  const stick = document.getElementById('joystick-stick');
  const HALF = 55;          // half of joystick-base size (110px / 2)
  const RADIUS = 40;        // max stick travel px from center
  const MOVE_INTERVAL = 200; // ms between tile moves
  let active = false, touchId = null;
  let jcx = 0, jcy = 0;    // joystick center in client coords
  let startX = 0, startY = 0;
  let moveTimer = null;
  let curDx = 0, curDy = 0;

  function startMove() {
    if (moveTimer) return;
    moveTimer = setInterval(() => {
      if (curDx !== 0 || curDy !== 0) movePlayer(curDx, curDy);
    }, MOVE_INTERVAL);
  }

  function stopMove() {
    clearInterval(moveTimer); moveTimer = null;
    curDx = 0; curDy = 0;
  }

  function showJoystick(clientX, clientY) {
    jcx = clientX;
    jcy = clientY;
    base.style.left = (clientX - HALF) + 'px';
    base.style.top  = (clientY - HALF) + 'px';
    base.style.display = 'block';
    stick.style.transform = 'translate(-50%, -50%)';
    base.classList.add('active');
  }

  function hideJoystick() {
    base.style.display = 'none';
    base.classList.remove('active');
    stick.style.transform = 'translate(-50%, -50%)';
  }

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (active) return;
    let t = e.changedTouches[0];
    touchId = t.identifier;
    startX = t.clientX;
    startY = t.clientY;
    active = true;
    showJoystick(t.clientX, t.clientY);
    startMove();
  }, {passive: false});

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    let t = Array.from(e.changedTouches).find(t => t.identifier === touchId);
    if (!t) return;
    let ox = t.clientX - jcx, oy = t.clientY - jcy;
    let dist = Math.sqrt(ox * ox + oy * oy);
    let clamp = Math.min(dist, RADIUS);
    let angle = Math.atan2(oy, ox);
    let sx = Math.cos(angle) * clamp, sy = Math.sin(angle) * clamp;
    stick.style.transform = `translate(calc(-50% + ${sx}px), calc(-50% + ${sy}px))`;
    if (dist > 12) {
      if (Math.abs(ox) > Math.abs(oy)) { curDx = ox > 0 ? 1 : -1; curDy = 0; }
      else                             { curDx = 0; curDy = oy > 0 ? 1 : -1; }
    } else {
      curDx = 0; curDy = 0;
    }
  }, {passive: false});

  function onEnd(e) {
    if (!active) return;
    let t = Array.from(e.changedTouches).find(t => t.identifier === touchId);
    if (!t) return;
    let dx = t.clientX - startX, dy = t.clientY - startY;
    active = false; touchId = null;
    stopMove(); hideJoystick();
    lastTouchEnd = Date.now();
    // Short tap with minimal drag: interact in direction from canvas center
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      let rect = canvas.getBoundingClientRect();
      let cx = t.clientX - rect.left, cy = t.clientY - rect.top;
      let px = canvas.width / 2, py = canvas.height / 2;
      let tdx = cx - px, tdy = cy - py;
      if (Math.abs(tdx) < 4 && Math.abs(tdy) < 4) return;
      if (Math.abs(tdx) > Math.abs(tdy)) interactInDirection(tdx > 0 ? 1 : -1, 0);
      else interactInDirection(0, tdy > 0 ? 1 : -1);
    }
  }

  function onCancel() {
    if (!active) return;
    active = false; touchId = null;
    stopMove(); hideJoystick();
    lastTouchEnd = Date.now();
  }

  canvas.addEventListener('touchend', onEnd, {passive: false});
  canvas.addEventListener('touchcancel', onCancel, {passive: false});
})();

// ── SECRET TRIPLE-TAP TOP-LEFT CORNER (debug mode) ───────────────────────────
(function() {
  let taps = [];
  document.addEventListener('touchstart', e => {
    let t = e.touches[0];
    if (t.clientX > 60 || t.clientY > 60) return;
    let now = Date.now();
    taps = taps.filter(ts => now - ts < 1000);
    taps.push(now);
    if (taps.length >= 3) { taps = []; toggleDebugMode(); }
  }, {passive: true});
})();
