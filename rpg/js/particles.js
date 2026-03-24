// particles.js — Particle system: spawn, update, and draw screen-space particles.
// Depends on: constants.js (pCanvas, pCtx), state.js (camX, camY).

let particles = [];
function spawnParticles(wx, wy, type) {
  let sx = wx - camX, sy = wy - camY;
  if (type === 'chest') {
    for (let i = 0; i < 20; i++) {
      let a = Math.random() * Math.PI * 2;
      let spd = 1.5 + Math.random() * 2.5;
      particles.push({ x:sx, y:sy, vx:Math.cos(a)*spd, vy:Math.sin(a)*spd-2,
        life:1, decay:0.02+Math.random()*0.02, size:3+Math.random()*3,
        color:`hsl(${40+Math.random()*30},90%,${55+Math.random()*20}%)` });
    }
  } else if (type === 'levelup') {
    for (let i = 0; i < 35; i++) {
      let a = Math.random() * Math.PI * 2;
      let spd = 1 + Math.random() * 3;
      particles.push({ x:sx, y:sy, vx:Math.cos(a)*spd, vy:Math.sin(a)*spd-1,
        life:1, decay:0.015+Math.random()*0.015, size:2+Math.random()*4,
        color:`hsl(${50+Math.random()*20},100%,${60+Math.random()*20}%)` });
    }
    // Text pop
    particles.push({ x:sx, y:sy-30, vx:0, vy:-0.5, life:1, decay:0.012,
      size:0, color:'#f1c40f', text:'LEVEL UP!' });
  } else if (type === 'dungeon') {
    for (let i = 0; i < 25; i++) {
      let a = Math.random() * Math.PI * 2;
      let spd = 0.8 + Math.random() * 2;
      particles.push({ x:sx, y:sy, vx:Math.cos(a)*spd, vy:Math.sin(a)*spd,
        life:1, decay:0.018+Math.random()*0.018, size:2+Math.random()*3,
        color:`hsl(${260+Math.random()*40},80%,${40+Math.random()*30}%)` });
    }
  } else if (type === 'hit') {
    for (let i = 0; i < 8; i++) {
      let a = Math.random() * Math.PI * 2;
      particles.push({ x:sx, y:sy, vx:Math.cos(a)*2, vy:Math.sin(a)*2,
        life:1, decay:0.06, size:2+Math.random()*2, color:'#e74c3c' });
    }
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.06;
    p.life -= p.decay;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  for (let p of particles) {
    pCtx.globalAlpha = p.life;
    if (p.text) {
      pCtx.fillStyle = p.color;
      pCtx.font = "bold 11px 'Press Start 2P', monospace";
      pCtx.fillText(p.text, p.x - 32, p.y);
    } else {
      pCtx.fillStyle = p.color;
      pCtx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    }
  }
  pCtx.globalAlpha = 1;
}
