// ui_combat.js — Out-of-combat skills panel.
// Shows skills the player can use outside of combat (heal, quick_step, etc.)
// and routes to the appropriate effect handler.
// Note: In-combat skill rendering (renderCombatSkills, toggleCombatSkills, etc.)
// lives in combat_skills.js.
// Depends on: state.js, data.js, combat_skills.js (incrementSkillXP, getSkillRankMult),
//             ui_hud.js (toast), gameplay.js (msg).

// Skills that can be used without a combat target.
const OC_SKILLS = ['heal', 'quick_step'];

function openOutOfCombatSkills() {
  let panel = document.getElementById('oc-skills-screen');
  panel.style.display = 'flex';
  let list = document.getElementById('oc-skills-list');
  list.innerHTML = '';
  let learned = game.player.learnedSkills || [];
  if (learned.length === 0) {
    list.innerHTML = '<div class="combat-skills-empty">No skills learned. Visit the Trainer!</div>';
    return;
  }
  for (let skillId of learned) {
    let skill = skillDefs[skillId];
    if (!skill) continue;
    let usable = OC_SKILLS.includes(skillId);
    let stars = getSkillStars(skillId);
    let rankName = SKILL_RANKS[getSkillRank(skillId)];
    let btn = document.createElement('button');
    btn.className = usable ? 'btn btn-skill' : 'btn btn-skill-combat-only';
    btn.innerHTML = `${skill.icon} ${skill.name}${usable ? '' : ' <span style="font-size:6px;opacity:0.7">(combat only)</span>'}<div class="skill-rank-stars" title="${rankName}">${stars}</div>`;
    btn.onclick = () => useOutOfCombatSkill(skillId);
    list.appendChild(btn);
  }
}

function closeOutOfCombatSkills() {
  document.getElementById('oc-skills-screen').style.display = 'none';
}

function useOutOfCombatSkill(skillId) {
  if (!OC_SKILLS.includes(skillId)) {
    toast('Only usable in combat!', '');
    return;
  }
  closeOutOfCombatSkills();
  switch (skillId) {
    case 'heal': {
      incrementSkillXP('heal');
      let healAmt = Math.floor(game.player.maxHp * 0.3 * getSkillRankMult('heal'));
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + healAmt);
      toast(`Heal! +${healAmt} HP`, 'green');
      msg(`You used Heal and restored ${healAmt} HP.`);
      break;
    }
    case 'quick_step': {
      toast('Quick Step ready for next combat!', 'green');
      msg('Quick Step used! You are ready to dodge the first attack in your next battle.');
      break;
    }
  }
}
