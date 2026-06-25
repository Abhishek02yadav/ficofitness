// FicoFit V2 FINAL — App Logic — NO EMOJI IN THIS FILE
'use strict';

const STORAGE_KEY = 'ficofit_v3';

const DEFAULT_STATE = {
  completedExercises:  {},
  completedMeals:      {},
  completedSupps:      {},
  completedWorkouts:   {},
  waterGlasses:        {},
  currentStreak:       0,
  longestStreak:       0,
  lastWorkoutDate:     null,
  achievements:        [],
  totalXP:             0,
  calorieDaysHit:      [],
  proteinDaysHit:      [],
  strengthGoals:       { benchPress: '', squat: '', deadlift: '', pullups: '' },
};

// ── State ─────────────────────────────────────────────────────────────────────

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const saved = JSON.parse(raw);
    return Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_STATE)), saved);
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function todayDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function getWeekMonday(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function getGreeting() {
  const map = {
    morning:   'Morning session. Make it count.',
    afternoon: 'Afternoon grind. Stay locked in.',
    evening:   'Evening session. Finish strong.',
  };
  return map[getTimeOfDay()];
}

// ── XP & Levels ───────────────────────────────────────────────────────────────

function awardXP(amount, reason) {
  const prevLevel = getLevel();
  state.totalXP += amount;
  saveState();
  const newLevel = getLevel();
  if (newLevel.lvl > prevLevel.lvl) showLevelUpOverlay(newLevel);
  updateXPBar();
  if (reason) showXPToast('+' + amount + ' XP  ' + reason);
}

function getLevel() {
  const xp = state.totalXP;
  let result = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) { result = LEVELS[i]; break; }
  }
  return result;
}

function getNextLevel() {
  const curr = getLevel();
  const idx = LEVELS.findIndex(l => l.lvl === curr.lvl);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

function getLevelProgress() {
  const curr = getLevel();
  const next = getNextLevel();
  if (!next) return 100;
  return Math.min(100, Math.round(((state.totalXP - curr.xp) / (next.xp - curr.xp)) * 100));
}

function updateXPBar() {
  const curr = getLevel();
  const next = getNextLevel();
  const pct  = getLevelProgress();

  const fill  = document.getElementById('xp-bar-fill');
  const label = document.getElementById('xp-level-label');
  const num   = document.getElementById('xp-number');

  if (fill)  fill.style.width  = pct + '%';
  if (label) label.textContent = 'Lv.' + curr.lvl + ' ' + curr.name;
  if (num)   num.textContent   = state.totalXP + ' XP' + (next ? ' / ' + next.xp : ' — MAX');
}

// ── Toasts ────────────────────────────────────────────────────────────────────

let toastQueue   = [];
let toastRunning = false;

function showXPToast(msg) {
  enqueueToast(msg, 2000, 'xp');
}

function showAchievementToast(ach) {
  enqueueToast(ach.icon + '  ' + ach.name + ' — ' + ach.desc, 3500, 'ach');
}

function enqueueToast(msg, duration, type) {
  toastQueue.push({ msg, duration, type });
  drainToasts();
}

function drainToasts() {
  if (toastRunning || !toastQueue.length) return;
  toastRunning = true;
  const { msg, duration, type } = toastQueue.shift();
  const el = document.getElementById('toast');
  if (!el) { toastRunning = false; return; }
  el.innerHTML = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => {
    el.className = 'toast';
    setTimeout(() => { toastRunning = false; drainToasts(); }, 400);
  }, duration);
}

// ── Level-Up Overlay ──────────────────────────────────────────────────────────

function showLevelUpOverlay(levelData) {
  const overlay = document.getElementById('levelup-overlay');
  const name    = document.getElementById('levelup-name');
  const num     = document.getElementById('levelup-num');
  if (!overlay) return;
  if (name) name.textContent = levelData.name;
  if (num)  num.textContent  = 'LEVEL ' + levelData.lvl;
  overlay.classList.add('active');
  buildConfetti();
  setTimeout(() => overlay.classList.remove('active'), 4000);
}

function buildConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#7C5CFC','#a78bfa','#ffffff','#fbbf24','#34d399'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText =
      'left:' + (Math.random() * 100) + '%;' +
      'width:' + (4 + Math.random() * 6) + 'px;' +
      'height:' + (8 + Math.random() * 10) + 'px;' +
      'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
      'animation-delay:' + (Math.random() * 2) + 's;' +
      'animation-duration:' + (2 + Math.random() * 2) + 's;' +
      'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';';
    container.appendChild(p);
  }
}

// ── Achievements ──────────────────────────────────────────────────────────────

function checkAchievements() {
  const key     = todayKey();
  const monday  = getWeekMonday(key);

  const totalEx   = Object.values(state.completedExercises).filter(Boolean).length;
  const totalMeals = Object.values(state.completedMeals).filter(Boolean).length;

  const workoutKeys = Object.keys(state.completedWorkouts)
    .filter(k => state.completedWorkouts[k] && !k.includes('water') && !k.includes('fullday'));

  const pushWorkouts = workoutKeys.filter(k => {
    const i = parseInt(k.split('_').pop());
    return i === 0 || i === 3;
  }).length;

  const pullWorkouts = workoutKeys.filter(k => {
    const i = parseInt(k.split('_').pop());
    return i === 1 || i === 4;
  }).length;

  const legWorkouts = workoutKeys.filter(k => {
    const i = parseInt(k.split('_').pop());
    return i === 2;
  }).length;

  // Build this week's date keys
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday + 'T12:00:00');
    d.setDate(d.getDate() + i);
    const dk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return { dateKey: dk, idx: i, workoutKey: dk + '_' + i };
  });

  const thisWeekDoneIdxs = weekDays
    .filter(w => state.completedWorkouts[w.workoutKey])
    .map(w => w.idx);

  const weekWarrior    = thisWeekDoneIdxs.length >= 6;
  const hasGymWeek     = thisWeekDoneIdxs.some(i => i <= 2);
  const hasCaliWeek    = thisWeekDoneIdxs.some(i => i === 3 || i === 4);

  const todayWater  = state.waterGlasses[key] || 0;
  const todaySupps  = SUPPLEMENTS.filter((_, i) => state.completedSupps[key + '_' + i]).length;

  const rules = [
    ['first_rep',    () => totalEx >= 1],
    ['first_meal',   () => totalMeals >= 1],
    ['streak_3',     () => state.currentStreak >= 3],
    ['week_warrior', () => weekWarrior],
    ['hydrated',     () => todayWater >= 8],
    ['supp_stack',   () => todaySupps >= 4],
    ['push_king',    () => pushWorkouts >= 3],
    ['pull_master',  () => pullWorkouts >= 3],
    ['leg_hero',     () => legWorkouts >= 3],
    ['streak_7',     () => state.currentStreak >= 7],
    ['streak_14',    () => state.currentStreak >= 14],
    ['streak_30',    () => state.currentStreak >= 30],
    ['calorie_5',    () => state.calorieDaysHit.length >= 5],
    ['protein_7',    () => state.proteinDaysHit.length >= 7],
    ['hybrid_week',  () => hasGymWeek && hasCaliWeek],
    ['level_8',      () => getLevel().lvl >= 8],
  ];

  rules.forEach(([id, test]) => {
    if (!state.achievements.includes(id) && test()) {
      state.achievements.push(id);
      saveState();
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        awardXP(ach.xpBonus, 'Achievement: ' + ach.name);
        setTimeout(() => showAchievementToast(ach), 600);
      }
    }
  });
}

// ── Streak ────────────────────────────────────────────────────────────────────

function updateStreak(workoutDone) {
  if (!workoutDone) return;
  const today = todayKey();
  if (state.lastWorkoutDate === today) return;

  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yKey = yest.getFullYear() + '-' +
    String(yest.getMonth() + 1).padStart(2, '0') + '-' +
    String(yest.getDate()).padStart(2, '0');

  state.currentStreak = state.lastWorkoutDate === yKey ? state.currentStreak + 1 : 1;
  state.lastWorkoutDate = today;
  if (state.currentStreak > state.longestStreak) state.longestStreak = state.currentStreak;
  saveState();
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function startCountdown() {
  function tick() {
    const diff = GOAL_DATE - new Date();
    if (diff <= 0) {
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = pad(val); };

    set('cd-days',  days);
    set('cd-hours', hours);
    set('cd-mins',  mins);
    set('cd-secs',  secs);

    const goalDays = document.getElementById('cd-goal-days');
    if (goalDays) goalDays.textContent = pad(days);
  }
  tick();
  setInterval(tick, 1000);
}

// ── Tab Navigation ────────────────────────────────────────────────────────────

function initTabs() {
  const tabs   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
      if (target === 'progress') renderProgress();
      if (target === 'goals')    renderGoals();
      if (target === 'diet')     renderDiet();
      if (target === 'budget')   renderBudget();
      if (target === 'supps')    renderSupps();
    });
  });
}

// ── Today Tab ─────────────────────────────────────────────────────────────────

function renderToday() {
  const dayIdx  = todayDayIndex();
  const key     = todayKey();
  const workout = WORKOUTS[dayIdx];

  const greetEl = document.getElementById('greeting-text');
  if (greetEl) greetEl.textContent = getGreeting();

  const dayLblEl = document.getElementById('today-day-label');
  if (dayLblEl) dayLblEl.textContent = DAYS[dayIdx] + ' — ' + workout.label;

  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const qEl  = document.getElementById('quote-text');
  const qaEl = document.getElementById('quote-author');
  if (qEl)  qEl.textContent  = '"' + q.text + '"';
  if (qaEl) qaEl.textContent = '— ' + q.author;

  renderWeekGrid();
  renderExercises();
  renderMealsToday();
  renderWater();
  updateXPBar();
  renderStreakBadge();
}

function renderWeekGrid() {
  const key   = todayKey();
  const today = new Date();
  const dow   = today.getDay();
  const mon   = new Date(today);
  mon.setDate(today.getDate() + (dow === 0 ? -6 : 1 - dow));

  const grid = document.getElementById('week-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    const dk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const wKey = dk + '_' + i;

    const isToday  = dk === key;
    const done     = !!state.completedWorkouts[wKey];
    const isFuture = d > today && !isToday;
    const isRest   = i === 6;

    const cell = document.createElement('div');
    cell.className = ['wg-cell', isToday ? 'today' : '', done ? 'done' : '', isFuture ? 'future' : '', isRest ? 'rest' : ''].filter(Boolean).join(' ');
    cell.innerHTML = '<div class="wg-short">' + DAY_SHORT[i] + '</div><div class="wg-label">' + (done ? 'DONE' : DAY_LABEL[i]) + '</div>';
    grid.appendChild(cell);
  }
}

function renderExercises() {
  const dayIdx  = todayDayIndex();
  const key     = todayKey();
  const workout = WORKOUTS[dayIdx];
  const list    = document.getElementById('exercise-list');
  if (!list) return;
  list.innerHTML = '';

  const wkLbl = document.getElementById('workout-label');
  if (wkLbl) wkLbl.textContent = workout.label;

  if (dayIdx === 6) {
    list.innerHTML = '<p class="rest-msg">Rest day. Recover, hydrate, and sleep well.</p>';
    const barEl = document.getElementById('workout-progress-bar');
    const pctEl = document.getElementById('workout-progress-pct');
    const doneEl = document.getElementById('workout-done-count');
    if (barEl)  barEl.style.width  = '0%';
    if (pctEl)  pctEl.textContent  = '0%';
    if (doneEl) doneEl.textContent = '0/0';
    return;
  }

  let doneCount = 0;
  workout.exercises.forEach((ex, i) => {
    const exKey = key + '_' + i;
    const done  = !!state.completedExercises[exKey];
    if (done) doneCount++;

    const item = document.createElement('div');
    item.className = 'ex-item' + (done ? ' checked' : '');
    item.innerHTML =
      '<div class="ex-info"><span class="ex-name">' + ex.name + '</span><span class="ex-sets">' + ex.sets + '</span></div>' +
      '<button class="ex-check" data-key="' + exKey + '">' + (done ? '&#10003;' : '') + '</button>';

    item.querySelector('.ex-check').addEventListener('click', function () {
      const k = this.dataset.key;
      const wasDone = !!state.completedExercises[k];
      state.completedExercises[k] = !wasDone;
      saveState();
      if (!wasDone) awardXP(XP_VALUES.exercise, 'Exercise done');
      checkWorkoutComplete();
      checkFullDayComplete();
      checkAchievements();
      renderExercises();
    });

    list.appendChild(item);
  });

  const total = workout.exercises.length;
  const pct   = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const barEl  = document.getElementById('workout-progress-bar');
  const pctEl  = document.getElementById('workout-progress-pct');
  const doneEl = document.getElementById('workout-done-count');
  if (barEl)  barEl.style.width  = pct + '%';
  if (pctEl)  pctEl.textContent  = pct + '%';
  if (doneEl) doneEl.textContent = doneCount + '/' + total;
}

function checkWorkoutComplete() {
  const dayIdx  = todayDayIndex();
  const key     = todayKey();
  const workout = WORKOUTS[dayIdx];
  if (dayIdx === 6) return;

  const wKey  = key + '_' + dayIdx;
  const total = workout.exercises.length;
  const done  = workout.exercises.filter((_, i) => state.completedExercises[key + '_' + i]).length;

  if (done === total && total > 0 && !state.completedWorkouts[wKey]) {
    state.completedWorkouts[wKey] = true;
    saveState();
    awardXP(XP_VALUES.workoutComplete, 'Workout complete!');
    updateStreak(true);
    renderWeekGrid();
    renderStreakBadge();
  }
}

function checkFullDayComplete() {
  const dayIdx = todayDayIndex();
  const key    = todayKey();
  const fdKey  = key + '_fullday';
  if (state.completedWorkouts[fdKey]) return;

  const workout  = WORKOUTS[dayIdx];
  const exDone   = dayIdx === 6 || workout.exercises.every((_, i) => state.completedExercises[key + '_' + i]);
  const mealDone = MEALS.every((_, i) => state.completedMeals[key + '_' + i]);
  const suppDone = SUPPLEMENTS.every((_, i) => state.completedSupps[key + '_' + i]);
  const waterDone = (state.waterGlasses[key] || 0) >= 8;

  if (exDone && mealDone && suppDone && waterDone) {
    state.completedWorkouts[fdKey] = true;
    saveState();
    awardXP(XP_VALUES.fullDayComplete, 'Perfect day!');
  }
}

function renderStreakBadge() {
  const el = document.getElementById('streak-value');
  if (el) el.textContent = state.currentStreak;
  const el2 = document.getElementById('streak-longest');
  if (el2) el2.textContent = state.longestStreak;
}

// ── Meals ─────────────────────────────────────────────────────────────────────

function renderMealsToday() {
  const key  = todayKey();
  const list = document.getElementById('meals-list');
  if (!list) return;
  list.innerHTML = '';

  let totalCal = 0, totalProt = 0;

  MEALS.forEach((meal, i) => {
    const mKey = key + '_' + i;
    const done = !!state.completedMeals[mKey];
    if (done) { totalCal += meal.cal; totalProt += meal.prot; }

    const item = document.createElement('div');
    item.className = 'meal-item' + (done ? ' checked' : '');
    item.innerHTML =
      '<div class="meal-meta"><span class="meal-time">' + meal.time + '</span><span class="meal-name">' + meal.name + '</span></div>' +
      '<div class="meal-desc">' + meal.desc + '</div>' +
      '<div class="meal-macros"><span>' + meal.cal + ' kcal</span><span>' + meal.prot + 'g prot</span></div>' +
      '<button class="meal-check" data-key="' + mKey + '">' + (done ? '&#10003; Done' : 'Mark Done') + '</button>';

    item.querySelector('.meal-check').addEventListener('click', function () {
      const k = this.dataset.key;
      const wasDone = !!state.completedMeals[k];
      state.completedMeals[k] = !wasDone;
      saveState();
      if (!wasDone) awardXP(XP_VALUES.meal, 'Meal logged');
      updateNutritionTracking();
      checkFullDayComplete();
      checkAchievements();
      renderMealsToday();
    });

    list.appendChild(item);
  });

  updateNutritionBar(totalCal, totalProt);
}

function updateNutritionTracking() {
  const key = todayKey();
  let cal = 0, prot = 0;
  MEALS.forEach((meal, i) => {
    if (state.completedMeals[key + '_' + i]) { cal += meal.cal; prot += meal.prot; }
  });
  if (cal >= CALORIE_TARGET && !state.calorieDaysHit.includes(key)) {
    state.calorieDaysHit.push(key);
    saveState();
  }
  if (prot >= PROTEIN_TARGET && !state.proteinDaysHit.includes(key)) {
    state.proteinDaysHit.push(key);
    saveState();
  }
}

function updateNutritionBar(cal, prot) {
  const calPct  = Math.min(100, Math.round((cal  / TOTAL_CALORIES) * 100));
  const protPct = Math.min(100, Math.round((prot / TOTAL_PROTEIN)  * 100));

  const calBar  = document.getElementById('cal-bar');
  const protBar = document.getElementById('prot-bar');
  const calNum  = document.getElementById('cal-current');
  const protNum = document.getElementById('prot-current');

  if (calBar)  calBar.style.width  = calPct + '%';
  if (protBar) protBar.style.width = protPct + '%';
  if (calNum)  calNum.textContent  = cal  + ' / ' + TOTAL_CALORIES + ' kcal';
  if (protNum) protNum.textContent = prot + ' / ' + TOTAL_PROTEIN  + 'g protein';
}

// ── Water ─────────────────────────────────────────────────────────────────────

function renderWater() {
  const key     = todayKey();
  const glasses = state.waterGlasses[key] || 0;
  document.querySelectorAll('.water-btn').forEach((btn, i) => {
    btn.classList.toggle('filled', i < glasses);
  });
  const countEl = document.getElementById('water-count');
  if (countEl) countEl.textContent = glasses + '/8 glasses';

  if (glasses >= 8 && !state.completedWorkouts[key + '_water']) {
    state.completedWorkouts[key + '_water'] = true;
    saveState();
    awardXP(XP_VALUES.waterGoal, 'Water goal!');
    checkAchievements();
  }
}

function initWaterButtons() {
  document.querySelectorAll('.water-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const key     = todayKey();
      const current = state.waterGlasses[key] || 0;
      state.waterGlasses[key] = i < current ? i : i + 1;
      saveState();
      renderWater();
      checkFullDayComplete();
      checkAchievements();
    });
  });
}

// ── Progress Tab ──────────────────────────────────────────────────────────────

function renderProgress() {
  renderAchievements();
  renderLevelCard();
  renderStatsCards();
}

function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  if (!grid) return;
  grid.innerHTML = '';

  ACHIEVEMENTS.forEach(ach => {
    const unlocked = state.achievements.includes(ach.id);
    const div = document.createElement('div');
    div.className = 'ach-card' + (unlocked ? ' unlocked ' + ach.color : ' locked');
    div.innerHTML =
      '<div class="ach-icon">' + ach.icon + '</div>' +
      '<div class="ach-name">' + ach.name + '</div>' +
      '<div class="ach-desc">' + ach.desc + '</div>' +
      '<div class="ach-xp">+' + ach.xpBonus + ' XP</div>';
    grid.appendChild(div);
  });
}

function renderLevelCard() {
  const curr = getLevel();
  const next = getNextLevel();
  const pct  = getLevelProgress();

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('prog-level-name', curr.name);
  set('prog-level-num',  'Level ' + curr.lvl);
  set('prog-xp-total',   state.totalXP + ' XP total');
  set('prog-xp-next',    next ? 'Next: ' + next.name + ' at ' + next.xp + ' XP' : 'MAX LEVEL');

  const barEl = document.getElementById('prog-xp-bar');
  if (barEl) barEl.style.width = pct + '%';
}

function renderStatsCards() {
  const workoutCount = Object.keys(state.completedWorkouts)
    .filter(k => !k.includes('water') && !k.includes('fullday') && state.completedWorkouts[k]).length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-workouts',     workoutCount);
  set('stat-exercises',    Object.values(state.completedExercises).filter(Boolean).length);
  set('stat-meals',        Object.values(state.completedMeals).filter(Boolean).length);
  set('stat-streak',       state.currentStreak);
  set('stat-longest',      state.longestStreak);
  set('stat-cal-days',     state.calorieDaysHit.length);
  set('stat-prot-days',    state.proteinDaysHit.length);
  set('stat-achievements', state.achievements.length + ' / ' + ACHIEVEMENTS.length);
}

// ── Goals Tab ─────────────────────────────────────────────────────────────────

function renderGoals() {
  renderSkillTree();
  renderStrengthGoals();
}

function renderSkillTree() {
  ['push', 'pull', 'core'].forEach(path => {
    const container = document.getElementById('skill-path-' + path);
    if (!container) return;
    container.innerHTML = '';
    SKILL_TREE[path].nodes.forEach((node, i) => {
      const isActive = i === 0;
      const isGoal   = i === SKILL_TREE[path].nodes.length - 1;
      const div = document.createElement('div');
      div.className = 'skill-node' + (isActive ? ' active' : ' future') + (isGoal ? ' goal' : '');
      div.innerHTML = '<div class="skill-node-name">' + node.name + '</div><div class="skill-node-tag">' + node.tag + '</div>';
      container.appendChild(div);
      if (!isGoal) {
        const arr = document.createElement('div');
        arr.className = 'skill-arrow';
        arr.innerHTML = '&#8594;';
        container.appendChild(arr);
      }
    });
  });
}

function renderStrengthGoals() {
  ['benchPress', 'squat', 'deadlift', 'pullups'].forEach(field => {
    const input = document.getElementById('goal-' + field);
    if (!input) return;
    if (state.strengthGoals[field]) input.value = state.strengthGoals[field];
    input.addEventListener('change', function () {
      state.strengthGoals[field] = this.value;
      saveState();
    });
  });
}

// ── Diet Tab ──────────────────────────────────────────────────────────────────

function renderDiet() {
  const list = document.getElementById('diet-full-list');
  if (!list) return;
  list.innerHTML = '';

  MEALS.forEach(meal => {
    const row = document.createElement('div');
    row.className = 'diet-row';
    row.innerHTML =
      '<div class="diet-row-header"><span class="diet-meal-name">' + meal.name + '</span><span class="diet-meal-time">' + meal.time + '</span></div>' +
      '<div class="diet-row-desc">' + meal.desc + '</div>' +
      '<div class="diet-macros">' +
      '<span class="macro-chip cal">' + meal.cal + ' kcal</span>' +
      '<span class="macro-chip prot">' + meal.prot + 'g P</span>' +
      '<span class="macro-chip carb">' + meal.carbs + 'g C</span>' +
      '<span class="macro-chip fat">' + meal.fat + 'g F</span>' +
      '</div>';
    list.appendChild(row);
  });

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('diet-total-cal',  TOTAL_CALORIES + ' kcal / day');
  set('diet-total-prot', TOTAL_PROTEIN  + 'g protein / day');
}

// ── Budget Tab ────────────────────────────────────────────────────────────────

function renderBudget() {
  const tbody = document.getElementById('budget-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  DIET_COSTS.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + item.item + '</td>' +
      '<td class="num">Rs. ' + item.daily + '</td>' +
      '<td class="num">Rs. ' + item.monthly + '</td>';
    tbody.appendChild(tr);
  });

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('budget-daily-total',   'Rs. ' + DAILY_BUDGET   + ' / day');
  set('budget-monthly-total', 'Rs. ' + MONTHLY_BUDGET + ' / month');
}

// ── Supps Tab ─────────────────────────────────────────────────────────────────

function renderSupps() {
  const key  = todayKey();
  const list = document.getElementById('supps-list');
  if (!list) return;
  list.innerHTML = '';

  SUPPLEMENTS.forEach((supp, i) => {
    const sKey = key + '_' + i;
    const done = !!state.completedSupps[sKey];

    const item = document.createElement('div');
    item.className = 'supp-item' + (done ? ' checked' : '');
    item.innerHTML =
      '<div class="supp-info"><span class="supp-name">' + supp.name + '</span>' +
      '<span class="supp-dose">' + supp.dose + '</span>' +
      '<span class="supp-time">' + supp.time + '</span></div>' +
      '<button class="supp-check" data-key="' + sKey + '">' + (done ? '&#10003; Taken' : 'Mark Taken') + '</button>';

    item.querySelector('.supp-check').addEventListener('click', function () {
      const k = this.dataset.key;
      const wasDone = !!state.completedSupps[k];
      state.completedSupps[k] = !wasDone;
      saveState();
      if (!wasDone) awardXP(XP_VALUES.supplement, 'Supplement taken');
      checkFullDayComplete();
      checkAchievements();
      renderSupps();
    });

    list.appendChild(item);
  });
}

// ── Reset ─────────────────────────────────────────────────────────────────────

function initReset() {
  const btn = document.getElementById('reset-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('Reset ALL data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      renderToday();
      showXPToast('Data reset');
    }
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initWaterButtons();
  initReset();
  renderToday();
  startCountdown();

  const overlay = document.getElementById('levelup-overlay');
  if (overlay) overlay.addEventListener('click', () => overlay.classList.remove('active'));
});
