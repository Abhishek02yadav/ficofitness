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

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 11) return 'Rise and grind, Abhishek.';
  if (h >= 11 && h < 17) return 'Stay locked in.';
  if (h >= 17 && h < 21) return 'Evening session. Finish strong.';
  return 'Recovery mode. Rest well.';
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

  const greetEl = document.getElementById('lt-greeting');
  if (greetEl) greetEl.textContent = getGreeting();

  const dayLblEl = document.getElementById('today-day-label');
  if (dayLblEl) dayLblEl.textContent = DAYS[dayIdx] + ' — ' + workout.label;

  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const qEl  = document.getElementById('lt-quote-text');
  const qaEl = document.getElementById('lt-quote-author');
  if (qEl)  qEl.textContent  = '"' + q.text + '"';
  if (qaEl) qaEl.textContent = '— ' + q.author;

  renderWeekGrid();
  renderExercises();
  renderMealsToday();
  renderWater();
  updateXPBar();
  renderStreakBadge();
  renderSteps();
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
      if (!wasDone) {
        awardXP(XP_VALUES.exercise, 'Exercise done');
        const rtWrap = document.getElementById('rest-timer-wrap');
        if (rtWrap && typeof window.setRestTimer === 'function') {
          rtWrap.style.display = 'block';
          window.setRestTimer(window._restDuration || 60);
        }
      } else {
        state.totalXP = Math.max(0, state.totalXP - XP_VALUES.exercise);
        updateXPBar();
      }
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
  } else if (done < total && state.completedWorkouts[wKey]) {
    state.completedWorkouts[wKey] = false;
    saveState();
    state.totalXP = Math.max(0, state.totalXP - XP_VALUES.workoutComplete);
    updateXPBar();
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
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('streak-value',   state.currentStreak);
  set('streak-longest', state.longestStreak);
  set('mob-streak-val', state.currentStreak);
  set('stat-streak',    state.currentStreak);
  set('stat-longest',   state.longestStreak);
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
      if (!wasDone) {
        awardXP(XP_VALUES.meal, 'Meal logged');
      } else {
        state.totalXP = Math.max(0, state.totalXP - XP_VALUES.meal);
        updateXPBar();
      }
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
      if (!wasDone) {
        awardXP(XP_VALUES.supplement, 'Supplement taken');
      } else {
        state.totalXP = Math.max(0, state.totalXP - XP_VALUES.supplement);
        updateXPBar();
      }
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

// ═══════════ LIGHTNING TIMER ═══════════

(function initLightningTimer() {

  const TARGET   = new Date('2026-09-20T00:00:00');
  const TOTAL    = 86;
  let lastMin    = -1;
  let phase      = 'idle';
  let boltPts    = [], boltBranches = [], boltLife = 0;
  let particles  = [];
  let flashAlpha = 0;

  // Canvas setup
  const canvas = document.getElementById('lt-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    const wrap = document.getElementById('lt-wrap');
    if (!wrap) return;
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Countdown update ──
  function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }

  function updateLTTimer() {
    const now  = new Date();
    const diff = TARGET - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);

    const dEl = document.getElementById('lt-days');
    const hEl = document.getElementById('lt-hours');
    const mEl = document.getElementById('lt-mins');
    if (dEl) dEl.textContent = pad(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);

    const pct = Math.min(98, Math.max(1, Math.round(((TOTAL - d) / TOTAL) * 100)));
    const pf  = document.getElementById('lt-prog-fill');
    const pl  = document.getElementById('lt-pct');
    if (pf) pf.style.width = pct + '%';
    if (pl) pl.textContent = pct + '%';

    if (m !== lastMin) { lastMin = m; triggerStrike(); }
  }

  // ── Lightning bolt generation ──
  function makeBolt(x1, y1, x2, y2, rough, depth) {
    if (depth === 0 || Math.abs(y2 - y1) < 3) return [[x1,y1],[x2,y2]];
    const mx = (x1+x2)/2, my = (y1+y2)/2;
    const len = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const off = (Math.random() - .5) * len * rough;
    const nx = -(y2-y1)/len, ny = (x2-x1)/len;
    return [
      ...makeBolt(x1,y1, mx+nx*off, my+ny*off, rough*.72, depth-1),
      ...makeBolt(mx+nx*off, my+ny*off, x2,y2, rough*.72, depth-1),
    ];
  }

  // ── Get timer block rect relative to canvas ──
  function getTimerRect() {
    const wrap  = document.getElementById('lt-wrap');
    const block = document.getElementById('lt-timer-block');
    if (!wrap || !block) return { cx: W/2, cy: H/2, w: 300, h: 80 };
    const wr = wrap.getBoundingClientRect();
    const br = block.getBoundingClientRect();
    return {
      cx: (br.left - wr.left) + br.width / 2,
      cy: (br.top  - wr.top)  + br.height / 2,
      w:  br.width,
      h:  br.height,
    };
  }

  // ── Spawn shatter particles ──
  function spawnParticles(cx, cy, tw, th) {
    particles = [];
    const glyphs = ['8','5',':','1','4','2','0','3','D','H','M'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = .5 + Math.random() * 6;
      const isGlyph = Math.random() > .45;
      particles.push({
        x:   cx + (Math.random() - .5) * tw * .9,
        y:   cy + (Math.random() - .5) * th * .7,
        vx:  Math.cos(angle) * speed,
        vy:  Math.sin(angle) * speed - Math.random() * 2,
        life: 1,
        decay: .012 + Math.random() * .018,
        size: isGlyph ? 14 + Math.random() * 22 : 2 + Math.random() * 4,
        isGlyph,
        char: glyphs[Math.floor(Math.random() * glyphs.length)],
        color: Math.random() > .5 ? '#C9B8FF' : Math.random() > .5 ? '#7C5CFC' : '#FF6B35',
        rot:  Math.random() * Math.PI * 2,
        rotV: (Math.random() - .5) * .15,
        reforming: false,
        tx: 0, ty: 0,
      });
    }
  }

  function startReform(cx, cy) {
    particles.forEach(p => {
      p.reforming = true;
      p.tx = cx + (Math.random() - .5) * 80;
      p.ty = cy + (Math.random() - .5) * 24;
      p.decay = .006;
    });
  }

  // ── Main trigger ──
  function triggerStrike() {
    if (phase !== 'idle') return;
    phase = 'descend';

    const rect = getTimerRect();
    const startX = rect.cx + (Math.random() - .5) * 50;

    boltPts      = makeBolt(startX, 0, rect.cx, rect.cy, .55, 7);
    boltBranches = [];
    boltLife     = 0;

    for (let i = 4; i < boltPts.length - 4; i += 5) {
      if (Math.random() > .5) {
        const bx = boltPts[i][0], by = boltPts[i][1];
        boltBranches.push(
          makeBolt(bx, by, bx + (Math.random() - .5) * 90, by + 30 + Math.random() * 60, .45, 4)
        );
      }
    }

    // Impact after bolt lingers ~900ms
    setTimeout(() => {
      phase      = 'impact';
      flashAlpha = 1;
      const tb = document.getElementById('lt-timer-block');
      if (tb) tb.style.opacity = '0';
      spawnParticles(rect.cx, rect.cy, rect.w, rect.h);

      setTimeout(() => {
        phase = 'reform';
        startReform(rect.cx, rect.cy);
        setTimeout(() => {
          updateLTTimer();
          const tb2 = document.getElementById('lt-timer-block');
          if (tb2) tb2.style.opacity = '1';
          particles = [];
          phase     = 'idle';
        }, 800);
      }, 700);
    }, 900);
  }

  // ── Render loop ──
  function render() {
    ctx.clearRect(0, 0, W, H);

    // flash overlay
    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(180,120,255,${flashAlpha * .45})`;
      ctx.fillRect(0, 0, W, H);
      flashAlpha = Math.max(0, flashAlpha - .032);
    }

    // bolt
    if (phase === 'descend' && boltPts.length > 1) {
      boltLife++;
      const revealFrac = Math.min(1, boltLife / 20);
      const showCount  = Math.max(2, Math.floor(boltPts.length * revealFrac));
      const pts        = boltPts.slice(0, showCount);
      const flicker    = .75 + Math.sin(boltLife * .8) * .25;

      // outer glow
      ctx.save();
      ctx.strokeStyle = `rgba(180,140,255,${flicker * .4})`;
      ctx.lineWidth = 10; ctx.shadowBlur = 28; ctx.shadowColor = '#9B82FD';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      // mid
      ctx.strokeStyle = `rgba(220,190,255,${flicker * .65})`;
      ctx.lineWidth = 3.5; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      // core
      ctx.strokeStyle = `rgba(255,255,255,${flicker})`;
      ctx.lineWidth = 1.5; ctx.shadowBlur = 6; ctx.shadowColor = '#fff';
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      ctx.restore();

      // branches
      if (revealFrac > .6) {
        boltBranches.forEach(bp => {
          if (bp.length < 2) return;
          ctx.save();
          ctx.strokeStyle = `rgba(200,170,255,${flicker * .5})`;
          ctx.lineWidth = 1.2; ctx.shadowBlur = 10; ctx.shadowColor = '#9B82FD';
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(bp[0][0], bp[0][1]);
          for (let i = 1; i < bp.length; i++) ctx.lineTo(bp[i][0], bp[i][1]);
          ctx.stroke();
          ctx.restore();
        });
      }

      // tip glow
      if (revealFrac > .8) {
        const tip = pts[pts.length - 1];
        ctx.save();
        const g = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 42);
        g.addColorStop(0,  `rgba(255,255,255,${flicker * .55})`);
        g.addColorStop(.4, `rgba(160,100,255,${flicker * .28})`);
        g.addColorStop(1,  'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(tip[0], tip[1], 42, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
    }

    // particles
    if ((phase === 'impact' || phase === 'reform') && particles.length) {
      particles.forEach(p => {
        if (p.life <= 0) return;
        if (p.reforming) {
          p.vx += (p.tx - p.x) * .07;
          p.vy += (p.ty - p.y) * .07;
          p.vx *= .82; p.vy *= .82;
        } else {
          p.vy += .1;
          p.vx *= .98;
        }
        p.x += p.vx; p.y += p.vy;
        p.rot += p.rotV;
        p.life -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.shadowBlur = 8; ctx.shadowColor = p.color;
        if (p.isGlyph) {
          ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.font = `700 ${p.size}px 'JetBrains Mono',monospace`;
          ctx.fillStyle = p.color;
          ctx.fillText(p.char, -p.size * .3, p.size * .35);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    requestAnimationFrame(render);
  }

  // ── Init ──
  updateLTTimer();
  setInterval(updateLTTimer, 30000);
  setTimeout(triggerStrike, 1200);
  render();

})();

// ═══════════ END LIGHTNING TIMER ═══════════

// ═══════════ REST TIMER ═══════════
(function initRestTimer() {
  let restDuration = 60;
  let restRemaining = 60;
  let restRunning = false;
  let restInterval = null;
  const CIRCUMFERENCE = 2 * Math.PI * 42;

  function updateRestDisplay() {
    const num  = document.getElementById('rest-timer-num');
    const ring = document.getElementById('rest-ring-fill');
    if (!num || !ring) return;
    num.textContent = restRemaining;
    const progress = restRemaining / restDuration;
    const offset = CIRCUMFERENCE * (1 - progress);
    ring.setAttribute('stroke-dasharray', CIRCUMFERENCE);
    ring.setAttribute('stroke-dashoffset', offset);
    ring.style.stroke = progress > 0.5 ? 'var(--go)' : progress > 0.25 ? 'var(--warn)' : 'var(--fire)';
  }

  window.setRestTimer = function(secs) {
    clearInterval(restInterval);
    restRunning = false;
    restDuration = secs;
    restRemaining = secs;
    window._restDuration = secs;
    updateRestDisplay();
    document.querySelectorAll('.rest-preset-btn').forEach(b => {
      b.classList.toggle('active',
        (b.textContent === '2min' && secs === 120) ||
        (b.textContent !== '2min' && parseInt(b.textContent) === secs));
    });
    const btn = document.getElementById('rest-start-btn');
    if (btn) { btn.textContent = 'Start Rest'; btn.classList.remove('running'); }
  };

  window.toggleRestTimer = function() {
    const btn = document.getElementById('rest-start-btn');
    if (restRunning) {
      clearInterval(restInterval);
      restRunning = false;
      if (btn) { btn.textContent = 'Resume'; btn.classList.remove('running'); }
    } else {
      restRunning = true;
      if (btn) { btn.textContent = 'Pause'; btn.classList.add('running'); }
      restInterval = setInterval(() => {
        restRemaining--;
        updateRestDisplay();
        if (restRemaining <= 0) {
          clearInterval(restInterval);
          restRunning = false;
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          const wrap = document.getElementById('rest-timer-wrap');
          if (wrap) {
            wrap.style.borderColor = 'var(--go)';
            wrap.style.boxShadow = '0 0 20px var(--go-border)';
            setTimeout(() => { wrap.style.borderColor = ''; wrap.style.boxShadow = ''; }, 2000);
          }
          if (btn) { btn.textContent = 'Done! Start Again'; btn.classList.remove('running'); }
          restRemaining = restDuration;
          updateRestDisplay();
        }
      }, 1000);
    }
  };

  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'rest-timer-close') {
      clearInterval(restInterval);
      restRunning = false;
      const wrap = document.getElementById('rest-timer-wrap');
      if (wrap) wrap.style.display = 'none';
    }
  });

  updateRestDisplay();
})();
// ═══════════ END REST TIMER ═══════════

// ═══════════ BMI CALCULATOR ═══════════
window.calcBMI = function() {
  const w = parseFloat(document.getElementById('bmi-weight').value);
  const h = parseFloat(document.getElementById('bmi-height').value) / 100;
  if (!w || !h || h <= 0) return;
  const bmi = w / (h * h);
  const bmiRound = bmi.toFixed(1);

  document.getElementById('bmi-num').textContent = bmiRound;

  let cat, color, pct;
  if (bmi < 18.5)    { cat = 'Underweight'; color = 'var(--info)';  pct = (bmi / 18.5) * 12; }
  else if (bmi < 25) { cat = 'Normal';      color = 'var(--go)';    pct = 12 + ((bmi-18.5)/6.4)*25; }
  else if (bmi < 30) { cat = 'Overweight';  color = 'var(--warn)';  pct = 37 + ((bmi-25)/5)*25; }
  else               { cat = 'Obese';        color = 'var(--fire)';  pct = Math.min(95, 62 + ((bmi-30)/10)*33); }

  const catEl = document.getElementById('bmi-category');
  const catRingEl = document.getElementById('bmi-cat-ring');
  if (catEl) catEl.textContent = cat + ' — BMI ' + bmiRound;
  if (catRingEl) catRingEl.textContent = cat;

  const ring = document.getElementById('bmi-ring-fill');
  if (ring) {
    ring.style.stroke = color;
    ring.setAttribute('stroke-dashoffset', 314 * (1 - Math.min(1, bmi / 35)));
  }

  const ind = document.getElementById('bmi-indicator');
  if (ind) { ind.style.display = 'block'; ind.style.left = pct + '%'; }

  state.currentBMI = parseFloat(bmiRound);
  saveState();
};
// ═══════════ END BMI ═══════════

// ═══════════ WEIGHT LOG ═══════════
window.logWeight = function() {
  const val = parseFloat(document.getElementById('weight-input').value);
  if (!val || val < 30 || val > 300) return;
  if (!state.weightLog) state.weightLog = {};
  state.weightLog[todayKey()] = val;
  saveState();
  renderWeightChart();
  renderWeightStats();
  showXPToast('+5 XP  Weight logged!');
};

function renderWeightStats() {
  if (!state.weightLog) return;
  const entries = Object.entries(state.weightLog).sort((a, b) => a[0].localeCompare(b[0]));
  if (!entries.length) return;
  const first = entries[0][1];
  const last  = entries[entries.length - 1][1];
  const change = (last - first).toFixed(1);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('wstat-start',   first + ' kg');
  set('wstat-current', last + ' kg');
  const el3 = document.getElementById('wstat-change');
  if (el3) {
    el3.textContent = (change > 0 ? '+' : '') + change + ' kg';
    el3.style.color = change < 0 ? 'var(--go)' : change > 0 ? 'var(--fire)' : 'var(--t2)';
  }
}

function renderWeightChart() {
  const canvas = document.getElementById('weight-chart');
  if (!canvas) return;
  const ctx2 = canvas.getContext('2d');
  const wrap = canvas.parentElement;
  canvas.width  = wrap.offsetWidth - 24;
  canvas.height = 80;
  const W2 = canvas.width, H2 = canvas.height;
  ctx2.clearRect(0, 0, W2, H2);

  if (!state.weightLog) return;
  const entries = Object.entries(state.weightLog).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length < 2) {
    ctx2.fillStyle = 'rgba(139,137,168,0.3)';
    ctx2.font = '12px Inter, sans-serif';
    ctx2.textAlign = 'center';
    ctx2.fillText(entries.length < 1 ? 'No weight logged yet.' : 'Log at least 2 entries to see chart', W2/2, H2/2);
    return;
  }

  const vals = entries.map(e => e[1]);
  const minV = Math.min(...vals) - 1;
  const maxV = Math.max(...vals) + 1;
  const pad  = 10;
  const getX = i => pad + (i / (vals.length - 1)) * (W2 - pad * 2);
  const getY = v => pad + (1 - (v - minV) / (maxV - minV)) * (H2 - pad * 2);

  ctx2.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx2.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const y = pad + (H2 - pad * 2) * (i / 3);
    ctx2.beginPath(); ctx2.moveTo(0, y); ctx2.lineTo(W2, y); ctx2.stroke();
  }

  const grad = ctx2.createLinearGradient(0, 0, 0, H2);
  grad.addColorStop(0, 'rgba(124,92,252,0.3)');
  grad.addColorStop(1, 'rgba(124,92,252,0)');

  ctx2.beginPath();
  ctx2.moveTo(getX(0), H2);
  vals.forEach((v, i) => ctx2.lineTo(getX(i), getY(v)));
  ctx2.lineTo(getX(vals.length - 1), H2);
  ctx2.closePath();
  ctx2.fillStyle = grad;
  ctx2.fill();

  ctx2.beginPath();
  ctx2.strokeStyle = '#7C5CFC';
  ctx2.lineWidth = 2;
  ctx2.lineJoin = 'round';
  vals.forEach((v, i) => i === 0 ? ctx2.moveTo(getX(i), getY(v)) : ctx2.lineTo(getX(i), getY(v)));
  ctx2.stroke();

  vals.forEach((v, i) => {
    ctx2.beginPath();
    ctx2.arc(getX(i), getY(v), 3, 0, Math.PI * 2);
    ctx2.fillStyle = '#9B82FD';
    ctx2.shadowBlur = 6; ctx2.shadowColor = '#7C5CFC';
    ctx2.fill();
    ctx2.shadowBlur = 0;
  });
}

function initWeightLog() {
  renderWeightChart();
  renderWeightStats();
}
initWeightLog();
// ═══════════ END WEIGHT LOG ═══════════

// ═══════════ STEPS TRACKER ═══════════
function getSteps() {
  if (!state.stepsLog) state.stepsLog = {};
  return state.stepsLog[todayKey()] || 0;
}

function saveSteps(val) {
  if (!state.stepsLog) state.stepsLog = {};
  const prev = getSteps();
  state.stepsLog[todayKey()] = Math.max(0, Math.min(99999, val));
  if (prev < 10000 && val >= 10000) {
    awardXP(10, '10k Steps!');
  }
  saveState();
  renderSteps();
}

window.addSteps   = function(n) { saveSteps(getSteps() + n); };
window.setSteps   = function() { const v = parseInt(document.getElementById('steps-input').value); if (!isNaN(v)) saveSteps(v); };
window.resetSteps = function() { saveSteps(0); };

function renderSteps() {
  const steps = getSteps();
  const pct   = Math.min(100, Math.round(steps / 10000 * 100));
  const CIRC  = 213.6;
  const el    = document.getElementById('steps-display');
  const ring  = document.getElementById('steps-ring');
  const pctEl = document.getElementById('steps-pct');
  if (el)    el.textContent = steps.toLocaleString('en-IN');
  if (ring)  {
    ring.setAttribute('stroke-dashoffset', CIRC * (1 - pct / 100));
    ring.style.stroke = pct >= 100 ? 'var(--go)' : pct >= 50 ? 'var(--p)' : 'var(--fire)';
  }
  if (pctEl) pctEl.textContent = pct + '%';
}

renderSteps();
// ═══════════ END STEPS TRACKER ═══════════

// ═══════════ SCROLL REVEAL ═══════════
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.card, .stat-tile').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.35s ease ' + (i * 0.04) + 's, transform 0.35s ease ' + (i * 0.04) + 's';
    observer.observe(el);
  });
})();
// ═══════════ END SCROLL REVEAL ═══════════
