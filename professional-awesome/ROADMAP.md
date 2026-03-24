# Realm of Atlas - Development Roadmap

## Phase 1: Core RPG ✅
- [x] Town with NPCs
- [x] 3-floor dungeon
- [x] Turn-based combat
- [x] Inventory & equipment
- [x] Leveling system
- [x] Shop & gold
- [x] Save/load (localStorage)
- [x] Mobile + desktop controls

## Phase 2: Visual Overhaul 🔄 (in progress)
- [ ] Textured tiles (gradients, patterns)
- [ ] Drawn sprites (replace emoji)
- [ ] Smooth movement animations
- [ ] Combat animations (hit flash, shake, death)
- [ ] Particle effects (chest, level up, dungeon)
- [ ] Better UI panels (inventory, shop)
- [ ] Toast notifications
- [ ] Better mobile controls

## Phase 3: Refactor & Polish
- [ ] Extract code into modules (Player, Enemy, Combat, Inventory, Map, UI)
- [ ] Constants/config file for easy tweaking
- [ ] Better save system (versioned saves)
- [ ] Sound effects (simple Web Audio beeps)
- [ ] Minimap

## Phase 4: Building System
- [ ] Place structures on empty tiles
- [ ] Build types: House, Farm, Workshop, Tavern
- [ ] Resource system (wood, stone, gold)
- [ ] Buildings have gameplay effects (shop discounts, healing, etc.)

## Phase 5: NPC System Expansion
- [ ] Hire NPCs from town
- [ ] NPCs assigned to buildings
- [ ] NPCs generate passive income/resources
- [ ] NPC quests (bring X items, defeat Y enemies)

## Phase 6: Farming System
- [ ] Plant crops on farm plots
- [ ] Growth timer (real-time or turn-based)
- [ ] Harvest for gold/items/ingredients
- [ ] Cooking/potion crafting from ingredients

## Phase 7: Expanded World
- [ ] More dungeon floors (5-10)
- [ ] New enemy types per floor
- [ ] Rare/boss drops
- [ ] Town upgrades (visual changes as you build)
- [ ] Multiple biomes (forest, cave, ice, fire)

## Refactoring Notes
- Refactor after every 2-3 feature additions
- Keep file size under control (split if >100KB)
- Test mobile controls after every change
- Maintain backward-compatible saves
