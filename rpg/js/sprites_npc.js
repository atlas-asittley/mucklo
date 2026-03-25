// sprites_npc.js — Router for pixel-art NPC/creature sprite rendering.
// Delegates to sprites_npc_town.js (town/elven NPCs) and sprites_npc_areas.js
// (Training Grounds creatures + world-area enemies).
// Called by drawPixelSprite() in sprites.js via a default case.
// Returns true if the key was handled, false otherwise.
// Depends on: sprites_npc_town.js, sprites_npc_areas.js.

function drawNpcSprite(c, key, f) {
  if (drawNpcSpriteTown(c, key, f)) return true;
  return drawNpcSpriteAreas(c, key, f);
}
